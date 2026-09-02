create table if not exists public.platform_data (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now() not null
);

alter table public.platform_data enable row level security;

create or replace function public.update_platform_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists platform_data_updated_at on public.platform_data;
create trigger platform_data_updated_at
before update on public.platform_data
for each row
execute function public.update_platform_updated_at();

drop policy if exists "platform_data_public_access" on public.platform_data;
create policy "platform_data_public_access"
on public.platform_data
for all
to anon, authenticated
using (true)
with check (true);

insert into public.platform_data (id, payload)
values ('main', '{}')
on conflict (id) do nothing;
