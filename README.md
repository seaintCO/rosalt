# ROSALT Maison Studios — Luxury Website + Maison AI Front-End Demo

This package translates the provided reference HTML into the ROSALT Maison Studios brand while preserving its core layout rhythm, Inter typography, large photography, rounded navigation, editorial spacing, card proportions, and scroll-reveal behavior.

## Brand hierarchy
- Public brand: **ROSALT Maison Studios**
- Positioning: **Designing homes, stays, and spaces that sell.**
- Supporting software: **Maison AI**
- Maison AI is positioned as the private project/operations portal behind ROSALT, not the public-facing brand.

## Included pages
- index.html — Home
- services.html — Services
- property-management.html — Property Management
- maison-ai.html — Maison AI
- packages.html — Packages / Pricing
- portfolio.html — Portfolio / Before & After
- about.html — About ROSALT
- start-project.html — Lead / onboarding form demo
- client-login.html — Client login UI demo
- dashboard.html — ROSALT internal dashboard demo
- owner-portal.html — Owner portal demo
- vendor-tasks.html — Cleaner/vendor task demo
- guest-portal.html — Later-phase guest portal concept

## Run in VS Code
Because this is static HTML/CSS/JS, you can open `index.html` directly or use the VS Code Live Server extension.

## Important launch notes
- The project form currently stores a demo payload in localStorage only. Connect it to your backend/form endpoint before launch.
- Login/authentication is not implemented.
- Dashboard, owner portal, and vendor task data are static demo content.
- PMS/channel-manager syncing is not implemented in this front-end package.
- Airbnb/Vrbo/Booking.com should initially connect to an established PMS/channel manager, with that system serving as the calendar master.
- AI is not required for the core platform. Add AI only after the operational workflows and integrations are stable.
- The site uses the same Inter web font family as the supplied reference HTML.
- ROSALT logo artwork included in `/assets` is PNG only.
- Editorial property photography uses remote Unsplash URLs so the visual treatment remains close to the supplied design reference. Replace with owned ROSALT project photography before production.

## Design direction applied
- Warm cream / white / charcoal / deep green
- No decorative gradients or holographic UI
- No fake market charts or tech-first messaging
- Large editorial property photography
- Luxury hospitality language first
- Maison AI positioned behind the studio experience
