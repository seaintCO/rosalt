# Truthful launch report

Delivery date: 2026-08-01

## Fully implemented in source

- Monorepo/workspaces; strict TypeScript; current compatible Next.js, React, Expo, Supabase, Stripe, OpenAI, Resend, Zod, Vitest, and Turbo packages.
- Premium bilingual public site, PWA manifest/offline shell/update-ready service worker, login/signup/magic link/Google OAuth flow, live-data host dashboard, founder checklist, integration setup states, and secure guest portal.
- Expo mobile authentication, SecureStore sessions, role-aware real record counts, bilingual UI, deep-link identifiers, permissions, and essential offline snapshot.
- Normalized PostgreSQL tables for every named domain, indexes, private storage buckets, forced RLS, membership helper, approval and rate-limit functions, and empty seed.
- Manual reservation API; safe iCal download/parse/deduplicate/reconcile with encrypted source URL storage and sync logs.
- Ticketmaster search and ALMA structured planner that fail closed when credentials are absent and record sources/AI runs when configured.
- Server-priced Stripe upgrade Checkout, subscription Checkout/customer portal, signature-verified idempotent webhooks, payments/subscriptions/dispute state, and ledger-only payout architecture.
- Cleaner assignment, maintenance ticket, approval decision, account export/deletion, health, and cron endpoints.
- Interactive four-step liquid-glass traveler planner with budget sliders, live allocation visuals, grounded itinerary output, and provider-required failure states.
- Unified communications dashboard adapted from SEAINT Stay: organization-scoped conversations, RLS, first-party client rooms with hashed expiring links, real Resend delivery when configured, and explicit Airbnb draft-only behavior.
- Premium interactive product pages for travelers, hosts, property managers, local experiences, listing audit, pricing, company, contact, privacy, terms, accessibility, and vendor onboarding in English and Spanish.
- Isolated host sandbox with user-entered practice data and interactive Today, Calendar, Cleaning, Guest Portal, and Upgrade workflows. Sandbox data remains in the browser tab, calls no providers, creates no database records, and is always labeled as a preview.
- Real tenant-scoped Guest CRM with search, lifecycle pipeline, tags, internal notes, contact logging, stay history, recorded value, role-gated writes, and automatic stage refresh from reservation dates.
- Refined Apple-style typography and liquid-glass spacing, plus compact layered holographic instruments replacing the previous solid blue orbs.

## Requires credentials or external configuration

- Supabase project, migrations, Auth providers/SMTP, URL allowlists, and environment values.
- Stripe products/prices, test/live keys, webhook endpoint, customer portal settings. Stripe Connect requires separate platform approval and implementation completion before automated vendor distribution.
- Ticketmaster Discovery key.
- OpenAI API key/model selection.
- Resend verified domain and templates before transactional email is live.
- External WhatsApp, Instagram, Facebook, and SMS channels remain setup-required until approved provider connectors are configured; no delivery is claimed.
- Maps, places, weather, OAuth, monitoring, APNs/FCM, and SMS provider selections/keys before those capabilities are live.
- Apple Developer/Google Play accounts, app records, signing, privacy questionnaires, review, and approval.

## Verified in this repository environment

- `npm run typecheck`: passed for all eight workspaces.
- `npm run lint`: passed for all eight workspaces.
- `npm run test`: passed (13 automated tests across domain, security/localization, CRM tenancy, and holographic UI assertions at delivery).
- `npm run build`: passed; Next.js compiled and generated 62 pages/routes, and the Expo source TypeScript build passed.
- Calendar unit parsing and UID deduplication, decimal money calculations, localization fallback, and local/private URL rejection are covered.

## Not externally verified here

- A real Airbnb iCal feed was not supplied, so live provider import acceptance is not claimed.
- No Supabase/Stripe/Ticketmaster/OpenAI/Resend credentials were supplied, so live integration, RLS staging, webhook, email, or provider acceptance is not claimed.
- Physical-device PWA/mobile, EAS binary, push, store submission, maps/places/weather, PDF generation, smart locks, direct PMS, direct Airbnb messaging, SMS, and automated Stripe Connect payouts remain unverified or unsupported as described in the guides.
- Comprehensive browser end-to-end coverage for the 15-step live flow must run in staging after credentials are configured. The included suite is a foundation, not a truthful substitute for that acceptance run.

## Security checks completed in source

- No secrets committed; client/server environment inventory separated.
- Forced RLS/private storage; no editable super-admin profile field; hash-only guest tokens.
- CSP and security headers; input validation; rate-limit function; SSRF controls; request/response references; webhook signatures/idempotency; server-calculated prices; audit/source records.
- Root dependency overrides raise audited transitive PostCSS, Sharp, and UUID versions without downgrading Next.js or Expo.

## Migrations

- `202607310001_initial_platform.sql`
- `202607310002_secure_functions.sql`
- `202607310003_operational_policies.sql`
- `202607310004_unified_communications.sql`
- `202608010001_guest_crm.sql`

Follow [Founder property launch](LAUNCH_CHECKLIST.md) exactly before using the first property with a real guest.
