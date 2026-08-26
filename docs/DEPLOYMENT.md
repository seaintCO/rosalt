# Production deployment

## Web: GitHub, Vercel, and custom domain

1. Create a private GitHub repository and push this monorepo.
2. Import it into Vercel with root directory `apps/web` **or** leave the repository root and use `npm run build --workspace=@voynue/web`.
3. Use Node.js 22. Add variables from `.env.example` to Preview and Production with the documented client/server separation.
4. Deploy once, then add the custom domain and set `NEXT_PUBLIC_APP_URL` to its canonical HTTPS origin.
5. Add the Vercel domain and custom domain to Supabase Auth redirect allowlists.
6. Apply database migrations before enabling onboarding.
7. Configure the Stripe webhook against the production domain and separately set live-mode keys/prices.
8. Verify Resend DNS and send both English and Spanish test emails.
9. Configure `CRON_SECRET`; Vercel cron calls must present it as a Bearer token. Confirm job responses and integration logs.
10. Add the error-monitoring DSN, release tracking, alert destinations, and privacy-safe log redaction.

## Environment separation

- Local: Supabase local, Stripe test, provider development keys.
- Preview: dedicated staging Supabase project and Stripe test mode.
- Production: separate Supabase project, live Stripe, verified Resend domain, restricted production provider keys.

Never copy a production service-role or Stripe key into Preview. Rotate any key exposed to logs. `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` values are publicly observable; only URL/anonymous/publishable identifiers belong there.

## Release gates

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`
- `supabase test db`
- Real staging iCal import twice with no duplicate
- Revoked/expired/random guest token checks
- Stripe CLI signed webhook replay and duplicate replay
- Upgrade checkout success/failure/refund/dispute tests
- English/Spanish route and email review
- PWA install/offline/update test on iOS Safari and Android Chrome
- Mobile authentication, deep links, camera/photo upload, notification permission, and offline snapshot on physical devices
- Security headers/CSP scan, dependency audit, and backup/restore drill
