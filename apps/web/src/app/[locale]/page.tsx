import { RosaltHome } from "@/components/rosalt-home";
import { getLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = getLocale((await params).locale);
  return <RosaltHome locale={locale}/>;
}
