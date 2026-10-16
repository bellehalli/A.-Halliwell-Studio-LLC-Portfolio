import type { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import CheckoutButton from "./CheckoutButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Custom Order Tracker & Production Planner | A. Halliwell Studio",
  description: "Keep custom orders, payment balances, deadlines, and weekly production capacity in one editable Excel workbook.",
  alternates: { canonical: "/custom-order-tracker" },
  openGraph: {
    title: "Custom Order Tracker & Production Planner",
    description: "Know what is due, what is paid, and whether you have room for the next custom order.",
    url: "/custom-order-tracker",
    type: "product",
  },
};
const features=[
 ["01","See the next action","Filter orders that need attention, check upcoming deadlines, and keep promised dates visible."],
 ["02","Know what is still owed","Track deposits, final payments, and remaining balances alongside the order."],
 ["03","Protect your production time","Plan estimated work across 16 weeks and compare scheduled hours with your capacity."],
];
function WorkbookPreview(){return <div className={styles.preview} aria-label="Illustrative workbook preview showing order and production summaries">
 <div className={styles.previewTop}><span className={styles.windowDots} aria-hidden="true"><i/><i/><i/></span><span>A. HALLIWELL STUDIO / WORKBOOK PREVIEW</span><b>.XLSX</b></div>
 <div className={styles.previewInner}><div className={styles.previewTitle}><span>MADE-TO-ORDER SHOP WORKFLOW</span><strong>Custom Order Tracker<br/><em>& Production Planner</em></strong></div>
 <div className={styles.metricGrid}><div><span>OPEN ORDERS</span><b>12</b></div><div><span>DUE THIS WEEK</span><b>03</b></div><div><span>OPEN BALANCE</span><b>$486</b></div></div>
 <div className={styles.orderHead}><span>ORDER</span><span>DUE</span><span>PAYMENT</span></div>
 <div className={styles.orderRow}><b>Botanical name sign</b><span>Oct 20</span><i>Deposit paid</i></div><div className={styles.orderRow}><b>Bridal favor set</b><span>Oct 22</span><i>Balance due</i></div><div className={styles.orderRow}><b>Hand-thrown vase</b><span>Oct 27</span><i>In progress</i></div>
 <div className={styles.previewFoot}><span>16 WEEK CAPACITY VIEW</span><div><i/><i/><i/><i/><i/><i/><i/><i/></div><b>ROOM TO PLAN</b></div></div>
 <p className={styles.previewNote}>Illustrative preview · no customer data</p></div>}
export default function CustomOrderTrackerPage(){return <main className={styles.page}><Navigation/><div className={styles.shell} id="main-content">
 <section className={styles.hero}><div className={styles.copy}><p className={styles.eyebrow}>A. HALLIWELL STUDIO / DIGITAL TOOLKIT NO. 001</p><p className={styles.overline}>FOR HANDMADE + MADE-TO-ORDER SHOPS</p>
 <h1>Custom orders,<br/><em>under control.</em></h1><p className={styles.lede}>Know what is due, what is paid, and whether you have room for the next order—without rebuilding your workflow from scratch.</p>
 <div className={styles.highlights}><span>100 ORDER ROWS</span><span>16 WEEK PLANNER</span><span>ONE-TIME DOWNLOAD</span></div><div className={styles.purchase}><CheckoutButton/><p><strong>$19.99</strong><span>one-time · instant ZIP download after confirmed payment</span></p></div>
 <p className={styles.disclosure}>Made for manual order entry. No Etsy sync, customer messaging, or recurring fee.</p></div><WorkbookPreview/></section>
 <section className={styles.promise} aria-label="What the tracker helps with"><p className={styles.eyebrow}>A CLEARER VIEW OF THE WORK YOU ALREADY HAVE</p><div><h2>Every custom order<br/><em>has moving parts.</em></h2><p>Messages, deposits, proofs, supplies, production time, deadlines. This workbook puts the pieces in one place, so a busy week is easier to see before you promise the next delivery date.</p></div></section>
 <section className={styles.features} aria-label="Included features">{features.map(([number,title,detail])=><article key={number}><span>{number}</span><h2>{title}</h2><p>{detail}</p></article>)}</section>
 <section className={styles.inside}><div><p className={styles.eyebrow}>WHAT'S INSIDE</p><h2>A simple rhythm<br/><em>for custom work.</em></h2><p>Open the Overview first, set your weekly hours in Setup & Help, then add real orders and use the capacity view before accepting more work.</p><CheckoutButton/></div>
 <ul><li><b>01</b><span><strong>Overview</strong>Open orders, upcoming deadlines, items needing attention, and unpaid balances at a glance.</span></li><li><b>02</b><span><strong>Orders</strong>Space for up to 100 orders with status, due date, estimated hours, payment, and next-step tracking.</span></li><li><b>03</b><span><strong>Capacity</strong>A rolling 16-week planner to compare available hours with scheduled production.</span></li><li><b>04</b><span><strong>Setup & Help</strong>Settings, definitions, and a quick start to make the workbook yours.</span></li></ul></section>
 <section className={styles.fit}><span className={styles.eyebrow}>THE RIGHT FIT, CLEARLY</span><div><div><h2>For the maker juggling<br/><em>more than one deadline.</em></h2><p>Useful for handmade and made-to-order sellers who need a practical overview of incoming work, payments, and production weeks.</p></div><div className={styles.fitBox}><h3>Good to know</h3><p>Editable Excel workbook (.xlsx). Includes manual entry only; it does not connect to Etsy, import orders, send reminders, or replace bookkeeping software. Excel is recommended. If you import it into another spreadsheet app, verify dropdowns, dates, and formulas first.</p><a href="/terms">Read the shop terms</a></div></div></section>
 <footer className={styles.lastCall}><span>YOUR ORDERS, WITH A LITTLE MORE ROOM TO BREATHE.</span><CheckoutButton/><a href="/shop">BACK TO THE SHOP</a></footer>
 </div></main>}