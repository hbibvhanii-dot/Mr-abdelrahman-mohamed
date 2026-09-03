-- Payment foundation. Apply after schema.sql. Edge Functions use the service-role key.
create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.student_codes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  code_hash text not null unique,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'EGP' check (currency ~ '^[A-Z]{3}$'),
  duration_days integer not null check (duration_days > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  code_id uuid references public.student_codes(id),
  plan_id uuid not null references public.plans(id),
  idempotency_key text not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled')),
  gateway text not null default 'paymob',
  gateway_order_id text,
  gateway_transaction_id text unique,
  checkout_token text,
  checkout_url text,
  gateway_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, plan_id, idempotency_key)
);

create index if not exists payments_code_idx on public.payments(code_id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  code_id uuid references public.student_codes(id),
  plan_id uuid not null references public.plans(id),
  payment_id uuid not null unique references public.payments(id),
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.subscriptions add column if not exists code_id uuid references public.student_codes(id);

create index if not exists student_codes_student_active_idx on public.student_codes(student_id) where active;
create index if not exists payments_student_status_idx on public.payments(student_id, status);
create index if not exists subscriptions_student_active_idx on public.subscriptions(student_id, expires_at) where status = 'active';
create index if not exists subscriptions_code_idx on public.subscriptions(code_id);

insert into public.plans (slug, name, amount_cents, currency, duration_days)
values
  ('basic', 'الباقة الأساسية', 19900, 'EGP', 30),
  ('advanced', 'الباقة المتقدمة', 34900, 'EGP', 30),
  ('complete', 'الباقة الشاملة', 49900, 'EGP', 30)
on conflict (slug) do nothing;

alter table public.students enable row level security;
alter table public.student_codes enable row level security;
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;

-- Plans are safe to display; all payment/student data is server-side only.
drop policy if exists "active plans are public" on public.plans;
create policy "active plans are public" on public.plans for select to anon, authenticated using (active);

create or replace function public.validate_student_code(input_code text)
returns table(student_id uuid, code_id uuid)
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if input_code is null or length(input_code) = 0 then
    return;
  end if;
  return query
    update public.student_codes c
       set last_used_at = now()
     where c.code_hash = encode(digest(upper(trim(input_code)), 'sha256'), 'hex')
       and c.active
       and (c.expires_at is null or c.expires_at > now())
    returning c.student_id, c.id;
end;
$$;
revoke all on function public.validate_student_code(text) from public;
grant execute on function public.validate_student_code(text) to anon, authenticated;

create or replace function public.expire_subscriptions()
returns integer language sql security definer set search_path = public
as $$
  with changed as (
    update public.subscriptions
       set status = 'expired'
     where status = 'active' and expires_at <= now()
     returning 1
  ) select count(*)::integer from changed;
$$;
revoke all on function public.expire_subscriptions() from public;
grant execute on function public.expire_subscriptions() to service_role;

create or replace function public.confirm_payment(
  payment_uuid uuid,
  transaction_id text,
  provider_payload jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payment_row public.payments%rowtype;
  plan_row public.plans%rowtype;
  start_time timestamptz;
begin
  select * into payment_row from public.payments where id = payment_uuid for update;
  if not found or payment_row.status = 'cancelled' or payment_row.status = 'failed' then return false; end if;
  if payment_row.status = 'paid' then return true; end if;
  select * into plan_row from public.plans where id = payment_row.plan_id and active;
  if not found then return false; end if;

  update public.payments
     set status = 'paid', gateway_transaction_id = transaction_id,
         gateway_payload = provider_payload, paid_at = now(), updated_at = now()
   where id = payment_uuid;

  select greatest(now(), coalesce(max(expires_at), now())) into start_time
    from public.subscriptions
   where student_id = payment_row.student_id and status = 'active' and expires_at > now();

  update public.subscriptions
     set status = 'expired'
   where student_id = payment_row.student_id
     and status = 'active'
     and expires_at <= now();

  insert into public.subscriptions (student_id, code_id, plan_id, payment_id, status, starts_at, expires_at)
  values (payment_row.student_id, payment_row.code_id, payment_row.plan_id, payment_uuid, 'active',
          start_time, start_time + make_interval(days => plan_row.duration_days));
  return true;
end;
$$;

revoke all on function public.confirm_payment(uuid, text, jsonb) from public;
grant execute on function public.confirm_payment(uuid, text, jsonb) to service_role;

drop function if exists public.authenticate_student_code(text);
create function public.authenticate_student_code(input_code text)
returns table(student_id uuid, student_name text, code_id uuid,
              student_email text, student_phone text, subscription_status text,
              subscription_plan_name text, subscription_starts_at timestamptz,
              subscription_expires_at timestamptz)
language sql
security definer
set search_path = public, extensions
as $$
  with matched as (
    select c.id code_id, s.id student_id, s.name, s.email, s.phone
      from public.student_codes c join public.students s on s.id = c.student_id
     where c.code_hash = encode(digest(upper(trim(input_code)), 'sha256'), 'hex')
       and c.active and (c.expires_at is null or c.expires_at > now())
  )
    select m.student_id, m.name, m.code_id, m.email, m.phone,
         case
           when sub.status = 'active' and sub.expires_at > now() then 'active'
           when sub.expires_at is not null then 'expired'
           else 'none'
         end,
         sub.plan_name,
         sub.starts_at,
         sub.expires_at
    from matched m
    left join lateral (
      select subscriptions.status, subscriptions.starts_at, subscriptions.expires_at,
             plans.name as plan_name
        from public.subscriptions
        join public.plans on plans.id = subscriptions.plan_id
       where subscriptions.student_id = m.student_id
       order by subscriptions.expires_at desc limit 1
    ) sub on true;
$$;

revoke all on function public.authenticate_student_code(text) from public;
grant execute on function public.authenticate_student_code(text) to anon, authenticated;
