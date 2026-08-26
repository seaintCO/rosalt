"use client";

import { useEffect, useMemo, useState } from "react";

type EventItem={providerId:string;name:string;startsAt:string;venue:string|null;ticketUrl:string;imageUrl?:string|null;priceMin:number|null;priceMax:number|null;currency:string|null};
type ItineraryDay={date:string;title:string;items:Array<{providerId:string;title:string;startTime:string;estimatedCost:number|null;reason:string}>};
type Result={id:string;destination:string;events:EventItem[];itinerary:{days:ItineraryDay[];warnings:string[]};remainingBudget:number;warnings:string[]};
type Style="save"|"balanced"|"premium"|"custom";
type Pace="relaxed"|"balanced"|"full";

const interestOptions=[
  ["sports","Sports","◉"],["live_music","Live music","♫"],["food","Food","◌"],["family","Family","◇"],
  ["nightlife","Nightlife","✦"],["nature","Nature","⌁"],["shopping","Shopping","□"],["history","History","⌂"],
  ["art","Art","◈"],["wellness","Wellness","○"],["faith","Faith","✧"],["business","Business","▣"],
  ["romantic","Romantic","♡"],["adventure","Adventure","↗"],["free","Free activities","$0"]
] as const;

const money=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);

export function PlannerForm({locale}:{locale:string}){
  const es=locale==="es";
  const [step,setStep]=useState(1);
  const [destination,setDestination]=useState("");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [adults,setAdults]=useState(2);
  const [children,setChildren]=useState(0);
  const [budget,setBudget]=useState(1500);
  const [activityBudget,setActivityBudget]=useState(500);
  const [style,setStyle]=useState<Style>("balanced");
  const [pace,setPace]=useState<Pace>("balanced");
  const [transportation,setTransportation]=useState("Driving");
  const [interests,setInterests]=useState<string[]>(["food","live_music"]);
  const [dietary,setDietary]=useState("");
  const [accessibility,setAccessibility]=useState("");
  const [occasion,setOccasion]=useState("");
  const [mustDo,setMustDo]=useState("");
  const [avoid,setAvoid]=useState("");
  const [result,setResult]=useState<Result|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{const frame=requestAnimationFrame(()=>{
    const query=new URLSearchParams(window.location.search);
    const incomingDestination=query.get("destination");
    const incomingStart=query.get("startDate");
    const incomingEnd=query.get("endDate");
    const incomingBudget=Number(query.get("budget"));
    if(incomingDestination)setDestination(incomingDestination);
    if(incomingStart)setStartDate(incomingStart);
    if(incomingEnd)setEndDate(incomingEnd);
    if(Number.isFinite(incomingBudget)&&incomingBudget>=250){setBudget(Math.min(incomingBudget,10000));setActivityBudget(Math.round(Math.min(incomingBudget,10000)*.34/50)*50)}
  });return()=>cancelAnimationFrame(frame)},[]);
  const travelers=adults+children;
  const remaining=Math.max(0,budget-activityBudget);
  const activityPercent=Math.round(activityBudget/Math.max(budget,1)*100);
  const dateReady=Boolean(destination.trim().length>=2&&startDate&&endDate&&endDate>=startDate);
  const stepReady=step===1?dateReady:step===2?activityBudget<=budget:step===3?interests.length>0:true;
  const progress=step*25;

  const nights=useMemo(()=>{
    if(!startDate||!endDate)return 0;
    return Math.max(0,Math.round((new Date(`${endDate}T12:00:00`).getTime()-new Date(`${startDate}T12:00:00`).getTime())/86400000));
  },[endDate,startDate]);

  function toggleInterest(value:string){setInterests(current=>current.includes(value)?current.filter(item=>item!==value):[...current,value])}
  function chooseStyle(value:Style){setStyle(value);if(value==="save")setActivityBudget(Math.round(budget*.22/50)*50);if(value==="balanced")setActivityBudget(Math.round(budget*.34/50)*50);if(value==="premium")setActivityBudget(Math.round(budget*.48/50)*50)}

  async function generate(){
    setBusy(true);setError("");setResult(null);
    const payload={destination,startDate,endDate,travelers,adults,children,totalBudget:budget,activityBudget,style,interests,transportation,dietaryRestrictions:dietary.split(",").map(x=>x.trim()).filter(Boolean),accessibilityNeeds:accessibility||undefined,pace,occasion:occasion||undefined,mustDo:mustDo.split(",").map(x=>x.trim()).filter(Boolean),avoid:avoid.split(",").map(x=>x.trim()).filter(Boolean),locale};
    try{
      const response=await fetch("/api/planner",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
      const body=await response.json();
      if(!response.ok)throw new Error(`${body.error?.message??"The trip could not be created."}${body.error?.referenceId?` Reference: ${body.error.referenceId}`:""}`);
      setResult(body.data);setStep(4);
    }catch(caught){setError(caught instanceof Error?caught.message:"The grounded planner could not complete this request.")}
    finally{setBusy(false)}
  }

  return <section className="planner-studio">
    <div className="planner-studio-top">
      <div><span className="planner-live-dot"/><b>{es?"PLANIFICADOR GRATUITO":"FREE TRIP PLANNER"}</b></div>
      <span>{es?"Impulsado por MAISON AI · Datos de proveedores reales":"Powered by MAISON AI · Real provider data"}</span>
    </div>

    <div className="planner-progress" aria-label={`${progress}% complete`}><i style={{width:`${progress}%`}}/></div>
    <nav className="planner-steps" aria-label={es?"Pasos del planificador":"Planner steps"}>
      {[[1,es?"Viaje":"Trip"],[2,es?"Presupuesto":"Budget"],[3,es?"Preferencias":"Preferences"],[4,es?"Revisar":"Review"]].map(([number,label])=><button key={number} type="button" className={step===number?"active":step>Number(number)?"done":""} onClick={()=>{if(Number(number)<step||Number(number)===4&&step===4)setStep(Number(number))}}><i>{step>Number(number)?"✓":number}</i><span>{label}</span></button>)}
    </nav>

    <div className="planner-workspace">
      <div className="planner-main-panel">
        {step===1&&<div className="planner-step-panel">
          <header><span>01</span><div><h2>{es?"¿A dónde te lleva el viaje?":"Where is the trip taking you?"}</h2><p>{es?"Comienza con el lugar, las fechas y las personas.":"Start with the place, dates, and people."}</p></div></header>
          <div className="planner-field hero-field"><label htmlFor="planner-destination">{es?"Destino":"Destination"}</label><div><i>⌖</i><input id="planner-destination" value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Nashville, Tennessee" autoComplete="address-level2"/></div></div>
          <div className="planner-date-grid"><div className="planner-field"><label htmlFor="planner-start">{es?"Llegada":"Check in"}</label><input id="planner-start" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div><div className="date-connector"><i/></div><div className="planner-field"><label htmlFor="planner-end">{es?"Salida":"Check out"}</label><input id="planner-end" type="date" min={startDate||undefined} value={endDate} onChange={e=>setEndDate(e.target.value)}/></div></div>
          <div className="traveler-counter"><div><span>{es?"Adultos":"Adults"}</span><small>{es?"13 años o más":"Age 13+"}</small></div><button type="button" onClick={()=>setAdults(Math.max(1,adults-1))}>−</button><b>{adults}</b><button type="button" onClick={()=>setAdults(Math.min(50,adults+1))}>+</button></div>
          <div className="traveler-counter"><div><span>{es?"Niños":"Children"}</span><small>{es?"Menores de 13":"Under 13"}</small></div><button type="button" onClick={()=>setChildren(Math.max(0,children-1))}>−</button><b>{children}</b><button type="button" onClick={()=>setChildren(Math.min(30,children+1))}>+</button></div>
        </div>}

        {step===2&&<div className="planner-step-panel budget-panel">
          <header><span>02</span><div><h2>{es?"Diseña el presupuesto.":"Shape the budget."}</h2><p>{es?"Ajusta el rango y observa cómo cambia el plan.":"Move the ranges and watch the plan respond."}</p></div></header>
          <div className="budget-hero-control"><div><span>{es?"PRESUPUESTO TOTAL":"TOTAL TRIP BUDGET"}</span><strong>{money(budget)}</strong><small>{travelers} {es?"viajeros":"travelers"} · {nights||"—"} {es?"noches":"nights"}</small></div><input aria-label={es?"Presupuesto total":"Total trip budget"} type="range" min="250" max="10000" step="50" value={budget} onChange={e=>{const next=Number(e.target.value);setBudget(next);setActivityBudget(current=>Math.min(current,next))}}/><div className="range-labels"><span>$250</span><span>$10k</span></div></div>
          <div className="style-cards">{(["save","balanced","premium","custom"] as Style[]).map(value=><button type="button" key={value} className={style===value?"active":""} onClick={()=>chooseStyle(value)}><i>{value==="save"?"↓":value==="balanced"?"◎":value==="premium"?"✦":"⌁"}</i><span>{value==="save"?(es?"Ahorrar":"Save"):value==="balanced"?(es?"Balanceado":"Balanced"):value==="premium"?"Premium":(es?"Personalizado":"Custom")}</span></button>)}</div>
          <div className="activity-control"><div><span>{es?"ACTIVIDADES Y EVENTOS":"ACTIVITIES & EVENTS"}</span><b>{money(activityBudget)}</b></div><input aria-label={es?"Presupuesto de actividades":"Activity budget"} type="range" min="0" max={budget} step="25" value={activityBudget} onChange={e=>{setActivityBudget(Number(e.target.value));setStyle("custom")}}/></div>
        </div>}

        {step===3&&<div className="planner-step-panel preferences-panel">
          <header><span>03</span><div><h2>{es?"Hazlo personal.":"Make it personal."}</h2><p>{es?"Elige al menos un interés. Puedes cambiarlo después.":"Choose at least one interest. You can edit it later."}</p></div></header>
          <div className="interest-grid">{interestOptions.map(([value,label,icon])=><button type="button" key={value} className={interests.includes(value)?"active":""} onClick={()=>toggleInterest(value)}><i>{icon}</i><span>{label}</span>{interests.includes(value)&&<b>✓</b>}</button>)}</div>
          <div className="preference-controls"><label><span>{es?"Ritmo":"Pace"}</span><select value={pace} onChange={e=>setPace(e.target.value as Pace)}><option value="relaxed">{es?"Relajado":"Relaxed"}</option><option value="balanced">{es?"Balanceado":"Balanced"}</option><option value="full">{es?"Día completo":"Full days"}</option></select></label><label><span>{es?"Transporte":"Transportation"}</span><select value={transportation} onChange={e=>setTransportation(e.target.value)}><option>Driving</option><option>Rideshare</option><option>Public transit</option><option>Walking</option></select></label><label><span>{es?"Ocasión":"Occasion"}</span><input value={occasion} onChange={e=>setOccasion(e.target.value)} placeholder={es?"Cumpleaños, aniversario…":"Birthday, anniversary…"}/></label><label><span>{es?"Restricciones alimentarias":"Dietary restrictions"}</span><input value={dietary} onChange={e=>setDietary(e.target.value)} placeholder={es?"Separa con comas":"Separate with commas"}/></label><label className="wide"><span>{es?"Necesidades de accesibilidad":"Accessibility needs"}</span><input value={accessibility} onChange={e=>setAccessibility(e.target.value)} placeholder={es?"Comparte solo lo necesario para planear":"Share only what is helpful for planning"}/></label><label><span>{es?"Imperdibles":"Must-do"}</span><input value={mustDo} onChange={e=>setMustDo(e.target.value)} placeholder={es?"Separa con comas":"Separate with commas"}/></label><label><span>{es?"Evitar":"Avoid"}</span><input value={avoid} onChange={e=>setAvoid(e.target.value)} placeholder={es?"Separa con comas":"Separate with commas"}/></label></div>
        </div>}

        {step===4&&<div className="planner-step-panel review-panel">
          <header><span>04</span><div><h2>{result?(es?"Tu viaje, basado en hechos.":"Your trip, grounded in facts."):(es?"Listo para construir.":"Ready to build.")}</h2><p>{result?(es?"Los enlaces y eventos vienen de proveedores configurados.":"Links and events come from configured providers."):(es?"Revisa la información antes de pedirle el itinerario a MAISON AI.":"Review the details before asking MAISON AI for the itinerary.")}</p></div></header>
          {!result&&<div className="review-grid"><article><span>{es?"VIAJE":"TRIP"}</span><strong>{destination||"—"}</strong><small>{startDate&&endDate?`${startDate} → ${endDate}`:(es?"Agrega fechas":"Add dates")}</small></article><article><span>{es?"GRUPO":"GROUP"}</span><strong>{travelers}</strong><small>{es?"viajeros":"travelers"}</small></article><article><span>{es?"PRESUPUESTO":"BUDGET"}</span><strong>{money(budget)}</strong><small>{money(activityBudget)} {es?"para actividades":"for activities"}</small></article><article><span>{es?"ESTILO":"STYLE"}</span><strong>{style}</strong><small>{interests.length} {es?"intereses":"interests"}</small></article></div>}
          {result&&<div className="grounded-results"><div className="result-summary"><span>{es?"PRESUPUESTO RESTANTE":"REMAINING ACTIVITY BUDGET"}</span><strong>{money(result.remainingBudget)}</strong><small>{es?"Calculado de precios mínimos disponibles; algunos precios no están disponibles.":"Calculated from available minimum prices; some prices may be unavailable."}</small></div>{result.warnings.map(warning=><p className="result-warning" key={warning}>ⓘ {warning}</p>)}{result.itinerary?.days?.map(day=><section className="itinerary-day" key={day.date}><header><span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(locale,{weekday:"short",month:"short",day:"numeric"})}</span><h3>{day.title}</h3></header>{day.items.map((item,index)=>{const event=result.events.find(candidate=>candidate.providerId===item.providerId);return <article key={`${item.providerId}-${index}`}><time>{item.startTime}</time><div><b>{item.title}</b><p>{item.reason}</p><small>{item.estimatedCost==null?(es?"Precio no disponible":"Price unavailable"):`${es?"Costo estimado":"Estimated cost"}: ${money(item.estimatedCost)}`}</small></div>{event&&<a href={event.ticketUrl} target="_blank" rel="noreferrer sponsored">{es?"Proveedor":"Provider"} ↗</a>}</article>})}</section>)}</div>}
        </div>}

        {error&&<div className="planner-error" role="alert"><i>!</i><div><b>{es?"El viaje aún no se pudo crear.":"The trip could not be created yet."}</b><p>{error}</p></div><button type="button" onClick={()=>setError("")}>×</button></div>}
        <footer className="planner-footer"><button type="button" className="planner-back" disabled={step===1||busy} onClick={()=>setStep(value=>Math.max(1,value-1))}>← {es?"Atrás":"Back"}</button>{step<4?<button type="button" className="planner-next" disabled={!stepReady} onClick={()=>setStep(value=>Math.min(4,value+1))}>{es?"Continuar":"Continue"}<span>→</span></button>:!result?<button type="button" className="planner-next generate" disabled={!dateReady||interests.length===0||busy} onClick={()=>void generate()}>{busy?(es?"Buscando datos reales…":"Retrieving real data…"):(es?"Crear mi viaje":"Build my trip")}<span>{busy?"◌":"✦"}</span></button>:<button type="button" className="planner-next" onClick={()=>{setResult(null);setStep(1)}}>{es?"Planear otro viaje":"Plan another trip"}<span>↻</span></button>}</footer>
      </div>

      <aside className="budget-visualizer">
        <div className="visualizer-head"><div><span>{es?"PRESUPUESTO EN VIVO":"LIVE BUDGET"}</span><small>{es?"Se actualiza mientras planeas":"Updates as you plan"}</small></div><i>◎</i></div>
        <div className="budget-ring" style={{background:`conic-gradient(#0878f9 0 ${activityPercent}%,#dbe2ea ${activityPercent}% 100%)`}}><div><strong>{activityPercent}%</strong><span>{es?"experiencias":"experiences"}</span></div></div>
        <div className="budget-breakdown"><div><i className="blue"/><span>{es?"Actividades y eventos":"Activities & events"}</span><b>{money(activityBudget)}</b></div><div><i/><span>{es?"Resto del viaje":"Remaining trip budget"}</span><b>{money(remaining)}</b></div></div>
        <div className="budget-bars"><span>{es?"PRESUPUESTO POR PERSONA":"BUDGET PER TRAVELER"}</span><strong>{money(Math.round(budget/Math.max(travelers,1)))}</strong><i><b style={{width:`${Math.min(100,budget/100)}%`}}/></i></div>
        <div className="trip-signal"><span>{es?"SEÑAL DEL VIAJE":"TRIP SIGNAL"}</span><div>{[18,32,24,48,61,53,78,70,87,92].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><small>{dateReady&&interests.length?es?"Listo para recuperar datos reales":"Ready to retrieve real data":es?"Completa el viaje y los intereses":"Complete trip details and interests"}</small></div>
        <div className="grounding-note"><i>⌁</i><p><b>{es?"Sin datos inventados":"No fabricated data"}</b><span>{es?"Si un proveedor no confirma un dato, MAISON AI lo marca como no disponible.":"If a provider does not confirm a fact, MAISON AI marks it unavailable."}</span></p></div>
      </aside>
    </div>
  </section>;
}
