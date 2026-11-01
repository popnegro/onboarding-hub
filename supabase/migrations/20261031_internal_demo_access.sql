-- PXSOL Onboarding Hub: initial schema + internal-only access.
-- Intended for a fresh Supabase project with manually provisioned internal users.
-- Signup must remain disabled. Do not apply to a database with unknown schema/policies.
begin;

create extension if not exists pgcrypto;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  step_number integer not null,
  title varchar(255) not null,
  description text,
  url_es varchar(500),
  url_en varchar(500),
  url_pt varchar(500),
  duration_seconds integer,
  thumbnail_url varchar(500),
  active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  hubspot_deal_id varchar(50) unique,
  name varchar(255) not null,
  email varchar(255) not null,
  assigned_onboarder_id uuid references auth.users(id),
  current_etapa integer default 1,
  progress_percentage numeric(5, 2) default 0,
  adoption_score integer default 0,
  status varchar(50) default 'active',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.onboarding_steps (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  step_number integer not null,
  etapa integer not null,
  title varchar(255) not null,
  description text,
  status varchar(20) default 'not_started',
  estimated_date date,
  completed_date timestamp,
  notes text,
  blocker_reason text,
  video_id uuid references public.videos(id),
  depends_on_step integer,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint onboarding_steps_client_step_unique unique (client_id, step_number)
);

create table if not exists public.adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  measurement_date date not null,
  reservations_7d integer default 0,
  active_users integer default 0,
  rates_updated boolean default false,
  reports_generated integer default 0,
  integrations_active integer default 0,
  adoption_score integer default 0,
  risk_level varchar(20),
  created_at timestamp default now()
);

create table if not exists public.video_sends (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  video_id uuid not null references public.videos(id),
  channel varchar(20),
  sent_at timestamp default now(),
  opened_at timestamp,
  clicked_at timestamp
);

create index if not exists idx_clients_onboarder on public.clients(assigned_onboarder_id);
create index if not exists idx_steps_client on public.onboarding_steps(client_id);
create index if not exists idx_steps_status on public.onboarding_steps(status);
create index if not exists idx_adoption_client on public.adoption_metrics(client_id);
create index if not exists idx_adoption_date on public.adoption_metrics(measurement_date);
create index if not exists idx_video_sends_client on public.video_sends(client_id);

do $$
declare
  existing_policy_count integer;
begin
  select count(*) into existing_policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename in ('videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends');

  if existing_policy_count > 0 then
    raise exception 'Existing RLS policies detected. Audit and reconcile before applying the internal demo access migration.';
  end if;
end
$$;

alter table public.videos enable row level security;
alter table public.clients enable row level security;
alter table public.onboarding_steps enable row level security;
alter table public.adoption_metrics enable row level security;
alter table public.video_sends enable row level security;

revoke all on table public.videos, public.clients, public.onboarding_steps, public.adoption_metrics, public.video_sends from anon;
grant select, insert, update, delete on table public.videos, public.clients, public.onboarding_steps, public.adoption_metrics, public.video_sends to authenticated;

create policy internal_authenticated_all_videos on public.videos
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy internal_authenticated_all_clients on public.clients
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy internal_authenticated_all_onboarding_steps on public.onboarding_steps
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy internal_authenticated_all_adoption_metrics on public.adoption_metrics
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy internal_authenticated_all_video_sends on public.video_sends
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

commit;
