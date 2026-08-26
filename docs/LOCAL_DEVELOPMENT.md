# Local development

## Requirements

- Node.js 22+
- npm 11+
- Docker for local Supabase
- Supabase CLI
- Optional Stripe CLI for webhook testing

## Commands

```bash
npm install
supabase start
supabase db reset
npm run dev
```

Use the root `.env.example` as the variable inventory. Put web values in `.env.local`; never commit it. Mobile public values belong in an EAS environment, not in `app.json`.

Local email/password accounts are created through Supabase Auth. The seed is intentionally empty. Create the first account through `/en/signup`, then create the organization/property through the APIs or the founder launch workflow.

Airbnb iCal instructions:

1. In Airbnb hosting, open **Calendar** and choose the listing.
2. Open **Availability** or calendar settings, then **Connect calendars**.
3. Choose **Export calendar** and copy the generated `https://...ics` URL.
4. In VOYNUE, choose Airbnb iCal, paste the URL, and import.

Never paste an Airbnb password into VOYNUE. Calendar exports can expose booking timing, so treat the URL as a secret and rotate it if disclosed.
