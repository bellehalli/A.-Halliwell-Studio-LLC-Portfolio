"use client";
import { studio, websiteStartingPrice } from "@/lib/studio-config";
import { writeStorage } from "@/lib/browser-storage";
import { useState } from "react";
import Image from "next/image";
const CURSOR = "/assets/ui/Portfolio Assets A.Halliwell  - 24.webp";
const SCOPE_KEY = "ahs-lab-scope-v1";
const discoveryOptions = {
  "Wedding venue": ["Inquiry system","Availability","Galleries","Planning tools"],
  Hospitality: ["Booking","Galleries","Events","Inquiry system"],
  Restaurant: ["Reservations","Menu","Events"],
  "Service business": ["Booking","Services","Inquiry system"],
  "Local business": ["Focused landing page","Inquiry system"],
  "Something else": ["Inquiry system","Commerce","Client portal","Events"]
} as const;
type Business = keyof typeof discoveryOptions;
const goals = ["More inquiries","More bookings","Sell online","Smoother operations"];
const experiences = ["Editorial & immersive","Warm & welcoming","Fast & focused","High-touch & guided"];

export function ScopeDiscovery({inHome}:{inHome:boolean}) {
  const [business,setBusiness] = useState<Business>("Wedding venue");
  const [selectedGoals,setSelectedGoals] = useState<string[]>(["More inquiries"]);
  const [features,setFeatures] = useState<string[]>([...discoveryOptions["Wedding venue"]]);
  const [experience,setExperience] = useState(experiences[0]);
  const availableFeatures = [...new Set<string>([...discoveryOptions[business],"Commerce","Client portal","Booking","Events","Galleries"])];
  const needsLargerBuild = features.some(x => ["Booking","Commerce","Client portal","Planning tools"].includes(x)) || selectedGoals.some(x=>["Sell online","Smoother operations"].includes(x));
  const recommendation = business === "Wedding venue"
    ? [studio.offers.website,websiteStartingPrice]
    : business === "Restaurant" || business === "Something else" || needsLargerBuild
      ? [studio.offers.custom,"Priced by scope"]
      : [studio.offers.website,websiteStartingPrice];
  const toggle = (item:string,current:string[],set:(value:string[])=>void) =>
    set(current.includes(item) ? current.filter(x=>x!==item) : [...current,item]);

  const bringToInquiry = () => {
    const projectType = business === "Wedding venue" || business === "Hospitality" ? "Hospitality / venue"
      : business === "Restaurant" ? "Restaurant / nightlife / events"
      : business === "Service business" ? "Small business / service" : business === "Local business" ? "Small business / service" : "Something else";
    const needs = [features.includes("Focused landing page") ? "One-page website" : "Multi-page website",
      ...features.flatMap(feature => ({"Booking":"Booking or scheduling","Reservations":"Booking or scheduling","Inquiry system":"Quote or lead flow","Commerce":"E-commerce","Client portal":"Client portal","Events":"Events or ticketing","Planning tools":"Custom interactive feature"} as Record<string,string>)[feature] || [])];
    const scope = {
      projectType, needs: [...new Set(needs)],
      successGoal: `From The Lab: ${business}. Goals: ${selectedGoals.join(", ") || "to discuss"}. Functionality: ${features.join(", ") || "to discuss"}. Desired experience: ${experience}. Starting direction: ${recommendation[0]} (${recommendation[1]}).`
    };
    writeStorage("session", SCOPE_KEY, JSON.stringify(scope));
    window.dispatchEvent(new CustomEvent("ahs:lab-scope", { detail: scope }));
  };

  return <div className="ahs-discovery" aria-labelledby="discovery-heading">
    <div className="ahs-discovery-head"><h3 id="discovery-heading">Tell me what the site<br/>needs to do.</h3><span>Scope discovery · a starting direction</span></div>
    <div className="ahs-discovery-grid">
      <fieldset><legend>01 — Your business</legend><div className="ahs-discovery-options">
        {(Object.keys(discoveryOptions) as Business[]).map(option=><button type="button" key={option} aria-pressed={business===option} onClick={()=>{setBusiness(option);setFeatures([...discoveryOptions[option]])}}>{option}</button>)}
      </div></fieldset>
      <fieldset><legend>02 — What should it accomplish?</legend><div className="ahs-discovery-options">
        {goals.map(option=><button type="button" key={option} aria-pressed={selectedGoals.includes(option)} onClick={()=>toggle(option,selectedGoals,setSelectedGoals)}>{option}</button>)}
      </div></fieldset>
      <fieldset className="ahs-discovery-functions"><legend>What should people be able to do?</legend><div className="ahs-discovery-options">
        {availableFeatures.map(option=><button type="button" key={option} aria-pressed={features.includes(option)} onClick={()=>toggle(option,features,setFeatures)}>{option}</button>)}
      </div></fieldset>
      <fieldset><legend>03 — How should it feel?</legend><div className="ahs-discovery-options">
        {experiences.map(option=><button type="button" key={option} aria-pressed={experience===option} onClick={()=>setExperience(option)}>{option}</button>)}
      </div></fieldset>
    </div>
    <div className="ahs-discovery-result" aria-live="polite">
      <div><small>Your direction · {experience}</small><h4>{recommendation[0]}</h4><p>{recommendation[1]}. {business === "Wedding venue" ? "A journey from discovery and galleries to planning and tour inquiry." : "Built around the actions your visitors need to take."} Final scope follows a conversation about your business.</p><ul>{features.map(feature=><li key={feature}>{feature}</li>)}</ul></div>
      <a href={inHome ? "#start" : "/start"} onClick={bringToInquiry}>Bring this direction to the studio <Image src={CURSOR} alt="" width={22} height={22} aria-hidden="true" /></a>
    </div>
  </div>
}

