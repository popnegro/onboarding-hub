-- Unified PXSOL content library. Apply only after reviewing the PR and confirming Storage is enabled.
-- Existing buckets are never mutated by this migration. Audit any pre-existing bucket manually.
begin;

create table public.content_resources (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  content_type varchar(20) not null check (content_type in ('video', 'pdf', 'presentation')),
  stage smallint not null check (stage between 1 and 4),
  step_number integer check (step_number between 1 and 20),
  language varchar(5) not null default 'es' check (language in ('es', 'en', 'pt')),
  storage_path varchar(500),
  external_url varchar(1000),
  duration_seconds integer check (duration_seconds is null or duration_seconds > 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_resources_source_check check (
    (storage_path is not null and external_url is null)
    or (storage_path is null and external_url is not null)
  ),
  constraint content_resources_type_source_check check (
    content_type = 'video' or storage_path is not null
  )
);

create index idx_content_resources_stage_step
  on public.content_resources(stage, step_number, sort_order)
  where active = true;

alter table public.content_resources enable row level security;
revoke all on table public.content_resources from anon;
grant select, insert, update, delete on table public.content_resources to authenticated;

create policy content_resources_authenticated_select
  on public.content_resources for select to authenticated
  using ((select auth.uid()) is not null);
create policy content_resources_authenticated_insert
  on public.content_resources for insert to authenticated
  with check ((select auth.uid()) is not null);
create policy content_resources_authenticated_update
  on public.content_resources for update to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);
create policy content_resources_authenticated_delete
  on public.content_resources for delete to authenticated
  using ((select auth.uid()) is not null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pxsol-onboarding-content',
  'pxsol-onboarding-content',
  false,
  104857600,
  array[
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do nothing;

create policy pxsol_content_authenticated_select
  on storage.objects for select to authenticated
  using (bucket_id = 'pxsol-onboarding-content' and (select auth.uid()) is not null);
create policy pxsol_content_authenticated_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'pxsol-onboarding-content' and (select auth.uid()) is not null);
create policy pxsol_content_authenticated_update
  on storage.objects for update to authenticated
  using (bucket_id = 'pxsol-onboarding-content' and (select auth.uid()) is not null)
  with check (bucket_id = 'pxsol-onboarding-content' and (select auth.uid()) is not null);
create policy pxsol_content_authenticated_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'pxsol-onboarding-content' and (select auth.uid()) is not null);

commit;
