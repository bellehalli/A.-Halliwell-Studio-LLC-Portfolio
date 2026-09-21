"use client";

import { useState } from "react";

const moments = ["Arrival", "Ceremony", "Dinner"];

export default function CapabilityPlayground() {
  const [step, setStep] = useState(0);
  const copy = ["Welcome drinks on the lawn", "Choose the garden ceremony", "Candlelit estate dinner"];
  return (
    <section className="sheet sheet-lavender capability">
      <div className="content-shell capability-grid">
        <div><span className="section-kicker-text">03 / CAPABILITY LAB</span><h2>Don’t read the list.<br/><em>Use the idea.</em></h2><p className="capability-intro">A tiny interaction showing how a complicated offer becomes a guided decision.</p><div className="capability-tabs" role="tablist" aria-label="Weekend moments">{moments.map((moment,index)=><button type="button" role="tab" aria-selected={step===index} className={step===index?"is-active":""} onClick={()=>setStep(index)} key={moment}>{moment}</button>)}</div></div>
        <div className="demo-stage"><span className="lab-note">LIVE PROTOTYPE ↘</span><div className="demo-window"><div className="demo-window-top" aria-hidden="true"><span/><span/><span/><b>BUILD YOUR WEEKEND</b></div><div className="demo-screen"><small>STEP {step+1} OF 3</small><h3>{moments[step]}</h3><div className="demo-progress" aria-hidden="true">{moments.map((_,index)=><i className={index<=step?"active":""} key={index}/>)}</div><button className="demo-interaction" type="button" onClick={()=>setStep((step+1)%moments.length)}><span>0{step+1}</span><strong>{copy[step]}</strong><span>SELECT ↗</span></button><p className="demo-result">The interface keeps the decision <span>clear, visual and moving forward.</span></p><button className="demo-action" type="button" onClick={()=>setStep((step+1)%moments.length)}>NEXT MOMENT ↗</button></div></div></div>
      </div>
    </section>
  );
}
