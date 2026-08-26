import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { ServicePage } from "@/components/maison-content";
import { services } from "@/lib/brand";

export function generateStaticParams() { return services.map(([service]) => ({ service })); }

export default async function ServiceRoute({ params }: { params: Promise<{ locale: string; service: string }> }) {
  const { locale, service } = await params;
  if (!services.some(([slug]) => slug === service)) notFound();
  return <><Header locale={locale}/><ServicePage locale={locale} service={service}/></>;
}
