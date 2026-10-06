"use client";
import { useState } from "react";
import Image from "next/image";
import { capacityFor, furnitureFor, innRooms, spaces, type Layout } from "@/lib/lab-engine";
import { BriefLink, Choices, Preview, SpatialScene } from "./LabShared";

// Each conceptual event floor has its own clear gathering zone in the artwork.
const floors = [
  { image: "conservatory", x: 25, y: 39, width: 43, height: 15, entry: "M13 44 H24", stage: { x: 71, y: 40, width: 4, height: 10 }, service: { x: 77, y: 53, width: 9, height: 4 }, vendorRoute: "M45 66 V58 H80 L82 57" },
  { image: "manor", x: 53, y: 52, width: 24, height: 14, entry: "M41 57 H51", stage: { x: 79, y: 54, width: 4, height: 9 }, service: { x: 64, y: 47, width: 9, height: 3 }, vendorRoute: "M65 73 H78 V49 H73" },
  { image: "garden", x: 40, y: 34, width: 22, height: 18, entry: "M18 74 Q20 61 38 47", stage: { x: 64, y: 34, width: 4, height: 9 }, service: { x: 32, y: 62, width: 9, height: 4 }, vendorRoute: "M26 77 Q29 69 34 66" },
];
function FloorLayout({ layout, guests, space }: { layout: Layout; guests: number; space: number }) {
  const floor = floors[space];
  const [showVendors, setShowVendors] = useState(false);
  const shown = Math.min(guests, capacityFor(space, layout));
  const furniture = furnitureFor(layout, shown);
  const columns = space === 1 ? 3 : 5;
  const rows = Math.max(1, Math.ceil(furniture.tables / columns));
  const cellWidth = floor.width / columns;
  const cellHeight = floor.height / rows;
  const radius = Math.min(cellWidth / 3, cellHeight / 3);
  const tableAt = (i: number) => ({ x: floor.x + (i % columns + .5) * cellWidth, y: floor.y + (Math.floor(i / columns) + .5) * cellHeight });
  const ceremonyColumns = space === 1 ? 6 : 10;
  const ceremonyRows = Math.ceil(shown / ceremonyColumns);
  const seats = Array.from({ length: furniture.seats }, (_, i) => {
    if (layout === "Ceremony") {
      const col = i % ceremonyColumns, row = Math.floor(i / ceremonyColumns);
      const aisle = ceremonyRows > 1 && row >= Math.ceil(ceremonyRows / 2) ? 1 : 0;
      return { x: floor.x + (col + .5) * floor.width / ceremonyColumns, y: floor.y + (row + .5 + aisle) * floor.height / (ceremonyRows + (ceremonyRows > 1 ? 1 : 0)), angle: -90 };
    }
    const center = tableAt(Math.floor(i / 8));
    const angle = (i % 8) * Math.PI / 4;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius, angle: (i % 8) * 45 - 90 };
  });
  return <>
    <div className="lab-floor">
      <Image src={`/assets/lab/${floor.image}.webp`} alt={`Distinct illustrated ${spaces[space].name} concept viewed from above`} width={1536} height={1024} sizes="(max-width:850px) 94vw, 60vw" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${furniture.seats} chairs, ${furniture.tables} dressed tables, a ${layout === "Ceremony" ? "ceremony focal point" : "music station"} and separate catering station`} role="img">
        <title>{`${layout}: ${shown} displayed guests with reserved vendor spaces`}</title>
        <defs><linearGradient id={`linen-${space}`} x2="1" y2="1"><stop stopColor="#fffcf0"/><stop offset="1" stopColor="#d7c4b4"/></linearGradient></defs>
        <path d={floor.entry} className="lab-circulation" />
        <g className={`lab-vendor-staging ${showVendors ? "highlighted" : ""}`}>
          <rect {...floor.service} rx=".4" className="lab-service-counter" />
          {[0,1,2].map(i=><g key={i}><rect x={floor.service.x + 1 + i * 2.4} y={floor.service.y + .7} width="1.7" height="1.1" rx=".2" fill="#ede3d1" stroke="#9c8874" strokeWidth=".15"/><ellipse cx={floor.service.x + 1.8 + i * 2.4} cy={floor.service.y + 1.2} rx=".5" ry=".35" fill="#9aab82"/></g>)}
          <rect x={floor.stage.x} y={floor.stage.y} width={floor.stage.width} height={floor.stage.height} rx=".4" className={layout === "Ceremony" ? "lab-ceremony-platform" : "lab-music-station"}/>
          {layout === "Ceremony" ? <><ellipse cx={floor.stage.x + floor.stage.width/2} cy={floor.stage.y + 1.3} rx="1.2" ry=".8" fill="#7e956b"/><ellipse cx={floor.stage.x + floor.stage.width/2} cy={floor.stage.y + floor.stage.height-1.3} rx="1.2" ry=".8" fill="#7e956b"/></> : <><rect x={floor.stage.x+.6} y={floor.stage.y+.8} width={floor.stage.width-1.2} height="1.7" fill="#373039"/><rect x={floor.stage.x+.6} y={floor.stage.y+floor.stage.height-2.5} width={floor.stage.width-1.2} height="1.7" fill="#373039"/><path d={`M${floor.stage.x+.8} ${floor.stage.y+floor.stage.height/2} h${floor.stage.width-1.6}`} stroke="#c6a490" strokeWidth=".6"/></>}
          {showVendors ? <path d={floor.vendorRoute} className="lab-vendor-route"/> : null}
        </g>
        {Array.from({ length: furniture.tables }, (_, i) => {
          const p = tableAt(i), tableRadius = radius * (layout === "Seated dinner" ? .7 : .5);
          return <g key={i}>
            <ellipse cx={p.x+.12} cy={p.y+.22} rx={tableRadius} ry={tableRadius} fill="#463b3440"/>
            <ellipse cx={p.x} cy={p.y} rx={tableRadius} ry={tableRadius} fill={`url(#linen-${space})`} stroke="#ad9681" strokeWidth=".12"/>
            {layout === "Seated dinner" ? Array.from({length:Math.min(8,shown-i*8)},(_,j)=>{const a=j*Math.PI/4;return <ellipse key={j} cx={p.x+Math.cos(a)*tableRadius*.72} cy={p.y+Math.sin(a)*tableRadius*.72} rx={tableRadius*.15} ry={tableRadius*.15} fill="#fffef9" stroke="#b6a88f" strokeWidth=".08"/>;}) : null}
            <ellipse cx={p.x} cy={p.y} rx={tableRadius*.22} ry={tableRadius*.25} fill="#738769"/>
            <ellipse cx={p.x-.12} cy={p.y-.1} rx={tableRadius*.11} ry={tableRadius*.12} fill="#ce9eb0"/>
          </g>;
        })}
        {seats.map((p, i) => { const size = layout === "Ceremony" ? Math.min(.65, floor.height / ceremonyRows * .6) : radius*.32; return <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}><rect x={-size*.5} y={-size*.5} width={size} height={size} rx=".12" fill="#e9ddc7" stroke="#8c725b" strokeWidth=".13"/><path d={`M${-size*.6} ${size*.45} h${size*1.2}`} stroke="#745f4b" strokeWidth=".22"/></g>; })}
      </svg>
    </div>
    <div className="lab-staging-key"><span>Ivory linen · floral centers · guest seating</span><span>{layout === "Ceremony" ? "Ceremony focal point" : "Music / production"} · catering / service counter</span><button className="lab-secondary" type="button" aria-pressed={showVendors} onClick={()=>setShowVendors(v=>!v)}>{showVendors ? "Hide vendor routes" : "Show vendor routes"}</button></div>
    <p className="lab-caption">Vendor stations stay outside the seating area. {space === 1 ? "Gathering salon only; the stair hall and drawing room remain furnished." : space === 2 ? "An open-air ceremony lawn, with paths and planted terraces around it." : "Gathering floor between the west vestibule and the curved botanical alcove."} {shown < guests ? `The overlay shows ${shown} guests; your requested count exceeds the demo limit.` : ""}</p>
  </>;
}
function InnPlan({ room, onRoom }: { room: number; onRoom: (index: number) => void }) {
  return <>
    <div className="lab-floor lab-inn-plan">
      <Image src="/assets/lab/inn.webp" alt="Country guesthouse cutaway with two king bedrooms, a twin bedroom, shared lounge and two bathrooms" width={1536} height={1024} sizes="(max-width:850px) 94vw, 60vw" />
      {innRooms.map((r, i) => <button type="button" key={r.name} className={`lab-hotspot ${room === i ? "selected" : ""}`} style={{ left: `${r.x}%`, top: `${r.y}%` }} aria-label={`${i + 1} ${r.name}`} aria-pressed={room === i} onClick={() => onRoom(i)}>{i + 1}{" "}<span>{r.name}</span></button>)}
    </div>
    <div className="lab-room-detail" aria-live="polite"><h4>{innRooms[room].name}</h4><p>{innRooms[room].description}</p><small>{innRooms[room].sleeps ? `Sleeps ${innRooms[room].sleeps} in this concept` : "Shared guest space"}</small></div>
  </>;
}
const routePaths = { "Guest arrival": "M11 78 Q17 66 29 52 Q55 48 81 44", "Step-free concept": "M11 78 Q19 63 39 59 Q67 62 81 44", "Vendor access": "M92 65 Q90 51 81 44" };
export default function ExperienceAtlas({ inHome = false }: { inHome?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [inside, setInside] = useState(false);
  const [layout, setLayout] = useState<Layout>("Seated dinner");
  const [guests, setGuests] = useState(80);
  const [journey, setJourney] = useState("Guest arrival");
  const [event, setEvent] = useState("Wedding");
  const [room, setRoom] = useState(0);
  const [stayGuests, setStayGuests] = useState(4);
  const [nights, setNights] = useState("2 nights");
  const isInn = selected === 3;
  const capacity = capacityFor(selected, layout);
  const fit = guests <= capacity;
  const furniture = furnitureFor(layout, guests);
  const insideLabel = selected === 2 ? "Garden layout" : `Inside ${spaces[selected].name}`;
  return <div className="lab-experiment lab-atlas">
    <header className="lab-experiment-head"><div><small>01 / EXPERIENCE ATLAS</small><h3>Explore the space.<br /><em>Shape the experience.</em></h3></div><p>Enter distinct spaces, reconfigure gatherings and plan a guesthouse stay.</p></header>
    <div className="lab-two-col"><div>
      <Choices label="Explore estate spaces" options={spaces.map(s => s.name)} value={spaces[selected].name} onChange={v => setSelected(spaces.findIndex(s => s.name === v))} />
      <div className="lab-view-switch"><button type="button" aria-pressed={!inside} onClick={() => setInside(false)}>Estate</button><button type="button" aria-pressed={inside} onClick={() => setInside(true)}>{insideLabel}</button></div>
      {inside ? isInn ? <InnPlan room={room} onRoom={setRoom} /> : <FloorLayout layout={layout} guests={guests} space={selected} /> : <SpatialScene src="/assets/lab/estate.webp" alt="Detailed illustrated fictional estate with manor, conservatory, gardens, inn and arrival drive">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="lab-route-overlay" aria-hidden="true"><path d={routePaths[journey as keyof typeof routePaths]} /></svg>
        {spaces.map((s, i) => <button type="button" className={`lab-hotspot ${selected === i ? "selected" : ""}`} key={s.name} style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={`${i + 1} ${s.name}`} aria-pressed={selected === i} onClick={() => setSelected(i)}>{i + 1}{" "}<span>{s.name}</span></button>)}
      </SpatialScene>}
      {!inside ? <><Choices label="Estate journeys" options={Object.keys(routePaths)} value={journey} onChange={setJourney} /><p className="lab-caption">{journey === "Vendor access" ? "Service entrance → Conservatory" : journey === "Step-free concept" ? "Alternate arrival → Garden paths → Conservatory" : "Arrival → Ceremony garden → Conservatory"}. Routes are illustrative; access requires venue validation.</p></> : null}
    </div><aside className="lab-inspector">
      <small>SELECTED SPACE</small><h4>{spaces[selected].name}</h4><p>{spaces[selected].description}</p>
      {isInn ? <>
        <Choices label="Explore guesthouse rooms" options={innRooms.map(r => r.name)} value={innRooms[room].name} onChange={v => { setRoom(innRooms.findIndex(r => r.name === v)); setInside(true); }} />
        <label className="lab-field">Overnight guests <output>{stayGuests}</output><input aria-label="Overnight guests" type="range" min="1" max="6" step="1" value={stayGuests} onChange={e => setStayGuests(Number(e.target.value))} /></label>
        <Choices label="Length of stay" options={["1 night", "2 nights", "3 nights"]} value={nights} onChange={setNights} />
        <div className="lab-result" role="status"><strong>A guesthouse stay for {stayGuests}</strong><p>3 bedrooms · 6 sleeping places · 2 shared bathrooms</p><small>Fictional accommodation concept; no reservation is made.</small></div>
      </> : <>
        <Choices label="Event configuration" options={["Wedding", "Corporate gathering", "Private celebration"]} value={event} onChange={setEvent} />
        <Choices label="Layout" options={["Seated dinner", "Ceremony", "Cocktail reception"]} value={layout} onChange={v => setLayout(v as Layout)} />
        <label className="lab-field">Guest count <output>{guests}</output><input aria-label="Guest count" type="range" min="10" max="200" step="1" value={guests} onChange={e => setGuests(Number(e.target.value))} /></label>
        <div className={`lab-result ${fit ? "" : "lab-warning"}`} role="status"><strong>{fit ? "Fits the demo configuration" : "Exceeds this demo configuration"}</strong><p>{capacity} guest demo limit · {furniture.tables} tables · {furniture.seats} chairs requested{layout === "Cocktail reception" ? " · standing gathering" : ""}</p><small>Illustrative rules, not a certified capacity or measured floor plan.</small></div>
      </>}
      <button className="lab-primary" type="button" onClick={() => setInside(v => !v)}>{inside ? "Return to estate" : selected === 2 ? "Explore the garden" : "Explore inside"}</button>
      {isInn ? <Preview title="Preview guesthouse stay"><p>Guest Inn · {stayGuests} overnight guests · {nights}</p><p>Two king bedrooms and one twin bedroom, with a shared lounge and two bathrooms.</p><p>Accommodation concept only. Dates and availability would be confirmed with the venue.</p></Preview> : <Preview title="Preview event configuration"><p>{event} · {spaces[selected].name}</p><p>{layout} · {guests} guests · {fit ? "Fits" : "Exceeds"} demo limit of {capacity}</p><p>{journey}</p></Preview>}
      <BriefLink publish inHome={inHome} name="Experience Atlas" projectType="Hospitality / venue" needs={["Custom interactive feature", "Illustration / property map"]} summary={isInn ? `Space: ${spaces[selected].name}. Lodging guests: ${stayGuests}. Stay: ${nights}. Room: ${innRooms[room].name}.` : `Space: ${spaces[selected].name}. Event: ${event}. Layout: ${layout}. Event guests: ${guests}. Journey: ${journey}.`} />
    </aside></div>
  </div>;
}
