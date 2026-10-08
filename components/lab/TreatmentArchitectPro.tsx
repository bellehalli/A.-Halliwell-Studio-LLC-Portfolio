"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { medspaJourneySteps, journeyStages, journeyStage } from "@/lib/medspa-journey";
import { routingBrief, updateRoutingAnswer, type RoutingAnswers } from "@/lib/lab-routing";
import { BriefLink, Preview, usePublishLabBrief } from "./LabShared";
import { MedSpaOptions, MedSpaSelectionSummary } from "./MedSpaPresentation";
const disclosure = "Your choices prepare a consultation conversation. A clinician determines suitability and treatment options after assessment. Demo locations and teams are fictional. Membership terms, financing eligibility and appointments require practice confirmation.";
const prompts = [
 {title:"Where would you like to begin?",text:"A good conversation starts with your intention. Choose the direction you want to explore."},
 {title:"Tell us what matters to you.",text:"Collect your discussion priorities. You can select more than one, or leave the starting point to the team."},
 {title:"Make room for understanding.",text:"Choose a treatment family you want to learn about. This is an education interest, not a treatment recommendation."},
 {title:"Find your preferred setting.",text:"Choose a fictional practice location, or let the team help you decide."},
 {title:"A conversation with the right team.",text:"These demo teams reflect your chosen location. The practice confirms credentials and availability."},
 {title:"Consider the bigger picture.",text:"Include membership or financing information if it matters to your decision. No application or payment is made."},
 {title:"Choose a thoughtful next step.",text:"Tell the practice how you would like to start. No appointment is booked in this demonstration."},
];
const needs=["Custom interactive feature","Quote or lead flow","Booking or scheduling"];
export default function TreatmentArchitectPro({inHome=false}:{inHome?:boolean}) {
 const [answers,setAnswers]=useState<RoutingAnswers>({});
 const [index,setIndex]=useState(0);
 const heading=useRef<HTMLHeadingElement>(null);
 const steps=medspaJourneySteps(answers), step=steps[index], stage=journeyStage(index);
 const complete=steps.every(s=>answers[s.key]?.length);
 const summary=routingBrief(steps,answers);
 const selectedCount=steps.filter(s=>answers[s.key]?.length).length;
 const body=answers.goal?.includes("Explore body concerns");
 const image=body?"/assets/lab/consultation-body-front.webp":"/assets/lab/consultation-face.webp";
 const conciergeSummary=answers.location?`Your ${body?"body":"facial"} discussion is taking shape around ${answers.location[0].toLowerCase()}. ${answers.provider?`Team preference: ${answers.provider[0]}.`:"Choose your preferred team next."}`:answers.concern?`Your conversation will include ${answers.concern.join(", ").toLowerCase()}. Explore the education that interests you next.`:answers.goal?`${answers.goal[0]}. We’ll gather the topics you want to discuss, then your practice preferences.`:"Your choices will shape a personal discussion brief, one thoughtful step at a time.";
 usePublishLabBrief({name:"Treatment Architect Pro",projectType:"Beauty / wellness",needs,summary});
 const move=(next:number)=>{setIndex(next);requestAnimationFrame(()=>heading.current?.focus());};
 return <div className="lab-experiment lab-medspa-pro medspa-product medspa-concierge">
  <header className="medspa-product-heading"><div><small>TREATMENT ARCHITECT PRO / YOUR CONCIERGE</small><h3>A little guidance.<br/><em>A more personal beginning.</em></h3></div><p>From your first intention to a considered consultation, with your preferences connected along the way.</p></header>
  <div className="medspa-concierge-shell">
   <aside className="medspa-concierge-story"><div className="medspa-concierge-image medspa-reveal" key={image}><Image src={image} alt="Consultation discovery reference" width={body?1024:612} height={body?1536:408} sizes="(max-width:850px) 90vw, 35vw"/></div><div className="medspa-concierge-story-copy"><small>YOUR CONVERSATION / {journeyStages[stage]}</small><h4>{body?"Your body.":"Your intention."}<br/><em>Your perspective.</em></h4><p className="medspa-reveal" key={conciergeSummary}>{conciergeSummary}</p><div className="medspa-concierge-progress"><span>{selectedCount} of {steps.length} preferences shaped</span><progress aria-label="Concierge journey completed" max={steps.length} value={selectedCount}/></div></div></aside>
   <div className="medspa-concierge-main"><nav className="medspa-concierge-stages" aria-label="Consultation journey">{journeyStages.map((label,i)=>{const target=steps.findIndex((_,j)=>journeyStage(j)===i);const available=i===stage||steps.slice(0,target).every(s=>answers[s.key]?.length);return <button key={label} type="button" disabled={!available} aria-current={stage===i?"step":undefined} onClick={()=>move(target)}><span>{String(i+1).padStart(2,"0")}</span><span>{label}</span></button>;})}</nav>
    <section className="medspa-concierge-decision" aria-label="Configure consultation journey"><p className="medspa-eyebrow" role="status">{journeyStages[stage]} / selection {index+1} of {steps.length}</p><h4 ref={heading} tabIndex={-1}>{prompts[index].title}</h4><div className="medspa-reveal" key={index}><p>{prompts[index].text}</p><fieldset><legend className="medspa-sr-only">{step.label}{step.multiple?" (select all that apply)":""}</legend><MedSpaOptions step={step} answers={answers} onChoose={option=>setAnswers(current=>updateRoutingAnswer(current,steps,index,option))} visual={index===0||index===2}/></fieldset></div>
    <div className="medspa-decision-actions"><button className="medspa-text-button" type="button" disabled={index===0} onClick={()=>move(index-1)}>Back</button>{index<steps.length-1?<button type="button" className="medspa-action" disabled={!answers[step.key]?.length} onClick={()=>move(index+1)}>Continue to {journeyStages[journeyStage(index+1)]}<ArrowUpRight/></button>:null}<span>{step.multiple?"Choose all that matter":"Choose one direction"}</span></div>
    </section>
    <section className="medspa-concierge-brief" aria-label="Live consultation plan"><div><small>YOUR CONCIERGE NOTES</small><p>{complete?"Your consultation brief is ready.":selectedCount?"A clearer picture, with every choice.":"Your preferences will gather here."}</p></div>{selectedCount?<details><summary>Review & edit {selectedCount} preferences</summary><MedSpaSelectionSummary steps={steps} answers={answers} onEdit={move}/></details>:null}</section>
   </div>
  </div>
  {complete?<section className="medspa-concierge-complete medspa-reveal" aria-label="Ready for consultation review"><div><small>YOUR NEXT CHAPTER</small><h4>Prepared for<br/><em>a real conversation.</em></h4><p>{answers.consultation?.[0]} · {answers.location?.[0]}. {answers.support?.[0]==="No information requested"?"Your brief is focused on consultation preferences.":`${answers.support?.[0]} included for discussion.`}</p></div><div><Preview title="Preview consultation request"><p style={{whiteSpace:"pre-line"}}>{summary}</p><p>{disclosure}</p></Preview><BriefLink inHome={inHome} name="Treatment Architect Pro" projectType="Beauty / wellness" needs={needs} summary={summary}/></div></section>:null}
  <p className="lab-caption">{disclosure}</p><p className="lab-caption">No request is submitted. The AHS project link carries demo preferences into Start Project; keep personal medical information out of your inquiry.</p>
 </div>;
}
