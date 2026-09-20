const modules=["Command Center","Experience","Growth","Sales","Delivery","Money","Empire","Core"];

export default function Page(){
 return <main className="os-shell">
 <aside className="os-sidebar">
 <h1>A. HALLIWELL<br/>STUDIO OS</h1>
 {modules.map(m=><div key={m}>{m}</div>)}
 </aside>
 <section className="os-main">
 <h2>Good morning, Belle. ♡</h2>
 <p>Here’s what needs your attention.</p>
 <div className="cards">
 {["New Inquiries","Pipeline Value","Active Projects","Outstanding","Recurring Revenue","Tax Reserve"].map(x=>
 <article key={x}><small>{x}</small><strong>—</strong><p>No data yet</p></article>)}
 </div>
 </section>
 </main>
}
