"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  ["welcome", "01 Welcome"],
  ["project", "02 Project"],
  ["agreement", "03 Agreement"],
  ["payment", "04 Payment + files"],
  ["review", "05 Review"],
  ["email", "06 Emails"],
] as const;
type Step = (typeof steps)[number][0];

export default function ClientJourneyPreview() {
  const [step, setStep] = useState<Step>("welcome");
  const [feedback, setFeedback] = useState("");
  const [feedbackResult, setFeedbackResult] = useState("");
  const go = (next: Step) => { setStep(next); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <section className="portal-card portal-project-detail portal-preview">
    <div className="portal-preview-banner" role="note"><strong>STUDIO PREVIEW · Valerie sees none of this preview banner</strong><span>Sample screens only. Nothing here signs, charges, uploads, or sends an email. The agreement and invoice PDFs still need your approval and attachment.</span></div>
    <div className="portal-preview-nav" aria-label="Client journey preview">
      {steps.map(([id, title]) => <button key={id} type="button" aria-current={step === id ? "step" : undefined} onClick={() => go(id)}>{title}</button>)}
    </div>

    {step === "welcome" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>PRIVATE CLIENT WORKSPACE</small>
      <h1>Welcome back,<br/><em>Valerie.</em></h1>
      <p>Your project details live here. When a new agreement, invoice, or review file is ready, the studio will email you.</p>
      <div className="portal-project-list"><button type="button" onClick={() => go("project")}><span>Agreement</span><strong>Custom Illustrated Venue Experience Map</strong><span>Open project ↗</span></button></div>
      <p className="portal-preview-note">In the real flow, Valerie arrives here after using her private, one-time email link.</p>
    </>}

    {step === "project" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>PRIVATE PROJECT / AGREEMENT</small>
      <h1>Custom Illustrated Venue Experience Map</h1>
      <div className="portal-welcome"><h2>Welcome, Valerie.</h2><p>We’re excited to create a custom illustrated experience map for Vale Royal Barn — a timeless piece designed to showcase your property, guide guests through the experience, and become part of your venue’s story.</p><p>Your project dashboard houses your agreement, payments, updates, and final deliverables throughout the creative process.</p></div>
      <p className="portal-investment"><span>PROJECT INVESTMENT</span><strong>$3,750.00</strong></p>
      <div className="portal-step-grid"><article><h2>01 / Agreement</h2><p>The studio has signed. Read the complete agreement and add your signature.</p><button className="portal-text-action" type="button" onClick={() => go("agreement")}>Review agreement ↗</button></article><article><h2>02 / Investment &amp; payment</h2><p>Your Chase invoice is prepared. Its details will appear here after you sign the agreement.</p></article></div>
      <section className="portal-materials"><h2>03 / Upload project materials</h2><p>Share the aerial imagery, site plan, floor plan, property photography, logo or branding, and any inspiration you already have. Upload what is ready now; you can return for the rest.</p><p>The upload folder opens once the agreement is signed.</p></section>
      <Journey signed={false} paid={false} review={false}/>
      <section className="portal-review"><h2>Review &amp; revisions</h2><p>When a version is ready, you&apos;ll receive an email and can view it here. Leave one clear set of revision notes or approve that version.</p><p>No review files have been shared yet.</p></section>
    </>}

    {step === "agreement" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>PRIVATE AGREEMENT / CUSTOM ILLUSTRATED VENUE EXPERIENCE MAP</small>
      <h1>Creative Services Agreement</h1>
      <p>Review every page before signing. The signed PDF will remain available here for both parties.</p>
      <p><strong>Studio:</strong> signed &nbsp; <strong>Client:</strong> awaiting signature</p>
      <div className="portal-preview-document" aria-label="Sample agreement content pending approval">
        <small>DRAFT CONTENT PREVIEW · THE FINAL PDF WILL BE SHOWN HERE</small>
        <h2>Vale Royal Barn<br/>Illustrated Venue Experience Map</h2>
        <p><strong>Scope.</strong> A custom, standalone illustrated property map showing the venue, ceremony and reception spaces, suites, guest arrival and parking, outdoor areas, photo locations, and selected landscape details. Elegant labels and callouts will help prospective couples understand the property.</p>
        <p><strong>Deliverables.</strong> One approved final composition, website-ready PNG and print-ready PDF for brochure use. Two rounds of refinement are included; substantial new directions or added deliverables require a separate quote.</p>
        <p><strong>Investment.</strong> Proposed project total $3,750: $1,875 deposit, $937.50 after the first concept presentation, and $937.50 before final production files are released.</p>
        <p><strong>Rights.</strong> After final payment, Vale Royal Barn receives an exclusive commercial usage license for the final approved illustration. The studio retains its process, methods, source work, and right to use similar styles for future clients, plus portfolio display rights. Final language is subject to approval.</p>
        <p><strong>Timing.</strong> An estimated 4–8 weeks after signed terms, deposit, and source materials. Review timing and additional changes can affect delivery.</p>
      </div>
      <div className="portal-sign-form"><h2>Sign this agreement</h2><p>Valerie would be signed in with her verified email. Her typed legal name, consent, and signing time are attached to the exact approved PDF.</p><label>Full legal name<input placeholder="Valerie’s legal name" disabled /></label><label>Business you are signing for<input value="Vale Royal Barn" readOnly /></label><label className="portal-check"><input type="checkbox" disabled /><span>I have read the entire agreement displayed above.</span></label><label className="portal-check"><input type="checkbox" disabled /><span>I agree to use electronic records and signatures for this agreement. Typing my name and selecting Sign agreement is my electronic signature.</span></label><button type="button" disabled>Sign agreement</button></div>
      <button className="portal-text-action" type="button" onClick={() => go("payment")}>Preview the next state after signing ↗</button>
    </>}

    {step === "payment" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>PRIVATE PROJECT / INVOICE</small>
      <h1>Custom Illustrated Venue Experience Map</h1>
      <div className="portal-welcome"><h2>Welcome, Valerie.</h2><p>Your agreement is signed. Your deposit invoice and material folder are ready below.</p></div>
      <p className="portal-investment"><span>PROJECT INVESTMENT</span><strong>$3,750.00</strong></p>
      <div className="portal-step-grid"><article><h2>01 / Agreement</h2><p>Signed by both parties. Your signed copy is ready.</p><button className="portal-text-action" type="button" onClick={() => go("agreement")}>View signed agreement ↗</button></article><article><h2>02 / Investment &amp; payment</h2><div className="portal-invoice-list"><section className="portal-invoice-card"><small>CHASE INVOICE / SAMPLE NUMBER</small><h3>Project deposit</h3><div className="portal-invoice-row"><span>Business</span><strong>A. Halliwell Studio, LLC</strong></div><div className="portal-invoice-row"><span>Customer</span><strong>Valerie / Vale Royal Barn</strong></div><div className="portal-invoice-row"><span>Amount due</span><strong>$1,875.00</strong></div><div className="portal-invoice-row"><span>Status</span><strong>Issued</strong></div><span className="portal-text-action">View original Chase invoice PDF ↗</span><div className="portal-payment-options"><p>Pay by card via Stripe ↗ <small>(appears only when a matching issued Stripe invoice is attached)</small></p><p>Pay by Zelle using the ID shown on the issued invoice.</p><p>Check instructions appear when the mailing address is supplied.</p><p>Choose one payment method for this invoice. Payment status updates after the studio confirms receipt.</p></div></section></div></article></div>
      <section className="portal-materials"><h2>03 / Upload project materials</h2><p>Share the aerial imagery, site plan, floor plan, property photography, logo or branding, and any inspiration you already have. Upload what is ready now; you can return for the rest.</p><div className="portal-material-form"><label>What are you sharing?<select disabled defaultValue="aerial"><option value="aerial">Aerial imagery</option><option>Site plan</option><option>Floor plan</option><option>Property photography</option><option>Logo / branding</option><option>Inspiration / references</option></select></label><label>Choose files<input type="file" disabled /><small>Up to 12 files at a time, 25 MB each. PDF, JPG, PNG, or WebP.</small></label><label>Optional note<textarea disabled placeholder="Any spaces, views, or details especially meaningful to your guests?" /></label><button type="button" disabled>Upload project materials</button></div></section>
      <Journey signed paid={false} review={false}/>
      <button className="portal-text-action" type="button" onClick={() => go("review")}>Preview the first concept review ↗</button>
    </>}

    {step === "review" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>PRIVATE PROJECT / REVIEW</small>
      <h1>Custom Illustrated Venue Experience Map</h1>
      <div className="portal-welcome"><h2>Your first concept is ready.</h2><p>Review the map at your own pace. You can send one clear set of revision notes or approve this version.</p></div>
      <Journey signed paid review/>
      <section className="portal-review"><h2>Review &amp; revisions</h2><p>When a version is ready, you&apos;ll receive an email and can view it here. Leave one clear set of revision notes or approve that version.</p><article className="portal-review-item"><strong>Version 1 · First illustrated map concept</strong><p>Status: review</p><span className="portal-text-action">View first proof PDF ↗</span><div className="portal-feedback"><label htmlFor="preview-feedback">Revision notes for this version</label><textarea id="preview-feedback" value={feedback} onChange={event => setFeedback(event.target.value)} maxLength={4000} placeholder="What would you like adjusted?"/><button type="button" onClick={() => setFeedbackResult(feedback.trim() ? "Preview: your revision notes were sent to the studio." : "Add your revision notes first.")}>Request revisions ↗</button><button type="button" onClick={() => setFeedbackResult("Preview: this version was approved. Thank you!")}>Approve this version ✓</button>{feedbackResult && <p role="status">{feedbackResult}</p>}</div></article></section>
    </>}

    {step === "email" && <>
      <div className="portal-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
      <small>CLIENT NOTIFICATIONS / CONTENT PREVIEW</small>
      <h1>The emails she receives.</h1>
      <div className="portal-preview-emails"><article><small>01 / INVITATION</small><h2>Your A. Halliwell Studio project workspace</h2><p>Hi Valerie,</p><p>Your project workspace is ready. Open this private link to see the next steps.</p><p>This link expires in 15 minutes. You can request a fresh link any time at the portal.</p><p>Arabella</p></article><article><small>02 / AGREEMENT</small><h2>Studio agreement notification</h2><p>The studio has signed your project agreement. Please review and sign it in your private workspace.</p><p>Arabella</p></article><article><small>03 / FIRST REVIEW</small><h2>Ready for your review: Custom Illustrated Venue Experience Map</h2><p>Hi Valerie,</p><p>Version 1 of Custom Illustrated Venue Experience Map is ready for your review. Open your private workspace to view the file and leave your first-round notes or approve it.</p><p>If your sign-in link has expired, request a new one there.</p><p>Arabella</p></article></div>
      <p className="portal-preview-note">Actual emails include a private portal link. Sending will happen only when the approved project documents and review files are published.</p>
    </>}
    <div className="portal-preview-footer"><Link href="/portal/studio">← Studio workspace</Link><span>For your review only · No client record or invoice was created</span></div>
  </section>;
}

function Journey({ signed, paid, review }: { signed: boolean; paid: boolean; review: boolean }) {
  return <section className="portal-journey"><h2>Project journey</h2><ol>
    <li><strong>01 — Project confirmed</strong><span>Agreement {signed ? "signed ✓" : "awaiting signature"} · Deposit {paid ? "received ✓" : "awaiting payment"}</span></li>
    <li><strong>02 — Creative development</strong><span>{review ? "In progress" : "Source review + illustration planning"}</span></li>
    <li><strong>03 — First concept review</strong><span>{review ? "Initial concept available" : "Initial map presentation"}</span></li>
    <li><strong>04 — Refinement</strong><span>Final adjustments</span></li>
    <li><strong>05 — Final delivery</strong><span>Website + print-ready files</span></li>
  </ol></section>;
}
