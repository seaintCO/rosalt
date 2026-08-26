# VOYNUE

**Run the property. Personalize the stay.**  
Powered by ALMA · A SEAINT company

VOYNUE is a production foundation for short-term-rental operations and grounded travel planning. It contains a Next.js PWA, an Expo mobile application, shared TypeScript packages, Supabase/PostgreSQL migrations with forced RLS, a real tenant-scoped Guest CRM, Stripe billing and upgrade checkout, iCal reservation synchronization, secure guest portals and client rooms, unified communications, Ticketmaster discovery, and ALMA structured planning.

VOYNUE deliberately ships with no fake users, reservations, revenue, events, reviews, or AI responses. Unconfigured integrations return `SETUP_REQUIRED` and the UI explains the exact missing configuration.

## Repository

```text
apps/web          Next.js App Router, public site, PWA, APIs, host dashboard, guest portal
apps/mobile       Expo React Native app for host, cleaner, vendor, and traveler roles
packages/domain   Calendar, money, token, and other framework-independent logic
packages/types    Shared contracts
packages/validation Shared Zod request schemas
packages/api-client Typed HTTP client
packages/ui       Shared design tokens
packages/config   Product and app identifiers
supabase          PostgreSQL schema, RLS, storage buckets, secure functions, pgTAP tests
docs              Architecture, integrations, deployment, security, mobile, and launch guides
```

## Start locally

1. Install Node.js 22 or newer and the Supabase CLI.
2. Copy `.env.example` to `.env.local` and fill only the providers you intend to test.
3. Run `npm install`.
4. Run `supabase start`, then `supabase db reset`.
5. Run `npm run dev` and open `http://localhost:3000`.

The web app remains buildable without credentials. Provider-backed workflows remain disabled and show setup instructions until their keys exist. The public host sandbox at `/en/host-sandbox` and `/es/host-sandbox` is an isolated, browser-tab-only product walkthrough: users enter their own practice property and stay details, nothing is persisted, and no provider calls or production records are created.

After Supabase is connected and all migrations are applied, the live Guest CRM is available at `/en/dashboard/guests` and `/es/dashboard/guests`. It reads only organization-scoped records and supports guest creation, search, lifecycle stages, tags, internal notes, contact logging, stay history, and recorded value.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

For database verification, run `supabase test db`. External live-flow verification requires the credentials and test accounts documented in [Production deployment](docs/DEPLOYMENT.md).

## Important independence statement

VOYNUE is an independent software platform and is not affiliated with or endorsed by Airbnb. It does not scrape Airbnb, request Airbnb credentials, or claim direct Airbnb messaging. Initial Airbnb synchronization uses the calendar export URL supplied by the host.

## Guides

- [Architecture](docs/ARCHITECTURE.md)
- [Local development](docs/LOCAL_DEVELOPMENT.md)
- [Supabase and RLS](docs/SUPABASE.md)
- [Integrations](docs/INTEGRATIONS.md)
- [Unified communications](docs/UNIFIED_COMMUNICATIONS.md)
- [Production deployment](docs/DEPLOYMENT.md)
- [Mobile and App Store preparation](docs/MOBILE.md)
- [Security architecture](docs/SECURITY.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Launch checklist](docs/LAUNCH_CHECKLIST.md)
- [Truthful launch report](docs/LAUNCH_REPORT.md)
