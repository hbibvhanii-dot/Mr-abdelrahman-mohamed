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

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  payment_id uuid not null unique references public.payments(id),
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists student_codes_student_active_idx on public.student_codes(student_id) where active;
create index if not exists payments_student_status_idx on public.payments(student_id, status);
create index if not exists subscriptions_student_active_idx on public.subscriptions(student_id, expires_at) where status = 'active';

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
     where c.code_hash = encode(digest(input_code, 'sha256'), 'hex')
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
