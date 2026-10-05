"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
const loading=()=> <p className="lab-loading" role="status">Opening the experiment…</p>;
const Atlas=dynamic(()=>import("./ExperienceAtlas"),{loading});
const Night=dynamic(()=>import("./NightMode"),{loading});
const Treatment=dynamic(()=>import("./TreatmentArchitect"),{loading});
const Service=dynamic(()=>import("./ServiceCommand"),{loading});
const Conversion=dynamic(()=>import("./ConversionEngine"),{loading});
const experiments=[{name:"Experience Atlas",proof:"Spatial exploration + event configuration",component:Atlas},{name:"Night Mode",proof:"Personalization + reservation design",component:Night},{name:"Treatment Architect",proof:"Guided discovery + intelligent intake",component:Treatment},{name:"Service Command",proof:"Connected customer + operational workflows",component:Service},{name:"Conversion Engine",proof:"Adaptive strategy + development",component:Conversion}];
export default function CapabilityPlayground({inHome=false}:{inHome?:boolean}){
 const [selected,setSelected]=useState(0);const [reset,setReset]=useState(0);const Experiment=experiments[selected].component;
 return <section className="flagship-lab" id="capabilities" aria-label="A. Halliwell Studio interactive Lab"><div className="flagship-lab-heading"><small>03 / THE LAB</small><h2>Test the<br/><em>capabilities.</em></h2><p>Five working experiments. Explore what thoughtful design and software can make possible for your business.</p>{inHome?<Link href="/lab">Open the full Lab ↗</Link>:null}</div><nav className="lab-experiment-tabs" aria-label="Choose a Lab experiment">{experiments.map((experiment,i)=><button key={experiment.name} type="button" aria-pressed={selected===i} aria-controls="lab-active-experiment" onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{experiment.name}</strong><small>{experiment.proof}</small></button>)}</nav><div id="lab-active-experiment" className="lab-active-experiment"><div className="lab-experiment-meta"><span>FUNCTIONING CONCEPT / {experiments[selected].proof}</span><button type="button" onClick={()=>setReset(v=>v+1)} aria-label={`Reset ${experiments[selected].name}`}>Reset experiment</button></div><Experiment key={`${selected}-${reset}`} inHome={inHome}/></div><p className="lab-global-disclosure">Original studio concepts. All prices, availability, capacities and appointment records are demo data. Real interactions; no live transaction or clinical assessment.</p></section>;
}
