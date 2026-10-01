"use client";
import { studio, websiteStartingPrice, websiteInvestmentRange } from "@/lib/studio-config";
import { writeStorage } from "@/lib/browser-storage";
import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";

const CURSOR = "/assets/ui/Portfolio Assets A.Halliwell  - 24.webp";
const SCOPE_KEY = "ahs-lab-scope-v1";

const jobs = ["Book appointments","Sell products","Request quotes","Client portal","Manage events","Capture leads"] as const;
type Job = typeof jobs[number];

function Booking() {
  const [day,setDay]=useState("WED 14");
  const [time,setTime]=useState("1:00 PM");
  const [held,setHeld]=useState(false);
  return <div className="ahs-live">
    <header><div><small>BOOKING / SCHEDULING</small><h3>Choose a time</h3></div><b>INTERACTIVE</b></header>
    <div className="ahs-days">{["MON 12","TUE 13","WED 14","THU 15","FRI 16"].map(x=><button type="button" key={x} aria-pressed={day===x} className={day===x?"on":""} onClick={()=>{setDay(x);setHeld(false)}}>{x}</button>)}</div>
    <div className="ahs-pills">{["10:00 AM","11:30 AM","1:00 PM","3:30 PM"].map(x=><button type="button" key={x} aria-pressed={time===x} className={time===x?"on":""} onClick={()=>{setTime(x);setHeld(false)}}>{x}</button>)}</div>
    <button type="button" className="ahs-main-action" onClick={()=>setHeld(value=>!value)}>{held?"Release the demo hold":"Hold this demo time"}</button>
    <aside aria-live="polite"><small>{held?"DEMO HOLD CREATED":"YOUR SELECTION"}</small><strong>{day} · {time}</strong><p>{held?"This local hold demonstrates confirmation state. No availability is changed and no booking is sent.":"Select another day or time, then try the confirmation state."}</p></aside>
  </div>
}

function Shop() {
  const [item,setItem]=useState("Silk Set");
  const [cart,setCart]=useState<string[]>([]);
  const prices:Record<string,number>={"Silk Set":148,"Crystal Bag":92,"Pink Mule":124};
  return <div className="ahs-live">
    <header><div><small>E-COMMERCE</small><h3>Shop the edit</h3></div><b>{cart.length} {cart.length===1?"ITEM":"ITEMS"}</b></header>
    <div className="ahs-products">{["Silk Set","Crystal Bag","Pink Mule"].map((x,i)=><button type="button" key={x} aria-pressed={item===x} className={item===x?"on":""} onClick={()=>setItem(x)}><i>{["✦","♡","✿"][i]}</i><strong>{x}</strong><span>${prices[x]}</span></button>)}</div>
    <button type="button" className="ahs-main-action" onClick={()=>setCart(current=>[...current,item])}>Add {item} to the demo bag</button>
    <aside className="ahs-bag" aria-live="polite"><small>YOUR DEMO BAG</small><strong>{cart.length ? `${cart.length} ${cart.length===1?"piece":"pieces"} · $${cart.reduce((sum,x)=>sum+prices[x],0)}` : "Nothing in the bag yet"}</strong>{cart.length>0&&<button type="button" onClick={()=>setCart(current=>current.slice(0,-1))}>Remove last item</button>}<p>No purchase or payment is possible in this demonstration.</p></aside>
  </div>
}

function Quote() {
  const [service,setService]=useState("Website redesign");
  const [pages,setPages]=useState(5);
  const [priority,setPriority]=useState("Clearer inquiries");
  return <div className="ahs-live">
    <header><div><small>PROJECT ROUTING</small><h3>Build the request</h3></div><b>CONDITIONAL</b></header>
    <label><span>WHAT DO YOU NEED?</span><select value={service} onChange={e=>setService(e.target.value)}><option>Website redesign</option><option>Custom feature</option><option>Brand refresh</option></select></label>
    {service==="Website redesign"&&<label><span>APPROXIMATE PAGES</span><input type="range" min="1" max="12" value={pages} onChange={e=>setPages(+e.target.value)}/><strong>{pages} pages</strong></label>}
    <label><span>FIRST PRIORITY</span><select value={priority} onChange={e=>setPriority(e.target.value)}><option>Clearer inquiries</option><option>More bookings</option><option>Less manual work</option><option>Better storytelling</option></select></label>
    <aside aria-live="polite"><small>REQUEST ROUTED</small><strong>{service}{service==="Website redesign"?` · ${pages} pages`:""}</strong><p>{priority} is the first job. {service==="Custom feature"?"This calls for a scoped feature brief.":service==="Brand refresh"?"The visual identity and digital experience should be scoped together.":pages<=1?"A focused page may be enough; the brief will decide.":"A multi-page journey needs content and interaction planning."} This is guidance, not a quote.</p></aside>
  </div>
}

function Portal() {
  const [tab,setTab]=useState("Overview");
  const [message,setMessage]=useState("");
  const [draft,setDraft]=useState("");
  const data:Record<string,string[]>={
    Overview:["Website redesign","In progress","Next review: Friday"],
    Files:["Brand-assets.zip","Homepage-v3.pdf","Copy-notes.docx"],
    Messages:["2 unread","Latest: homepage feedback","Reply from dashboard"]
  };
  return <div className="ahs-live ahs-portal">
    <nav><strong>CLIENT SPACE</strong>{Object.keys(data).map(x=><button key={x} className={tab===x?"on":""} onClick={()=>setTab(x)}>{x}</button>)}</nav>
    <section><small>WELCOME BACK</small><h3>{tab}</h3>{data[tab].map((x,i)=><div className="ahs-card" key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}{tab==="Messages"&&<div className="ahs-portal-compose"><label><span>LEAVE A DEMO NOTE</span><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="A note for the project thread" rows={2}/></label><button type="button" disabled={!draft.trim()} onClick={()=>{setMessage(draft.trim());setDraft("")}}>Post to this demo</button>{message&&<p role="status">Your local note: {message}</p>}</div>}</section>
  </div>
}

function Events() {
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState("");
  const events=[["Workshop","CERAMICS AFTER DARK","OCT 04"],["Dinner","CHEF'S TABLE","OCT 12"],["Music","MIDNIGHT LISTENING ROOM","OCT 18"]];
  return <div className="ahs-live">
    <header><div><small>EVENTS / TICKETING</small><h3>What&apos;s happening</h3></div></header>
    <div className="ahs-pills">{["All","Workshop","Dinner","Music"].map(x=><button key={x} className={filter===x?"on":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    <div className="ahs-events">{events.filter(e=>filter==="All"||e[0]===filter).map(e=><article key={e[1]}><span>{e[2]}</span><div><small>{e[0]}</small><strong>{e[1]}</strong></div><button type="button" aria-pressed={selected===e[1]} onClick={()=>setSelected(e[1])}>{selected===e[1]?"Selected":"Explore event"}</button></article>)}</div>
    {selected&&<aside aria-live="polite"><small>EVENT PATHWAY</small><strong>{selected}</strong><p>From an event listing, a real build could show details, availability and a ticketing partner. This demo makes no reservation.</p><button type="button" onClick={()=>setSelected("")}>Clear selection</button></aside>}
  </div>
}

function Leads() {
  const [goal,setGoal]=useState("Book a consultation");
  const [budget,setBudget]=useState(websiteInvestmentRange);
  const [context,setContext]=useState("");
  return <div className="ahs-live">
    <header><div><small>LEAD QUALIFICATION</small><h3>Start with context</h3></div><b>SMART FORM</b></header>
    <p className="ahs-label">WHAT&apos;S THE GOAL?</p><div className="ahs-pills">{["Book a consultation","Get a proposal","Ask a question"].map(x=><button key={x} className={goal===x?"on":""} onClick={()=>setGoal(x)}>{x}</button>)}</div>
    <p className="ahs-label">PROJECT RANGE</p><div className="ahs-pills">{["Custom scope",websiteInvestmentRange,"$10k+"].map(x=><button key={x} className={budget===x?"on":""} onClick={()=>setBudget(x)}>{x}</button>)}</div>
    <label><span>ONE THING WE SHOULD KNOW</span><input value={context} onChange={e=>setContext(e.target.value)} maxLength={120} placeholder="What are you trying to change?"/></label>
    <aside aria-live="polite"><small>LIVE INTAKE SUMMARY</small><strong>{goal} · {budget}</strong><p>{context.trim() || "Add context to see a more useful project brief take shape."} Nothing is sent from this demo.</p></aside>
  </div>
}

function Demo({job}:{job:Job}) {
  if(job==="Book appointments") return <Booking/>;
  if(job==="Sell products") return <Shop/>;
  if(job==="Request quotes") return <Quote/>;
  if(job==="Client portal") return <Portal/>;
  if(job==="Manage events") return <Events/>;
  return <Leads/>;
}

const discoveryOptions = {
  "Wedding venue": ["Inquiry system","Availability","Galleries","Planning tools"],
  Hospitality: ["Booking","Galleries","Events","Inquiry system"],
  Restaurant: ["Reservations","Menu","Events"],
  "Service business": ["Booking","Services","Inquiry system"],
  "Local business": ["Focused landing page","Inquiry system"],
  "Something else": ["Inquiry system","Commerce","Client portal","Events"]
} as const;
type Business = keyof typeof discoveryOptions;
const goals = ["More inquiries","More bookings","Sell online","Smoother operations"];
const experiences = ["Editorial & immersive","Warm & welcoming","Fast & focused","High-touch & guided"];

export function ScopeDiscovery({inHome}:{inHome:boolean}) {
  const [business,setBusiness] = useState<Business>("Wedding venue");
  const [selectedGoals,setSelectedGoals] = useState<string[]>(["More inquiries"]);
  const [features,setFeatures] = useState<string[]>([...discoveryOptions["Wedding venue"]]);
  const [experience,setExperience] = useState(experiences[0]);
  const availableFeatures = [...new Set<string>([...discoveryOptions[business],"Commerce","Client portal","Booking","Events","Galleries"])];
  const needsLargerBuild = features.some(x => ["Booking","Commerce","Client portal","Planning tools"].includes(x)) || selectedGoals.some(x=>["Sell online","Smoother operations"].includes(x));
  const recommendation = business === "Wedding venue"
    ? [studio.offers.website,websiteStartingPrice]
    : business === "Restaurant" || business === "Something else" || needsLargerBuild
      ? [studio.offers.custom,"Priced by scope"]
      : [studio.offers.website,websiteStartingPrice];
  const toggle = (item:string,current:string[],set:(value:string[])=>void) =>
    set(current.includes(item) ? current.filter(x=>x!==item) : [...current,item]);

  const bringToInquiry = () => {
    const projectType = business === "Wedding venue" || business === "Hospitality" ? "Hospitality / venue"
      : business === "Restaurant" ? "Restaurant / nightlife / events"
      : business === "Service business" ? "Small business / service" : business === "Local business" ? "Small business / service" : "Something else";
    const needs = [features.includes("Focused landing page") ? "One-page website" : "Multi-page website",
      ...features.flatMap(feature => ({"Booking":"Booking or scheduling","Reservations":"Booking or scheduling","Inquiry system":"Quote or lead flow","Commerce":"E-commerce","Client portal":"Client portal","Events":"Events or ticketing","Planning tools":"Custom interactive feature"} as Record<string,string>)[feature] || [])];
    const scope = {
      projectType, needs: [...new Set(needs)],
      successGoal: `From The Lab: ${business}. Goals: ${selectedGoals.join(", ") || "to discuss"}. Functionality: ${features.join(", ") || "to discuss"}. Desired experience: ${experience}. Starting direction: ${recommendation[0]} (${recommendation[1]}).`
    };
    writeStorage("session", SCOPE_KEY, JSON.stringify(scope));
    window.dispatchEvent(new CustomEvent("ahs:lab-scope", { detail: scope }));
  };

  return <div className="ahs-discovery" aria-labelledby="discovery-heading">
    <div className="ahs-discovery-head"><h3 id="discovery-heading">Tell me what the site<br/>needs to do.</h3><span>Scope discovery · a starting direction</span></div>
    <div className="ahs-discovery-grid">
      <fieldset><legend>01 — Your business</legend><div className="ahs-discovery-options">
        {(Object.keys(discoveryOptions) as Business[]).map(option=><button type="button" key={option} aria-pressed={business===option} onClick={()=>{setBusiness(option);setFeatures([...discoveryOptions[option]])}}>{option}</button>)}
      </div></fieldset>
      <fieldset><legend>02 — What should it accomplish?</legend><div className="ahs-discovery-options">
        {goals.map(option=><button type="button" key={option} aria-pressed={selectedGoals.includes(option)} onClick={()=>toggle(option,selectedGoals,setSelectedGoals)}>{option}</button>)}
      </div></fieldset>
      <fieldset className="ahs-discovery-functions"><legend>What should people be able to do?</legend><div className="ahs-discovery-options">
        {availableFeatures.map(option=><button type="button" key={option} aria-pressed={features.includes(option)} onClick={()=>toggle(option,features,setFeatures)}>{option}</button>)}
      </div></fieldset>
      <fieldset><legend>03 — How should it feel?</legend><div className="ahs-discovery-options">
        {experiences.map(option=><button type="button" key={option} aria-pressed={experience===option} onClick={()=>setExperience(option)}>{option}</button>)}
      </div></fieldset>
    </div>
    <div className="ahs-discovery-result" aria-live="polite">
      <div><small>Your direction · {experience}</small><h4>{recommendation[0]}</h4><p>{recommendation[1]}. {business === "Wedding venue" ? "A journey from discovery and galleries to planning and tour inquiry." : "Built around the actions your visitors need to take."} Final scope follows a conversation about your business.</p><ul>{features.map(feature=><li key={feature}>{feature}</li>)}</ul></div>
      <a href={inHome ? "#start" : "/start"} onClick={bringToInquiry}>Bring this direction to the studio <Image src={CURSOR} alt="" width={22} height={22} aria-hidden="true" /></a>
    </div>
  </div>
}

export default function CapabilityPlayground({inHome=false}:{inHome?:boolean}){
  const [job,setJob]=useState<Job>("Book appointments");
  const [demoKey,setDemoKey]=useState(0);
  return <section className="sheet sheet-lavender capability ahs-lab" id="capabilities">
    <div className="content-shell">
      <div className="ahs-lab-head">
        <div><span className="section-kicker-text">03 — The Lab</span><h2>What does your business<br/><em>need the internet to do?</em></h2></div>
        <p>Shape a starting scope, then try the kinds of interfaces that can make it real.</p>
      </div>
      <div className="ahs-demo-intro"><h3>Step inside the showroom.</h3><p>These are examples of systems your website can include. Choose a capability and try its interface. Every window below responds to you.</p></div>
      <div className="ahs-lab-grid">
        <nav className="ahs-job-list" aria-label="Interactive capabilities"><small>Choose a capability</small>{jobs.map((x,i)=><button key={x} type="button" aria-current={job===x?"true":undefined} className={job===x?"on":""} onClick={()=>{setJob(x);track("Lab interaction",{capability:x})}}><span>0{i+1}</span><strong>{x}</strong></button>)}<p>Need something else? If it belongs on the web, ask.</p></nav>
        <div className="ahs-demo-shell"><div className="demo-window-top"><span/><span/><span/><b>A. HALLIWELL / FUNCTIONING DEMO</b><button type="button" className="demo-reset" onClick={()=>setDemoKey(value=>value+1)} aria-label={`Reset ${job} demonstration`}>RESET DEMO</button></div><Demo key={`${job}-${demoKey}`} job={job}/><footer>DEMO ONLY · NO REAL BOOKING, PURCHASE, QUOTE, TICKET OR MESSAGE IS SUBMITTED.</footer></div>
      </div>
      <ScopeDiscovery inHome={inHome}/>
    </div>
  </section>
}
