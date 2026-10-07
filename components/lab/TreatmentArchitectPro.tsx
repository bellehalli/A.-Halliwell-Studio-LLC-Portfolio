"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { medspaJourneySteps, journeyStages, journeyStage } from "@/lib/medspa-journey";
import { routingBrief, updateRoutingAnswer, type RoutingAnswers } from "@/lib/lab-routing";
import { BriefLink, Preview, usePublishLabBrief } from "./LabShared";
const disclosure = "Your choices prepare a consultation conversation. A clinician determines suitability and treatment options after assessment. Demo locations and teams are fictional. Membership terms, financing eligibility and appointments require practice confirmation.";
export default function TreatmentArchitectPro({inHome=false}:{inHome?:boolean}) {
 const [answers,setAnswers]=useState<RoutingAnswers>({});
 const [index,setIndex]=useState(0);
 const heading=useRef<HTMLHeadingElement>(null);
 const steps=medspaJourneySteps(answers), step=steps[index], stage=journeyStage(index);
 const complete=steps.every(s=>answers[s.key]?.length);
 const summary=routingBrief(steps,answers);
 const needs=["Custom interactive feature","Quote or lead flow","Booking or scheduling"];
 usePublishLabBrief({name:"Treatment Architect Pro",projectType:"Beauty / wellness",needs,summary});
 const move=(next:number)=>{setIndex(next);requestAnimationFrame(()=>heading.current?.focus());};
 return <div className="lab-experiment lab-medspa-pro"><header className="lab-experiment-head"><div><small>TREATMENT ARCHITECT PRO</small><h3>From curiosity<br/><em>to a considered consultation.</em></h3></div><p>A connected journey that adapts the discussion topics and practice team as preferences change.</p></header>
 <ol className="lab-medspa-progress" aria-label="Consultation journey">{journeyStages.map((label,i)=><li key={label} aria-current={stage===i?"step":undefined}><span>{String(i+1).padStart(2,"0")}</span>{label}</li>)}</ol>
 <div className="lab-medspa-workspace"><div className="lab-medspa-editorial"><Image src={answers.goal?.includes("Explore body concerns")?"/assets/lab/consultation-body-front.webp":"/assets/lab/consultation-face.webp"} alt="Consultation discovery reference" width={612} height={408} sizes="(max-width:850px) 90vw, 35vw"/><div><small>YOUR PATH / {journeyStages[stage]}</small><p>One intention.<br/><em>A journey shaped around it.</em></p></div></div>
 <section className="lab-medspa-step" aria-label="Configure consultation journey"><p role="status">Selection {index+1} of {steps.length} · {journeyStages[stage]}</p><h4 ref={heading} tabIndex={-1}>{step.label}</h4><p>{index===2?"Choose an education interest. This does not match a treatment to your concern.":index===4?"Teams shown reflect your selected demo location. Credentials and availability are confirmed by the practice.":index===5?"Request information only. No credit application, eligibility decision or payment is made.":"Use fictional preferences to try the experience."}</p><fieldset className="lab-choices"><legend>{step.label}{step.multiple?" (select all that apply)":""}</legend><div>{step.options.map(option=><button key={option} type="button" aria-pressed={!!answers[step.key]?.includes(option)} onClick={()=>setAnswers(current=>updateRoutingAnswer(current,steps,index,option))}>{option}</button>)}</div></fieldset><div className="lab-pills"><button type="button" disabled={index===0} onClick={()=>move(index-1)}>Back</button>{index<steps.length-1?<button type="button" disabled={!answers[step.key]?.length} onClick={()=>move(index+1)}>Continue</button>:null}</div>
 </section></div><section className="lab-result" aria-label="Live consultation plan"><small>YOUR JOURNEY, CONNECTED</small><dl className="lab-medspa-summary">{steps.map((s,i)=><div key={s.key}><dt>{s.label}</dt><dd>{answers[s.key]?.join(", ")||"Awaiting your choice"}</dd>{answers[s.key]?.length?<button type="button" onClick={()=>move(i)} aria-label={`Edit ${s.label}`}>Edit</button>:null}</div>)}</dl></section><p className="lab-caption">{disclosure}</p><Preview title="Preview consultation request" disabled={!complete}><p style={{whiteSpace:"pre-line"}}>{summary}</p><p>{disclosure}</p></Preview>{complete?<BriefLink inHome={inHome} name="Treatment Architect Pro" projectType="Beauty / wellness" needs={needs} summary={summary}/>:null}<p className="lab-caption">No request is submitted. The AHS project link carries demo preferences into Start Project; keep personal medical information out of your inquiry.</p></div>;
}
