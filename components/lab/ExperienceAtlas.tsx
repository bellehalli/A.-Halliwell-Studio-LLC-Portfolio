"use client";
import { useState } from "react";
import Image from "next/image";
import { capacityFor, furnitureFor, innRooms, spaces, type Layout } from "@/lib/lab-engine";
import { BriefLink, Choices, Preview, SpatialScene } from "./LabShared";

// Each conceptual event floor has its own clear gathering zone in the artwork.
const floors = [
  { image: "conservatory", x: 25, y: 39, width: 43, height: 15, entry: "M13 44 H24", stage: { x: 70, y: 42, width: 3, height: 10 } },
  { image: "manor", x: 53, y: 52, width: 24, height: 14, entry: "M41 57 H49", stage: { x: 83, y: 56, width: 3, height: 14 } },
  { image: "garden", x: 40, y: 34, width: 22, height: 18, entry: "M18 74 Q20 61 28 54", stage: { x: 64, y: 33, width: 3, height: 8 } },
];
function FloorLayout({ layout, guests, space }: { layout: Layout; guests: number; space: number }) {
  const floor = floors[space];
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
      const col = i % ceremonyColumns;
      return { x: floor.x + (col + .5 + (col >= ceremonyColumns / 2 ? 1 : 0)) * floor.width / (ceremonyColumns + 1), y: floor.y + (Math.floor(i / ceremonyColumns) + .5) * floor.height / ceremonyRows };
    }
    const center = tableAt(Math.floor(i / 8));
    const angle = (i % 8) * Math.PI / 4;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
  return <>
    <div className="lab-floor">
      <Image src={`/assets/lab/${floor.image}.webp`} alt={`Distinct illustrated ${spaces[space].name} concept viewed from above`} width={1536} height={1024} sizes="(max-width:850px) 94vw, 60vw" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${furniture.seats} seats and ${furniture.tables} tables in this illustrative configuration`} role="img">
        <title>{`${layout}: ${shown} displayed guests`}</title>
        <path d={floor.entry} className="lab-circulation" />
        <rect {...floor.stage} className="lab-stage" />
        {Array.from({ length: furniture.tables }, (_, i) => { const p = tableAt(i); return <ellipse key={i} cx={p.x} cy={p.y} rx={radius * .65} ry={radius * .65} className="lab-table" />; })}
        {seats.map((p, i) => <rect key={i} x={p.x - .35} y={p.y - .4} width=".7" height=".8" rx=".1" className="lab-chair" />)}
      </svg>
    </div>
    <p className="lab-caption">{space === 1 ? "Gathering salon only; the stair hall and drawing room remain furnished." : space === 2 ? "An open-air ceremony lawn, with paths and planted terraces around it." : "Gathering floor between the west vestibule and the curved botanical alcove."} {shown < guests ? `The overlay shows ${shown} guests; your requested count exceeds the demo limit.` : ""}</p>
  </>;
}
function InnPlan({ room, onRoom }: { room: number; onRoom: (index: number) => void }) {
  return <>
    <div className="lab-floor lab-inn-plan">
      <Image src="/assets/lab/inn.webp" alt="Country guesthouse cutaway with two king bedrooms, a twin bedroom, shared lounge and two bathrooms" width={1536} height={1024} sizes="(max-width:850px) 94vw, 60vw" />
      {innRooms.map((r, i) => <button type="button" key={r.name} className={`lab-hotspot ${room === i ? "selected" : ""}`} style={{ left: `${r.x}%`, top: `${r.y}%` }} aria-label={`Explore ${r.name}`} aria-pressed={room === i} onClick={() => onRoom(i)}>{i + 1}<span>{r.name}</span></button>)}
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
        {spaces.map((s, i) => <button type="button" className={`lab-hotspot ${selected === i ? "selected" : ""}`} key={s.name} style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={`Explore ${s.name}`} aria-pressed={selected === i} onClick={() => setSelected(i)}>{i + 1}<span>{s.name}</span></button>)}
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
      <BriefLink inHome={inHome} name="Experience Atlas" projectType="Hospitality / venue" needs={["Custom interactive feature", "Illustration / property map"]} summary="An illustrated property explorer with distinct spaces, guest journeys, event configurations and guesthouse stay planning." />
    </aside></div>
  </div>;
}
