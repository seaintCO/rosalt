begin;

create table public.communication_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  provider text not null check(provider in ('in_app','email','airbnb_draft','whatsapp','instagram','facebook','sms')),
  display_name text not null,
  external_channel_id text,
  status text not null default 'setup_required' check(status in ('setup_required','pending','connected','error','disabled')),
  capabilities text[] not null default '{}',
  encrypted_config jsonb not null default '{}',
  last_healthy_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (organization_id,property_id,provider,external_channel_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  reservation_id uuid references public.reservations(id) on delete set null,
  guest_id uuid references public.guests(id) on delete set null,
  channel_id uuid references public.communication_channels(id) on delete set null,
  provider text not null default 'in_app' check(provider in ('in_app','email','airbnb_draft','whatsapp','instagram','facebook','sms')),
  subject text not null check(char_length(subject) between 3 and 160),
  external_thread_id text,
  status text not null default 'open' check(status in ('open','closed','archived')),
  unread_count integer not null default 0 check(unread_count >= 0),
  last_message_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index conversations_provider_thread_unique on public.conversations(organization_id,provider,external_thread_id) where external_thread_id is not null;
create index conversations_org_recent on public.conversations(organization_id,last_message_at desc);
create index conversations_reservation on public.conversations(reservation_id,last_message_at desc) where reservation_id is not null;

create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  guest_id uuid references public.guests(id) on delete set null,
  display_name text not null,
  email citext,
  phone text,
  role text not null default 'guest' check(role in ('host','team','guest','cleaner','vendor','external')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  notification_settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index conversation_participants_thread on public.conversation_participants(conversation_id,joined_at);

create table public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_participant_id uuid references public.conversation_participants(id) on delete set null,
  sender_name text not null,
  sender_type text not null check(sender_type in ('host','team','guest','cleaner','vendor','external','system')),
  direction text not null check(direction in ('inbound','outbound','internal','draft')),
  provider text not null check(provider in ('in_app','email','airbnb_draft','whatsapp','instagram','facebook','sms')),
  body text not null check(char_length(body) between 1 and 10000),
  provider_message_id text,
  delivery_status text not null default 'received' check(delivery_status in ('draft','received','queued','sent','delivered','read','failed')),
  reply_to_id uuid references public.conversation_messages(id) on delete set null,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index conversation_messages_provider_unique on public.conversation_messages(organization_id,provider,provider_message_id) where provider_message_id is not null;
create index conversation_messages_thread_time on public.conversation_messages(conversation_id,created_at);

create table public.conversation_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  token_hash text not null unique,
  invited_name text,
  invited_email citext,
  created_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);
create index conversation_invites_active on public.conversation_invites(token_hash,expires_at) where revoked_at is null;

do $$ declare table_name text; begin
  foreach table_name in array array['communication_channels','conversations','conversation_participants','conversation_messages','conversation_invites'] loop
    execute format('alter table public.%I enable row level security',table_name);
    execute format('alter table public.%I force row level security',table_name);
  end loop;
end $$;

create policy communication_channels_org on public.communication_channels for select to authenticated using(public.is_org_member(organization_id));
create policy communication_channels_manage on public.communication_channels for all to authenticated using(public.is_org_member(organization_id,array['host_owner','host_manager']::public.app_role[])) with check(public.is_org_member(organization_id,array['host_owner','host_manager']::public.app_role[]));
create policy conversations_org on public.conversations for all to authenticated using(public.is_org_member(organization_id)) with check(public.is_org_member(organization_id));
create policy conversation_participants_org on public.conversation_participants for all to authenticated using(public.is_org_member(organization_id)) with check(public.is_org_member(organization_id));
create policy conversation_messages_org on public.conversation_messages for all to authenticated using(public.is_org_member(organization_id)) with check(public.is_org_member(organization_id));
create policy conversation_invites_org on public.conversation_invites for all to authenticated using(public.is_org_member(organization_id,array['host_owner','host_manager','property_staff']::public.app_role[])) with check(public.is_org_member(organization_id,array['host_owner','host_manager','property_staff']::public.app_role[]));

comment on table public.conversations is 'Normalized first-party and provider-backed communication threads. Airbnb entries are drafts only until an authorized messaging integration exists.';
comment on column public.communication_channels.encrypted_config is 'Server-only encrypted provider configuration. Never return this field to browser clients.';

commit;
