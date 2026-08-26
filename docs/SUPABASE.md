# Supabase setup and RLS

1. Create a production Supabase project in the closest practical region.
2. Link the CLI: `supabase link --project-ref YOUR_REF`.
3. Review migrations, then run `supabase db push`.
4. Enable email/password, email verification, magic link, and Google OAuth.
5. Add the web callback `https://YOUR_DOMAIN/auth/callback` and mobile callback `voynue://auth/callback`.
6. Configure SMTP for production Auth mail.
7. Copy the project URL, anonymous key, database URL, and service-role key into the correct Vercel scopes.
8. Run `supabase test db` and inspect every failure before launch.

## RLS model

- Private tables are both RLS-enabled and RLS-forced.
- `is_org_member` derives access from `auth.uid()` and active membership; clients do not choose access by supplying an organization ID.
- Hosts read only organizations/properties for active memberships.
- Cleaners read assigned jobs or host-authorized organization records.
- Vendors are limited to their profile/assigned work as provider workflows are enabled.
- Guest portals do not receive direct table access. The server hashes and validates their token and returns a narrowed projection.
- Super-admin status is never read from editable profile metadata. Platform administrative functions must use infrastructure-owned claims and audited server actions before enabling them.
- Tables without an explicit policy default to deny. Add a policy and a pgTAP test together when enabling a new client operation.

## Storage

All buckets are private. Create signed URLs server-side after authorization. Bucket MIME allowlists and size limits reject executables. Production upload handlers should additionally decode/re-encode supported images to strip unnecessary metadata before making them available.

## Required database verification

The included pgTAP test verifies forced RLS on critical reservation, guest-token, and audit tables. Before launch add two real test users to the staging project and verify cross-organization reads return no rows, assigned cleaners see only assigned tasks, revoked guest links fail, and service-role operations are confined to server routes.
