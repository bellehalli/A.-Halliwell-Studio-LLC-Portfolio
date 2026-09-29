import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, isPortalStudio, portalEnabled } from "@/lib/portal";
import ClientJourneyPreview from "./ClientJourneyPreview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Client journey preview",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ClientJourneyPreviewPage() {
  if (!portalEnabled()) notFound();
  const client = await currentPortalClient();
  if (!client) redirect("/portal");
  if (!isPortalStudio(client)) notFound();

  return <main className="portal-page">
    <div className="site-background" aria-hidden="true" />
    <Navigation />
    <ClientJourneyPreview />
  </main>;
}
