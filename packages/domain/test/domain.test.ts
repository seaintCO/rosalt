import { describe, expect, it } from "vitest";
import { allocateBudget, calculateUpgradeTotal, deduplicateReservations, parseICalendar } from "../src";

describe("money", () => {
  it("keeps decimal totals exact", () => expect(calculateUpgradeTotal([{ unitAmount: 19.99, quantity: 2, taxRate: .1 }])).toEqual({ subtotal: 39.98, tax: 4, total: 43.98 }));
  it("reports remaining budget", () => expect(allocateBudget(500, [125.25, 24.75])).toEqual({ spent: 150, remaining: 350, overBudget: false }));
});

describe("calendar", () => {
  it("parses and deduplicates an iCal reservation", async () => {
    const payload = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:abc-123\nDTSTART;VALUE=DATE:20260810\nDTEND;VALUE=DATE:20260813\nSUMMARY:Reserved\nEND:VEVENT\nEND:VCALENDAR`;
    const parsed = await parseICalendar(payload);
    expect(parsed[0]).toMatchObject({ uid: "abc-123", arrivalDate: "2026-08-10", departureDate: "2026-08-13", status: "confirmed" });
    expect(deduplicateReservations([...parsed, ...parsed])).toHaveLength(1);
  });
});
