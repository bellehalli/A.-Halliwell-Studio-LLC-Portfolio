"use client";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/StudioIcons";
import type { RoutingAnswers, RoutingStep } from "@/lib/lab-routing";
const descriptions: Record<string,string> = {
 "Explore facial concerns":"Begin with face, texture, tone and definition.",
 "Explore body concerns":"Explore body areas and the questions on your mind.",
 "Help me find a starting point":"Let the practice help you begin the conversation.",
 "Skin treatment education":"Understand skin-focused services before discussing suitability.",
 "Injectable treatment education":"Learn about injectable service families with a clinician.",
 "Body treatment education":"Explore body-focused services as an education interest.",
 "Help me choose with a clinician":"Keep your options open for a professional assessment.",
 "City studio":"Explore a consultation with our fictional city team.",
 "Garden clinic":"Explore a consultation with our fictional garden team.",
 "Flexible / staff triage":"Let the practice confirm the most useful location.",
 "Membership information":"Include a conversation about ongoing care and membership terms.",
 "Financing information":"Request information about terms and eligibility. No application.",
 "Both membership and financing":"Gather both sets of information before deciding.",
 "No information requested":"Keep this conversation focused on your consultation.",
 "Non-surgical conversation":"Start a conversation about non-surgical options.",
 "Surgical consultation":"Request a surgical discussion with a qualified clinician.",
 "Compare both with a clinician":"Explore both pathways before choosing a direction.",
 "Unsure":"The practice can help you find a starting point.",
 "Skin / aesthetics":"Direct your discussion toward the skin and aesthetics team.",
 "Body / plastic surgery":"Ask about a body or surgical consultation.",
 "Wellness services":"Discuss the practice’s available wellness services.",
 "Multiple service lines":"Bring several interests into one conversation.",
 "Staff triage":"Ask the team to confirm the appropriate service line.",
};
export function MedSpaOptions({step,answers,onChoose,visual=false}:{step:RoutingStep;answers:RoutingAnswers;onChoose:(option:string)=>void;visual?:boolean}) {
 return <div className={`medspa-option-grid ${visual?"medspa-option-grid-visual":""}`}>{step.options.map((option,i)=><button key={option} type="button" aria-pressed={!!answers[step.key]?.includes(option)} onClick={()=>onChoose(option)}>
 {visual?<div className="medspa-option-image"><Image src={option.includes("body")||option.includes("Body")?"/assets/lab/consultation-body-front.webp":"/assets/lab/consultation-face.webp"} alt="" width={612} height={408} sizes="(max-width:520px) 90vw, 250px"/><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span></div>:<span className="medspa-option-number" aria-hidden="true">{String(i+1).padStart(2,"0")}</span>}
 <span className="medspa-option-copy"><strong>{option}</strong>{descriptions[option]?<span>{descriptions[option]}</span>:null}</span><span className="medspa-option-mark" aria-hidden="true">{answers[step.key]?.includes(option)?"✓":<ArrowUpRight/>}</span></button>)}</div>;
}
export function MedSpaSelectionSummary({steps,answers,onEdit}:{steps:readonly RoutingStep[];answers:RoutingAnswers;onEdit:(index:number)=>void}) {
 return <dl className="medspa-selection-summary">{steps.map((s,i)=>answers[s.key]?.length?<div key={s.key}><dt>{s.label}</dt><dd>{answers[s.key].join(", ")}</dd><button type="button" onClick={()=>onEdit(i)} aria-label={`Edit ${s.label}`}>Edit</button></div>:null)}</dl>;
}
