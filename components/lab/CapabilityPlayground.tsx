"use client";
import { useState } from "react";

const jobs = ["Book appointments","Sell products","Request quotes","Client portal","Manage events","Capture leads"] as const;
type Job = typeof jobs[number];

function Booking() {
  const [day,setDay]=useState("WED 14");
  const [time,setTime]=useState("1:00 PM");
  return <div className="ahs-live">
    <header><div><small>BOOKING / SCHEDULING</small><h3>Choose a time</h3></div><b>LIVE UI</b></header>
    <div className="ahs-days">{["MON 12","TUE 13","WED 14","THU 15","FRI 16"].map(x=><button key={x} className={day===x?"on":""} onClick={()=>setDay(x)}>{x}</button>)}</div>
    <div className="ahs-pills">{["10:00 AM","11:30 AM","1:00 PM","3:30 PM"].map(x=><button key={x} className={time===x?"on":""} onClick={()=>setTime(x)}>{x}</button>)}</div>
    <aside><small>SELECTED</small><strong>{day} · {time}</strong><p>This could connect to live staff availability, deposits, reminders and confirmation emails.</p></aside>
  </div>
}

function Shop() {
  const [item,setItem]=useState("Silk Set");
  const [cart,setCart]=useState(false);
  return <div className="ahs-live">
    <header><div><small>E-COMMERCE</small><h3>Shop the edit</h3></div><b>{cart?"1 ITEM":"0 ITEMS"}</b></header>
    <div className="ahs-products">{["Silk Set","Crystal Bag","Pink Mule"].map((x,i)=><button key={x} className={item===x?"on":""} onClick={()=>{setItem(x);setCart(false)}}><i>{["✦","♡","✿"][i]}</i><strong>{x}</strong><span>${[148,92,124][i]}</span></button>)}</div>
    <button className="ahs-main-action" onClick={()=>setCart(true)}>{cart?`${item} added ♥`:`Add ${item} to cart`}</button>
  </div>
}

function Quote() {
  const [service,setService]=useState("Website redesign");
  const [pages,setPages]=useState(5);
  return <div className="ahs-live">
    <header><div><small>SMART QUOTE BUILDER</small><h3>Build the request</h3></div><b>CONDITIONAL</b></header>
    <label><span>WHAT DO YOU NEED?</span><select value={service} onChange={e=>setService(e.target.value)}><option>Website redesign</option><option>Custom feature</option><option>Brand refresh</option></select></label>
    {service==="Website redesign"&&<label><span>APPROXIMATE PAGES</span><input type="range" min="1" max="12" value={pages} onChange={e=>setPages(+e.target.value)}/><strong>{pages} pages</strong></label>}
    <aside><small>READY TO ROUTE</small><strong>{service}{service==="Website redesign"?` · ${pages} pages`:""}</strong><p>A real build could calculate ranges or trigger different follow-ups.</p></aside>
  </div>
}

function Portal() {
  const [tab,setTab]=useState("Overview");
  const data:Record<string,string[]>={
    Overview:["Website redesign","In progress","Next review: Friday"],
    Files:["Brand-assets.zip","Homepage-v3.pdf","Copy-notes.docx"],
    Messages:["2 unread","Latest: homepage feedback","Reply from dashboard"]
  };
  return <div className="ahs-live ahs-portal">
    <nav><strong>CLIENT SPACE</strong>{Object.keys(data).map(x=><button key={x} className={tab===x?"on":""} onClick={()=>setTab(x)}>{x}</button>)}</nav>
    <section><small>WELCOME BACK</small><h3>{tab}</h3>{data[tab].map((x,i)=><div className="ahs-card" key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}</section>
  </div>
}

function Events() {
  const [filter,setFilter]=useState("All");
  const events=[["Workshop","CERAMICS AFTER DARK","OCT 04"],["Dinner","CHEF'S TABLE","OCT 12"],["Music","MIDNIGHT LISTENING ROOM","OCT 18"]];
  return <div className="ahs-live">
    <header><div><small>EVENTS / TICKETING</small><h3>What&apos;s happening</h3></div></header>
    <div className="ahs-pills">{["All","Workshop","Dinner","Music"].map(x=><button key={x} className={filter===x?"on":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    <div className="ahs-events">{events.filter(e=>filter==="All"||e[0]===filter).map(e=><article key={e[1]}><span>{e[2]}</span><div><small>{e[0]}</small><strong>{e[1]}</strong></div><button>TICKETS ↗</button></article>)}</div>
  </div>
}

function Leads() {
  const [goal,setGoal]=useState("Book a consultation");
  const [budget,setBudget]=useState("$5k–$10k");
  return <div className="ahs-live">
    <header><div><small>LEAD QUALIFICATION</small><h3>Start with context</h3></div><b>SMART FORM</b></header>
    <p className="ahs-label">WHAT&apos;S THE GOAL?</p><div className="ahs-pills">{["Book a consultation","Get a proposal","Ask a question"].map(x=><button key={x} className={goal===x?"on":""} onClick={()=>setGoal(x)}>{x}</button>)}</div>
    <p className="ahs-label">PROJECT RANGE</p><div className="ahs-pills">{["$1k–$5k","$5k–$10k","$10k+"].map(x=><button key={x} className={budget===x?"on":""} onClick={()=>setBudget(x)}>{x}</button>)}</div>
    <aside><small>LEAD CONTEXT</small><strong>{goal} · {budget}</strong><p>The business starts the conversation with useful information instead of a blank email.</p></aside>
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
  Restaurant: ["Reservations","Menu","Events"],
  "Small business": ["Focused landing page","Inquiry system","Booking"],
  "Something else": ["Inquiry system","Commerce","Client portal","Events"]
} as const;
type Business = keyof typeof discoveryOptions;
const goals = ["More inquiries","More bookings","Sell online","Smoother operations"];

function ScopeDiscovery() {
  const [business,setBusiness] = useState<Business>("Wedding venue");
  const [selectedGoals,setSelectedGoals] = useState<string[]>(["More inquiries"]);
  const [features,setFeatures] = useState<string[]>([...discoveryOptions["Wedding venue"]]);
  const availableFeatures = [...new Set<string>([...discoveryOptions[business],"Commerce","Client portal","Booking","Events"])];
  const needsLargerBuild = features.some(x => ["Booking","Commerce","Client portal","Planning tools"].includes(x)) || selectedGoals.some(x=>["Sell online","Smoother operations"].includes(x));
  const recommendation = business === "Wedding venue"
    ? ["Custom Website","Starting at $5,000 + scope"]
    : business === "Restaurant" || business === "Something else" || needsLargerBuild
      ? ["Custom Scope","Priced by scope"]
      : ["One Page","Starting at $1,000 + scope"];
  const toggle = (item:string,current:string[],set:(value:string[])=>void) =>
    set(current.includes(item) ? current.filter(x=>x!==item) : [...current,item]);

  return <div className="ahs-discovery" aria-labelledby="discovery-heading">
    <div className="ahs-discovery-head"><h3 id="discovery-heading">Tell me what the site<br/>needs to do.</h3><span>01 — Scope Discovery</span></div>
    <div className="ahs-discovery-grid">
      <fieldset><legend>Your business</legend><div className="ahs-discovery-options">
        {(Object.keys(discoveryOptions) as Business[]).map(option=><button type="button" key={option} aria-pressed={business===option} onClick={()=>{setBusiness(option);setFeatures([...discoveryOptions[option]])}}>{option}</button>)}
      </div></fieldset>
      <fieldset><legend>Your goals</legend><div className="ahs-discovery-options">
        {goals.map(option=><button type="button" key={option} aria-pressed={selectedGoals.includes(option)} onClick={()=>toggle(option,selectedGoals,setSelectedGoals)}>{option}</button>)}
      </div></fieldset>
      <fieldset className="ahs-discovery-functions"><legend>Functionality worth building</legend><div className="ahs-discovery-options">
        {availableFeatures.map(option=><button type="button" key={option} aria-pressed={features.includes(option)} onClick={()=>toggle(option,features,setFeatures)}>{option}</button>)}
      </div></fieldset>
    </div>
    <div className="ahs-discovery-result" aria-live="polite">
      <div><small>A starting direction{selectedGoals.length ? ` · ${selectedGoals.join(" · ")}` : ""}</small><h4>{recommendation[0]}</h4><p>{recommendation[1]}. The final scope comes from a conversation about your business.</p><ul>{features.map(feature=><li key={feature}>{feature}</li>)}</ul></div>
      <a href="#start">Bring this idea to the studio ↗</a>
    </div>
  </div>
}

export default function CapabilityPlayground(){
  const [job,setJob]=useState<Job>("Book appointments");
  return <section className="sheet sheet-lavender capability ahs-lab" id="capabilities">
    <div className="content-shell">
      <div className="ahs-lab-head">
        <div><span className="section-kicker-text">03 — The Lab</span><h2>What does your business<br/><em>need the internet to do?</em></h2></div>
        <p>Shape a starting scope, then try the kinds of interfaces that can make it real.</p>
      </div>
      <ScopeDiscovery/>
      <div className="ahs-demo-intro"><h3>Step inside the showroom.</h3><p>Choose a capability and try its interface. Every window below responds to you.</p></div>
      <div className="ahs-lab-grid">
        <nav className="ahs-job-list" aria-label="Interactive capabilities"><small>Choose a capability</small>{jobs.map((x,i)=><button key={x} type="button" aria-current={job===x?"true":undefined} className={job===x?"on":""} onClick={()=>setJob(x)}><span>0{i+1}</span><strong>{x}</strong><b>↗</b></button>)}<p>Need something else? If it belongs on the web, ask.</p></nav>
        <div className="ahs-demo-shell"><div className="demo-window-top"><span/><span/><span/><b>A. HALLIWELL / FUNCTIONING DEMO</b></div><Demo job={job}/><footer>DEMO ONLY · NO REAL BOOKING, PURCHASE, QUOTE, TICKET OR MESSAGE IS SUBMITTED.</footer></div>
      </div>
    </div>
  </section>
}
