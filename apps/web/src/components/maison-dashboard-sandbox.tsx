"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Section = "overview" | "approvals" | "analytics" | "properties" | "guests" | "calendar" | "cleaning" | "maintenance" | "inventory" | "upgrades" | "messages" | "integrations" | "listing-audit";

const titles: Record<string, string> = {
  overview: "Portfolio command center", approvals: "Approval center",
  analytics: "Property intelligence", properties: "Property library",
  guests: "Guest & Client CRM", calendar: "Stays & reservations",
  cleaning: "Readiness workflow", maintenance: "Maintenance",
  inventory: "Inventory", upgrades: "Guest experience upgrades",
  messages: "Client communications", integrations: "Integration health",
  "listing-audit": "Property audit",
};

function Metric({ label, value, note, percent }: { label: string; value: string; note: string; percent: string }) {
  return <article>
    <span>{label}</span><strong>{value}</strong><small>{note}</small>
    <i style={{ "--value": percent } as CSSProperties} />
  </article>;
}

function Metrics({ tasks, approved }: { tasks: number; approved: boolean }) {
  return <section className="msd-metrics">
    <Metric label="PROPERTY READINESS" value="78%" note="↑ 12% since intake" percent="78%" />
    <Metric label="PROJECT BUDGET" value="$7,500" note="$4,850 allocated" percent="64%" />
    <Metric label="OPEN TASKS" value={String(tasks)} note="2 due this week" percent="42%" />
    <Metric label="CLIENT DECISIONS" value={approved ? "4/4" : "3/4"} note={approved ? "All approved" : "One awaiting review"} percent={approved ? "100%" : "75%"} />
  </section>;
}

function Chart({ range, setRange }: { range: string; setRange: (value: "30D" | "90D" | "YTD") => void }) {
  const values = range === "30D" ? [28, 44, 39, 58, 49, 72, 68] : range === "90D" ? [31, 39, 47, 44, 63, 59, 76] : [26, 36, 43, 54, 60, 71, 82];
  return <article className="msd-chart">
    <header>
      <div><span>PROJECT INTELLIGENCE</span><h2>Momentum over time</h2></div>
      <div className="msd-range">{(["30D", "90D", "YTD"] as const).map(item => <button key={item} className={range === item ? "active" : ""} onClick={() => setRange(item)}>{item}</button>)}</div>
    </header>
    <div className="msd-bars">{values.map((value, index) => <i key={index} style={{ height: value + "%" }}><em>{value}</em></i>)}</div>
    <footer><span>Property intake</span><span>Direction</span><span>Launch</span></footer>
  </article>;
}

function Board({ title, rows, onComplete }: { title: string; rows: string[]; onComplete: () => void }) {
  return <section className="msd-board msd-focus">
    <header><div><span>{title}</span><h2>Clear handoff, calm execution.</h2></div><button onClick={onComplete}>Add a sample item</button></header>
    {rows.map((row, index) => <button key={row} onClick={onComplete}>
      <i>{String(index + 1).padStart(2, "0")}</i>
      <span><b>{row}</b><small>{index === 0 ? "Assigned · due today" : "Ready for next review"}</small></span>
      <em>Mark complete →</em>
    </button>)}
  </section>;
}

function Content({ section, tasks, setTasks, approved, setApproved }: {
  section: Section; tasks: number; setTasks: (value: number) => void; approved: boolean; setApproved: (value: boolean) => void;
}) {
  const [range, setRange] = useState<"30D" | "90D" | "YTD">("30D");
  const [filter, setFilter] = useState("All");
  const addTask = () => setTasks(tasks + 1);
  const completeTask = () => setTasks(Math.max(0, tasks - 1));
  const metrics = <Metrics tasks={tasks} approved={approved} />;
  const filters = <div className="msd-filter">{["All", "Ready", "In review"].map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>;

  if (section === "guests") {
    const clients = ["West End Guest Suite", "Vanderbilt Listing Refresh", "The Gallatin Airbnb"];
    return <>{metrics}<section className="msd-grid msd-focus">
      <article className="msd-list"><header><div><span>CLIENT PIPELINE</span><h2>Relationships, organized.</h2></div>{filters}</header>
        {clients.filter((_, index) => filter === "All" || (filter === "Ready" ? index === 0 : index > 0)).map((client, index) => <button key={client} onClick={completeTask}>
          <i>{client[0]}</i><span><b>{client}</b><small>{index === 0 ? "Design direction · approval pending" : "Property intake · follow-up ready"}</small></span><em>{index === 0 ? "Review" : "Active"}</em>
        </button>)}
      </article>
      <article className="msd-notes"><span>CLIENT NOTE</span><h2>West End Guest Suite</h2><p>Warm-neutral room direction is ready for review. A client can approve, comment, and keep their project moving from Maison Portal.</p><button onClick={() => setApproved(!approved)}>{approved ? "Follow-up logged ✓" : "Log sample follow-up"}</button></article>
    </section></>;
  }

  if (section === "calendar") {
    const days = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22", "Sat 23", "Sun 24"];
    return <>{metrics}<section className="msd-calendar msd-focus"><header><div><span>PROPERTY SCHEDULE</span><h2>August · sample stays</h2></div>{filters}</header>
      <div className="msd-week">{days.map((day, index) => <div key={day}><b>{day}</b><button className={index === 1 || index === 4 ? "arrival" : ""} onClick={addTask}>{index === 1 ? "Arrival · West End" : index === 4 ? "Turnover · Gallatin" : index === 5 ? "Stay · Vanderbilt" : "Available"}</button></div>)}</div>
    </section></>;
  }

  if (section === "cleaning" || section === "maintenance" || section === "inventory") {
    const rows = section === "cleaning" ? ["Fresh linens & bed styling", "Coffee station restock", "Arrival photo check"] : section === "maintenance" ? ["Replace bedside lamp", "Confirm paint touch-up", "Review door hardware"] : ["Towels · 18 of 24", "Coffee pods · 42 of 60", "Amenity kits · 6 of 12"];
    const title = section === "cleaning" ? "READINESS BOARD" : section === "maintenance" ? "SERVICE BOARD" : "STOCK BOARD";
    return <>{metrics}<Board title={title} rows={rows} onComplete={completeTask} /></>;
  }

  if (section === "messages") {
    return <>{metrics}<section className="msd-message-layout msd-focus">
      <article>{["Rosehna · Design approval", "West End · Arrival notes", "Altamirano · Content direction"].map((name, index) => <button key={name} className={index === 0 ? "selected" : ""}><b>{name}</b><small>{index === 0 ? "Can we review the palette?" : "Last update · sample"}</small></button>)}</article>
      <article><span>PRIVATE CLIENT ROOM</span><h2>Rosehna · Design approval</h2><p>Hi, the warm-neutral bedroom direction is ready in your Maison Portal. Would you like to approve it or leave notes?</p><p className="from">I love the direction. Please keep the walnut nightstands.</p><button onClick={() => setApproved(!approved)}>{approved ? "Sample reply queued ✓" : "Queue sample reply"}</button></article>
    </section></>;
  }

  if (section === "approvals" || section === "upgrades" || section === "listing-audit") {
    const label = section === "approvals" ? "CLIENT DECISIONS" : section === "upgrades" ? "EXPERIENCE UPGRADES" : "PROPERTY REVIEW";
    return <>{metrics}<section className="msd-approval-stack msd-focus"><header><span>{label}</span><h2>Decisions with context.</h2></header>
      {["Warm neutral bedroom scheme", "Arrival amenity direction", "Listing photo shot list"].map((item, index) => <article key={item}><i>{String(index + 1).padStart(2, "0")}</i><div><b>{item}</b><small>{index === 0 ? "Design direction · client review" : "Included in property plan"}</small></div><button onClick={() => setApproved(!approved)}>{index === 0 && approved ? "Approved ✓" : "Review →"}</button></article>)}
    </section></>;
  }

  if (section === "analytics" || section === "integrations") {
    const card = section === "analytics" ? <article className="msd-notes"><span>SIGNAL</span><h2>The plan is gaining momentum.</h2><p>This preview shows how Maison AI surfaces stored project signals after a workspace is configured.</p><button onClick={addTask}>Add a sample task</button></article> : <article className="msd-notes"><span>SETUP</span><h2>Connect when you are ready.</h2><p>External services stay disabled until their keys and verification are securely configured.</p><button onClick={addTask}>Add a sample task</button></article>;
    return <>{metrics}<section className="msd-grid msd-focus"><Chart range={range} setRange={setRange} />{card}</section></>;
  }

  return <>{metrics}<section className="msd-grid msd-focus"><Chart range={range} setRange={setRange} /><article className="msd-notes"><span>ACTIVE PROJECT</span><h2>West End Guest Suite</h2><p>Direction, selections, scope, and launch work in one calm client workspace.</p><button onClick={() => setApproved(!approved)}>{approved ? "Direction approved ✓" : "Approve styling direction"}</button></article></section></>;
}

export function MaisonDashboardSandbox({ section = "overview" }: { section?: string }) {
  const [tasks, setTasks] = useState(8);
  const [approved, setApproved] = useState(false);
  const activeSection = (titles[section] ? section : "overview") as Section;

  return <div className="maison-sandbox-dashboard">
    <header className="msd-head"><div><p>MAISON AI · INTERACTIVE SANDBOX</p><h1>{titles[activeSection]}</h1><span>Preview workspace only. Nothing is saved, sent, or mixed with client accounts.</span></div><div><button onClick={() => setTasks(tasks + 1)}>＋ Add sample task</button><button className="dark" onClick={() => document.querySelector(".msd-focus")?.scrollIntoView({ behavior: "smooth" })}>View workflow ↓</button></div></header>
    <section className="msd-toolbar"><div className="msd-project-select"><span>ACTIVE PROJECT</span><select defaultValue="West End Guest Suite"><option>West End Guest Suite</option><option>Vanderbilt Listing Refresh</option><option>The Gallatin Airbnb</option></select></div><span className="msd-live">● Interactive preview</span></section>
    <Content section={activeSection} tasks={tasks} setTasks={setTasks} approved={approved} setApproved={setApproved} />
  </div>;
}
