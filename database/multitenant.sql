

create extension if not exists pgcrypto;

alter table public.business_memory add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.affiliate_links add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.link_clicks add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.conversions add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.content_plans add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.landing_tests add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.store_profiles add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.store_links add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.image_prompts add column if not exists owner_id uuid references auth.users(id) on delete cascade;

create index if not exists affiliate_links_owner_id_idx on public.affiliate_links(owner_id);
create index if not exists content_plans_owner_id_idx on public.content_plans(owner_id);
create index if not exists business_memory_owner_id_idx on public.business_memory(owner_id);
create index if not exists store_profiles_owner_id_idx on public.store_profiles(owner_id);


do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('business_memory','affiliate_links','link_clicks','conversions','content_plans','landing_tests','store_profiles','store_links','image_prompts')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

create policy "tenant select business memory" on public.business_memory for select to authenticated using (owner_id = auth.uid());
create policy "tenant insert business memory" on public.business_memory for insert to authenticated with check (owner_id = auth.uid());
create policy "tenant update business memory" on public.business_memory for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "tenant select affiliate links" on public.affiliate_links for select to authenticated using (owner_id = auth.uid());
create policy "tenant insert affiliate links" on public.affiliate_links for insert to authenticated with check (owner_id = auth.uid());
create policy "tenant update affiliate links" on public.affiliate_links for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "tenant delete affiliate links" on public.affiliate_links for delete to authenticated using (owner_id = auth.uid());


create policy "public read active shortlinks" on public.affiliate_links for select to anon using (active = true and code is not null);
create policy "tenant select link clicks" on public.link_clicks for select to authenticated using (owner_id = auth.uid());
create policy "public insert link clicks" on public.link_clicks for insert to anon, authenticated with check (owner_id is not null);
create policy "tenant select conversions" on public.conversions for select to authenticated using (owner_id = auth.uid());
create policy "public insert conversions" on public.conversions for insert to anon, authenticated with check (owner_id is not null);

create policy "tenant all content plans" on public.content_plans for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "tenant all landing tests" on public.landing_tests for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "tenant select store profiles" on public.store_profiles for select to authenticated using (owner_id = auth.uid());
create policy "tenant write store profiles" on public.store_profiles for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "public read store by slug" on public.store_profiles for select to anon using (true);
create policy "tenant all store links" on public.store_links for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "tenant select image prompts" on public.image_prompts for select to authenticated using (owner_id = auth.uid());
create policy "tenant insert image prompts" on public.image_prompts for insert to authenticated with check (owner_id = auth.uid());


create or replace function public.increment_affiliate_click(target_link_id bigint)
returns void language sql security definer set search_path = public as $$
  update affiliate_links set clicks = clicks + 1 where id = target_link_id and active = true;
$$;

create or replace function public.increment_affiliate_order(target_link_id bigint)
returns void language sql security definer set search_path = public as $$
  update affiliate_links set orders = orders + 1 where id = target_link_id;
$$;

revoke all on function public.increment_affiliate_click(bigint) from public;
grant execute on function public.increment_affiliate_click(bigint) to service_role;
revoke all on function public.increment_affiliate_order(bigint) from public;
grant execute on function public.increment_affiliate_order(bigint) to service_role;


alter table public.business_memory enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.link_clicks enable row level security;
alter table public.conversions enable row level security;
alter table public.content_plans enable row level security;
alter table public.landing_tests enable row level security;
alter table public.store_profiles enable row level security;
alter table public.store_links enable row level security;
alter table public.image_prompts enable row level security;
