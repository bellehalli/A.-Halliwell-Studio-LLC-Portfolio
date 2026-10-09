"use client";
import { useMemo, useState } from "react";
type Stage = "New inquiry" | "Qualified" | "Consultation booked" | "Proposal sent" | "Won";
type Lead = { id: number; name: string; interest: string; value: number; stage: Stage; next: string };
const stages: Stage[] = ["New inquiry","Qualified","Consultation booked","Proposal sent","Won"];
const seed: Lead[] = [
  {id:1,name:"Morgan L.",interest:"Membership exploration",value:2400,stage:"New inquiry",next:"Review membership interest"},
  {id:2,name:"Taylor R.",interest:"Skin consultation",value:1800,stage:"Qualified",next:"Offer consultation times"},
  {id:3,name:"Jordan P.",interest:"Treatment package",value:3500,stage:"Consultation booked",next:"Prepare consultation brief"},
  {id:4,name:"Alex C.",interest:"Wellness plan",value:2200,stage:"Proposal sent",next:"Follow up on proposal"},
  {id:5,name:"Casey M.",interest:"Annual membership",value:3000,stage:"Won",next:"Welcome and onboarding"}
];
export default function RevenueCRM() {
  const [leads,setLeads]=useState<Lead[]>(seed);
  const [filter,setFilter]=useState<Stage | "All">("All");
  const [selected,setSelected]=useState<number>(1);
  const active=leads.find(l=>l.id===selected) ?? leads[0];
  const visible=filter==="All"?leads:leads.filter(l=>l.stage===filter);
  const metrics=useMemo(()=>({pipeline:leads.filter(l=>l.stage!=="Won").reduce((s,l)=>s+l.value,0),won:leads.filter(l=>l.stage==="Won").reduce((s,l)=>s+l.value,0),consultations:leads.filter(l=>l.stage==="Consultation booked").length}),[leads]);
  function advance(id:number){setLeads(old=>old.map(l=>l.id!==id?l:{...l,stage:stages[Math.min(stages.indexOf(l.stage)+1,stages.length-1)],next:stages.indexOf(l.stage)>=3?"Welcome and onboarding":"Review next-step handoff"}));}
  return <section className="lab-experiment" aria-label="Revenue CRM interactive demonstration" style={{display:"grid",gap:"1.2rem"}}>
    <header className="lab-experiment-head"><div><small>07 / REVENUE CRM</small><h3>Every inquiry.<br/><em>A clear next step.</em></h3></div><p>Explore a lead-to-revenue workflow with a qualification pipeline, next actions and sales reporting.</p></header>
    <p className="lab-caption">Interactive demonstration only. All contacts, opportunities and totals are fictional. No real patient records, clinical notes, messages or payments are stored or transmitted.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem"}}>
      {[["Open opportunity value",metrics.pipeline.toLocaleString("en-US",{style:"currency",currency:"USD"})],["Demo revenue won",metrics.won.toLocaleString("en-US",{style:"currency",currency:"USD"})],["Consultations booked",String(metrics.consultations)]].map(([label,value])=><div key={label} className="lab-business-case" style={{padding:"1rem",display:"block"}}><small>{label}</small><h3 style={{margin:".35rem 0"}}>{value}</h3></div>)}
    </div>
    <div className="lab-pills" role="group" aria-label="Filter opportunities">{(["All",...stages] as const).map(stage=><button type="button" key={stage} aria-pressed={filter===stage} onClick={()=>setFilter(stage)}>{stage}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:"1rem"}}>
      <div style={{display:"grid",gap:".65rem"}} aria-label="Demo opportunities">{visible.map(lead=><button type="button" key={lead.id} onClick={()=>setSelected(lead.id)} aria-pressed={selected===lead.id} style={{textAlign:"left",padding:"1rem",border:"1px solid currentColor",borderRadius:"12px",background:"transparent",color:"inherit"}}><strong>{lead.name}</strong><span style={{display:"block",opacity:.8}}>{lead.interest}</span><span style={{display:"block",marginTop:".35rem"}}>{lead.stage} · {lead.value.toLocaleString("en-US",{style:"currency",currency:"USD"})}</span></button>)}{visible.length===0?<p>No demo opportunities in this stage.</p>:null}</div>
      {active?<div className="lab-business-case" style={{display:"block",padding:"1.3rem"}}><small>OPPORTUNITY DETAIL</small><h3>{active.name}</h3><p>{active.interest}</p><p><strong>Current stage:</strong> {active.stage}</p><p><strong>Next action:</strong> {active.next}</p><p><strong>Potential value:</strong> {active.value.toLocaleString("en-US",{style:"currency",currency:"USD"})}</p><button type="button" onClick={()=>advance(active.id)} disabled={active.stage==="Won"} style={{padding:".8rem 1.1rem",borderRadius:"2rem",cursor:"pointer"}}>{active.stage==="Won"?"Opportunity won":"Advance opportunity →"}</button></div>:null}
    </div>
    <p className="lab-caption">Production scope can include role-based access, opt-in capture, lead attribution, task reminders, pipelines, reporting and approved scheduling or CRM integrations. Medical information requires separately scoped privacy, security and compliance work.</p>
  </section>;
}
