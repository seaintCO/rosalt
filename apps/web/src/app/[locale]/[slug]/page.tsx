import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { getLocale } from "@/lib/i18n";
import { AuthPanel } from "@/components/auth-panel";
import { PlannerForm } from "@/components/planner-form";
import { SetupState } from "@/components/setup-state";
import { PublicExperience } from "@/components/public-experience";
import { HostSandbox } from "@/components/host-sandbox";
import { integrationStatus } from "@/lib/env";
import { AboutPage, DemoPage, MaisonAiPage, PackagesPage, ServicesPage, StartProjectPage } from "@/components/maison-content";

const publicSlugs = [
  "for-travelers",
  "for-hosts",
  "for-property-managers",
  "local-experiences",
  "airbnb-audit",
  "pricing",
  "about",
  "contact",
  "privacy",
  "terms",
  "accessibility",
  "vendor-application",
  "services",
  "maison-ai",
  "packages",
  "start-project",
  "demo",
] as const;

type PublicSlug = (typeof publicSlugs)[number];

export function generateStaticParams() {
  return [...publicSlugs, "login", "signup", "planner", "host-sandbox"].map((slug) => ({ slug }));
}

function Footer({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  return <footer className="pv6-footer"><div><b>ROSALT Maison Studios</b><span>MAISON AI · CLIENT DESIGN PORTAL</span></div><nav><Link href={`/${locale}/services`}>{es ? "Servicios" : "Services"}</Link><Link href={`/${locale}/packages`}>{es ? "Paquetes" : "Packages"}</Link><Link href={`/${locale}/about`}>{es ? "Nosotros" : "About"}</Link><Link href={`/${locale}/start-project`}>{es ? "Contacto" : "Contact"}</Link></nav><p>ROSALT Maison Studios provides interior concepts, property planning, styling direction, content support, and contractor coordination assistance. Licensed trade work must be performed by properly licensed professionals.</p></footer>;
}

export default async function PublicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = getLocale(raw);
  const es = locale === "es";

  if (slug === "login" || slug === "signup") return <div className="auth-v6"><Header locale={locale}/><main><section><p><i/> VOYNUE SECURE ACCESS</p><h1>{slug === "login" ? (es ? "Bienvenido de nuevo." : "Welcome back.") : (es ? "Construye la primera estancia." : "Build the first stay.")}</h1><span>{es ? "Acceso seguro para viajeros, anfitriones, equipos, limpiadores y proveedores." : "Secure access for travelers, hosts, teams, cleaners, and vendors."}</span><div><b>01</b><p>{es ? "Sesiones seguras" : "Secure sessions"}</p><b>02</b><p>{es ? "Acceso por función" : "Role-scoped access"}</p><b>03</b><p>{es ? "Actividad auditada" : "Audited activity"}</p></div></section><aside>{integrationStatus.supabase ? <AuthPanel mode={slug as "login" | "signup"} locale={locale}/> : <SetupState title={es ? "Configuración de autenticación requerida" : "Authentication setup required"} instructions={["Create a Supabase project.", "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.", "Enable email, magic link, and Google OAuth in Supabase Auth."]}/>}</aside></main></div>;

  if (slug === "planner") return <div className="planner-page-v5"><Header locale={locale}/><main><section className="planner-page-hero"><p><i/> VOYNUE TRAVEL INTELLIGENCE</p><h1>{es ? "Tu presupuesto. Tu ritmo. Tu viaje." : "Your budget. Your pace. Your trip."}</h1><span>{es ? "Diseña el viaje visualmente y deja que ALMA construya un itinerario usando únicamente datos recuperados de proveedores reales." : "Shape the trip visually, then let ALMA build an itinerary using only facts retrieved from real providers."}</span></section><PlannerForm locale={locale}/></main></div>;

  if (slug === "host-sandbox") return <div className="host-sandbox-v6"><Header locale={locale}/><HostSandbox locale={locale}/></div>;

  if (slug === "services") return <><Header locale={locale}/><ServicesPage locale={locale}/><Footer locale={locale}/></>;
  if (slug === "maison-ai") return <><Header locale={locale}/><MaisonAiPage locale={locale}/><Footer locale={locale}/></>;
  if (slug === "packages") return <><Header locale={locale}/><PackagesPage locale={locale}/><Footer locale={locale}/></>;
  if (slug === "about") return <><Header locale={locale}/><AboutPage/><Footer locale={locale}/></>;
  if (slug === "start-project") return <><Header locale={locale}/><StartProjectPage/><Footer locale={locale}/></>;
  if (slug === "demo") return <><Header locale={locale}/><DemoPage locale={locale}/><Footer locale={locale}/></>;

  if (!publicSlugs.includes(slug as PublicSlug)) notFound();

  return <div className="public-v6"><div className="pv6-announcement"><span>{es ? "Ahora incorporando propiedades en Middle Tennessee" : "Now onboarding properties in Middle Tennessee"}</span><Link href={`/${locale}/host-sandbox`}>{es ? "Probar demo" : "Try the host demo"} ↗</Link></div><Header locale={locale}/><PublicExperience locale={locale} slug={slug as PublicSlug}/><Footer locale={locale}/></div>;
}
