"use client";
import Image from "next/image";

const A = (n:number) => `/assets/raw/Portfolio Assets A.Halliwell  - ${n}.PNG`;

type Props = { zone: "hero"|"work"|"services"|"lab"|"studio"|"start" };

const zones: Record<Props["zone"], {n:number; c:string; alt?:string}[]> = {
 hero:[
  {n:1,c:"a-heart-main"},{n:2,c:"a-heart-purple"},{n:3,c:"a-heart-glass"},
  {n:5,c:"a-spark"},{n:6,c:"a-star-blur"},{n:7,c:"a-butterfly-blur"},
  {n:9,c:"a-phone"},{n:10,c:"a-bow"},{n:11,c:"a-mini-flowers"},
  {n:14,c:"a-message"},{n:15,c:"a-planet"},{n:16,c:"a-computer"},
  {n:18,c:"a-chrome-star"}
 ],
 work:[
  {n:19,c:"a-butterflies"},{n:20,c:"a-butterfly"},{n:21,c:"a-butterfly-chrome"},
  {n:22,c:"a-star-pearlescent"},{n:23,c:"a-star-glass"},{n:24,c:"a-cursor"},
  {n:28,c:"a-paperclip"},{n:29,c:"a-binder"},{n:30,c:"a-outline-star"},
  {n:31,c:"a-butterfly-silver"},{n:32,c:"a-disco"},{n:33,c:"a-lily"}
 ],
 services:[
  {n:34,c:"a-window-faint"},{n:35,c:"a-frame-pink"},{n:36,c:"a-flower-pattern"},
  {n:37,c:"a-paper"},{n:38,c:"a-star-soft"},{n:39,c:"a-pink-field"},
  {n:40,c:"a-flower-soft"},{n:41,c:"a-butterfly-soft"},{n:42,c:"a-pixel-pink"},
  {n:43,c:"a-pixel-heart"},{n:44,c:"a-pixel-lily"},{n:45,c:"a-pixel-flower"}
 ],
 lab:[
  {n:46,c:"a-lavender-field"},{n:47,c:"a-star-pattern"},{n:48,c:"a-checker"},
  {n:49,c:"a-black-star"},{n:50,c:"a-holo-texture"},{n:51,c:"a-chrome-drip"},
  {n:52,c:"a-holo-sheet"},{n:53,c:"a-leopard"},{n:54,c:"a-butterfly-pink"},
  {n:55,c:"a-grain"},{n:56,c:"a-halftone"},{n:57,c:"a-globe"}
 ],
 studio:[
  {n:59,c:"a-princess-message"},{n:60,c:"a-icon-sheet-one"},{n:61,c:"a-icon-sheet-two"},
  {n:62,c:"a-browser-pink"},{n:63,c:"a-tape"},{n:64,c:"a-film-strip"},
  {n:65,c:"a-film-frame"},{n:66,c:"a-pearl-flower"},{n:67,c:"a-purple-star"}
 ],
 start:[
  {n:4,c:"a-heart-rings"},{n:8,c:"a-star-outline"},{n:12,c:"a-window-tiny"},
  {n:13,c:"a-yes"},{n:17,c:"a-tiny-spark"},{n:25,c:"a-pink-sparkle"},
  {n:26,c:"a-star-lines"},{n:27,c:"a-pink-star"}
 ]
};

export default function VisualUniverse({zone}:Props){
 return <div className={`visual-universe visual-${zone}`} aria-hidden="true">
  {zones[zone].map(({n,c})=><Image key={n} className={`raw-asset ${c}`} src={A(n)} alt="" width={420} height={420} sizes="(max-width: 800px) 140px, 320px"/>)}
 </div>
}
