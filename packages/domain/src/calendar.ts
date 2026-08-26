import ICAL from "ical.js";
import type { CalendarReservation, ReservationStatus } from "@voynue/types";

function toDate(value: ICAL.Time): string {
  // iCal VALUE=DATE fields describe a local calendar day, not a UTC instant.
  // Converting through JavaScript Date can shift a stay backward in western time zones.
  return `${String(value.year).padStart(4, "0")}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;
}
async function hash(value: string): Promise<string> { const bytes = new TextEncoder().encode(value); const digest = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join(""); }

export async function parseICalendar(input: string): Promise<CalendarReservation[]> {
  if (input.length > 5_000_000) throw new Error("Calendar exceeds 5 MB limit");
  const root = new ICAL.Component(ICAL.parse(input));
  const components = root.getAllSubcomponents("vevent");
  const output: CalendarReservation[] = [];
  for (const component of components) {
    const event = new ICAL.Event(component);
    if (!event.uid || !event.startDate || !event.endDate) continue;
    const statusValue = String(component.getFirstPropertyValue("status") ?? "CONFIRMED").toUpperCase();
    const summary = String(event.summary || "Reserved").slice(0, 300);
    const status: ReservationStatus = statusValue === "CANCELLED" ? "cancelled" : /blocked|not available/i.test(summary) ? "blocked" : "confirmed";
    const identity = `${event.uid}|${toDate(event.startDate)}|${toDate(event.endDate)}`;
    const lastModified = component.getFirstPropertyValue("last-modified") as ICAL.Time | null;
    output.push({ externalId: event.uid, uid: event.uid, summary, arrivalDate: toDate(event.startDate), departureDate: toDate(event.endDate), status, rawHash: await hash(component.toString()), ...(lastModified ? { sourceUpdatedAt: lastModified.toJSDate().toISOString() } : {}) });
  }
  return output.sort((a, b) => a.arrivalDate.localeCompare(b.arrivalDate));
}

export function deduplicateReservations(items: CalendarReservation[]): CalendarReservation[] {
  const map = new Map<string, CalendarReservation>();
  for (const item of items) { const existing = map.get(item.uid); if (!existing || (item.sourceUpdatedAt ?? "") >= (existing.sourceUpdatedAt ?? "")) map.set(item.uid, item); }
  return [...map.values()];
}
