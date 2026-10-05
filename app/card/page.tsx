import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { studio } from "@/lib/studio-config";
import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
export const metadata: Metadata = {
  title: "Arabella Halliwell | Digital Card",
  description: "A. Halliwell Studio digital contact card.",
  alternates: { canonical: "/card" },
  robots:{index:false,follow:true},
  ...socialMetadata("/card", "Arabella Halliwell | Digital Card", "A. Halliwell Studio digital contact card."),
};
export default function CardPage(){return <main className="digital-card-page"><Navigation /><section className="digital-card"><span className="card-kicker">A. HALLIWELL STUDIO</span><h1>Arabella<br/><em>Halliwell</em></h1><p>Founder · Designer · Developer</p><div className="card-actions"><a href={`mailto:${studio.email}`}>Email the studio <ArrowUpRight /></a><Link href="/work">Selected work <ArrowUpRight /></Link><Link href="/start">Start a project <ArrowUpRight /></Link><a href="/brand/ahalliwell-studio.vcf" download>Save contact <ArrowUpRight /></a></div><div className="card-qr"><Image src="/brand/ahalliwell-studio-qr.png" alt="QR code for A. Halliwell Studio" width={180} height={180}/><small>SCAN TO OPEN THE STUDIO</small></div></section></main>}
