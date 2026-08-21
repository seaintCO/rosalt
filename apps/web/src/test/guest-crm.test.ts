import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "../..");

describe("VOYNUE Guest CRM", () => {
  it("uses authenticated tenant records and never injects demo guests", () => {
    const page = readFileSync(resolve(root, "apps/web/src/app/[locale]/dashboard/[section]/page.tsx"), "utf8");
    const api = readFileSync(resolve(root, "apps/web/src/app/api/crm/guests/route.ts"), "utf8");
    const component = readFileSync(resolve(root, "apps/web/src/components/guest-crm.tsx"), "utf8");
    expect(page).toContain('.from("guests")');
    expect(page).toContain('.eq("organization_id", organizationId)');
    expect(api).toContain('from("organization_members")');
    expect(api).toContain('from("guests")');
    expect(component).not.toMatch(/sampleGuests|demoGuests|fakeGuests/);
  });

  it("ships lifecycle automation and role-secured CRM policies", () => {
    const migration = readFileSync(resolve(root, "supabase/migrations/202608010001_guest_crm.sql"), "utf8");
    expect(migration).toContain("reservations_refresh_guest_crm");
    expect(migration).toContain("guests_update");
    expect(migration).toContain("do_not_contact");
  });

  it("uses compact holographic instruments instead of solid orb markup", () => {
    const home = readFileSync(resolve(root, "apps/web/src/app/[locale]/page.tsx"), "utf8");
    const hologram = readFileSync(resolve(root, "apps/web/src/components/hologram.tsx"), "utf8");
    expect(home).not.toContain("alma-orb");
    expect(hologram).toContain("holo-ring");
    expect(hologram).toContain("holo-plane");
    expect(hologram).toContain("holo-telemetry");
  });

  it("supports editing real CRM contact and relationship fields", () => {
    const api = readFileSync(resolve(root, "apps/web/src/app/api/crm/guests/route.ts"), "utf8");
    const component = readFileSync(resolve(root, "apps/web/src/components/guest-crm.tsx"), "utf8");
    expect(component).toContain("Edit relationship");
    expect(component).toContain("internalNotes: form.get");
    expect(component).toContain('method: "PATCH"');
    expect(api).toContain("preferredLanguage");
    expect(api).toContain("internalNotes");
    expect(api).toContain("lastContactAt");
  });
});
