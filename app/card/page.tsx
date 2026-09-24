import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata:Metadata={title:"Arabella Halliwell | Digital Card",description:"A. Halliwell Studio digital contact card.",robots:{index:false,follow:true}};
export default function CardPage(){return <main className="digital-card-page"><section className="digital-card"><span className="card-kicker">A. HALLIWELL STUDIO</span><h1>Arabella<br/><em>Halliwell</em></h1><p>Founder · Designer · Developer</p><div className="card-actions"><a href="mailto:hello@ahalliwellstudio.com">Email the studio ↗</a><Link href="/work">Selected work ↗</Link><Link href="/start">Start a project ↗</Link><a href="/brand/ahalliwell-studio.vcf" download>Save contact ↗</a></div><div className="card-qr"><Image src="/brand/ahalliwell-studio-qr.png" alt="QR code for A. Halliwell Studio" width={180} height={180}/><small>SCAN TO OPEN THE STUDIO</small></div></section></main>}
