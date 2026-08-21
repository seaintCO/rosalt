export const brand = {
  companyName: "ROSALT Maison Studios",
  softwareName: "Maison AI",
  tagline: "Designing homes, stays, and spaces that sell.",
  description: "ROSALT Maison Studios creates interior design concepts, Airbnb styling plans, property refurbishment direction, content strategies, and contractor-ready project scopes powered by Maison AI.",
  disclaimer: "ROSALT Maison Studios provides interior concepts, property planning, styling direction, content support, and contractor coordination assistance. Construction, remodeling, electrical, plumbing, structural, and other licensed trade work must be performed by properly licensed professionals.",
} as const;

export const services = [
  ["interior-design-concepts", "Interior Design Concepts", "Room-by-room direction, mood boards, décor, color, lighting, and shopping inspiration."],
  ["airbnb-styling", "Airbnb Styling", "Photo-worthy, guest-ready styling plans for stays that feel considered from arrival to checkout."],
  ["property-refurbishment", "Property Refurbishment Planning", "A clear refresh or remodel vision with priorities, budget ranges, and contractor-ready notes."],
  ["photography-content", "Photography & Content", "Listing images, before-and-afters, social content, shot lists, and property storytelling."],
  ["contractor-coordination", "Contractor Coordination", "A better-organized vision, referral process, approvals, status notes, and project communication."],
] as const;

export const packages = [
  ["Property Vision Package", "Starting at $1,500", "Mood board, room concepts, style direction, shopping inspiration, budget direction, and Maison AI portal."],
  ["Airbnb Refresh Package", "Starting at $3,500", "Styling plan, guest-experience ideas, photo direction, amenity concepts, content shot list, and project dashboard."],
  ["Full Property Transformation", "Starting at $7,500", "Full design direction, refurbishment concept, contractor-ready scope, content plan, and relaunch strategy."],
  ["Maison AI Host Dashboard", "Starting at $199/month", "Guest & client CRM, stays, readiness, tasks, upgrades, content storage, and property operations."],
  ["Custom Studio Partnership", "Custom", "Multi-property planning, styling systems, content systems, vendor coordination, and ongoing strategy."],
] as const;
