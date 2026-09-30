"use client";
import Image from "next/image";
import { useEffect,useRef,useState } from "react";
import { usePathname } from "next/navigation";
const HEART="/assets/hearts/Portfolio Assets A.Halliwell  - 1.webp";
const links=[["HOME","/"],["WORK","/work"],["SERVICES","/services"],["STUDIO","/studio"],["LAB","/lab"],["CLIENT PORTAL","/portal"]];
export default function Navigation(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const pathname=usePathname();
 const navRef=useRef<HTMLElement>(null);
 const triggerRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
   const update=()=>{const next=window.scrollY>Math.max(520,window.innerHeight*.72);setScrolled(next);if(!next)setOpen(false)};
   update();window.addEventListener("scroll",update,{passive:true});
   return()=>window.removeEventListener("scroll",update);
 },[]);
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{
   const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);triggerRef.current?.focus()}};
   const onPointer=(e:PointerEvent)=>{if(!navRef.current?.contains(e.target as Node))setOpen(false)};
   window.addEventListener("keydown",onKey);
   window.addEventListener("pointerdown",onPointer);
   return()=>{window.removeEventListener("keydown",onKey);window.removeEventListener("pointerdown",onPointer)};
 },[]);
 return <header ref={navRef} className={`site-nav shell ${scrolled?"is-scrolled floating-heart-nav":""}`}>
  <a className="logo" href="/" aria-label="A. Halliwell Studio home"><span className="logo-mark">A.</span><span className="logo-type">HALLIWELL</span></a>
  <button ref={triggerRef} className="heart-menu-trigger" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open?"Close navigation":"Open navigation"}>
   <span className="heart-button-art" aria-hidden="true"><Image src={HEART} alt="" fill sizes="84px" priority/></span>
   <span className="heart-button-label">{open?"CLOSE":"MENU"}</span>
  </button>
  <nav id="primary-navigation" className={`heart-dock ${open?"is-open":""}`} aria-label="Primary navigation">
   {links.map(([label,href])=><a className="heart-nav-button" href={href} key={href} aria-current={pathname===href || (href!=="/" && pathname.startsWith(`${href}/`)) ? "page" : undefined} onClick={()=>setOpen(false)}><span className="heart-button-art" aria-hidden="true"><Image src={HEART} alt="" fill sizes="104px"/></span><span className="heart-button-label">{href === "/portal" ? <>CLIENT<br/>PORTAL</> : label}</span></a>)}
   <a className="heart-nav-button heart-talk" href="https://calendar.app.google/UArjShmAHzt4vGE48" target="_blank" rel="noopener noreferrer" data-consultation-booking aria-label="Let’s talk — book a 15-minute phone consultation (opens in a new tab)" onClick={()=>setOpen(false)}><span className="heart-button-art" aria-hidden="true"><Image src={HEART} alt="" fill sizes="104px"/></span><span className="heart-button-label">LET’S<br/>TALK</span></a>
   <a className="heart-nav-button heart-start" href="/start" aria-current={pathname==="/start"?"page":undefined} onClick={()=>setOpen(false)}><span className="heart-button-art" aria-hidden="true"><Image src={HEART} alt="" fill sizes="110px"/></span><span className="heart-button-label">START A<br/>PROJECT</span></a>
  </nav>
 </header>
}
