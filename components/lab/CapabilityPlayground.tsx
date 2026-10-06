"use client";
import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BriefLink, LabBriefContext, type LabBrief } from "./LabShared";
const loading = () => <p className="lab-loading" role="status">Opening the experience…</p>;
const Atlas = dynamic(() => import("./ExperienceAtlas"), { loading });
const Night = dynamic(() => import("./NightMode"), { loading });
const Treatment = dynamic(() => import("./TreatmentArchitect"), { loading });
const Service = dynamic(() => import("./HomeIntelligence"), { loading });
const Conversion = dynamic(() => import("./ConversionEngine"), { loading });
const PrivateEvent = dynamic(() => import("./PrivateEventArchitect"), { loading });
const slugs = ["experience-atlas", "night-mode", "routing-engine", "home-intelligence", "conversion-engine", "private-event-architect"];
const experiments = [
  { name: "Experience Atlas", proof: "Help guests picture their event", component: Atlas, audience: "Venues / hospitality", problem: "Guests struggle to picture the space or decide which setting fits their plans.", build: "An illustrated property explorer with room details, event configurations and a useful inquiry handoff.", deliverables: ["Custom property illustration", "Interactive space and guest planning", "Venue inquiry flow"], projectType: "Hospitality / venue", needs: ["Illustration / property map", "Custom interactive feature", "Quote or lead flow"] },
  { name: "Night Mode", proof: "Guide guests toward the right booking", component: Night, audience: "Restaurants / nightlife / events", problem: "Guests have options, but need help choosing the right experience for their group.", build: "A guided discovery and reservation journey that connects guest preferences to suitable options.", deliverables: ["Personalized experience discovery", "Group and availability rules", "Reservation system integration"], projectType: "Restaurant / nightlife / events", needs: ["Custom interactive feature", "Booking or scheduling"] },
  { name: "Routing Engine", proof: "Prepare a more useful consultation", component: Treatment, audience: "Beauty / wellness", problem: "New clients arrive with questions, but your inquiry form gives you little context.", build: "A reusable intake engine: multi-goal discovery, clinician-led education, surgical or non-surgical conversation, service-line, location, provider and visit-format preferences.", deliverables: ["Visual area and concern selection", "Service education", "Consultation intake and booking"], projectType: "Beauty / wellness", needs: ["Custom interactive feature", "Quote or lead flow", "Booking or scheduling"] },
  { name: "Home Intelligence", proof: "Route homeowner needs to the right service team", component: Service, audience: "Home services / service teams", problem: "Homeowners describe symptoms, but your form does not help them find the right service team.", build: "Homeowner observations, system selection and urgency route into a structured service brief, with the existing dispatch workflow available to explore.", deliverables: ["Interactive house and service routing", "Repair, replacement and upgrade intake", "Customer and dispatch workflow"], projectType: "Small business / service", needs: ["Custom interactive feature", "Quote or lead flow", "Booking or scheduling"] },
  { name: "Conversion Engine", proof: "Turn interest into a useful next step", component: Conversion, audience: "Services / retail / arts", problem: "Your website gives every visitor the same information and the same vague next step.", build: "A website journey that connects your business goal to the information and action visitors need.", deliverables: ["Content and conversion strategy", "Purposeful page and action design", "Product, inquiry or booking flow"], projectType: "Professional service", needs: ["Multi-page website", "Quote or lead flow", "Custom interactive feature"] },
  { name: "Private Event Architect", proof: "Qualify an event before the sales conversation", component: PrivateEvent, audience: "Venues / hotels / restaurants / cultural spaces", problem: "Event inquiries arrive without the operational details your sales team needs.", build: "A guided event brief covering guests, format, spaces, AV, hospitality, privacy and optional lodging.", deliverables: ["Event qualification", "Production and hospitality requirements", "Structured event-sales brief"], projectType: "Hospitality / venue", needs: ["Quote or lead flow", "Custom interactive feature", "Booking or scheduling"] },
];
export default function CapabilityPlayground({ inHome = false }: { inHome?: boolean }) {
  const [activeBrief, setActiveBrief] = useState<LabBrief | null>(null);
  const [selected, setSelected] = useState(0);
  const [reset, setReset] = useState(0);
  useEffect(() => {
    const sync = () => { const slug = new URLSearchParams(window.location.search).get("capability"); const i = slugs.indexOf(slug || ""); setActiveBrief(null); setSelected(i < 0 ? 0 : i); };
    sync(); window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync);
  }, []);
  function selectExperiment(i: number) { setActiveBrief(null); setSelected(i); const url = new URL(window.location.href); url.searchParams.set("capability", slugs[i]); window.history.pushState(null, "", url); }
  const current = experiments[selected];
  const Experiment = current.component;
  return <><section className="flagship-lab" id="capabilities" aria-label="A. Halliwell Studio interactive Lab">
    <div className="flagship-lab-heading"><small>03 / THE LAB</small><h2>See what your<br /><em>website could do.</em></h2><p>Choose a business need. Try the experience. Picture what we could build for yours.</p>{inHome ? <Link href="/lab">Explore the full Lab <ArrowUpRight /></Link> : null}</div>
    <nav className="lab-experiment-tabs" aria-label="Choose a Lab experiment">{experiments.map((experiment, i) => <button key={experiment.name} type="button" aria-pressed={selected === i} aria-controls="lab-active-experiment" onClick={() => selectExperiment(i)}><span>0{i + 1}</span><strong>{experiment.name}</strong><small>{experiment.proof}</small></button>)}</nav>
    <div id="lab-active-experiment" className="lab-active-experiment">
      <section className="lab-business-case" aria-label={`${current.name} for your business`}>
        <div><small>{current.audience}</small><h3>A business problem<br /><em>you might recognize.</em></h3><p>{current.problem}</p></div>
        <div><small>WHAT AHS CAN BUILD</small><p>{current.build}</p><ul>{current.deliverables.map(item => <li key={item}>{item}</li>)}</ul><BriefLink inHome={inHome} name={current.name} projectType={current.projectType} needs={current.needs} summary={current.build} label="Discuss this for my business" /></div>
      </section>
      <p className="lab-share-link"><Link href={`/lab?capability=${slugs[selected]}#capabilities`}>Direct link to {current.name}</Link></p>
      <div className="lab-experiment-meta"><span>TRY THE EXPERIENCE / {current.proof}</span><button type="button" onClick={() => {setActiveBrief(null); setReset(v => v + 1);}} aria-label={`Reset experience: ${current.name}`}>Reset experience</button></div>
      <LabBriefContext.Provider value={setActiveBrief}><Experiment key={`${selected}-${reset}`} inHome={inHome} /></LabBriefContext.Provider>
    </div>
    <p className="lab-global-disclosure">Original studio concepts. Prices, availability, capacities and records are demo data. Your project would be scoped around your business, content and systems. No live transaction or clinical assessment.</p>
  </section>{!inHome ? <section className="case-end"><small>NEXT</small><h2>Which possibility<br/>fits your business?</h2><p>Tell us what you need your website to do. We’ll define the right scope together.</p><BriefLink name={activeBrief?.name || current.name} projectType={activeBrief?.projectType || current.projectType} needs={activeBrief?.needs || current.needs} summary={activeBrief?.summary || current.build} label="Tell us about your business" className="button button-primary"/></section> : null}</>;
}
