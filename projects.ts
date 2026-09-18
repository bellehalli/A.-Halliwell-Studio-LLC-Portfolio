export type Project={slug:string;title:string;sector:string;year:string;summary:string;liveUrl?:string;status:"live"|"draft"};
// Publishing rule: only status=live AND a real liveUrl may render publicly.
export const projects:Project[]=[
{slug:"willow-lily",title:"Willow Lily",sector:"Luxury hospitality / weddings",year:"2026",summary:"A conversion-led venue experience built around discovery, packages, planning and inquiry.",status:"live",liveUrl:"https://willowlilyestate.com"},
{slug:"maison-riviere",title:"Maison Rivière",sector:"Restaurant / hospitality",year:"2026",summary:"A refined hospitality experience pairing atmosphere, information architecture and reservation intent.",status:"live",liveUrl:"https://www.maisonrivieredetroit.com"},
{slug:"vanta-social",title:"Vanta Social",sector:"Nightlife / events",year:"2026",summary:"An event-first nightlife platform built around discovery, guest flow, tables and conversion.",status:"draft"}
];
export const liveProjects=projects.filter(p=>p.status==="live"&&p.liveUrl);