"use client";
import { useEffect, useState } from "react";

const links = [["Work","#work"],["Services","#services"],["Studio","#studio"]] as const;
export default function Navigation(){
  const [open,setOpen]=useState(false);
  useEffect(()=>{ const close=()=>setOpen(false); window.addEventListener("resize",close); return()=>window.removeEventListener("resize",close)},[]);
  return <header className={`site-nav shell ${open?"menu-open":""}`}>
    <a className="logo" href="#top" aria-label="A. Halliwell Studio home"><span className="logo-mark">A.</span><span>HALLIWELL</span></a>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={()=>setOpen(v=>!v)}><span>{open?"Close":"Menu"}</span><b aria-hidden="true">{open?"×":"+"}</b></button>
    <nav id="primary-nav" className="nav-links" aria-label="Primary navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}<a className="nav-cta" href="#start" onClick={()=>setOpen(false)}>Start a project ↗</a></nav>
  </header>
}
