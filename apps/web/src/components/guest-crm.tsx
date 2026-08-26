"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Hologram } from "@/components/hologram";

export type GuestCrmRecord = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  preferredLanguage: string;
  internalNotes: string | null;
  lifetimeValue: number;
  upgradeValue: number;
  crmStage: string;
  tags: string[];
  lastContactAt: string | null;
  createdAt: string;
  preferences: { interests: string[]; occasion: string | null; dietaryPreferences: string[]; accessibilityNeeds: string | null; travelPace: string | null } | null;
  reservations: Array<{ id: string; arrivalDate: string; departureDate: string; status: string; grossBookingValue: number | null; propertyName: string }>;
};

const stages = ["new", "upcoming", "in_stay", "past", "vip", "do_not_contact"] as const;

function stageLabel(stage: string, es: boolean) {
  const labels: Record<string, [string, string]> = {
    new: ["New", "Nuevo"], upcoming: ["Upcoming", "Próximo"], in_stay: ["In stay", "En estancia"], past: ["Past guest", "Huésped anterior"], vip: ["VIP", "VIP"], do_not_contact: ["Do not contact", "No contactar"],
  };
  return labels[stage]?.[es ? 1 : 0] ?? stage.replaceAll("_", " ");
}

function money(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function GuestCrm({ locale, organizationId, initialGuests }: { locale: string; organizationId: string; initialGuests: GuestCrmRecord[] }) {
  const es = locale === "es";
  const [guests, setGuests] = useState(initialGuests);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [selectedId, setSelectedId] = useState(initialGuests[0]?.id ?? "");
  const [composer, setComposer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => guests.filter((guest) => {
    const matchesStage = stage === "all" || guest.crmStage === stage;
    const haystack = `${guest.fullName} ${guest.email ?? ""} ${guest.phone ?? ""} ${guest.tags.join(" ")}`.toLowerCase();
    return matchesStage && haystack.includes(query.trim().toLowerCase());
  }), [guests, query, stage]);
  const selected = guests.find((guest) => guest.id === selectedId) ?? filtered[0] ?? null;
  const repeatGuests = guests.filter((guest) => guest.reservations.length > 1).length;
  const liveStays = guests.filter((guest) => guest.crmStage === "in_stay").length;
  const totalValue = guests.reduce((sum, guest) => sum + guest.lifetimeValue + guest.upgradeValue, 0);

  async function createGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/crm/guests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ organizationId, fullName: form.get("fullName"), email: form.get("email") || null, phone: form.get("phone") || null, preferredLanguage: form.get("preferredLanguage"), internalNotes: form.get("internalNotes") || null, tags: String(form.get("tags") || "").split(",").map((item) => item.trim()).filter(Boolean) }) });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setError(result.error || (es ? "No se pudo guardar el huésped." : "The guest could not be saved.")); return; }
    setGuests((current) => [result.guest, ...current]);
    setSelectedId(result.guest.id); setComposer(false);
  }

  async function updateGuest(id: string, changes: Record<string, unknown>) {
    const previous = guests;
    setGuests((current) => current.map((guest) => guest.id === id ? { ...guest, ...changes } as GuestCrmRecord : guest));
    setError("");
    const response = await fetch("/api/crm/guests", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ organizationId, id, ...changes }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setGuests(previous); setError(result.error || (es ? "No se pudo actualizar." : "The update could not be saved.")); return false; }
    setGuests((current) => current.map((guest) => guest.id === id ? { ...guest, ...result.guest, reservations: guest.reservations, preferences: guest.preferences } : guest));
    return true;
  }

  async function editGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const saved = await updateGuest(selected.id, {
      fullName: form.get("fullName"),
      email: form.get("email") || null,
      phone: form.get("phone") || null,
      preferredLanguage: form.get("preferredLanguage"),
      internalNotes: form.get("internalNotes") || null,
      tags: String(form.get("tags") || "").split(",").map((item) => item.trim()).filter(Boolean),
    });
    setBusy(false);
    if (saved) setEditing(false);
  }

  return <div className="guest-crm">
    <header className="guest-crm-head">
      <div><p>VOYNUE · {es ? "CRM DE HUÉSPEDES" : "GUEST CRM"}</p><h1>{es ? "Relaciones, sin ruido." : "Relationships, without the noise."}</h1><span>{es ? "Registros reales de tu organización. Nada de datos de demostración." : "Real records from your organization. No demo data."}</span></div>
      <div className="guest-crm-actions"><label><span className="sr-only">Search</span><i>⌕</i><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={es ? "Buscar huésped" : "Search guests"}/></label><button onClick={() => setComposer(true)}>＋ {es ? "Agregar huésped" : "Add guest"}</button></div>
    </header>

    {error && <div className="guest-crm-error" role="alert"><span>{error}</span><button onClick={() => setError("")}>×</button></div>}

    <section className="guest-crm-metrics">
      <article><span>{es ? "Huéspedes" : "Guests"}</span><strong>{guests.length}</strong><small>{es ? "registros reales" : "live records"}</small></article>
      <article><span>{es ? "En estancia" : "In stay"}</span><strong>{liveStays}</strong><small>{es ? "ahora" : "right now"}</small></article>
      <article><span>{es ? "Repetidos" : "Repeat guests"}</span><strong>{repeatGuests}</strong><small>{es ? "2+ estancias" : "2+ stays"}</small></article>
      <article><span>{es ? "Valor registrado" : "Recorded value"}</span><strong>{money(totalValue, locale)}</strong><small>{es ? "reservas + mejoras" : "stays + upgrades"}</small></article>
    </section>

    <nav className="guest-crm-stages">
      <button className={stage === "all" ? "active" : ""} onClick={() => setStage("all")}><span>{es ? "Todos" : "All"}</span><b>{guests.length}</b></button>
      {stages.map((item) => <button key={item} className={stage === item ? "active" : ""} onClick={() => setStage(item)}><span>{stageLabel(item, es)}</span><b>{guests.filter((guest) => guest.crmStage === item).length}</b></button>)}
    </nav>

    <section className="guest-crm-workspace">
      <div className="guest-crm-list">
        <header><span>{es ? "PERSONAS" : "PEOPLE"}</span><b>{filtered.length}</b></header>
        {filtered.map((guest) => <button className={selected?.id === guest.id ? "active" : ""} key={guest.id} onClick={() => setSelectedId(guest.id)}><i>{guest.fullName.slice(0, 1).toUpperCase()}</i><span><b>{guest.fullName}</b><small>{guest.email || guest.phone || (es ? "Sin contacto" : "No contact details")}</small></span><em>{stageLabel(guest.crmStage, es)}</em></button>)}
        {!filtered.length && <div className="guest-crm-empty"><Hologram size="micro"/><b>{es ? "No hay registros aquí." : "No records here."}</b><span>{es ? "Ajusta la búsqueda o agrega tu primer huésped." : "Adjust the filter or add your first guest."}</span></div>}
      </div>

      <div className="guest-crm-detail">
        {selected ? <>
          <header><div className="guest-avatar">{selected.fullName.slice(0, 1).toUpperCase()}</div><div><span>{stageLabel(selected.crmStage, es)}</span><h2>{selected.fullName}</h2><p>{selected.email || "—"} · {selected.phone || "—"}</p></div><select aria-label="Guest lifecycle" value={selected.crmStage} onChange={(event) => void updateGuest(selected.id, { crmStage: event.target.value })}>{stages.map((item) => <option value={item} key={item}>{stageLabel(item, es)}</option>)}</select></header>
          <div className="guest-detail-grid"><article><span>{es ? "ESTANCIAS" : "STAYS"}</span><strong>{selected.reservations.length}</strong></article><article><span>{es ? "VALOR" : "VALUE"}</span><strong>{money(selected.lifetimeValue + selected.upgradeValue, locale)}</strong></article><article><span>{es ? "IDIOMA" : "LANGUAGE"}</span><strong>{selected.preferredLanguage.toUpperCase()}</strong></article></div>
          <section className="guest-contact-actions"><Link href={`/${locale}/dashboard/messages`}>✉ {es ? "Abrir mensajes" : "Open messages"}</Link><button onClick={() => void updateGuest(selected.id, { lastContactAt: new Date().toISOString() })}>✓ {es ? "Registrar contacto" : "Log contact"}</button></section>
          <section className="guest-profile-section"><header><span>{es ? "PERFIL" : "PROFILE"}</span><div><small>{selected.lastContactAt ? `${es ? "Último contacto" : "Last contact"}: ${new Date(selected.lastContactAt).toLocaleDateString(locale)}` : (es ? "Sin contacto registrado" : "No contact logged")}</small><button onClick={() => setEditing(true)}>{es ? "Editar" : "Edit"}</button></div></header><div className="guest-tags">{selected.tags.map((tag) => <i key={tag}>{tag}</i>)}{!selected.tags.length && <span>{es ? "Sin etiquetas" : "No tags"}</span>}</div><p>{selected.internalNotes || (es ? "No hay notas internas." : "No internal notes yet.")}</p></section>
          <section className="guest-stays"><header><span>{es ? "HISTORIAL DE ESTANCIAS" : "STAY HISTORY"}</span></header>{selected.reservations.map((reservation) => <article key={reservation.id}><i>⌂</i><span><b>{reservation.propertyName}</b><small>{reservation.arrivalDate} → {reservation.departureDate}</small></span><em>{reservation.status}</em><strong>{reservation.grossBookingValue == null ? "—" : money(reservation.grossBookingValue, locale)}</strong></article>)}{!selected.reservations.length && <p>{es ? "Las reservaciones vinculadas aparecerán aquí." : "Linked reservations will appear here."}</p>}</section>
        </> : <div className="guest-crm-no-selection"><Hologram/><h2>{es ? "Selecciona un huésped." : "Select a guest."}</h2><p>{es ? "El perfil, historial y valor aparecerán aquí." : "Their profile, history, and value will appear here."}</p></div>}
      </div>
    </section>

    {composer && <div className="guest-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposer(false); }}><form onSubmit={createGuest}><header><div><span>{es ? "NUEVO REGISTRO" : "NEW RECORD"}</span><h2>{es ? "Agregar huésped" : "Add guest"}</h2></div><button type="button" onClick={() => setComposer(false)}>×</button></header><label>{es ? "Nombre completo" : "Full name"}<input name="fullName" required minLength={2} maxLength={140} autoFocus/></label><div><label>Email<input name="email" type="email"/></label><label>{es ? "Teléfono" : "Phone"}<input name="phone" type="tel"/></label></div><div><label>{es ? "Idioma" : "Language"}<select name="preferredLanguage"><option value="en">English</option><option value="es">Español</option></select></label><label>{es ? "Etiquetas" : "Tags"}<input name="tags" placeholder={es ? "VIP, familia" : "VIP, family"}/></label></div><label>{es ? "Notas internas" : "Internal notes"}<textarea name="internalNotes" maxLength={2000}/></label>{error && <p role="alert">{error}</p>}<button className="guest-save" disabled={busy}>{busy ? (es ? "Guardando…" : "Saving…") : (es ? "Guardar huésped" : "Save guest")}</button></form></div>}
    {editing && selected && <div className="guest-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false); }}><form onSubmit={editGuest}><header><div><span>{es ? "PERFIL DEL HUÉSPED" : "GUEST PROFILE"}</span><h2>{es ? "Editar relación" : "Edit relationship"}</h2></div><button type="button" onClick={() => setEditing(false)}>×</button></header><label>{es ? "Nombre completo" : "Full name"}<input name="fullName" required minLength={2} maxLength={140} defaultValue={selected.fullName} autoFocus/></label><div><label>Email<input name="email" type="email" defaultValue={selected.email ?? ""}/></label><label>{es ? "Teléfono" : "Phone"}<input name="phone" type="tel" defaultValue={selected.phone ?? ""}/></label></div><div><label>{es ? "Idioma" : "Language"}<select name="preferredLanguage" defaultValue={selected.preferredLanguage}><option value="en">English</option><option value="es">Español</option></select></label><label>{es ? "Etiquetas" : "Tags"}<input name="tags" defaultValue={selected.tags.join(", ")} placeholder={es ? "VIP, familia" : "VIP, family"}/></label></div><label>{es ? "Notas internas" : "Internal notes"}<textarea name="internalNotes" maxLength={2000} defaultValue={selected.internalNotes ?? ""}/></label>{error && <p role="alert">{error}</p>}<button className="guest-save" disabled={busy}>{busy ? (es ? "Guardando…" : "Saving…") : (es ? "Guardar cambios" : "Save changes")}</button></form></div>}
  </div>;
}
