import {DashboardNav} from "@/components/dashboard-nav";import {getLocale} from "@/lib/i18n";
export default async function DashboardLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const l=getLocale((await params).locale);return <div className="dashboard-shell"><DashboardNav locale={l}/><main className="dashboard-main">{children}</main></div>}
