"use client";
import { useMemo, useState } from "react";

const dishes = [
  {name:"Charred Carrots", type:"Vegetarian", price:16, note:"labneh · pistachio · chile honey"},
  {name:"Coal-Roasted Trout", type:"Seafood", price:31, note:"fennel · preserved lemon · herbs"},
  {name:"Black Garlic Rigatoni", type:"Vegetarian", price:24, note:"pecorino · brown butter · pepper"},
  {name:"Short Rib for Two", type:"Meat", price:58, note:"potato pavé · jus · crispy shallot"},
  {name:"Citrus Olive Oil Cake", type:"Dessert", price:13, note:"crème fraîche · sea salt"},
];

export default function RestaurantConcept(){
  const [filter,setFilter]=useState("All");
  const [party,setParty]=useState("2");
  const [time,setTime]=useState("7:30 PM");
  const [reserved,setReserved]=useState(false);
  const shown=useMemo(()=>filter==="All"?dishes:dishes.filter(d=>d.type===filter),[filter]);
  return <main className="concept restaurant-concept">
    <nav className="concept-nav"><a href="/work/sable-and-salt">A. HALLIWELL / CASE STUDY</a><span>SABLE & SALT / CONCEPT</span></nav>
    <section className="restaurant-hero"><div><small>DETROIT / DINNER / THU–SUN</small><h1>SABLE<br/><em>& Salt</em></h1><p>Wood-fired plates, late dinners and the kind of room that makes “one drink” a lie.</p></div><aside className="reservation-card"><small>RESERVE A TABLE</small><label>Party size<select value={party} onChange={e=>setParty(e.target.value)}>{[2,3,4,5,6].map(x=><option key={x}>{x}</option>)}</select></label><label>Tonight<select value={time} onChange={e=>setTime(e.target.value)}>{["6:00 PM","7:30 PM","9:00 PM","10:30 PM"].map(x=><option key={x}>{x}</option>)}</select></label><button onClick={()=>setReserved(true)}>{reserved?`Held for ${party} at ${time} ♥`:"Find a table ↗"}</button><p>Concept interaction only. No reservation is submitted.</p></aside></section>
    <section className="restaurant-menu"><div className="concept-section-head"><small>THE MENU</small><h2>Order by appetite,<br/>not by PDF.</h2></div><div className="menu-filters">{["All","Vegetarian","Seafood","Meat","Dessert"].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?"on":""}>{x}</button>)}</div><div className="menu-list">{shown.map(d=><article key={d.name}><span>{d.type}</span><h3>{d.name}</h3><p>{d.note}</p><strong>${d.price}</strong></article>)}</div></section>
    <section className="restaurant-night"><small>THE JOB OF THE SITE</small><h2>Sell the night.<br/>Then make booking easy.</h2><div><span>01 / mood without mystery</span><span>02 / menu without a PDF</span><span>03 / reservations in the path</span></div></section>
  </main>
}
