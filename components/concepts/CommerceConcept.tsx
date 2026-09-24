"use client";
import { useMemo, useState } from "react";

const products=[
 {name:"After Hours Corset",group:"Tops",price:118,sizes:["XS","S","M","L","XL"],mark:"01"},
 {name:"Soft Static Skirt",group:"Bottoms",price:94,sizes:["XS","S","M","L","XL"],mark:"02"},
 {name:"Room Service Mini",group:"Dresses",price:146,sizes:["XS","S","M","L","XL"],mark:"03"},
 {name:"Main Character Coat",group:"Outerwear",price:210,sizes:["S","M","L","XL"],mark:"04"},
];

export default function CommerceConcept(){
 const [group,setGroup]=useState("All"),[bag,setBag]=useState(0),[size,setSize]=useState<Record<string,string>>({});
 const shown=useMemo(()=>group==="All"?products:products.filter(p=>p.group===group),[group]);
 return <main className="concept commerce-concept">
  <nav className="concept-nav"><a href="/work/muse-room">A. HALLIWELL / CASE STUDY</a><span>MUSE ROOM / CONCEPT</span><b>BAG {bag}</b></nav>
  <section className="commerce-hero"><small>DROP 01 / NIGHT SHIFT</small><h1>Clothes for<br/><em>after the plan changes.</em></h1><p>A compact commerce prototype built to make product, size and cart state obvious without flattening the brand.</p><button onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>Shop the drop ↓</button></section>
  <section className="commerce-shop" id="shop"><div className="concept-section-head"><small>SHOP</small><h2>Browse. Choose.<br/>See the state change.</h2></div><div className="commerce-filters">{["All","Tops","Bottoms","Dresses","Outerwear"].map(x=><button key={x} onClick={()=>setGroup(x)} className={group===x?"on":""}>{x}</button>)}</div><div className="commerce-grid">{shown.map(p=><article key={p.name}><div className={`commerce-art art-${p.mark}`}><span>{p.mark}</span><em>MUSE</em></div><small>{p.group}</small><h3>{p.name}</h3><strong>${p.price}</strong><div className="size-row">{p.sizes.map(s=><button key={s} className={size[p.name]===s?"on":""} onClick={()=>setSize(v=>({...v,[p.name]:s}))}>{s}</button>)}</div><button className="add-bag" disabled={!size[p.name]} onClick={()=>setBag(v=>v+1)}>{size[p.name]?`Add ${size[p.name]} to bag ↗`:"Choose a size"}</button></article>)}</div></section>
  <section className="commerce-proof"><small>THE JOB OF THE SITE</small><h2>Make the pretty part<br/>carry the sale.</h2><div><span>FILTER</span><span>VARIANT</span><span>CART STATE</span><span>MOBILE FLOW</span></div></section>
 </main>
}
