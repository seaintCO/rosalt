# Security architecture

- Authentication: Supabase Auth manages password hashes, verification, magic links, OAuth, reset, and sessions. Mobile refresh tokens use SecureStore with this-device-only accessibility.
- Authorization: forced RLS plus server checks. Organization IDs are filters, never proof of access.
- Guest access: random 256-bit token, hash-only storage, expiration, revocation, access counter, and narrowed server response.
- Secret storage: only names in `.env.example`; service keys are server-only. Calendar URLs and future lock credentials require AES-GCM encryption via `TOKEN_ENCRYPTION_SECRET`.
- Inputs: Zod validation, request-size bounds, server-calculated money, and parameterized Supabase queries.
- SSRF: iCal imports require HTTPS, reject local/private literal addresses and `.local`, disable redirects, use a 15-second timeout, and cap at 5 MB. Production DNS egress controls are still recommended against DNS rebinding.
- Webhooks: Stripe raw-body signature verification, provider event uniqueness, idempotent state reconciliation, and retry-safe failure records.
- AI: fixed system instructions, structured output, prompt versioning, source references, redacted input storage, quota checks, and no automatic consequential execution.
- Browser: CSP, frame denial, MIME sniffing prevention, permissions policy, referrer policy, and no provider secrets in the client.
- Files: private buckets, MIME/size allowlists, signed access, and executable rejection. Add image re-encoding to production upload routes before enabling broad uploads.
- Audit: approval decisions, organization creation, integrations, AI runs, webhooks, and support references are durable records.

## Admin boundary

No profile field grants admin or super-admin. Before activating platform admin UI, implement infrastructure-managed claims, step-up authentication, narrow audited RPCs, and a two-person process for destructive support operations.

## Incident handling

Rotate affected keys, revoke sessions/tokens, disable the integration, preserve privacy-safe audit records, identify affected organizations, notify under the applicable policy/law, patch, verify, and document restoration. Never put raw guest data or secrets into support tickets.
