begin;
create table public.api_rate_limits (key_hash text not null, bucket text not null, window_start timestamptz not null, request_count integer not null default 0, primary key(key_hash,bucket,window_start));
alter table public.api_rate_limits enable row level security; alter table public.api_rate_limits force row level security;

create or replace function public.consume_rate_limit(p_key_hash text,p_bucket text,p_limit integer,p_window_seconds integer) returns boolean language plpgsql security definer set search_path='' as $$
declare w timestamptz:=to_timestamp(floor(extract(epoch from now())/p_window_seconds)*p_window_seconds); c integer;
begin
 insert into public.api_rate_limits(key_hash,bucket,window_start,request_count) values(p_key_hash,p_bucket,w,1)
 on conflict(key_hash,bucket,window_start) do update set request_count=public.api_rate_limits.request_count+1 returning request_count into c;
 return c<=p_limit;
end; $$;
revoke all on function public.consume_rate_limit(text,text,integer,integer) from public,anon,authenticated;

create or replace function public.create_host_organization(p_hosting_name text,p_legal_name text,p_email text,p_phone text,p_language text,p_timezone text,p_currency char(3),p_country char(2),p_state text,p_city text) returns uuid language plpgsql security definer set search_path='' as $$
declare oid uuid;
begin
 if auth.uid() is null then raise exception 'authentication required'; end if;
 insert into public.organizations(hosting_name,legal_name,email,phone,preferred_language,timezone,currency,country,state,city,created_by) values(p_hosting_name,p_legal_name,p_email,p_phone,p_language,p_timezone,p_currency,p_country,p_state,p_city,auth.uid()) returning id into oid;
 insert into public.organization_members(organization_id,user_id,role,status,joined_at) values(oid,auth.uid(),'host_owner','active',now());
 insert into public.audit_logs(actor_user_id,organization_id,action,target_table,target_id) values(auth.uid(),oid,'organization.created','organizations',oid);
 return oid;
end; $$;
grant execute on function public.create_host_organization(text,text,text,text,text,text,char(3),char(2),text,text) to authenticated;

create or replace function public.decide_approval(p_approval_id uuid,p_decision public.approval_status,p_notes text) returns public.approvals language plpgsql security definer set search_path='' as $$
declare item public.approvals;
begin
 select * into item from public.approvals where id=p_approval_id for update;
 if item.id is null or not public.is_org_member(item.organization_id,array['host_owner','host_manager']::public.app_role[]) then raise exception 'not authorized'; end if;
 if item.status<>'pending' or p_decision not in ('approved','rejected') then raise exception 'invalid approval state'; end if;
 update public.approvals set status=p_decision,decision_notes=p_notes,approver_id=auth.uid(),decided_at=now() where id=p_approval_id returning * into item;
 insert into public.audit_logs(actor_user_id,organization_id,action,target_table,target_id,metadata) values(auth.uid(),item.organization_id,'approval.decided','approvals',item.id,jsonb_build_object('decision',p_decision));
 return item;
end; $$;
grant execute on function public.decide_approval(uuid,public.approval_status,text) to authenticated;

create or replace function public.expire_stale_records() returns jsonb language plpgsql security definer set search_path='' as $$
declare a integer;t integer;
begin update public.approvals set status='expired' where status='pending' and expires_at<now();get diagnostics a=row_count;update public.guest_portal_tokens set revoked_at=now() where revoked_at is null and expires_at<now();get diagnostics t=row_count;return jsonb_build_object('approvals',a,'tokens',t);end;$$;
revoke all on function public.expire_stale_records() from public,anon,authenticated;

commit;
