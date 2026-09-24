"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

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
  assets: string[];
  referralSource: string;
  referralOther: string;
  productCount: string;
  bookingType: string;
  guestPain: string;
};

const DRAFT_KEY = "ahs-project-inquiry-draft-v1";

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
  "E-commerce",
  "Booking or scheduling",
  "Quote or lead flow",
  "Client portal",
  "Events or ticketing",
  "Custom interactive feature",
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

const investmentOptions = [
  "$1k–$2.5k · focused one-page",
  "$2.5k–$5k · expanded or smaller custom scope",
  "$5k–$10k · custom multi-page",
  "$10k–$20k · larger build + integrations",
  "$20k+ · advanced custom systems",
  "I need help scoping the investment",
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

export default function StartProject() {
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
    ["Website redesign", "Add to an existing website", "Ongoing support"].includes(x)
  );
  const hasProjectSpecificDetails = isCommerce || hasBooking || isHospitality || isExistingSite;
  const step = {
    details: 3,
    timing: hasProjectSpecificDetails ? 4 : 3,
    investment: hasProjectSpecificDetails ? 5 : 4,
    change: hasProjectSpecificDetails ? 6 : 5,
    assets: hasProjectSpecificDetails ? 7 : 6,
    referral: hasProjectSpecificDetails ? 8 : 7,
    contact: hasProjectSpecificDetails ? 9 : 8,
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
      ]
        .filter(Boolean)
        .join("\n"),
    [projectType, needs, currentUrl, timing, investment, successGoal]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<Draft>;
        setProjectType(draft.projectType || "");
        setNeeds(Array.isArray(draft.needs) ? draft.needs : []);
        setTiming(draft.timing || "");
        setInvestment(draft.investment || "");
        setName(draft.name || "");
        setEmail(draft.email || "");
        setBusiness(draft.business || "");
        setCurrentUrl(draft.currentUrl || "");
        setCurrentProblem(draft.currentProblem || "");
        setSuccessGoal(draft.successGoal || "");
        setAssets(Array.isArray(draft.assets) ? draft.assets : []);
        setReferralSource(draft.referralSource || "");
        setReferralOther(draft.referralOther || "");
        setProductCount(draft.productCount || "");
        setBookingType(draft.bookingType || "");
        setGuestPain(draft.guestPain || "");
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    } finally {
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
      assets,
      referralSource,
      referralOther,
      productCount,
      bookingType,
      guestPain,
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
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
    assets,
    referralSource,
    referralOther,
    productCount,
    bookingType,
    guestPain,
  ]);

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

    if (!projectType || !needs.length || !timing || !investment || !name.trim() || !email.trim()) {
      setStatus("error");
      setFeedback("Complete the required fields before sending your project.");
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
      if (!response.ok || !result.success) throw new Error();

      localStorage.removeItem(DRAFT_KEY);
      setConfirmationSent(Boolean(result.confirmationSent));
      setStatus("success");
      setFeedback(
        result.confirmationSent
          ? "Your project is officially in my inbox, and a confirmation copy is headed to your email. ♥"
          : "Your project is officially in my inbox. I'll review it and be in touch soon. ♥"
      );
    } catch {
      setStatus("error");
      setFeedback("Your inquiry couldn't be sent right now. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section className="sheet start-sheet" id="start">
        <div className="start-project start-project-success">
          <span className="start-kicker">INQUIRY RECEIVED</span>
          <div className="start-success-heart">♥</div>
          <h2>It&apos;s officially<br />in my inbox.</h2>
          <p>{feedback}</p>
          <div className="start-success-summary">
            <span>BUSINESS</span><strong>{projectType}</strong>
            <span>INVESTMENT</span><strong>{investment}</strong>
            <span>TIMING</span><strong>{timing}</strong>
          </div>
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
            <span className="start-kicker">05 / START A PROJECT</span>
            <h2>What are we<br />building?</h2>
          </div>
          <p>
            A one-page site, a full custom build and one missing feature are all valid projects.
            Tell me what the business needs the internet to do.
          </p>
        </div>

        <form className="project-builder" onSubmit={submit}>
          <fieldset className="builder-step">
            <legend><span>01</span>What kind of business is this?</legend>
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

          <fieldset className="builder-step">
            <legend><span>02</span>What do you need? <b>*</b></legend>
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
            <fieldset className="builder-step">
              <legend><span>{String(step.timing).padStart(2, "0")}</span>What&apos;s the timing?</legend>
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

            <fieldset className="builder-step">
              <legend><span>{String(step.investment).padStart(2, "0")}</span>What investment range fits?</legend>
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
                  value={currentProblem}
                  onChange={(e) => setCurrentProblem(e.target.value)}
                  rows={5}
                  placeholder="What feels confusing, manual, outdated, hard to sell through, or harder than it should be?"
                />
              </label>

              <label className="builder-message">
                <span>What would make this project a win?</span>
                <textarea
                  value={successGoal}
                  onChange={(e) => setSuccessGoal(e.target.value)}
                  rows={5}
                  placeholder="More qualified inquiries, easier booking, better shopping, clearer information, less admin work..."
                />
              </label>
            </div>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label>
                <span>Email <b>*</b></span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                />
              </label>

              <label>
                <span>Business or brand</span>
                <input
                  autoComplete="organization"
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
              <p className="builder-privacy">Your draft saves automatically on this device until you submit it.</p>
            </div>
            <button className="button button-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send my project ↗"}
            </button>
          </div>

          {feedback && status === "error" && (
            <p className="builder-feedback builder-error">
              {feedback}{" "}
              <a href="mailto:hello@ahalliwellstudio.com">Email the studio directly ↗</a>
            </p>
          )}

          <p className="builder-privacy">
            Your information is used only to respond to your project inquiry.
          </p>
        </form>
      </div>
    </section>
  );
}
