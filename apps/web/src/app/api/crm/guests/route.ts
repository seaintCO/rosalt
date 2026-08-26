import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";

const id = z.string().uuid();
const stage = z.enum(["new", "upcoming", "in_stay", "past", "vip", "do_not_contact"]);
const base = z.object({
  organizationId: id,
  fullName: z.string().trim().min(2).max(140),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().min(7).max(40).nullable().optional(),
  preferredLanguage: z.enum(["en", "es"]).default("en"),
  internalNotes: z.string().trim().max(2000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});
const update = z.object({ organizationId: id, id, fullName: z.string().trim().min(2).max(140).optional(), email: z.string().email().nullable().optional(), phone: z.string().trim().min(7).max(40).nullable().optional(), preferredLanguage: z.enum(["en", "es"]).optional(), internalNotes: z.string().trim().max(2000).nullable().optional(), crmStage: stage.optional(), tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(), lastContactAt: z.iso.datetime().nullable().optional() });

async function context(organizationId: string) {
  const client = await createSupabaseServer();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: membership } = await client.from("organization_members").select("role").eq("organization_id", organizationId).eq("user_id", user.id).eq("status", "active").in("role", ["host_owner", "host_manager", "property_staff"]).maybeSingle();
  return membership ? { client, user } : null;
}

function serialize(row: Record<string, unknown>) {
  return { id: row.id, fullName: row.full_name, email: row.email, phone: row.phone, preferredLanguage: row.preferred_language, internalNotes: row.internal_notes, lifetimeValue: Number(row.lifetime_value ?? 0), upgradeValue: Number(row.upgrade_value ?? 0), crmStage: row.crm_stage, tags: row.tags ?? [], lastContactAt: row.last_contact_at, createdAt: row.created_at, preferences: null, reservations: [] };
}

export async function POST(request: Request) {
  const parsed = base.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid guest." }, { status: 400 });
  const auth = await context(parsed.data.organizationId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await auth.client.from("guests").insert({ organization_id: parsed.data.organizationId, full_name: parsed.data.fullName, email: parsed.data.email || null, phone: parsed.data.phone || null, preferred_language: parsed.data.preferredLanguage, internal_notes: parsed.data.internalNotes || null, crm_stage: "new", tags: parsed.data.tags }).select("id,full_name,email,phone,preferred_language,internal_notes,lifetime_value,upgrade_value,crm_stage,tags,last_contact_at,created_at").single();
  if (error || !data) return NextResponse.json({ error: "The guest could not be saved. Apply the included CRM migration and try again." }, { status: 500 });
  return NextResponse.json({ guest: serialize(data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const parsed = update.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid update." }, { status: 400 });
  const auth = await context(parsed.data.organizationId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const changes: Record<string, unknown> = {};
  if (parsed.data.fullName !== undefined) changes.full_name = parsed.data.fullName;
  if (parsed.data.email !== undefined) changes.email = parsed.data.email;
  if (parsed.data.phone !== undefined) changes.phone = parsed.data.phone;
  if (parsed.data.preferredLanguage !== undefined) changes.preferred_language = parsed.data.preferredLanguage;
  if (parsed.data.internalNotes !== undefined) changes.internal_notes = parsed.data.internalNotes;
  if (parsed.data.crmStage !== undefined) changes.crm_stage = parsed.data.crmStage;
  if (parsed.data.tags !== undefined) changes.tags = parsed.data.tags;
  if (parsed.data.lastContactAt !== undefined) changes.last_contact_at = parsed.data.lastContactAt;
  const { data, error } = await auth.client.from("guests").update(changes).eq("id", parsed.data.id).eq("organization_id", parsed.data.organizationId).select("id,full_name,email,phone,preferred_language,internal_notes,lifetime_value,upgrade_value,crm_stage,tags,last_contact_at,created_at").single();
  if (error || !data) return NextResponse.json({ error: "The guest could not be updated." }, { status: 500 });
  return NextResponse.json({ guest: serialize(data) });
}
