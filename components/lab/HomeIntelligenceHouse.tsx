"use client";
import { useId } from "react";

const hotspots = [
  { name: "Heating / cooling", x: 27, y: 76 },
  { name: "Water / drains", x: 73, y: 76 },
  { name: "Power / lighting", x: 73, y: 43 },
  { name: "Air / ventilation", x: 27, y: 43 },
];

export default function HomeIntelligenceHouse({ system, onSelect }: {
  system: string;
  onSelect: (system: string) => void;
}) {
  const id = useId();
  return <figure className="lab-house-frame">
    <div className="lab-house-heading"><span>NORTHSTAR / HOME INTELLIGENCE</span><span>SELECT A SYSTEM</span></div>
    <div className="lab-house" aria-label="Interactive house system selector">
      <svg viewBox="0 0 700 440" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Architectural cutaway of a home with living rooms above, heating equipment and plumbing below">
        <defs>
          <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#172e40"/><stop offset="1" stopColor="#385466"/></linearGradient>
          <linearGradient id={`${id}-wall`} x2="0" y2="1"><stop stopColor="#fff8e9"/><stop offset="1" stopColor="#dfd1b8"/></linearGradient>
          <linearGradient id={`${id}-roof`} x2="0" y2="1"><stop stopColor="#a77b5c"/><stop offset="1" stopColor="#5e463a"/></linearGradient>
          <pattern id={`${id}-tile`} width="28" height="13" patternUnits="userSpaceOnUse"><path d="M0 12.5H28M14 0V13" stroke="#e2c4a0" strokeOpacity=".25" fill="none"/></pattern>
        </defs>
        <rect width="700" height="440" fill={`url(#${id}-sky)`}/>
        <circle cx="590" cy="65" r="36" fill="#f8ead0" opacity=".12"/>
        <path d="M0 373Q125 357 234 374T470 370T700 368V440H0Z" fill="#122b37"/>
        <path d="M20 377H680" stroke="#80908c" strokeOpacity=".45"/>
        <path d="M71 135L350 32L629 135L610 155L350 63L90 155Z" fill={`url(#${id}-roof)`}/>
        <path d="M71 135L350 32L629 135L610 155L350 63L90 155Z" fill={`url(#${id}-tile)`}/>
        <path d="M518 91V45H548V104" fill="#a68870" stroke="#d8baa0" strokeWidth="3"/>
        <path d="M103 143L350 63L597 143V371H103Z" fill={`url(#${id}-wall)`} stroke="#e9d9bd" strokeWidth="4"/>
        <path d="M110 151L350 73L590 151H110Z" fill="#c4b296"/>
        <path d="M182 127H518M230 111H470M282 94H416" stroke="#88715b" strokeWidth="5"/>
        <path d="M111 155H589V255H111Z" fill="#f0e5d1"/>
        <path d="M111 266H589V366H111Z" fill="#d7cbb6"/>
        <path d="M103 258H597M350 154V371" stroke="#937f66" strokeWidth="9"/>
        <path d="M103 371H597" stroke="#ba9c77" strokeWidth="12"/>
        <g fill="#38596a" stroke="#ad977a" strokeWidth="5">
          <rect x="132" y="171" width="70" height="58"/><rect x="494" y="171" width="70" height="58"/>
        </g>
        <path d="M167 174V226M135 199H199M529 174V226M497 199H561" stroke="#e1ccb0" strokeWidth="3"/>
        <path d="M218 234V214Q218 207 226 207H296Q304 207 304 214V234M211 234H311V246H211Z" fill="#a47d65"/>
        <path d="M229 210V232M281 210V232" stroke="#c7a68e" strokeWidth="2"/>
        <path d="M397 242H467M406 242V224H459V242M432 224V190" stroke="#796e5d" strokeWidth="4" fill="none"/>
        <path d="M415 190L432 164L449 190Z" fill="#c39a61"/>
        <rect x="145" y="289" width="67" height="69" rx="4" fill="#3d5869" stroke="#768995" strokeWidth="3"/>
        <path d="M156 302H201M156 310H201M156 318H201M156 326H201" stroke="#aebcbd" strokeWidth="2"/>
        <circle cx="179" cy="345" r="5" fill="#c59665"/>
        <path d="M179 289V275H265V173H304" fill="none" stroke="#9e805f" strokeWidth="9"/>
        <path d="M282 173H312" stroke="#536e78" strokeWidth="8"/>
        <rect x="474" y="290" width="42" height="69" rx="16" fill="#edebdc" stroke="#899da0" strokeWidth="3"/>
        <path d="M486 290V275H420V353M504 290V279H551V246" fill="none" stroke="#6b979e" strokeWidth="6"/>
        <path d="M414 353H430M545 246H558" stroke="#6b979e" strokeWidth="6"/>
        <rect x="365" y="276" width="25" height="37" fill="#71818a"/>
        <path d="M378 276V164H432M378 313V359H554" fill="none" stroke="#c8a15f" strokeWidth="3"/>
        <g fill="none" stroke="#e3b17b" strokeWidth="4" opacity=".95">
          {system === "Heating / cooling" && <path d="M179 345V275H265V173H304"/>}
          {system === "Air / ventilation" && <path d="M265 245V173H304M274 183H305M274 193H298"/>}
          {system === "Water / drains" && <path d="M495 349V275H420V353M504 290V279H551V246"/>}
          {system === "Power / lighting" && <path d="M378 359V164H432V190"/>}
        </g>
        <path d="M60 374V295M40 328Q60 273 80 328M50 349Q60 304 74 349M639 374V311M622 342Q639 294 657 342" stroke="#567368" strokeWidth="7" fill="none"/>
      </svg>
      {hotspots.map(({name, x, y}) => <button type="button" key={name} aria-pressed={system === name} style={{left: `${x}%`, top: `${y}%`}} onClick={() => onSelect(name)}><span aria-hidden="true" />{name}</button>)}
    </div>
    <figcaption><span>{system ? `Selected: ${system}` : "Choose a hotspot or use the system options below."}</span><span>ILLUSTRATIVE HOME · REQUEST ROUTING</span></figcaption>
  </figure>;
}
