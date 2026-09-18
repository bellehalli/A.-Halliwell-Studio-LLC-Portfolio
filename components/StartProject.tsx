"use client";
import { useMemo, useState } from "react";

const questions=[
 {key:"type",label:"What are we making?",options:["A new website","A redesign","Booking / commerce","An interactive system","Something unusual"]},
 {key:"needs",label:"What does it need to do?",options:["Generate qualified leads","Take bookings","Sell online","Explain a complex offer","Run events / memberships","A mix of things"]},
 {key:"timeline",label:"What’s the timing?",options:["ASAP / priority build","1–2 months","2–4 months","Flexible / planning ahead"]},
 {key:"investment",label:"What investment are you planning for?",options:["$5k–$10k","$10k–$20k","$20k–$30k","$30k+","Not sure yet"]},
] as const;
export default function StartProject(){
 const [step,setStep]=useState(0); const [answers,setAnswers]=useState<Record<string,string>>({}); const [copied,setCopied]=useState(false);
 const complete=step>=questions.length; const brief=useMemo(()=>`A. HALLIWELL STUDIO — PROJECT BRIEF\n\nProject: ${answers.type||""}\nPrimary job: ${answers.needs||""}\nTimeline: ${answers.timeline||""}\nInvestment: ${answers.investment||""}\n`,[answers]);
 const select=(key:string,value:string)=>{setAnswers(a=>({...a,[key]:value})); setTimeout(()=>setStep(s=>Math.min(s+1,questions.length)),120)};
 const copy=async()=>{await navigator.clipboard.writeText(brief);setCopied(true);setTimeout(()=>setCopied(false),1800)};
 const restart=()=>{setAnswers({});setStep(0);setCopied(false)};
 return <section className="sheet sheet-dark start" id="start"><div className="content-shell start-inner"><span className="section-kicker-text">05 / START A PROJECT</span><h2>Start something<br/><em>good♥</em></h2><p>Build a quick project brief. Four useful questions, no twenty-field contact form.</p>
  <div className="brief-card"><div className="brief-progress"><span>{complete?"BRIEF READY":`QUESTION ${step+1} / ${questions.length}`}</span><div>{questions.map((_,i)=><i key={i} className={i<step||complete?"done":i===step?"current":""}/>)}</div></div>
  {!complete ? <div className="brief-question" key={questions[step].key}><h3>{questions[step].label}</h3><div className="start-choices">{questions[step].options.map(item=><button type="button" key={item} onClick={()=>select(questions[step].key,item)}>{item}</button>)}</div>{step>0&&<button className="brief-back" type="button" onClick={()=>setStep(s=>s-1)}>← Back</button>}</div> : <div className="brief-result"><small>YOUR PROJECT BRIEF</small><h3>{answers.type}</h3><dl><div><dt>Primary job</dt><dd>{answers.needs}</dd></div><div><dt>Timeline</dt><dd>{answers.timeline}</dd></div><div><dt>Investment</dt><dd>{answers.investment}</dd></div></dl><div className="brief-actions"><button className="big-cta" type="button" onClick={copy}>{copied?"Copied ♥":"Copy project brief"}<span>↗</span></button><button className="brief-back" type="button" onClick={restart}>Start over</button></div></div>}
  </div><small className="start-note">This brief stays in your browser until you choose to copy it. Inquiry delivery is connected separately before launch.</small>
 </div></section>
}
