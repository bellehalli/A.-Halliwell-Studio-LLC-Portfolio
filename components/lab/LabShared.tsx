"use client";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { writeStorage } from "@/lib/browser-storage";

export function Choices({label,options,value,onChange}:{label:string;options:readonly string[];value:string;onChange:(value:string)=>void}){return <fieldset className="lab-choices"><legend>{label}</legend><div>{options.map(option=><button key={option} type="button" aria-pressed={value===option} onClick={()=>onChange(option)}>{option}</button>)}</div></fieldset>;}
export function BriefLink({name,projectType,needs,summary,inHome=false,label="Build this for my business"}:{name:string;projectType:string;needs:string[];summary:string;inHome?:boolean;label?:string}){
 const scope={projectType,needs,successGoal:`Inspired by ${name} in the AHS Lab. ${summary}`};
 const href=inHome?"#start":`/start?labScope=${encodeURIComponent(JSON.stringify(scope))}`;
 return <a className="lab-brief-link" href={href} onClick={()=>{writeStorage("session","ahs-lab-scope-v1",JSON.stringify(scope));window.dispatchEvent(new CustomEvent("ahs:lab-scope",{detail:scope}));}}>{label}<span aria-hidden="true">↗</span></a>;
}
export function Preview({title,children,disabled=false}:{title:string;children:ReactNode;disabled?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 return <><button className="lab-primary" type="button" disabled={disabled} onClick={()=>ref.current?.showModal()}>{title}</button><dialog className="lab-dialog" ref={ref}><button className="lab-close" type="button" onClick={()=>ref.current?.close()} aria-label="Close preview">Close ×</button><small>LOCAL DEMONSTRATION</small><h3>{title}</h3>{children}<p className="lab-disclosure">Nothing is submitted. This preview demonstrates the information a connected system could carry forward.</p></dialog></>;
}
export function SpatialScene({src,alt,children}:{src:string;alt:string;children?:ReactNode}){
 const [zoom,setZoom]=useState(1);const [pan,setPan]=useState({x:0,y:0});const drag=useRef<{x:number;y:number;px:number;py:number}|null>(null);
 const bound=(value:number)=>Math.max(-140*(zoom-1),Math.min(140*(zoom-1),value));
 return <div className="lab-map-shell"><div className="lab-map-viewport" onPointerDown={e=>{if(zoom<=1||(e.target as Element).closest("button"))return;drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current)setPan({x:bound(drag.current.px+e.clientX-drag.current.x),y:bound(drag.current.py+e.clientY-drag.current.y)});}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} style={{touchAction:zoom>1?"none":"pan-y"}}><div className="lab-map-transform" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}><Image src={src} alt={alt} width={1536} height={1024} sizes="(max-width: 850px) 94vw, 70vw" draggable={false}/>{children}</div></div><div className="lab-map-tools"><button type="button" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))} disabled={zoom>=2.5} aria-label="Zoom in">+</button><button type="button" onClick={()=>{setZoom(z=>Math.max(1,z-.25));setPan({x:0,y:0});}} disabled={zoom<=1} aria-label="Zoom out">−</button><button type="button" onClick={()=>{setZoom(1);setPan({x:0,y:0});}}>Reset view</button><small>{Math.round(zoom*100)}% {zoom>1?"· drag to explore":""}</small></div></div>;
}
