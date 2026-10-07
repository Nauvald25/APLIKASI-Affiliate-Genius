

create extension if not exists pgcrypto;

create table if not exists public.business_memory (
  id bigint generated always as identity primary key,
  brand text not null default '',
  audience text not null default '',
  tone text not null default '',
  products text not null default '',
  niche text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table if not exists public.affiliate_links (
  id bigint generated always as identity primary key,
  code text unique,
  product text not null default '',
  url text not null,
  clicks integer not null default 0 check (clicks >= 0),
  orders integer not null default 0 check (orders >= 0),
  commission numeric(14,2) not null default 0 check (commission >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);


create table if not exists public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id bigint not null references public.affiliate_links(id) on delete cascade,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversions (
  id uuid primary key default gen_random_uuid(),
  link_id bigint references public.affiliate_links(id) on delete set null,
  order_id text,
  amount numeric(14,2) not null default 0,
  commission numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);


create table if not exists public.content_plans (
  id bigint generated always as identity primary key,
  platform text not null,
  content_type text not null,
  title text not null default '',
  scheduled_date date,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.landing_tests (
  id bigint generated always as identity primary key,
  test_name text not null default '',
  variant text not null,
  visitors integer not null default 0 check (visitors >= 0),
  conversions integer not null default 0 check (conversions >= 0),
  created_at timestamptz not null default now()
);


create table if not exists public.store_profiles (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null default '',
  bio text not null default '',
  avatar text not null default '',
  theme text not null default 'dark',
  visitors integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.store_links (
  id bigint generated always as identity primary key,
  store_id bigint references public.store_profiles(id) on delete cascade,
  icon text not null default '',
  title text not null default '',
  url text not null,
  clicks integer not null default 0,
  badge text,
  affiliate_link_id bigint references public.affiliate_links(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.image_prompts (
  id bigint generated always as identity primary key,
  product text not null,
  style text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

create index if not exists link_clicks_link_id_created_at_idx
  on public.link_clicks (link_id, created_at desc);
create index if not exists conversions_link_id_created_at_idx
  on public.conversions (link_id, created_at desc);
create index if not exists content_plans_scheduled_date_idx
  on public.content_plans (scheduled_date);

alter table public.business_memory enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.link_clicks enable row level security;
alter table public.conversions enable row level security;
alter table public.content_plans enable row level security;
alter table public.landing_tests enable row level security;
alter table public.store_profiles enable row level security;
alter table public.store_links enable row level security;
alter table public.image_prompts enable row level security;


create policy "public read business memory" on public.business_memory for select to anon, authenticated using (true);
create policy "public write business memory" on public.business_memory for insert to anon, authenticated with check (true);
create policy "public update business memory" on public.business_memory for update to anon, authenticated using (true) with check (true);

create policy "public read affiliate links" on public.affiliate_links for select to anon, authenticated using (true);
create policy "public write affiliate links" on public.affiliate_links for insert to anon, authenticated with check (true);
create policy "public update affiliate links" on public.affiliate_links for update to anon, authenticated using (true) with check (true);

create policy "public read link clicks" on public.link_clicks for select to anon, authenticated using (true);
create policy "public insert link clicks" on public.link_clicks for insert to anon, authenticated with check (true);
create policy "public read conversions" on public.conversions for select to anon, authenticated using (true);
create policy "public insert conversions" on public.conversions for insert to anon, authenticated with check (true);

create policy "public read content plans" on public.content_plans for select to anon, authenticated using (true);
create policy "public write content plans" on public.content_plans for insert to anon, authenticated with check (true);
create policy "public update content plans" on public.content_plans for update to anon, authenticated using (true) with check (true);
create policy "public delete content plans" on public.content_plans for delete to anon, authenticated using (true);

create policy "public read landing tests" on public.landing_tests for select to anon, authenticated using (true);
create policy "public write landing tests" on public.landing_tests for insert to anon, authenticated with check (true);
create policy "public update landing tests" on public.landing_tests for update to anon, authenticated using (true) with check (true);

create policy "public read store profiles" on public.store_profiles for select to anon, authenticated using (true);
create policy "public write store profiles" on public.store_profiles for insert to anon, authenticated with check (true);
create policy "public update store profiles" on public.store_profiles for update to anon, authenticated using (true) with check (true);
create policy "public read store links" on public.store_links for select to anon, authenticated using (true);
create policy "public write store links" on public.store_links for insert to anon, authenticated with check (true);
create policy "public update store links" on public.store_links for update to anon, authenticated using (true) with check (true);

create policy "public read image prompts" on public.image_prompts for select to anon, authenticated using (true);
create policy "public insert image prompts" on public.image_prompts for insert to anon, authenticated with check (true);
