"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Hologram } from "@/components/hologram";

type Locale = "en" | "es";
type PublicSlug =
  | "for-travelers"
  | "for-hosts"
  | "for-property-managers"
  | "local-experiences"
  | "airbnb-audit"
  | "pricing"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "accessibility"
  | "vendor-application";

type PageCopy = {
  index: string;
  eyebrow: string;
  title: string;
  lede: string;
  primary: string;
  primaryHref: string;
  secondary: string;
  secondaryHref: string;
  features: Array<{ label: string; title: string; body: string }>;
};

const copy: Record<Locale, Record<PublicSlug, PageCopy>> = {
  en: {
    "for-travelers": {
      index: "01",
      eyebrow: "Travel intelligence",
      title: "A better trip starts with a real number.",
      lede: "Set the budget, pace, and interests. VOYNUE turns retrieved provider data into a plan you can understand and change.",
      primary: "Build my trip",
      primaryHref: "planner",
      secondary: "Explore the system",
      secondaryHref: "about",
      features: [
        { label: "BUDGET", title: "Know where the trip goes.", body: "Live allocations separate activities, food, transportation, and reserve." },
        { label: "GROUNDING", title: "Facts stay attached.", body: "Events, places, links, and availability come from configured providers." },
        { label: "CONTROL", title: "Change the plan instantly.", body: "Adjust pace, interests, and spend without beginning again." },
      ],
    },
    "for-hosts": {
      index: "02",
      eyebrow: "The host operating layer",
      title: "From reservation to ready—one calm workspace.",
      lede: "Connect the calendar, coordinate the turnover, publish the guest portal, and keep consequential actions behind approval.",
      primary: "Try the host sandbox",
      primaryHref: "host-sandbox",
      secondary: "Add a real property",
      secondaryHref: "signup",
      features: [
        { label: "OPERATIONS", title: "Today, without the noise.", body: "Arrivals, departures, cleaning, approvals, and maintenance in one view." },
        { label: "GUEST", title: "A private layer for every stay.", body: "Guidebook, itinerary, upgrades, messages, and essential check-in details." },
        { label: "ALMA", title: "Assistance with boundaries.", body: "Draft, explain, and summarize while humans approve consequential actions." },
      ],
    },
    "for-property-managers": {
      index: "03",
      eyebrow: "Portfolio operations",
      title: "Every property. The right person. The right context.",
      lede: "Organization membership, property assignments, approval limits, and auditable workflows scale from one home to a managed portfolio.",
      primary: "Model my portfolio",
      primaryHref: "host-sandbox",
      secondary: "Start onboarding",
      secondaryHref: "signup",
      features: [
        { label: "ACCESS", title: "Roles are enforced in the database.", body: "Owners, managers, staff, cleaners, vendors, and support see only authorized records." },
        { label: "PORTFOLIO", title: "Attention travels to the top.", body: "Property issues, sync failures, and overdue work surface without fabricated metrics." },
        { label: "REPORTING", title: "Reports follow the records.", body: "Owner reporting and analytics are calculated only from stored operating data." },
      ],
    },
    "local-experiences": {
      index: "04",
      eyebrow: "Local discovery",
      title: "The destination, thoughtfully connected.",
      lede: "Discover provider-grounded events, host recommendations, and approved local services—with sponsorship and affiliate relationships clearly labeled.",
      primary: "Plan around a destination",
      primaryHref: "planner",
      secondary: "Become a partner",
      secondaryHref: "vendor-application",
      features: [
        { label: "EVENTS", title: "Real events, direct sources.", body: "Ticketmaster results retain status, venue, time zone, and provider links." },
        { label: "LOCAL", title: "Host knowledge has a label.", body: "Recommendations distinguish host guidance from provider facts and AI suggestions." },
        { label: "COMMERCE", title: "Upgrades with clear terms.", body: "Price, lead time, fulfillment, refund rules, and approval requirements stay visible." },
      ],
    },
    "airbnb-audit": {
      index: "05",
      eyebrow: "Independent listing intelligence",
      title: "See the stay before the guest does.",
      lede: "Upload content you control. VOYNUE evaluates presentation, readiness, operations, and opportunity without scraping or altering the truth of the property.",
      primary: "Run a quick assessment",
      primaryHref: "airbnb-audit",
      secondary: "Add your property",
      secondaryHref: "signup",
      features: [
        { label: "PRESENTATION", title: "The first impression, measured.", body: "Hero image, sequence, title, description, amenities, and missing shots." },
        { label: "OPERATIONS", title: "The promise behind the listing.", body: "Rules, check-in, guidebook, safety, cleaning, and guest communication." },
        { label: "ACTION", title: "Priorities, not vague advice.", body: "Critical issues, quick wins, shot lists, and a practical 30-day plan." },
      ],
    },
    pricing: {
      index: "06",
      eyebrow: "Clear paths to launch",
      title: "Start with the stay. Add the operation when ready.",
      lede: "Traveler planning is free. Host plans scale by property, while entitlements are enforced on the server—not hidden behind frontend buttons.",
      primary: "Choose a host path",
      primaryHref: "signup",
      secondary: "Try the host demo",
      secondaryHref: "host-sandbox",
      features: [
        { label: "STARTER · $49", title: "Launch the guest layer.", body: "Portal, guidebook, guest CRM, recommendations, manual reservations, and iCal." },
        { label: "PRO · $99", title: "Personalize and grow.", body: "Upgrades, purchases, ALMA planning, audit, events, reviews, and bilingual tools." },
        { label: "BUSINESS · $199+", title: "Operate the portfolio.", body: "Teams, cleaning, maintenance, inventory, approvals, and advanced analytics." },
      ],
    },
    about: {
      index: "07",
      eyebrow: "Built around hospitality",
      title: "Technology should make the stay feel more human.",
      lede: "VOYNUE connects host operations and traveler planning through ALMA—an approval-aware intelligence layer developed by SEAINT.",
      primary: "See how it works",
      primaryHref: "host-sandbox",
      secondary: "Plan a trip",
      secondaryHref: "planner",
      features: [
        { label: "VOYNUE", title: "The product layer.", body: "Property operations, guest experience, travel planning, and local commerce." },
        { label: "ALMA", title: "The intelligence layer.", body: "Grounded drafting, analysis, translation, and explanation with traceable inputs." },
        { label: "SEAINT", title: "The company behind it.", body: "A production-minded technology company building useful operating systems." },
      ],
    },
    contact: {
      index: "08",
      eyebrow: "Founder launch desk",
      title: "Bring the first property into focus.",
      lede: "Choose the launch path and VOYNUE will take you to the right next step. Support cases become available after secure account creation.",
      primary: "Begin onboarding",
      primaryHref: "signup",
      secondary: "Explore the sandbox",
      secondaryHref: "host-sandbox",
      features: [
        { label: "FOUNDERS", title: "One property, properly launched.", body: "Property details, iCal, cleaner, guidebook, portal, upgrades, and reporting." },
        { label: "MANAGERS", title: "A scalable operating model.", body: "Organization design, access roles, team workflows, and integration planning." },
        { label: "PARTNERS", title: "Local service onboarding.", body: "Service area, pricing, availability, documentation, approval, and fulfillment." },
      ],
    },
    privacy: {
      index: "09",
      eyebrow: "Privacy by design",
      title: "Personalization without careless access.",
      lede: "VOYNUE scopes records by organization, property, assignment, ownership, or a revocable guest link—and records important access and decisions.",
      primary: "Review privacy controls",
      primaryHref: "privacy",
      secondary: "Create an account",
      secondaryHref: "signup",
      features: [
        { label: "CONTROL", title: "Export and deletion paths.", body: "Account and guest-data controls are supported with operational and legal retention boundaries." },
        { label: "CONSENT", title: "Marketing is not assumed.", body: "Opt-in state and timestamps are stored; guests are not marketed to without a valid basis." },
        { label: "ACCESS", title: "Private by default.", body: "RLS, private storage, signed URLs, expiring guest links, and audited admin access." },
      ],
    },
    terms: {
      index: "10",
      eyebrow: "Clear platform boundaries",
      title: "Software for the stay—not a substitute for responsibility.",
      lede: "Hosts remain responsible for property accuracy, safety, permits, guest commitments, vendors, refunds, and the rules of connected platforms.",
      primary: "Read key boundaries",
      primaryHref: "terms",
      secondary: "Contact the launch desk",
      secondaryHref: "contact",
      features: [
        { label: "INDEPENDENCE", title: "Not Airbnb.", body: "VOYNUE is independent and is not affiliated with or endorsed by Airbnb." },
        { label: "ESTIMATES", title: "No guaranteed outcomes.", body: "Demand, pricing, and revenue opportunities are estimates—not promises." },
        { label: "PAYMENTS", title: "Funds follow configuration.", body: "Vendor distribution is not described as automated until Stripe Connect is approved and live." },
      ],
    },
    accessibility: {
      index: "11",
      eyebrow: "Access is part of hospitality",
      title: "Designed to remain clear, calm, and usable.",
      lede: "Keyboard navigation, visible focus, semantic structure, readable contrast, reduced motion, and truthful property accessibility information shape the platform.",
      primary: "Explore accessibility",
      primaryHref: "accessibility",
      secondary: "Plan a trip",
      secondaryHref: "planner",
      features: [
        { label: "INTERFACE", title: "Operable without guesswork.", body: "Controls use labels, focus states, semantic elements, and responsive layouts." },
        { label: "MOTION", title: "Movement respects preference.", body: "Decorative motion is reduced when the device requests reduced motion." },
        { label: "TRAVEL", title: "Needs inform the plan.", body: "Accessibility preferences support planning and never become unsafe screening inputs." },
      ],
    },
    "vendor-application": {
      index: "12",
      eyebrow: "Local partner network",
      title: "Become part of a stay worth remembering.",
      lede: "Local businesses can prepare their service profile, pricing, area, availability, fulfillment, and required documentation before platform review.",
      primary: "Prepare my application",
      primaryHref: "vendor-application",
      secondary: "See local experiences",
      secondaryHref: "local-experiences",
      features: [
        { label: "PROFILE", title: "Present the real service.", body: "Business identity, categories, service area, images, booking URL, and availability." },
        { label: "TRUST", title: "Documentation when required.", body: "Insurance, licenses, refund terms, and approval status stay attached to the vendor." },
        { label: "DISCLOSURE", title: "Promotion remains visible.", body: "Sponsored placement, commissions, and affiliate relationships are clearly labeled." },
      ],
    },
  },
  es: {} as Record<PublicSlug, PageCopy>,
};

copy.es = Object.fromEntries(
  Object.entries(copy.en).map(([slug, page]) => [slug, page]),
) as Record<PublicSlug, PageCopy>;

const spanishOverrides: Partial<Record<PublicSlug, Partial<PageCopy>>> = {
  "for-travelers": { eyebrow: "Inteligencia de viaje", title: "Un mejor viaje comienza con un número real.", lede: "Define el presupuesto, el ritmo y los intereses. VOYNUE convierte datos reales de proveedores en un plan que puedes entender y cambiar.", primary: "Crear mi viaje", secondary: "Explorar el sistema" },
  "for-hosts": { eyebrow: "El sistema del anfitrión", title: "De la reservación a propiedad lista—un solo espacio.", lede: "Conecta el calendario, coordina la limpieza, publica el portal y mantén las acciones importantes bajo aprobación.", primary: "Probar demo anfitrión", secondary: "Agregar propiedad real" },
  "for-property-managers": { eyebrow: "Operaciones de portafolio", title: "Cada propiedad. La persona correcta. El contexto correcto.", lede: "Membresías, asignaciones, límites de aprobación y flujos auditables que escalan desde una casa hasta un portafolio.", primary: "Modelar mi portafolio", secondary: "Comenzar configuración" },
  "local-experiences": { eyebrow: "Descubrimiento local", title: "El destino, conectado con intención.", lede: "Descubre eventos con fuente, recomendaciones del anfitrión y servicios locales aprobados, con patrocinios claramente identificados.", primary: "Planear por destino", secondary: "Ser socio local" },
  "airbnb-audit": { eyebrow: "Inteligencia independiente", title: "Mira la estancia antes que el huésped.", lede: "Sube contenido que controlas. VOYNUE evalúa presentación, preparación y operación sin scraping ni alterar la realidad.", primary: "Evaluación rápida", secondary: "Agregar propiedad" },
  pricing: { eyebrow: "Rutas claras para lanzar", title: "Comienza con la estancia. Agrega operaciones cuando estés listo.", lede: "El planificador es gratis. Los planes para anfitriones escalan por propiedad y los permisos se aplican en el servidor.", primary: "Elegir plan", secondary: "Probar demo" },
  about: { eyebrow: "Creado alrededor de la hospitalidad", title: "La tecnología debe hacer la estancia más humana.", lede: "VOYNUE conecta operaciones y planificación mediante ALMA—una capa de inteligencia con aprobaciones desarrollada por SEAINT.", primary: "Ver cómo funciona", secondary: "Planear un viaje" },
  contact: { eyebrow: "Mesa de lanzamiento", title: "Pon la primera propiedad en foco.", lede: "Elige tu ruta y VOYNUE te lleva al siguiente paso correcto. El soporte seguro se activa al crear tu cuenta.", primary: "Comenzar", secondary: "Explorar demo" },
  privacy: { eyebrow: "Privacidad por diseño", title: "Personalización sin acceso descuidado.", lede: "VOYNUE limita los registros por organización, propiedad, asignación, dueño o enlace revocable del huésped.", primary: "Ver controles", secondary: "Crear cuenta" },
  terms: { eyebrow: "Límites claros", title: "Software para la estancia—no un reemplazo de responsabilidad.", lede: "Los anfitriones son responsables de la propiedad, seguridad, permisos, compromisos, proveedores, reembolsos y reglas externas.", primary: "Ver límites", secondary: "Contactar" },
  accessibility: { eyebrow: "El acceso es hospitalidad", title: "Diseñado para ser claro, tranquilo y usable.", lede: "Navegación por teclado, foco visible, estructura semántica, contraste, movimiento reducido e información veraz.", primary: "Explorar accesibilidad", secondary: "Planear viaje" },
  "vendor-application": { eyebrow: "Red de socios locales", title: "Forma parte de una estancia memorable.", lede: "Los negocios pueden preparar servicio, precios, área, disponibilidad, cumplimiento y documentos antes de revisión.", primary: "Preparar solicitud", secondary: "Ver experiencias" },
};

for (const [slug, value] of Object.entries(spanishOverrides)) {
  copy.es[slug as PublicSlug] = { ...copy.en[slug as PublicSlug], ...value };
}

const spanishFeatures: Record<PublicSlug, PageCopy["features"]> = {
  "for-travelers": [
    { label: "PRESUPUESTO", title: "Entiende a dónde va el viaje.", body: "La distribución separa actividades, comida, transporte y reserva." },
    { label: "FUENTES", title: "Los hechos mantienen su origen.", body: "Eventos, lugares y enlaces vienen de proveedores configurados." },
    { label: "CONTROL", title: "Cambia el plan al instante.", body: "Ajusta ritmo, intereses y gasto sin comenzar de nuevo." },
  ],
  "for-hosts": [
    { label: "OPERACIONES", title: "Hoy, sin ruido.", body: "Llegadas, salidas, limpieza, aprobaciones y mantenimiento en una vista." },
    { label: "HUÉSPED", title: "Una capa privada por estancia.", body: "Guía, itinerario, mejoras, mensajes y detalles esenciales." },
    { label: "ALMA", title: "Asistencia con límites.", body: "Prepara, explica y resume mientras humanos aprueban acciones importantes." },
  ],
  "for-property-managers": [
    { label: "ACCESO", title: "Los roles se aplican en la base de datos.", body: "Cada persona ve únicamente registros autorizados." },
    { label: "PORTAFOLIO", title: "La atención sube primero.", body: "Problemas, errores de sincronización y trabajo atrasado se priorizan." },
    { label: "REPORTES", title: "Los reportes siguen los registros.", body: "Analíticas calculadas únicamente con datos operativos guardados." },
  ],
  "local-experiences": [
    { label: "EVENTOS", title: "Eventos reales, fuentes directas.", body: "Los resultados conservan estado, lugar, zona horaria y enlace." },
    { label: "LOCAL", title: "La recomendación tiene etiqueta.", body: "Se distingue consejo del anfitrión, dato del proveedor y sugerencia de ALMA." },
    { label: "COMERCIO", title: "Mejoras con términos claros.", body: "Precio, anticipación, cumplimiento, reembolso y aprobación visibles." },
  ],
  "airbnb-audit": [
    { label: "PRESENTACIÓN", title: "La primera impresión, medida.", body: "Imagen principal, orden, título, descripción y fotografías faltantes." },
    { label: "OPERACIONES", title: "La promesa detrás del anuncio.", body: "Reglas, llegada, guía, seguridad, limpieza y comunicación." },
    { label: "ACCIÓN", title: "Prioridades, no consejos vagos.", body: "Problemas críticos, mejoras rápidas y un plan práctico de 30 días." },
  ],
  pricing: [
    { label: "STARTER · $49", title: "Lanza la experiencia del huésped.", body: "Portal, guía, CRM, recomendaciones, reservaciones manuales e iCal." },
    { label: "PRO · $99", title: "Personaliza y crece.", body: "Mejoras, compras, ALMA, auditoría, eventos y herramientas bilingües." },
    { label: "BUSINESS · $199+", title: "Opera el portafolio.", body: "Equipos, limpieza, mantenimiento, inventario, aprobaciones y analíticas." },
  ],
  about: [
    { label: "VOYNUE", title: "La capa del producto.", body: "Operaciones, experiencia del huésped, viajes y comercio local." },
    { label: "ALMA", title: "La capa de inteligencia.", body: "Análisis, redacción, traducción y explicación con fuentes rastreables." },
    { label: "SEAINT", title: "La empresa que lo desarrolla.", body: "Una compañía tecnológica enfocada en sistemas operativos útiles." },
  ],
  contact: [
    { label: "ANFITRIONES", title: "Una propiedad, bien lanzada.", body: "Detalles, iCal, limpieza, guía, portal, mejoras y reportes." },
    { label: "ADMINISTRADORES", title: "Un modelo escalable.", body: "Organización, roles, equipos y planificación de integraciones." },
    { label: "SOCIOS", title: "Incorporación de servicios locales.", body: "Área, precios, disponibilidad, documentos, aprobación y cumplimiento." },
  ],
  privacy: [
    { label: "CONTROL", title: "Exportación y eliminación.", body: "Controles de cuenta y huésped con límites legales y operativos." },
    { label: "CONSENTIMIENTO", title: "El marketing no se asume.", body: "El estado y fecha de consentimiento se guardan." },
    { label: "ACCESO", title: "Privado por defecto.", body: "RLS, archivos privados, URLs firmadas, enlaces expirable y auditoría." },
  ],
  terms: [
    { label: "INDEPENDENCIA", title: "No somos Airbnb.", body: "VOYNUE es independiente y no está afiliado ni respaldado por Airbnb." },
    { label: "ESTIMADOS", title: "Sin resultados garantizados.", body: "Demanda, precios e ingresos potenciales son estimaciones." },
    { label: "PAGOS", title: "Los fondos siguen la configuración.", body: "La distribución no se declara automática hasta activar Stripe Connect." },
  ],
  accessibility: [
    { label: "INTERFAZ", title: "Operable sin adivinar.", body: "Controles con etiquetas, foco, semántica y diseño adaptable." },
    { label: "MOVIMIENTO", title: "El movimiento respeta preferencias.", body: "La animación se reduce cuando el dispositivo lo solicita." },
    { label: "VIAJE", title: "Las necesidades informan el plan.", body: "Preferencias de accesibilidad nunca se usan para decisiones inseguras." },
  ],
  "vendor-application": [
    { label: "PERFIL", title: "Presenta el servicio real.", body: "Identidad, categorías, área, imágenes, enlace y disponibilidad." },
    { label: "CONFIANZA", title: "Documentos cuando se requieren.", body: "Seguro, licencias, reembolsos y aprobación unidos al perfil." },
    { label: "DIVULGACIÓN", title: "La promoción permanece visible.", body: "Patrocinios, comisiones y afiliaciones se identifican claramente." },
  ],
};

for (const slug of Object.keys(spanishFeatures) as PublicSlug[]) copy.es[slug].features = spanishFeatures[slug];

const legalSections = {
  privacy: ["Data collected", "Access and sharing", "Consent and messaging", "Export and deletion"],
  terms: ["Platform relationship", "Host responsibilities", "Payments and estimates", "Acceptable use"],
  accessibility: ["Navigation and focus", "Contrast and motion", "Property information", "Feedback and support"],
};

function InteractiveStage({ slug, locale }: { slug: PublicSlug; locale: Locale }) {
  const es = locale === "es";
  const [range, setRange] = useState(slug === "for-property-managers" ? 8 : 1400);
  const [active, setActive] = useState(0);
  const [checks, setChecks] = useState([true, false, false, true, false]);
  const score = checks.filter(Boolean).length * 20;
  const allocation = useMemo(() => ({ stay: Math.round(range * 0.46), experience: Math.round(range * 0.24), food: Math.round(range * 0.2), reserve: Math.round(range * 0.1) }), [range]);

  if (slug === "for-travelers") return <div className="pv6-budget-stage">
    <header><span>{es ? "PLAN EN VIVO" : "LIVE TRIP SHAPE"}</span><b>${range.toLocaleString()}</b></header>
    <input aria-label={es ? "Presupuesto" : "Budget"} type="range" min="300" max="6000" step="100" value={range} onChange={(event) => setRange(Number(event.target.value))}/>
    <div className="pv6-budget-grid"><div className="pv6-ring" style={{ "--pv6-ring": `${Math.round((allocation.experience / range) * 100)}%` } as React.CSSProperties}><span><b>${allocation.experience}</b><small>{es ? "experiencias" : "experiences"}</small></span></div><div>{Object.entries(allocation).map(([key, value]) => <p key={key}><span>{key}</span><b>${value}</b></p>)}</div></div>
    <footer><span><i/> {es ? "Distribución estimada" : "Estimated allocation"}</span><Link href={`/${locale}/planner`}>{es ? "Abrir planificador" : "Open full planner"} →</Link></footer>
  </div>;

  if (slug === "for-hosts") return <div className="pv6-ops-stage">
    <header><div><i/><span><b>{es ? "VISTA OPERATIVA" : "OPERATING VIEW"}</b><small>{es ? "Sin datos de producción" : "No production data"}</small></span></div><Link href={`/${locale}/host-sandbox`}>{es ? "Abrir demo" : "Open sandbox"} ↗</Link></header>
    <div className="pv6-metric-row">{[es ? "Llegadas" : "Arrivals", es ? "Rotaciones" : "Turnovers", es ? "Aprobaciones" : "Approvals"].map((item) => <article key={item}><span>{item}</span><strong>—</strong><small>{es ? "Conecta datos reales" : "Connect live data"}</small></article>)}</div>
    <div className="pv6-flow"><span>iCal</span><i>→</i><span>{es ? "Reservación" : "Reservation"}</span><i>→</i><span>{es ? "Limpieza" : "Cleaning"}</span><i>→</i><span>{es ? "Lista" : "Ready"}</span></div>
  </div>;

  if (slug === "for-property-managers") return <div className="pv6-portfolio-stage">
    <header><span>{es ? "TAMAÑO DEL PORTAFOLIO" : "PORTFOLIO SIZE"}</span><strong>{range} {es ? "propiedades" : "properties"}</strong></header>
    <input aria-label={es ? "Propiedades" : "Properties"} type="range" min="1" max="100" value={range} onChange={(event) => setRange(Number(event.target.value))}/>
    <div>{["Owner", "Manager", "Property staff", "Cleaner", "Vendor"].map((role, index) => <button onClick={() => setActive(index)} className={active === index ? "active" : ""} key={role}><i>{index + 1}</i><span><b>{role}</b><small>{index < 2 ? "Organization access" : "Assigned records only"}</small></span><em>{active === index ? "Selected" : "View"}</em></button>)}</div>
  </div>;

  if (slug === "local-experiences") return <div className="pv6-provider-stage">
    <header><span>{es ? "CAPAS DE DESCUBRIMIENTO" : "DISCOVERY LAYERS"}</span><b>{["Events", "Places", "Host picks", "Upgrades"][active]}</b></header>
    <div className="pv6-tabs">{["Events", "Places", "Host picks", "Upgrades"].map((item, index) => <button onClick={() => setActive(index)} className={active === index ? "active" : ""} key={item}>{item}</button>)}</div>
    <article><i>{active === 0 ? "T" : active === 1 ? "⌖" : active === 2 ? "H" : "+"}</i><span><b>{active === 0 ? "Ticketmaster Discovery" : active === 1 ? "Places provider" : active === 2 ? "Host-authored recommendations" : "Host-created commerce"}</b><small>{active < 2 ? (es ? "Configuración requerida para datos reales" : "Setup required for live data") : (es ? "Contenido claramente identificado" : "Clearly identified source")}</small></span><em>{active < 2 ? "SETUP" : "READY"}</em></article>
  </div>;

  if (slug === "airbnb-audit") return <div className="pv6-audit-stage">
    <header><span>{es ? "AUTOEVALUACIÓN RÁPIDA" : "QUICK SELF-ASSESSMENT"}</span><strong>{score}<small>/100</small></strong></header>
    <p>{es ? "Marca únicamente lo que tu anuncio ya tiene. Este resultado ilustrativo no reemplaza la auditoría completa." : "Select only what the listing already has. This illustrative score does not replace a complete audit."}</p>
    <div>{["Professional hero photo", "Complete amenity list", "Clear arrival instructions", "Current guidebook", "Accessibility details"].map((item, index) => <button aria-pressed={checks[index]} onClick={() => setChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} key={item}><i>{checks[index] ? "✓" : ""}</i><span>{item}</span></button>)}</div>
  </div>;

  if (slug === "pricing") return <div className="pv6-price-stage">
    <header><span>{es ? "CALCULADORA POR PROPIEDAD" : "PER-PROPERTY CALCULATOR"}</span><strong>{range === 1400 ? 1 : range}</strong></header>
    <input aria-label={es ? "Número de propiedades" : "Property count"} type="range" min="1" max="20" value={range === 1400 ? 1 : range} onChange={(event) => setRange(Number(event.target.value))}/>
    <div>{[{ name: "Starter", price: 49 }, { name: "Pro", price: 99 }].map((plan) => <article key={plan.name}><span>{plan.name}</span><b>${plan.price * (range === 1400 ? 1 : range)}<small>/mo</small></b><em>${plan.price} × {range === 1400 ? 1 : range}</em></article>)}<article className="dark"><span>Business</span><b>$199+<small>/mo</small></b><em>{es ? "+ precio configurado" : "+ configured property pricing"}</em></article></div>
  </div>;

  if (slug === "about") return <div className="pv6-stack-stage">
    <Hologram size="compact" label="A"/>
    <div>{[{ name: "VOYNUE", line: "Experience + operations" }, { name: "ALMA", line: "Grounded intelligence" }, { name: "SEAINT", line: "Company + engineering" }].map((layer, index) => <button onClick={() => setActive(index)} className={active === index ? "active" : ""} key={layer.name}><small>0{index + 1}</small><span><b>{layer.name}</b><em>{layer.line}</em></span></button>)}</div>
  </div>;

  if (slug === "contact") return <div className="pv6-contact-stage">
    <header><span>{es ? "ELIGE TU RUTA" : "CHOOSE YOUR PATH"}</span><b>{es ? "El siguiente paso, sin confusión." : "The right next step, without confusion."}</b></header>
    <div>{[es ? "Tengo una propiedad" : "I have one property", es ? "Administro varias" : "I manage a portfolio", es ? "Soy proveedor local" : "I am a local vendor"].map((item, index) => <button onClick={() => setActive(index)} className={active === index ? "active" : ""} key={item}><i>{index + 1}</i><span>{item}</span><em>→</em></button>)}</div>
    <Link href={`/${locale}/${active === 2 ? "vendor-application" : "signup"}`}>{active === 2 ? (es ? "Preparar solicitud" : "Prepare application") : (es ? "Comenzar configuración" : "Begin onboarding")} <span>↗</span></Link>
  </div>;

  if (slug === "vendor-application") return <div className="pv6-vendor-stage">
    <header><span>{es ? "PREPARACIÓN DE SOLICITUD" : "APPLICATION READINESS"}</span><strong>{score}%</strong></header>
    <div>{["Business identity", "Service area", "Pricing and availability", "Refund terms", "Required documents"].map((item, index) => <button aria-pressed={checks[index]} onClick={() => setChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} key={item}><i>{checks[index] ? "✓" : ""}</i><span>{item}</span></button>)}</div>
    <footer>{es ? "La solicitud real requiere una cuenta verificada." : "A real application requires a verified account."}<Link href={`/${locale}/signup`}>{es ? "Crear cuenta" : "Create account"} →</Link></footer>
  </div>;

  const sections = legalSections[slug as keyof typeof legalSections] ?? ["Independent platform", "Real data", "Approvals", "Security architecture"];
  return <div className="pv6-policy-stage"><header><span>{es ? "EXPLORADOR DE POLÍTICA" : "POLICY EXPLORER"}</span><b>{sections[active]}</b></header><div>{sections.map((item, index) => <button onClick={() => setActive(index)} className={active === index ? "active" : ""} key={item}><i>0{index + 1}</i><span>{item}</span><em>→</em></button>)}</div><article><b>{sections[active]}</b><p>{es ? "Este principio está reflejado en los controles de acceso, flujos y documentación de VOYNUE. Los documentos legales finales deben revisarse antes del lanzamiento público." : "This principle is reflected in VOYNUE access controls, workflows, and documentation. Final legal documents require review before public launch."}</p></article></div>;
}

export function PublicExperience({ locale, slug }: { locale: Locale; slug: PublicSlug }) {
  const page = copy[locale][slug];
  const es = locale === "es";
  return <main className="pv6-main">
    <section className="pv6-hero">
      <div className="pv6-hero-copy">
        <p><i/> {page.index} · {page.eyebrow}</p>
        <h1>{page.title}</h1>
        <span>{page.lede}</span>
        <div><Link className="pv6-primary" href={`/${locale}/${page.primaryHref}`}>{page.primary}<b>→</b></Link><Link className="pv6-secondary" href={`/${locale}/${page.secondaryHref}`}>{page.secondary} ↗</Link></div>
      </div>
      <div className="pv6-stage-shell"><div className="pv6-stage-top"><span><i/><i/><i/></span><b>VOYNUE / {page.eyebrow}</b><em>{es ? "INTERACTIVO" : "INTERACTIVE"}</em></div><InteractiveStage slug={slug} locale={locale}/></div>
    </section>

    <section className="pv6-proof"><span>{es ? "Diseñado para operar" : "Designed to operate"}</span><div><b>{es ? "Datos reales" : "Real data"}</b><i/><b>{es ? "Aprobaciones" : "Approvals"}</b><i/><b>English + Español</b><i/><b>{es ? "Acceso seguro" : "Secure access"}</b></div></section>

    <section className="pv6-story">
      <header><p>{page.index} · {es ? "EL SISTEMA" : "THE SYSTEM"}</p><h2>{es ? "Una experiencia clara por fuera. Una operación rigurosa por dentro." : "A clear experience on the outside. A rigorous operation underneath."}</h2></header>
      <div>{page.features.map((feature, index) => <article key={feature.title}><span>{feature.label}</span><i>0{index + 1}</i><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
    </section>

    <section className="pv6-final"><div className="pv6-final-glow"/><p>VOYNUE · POWERED BY ALMA</p><h2>{es ? "La estancia merece un mejor sistema." : "The stay deserves a better system."}</h2><div><Link href={`/${locale}/host-sandbox`}>{es ? "Probar demo anfitrión" : "Try the host sandbox"}<span>→</span></Link><Link href={`/${locale}/planner`}>{es ? "Planear un viaje" : "Plan a trip"} ↗</Link></div></section>
  </main>;
}
