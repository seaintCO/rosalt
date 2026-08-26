import Link from "next/link";
import { Brand } from "./brand";
import { getLocale } from "@/lib/i18n";

export function Header({ locale }: { locale: string }) {
  const l = getLocale(locale);
  const es = l === "es";

  return (
    <header className="site-header">
      <Brand locale={l} />
      <nav aria-label={es ? "Navegación principal" : "Primary navigation"}>
        <Link href={`/${l}/services`}>{es ? "Servicios" : "Services"}</Link>
        <Link href={`/${l}/maison-ai`}>Maison AI</Link>
        <Link href={`/${l}/packages`}>{es ? "Paquetes" : "Packages"}</Link>
        <Link href={`/${l}/about`}>{es ? "Nosotros" : "About"}</Link>
        <Link className="nav-sandbox" href={`/${l}/demo`}>{es ? "Demo" : "Demo"}<i aria-hidden="true" /></Link>
      </nav>
      <div className="head-actions">
        <Link aria-label={l === "en" ? "Cambiar a español" : "Switch to English"} href={`/${l === "en" ? "es" : "en"}`}>
          {l === "en" ? "ES" : "EN"}
        </Link>
        <Link className="client-login" href={`/${l}/login`}>{es ? "Portal" : "Client portal"}</Link>
        <Link className="start-project" href={`/${l}/start-project`}>{es ? "Comenzar" : "Start project"}</Link>
      </div>
    </header>
  );
}
