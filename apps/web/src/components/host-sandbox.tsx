"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Hologram } from "@/components/hologram";

type SandboxTab = "today" | "calendar" | "cleaning" | "guest" | "upgrades";

const tabIcons: Record<SandboxTab, string> = { today: "⌁", calendar: "□", cleaning: "✓", guest: "◇", upgrades: "+" };

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  return Math.max(0, Math.ceil((new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()) / 86400000));
}

export function HostSandbox({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  const [launched, setLaunched] = useState(false);
  const [property, setProperty] = useState("");
  const [guest, setGuest] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [bookingValue, setBookingValue] = useState("");
  const [tab, setTab] = useState<SandboxTab>("today");
  const [cleaning, setCleaning] = useState([false, false, false, false]);
  const [ready, setReady] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [upgradeName, setUpgradeName] = useState("");
  const [upgradePrice, setUpgradePrice] = useState("");
  const nights = useMemo(() => daysBetween(arrival, departure), [arrival, departure]);
  const cleaningPercent = Math.round((cleaning.filter(Boolean).length / cleaning.length) * 100);

  function launch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property || !guest || !arrival || !departure || nights < 1) return;
    setLaunched(true);
  }

  function reset() {
    setLaunched(false);
    setTab("today");
    setCleaning([false, false, false, false]);
    setReady(false);
    setAddressVisible(false);
    setUpgradeName("");
    setUpgradePrice("");
  }

  if (!launched) return <main className="hs6-launch">
    <section className="hs6-intro">
      <p><i/> MAISON AI HOST SANDBOX</p>
      <h1>{es ? "Mira cómo funciona antes de conectar tu propiedad." : "See how it works before connecting your property."}</h1>
      <span>{es ? "Crea una estancia de práctica con información que tú elijas. No se guarda, no llama proveedores y nunca aparece en producción." : "Create a practice stay using details you choose. Nothing is stored, no providers are called, and it never appears in production."}</span>
      <div className="hs6-safety"><i>✓</i><p><b>{es ? "Espacio aislado" : "Isolated preview"}</b><small>{es ? "Datos temporales en esta pestaña solamente" : "Temporary data in this browser tab only"}</small></p></div>
    </section>
    <form className="hs6-setup-card" onSubmit={launch}>
      <header><span>01 · {es ? "CREAR ESCENARIO" : "CREATE A SCENARIO"}</span><b>{es ? "Tu estancia de práctica" : "Your practice stay"}</b></header>
      <label><span>{es ? "Nombre de propiedad" : "Property name"}</span><input required value={property} onChange={(event) => setProperty(event.target.value)} placeholder={es ? "Escribe un nombre" : "Enter a property name"}/></label>
      <label><span>{es ? "Nombre del huésped" : "Guest name"}</span><input required value={guest} onChange={(event) => setGuest(event.target.value)} placeholder={es ? "Escribe un nombre de práctica" : "Enter a practice guest name"}/></label>
      <div><label><span>{es ? "Llegada" : "Arrival"}</span><input required type="date" value={arrival} onChange={(event) => setArrival(event.target.value)}/></label><label><span>{es ? "Salida" : "Departure"}</span><input required min={arrival} type="date" value={departure} onChange={(event) => setDeparture(event.target.value)}/></label></div>
      <label><span>{es ? "Valor de reservación (opcional)" : "Booking value (optional)"}</span><input min="0" step="0.01" type="number" value={bookingValue} onChange={(event) => setBookingValue(event.target.value)} placeholder="0.00"/></label>
      <button type="submit" disabled={nights < 1}>{es ? "Abrir espacio del anfitrión" : "Open host workspace"}<span>→</span></button>
      <small>{es ? "MAISON AI es independiente y no está afiliado ni respaldado por Airbnb." : "MAISON AI is independent and is not affiliated with or endorsed by Airbnb."}</small>
    </form>
  </main>;

  const tabs: Array<{ key: SandboxTab; label: string }> = [
    { key: "today", label: es ? "Hoy" : "Today" },
    { key: "calendar", label: es ? "Calendario" : "Calendar" },
    { key: "cleaning", label: es ? "Limpieza" : "Cleaning" },
    { key: "guest", label: es ? "Portal huésped" : "Guest portal" },
    { key: "upgrades", label: es ? "Mejoras" : "Upgrades" },
  ];

  return <main className="hs6-workspace">
    <aside className="hs6-sidebar">
      <Link href={`/${locale}`} className="hs6-brand"><b>MAISON AI</b><small>POWERED BY MAISON AI</small></Link>
      <div className="hs6-preview-badge"><i/><span><b>{es ? "MODO DEMO" : "SANDBOX MODE"}</b><small>{es ? "No guardado" : "Not saved"}</small></span></div>
      <nav>{tabs.map((item) => <button key={item.key} onClick={() => setTab(item.key)} className={tab === item.key ? "active" : ""}><i>{tabIcons[item.key]}</i><span>{item.label}</span></button>)}</nav>
      <div className="hs6-side-property"><small>{es ? "PROPIEDAD" : "PROPERTY"}</small><b>{property}</b><span>{guest} · {nights} {es ? "noches" : "nights"}</span></div>
      <button className="hs6-reset" onClick={reset}>{es ? "Reiniciar demo" : "Reset sandbox"}</button>
    </aside>

    <section className="hs6-main">
      <header className="hs6-topbar"><div><span>{es ? "VISTA DEL ANFITRIÓN" : "HOST VIEW"}</span><b>{property}</b></div><div><span className="hs6-live"><i/>{es ? "Vista interactiva" : "Interactive preview"}</span><Link href={`/${locale}/signup`}>{es ? "Conectar datos reales" : "Connect live data"} ↗</Link></div></header>

      {tab === "today" && <div className="hs6-page">
        <div className="hs6-heading"><p>01 · {es ? "CENTRO DE MANDO" : "COMMAND CENTER"}</p><h1>{es ? "Todo lo importante, en calma." : "Everything important, kept calm."}</h1><span>{es ? "Estos valores se derivan únicamente del escenario que acabas de ingresar." : "These values are derived only from the practice scenario you entered."}</span></div>
        <div className="hs6-kpis"><article><span>{es ? "Estancia" : "Stay"}</span><strong>1</strong><small>{guest}</small></article><article><span>{es ? "Noches" : "Nights"}</span><strong>{nights}</strong><small>{arrival} → {departure}</small></article><article><span>{es ? "Limpieza" : "Cleaning"}</span><strong>{cleaningPercent}%</strong><small>{cleaningPercent === 100 ? (es ? "Lista para aprobar" : "Ready for approval") : (es ? "Lista pendiente" : "Checklist pending")}</small></article><article><span>{es ? "Valor ingresado" : "Entered value"}</span><strong>{bookingValue ? `$${Number(bookingValue).toLocaleString()}` : "—"}</strong><small>{bookingValue ? (es ? "Proporcionado por ti" : "Entered by you") : (es ? "No proporcionado" : "Not provided")}</small></article></div>
        <div className="hs6-today-grid"><article className="hs6-stay-card"><header><span>{es ? "ESTANCIA ACTIVA" : "ACTIVE PRACTICE STAY"}</span><em>{es ? "DEMO" : "SANDBOX"}</em></header><h2>{guest}</h2><p>{arrival} → {departure}</p><div><button onClick={() => setTab("guest")}>{es ? "Abrir portal" : "Open guest portal"}<span>→</span></button><button onClick={() => setTab("cleaning")}>{es ? "Ver limpieza" : "View cleaning"}<span>→</span></button></div></article><article className="hs6-alma-card"><Hologram size="compact" label="A"/><span>MAISON AI</span><h2>{es ? "La próxima acción está clara." : "The next action is clear."}</h2><p>{cleaningPercent < 100 ? (es ? "Completa la lista de limpieza antes de marcar la propiedad lista." : "Complete the cleaning checklist before marking the property ready.") : ready ? (es ? "La propiedad está marcada como lista en esta demo." : "The property is marked ready in this sandbox.") : (es ? "La limpieza está completa. La aprobación del anfitrión sigue pendiente." : "Cleaning is complete. Host approval is still pending.")}</p></article></div>
      </div>}

      {tab === "calendar" && <div className="hs6-page"><div className="hs6-heading"><p>02 · {es ? "CALENDARIO" : "CALENDAR"}</p><h1>{es ? "Una estancia, puesta en contexto." : "One stay, placed in context."}</h1><span>{es ? "En producción, iCal sincroniza reservaciones y bloqueos de forma idempotente." : "In production, iCal synchronizes reservations and blocked dates idempotently."}</span></div><div className="hs6-calendar"><header><b>{es ? "Vista de estancia" : "Stay timeline"}</b><span>{nights} {es ? "noches" : "nights"}</span></header><div className="hs6-calendar-days">{Array.from({ length: Math.min(Math.max(nights + 4, 7), 14) }, (_, index) => <div className={index >= 2 && index < nights + 2 ? "booked" : ""} key={index}><span>{index + 1}</span>{index === 2 && <b>{es ? "Llegada" : "Arrival"}</b>}{index === nights + 1 && <b>{es ? "Salida" : "Departure"}</b>}</div>)}</div><footer><span><i/>{es ? "Estancia ingresada" : "Entered practice stay"}</span><em>{es ? "No conectado a Airbnb" : "Not connected to Airbnb"}</em></footer></div></div>}

      {tab === "cleaning" && <div className="hs6-page"><div className="hs6-heading"><p>03 · {es ? "FLUJO DE LIMPIEZA" : "CLEANING WORKFLOW"}</p><h1>{es ? "De salida a propiedad lista." : "From checkout to property ready."}</h1><span>{es ? "Prueba el flujo de finalización y aprobación." : "Try the completion and host-approval workflow."}</span></div><div className="hs6-cleaning-grid"><article><header><span>{es ? "LISTA DE HABITACIONES" : "ROOM CHECKLIST"}</span><strong>{cleaningPercent}%</strong></header>{[es ? "Cocina y superficies" : "Kitchen and surfaces", es ? "Habitaciones y ropa de cama" : "Bedrooms and linens", es ? "Baños y suministros" : "Bathrooms and supplies", es ? "Fotos finales revisadas" : "Final photos reviewed"].map((item, index) => <button key={item} onClick={() => { setCleaning((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value)); setReady(false); }}><i>{cleaning[index] ? "✓" : ""}</i><span>{item}</span><em>{cleaning[index] ? (es ? "Completo" : "Complete") : (es ? "Pendiente" : "Pending")}</em></button>)}</article><article className="hs6-ready-card"><div className="hs6-ready-ring" style={{ "--ready": `${cleaningPercent}%` } as React.CSSProperties}><span>{cleaningPercent}%</span></div><h2>{ready ? (es ? "Propiedad lista" : "Property ready") : (es ? "Aprobación pendiente" : "Approval pending")}</h2><p>{cleaningPercent < 100 ? (es ? "Completa todos los puntos primero." : "Complete every checklist item first.") : (es ? "El anfitrión puede confirmar el estado final." : "The host can confirm final readiness.")}</p><button disabled={cleaningPercent < 100 || ready} onClick={() => setReady(true)}>{ready ? "✓" : (es ? "Marcar propiedad lista" : "Mark property ready")}</button></article></div></div>}

      {tab === "guest" && <div className="hs6-page"><div className="hs6-heading"><p>04 · {es ? "PORTAL DEL HUÉSPED" : "GUEST PORTAL"}</p><h1>{es ? "La estancia, en la mano del huésped." : "The stay, in the guest’s hand."}</h1><span>{es ? "La dirección y los detalles sensibles siguen las reglas del estado de la reservación." : "Address and sensitive details follow reservation-status visibility rules."}</span></div><div className="hs6-guest-stage"><div className="hs6-phone"><header><b>MAISON AI</b><em>{es ? "PORTAL SEGURO" : "SECURE PORTAL"}</em></header><span>{property}</span><h2>{es ? `Bienvenido, ${guest}.` : `Welcome, ${guest}.`}</h2><p>{arrival} → {departure}</p><article><small>{es ? "DIRECCIÓN" : "ADDRESS"}</small><b>{addressVisible ? (es ? "Dirección ingresada por el anfitrión" : "Host-configured address") : "••••••••••••••"}</b><button onClick={() => setAddressVisible((value) => !value)}>{addressVisible ? (es ? "Ocultar" : "Hide") : (es ? "Mostrar vista" : "Preview reveal")}</button></article><Link href={`/${locale}/planner`}>{es ? "Crear mi viaje" : "Build my trip"}<span>→</span></Link></div><div className="hs6-portal-notes"><span>{es ? "CONTROLES DEL PORTAL" : "PORTAL CONTROLS"}</span><p><i>✓</i>{es ? "Enlace firmado, expirable y revocable" : "Signed, expiring, revocable link"}</p><p><i>✓</i>{es ? "No requiere cuenta para uso básico" : "No account required for basic use"}</p><p><i>✓</i>{es ? "Solo contexto mínimo de la reservación" : "Minimum required reservation context"}</p><p><i>✓</i>{es ? "Guía e itinerario disponibles sin conexión" : "Guide and itinerary available offline"}</p></div></div></div>}

      {tab === "upgrades" && <div className="hs6-page"><div className="hs6-heading"><p>05 · {es ? "MEJORAS DEL ANFITRIÓN" : "HOST UPGRADES"}</p><h1>{es ? "Crea una mejora con términos claros." : "Create an upgrade with clear terms."}</h1><span>{es ? "Esta vista previa no cobra ni crea un producto real." : "This sandbox does not charge a card or create a live product."}</span></div><div className="hs6-upgrade-stage"><form onSubmit={(event) => event.preventDefault()}><label><span>{es ? "Nombre de mejora" : "Upgrade name"}</span><input value={upgradeName} onChange={(event) => setUpgradeName(event.target.value)} placeholder={es ? "Ej. llegada temprana" : "e.g. Early check-in"}/></label><label><span>{es ? "Precio de práctica" : "Practice price"}</span><input min="0" step="0.01" type="number" value={upgradePrice} onChange={(event) => setUpgradePrice(event.target.value)} placeholder="0.00"/></label><p><i>i</i>{es ? "El checkout real requiere Stripe configurado, términos, disponibilidad y webhooks verificados." : "Live checkout requires configured Stripe, terms, availability, and verified webhooks."}</p></form><article><header><span>{es ? "VISTA DEL HUÉSPED" : "GUEST VIEW"}</span><em>{es ? "BORRADOR" : "DRAFT"}</em></header><div className="hs6-upgrade-image"><Hologram size="compact" label="+"/></div><h2>{upgradeName || (es ? "Tu mejora aparecerá aquí" : "Your upgrade appears here")}</h2><p>{upgradePrice ? `$${Number(upgradePrice).toFixed(2)}` : "—"}</p><button disabled>{es ? "Checkout desactivado en demo" : "Checkout disabled in sandbox"}</button></article></div></div>}
    </section>
  </main>;
}
