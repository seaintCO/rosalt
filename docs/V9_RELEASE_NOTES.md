# VOYNUE v9 precision release

This release keeps the VOYNUE v7/v8 product direction and refines it around a quieter Apple-inspired interface.

## Interface

- Headline weight reduced and tracking opened for more natural typography.
- Liquid-glass controls use a consistent 48px optical height and 16px gap.
- The homepage planner bar no longer overlaps the guest-portal window.
- Large glowing spheres were replaced by compact telemetry instruments with a grid, nodes, scan line, planes, and restrained rings.
- Product surfaces use subtle pointer-responsive depth on desktop and respect reduced-motion preferences.
- CRM labels and operational data were enlarged for daily readability.

## Guest CRM

- Create tenant-scoped guest records.
- Search and filter guests by lifecycle stage.
- Edit name, email, phone, preferred language, tags, and internal notes.
- Log the latest contact date.
- View reservation history and recorded reservation/upgrade value.
- Update lifecycle stages with organization role checks and row-level security.

Apply `supabase/migrations/202608010001_guest_crm.sql` to an existing Supabase project before using the CRM. External travel, payments, email, and provider functions remain explicitly disabled until their documented keys are configured.
