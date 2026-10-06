import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import Navigation from "@/components/navigation/Navigation";
export const metadata: Metadata = {
  title: "Lab",
  description: "Explore website and digital system possibilities for your business: venue discovery, booking, consultation intake, service workflows and customer journeys.",
  alternates: { canonical: "/lab" },
  ...socialMetadata("/lab", "Lab", "Explore website and digital system possibilities for your business: venue discovery, booking, consultation intake, service workflows and customer journeys."),
};
export default function Page() {
 return <main className="destination-page lab-route"><div className="site-background" aria-hidden="true"/>
 <Navigation />
 <article className="destination-sheet lab-destination"><section className="destination-hero"><small>IDEAS FOR YOUR BUSINESS</small><h1>Your website can<br/>do more for you.</h1><p>Help people choose. Make inquiries more useful. Connect the work behind the scenes. Try six working examples of what A. Halliwell Studio can build for your business.</p></section>
 <CapabilityPlayground />
</article></main>;
}
