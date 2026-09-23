"use client";

import Link from "next/link";
import { useState } from "react";

const paths = ["Take bookings", "Sell products", "Build packages", "Manage events", "Capture leads", "Something weird"] as const;
type Path = (typeof paths)[number];

function Choices<T extends string>({ items, value, change, label }: { items: readonly T[]; value: T; change: (item: T) => void; label: string }) {
  return <div className="lab-choice-row" role="group" aria-label={label}>{items.map(item => <button type="button" key={item} className={value === item ? "selected" : ""} aria-pressed={value === item} onClick={() => change(item)}>{item}</button>)}</div>;
}
function Heading({ number, label, title, description }: { number: string; label: string; title: string; description: string }) {
  return <div className="lab-demo-heading"><span>{number} / {label}</span><h3>{title}</h3><p>{description}</p></div>;
}
const dates = [{ day: "FRI", date: "09", label: "October 9", available: true }, { day: "SAT", date: "10", label: "October 10", available: false }, { day: "SUN", date: "11", label: "October 11", available: true }, { day: "FRI", date: "16", label: "October 16", available: true }];
function Booking() {
  const [occasion, setOccasion] = useState("Celebration");
  const [guests, setGuests] = useState("80–160");
  const [date, setDate] = useState("October 9");
  return <><Heading number="01" label="SAMPLE BOOKING FLOW" title="Make a date of it." description="See how an inquiry can start with useful details instead of a blank form." />
    <div className="lab-field"><b>THE OCCASION</b><Choices items={["Celebration", "Wedding", "Venue tour"]} value={occasion} change={setOccasion} label="Occasion" /></div>
    <div className="lab-field"><b>GUEST COUNT</b><Choices items={["Under 80", "80–160", "160+"]} value={guests} change={setGuests} label="Guest count" /></div>
    <div className="lab-field"><b>EXPLORE SAMPLE DATES <span>OCTOBER 2026 · EXAMPLE ONLY</span></b><div className="lab-dates">{dates.map(item => <button key={item.label} type="button" disabled={!item.available} className={date === item.label ? "selected" : ""} aria-pressed={date === item.label} onClick={() => setDate(item.label)}><small>{item.day}</small><strong>{item.date}</strong><small>{item.available ? "Explore" : "Full"}</small></button>)}</div></div>
    <div className="lab-output" aria-live="polite"><span>YOUR INQUIRY PREVIEW</span><strong>{occasion} · {guests} guests</strong><p>{date} is selected in this example. A real build could connect your calendar and collect the details you need.</p><Link href="/start">Talk about a booking flow ↗</Link></div>
  </>;
}
const swatches = [{ name: "Petal", color: "#f4a9cc" }, { name: "Citrus", color: "#ffd674" }, { name: "Lavender", color: "#cab8ef" }] as const;
function Product() {
  const [color, setColor] = useState<(typeof swatches)[number]>(swatches[0]);
  const [message, setMessage] = useState("You belong here.");
  return <><Heading number="02" label="PRODUCT CUSTOMIZER" title="Made for someone." description="Change the look and the note. Watch the sample gift card update." />
    <div className="lab-product-preview" style={{ backgroundColor: color.color }}><small>A LITTLE SOMETHING / 001</small><strong>{message || "Your words go here."}</strong><span>FOR YOU, ALWAYS ↗</span></div>
    <div className="lab-field"><b>CHOOSE A COLOR</b><div className="lab-swatch-row" role="group" aria-label="Gift card color">{swatches.map(swatch => <button key={swatch.name} type="button" className={swatch.name === color.name ? "selected" : ""} aria-pressed={swatch.name === color.name} onClick={() => setColor(swatch)}><i style={{ backgroundColor: swatch.color }} />{swatch.name}</button>)}</div></div>
    <label className="lab-field lab-input-label"><b>PERSONAL NOTE</b><input maxLength={40} value={message} onChange={event => setMessage(event.target.value)} /></label><p className="lab-footnote">Design preview only. No order is placed.</p>
  </>;
}
const additions = [{ name: "Welcome dinner", price: 1200 }, { name: "Morning brunch", price: 850 }, { name: "Floral styling", price: 600 }] as const;
function Package() {
  const [space, setSpace] = useState("The garden");
  const [selected, setSelected] = useState<string[]>([]);
  const total = (space === "The garden" ? 2400 : 3600) + additions.filter(item => selected.includes(item.name)).reduce((sum, item) => sum + item.price, 0);
  return <><Heading number="03" label="PACKAGE BUILDER" title="Make room for more." description="Build a sample event package and see the estimate change." />
    <div className="lab-field"><b>CHOOSE YOUR SPACE</b><Choices items={["The garden", "The hall"]} value={space} change={setSpace} label="Event space" /></div>
    <div className="lab-field"><b>ADD THE GOOD STUFF</b><div className="lab-additions">{additions.map(item => <label key={item.name}><input type="checkbox" checked={selected.includes(item.name)} onChange={() => setSelected(current => current.includes(item.name) ? current.filter(value => value !== item.name) : [...current, item.name])} /><span>{item.name}</span><strong>+${item.price.toLocaleString()}</strong></label>)}</div></div>
    <div className="lab-total" aria-live="polite"><span>SAMPLE ESTIMATE <small>{space} + {selected.length} add-ons</small></span><strong>${total.toLocaleString()}</strong></div><p className="lab-footnote">Illustrative amounts only. This is not a real venue quote.</p>
  </>;
}
const events = [{ title: "Garden Table", type: "Food", time: "Evening", date: "OCT 09" }, { title: "Make Something", type: "Workshop", time: "Daytime", date: "OCT 11" }, { title: "After Hours", type: "Music", time: "Evening", date: "OCT 16" }, { title: "Sunday Studio", type: "Workshop", time: "Daytime", date: "OCT 18" }];
function Events() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? events : events.filter(event => event.type === filter);
  return <><Heading number="04" label="EVENT DISCOVERY" title="Find your kind of night." description="Filter a sample calendar to find the event you came for." />
    <Choices items={["All", "Food", "Workshop", "Music"]} value={filter} change={setFilter} label="Filter events" />
    <div className="lab-event-list" aria-live="polite">{filtered.map(event => <article key={event.title}><time>{event.date}</time><div><strong>{event.title}</strong><small>{event.type} / {event.time}</small></div><span aria-hidden="true">↗</span></article>)}</div><p className="lab-footnote">Sample events only. No tickets or dates are available here.</p>
  </>;
}
function Leads() {
  const [need, setNeed] = useState("A venue tour");
  const [timing, setTiming] = useState("Soon");
  const route = need === "A venue tour" ? "TOUR COORDINATOR" : need === "Pricing details" ? "SALES TEAM" : "PROJECT LEAD";
  return <><Heading number="05" label="SMART INTAKE" title="Skip the back and forth." description="See how two answers can route an inquiry to the right place." />
    <div className="lab-field"><b>WHAT DO YOU NEED?</b><Choices items={["A venue tour", "Pricing details", "A custom idea"]} value={need} change={setNeed} label="Inquiry topic" /></div>
    <div className="lab-field"><b>WHEN?</b><Choices items={["Soon", "This season", "Exploring"]} value={timing} change={setTiming} label="Timeline" /></div>
    <div className="lab-routing" aria-live="polite"><span>INQUIRY ROUTED TO</span><strong>{route} <span aria-hidden="true">↗</span></strong><p>{need} · {timing}. The next screen could ask only for the details this team needs.</p></div><Link className="lab-inline-link" href="/start">Try the studio’s real inquiry form ↗</Link>
  </>;
}
function Weird() {
  const [open, setOpen] = useState(false);
  return <><Heading number="06" label="A LITTLE SURPRISE" title="Curiosity looks good on you." description="A small interaction can reveal something useful at exactly the right moment." />
    <div className={`lab-secret ${open ? "is-open" : ""}`}><div className="lab-secret-orbit" aria-hidden="true"><span>✳</span><span>✳</span><span>✳</span></div><button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="lab-secret-message">{open ? "Close the little door" : "Open the little door"} <span aria-hidden="true">{open ? "−" : "+"}</span></button><div id="lab-secret-message" className="lab-secret-message" hidden={!open}><small>BEHIND THE DOOR</small><strong>Oh, hi. There you are. ♥</strong><p>Surprise earns its place when it leads somewhere. Your next step is a conversation.</p><Link href="/start">Tell me your strange idea ↗</Link></div></div>
  </>;
}
const previews = { "Take bookings": Booking, "Sell products": Product, "Build packages": Package, "Manage events": Events, "Capture leads": Leads, "Something weird": Weird };
export default function CapabilityPlayground() {
  const [active, setActive] = useState<Path>("Take bookings");
  const Preview = previews[active];
  return <section className="sheet sheet-lavender capability" id="capabilities"><div className="content-shell capability-layout">
    <div className="capability-copy"><span className="section-kicker-text">03 / THE LAB</span><h2>Don't just read<br /><em>what I can build.</em></h2><p className="capability-intro">Try a little piece of it. Pick a job, change a few things, and watch the example respond.</p></div>
    <div className="capability-tabs" role="group" aria-label="Website capability examples">{paths.map(path => <button key={path} type="button" className={active === path ? "is-active" : ""} aria-pressed={active === path} onClick={() => setActive(path)}>{path}</button>)}</div>
    <div className="demo-stage"><div className="demo-window"><div className="demo-window-top"><span /><span /><span /><b>A. HALLIWELL / THE LAB</b></div><div className="demo-screen" key={active}><Preview /></div></div><p className="lab-stage-note">AN INTERACTIVE EXAMPLE, NOT A LIVE CLIENT SYSTEM. ↗</p></div>
  </div></section>;
}
