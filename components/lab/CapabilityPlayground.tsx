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

export default function CapabilityPlayground(){
  const [job,setJob]=useState<Job>("Book appointments");
  return <section className="sheet sheet-lavender capability ahs-lab" id="capabilities">
    <div className="content-shell">
      <div className="ahs-lab-head">
        <div><span className="section-kicker-text">03 / THE LAB</span><h2>What does your business<br/><em>need the internet to do?</em></h2></div>
        <p>Pick a job. The interface changes in front of you. These are functioning mini demos, not a list of claims.</p>
      </div>
      <div className="ahs-lab-grid">
        <nav className="ahs-job-list"><small>CHOOSE A CAPABILITY</small>{jobs.map((x,i)=><button key={x} className={job===x?"on":""} onClick={()=>setJob(x)}><span>0{i+1}</span><strong>{x}</strong><b>↗</b></button>)}<p>Need something else? If it belongs on the web, ask.</p></nav>
        <div className="ahs-demo-shell"><div className="demo-window-top"><span/><span/><span/><b>A. HALLIWELL / FUNCTIONING DEMO</b></div><Demo job={job}/><footer>DEMO ONLY · NO REAL BOOKING, PURCHASE, QUOTE, TICKET OR MESSAGE IS SUBMITTED.</footer></div>
      </div>
    </div>
  </section>
}
