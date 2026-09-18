"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const projectTypes = [
  "A new website",
  "A website redesign",
  "A custom digital experience",
  "An interactive business system",
  "Something unusual",
];

const projectNeeds = [
  "Strategy",
  "Web design",
  "Development",
  "Booking or scheduling",
  "E-commerce",
  "Custom forms",
  "Interactive tools",
  "Events or ticketing",
  "Lead generation",
  "Something custom",
];

const timingOptions = [
  "As soon as possible",
  "Within 2 weeks",
  "Within 3–4 weeks",
  "Within 1–2 months",
  "I'm flexible",
];

const investmentOptions = [
  "$5k–$10k",
  "$10k–$20k",
  "$20k–$30k",
  "$30k+",
  "Not sure yet",
];

export default function StartProject() {
  const [projectType, setProjectType] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [investment, setInvestment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const brief = useMemo(() => {
    return [
      projectType ? `Project: ${projectType}` : null,
      needs.length ? `Needs: ${needs.join(", ")}` : null,
      timing ? `Timing: ${timing}` : null,
      investment ? `Investment: ${investment}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }, [projectType, needs, timing, investment]);

  const toggleNeed = (need: string) => {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need]
    );
  };

  const resetForm = () => {
    setProjectType("");
    setNeeds([]);
    setTiming("");
    setInvestment("");
    setName("");
    setEmail("");
    setBusiness("");
    setMessage("");
    setWebsite("");
    setStatus("idle");
    setFeedback("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !projectType ||
      !timing ||
      !investment ||
      !name.trim() ||
      !email.trim()
    ) {
      setStatus("error");
      setFeedback(
        "Complete the required fields before sending your project."
      );
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          business,
          projectType,
          needs,
          timing,
          investment,
          message,
          website,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Your inquiry could not be sent."
        );
      }

      setStatus("success");
      setFeedback(
        "Your project is officially in my inbox. I'll be in touch soon. ♥"
      );
    } catch (error) {
      console.error("Inquiry submission error:", error);

      setStatus("error");
      setFeedback(
        "Your inquiry couldn't be sent right now. Please try again."
      );
    }
  };

  return (
    <section className="sheet start-sheet" id="start">
      <div className="start-project">
        {status === "success" ? (
          <div className="start-project-success">
            <span className="start-kicker">
              INQUIRY RECEIVED
            </span>

            <div
              className="start-success-heart"
              aria-hidden="true"
            >
              ♥
            </div>

            <h2>
              It's officially
              <br />
              in my inbox.
            </h2>

            <p>{feedback}</p>

            <div className="start-success-summary">
              <span>PROJECT</span>
              <strong>{projectType}</strong>

              <span>INVESTMENT</span>
              <strong>{investment}</strong>

              <span>TIMING</span>
              <strong>{timing}</strong>
            </div>

            <button
              type="button"
              className="button button-primary"
              onClick={resetForm}
            >
              Start another project ↗
            </button>
          </div>
        ) : (
          <>
            <div className="start-project-header">
              <div>
                <span className="start-kicker">
                  05 / START A PROJECT
                </span>

                <h2>
                  Okay, tell me
                  <br />
                  what we're building.
                </h2>
              </div>

              <p>
                A few quick questions give me enough
                context to understand the project before
                we ever get on a call.
              </p>
            </div>

            <form
              className="project-builder"
              onSubmit={handleSubmit}
            >
              <fieldset className="builder-step">
                <legend>
                  <span>01</span>
                  What are we making?
                </legend>

                <div className="builder-options">
                  {projectTypes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={
                        projectType === option
                          ? "selected"
                          : ""
                      }
                      aria-pressed={projectType === option}
                      onClick={() => setProjectType(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="builder-step">
                <legend>
                  <span>02</span>
                  What does it need to do?
                </legend>

                <p className="builder-hint">
                  Choose as many as you need.
                </p>

                <div className="builder-options">
                  {projectNeeds.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={
                        needs.includes(option)
                          ? "selected"
                          : ""
                      }
                      aria-pressed={needs.includes(option)}
                      onClick={() => toggleNeed(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="builder-split">
                <fieldset className="builder-step">
                  <legend>
                    <span>03</span>
                    What's the timing?
                  </legend>

                  <div className="builder-options">
                    {timingOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={
                          timing === option
                            ? "selected"
                            : ""
                        }
                        aria-pressed={timing === option}
                        onClick={() => setTiming(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="builder-step">
                  <legend>
                    <span>04</span>
                    What's the investment?
                  </legend>

                  <div className="builder-options">
                    {investmentOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={
                          investment === option
                            ? "selected"
                            : ""
                        }
                        aria-pressed={
                          investment === option
                        }
                        onClick={() =>
                          setInvestment(option)
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <fieldset className="builder-step builder-contact">
                <legend>
                  <span>05</span>
                  And who am I talking to?
                </legend>

                <div className="builder-fields">
                  <label>
                    <span>
                      Your name <b>*</b>
                    </span>

                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      autoComplete="name"
                      maxLength={100}
                      required
                      placeholder="Your name"
                    />
                  </label>

                  <label>
                    <span>
                      Email <b>*</b>
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      autoComplete="email"
                      maxLength={254}
                      required
                      placeholder="you@business.com"
                    />
                  </label>

                  <label>
                    <span>Business or brand</span>

                    <input
                      type="text"
                      name="business"
                      value={business}
                      onChange={(event) =>
                        setBusiness(event.target.value)
                      }
                      autoComplete="organization"
                      maxLength={150}
                      placeholder="Business name"
                    />
                  </label>

                  <label className="builder-message">
                    <span>
                      Anything else I should know?
                    </span>

                    <textarea
                      name="message"
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      maxLength={3000}
                      rows={6}
                      placeholder="Tell me about the business, the problem, the dream, the weird idea..."
                    />
                  </label>

                  <label
                    className="builder-honeypot"
                    aria-hidden="true"
                  >
                    Website
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(event) =>
                        setWebsite(event.target.value)
                      }
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
                  <p>
                    Your answers come directly to
                    A. Halliwell Studio.
                  </p>
                </div>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending..."
                    : "Send my project ↗"}
                </button>
              </div>

              {feedback && status === "error" && (
                <p
                  className="builder-feedback builder-error"
                  role="alert"
                >
                  {feedback}
                </p>
              )}

              <p className="builder-privacy">
                Your information is used only to respond
                to your project inquiry.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
