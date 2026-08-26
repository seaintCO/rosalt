import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SetupState } from "@/components/setup-state";
import { LaunchChecklist } from "@/components/launch-checklist";
import { CommunicationsInbox } from "@/components/communications-inbox";
import { GuestCrm, type GuestCrmRecord } from "@/components/guest-crm";
import { MaisonDashboardSandbox } from "@/components/maison-dashboard-sandbox";

const sections: Record<string, { title: string; description: string; table?: string; setup?: string[] }> = {
  calendar: { title: "Stays & Reservations", description: "Stays, reservation context, readiness, and property activity.", table: "reservations" },
  properties: { title: "Properties", description: "Property details, guidebooks, access, integrations, and settings.", table: "properties" },
  cleaning: { title: "Readiness Workflow", description: "Assignments, checklists, evidence, property readiness, and next steps.", table: "cleaning_assignments" },
  maintenance: { title: "Maintenance", description: "Issues, severity, assignments, approvals, quotes, blocks, and completion.", table: "maintenance_tickets" },
  inventory: { title: "Inventory & supplies", description: "Par levels, live counts, restock tasks, costs, and allocation.", table: "inventory_items" },
  upgrades: { title: "Guest Experience Upgrades", description: "Thoughtful guest add-ons with clear terms and tracked fulfillment.", table: "upgrades", setup: ["Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.", "Create the documented webhook endpoint in Stripe.", "Keep payouts in ledger-only mode until Stripe Connect approval."] },
  approvals: { title: "Approval center", description: "Consequential actions remain human-reviewed with a complete trail.", table: "approvals" },
  analytics: { title: "Analytics", description: "Only real stored records are included. Projections are labeled estimates." },
  "listing-audit": { title: "Listing audit", description: "Submit your own listing materials; unsupported platforms are never scraped.", table: "audit_reports" },
  integrations: { title: "Integration health", description: "Configuration, last success, errors, retries, and support references.", table: "property_integrations", setup: ["Supabase: run migrations and configure Auth.", "Ticketmaster: add TICKETMASTER_API_KEY for real events.", "Stripe: add secret and webhook keys for billing and upgrades.", "Resend: add a verified sending domain and RESEND_API_KEY.", "OpenAI: add OPENAI_API_KEY for grounded ALMA generation."] },
  notifications: { title: "Notifications", description: "Priority, read state, deep links, channel preference, and quiet hours.", table: "notifications" },
};

type GuestRow = {
  id: string; full_name: string | null; email: string | null; phone: string | null; preferred_language: string; internal_notes: string | null;
  lifetime_value: number | string; upgrade_value: number | string; crm_stage: string; tags: string[] | null; last_contact_at: string | null; created_at: string;
  guest_preferences: Array<{ interests: string[] | null; occasion: string | null; dietary_preferences: string[] | null; accessibility_needs: string | null; travel_pace: string | null }> | null;
  reservations: Array<{ id: string; arrival_date: string; departure_date: string; status: string; gross_booking_value: number | string | null; properties: { name?: string } | Array<{ name?: string }> | null }> | null;
};

export default async function Section({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section } = await params;
  if (section === "launch") return <LaunchChecklist locale={locale} />;
  const client = await createSupabaseServer();
  if (!client) return <MaisonDashboardSandbox section={section} />;
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect(`/${locale}/login`);
  if (section === "messages") return <CommunicationsInbox locale={locale} />;

  const { data: membership } = await client.from("organization_members").select("organization_id,role").eq("user_id", user.id).eq("status", "active").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (!membership) redirect(`/${locale}/dashboard`);
  const organizationId = membership.organization_id;

  if (section === "guests") {
    const { data, error } = await client.from("guests").select("id,full_name,email,phone,preferred_language,internal_notes,lifetime_value,upgrade_value,crm_stage,tags,last_contact_at,created_at,guest_preferences(interests,occasion,dietary_preferences,accessibility_needs,travel_pace),reservations(id,arrival_date,departure_date,status,gross_booking_value,properties(name))").eq("organization_id", organizationId).is("deleted_at", null).order("updated_at", { ascending: false }).limit(1000);
    if (error) return <SetupState title="Guest CRM migration required" instructions={["Run every migration in /supabase/migrations.", "Confirm your signed-in user belongs to the active organization.", error.message]} />;
    const guests: GuestCrmRecord[] = ((data ?? []) as unknown as GuestRow[]).map((guest) => ({
      id: guest.id,
      fullName: guest.full_name || "Guest",
      email: guest.email,
      phone: guest.phone,
      preferredLanguage: guest.preferred_language,
      internalNotes: guest.internal_notes,
      lifetimeValue: Number(guest.lifetime_value ?? 0),
      upgradeValue: Number(guest.upgrade_value ?? 0),
      crmStage: guest.crm_stage,
      tags: guest.tags ?? [],
      lastContactAt: guest.last_contact_at,
      createdAt: guest.created_at,
      preferences: guest.guest_preferences?.[0] ? { interests: guest.guest_preferences[0].interests ?? [], occasion: guest.guest_preferences[0].occasion, dietaryPreferences: guest.guest_preferences[0].dietary_preferences ?? [], accessibilityNeeds: guest.guest_preferences[0].accessibility_needs, travelPace: guest.guest_preferences[0].travel_pace } : null,
      reservations: (guest.reservations ?? []).map((reservation) => { const property = Array.isArray(reservation.properties) ? reservation.properties[0] : reservation.properties; return { id: reservation.id, arrivalDate: reservation.arrival_date, departureDate: reservation.departure_date, status: reservation.status, grossBookingValue: reservation.gross_booking_value == null ? null : Number(reservation.gross_booking_value), propertyName: property?.name ?? "Property" }; }),
    }));
    return <GuestCrm locale={locale} organizationId={organizationId} initialGuests={guests} />;
  }

  const meta = sections[section];
  if (!meta) notFound();
  let count = 0;
  let errorText = "";
  if (meta.table) {
    const query = meta.table === "property_integrations"
      ? client.from("property_integrations").select("id,properties!inner(organization_id)", { count: "exact", head: true }).eq("properties.organization_id", organizationId)
      : client.from(meta.table as never).select("id", { count: "exact", head: true }).eq("organization_id", organizationId);
    const result = await query;
    count = result.count ?? 0;
    errorText = result.error?.message ?? "";
  }
  return <>
    <p className="eyebrow">Maison AI workspace</p>
    <h1>{meta.title}</h1>
    <p className="section-lede">{meta.description}</p>
    {meta.setup && <SetupState title="External configuration" instructions={meta.setup} />}
    <div className="zero" style={{ marginTop: 30 }}><h2>{count === 0 ? "No live records yet." : `${count} live record${count === 1 ? "" : "s"}`}</h2><p>{errorText ? `Access or configuration issue: ${errorText}` : "This view never inserts sample operational data. Records appear after the corresponding real workflow is completed."}</p></div>
  </>;
}
