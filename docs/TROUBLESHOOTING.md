# Troubleshooting

## A feature says Setup required

Open `/api/health`. It reports configured/setup-required status without exposing values. Add the named variable to the correct environment, redeploy, and retry. Never substitute sample provider results.

## iCal import fails

Confirm the URL is an HTTPS calendar export, not the listing URL. Re-export it from the platform. The importer rejects redirects, local/private addresses, responses over 5 MB, non-calendar content, and slow feeds. Use the returned support reference to find the matching sync/integration log. Re-importing the same feed is safe and should not duplicate its UID records.

## Stripe payment does not update

Confirm the webhook endpoint uses the matching mode’s signing secret, inspect Stripe delivery history, replay the event, and check `webhook_events`. Duplicate event IDs return success without reprocessing. Never manually mark a payment paid without checking Stripe.

## Login link returns to the wrong place

Add the exact domain/callback to the Supabase redirect allowlist, set `NEXT_PUBLIC_APP_URL`, and verify email-link scanners have not consumed a one-time link. Mobile requires `voynue://auth/callback`.

## Guest portal is 404

The token is malformed, unknown, expired, or revoked. Generate a fresh portal from the reservation. Do not un-revoke an exposed token.

## Build failures

Use Node.js 22+, run a clean `npm install`, then run the four verification commands individually. TypeScript 6.0.x is intentional because it is the latest stable compiler supported by the selected Next.js release at delivery time.
