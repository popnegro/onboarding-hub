-- Internal-only access for the PXSOL demo.
-- Review the live schema and existing policies before applying.
-- Abort if policies already exist; never silently OR-combine with unknown policies.
begin;

do $$
declare existing_policy_count integer;
begin
  select count(*) into existing_policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename in ('videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends');
  if existing_policy_count > 0 then
    raise exception 'Existing RLS policies detected. Audit and reconcile them before applying 20261031_internal_demo_access.sql.';
  end if;
end
$$;

revoke all on table public.videos, public.clients, public.onboarding_steps, public.adoption_metrics, public.video_sends from anon;
grant select, insert, update, delete on table public.videos, public.clients, public.onboarding_steps, public.adoption_metrics, public.video_sends to authenticated;

create policy "internal_authenticated_all_videos" on public.videos for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "internal_authenticated_all_clients" on public.clients for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "internal_authenticated_all_onboarding_steps" on public.onboarding_steps for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "internal_authenticated_all_adoption_metrics" on public.adoption_metrics for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "internal_authenticated_all_video_sends" on public.video_sends for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

commit;
