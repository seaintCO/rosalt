begin;
select plan(4);
select ok((select relrowsecurity from pg_class where oid='public.reservations'::regclass),'reservations RLS enabled');
select ok((select relforcerowsecurity from pg_class where oid='public.reservations'::regclass),'reservations RLS forced');
select ok((select relrowsecurity from pg_class where oid='public.guest_portal_tokens'::regclass),'guest tokens RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.audit_logs'::regclass),'audit logs RLS enabled');
select * from finish();
rollback;
