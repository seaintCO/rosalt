# Unified communications

VOYNUE includes an organization-scoped communications workspace under `/[locale]/dashboard/messages`.

## Working channels

- **Private VOYNUE rooms:** a host creates a room and receives a 256-bit invitation link. Only the SHA-256 token hash is stored. Links expire after seven days and may be revoked in the database. Guests can read and reply without creating an account through `/c/[token]`.
- **Email:** when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured, VOYNUE sends through Resend and records the provider message identifier. If either variable is missing, the API fails closed and explicitly says setup is required.
- **Airbnb drafts:** messages are stored with `direction=draft` and `delivery_status=draft`. VOYNUE never represents these as sent. The host must copy them into Airbnb manually until an authorized integration exists.

## Setup-required channels

WhatsApp, Instagram, Facebook, and SMS are visible in integration health but remain disabled. They require approved business/provider accounts, server-side encrypted credentials, signed webhooks, idempotent provider event storage, and channel-specific compliance. No demo conversation is inserted into production.

## Database migration

Apply `supabase/migrations/202607310004_unified_communications.sql` after the first three VOYNUE migrations. It creates:

- `communication_channels`
- `conversations`
- `conversation_participants`
- `conversation_messages`
- `conversation_invites`

Every table has forced Row Level Security. Authenticated access derives the organization from active membership; clients cannot choose an arbitrary organization ID.

## Required environment variables for email

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and is required for anonymous private-room token verification. Never prefix it with `NEXT_PUBLIC_`.

## Source adaptation

The communications architecture was adapted from the supplied SEAINT Stay Unified Communications V5 package. VOYNUE uses its own organization/property/reservation model. Demo conversations, demo properties, video studio, camera simulations, and unrelated smart-home commerce were intentionally not imported.
