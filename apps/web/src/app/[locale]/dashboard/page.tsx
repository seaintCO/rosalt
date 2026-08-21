import Link from "next/link";
import type { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { MaisonDashboardSandbox } from "@/components/maison-dashboard-sandbox";

export default async function Dashboard({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params,client=await createSupabaseServer();
  if(!client)return <MaisonDashboardSandbox/>;
  const {data:{user}}=await client.auth.getUser();if(!user)redirect(`/${locale}/login`);
  const {data:memberships}=await client.from("organization_members").select("organization_id,role,organizations(hosting_name)").eq("user_id",user.id).eq("status","active");
  const orgId=memberships?.[0]?.organization_id;
  if(!orgId)return <div className="dashboard-onboarding"><p className="eyebrow">WELCOME TO MAISON AI</p><h1>Your property workspace is ready.</h1><p>No sample properties, stays, or revenue have been inserted. Begin with the Maison AI launch workflow.</p><Link className="button" href={`/${locale}/dashboard/launch`}>Start Maison AI launch →</Link></div>;
  const today=new Date().toISOString().slice(0,10);
  const [arrivals,departures,cleaning,maintenance,approvals,notifications,conversations,properties,calendars]=await Promise.all([
    client.from("reservations").select("id",{count:"exact",head:true}).eq("organization_id",orgId).eq("arrival_date",today).neq("status","cancelled"),
    client.from("reservations").select("id",{count:"exact",head:true}).eq("organization_id",orgId).eq("departure_date",today).neq("status","cancelled"),
    client.from("cleaning_assignments").select("id",{count:"exact",head:true}).eq("organization_id",orgId).not("status","in","(approved,cancelled)"),
    client.from("maintenance_tickets").select("id",{count:"exact",head:true}).eq("organization_id",orgId).not("status","in","(completed,cancelled)"),
    client.from("approvals").select("id",{count:"exact",head:true}).eq("organization_id",orgId).eq("status","pending"),
    client.from("notifications").select("id",{count:"exact",head:true}).eq("organization_id",orgId).is("read_at",null),
    client.from("conversations").select("id",{count:"exact",head:true}).eq("organization_id",orgId).gt("unread_count",0),
    client.from("properties").select("id",{count:"exact",head:true}).eq("organization_id",orgId).is("deleted_at",null),
    client.from("calendar_sources").select("id,properties!inner(organization_id)",{count:"exact",head:true}).eq("properties.organization_id",orgId).eq("active",true)
  ]);
  const name=(memberships?.[0]?.organizations as {hosting_name?:string}|null)?.hosting_name??"Maison AI";
  const metrics=[
    ["Today’s arrivals",arrivals.count??0,"calendar","↘"],["Today’s departures",departures.count??0,"calendar","↗"],["Active turnovers",cleaning.count??0,"cleaning","⌁"],["Open maintenance",maintenance.count??0,"maintenance","◇"],["Pending approvals",approvals.count??0,"approvals","✓"],["Unread messages",conversations.count??0,"messages","✉"]
  ] as const;
  const setup=[{label:"Add a property",complete:(properties.count??0)>0,href:"properties"},{label:"Connect reservation calendar",complete:(calendars.count??0)>0,href:"integrations"},{label:"Open guest communications",complete:true,href:"messages"}];
  const completed=setup.filter(item=>item.complete).length;
  return <div className="dashboard-v5">
    <header className="dashboard-live-header"><div><p>LIVE OPERATING DATA</p><h1>{name}</h1><span>{new Intl.DateTimeFormat(locale,{weekday:"long",month:"long",day:"numeric"}).format(new Date())}</span></div><div><Link href={`/${locale}/dashboard/messages`}>Messages <b>{conversations.count??0}</b></Link><Link className="dashboard-add" href={`/${locale}/dashboard/properties`}>＋ Add property</Link></div></header>
    <section className="dashboard-command-grid">{metrics.map(([label,value,path,icon])=><Link href={`/${locale}/dashboard/${path}`} key={label}><div><span>{label}</span><i>{icon}</i></div><strong>{value}</strong><small>{value===0?"No live records":"Live record count"}</small></Link>)}</section>
    <section className="dashboard-lower-grid">
      <article className="dashboard-setup-v5"><header><div><span>LAUNCH READINESS</span><h2>{completed} of {setup.length} connected</h2></div><div className="setup-ring" style={{"--setup-progress":`${completed/setup.length*100}%`} as CSSProperties}><b>{Math.round(completed/setup.length*100)}%</b></div></header><div>{setup.map((item,index)=><Link key={item.label} href={`/${locale}/dashboard/${item.href}`}><i className={item.complete?"complete":""}>{item.complete?"✓":index+1}</i><span><b>{item.label}</b><small>{item.complete?"Ready":"Setup required"}</small></span><em>→</em></Link>)}</div></article>
      <article className="dashboard-attention-v5"><header><span>NEEDS ATTENTION</span><Link href={`/${locale}/dashboard/notifications`}>View all ↗</Link></header><div>{(maintenance.count??0)+(approvals.count??0)+(notifications.count??0)===0?<div className="dashboard-clear"><i>✓</i><b>Everything is clear.</b><span>Operational issues, approvals, and notifications will appear from stored records.</span></div>:<><Link href={`/${locale}/dashboard/maintenance`}><i className="red"/><span><b>{maintenance.count??0} maintenance issue(s)</b><small>Open operational records</small></span></Link><Link href={`/${locale}/dashboard/approvals`}><i className="amber"/><span><b>{approvals.count??0} approval(s)</b><small>Awaiting a human decision</small></span></Link><Link href={`/${locale}/dashboard/notifications`}><i className="blue"/><span><b>{notifications.count??0} notification(s)</b><small>Unread updates</small></span></Link></>}</div></article>
    </section>
    <footer className="dashboard-data-note"><i>⌁</i><p><b>No fabricated analytics</b><span>Revenue, occupancy, planner engagement, and upgrade conversion remain empty until real reservations, payments, and guest activity exist.</span></p><Link href={`/${locale}/dashboard/integrations`}>Integration health →</Link></footer>
  </div>;
}
