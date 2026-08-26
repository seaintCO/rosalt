import { z } from "zod";

export const uuid = z.uuid();
export const localeSchema = z.enum(["en", "es"]);
export const propertySchema = z.object({
  organizationId: uuid,
  name: z.string().trim().min(2).max(120),
  internalCode: z.string().trim().min(2).max(40),
  addressLine1: z.string().trim().min(3).max(180),
  addressLine2: z.string().trim().max(180).optional(),
  city: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100), postalCode: z.string().trim().min(3).max(20), country: z.string().length(2),
  timezone: z.string().min(3).max(60), currency: z.string().length(3), propertyType: z.string().min(2).max(60),
  bedrooms: z.number().int().min(0).max(100), beds: z.number().int().min(0).max(200), bathrooms: z.number().min(0).max(100), maxGuests: z.number().int().min(1).max(500),
  checkinTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), checkoutTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  quietHours: z.string().max(300).optional(), parkingDetails: z.string().max(2000).optional(), wifiSsid: z.string().max(100).optional(), wifiPassword: z.string().max(200).optional(), emergencyContact: z.string().max(300).optional(),
  insuranceAcknowledged: z.literal(true), permitAcknowledged: z.literal(true)
});
export const calendarImportSchema = z.object({ propertyId: uuid, sourceId: uuid.optional(), provider: z.enum(["airbnb","vrbo","booking_ical","other_ical"]), url: z.url().refine(v => v.startsWith("https://"), "HTTPS URL required") });
export const manualReservationSchema = z.object({ propertyId: uuid, guestId: uuid.optional(), arrivalDate: z.iso.date(), departureDate: z.iso.date(), adults: z.number().int().min(1).max(100), children: z.number().int().min(0).max(100).default(0), infants: z.number().int().min(0).max(100).default(0), pets: z.number().int().min(0).max(20).default(0), grossBookingValue: z.number().min(0).optional(), currency: z.string().length(3).default("USD"), notes: z.string().max(4000).optional() }).refine(x => x.departureDate > x.arrivalDate, { message: "Departure must be after arrival", path: ["departureDate"] });
export const plannerInputSchema = z.object({ destination: z.string().trim().min(2).max(150), startDate: z.iso.date(), endDate: z.iso.date(), travelers: z.number().int().min(1).max(50), adults: z.number().int().min(1).max(50), children: z.number().int().min(0).max(30), totalBudget: z.number().min(0).max(1_000_000), activityBudget: z.number().min(0).max(1_000_000), style: z.enum(["save","balanced","premium","custom"]), interests: z.array(z.enum(["sports","live_music","food","family","nightlife","nature","shopping","history","art","wellness","faith","business","romantic","adventure","free"])).min(1), transportation: z.string().max(100), dietaryRestrictions: z.array(z.string().max(80)).max(20), accessibilityNeeds: z.string().max(1000).optional(), pace: z.enum(["relaxed","balanced","full"]), occasion: z.string().max(100).optional(), mustDo: z.array(z.string().max(150)).max(20), avoid: z.array(z.string().max(150)).max(20), locale: localeSchema.default("en") }).refine(x => x.endDate >= x.startDate, { message: "End date must be on or after start date", path: ["endDate"] }).refine(x => x.activityBudget <= x.totalBudget, { message: "Activity budget cannot exceed total budget", path: ["activityBudget"] });
export const guestPortalCreateSchema = z.object({ reservationId: uuid, expiresInDays: z.number().int().min(1).max(365).default(45) });
export const cleanerAssignmentSchema = z.object({ reservationId: uuid, propertyId: uuid, cleanerMemberId: uuid, dueAt: z.iso.datetime(), rate: z.number().min(0), currency: z.string().length(3).default("USD") });
export const maintenanceSchema = z.object({ propertyId: uuid, reservationId: uuid.optional(), category: z.string().min(2).max(80), severity: z.enum(["low","medium","high","emergency"]), title: z.string().min(3).max(160), description: z.string().min(3).max(5000), propertyBlockRequired: z.boolean().default(false) });
export const approvalDecisionSchema = z.object({ approvalId: uuid, decision: z.enum(["approved","rejected"]), notes: z.string().min(2).max(2000) });
export const upgradeCheckoutSchema = z.object({ reservationId: uuid, guestPortalToken: z.string().min(32), items: z.array(z.object({ upgradeId: uuid, quantity: z.number().int().min(1).max(20) })).min(1).max(20), successUrl: z.url(), cancelUrl: z.url() });
