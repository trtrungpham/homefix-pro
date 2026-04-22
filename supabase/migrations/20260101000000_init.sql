-- HomeFix Pro initial schema
-- Run inside Supabase SQL editor or via `supabase db push`

create extension if not exists "pgcrypto";

-- =========================
-- profiles (mirror of auth.users with role)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin','staff')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- service categories
-- =========================
create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  sort_order int not null default 0
);

-- =========================
-- services
-- =========================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id) on delete set null,
  slug text unique not null,
  name text not null,
  description text,
  base_price numeric(12,0) not null default 0,
  price_unit text not null default 'lần',
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================
-- workers
-- =========================
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  specialties text[] not null default '{}',
  areas text[] not null default '{}',
  rating numeric(2,1) not null default 5.0,
  is_active boolean not null default true,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- =========================
-- orders (sửa chữa & tiện ích)
-- =========================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  address text not null,
  province text,
  district text,
  service_id uuid references public.services(id) on delete set null,
  description text,
  images text[] not null default '{}',
  scheduled_at timestamptz,
  status text not null default 'new' check (status in ('new','accepted','in_progress','completed','cancelled')),
  assigned_worker_id uuid references public.workers(id) on delete set null,
  internal_note text,
  total_price numeric(12,0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- =========================
-- project inquiries (thầu công trình)
-- =========================
create table if not exists public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  tax_code text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  project_type text not null,
  area_sqm numeric(12,2),
  budget numeric(14,0),
  timeline text,
  description text,
  attachment_urls text[] not null default '{}',
  status text not null default 'new' check (status in ('new','contacted','quoted','won','lost')),
  internal_note text,
  created_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.project_inquiries(status);

-- =========================
-- settings (key-value)
-- =========================
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- =========================
-- Helper: is_admin()
-- =========================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =========================
-- Row Level Security
-- =========================
alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.workers enable row level security;
alter table public.orders enable row level security;
alter table public.project_inquiries enable row level security;
alter table public.settings enable row level security;

-- profiles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles admin write" on public.profiles;
create policy "profiles admin write" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- service_categories: public read, admin write
drop policy if exists "categories public read" on public.service_categories;
create policy "categories public read" on public.service_categories for select using (true);

drop policy if exists "categories admin write" on public.service_categories;
create policy "categories admin write" on public.service_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- services
drop policy if exists "services public read" on public.services;
create policy "services public read" on public.services for select using (is_active or public.is_admin());

drop policy if exists "services admin write" on public.services;
create policy "services admin write" on public.services for all
  using (public.is_admin()) with check (public.is_admin());

-- workers: admin only
drop policy if exists "workers admin all" on public.workers;
create policy "workers admin all" on public.workers for all
  using (public.is_admin()) with check (public.is_admin());

-- orders: anyone can insert, admin reads/updates
grant insert on public.orders to anon;
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read" on public.orders for select using (public.is_admin());

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders for delete using (public.is_admin());

-- project_inquiries
grant insert on public.project_inquiries to anon;
drop policy if exists "projects public insert" on public.project_inquiries;
create policy "projects public insert" on public.project_inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "projects admin read" on public.project_inquiries;
create policy "projects admin read" on public.project_inquiries for select using (public.is_admin());

drop policy if exists "projects admin update" on public.project_inquiries;
create policy "projects admin update" on public.project_inquiries for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects admin delete" on public.project_inquiries;
create policy "projects admin delete" on public.project_inquiries for delete using (public.is_admin());

-- settings: public read, admin write
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings for select using (true);

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());
