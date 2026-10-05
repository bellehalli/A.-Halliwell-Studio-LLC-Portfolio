"use client";
import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BriefLink } from "./LabShared";
const loading = () => <p className="lab-loading" role="status">Opening the experience…</p>;
const Atlas = dynamic(() => import("./ExperienceAtlas"), { loading });
const Night = dynamic(() => import("./NightMode"), { loading });
const Treatment = dynamic(() => import("./TreatmentArchitect"), { loading });
const Service = dynamic(() => import("./ServiceCommand"), { loading });
const Conversion = dynamic(() => import("./ConversionEngine"), { loading });
const experiments = [
  { name: "Experience Atlas", proof: "Help guests picture their event", component: Atlas, audience: "Venues / hospitality", problem: "Guests struggle to picture the space or decide which setting fits their plans.", build: "An illustrated property explorer with room details, event configurations and a useful inquiry handoff.", deliverables: ["Custom property illustration", "Interactive space and guest planning", "Venue inquiry flow"], projectType: "Hospitality / venue", needs: ["Illustration / property map", "Custom interactive feature", "Quote or lead flow"] },
  { name: "Night Mode", proof: "Guide guests toward the right booking", component: Night, audience: "Restaurants / nightlife / events", problem: "Guests have options, but need help choosing the right experience for their group.", build: "A guided discovery and reservation journey that connects guest preferences to suitable options.", deliverables: ["Personalized experience discovery", "Group and availability rules", "Reservation system integration"], projectType: "Restaurant / nightlife / events", needs: ["Custom interactive feature", "Booking or scheduling"] },
  { name: "Treatment Architect", proof: "Prepare a more useful consultation", component: Treatment, audience: "Beauty / wellness", problem: "New clients arrive with questions, but your inquiry form gives you little context.", build: "A visual concern explorer, service education and an intake flow for clinician-led consultations.", deliverables: ["Visual area and concern selection", "Service education", "Consultation intake and booking"], projectType: "Beauty / wellness", needs: ["Custom interactive feature", "Quote or lead flow", "Booking or scheduling"] },
  { name: "Service Command", proof: "Connect requests to the work behind them", component: Service, audience: "Home services / service teams", problem: "Requests, appointments, estimates and customer updates live in separate places.", build: "A connected customer and team workflow, from service request to estimate approval and progress updates.", deliverables: ["Service request and scheduling", "Team dispatch and job tracking", "Customer status and approval flow"], projectType: "Small business / service", needs: ["Booking or scheduling", "Client portal", "Quote or lead flow"] },
  { name: "Conversion Engine", proof: "Turn interest into a useful next step", component: Conversion, audience: "Services / retail / arts", problem: "Your website gives every visitor the same information and the same vague next step.", build: "A website journey that connects your business goal to the information and action visitors need.", deliverables: ["Content and conversion strategy", "Purposeful page and action design", "Product, inquiry or booking flow"], projectType: "Professional service", needs: ["Multi-page website", "Quote or lead flow", "Custom interactive feature"] },
];
export default function CapabilityPlayground({ inHome = false }: { inHome?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [reset, setReset] = useState(0);
  const current = experiments[selected];
  const Experiment = current.component;
  return <section className="flagship-lab" id="capabilities" aria-label="A. Halliwell Studio interactive Lab">
    <div className="flagship-lab-heading"><small>03 / THE LAB</small><h2>See what your<br /><em>website could do.</em></h2><p>Choose a business need. Try the experience. Picture what we could build for yours.</p>{inHome ? <Link href="/lab">Explore the full Lab <ArrowUpRight /></Link> : null}</div>
    <nav className="lab-experiment-tabs" aria-label="Choose a Lab experiment">{experiments.map((experiment, i) => <button key={experiment.name} type="button" aria-pressed={selected === i} aria-controls="lab-active-experiment" onClick={() => setSelected(i)}><span>0{i + 1}</span><strong>{experiment.name}</strong><small>{experiment.proof}</small></button>)}</nav>
    <div id="lab-active-experiment" className="lab-active-experiment">
      <section className="lab-business-case" aria-label={`${current.name} for your business`}>
        <div><small>{current.audience}</small><h3>A business problem<br /><em>you might recognize.</em></h3><p>{current.problem}</p></div>
        <div><small>WHAT AHS CAN BUILD</small><p>{current.build}</p><ul>{current.deliverables.map(item => <li key={item}>{item}</li>)}</ul><BriefLink inHome={inHome} name={current.name} projectType={current.projectType} needs={current.needs} summary={current.build} label="Discuss this for my business" /></div>
      </section>
      <div className="lab-experiment-meta"><span>TRY THE EXPERIENCE / {current.proof}</span><button type="button" onClick={() => setReset(v => v + 1)} aria-label={`Reset ${current.name}`}>Reset experience</button></div>
      <Experiment key={`${selected}-${reset}`} inHome={inHome} />
    </div>
    <p className="lab-global-disclosure">Original studio concepts. Prices, availability, capacities and records are demo data. Your project would be scoped around your business, content and systems. No live transaction or clinical assessment.</p>
  </section>;
}
