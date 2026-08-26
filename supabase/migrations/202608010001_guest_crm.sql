begin;

alter table public.guests add column if not exists crm_stage text not null default 'new' check(crm_stage in ('new','upcoming','in_stay','past','vip','do_not_contact'));
alter table public.guests add column if not exists tags text[] not null default '{}';
alter table public.guests add column if not exists last_contact_at timestamptz;

create index if not exists guests_org_stage_updated on public.guests(organization_id,crm_stage,updated_at desc) where deleted_at is null;
create index if not exists guests_org_search on public.guests(organization_id,lower(full_name)) where deleted_at is null;

update public.guests g set crm_stage=case
  when exists(select 1 from public.reservations r where r.guest_id=g.id and r.status='confirmed' and current_date>=r.arrival_date and current_date<r.departure_date and r.deleted_at is null) then 'in_stay'
  when exists(select 1 from public.reservations r where r.guest_id=g.id and r.status='confirmed' and r.arrival_date>current_date and r.deleted_at is null) then 'upcoming'
  when exists(select 1 from public.reservations r where r.guest_id=g.id and r.departure_date<=current_date and r.deleted_at is null) then 'past'
  else 'new' end
where g.crm_stage='new';

create or replace function public.refresh_guest_crm_stage() returns trigger language plpgsql security definer set search_path='' as $$
declare guest_key uuid; current_stage text;
begin
  guest_key:=case when tg_op='DELETE' then old.guest_id else new.guest_id end;
  if guest_key is null then if tg_op='DELETE' then return old; else return new; end if; end if;
  select crm_stage into current_stage from public.guests where id=guest_key;
  if current_stage in ('vip','do_not_contact') then if tg_op='DELETE' then return old; else return new; end if; end if;
  update public.guests g set crm_stage=case
    when exists(select 1 from public.reservations r where r.guest_id=guest_key and r.status='confirmed' and current_date>=r.arrival_date and current_date<r.departure_date and r.deleted_at is null) then 'in_stay'
    when exists(select 1 from public.reservations r where r.guest_id=guest_key and r.status='confirmed' and r.arrival_date>current_date and r.deleted_at is null) then 'upcoming'
    when exists(select 1 from public.reservations r where r.guest_id=guest_key and r.departure_date<=current_date and r.deleted_at is null) then 'past'
    else 'new' end,
    updated_at=now()
  where g.id=guest_key;
  if tg_op='DELETE' then return old; else return new; end if;
end $$;

drop trigger if exists reservations_refresh_guest_crm on public.reservations;
create trigger reservations_refresh_guest_crm after insert or update or delete on public.reservations for each row execute function public.refresh_guest_crm_stage();

drop policy if exists guests_org on public.guests;
create policy guests_read on public.guests for select to authenticated using(public.is_org_member(organization_id) or profile_id=auth.uid());
create policy guests_create on public.guests for insert to authenticated with check(public.is_org_member(organization_id,array['host_owner','host_manager','property_staff']::public.app_role[]));
create policy guests_update on public.guests for update to authenticated using(public.is_org_member(organization_id,array['host_owner','host_manager','property_staff']::public.app_role[])) with check(public.is_org_member(organization_id,array['host_owner','host_manager','property_staff']::public.app_role[]));
create policy guests_archive on public.guests for delete to authenticated using(public.is_org_member(organization_id,array['host_owner','host_manager']::public.app_role[]));

commit;
