"use client";
import RoutingEngine from "./RoutingEngine";
import { consultationSteps } from "@/lib/lab-routing";
export default function ConsultationRouting({inHome=false}:{inHome?:boolean}) {
 return <div className="lab-experiment lab-treatment"><header className="lab-experiment-head"><div><small>CONSULTATION ROUTING FLOW</small><h3>The right conversation.<br/><em>A clearer next step.</em></h3></div><p>A standalone intake system for service line, location, provider and visit preferences.</p></header><RoutingEngine steps={consultationSteps} name="Consultation Routing Flow" projectType="Beauty / wellness" needs={["Quote or lead flow","Booking or scheduling","Custom interactive feature"]} inHome={inHome} disclosure="Demo preferences organize a consultation request. The practice confirms services, provider credentials, availability and suitability. No diagnosis or treatment recommendation. Use fictional preferences; no appointment is booked."/></div>;
}
