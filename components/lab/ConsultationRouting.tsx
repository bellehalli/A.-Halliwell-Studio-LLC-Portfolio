"use client";
import Image from "next/image";
import RoutingEngine from "./RoutingEngine";
import { consultationSteps } from "@/lib/lab-routing";
export default function ConsultationRouting({inHome=false}:{inHome?:boolean}) {
 return <div className="lab-experiment lab-treatment medspa-product medspa-routing-product">
  <header className="medspa-product-heading"><div><small>CONSULTATION ROUTING FLOW</small><h3>Less friction.<br/><em>A clearer next step.</em></h3></div><p>A few thoughtful choices. A consultation conversation with direction.</p></header>
  <div className="medspa-routing-workspace"><aside className="medspa-routing-editorial"><Image src="/assets/lab/consultation-face.webp" alt="Portrait accompanying the consultation experience" width={612} height={408} sizes="(max-width:850px) 90vw, 35vw"/><div><small>A CONSIDERED BEGINNING</small><h4>The conversation<br/><em>comes first.</em></h4><p>Your preferences help the practice understand where to begin.</p><span>PATHWAY / TEAM / VISIT</span></div></aside><RoutingEngine steps={consultationSteps} name="Consultation Routing Flow" projectType="Beauty / wellness" needs={["Quote or lead flow","Booking or scheduling","Custom interactive feature"]} inHome={inHome} presentation="medspa" disclosure="Demo preferences organize a consultation request. The practice confirms services, provider credentials, availability and suitability. No diagnosis or treatment recommendation. Use fictional preferences; no appointment is booked."/></div>
 </div>;
}
