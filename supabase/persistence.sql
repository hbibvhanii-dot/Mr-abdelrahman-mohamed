-- Shared data persistence. Apply after subscriptions.sql.
-- platform_data remains as a rollback snapshot for non-student platform content.

alter table public.students
  add column if not exists legacy_student_id text unique,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.student_codes
  add column if not exists legacy_code_id text unique,
  add column if not exists code_display text;

drop function if exists public.migrate_platform_data();
create or replace function public.migrate_platform_data(input_payload jsonb default null)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
  student_item jsonb;
  code_item jsonb;
  student_row public.students%rowtype;
begin
  select coalesce(input_payload, p.payload) into payload
    from public.platform_data p where p.id = 'main' for share;
  if input_payload is not null then payload := input_payload; end if;
  if payload is null then return jsonb_build_object('students', 0, 'codes', 0); end if;

  for student_item in select value from jsonb_array_elements(coalesce(payload->'students', '[]'::jsonb))
  loop
    if nullif(student_item->>'id', '') is null or nullif(student_item->>'name', '') is null then continue; end if;
    insert into public.students (name, email, phone, legacy_student_id, metadata)
    values (
      student_item->>'name',
      nullif(student_item->>'email', ''),
      nullif(student_item->>'phone', ''),
      student_item->>'id',
      student_item - 'id' - 'name' - 'email' - 'phone'
    )
    on conflict (legacy_student_id) do update set
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      metadata = public.students.metadata || excluded.metadata;
  end loop;

  for code_item in select value from jsonb_array_elements(coalesce(payload->'codes', '[]'::jsonb))
  loop
    select * into student_row
      from public.students
     where legacy_student_id = nullif(code_item->>'studentId', '');
    if student_row.id is null or nullif(code_item->>'code', '') is null then continue; end if;
    insert into public.student_codes (student_id, code_hash, code_display, active, legacy_code_id, created_at)
    values (
      student_row.id,
      encode(digest(upper(trim(code_item->>'code')), 'sha256'), 'hex'),
      upper(trim(code_item->>'code')),
      coalesce(code_item->>'status', 'active') = 'active',
      nullif(code_item->>'id', ''),
      case
        when code_item->>'createdAt' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          then (code_item->>'createdAt')::timestamptz
        else now()
      end
    )
    on conflict (legacy_code_id) do update set
      student_id = excluded.student_id,
      code_hash = excluded.code_hash,
      code_display = excluded.code_display,
      active = excluded.active;
  end loop;

  return jsonb_build_object(
    'students', (select count(*) from public.students where legacy_student_id is not null),
    'codes', (select count(*) from public.student_codes where legacy_code_id is not null)
  );
end;
$$;

create or replace function public.list_platform_students()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'students', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'name', s.name, 'email', s.email, 'phone', s.phone,
        'metadata', s.metadata, 'createdAt', s.created_at
      ) order by s.created_at), '[]'::jsonb)
      from public.students s
  ),
    'codes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'code', c.code_display, 'studentId', c.student_id,
        'studentName', s.name, 'status', case when c.active then 'active' else 'disabled' end,
        'createdAt', c.created_at
      ) order by c.created_at), '[]'::jsonb)
      from public.student_codes c
      join public.students s on s.id = c.student_id
  ));
$$;

create or replace function public.load_platform_payload()
returns jsonb
language sql security definer set search_path = public
as $$
  select jsonb_build_object(
    'payload', coalesce((select payload from public.platform_data where id = 'main'), '{}'::jsonb),
    'updated_at', (select updated_at from public.platform_data where id = 'main')
  );
$$;

create or replace function public.save_platform_payload(expected_updated_at timestamptz, next_payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare saved public.platform_data%rowtype;
begin
  update public.platform_data
     set payload = next_payload, updated_at = now()
   where id = 'main'
     and (expected_updated_at is null or updated_at = expected_updated_at)
  returning * into saved;
  if saved.id is null then
    raise exception 'platform_data_conflict';
  end if;
  return jsonb_build_object('id', saved.id, 'updated_at', saved.updated_at);
end;
$$;

create or replace function public.create_platform_student(input_data jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare
  student_row public.students%rowtype;
  code_value text := nullif(upper(trim(input_data->>'code')), '');
  code_row public.student_codes%rowtype;
begin
  insert into public.students (name, email, metadata)
  values (
    input_data->>'name', nullif(input_data->>'email', ''),
    jsonb_build_object('level', input_data->>'level', 'status', 'active', 'progress', 0, 'lastActivity', 'الآن',
      'personalFile', jsonb_build_object('examResults', '[]'::jsonb, 'attendance', '[]'::jsonb, 'monthlyFees', '[]'::jsonb, 'purchasedCourses', '[]'::jsonb))
  )
  returning * into student_row;

  if code_value is not null then
    insert into public.student_codes (student_id, code_hash, code_display)
    values (student_row.id, encode(digest(code_value, 'sha256'), 'hex'), code_value)
    returning * into code_row;
  end if;

  return jsonb_build_object('student_id', student_row.id, 'code_id', code_row.id);
end;
$$;

create or replace function public.update_platform_student(student_uuid uuid, input_data jsonb)
returns void
language sql security definer set search_path = public
as $$
  update public.students
     set name = coalesce(input_data->>'name', name),
         email = case when input_data ? 'email' then nullif(input_data->>'email', '') else email end,
         phone = case when input_data ? 'phone' then nullif(input_data->>'phone', '') else phone end,
         metadata = coalesce(input_data->'metadata', metadata)
   where id = student_uuid;
$$;

create or replace function public.delete_platform_student(student_uuid uuid)
returns void
language sql security definer set search_path = public
as $$ delete from public.students where id = student_uuid; $$;

create or replace function public.create_platform_code(code_value text, student_uuid uuid default null)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare code_row public.student_codes%rowtype;
begin
  insert into public.student_codes (student_id, code_hash, code_display)
  values (student_uuid, encode(digest(upper(trim(code_value)), 'sha256'), 'hex'), upper(trim(code_value)))
  returning * into code_row;
  return jsonb_build_object('id', code_row.id, 'code', code_row.code_display, 'studentId', code_row.student_id, 'status', case when code_row.active then 'active' else 'disabled' end, 'createdAt', code_row.created_at);
end;
$$;

create or replace function public.assign_platform_code(code_uuid uuid, student_uuid uuid)
returns void language sql security definer set search_path = public
as $$ update public.student_codes set student_id = student_uuid where id = code_uuid; $$;

create or replace function public.toggle_platform_code(code_uuid uuid)
returns void language sql security definer set search_path = public
as $$ update public.student_codes set active = not active where id = code_uuid; $$;

create or replace function public.delete_platform_code(code_uuid uuid)
returns void language sql security definer set search_path = public
as $$ delete from public.student_codes where id = code_uuid; $$;

revoke all on public.students, public.student_codes, public.platform_data from anon, authenticated;
revoke all on function public.migrate_platform_data(jsonb) from public;
revoke all on function public.list_platform_students() from public;
revoke all on function public.load_platform_payload() from public;
revoke all on function public.save_platform_payload(timestamptz, jsonb) from public;
revoke all on function public.create_platform_student(jsonb) from public;
revoke all on function public.update_platform_student(uuid, jsonb) from public;
revoke all on function public.delete_platform_student(uuid) from public;
revoke all on function public.create_platform_code(text, uuid) from public;
revoke all on function public.assign_platform_code(uuid, uuid) from public;
revoke all on function public.toggle_platform_code(uuid) from public;
revoke all on function public.delete_platform_code(uuid) from public;

-- Until Supabase Auth is added for teachers, these narrowly-scoped RPCs are
-- the only browser-accessible management surface. Tables remain inaccessible.
grant execute on function public.migrate_platform_data(jsonb) to anon, authenticated;
grant execute on function public.list_platform_students() to anon, authenticated;
grant execute on function public.load_platform_payload() to anon, authenticated;
grant execute on function public.save_platform_payload(timestamptz, jsonb) to anon, authenticated;
grant execute on function public.create_platform_student(jsonb) to anon, authenticated;
grant execute on function public.update_platform_student(uuid, jsonb) to anon, authenticated;
grant execute on function public.delete_platform_student(uuid) to anon, authenticated;
grant execute on function public.create_platform_code(text, uuid) to anon, authenticated;
grant execute on function public.assign_platform_code(uuid, uuid) to anon, authenticated;
grant execute on function public.toggle_platform_code(uuid) to anon, authenticated;
grant execute on function public.delete_platform_code(uuid) to anon, authenticated;
