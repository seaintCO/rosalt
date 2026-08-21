# Mobile builds and store preparation

Identifiers:

- iOS bundle: `com.seaint.voynue`
- Android package: `com.seaint.voynue`
- URL scheme: `voynue://`
- Universal-link host placeholder: `app.voynue.com`

Set the EAS project ID and public Supabase values with EAS environment variables. Do not add service-role, Stripe secret, OpenAI, Ticketmaster, Resend, encryption, or cron keys to Expo.

```bash
cd apps/mobile
npx eas login
npx eas init
npx eas build --profile preview --platform all
npx eas build --profile production --platform ios
npx eas build --profile production --platform android
```

Before production builds, replace `app.voynue.com` if the canonical domain differs, host Apple `apple-app-site-association` and Android `assetlinks.json`, configure APNs/FCM with Expo, and test signed-in token refresh on physical devices.

Store declarations must disclose account/profile details, reservation and guest records, user content/photos, purchases, identifiers, diagnostics, and notification tokens according to what is actually enabled. Camera and photo-library permission strings are included for cleaner completion and maintenance evidence. VOYNUE is submission-ready code—not App Store or Play approved.

Submission checklist:

- Final icons/splash reviewed at all sizes
- Privacy policy and account deletion URL live
- Demo reviewer account with non-sensitive staging data created by the team (never hardcoded)
- Sign in and account deletion tested
- Apple sign-in configured if another third-party social login is offered on iOS
- Guest deep link and universal link tested
- Push permission requested only in context
- iPad/tablet and accessibility QA complete
- Production EAS builds scanned and submitted from the owner’s developer accounts
