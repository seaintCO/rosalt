# Integration setup

## Stripe

Create recurring products/prices for Host Starter ($49/property/month), Host Pro ($99/property/month), and Host Business ($199/month plus configured property pricing). Put their IDs in the three `STRIPE_PRICE_*` variables. Create a webhook endpoint at `/api/webhooks/stripe` for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.payment_failed`
- `charge.dispute.created`

Use the Stripe CLI in test mode to forward and replay events. The signature is verified against the raw request. Duplicate events are ignored by provider event ID. Stripe Connect payout distribution is not active; vendor and host amounts remain accounting-ledger records until Connect approval and onboarding are complete.

## Ticketmaster Discovery

Create a Discovery API application and add `TICKETMASTER_API_KEY` server-side. The API searches real events by city/date/radius/keyword and preserves Ticketmaster links. Price ranges and accessibility data are displayed only when the provider supplies them. A click-out is never represented as a ticket purchase.

## OpenAI / ALMA

Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL`. ALMA uses structured output and receives normalized provider facts plus redacted traveler preferences. Prompt versions and source references are retained in `prompt_versions` and `ai_runs`. The integration never places guest-provided text into the system instruction.

## Resend

Verify the sending domain, add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`, and configure English/Spanish templates. Until this is done, email-dependent workflows must remain setup-required. Direct Airbnb messaging is unsupported; VOYNUE provides copyable drafts only.

## Maps, places, and weather

The environment and normalized database records are ready for `MAPS_PROVIDER`, `PLACES_PROVIDER`, and `WEATHER_PROVIDER`. A production implementation must be selected and added before maps/place/weather can be marked live. Do not forward server API keys to the mobile app. Provider results must carry source IDs and retrieval timestamps.

## OAuth

Configure Google credentials through Supabase Auth. Apple is architected through the Expo bundle identifiers, universal links, and Supabase-compatible callback, but requires an Apple Developer Service ID, key, team ID, and domain association before it can be enabled.

## Future providers

PMS, smart lock, SMS, sports, and marketplace payouts remain explicit abstractions—not claimed live integrations. Airbnb scraping and password collection are prohibited.
