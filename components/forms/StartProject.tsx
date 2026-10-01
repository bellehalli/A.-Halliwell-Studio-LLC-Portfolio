"use client";
import { investmentOptions, projectReasons, studio } from "@/lib/studio-config";
import { track } from "@vercel/analytics";

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { readStorage, writeStorage, removeStorage } from "@/lib/browser-storage";

type Status = "idle" | "sending" | "success" | "error";
type LabScope = { projectType: string; needs: string[]; successGoal: string };

type Draft = {
  projectType: string;
  needs: string[];
  timing: string;
  investment: string;
  name: string;
  email: string;
  business: string;
  currentUrl: string;
  currentProblem: string;
  successGoal: string;
  whyNow: string;
  whyNowOther: string;
  assets: string[];
  referralSource: string;
  referralOther: string;
  productCount: string;
  bookingType: string;
  guestPain: string;
};

const DRAFT_KEY = "ahs-project-inquiry-draft-v1";
const LAB_SCOPE_KEY = "ahs-lab-scope-v1";
const draftText = (value: unknown, max: number) => typeof value === "string" ? value.slice(0, max) : "";
const draftList = (value: unknown, options: string[]) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && options.includes(item)) : [];

const projectTypes = [
  "Small business / service",
  "Hospitality / venue",
  "Beauty / wellness",
  "E-commerce / product brand",
  "Restaurant / nightlife / events",
  "Professional service",
  "Something else",
];

const projectNeeds = [
  "One-page website",
  "Multi-page website",
  "Website redesign",
  "Website Refinement",
  "E-commerce",
  "Booking or scheduling",
  "Quote or lead flow",
  "Client portal",
  "Events or ticketing",
  "Custom interactive feature",
  "Illustration / property map",
  "Add to an existing website",
  "Ongoing support",
];

const timingOptions = [
  "As soon as possible",
  "Within 2 weeks",
  "Within 3–4 weeks",
  "Within 1–2 months",
  "I'm flexible",
];

const assetOptions = [
  "Brand identity / logo",
  "Website copy",
  "Professional photos / video",
  "Domain",
  "Existing website",
  "Product / service information",
  "Nothing yet · starting from scratch",
];

const referralOptions = [
  "Google / search",
  "Instagram / TikTok",
  "Referral",
  "A. Halliwell Studio outreach",
  "Event / networking",
  "Other",
];

const productCountOptions = ["1–10", "11–50", "51–200", "200+", "Not sure yet"];

export default function StartProject({ inHome = false }: { inHome?: boolean }) {
  const submissionRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const errorPrefix = useId();
  const [attempted, setAttempted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [invalidField, setInvalidField] = useState("");
  const Heading = inHome ? "h2" : "h1";
  const [projectType, setProjectType] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [investment, setInvestment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentProblem, setCurrentProblem] = useState("");
  const [successGoal, setSuccessGoal] = useState("");
  const [whyNow, setWhyNow] = useState("");
  const [whyNowOther, setWhyNowOther] = useState("");
  const [assets, setAssets] = useState<string[]>([]);
  const [referralSource, setReferralSource] = useState("");
  const [referralOther, setReferralOther] = useState("");
  const [productCount, setProductCount] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [guestPain, setGuestPain] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const isCommerce = projectType === "E-commerce / product brand" || needs.includes("E-commerce");
  const hasBooking = needs.includes("Booking or scheduling");
  const isHospitality = projectType === "Hospitality / venue";
  const isExistingSite = needs.some((x) =>
    ["Website redesign", "Website Refinement", "Add to an existing website", "Ongoing support"].includes(x)
  );
  const hasProjectSpecificDetails = isCommerce || hasBooking || isHospitality || isExistingSite;
  const step = {
    details: 3,
    timing: hasProjectSpecificDetails ? 4 : 3,
    investment: hasProjectSpecificDetails ? 5 : 4,
    change: hasProjectSpecificDetails ? 6 : 5,
    whyNow: hasProjectSpecificDetails ? 7 : 6,
    assets: hasProjectSpecificDetails ? 8 : 7,
    referral: hasProjectSpecificDetails ? 9 : 8,
    contact: hasProjectSpecificDetails ? 10 : 9,
  };

  const normalizeUrl = () => {
    const value = currentUrl.trim();
    if (!value) return;
    if (!/^https?:\/\//i.test(value)) setCurrentUrl(`https://${value}`);
  };

  const brief = useMemo(
    () =>
      [
        projectType && `Business: ${projectType}`,
        needs.length && `Needs: ${needs.join(", ")}`,
        currentUrl && `Current site: ${currentUrl}`,
        timing && `Timing: ${timing}`,
        investment && `Investment: ${investment}`,
        successGoal && `Success looks like: ${successGoal}`,
        whyNow && `Why now: ${whyNow === "Another reason" && whyNowOther.trim() ? whyNowOther.trim() : whyNow}`,
      ]
        .filter(Boolean)
        .join("\n"),
    [projectType, needs, currentUrl, timing, investment, successGoal, whyNow, whyNowOther]
  );

  useEffect(() => {
    try {
      const saved = readStorage("local", DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<Draft>;
        setProjectType(projectTypes.includes(draft.projectType || "") ? draft.projectType! : "");
        setNeeds(draftList(draft.needs, projectNeeds));
        setTiming(timingOptions.includes(draft.timing || "") ? draft.timing! : "");
        setInvestment(investmentOptions.includes(draft.investment || "") ? draft.investment! : "");
        setName(draftText(draft.name, 100));
        setEmail(draftText(draft.email, 254));
        setBusiness(draftText(draft.business, 150));
        setCurrentUrl(draftText(draft.currentUrl, 400));
        setCurrentProblem(draftText(draft.currentProblem, 3000));
        setSuccessGoal(draftText(draft.successGoal, 3000));
        setWhyNow(projectReasons.includes(draft.whyNow || "") ? draft.whyNow! : "");
        setWhyNowOther(draftText(draft.whyNowOther, 1200));
        setAssets(draftList(draft.assets, assetOptions));
        setReferralSource(referralOptions.includes(draft.referralSource || "") ? draft.referralSource! : "");
        setReferralOther(draftText(draft.referralOther, 200));
        setProductCount(productCountOptions.includes(draft.productCount || "") ? draft.productCount! : "");
        setBookingType(draftText(draft.bookingType, 1200));
        setGuestPain(draftText(draft.guestPain, 1800));
      }
    } catch {
      removeStorage("local", DRAFT_KEY);
    }
    try {
      const fromLab = new URLSearchParams(window.location.search).get("labScope") || readStorage("session", LAB_SCOPE_KEY);
      if (fromLab) {
        const scope = JSON.parse(fromLab) as LabScope;
        if (projectTypes.includes(scope.projectType) && Array.isArray(scope.needs) && typeof scope.successGoal === "string") {
          setProjectType(scope.projectType);
          setNeeds(draftList(scope.needs, projectNeeds));
          setSuccessGoal(draftText(scope.successGoal, 3000));
        }
        removeStorage("session", LAB_SCOPE_KEY);
      }
    } catch {
      removeStorage("session", LAB_SCOPE_KEY);
    } finally {
      const service = new URLSearchParams(window.location.search).get("service");
      if (service === "illustration") {
        setNeeds(current => current.includes("Illustration / property map") ? current : [...current, "Illustration / property map"]);
      }
      if (service === "support") {
        setNeeds(current => current.includes("Ongoing support") ? current : [...current, "Ongoing support"]);
      }
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady || status === "success") return;

    const draft: Draft = {
      projectType,
      needs,
      timing,
      investment,
      name,
      email,
      business,
      currentUrl,
      currentProblem,
      successGoal,
      whyNow,
      whyNowOther,
      assets,
      referralSource,
      referralOther,
      productCount,
      bookingType,
      guestPain,
    };

    setDraftSaved(writeStorage("local", DRAFT_KEY, JSON.stringify(draft)));
  }, [
    draftReady,
    status,
    projectType,
    needs,
    timing,
    investment,
    name,
    email,
    business,
    currentUrl,
    currentProblem,
    successGoal,
    whyNow,
    whyNowOther,
    assets,
    referralSource,
    referralOther,
    productCount,
    bookingType,
    guestPain,
  ]);

  useEffect(() => {
    const receiveScope = (event: Event) => {
      const scope = (event as CustomEvent<LabScope>).detail;
      if (!scope || !projectTypes.includes(scope.projectType) || !Array.isArray(scope.needs) || typeof scope.successGoal !== "string") return;
      setProjectType(scope.projectType);
      setNeeds(draftList(scope.needs, projectNeeds));
      setSuccessGoal(draftText(scope.successGoal, 3000));
      removeStorage("session", LAB_SCOPE_KEY);
    };
    window.addEventListener("ahs:lab-scope", receiveScope);
    return () => window.removeEventListener("ahs:lab-scope", receiveScope);
  }, []);

  const toggleNeed = (x: string) =>
    setNeeds((current) =>
      current.includes(x) ? current.filter((item) => item !== x) : [...current, x]
    );

  const toggleAsset = (x: string) =>
    setAssets((current) => {
      const none = "Nothing yet · starting from scratch";
      if (x === none) return current.includes(none) ? [] : [none];

      const withoutNone = current.filter((item) => item !== none);
      return withoutNone.includes(x)
        ? withoutNone.filter((item) => item !== x)
        : [...withoutNone, x];
    });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "sending") return;
    setAttempted(true);
    const missing = [["projectType", !!projectType], ["needs", !!needs.length], ["timing", !!timing], ["investment", !!investment], ["name", !!name.trim()], ["email", !!email.trim()]].find(([, complete]) => !complete)?.[0];
    if (missing) {
      setStatus("error");
      setFeedback("Please complete the marked answers before sending your project.");
      formRef.current?.querySelector<HTMLElement>(`[data-required="${missing}"] button, input[data-required="${missing}"]`)?.focus();
      return;
    }
    const invalid = formRef.current?.querySelector<HTMLInputElement>("input:invalid");
    if (invalid) {
      setInvalidField(invalid.type === "email" ? "email" : "url");
      setStatus("error");
      setFeedback(invalid.validationMessage);
      invalid.focus();
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      if (!submissionRef.current) {
        submissionRef.current = readStorage("session", "ahs-inquiry-submission") || crypto.randomUUID();
        writeStorage("session", "ahs-inquiry-submission", submissionRef.current);
      }
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionRef.current,
          name,
          email,
          business,
          projectType,
          needs,
          timing,
          investment,
          currentUrl,
          currentProblem,
          successGoal,
          whyNow: whyNow === "Another reason" && whyNowOther.trim() ? `Another reason: ${whyNowOther.trim()}` : whyNow,
          assets,
          referralSource,
          referralOther,
          productCount: isCommerce ? productCount : "",
          bookingType: hasBooking ? bookingType : "",
          guestPain: isHospitality ? guestPain : "",
          website,
        }),
      });

      const result = await response.json();
      if (response.status === 409) { submissionRef.current = ""; removeStorage("session", "ahs-inquiry-submission"); }
      if (!response.ok || !result.success) throw new Error(result.message || "Your inquiry couldn't be sent right now. Please try again.");

      removeStorage("local", DRAFT_KEY);
      removeStorage("session", "ahs-inquiry-submission");
      setConfirmationSent(Boolean(result.confirmationSent));
      setStatus("success");
      try { track("Form completion", { projectType }); } catch { /* Analytics cannot change a saved receipt. */ }
      setFeedback(
        result.confirmationSent
          ? "Your project is officially in my inbox, and a confirmation copy is headed to your email. ♥"
          : "Your project is officially in my inbox. I'll review it and be in touch soon. ♥"
      );
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Your inquiry couldn't be sent right now. Please try again.");
      requestAnimationFrame(() => feedbackRef.current?.focus());
    }
  }

  function clearDraft() {
    setProjectType(""); setNeeds([]); setTiming(""); setInvestment(""); setName(""); setEmail(""); setBusiness("");
    setCurrentUrl(""); setCurrentProblem(""); setSuccessGoal(""); setWhyNow(""); setWhyNowOther(""); setAssets([]); setReferralSource(""); setReferralOther("");
    setProductCount(""); setBookingType(""); setGuestPain(""); setWebsite(""); setAttempted(false); setInvalidField(""); setStatus("idle"); setFeedback("");
    submissionRef.current = "";
    removeStorage("local", DRAFT_KEY); removeStorage("session", "ahs-inquiry-submission"); removeStorage("session", LAB_SCOPE_KEY);
    formRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }

  const groupError = (key: string, complete: boolean, message: string) => attempted && !complete
    ? <p className="builder-field-error" id={`${errorPrefix}-${key}`}>{message}</p> : null;

  if (status === "success") {
    return (
      <section className="sheet start-sheet" id="start">
        <div className="start-project start-project-success">
          <span className="start-kicker">INQUIRY RECEIVED</span>
          <div className="start-success-heart">♥</div>
          <Heading>It&apos;s officially<br />in my inbox.</Heading>
          <p>{feedback}</p>
          <p>I&apos;ll review your project details and respond within 1–2 business days.</p>
          <div className="start-success-summary">
            <span>BUSINESS</span><strong>{projectType}</strong>
            <span>INVESTMENT</span><strong>{investment}</strong>
            <span>TIMING</span><strong>{timing}</strong>
          </div>
          <p>Want to talk it through? You can also choose a time for a 15-minute phone consultation. Leave your phone number when booking, and I’ll call you.</p>
          <a className="button button-primary" href={studio.consultationUrl} target="_blank" rel="noopener noreferrer" data-consultation-booking>Book a consultation</a>
          <p className="builder-privacy">Opens Google Calendar in a new tab.</p>
          {confirmationSent && (
            <p className="builder-privacy">Keep the confirmation email for a copy of the brief you sent.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="sheet start-sheet" id="start">
      <div className="start-project">
        <div className="start-project-header">
          <div>
            <span className="start-kicker">A CONVERSATION BEFORE THE BUILD</span>
            <Heading>Tell me what<br />you have in mind.</Heading>
          </div>
          <p>
            The exciting part, the frustrating part, and the thing the website needs to do next.
            Share what you know; we can shape the rest together.
          </p>
        </div>

        <form ref={formRef} className="project-builder" onSubmit={submit} onInput={() => setInvalidField("")} noValidate>
          <p className="builder-hint">Answers marked * are required. Everything else can be shaped together.</p>
          <fieldset className="builder-step" data-required="projectType" aria-invalid={attempted && !projectType} aria-describedby={attempted && !projectType ? `${errorPrefix}-projectType` : undefined}>
            <legend><span>01</span>What kind of business is this? <b>*</b></legend>
            {groupError("projectType", !!projectType, "Choose a business type.")}
            <div className="builder-options">
              {projectTypes.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={projectType === x ? "selected" : ""}
                  aria-pressed={projectType === x}
                  onClick={() => setProjectType(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="builder-step" data-required="needs" aria-invalid={attempted && !needs.length} aria-describedby={attempted && !needs.length ? `${errorPrefix}-needs` : undefined}>
            <legend><span>02</span>What do you need? <b>*</b></legend>
            {groupError("needs", !!needs.length, "Choose at least one service.")}
            <p className="builder-hint">Choose as many as apply.</p>
            <div className="builder-options">
              {projectNeeds.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={needs.includes(x) ? "selected" : ""}
                  aria-pressed={needs.includes(x)}
                  onClick={() => toggleNeed(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          {hasProjectSpecificDetails && (
            <fieldset className="builder-step">
              <legend><span>{String(step.details).padStart(2, "0")}</span>A few project-specific details.</legend>
              <div className="builder-fields">
                {isCommerce && (
                  <div className="builder-message">
                    <p className="builder-hint">About how many products?</p>
                    <div className="builder-options">
                      {productCountOptions.map((x) => (
                        <button
                          key={x}
                          type="button"
                          className={productCount === x ? "selected" : ""}
                          aria-pressed={productCount === x}
                          onClick={() => setProductCount(x)}
                        >
                          {x}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasBooking && (
                  <label className="builder-message">
                    <span>What do customers need to book or schedule?</span>
                    <textarea
                      maxLength={1200}
                  value={bookingType}
                      onChange={(e) => setBookingType(e.target.value)}
                      rows={3}
                      placeholder="Appointments, tours, consultations, tables, classes, services..."
                    />
                  </label>
                )}

                {isHospitality && (
                  <label className="builder-message">
                    <span>What do guests struggle to find, understand or do right now?</span>
                    <textarea
                      maxLength={1800}
                  value={guestPain}
                      onChange={(e) => setGuestPain(e.target.value)}
                      rows={4}
                      placeholder="Pricing, availability, spaces, packages, booking, planning details..."
                    />
                  </label>
                )}

                {isExistingSite && (
                  <p className="builder-hint builder-message">
                    Since this involves an existing site, add the current URL below so I can review what is already there.
                  </p>
                )}
              </div>
            </fieldset>
          )}

          <div className="builder-split">
            <fieldset className="builder-step" data-required="timing" aria-invalid={attempted && !timing} aria-describedby={attempted && !timing ? `${errorPrefix}-timing` : undefined}>
              <legend><span>{String(step.timing).padStart(2, "0")}</span>What&apos;s the timing? <b>*</b></legend>
              {groupError("timing", !!timing, "Choose a timing preference; flexible is fine.")}
              <div className="builder-options">
                {timingOptions.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={timing === x ? "selected" : ""}
                    aria-pressed={timing === x}
                    onClick={() => setTiming(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="builder-step" data-required="investment" aria-invalid={attempted && !investment} aria-describedby={attempted && !investment ? `${errorPrefix}-investment` : undefined}>
              <legend><span>{String(step.investment).padStart(2, "0")}</span>What investment range fits? <b>*</b></legend>
              {groupError("investment", !!investment, "Choose an investment direction, or ask for help scoping it.")}
              <p className="builder-hint">This helps me shape the right scope, not force you into a package.</p>
              <div className="builder-options">
                {investmentOptions.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={investment === x ? "selected" : ""}
                    aria-pressed={investment === x}
                    onClick={() => setInvestment(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <fieldset className="builder-step builder-contact">
            <legend><span>{String(step.change).padStart(2, "0")}</span>What needs to change?</legend>
            <div className="builder-fields">
              <label className="builder-message">
                <span>What is not working well right now?</span>
                <textarea
                  maxLength={3000}
                  value={currentProblem}
                  onChange={(e) => setCurrentProblem(e.target.value)}
                  rows={5}
                  placeholder="What feels confusing, manual, outdated, hard to sell through, or harder than it should be?"
                />
              </label>

              <label className="builder-message">
                <span>What would make this project a win?</span>
                <textarea
                  maxLength={3000}
                  value={successGoal}
                  onChange={(e) => setSuccessGoal(e.target.value)}
                  rows={5}
                  placeholder="More qualified inquiries, easier booking, better shopping, clearer information, less admin work..."
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="builder-step">
            <legend><span>{String(step.whyNow).padStart(2, "0")}</span>Why is this project important now?</legend>
            <p className="builder-hint">Choose the closest reason, if you have one.</p>
            <div className="builder-options">{projectReasons.map(reason => <button key={reason} type="button" className={whyNow === reason ? "selected" : ""} aria-pressed={whyNow === reason} onClick={() => setWhyNow(reason)}>{reason}</button>)}</div>
            {whyNow === "Another reason" && <label className="builder-message"><span>What is prompting the project?</span><textarea value={whyNowOther} onChange={event => setWhyNowOther(event.target.value)} maxLength={1200} rows={3}/></label>}
          </fieldset>

          <fieldset className="builder-step">
            <legend><span>{String(step.assets).padStart(2, "0")}</span>What do you already have?</legend>
            <p className="builder-hint">Choose everything that is ready. Starting from scratch is completely fine.</p>
            <div className="builder-options">
              {assetOptions.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={assets.includes(x) ? "selected" : ""}
                  aria-pressed={assets.includes(x)}
                  onClick={() => toggleAsset(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="builder-step">
            <legend><span>{String(step.referral).padStart(2, "0")}</span>How did you find the studio?</legend>
            <div className="builder-options">
              {referralOptions.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={referralSource === x ? "selected" : ""}
                  aria-pressed={referralSource === x}
                  onClick={() => setReferralSource(x)}
                >
                  {x}
                </button>
              ))}
            </div>

            {referralSource === "Other" && (
              <div className="builder-fields">
                <label>
                  <span>Tell me where</span>
                  <input
                    maxLength={200}
                  value={referralOther}
                    onChange={(e) => setReferralOther(e.target.value)}
                    placeholder="Podcast, article, friend, directory..."
                  />
                </label>
              </div>
            )}
          </fieldset>

          <fieldset className="builder-step builder-contact">
            <legend><span>{String(step.contact).padStart(2, "0")}</span>And who am I talking to?</legend>
            <div className="builder-fields">
              <label>
                <span>Your name <b>*</b></span>
                <input
                  required
                  autoComplete="name"
                  maxLength={100}
                  data-required="name"
                  aria-invalid={attempted && !name.trim()}
                  aria-describedby={attempted && !name.trim() ? `${errorPrefix}-name` : undefined}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                {groupError("name", !!name.trim(), "Enter your name.")}
              </label>

              <label>
                <span>Email <b>*</b></span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  data-required="email"
                  aria-invalid={attempted && (!email.trim() || invalidField === "email")}
                  aria-describedby={attempted && (!email.trim() || invalidField === "email") ? `${errorPrefix}-email` : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                />
                {groupError("email", !!email.trim() && invalidField !== "email", "Enter a valid email address.")}
              </label>

              <label>
                <span>Business or brand</span>
                <input
                  autoComplete="organization"
                  maxLength={150}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Business name"
                />
              </label>

              <label>
                <span>Current website URL</span>
                <input
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  maxLength={400}
                  aria-invalid={invalidField === "url"}
                  aria-describedby={invalidField === "url" ? `${errorPrefix}-feedback` : undefined}
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  onBlur={normalizeUrl}
                  placeholder="https://yourbusiness.com"
                />
              </label>

              <label className="builder-honeypot" aria-hidden="true">
                Website
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
          </fieldset>

          {brief && (
            <div className="builder-brief">
              <span>YOUR PROJECT BRIEF</span>
              <pre>{brief}</pre>
            </div>
          )}

          <div className="builder-submit">
            <div>
              <small>READY WHEN YOU ARE</small>
              <p>Your answers come directly to A. Halliwell Studio.</p>
              <p className="builder-privacy">{draftSaved ? "Your draft saves automatically on this device until you submit it." : "You can send your inquiry here. Keep this page open until you finish."}</p>
              <button className="builder-draft-clear" type="button" disabled={status === "sending"} onClick={clearDraft}>Clear my draft</button>
            </div>
            <button className="button button-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send my project"}
            </button>
          </div>

          {feedback && status === "error" && (
            <p ref={feedbackRef} id={`${errorPrefix}-feedback`} tabIndex={-1} role="alert" className="builder-feedback builder-error">
              {feedback}{" "}
              <a href={`mailto:${studio.email}`}>Email the studio directly</a>
            </p>
          )}

          <p className="builder-privacy"><a href="/services#faqs">Questions about pricing, payments, timelines, or ownership? Read the FAQs.</a></p>
          <p className="builder-privacy">
            Your information is used only to respond to your project inquiry.
          </p>
        </form>
      </div>
    </section>
  );
}
