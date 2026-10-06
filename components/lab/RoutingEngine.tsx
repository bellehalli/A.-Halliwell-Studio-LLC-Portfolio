"use client";
import { useEffect, useRef, useState } from "react";
import {
  routingBrief,
  updateRoutingAnswer,
  type RoutingStep,
  type RoutingAnswers,
} from "@/lib/lab-routing";
import { BriefLink, Preview, usePublishLabBrief } from "./LabShared";
export default function RoutingEngine({
  steps,
  name,
  projectType,
  needs,
  context = "",
  disclosure,
  inHome = false,
  onBriefChange,
}: {
  steps: readonly RoutingStep[];
  name: string;
  projectType: string;
  needs: string[];
  context?: string;
  disclosure: string;
  inHome?: boolean;
  onBriefChange?: (brief: string) => void;
}) {
  const legendRef = useRef<HTMLLegendElement>(null);
  function moveTo(next: number) {
    setIndex(next);
    requestAnimationFrame(() => legendRef.current?.focus());
  }
  const [answers, setAnswers] = useState<RoutingAnswers>({});
  const [index, setIndex] = useState(0);
  useEffect(() => {
    onBriefChange?.("");
  }, [onBriefChange]);
  const step = steps[index];
  const emergency = answers.urgency?.includes("Immediate safety concern");
  const complete = !emergency && steps.every((s) => answers[s.key]?.length);
  const brief = [context, routingBrief(steps, answers)]
    .filter(Boolean)
    .join("\n");
  usePublishLabBrief({ name, projectType, needs, summary: brief });
  function choose(value: string) {
    const next = updateRoutingAnswer(answers, steps, index, value);
    setAnswers(next);
    onBriefChange?.(routingBrief(steps, next));
  }
  return (
    <section className="lab-routing" aria-label={`${name} routing`}>
      <p className="lab-caption">{disclosure}</p>
      <p role="status">
        Step {index + 1} of {steps.length} · {step.label}
      </p>
      <fieldset className="lab-choices">
        <legend ref={legendRef} tabIndex={-1}>
          {step.label}
          {step.multiple ? " (select all that apply)" : ""}
        </legend>
        <div>
          {step.options.map((option) => (
            <button
              type="button"
              key={option}
              aria-pressed={!!answers[step.key]?.includes(option)}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      {emergency ? (
        <p role="alert" className="lab-warning">
          For immediate danger, leave the area and contact emergency services or
          your utility. Do not wait for this service form. This demo is not
          monitored.
        </p>
      ) : null}
      <div className="lab-pills">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => moveTo(index - 1)}
        >
          Back
        </button>
        {index < steps.length - 1 ? (
          <button
            type="button"
            disabled={emergency || !answers[step.key]?.length}
            onClick={() => moveTo(index + 1)}
          >
            Continue
          </button>
        ) : null}
      </div>
      <section className="lab-result" aria-label="Structured brief">
        <h4>{name} brief</h4>
        {context ? <p style={{ whiteSpace: "pre-line" }}>{context}</p> : null}
        <dl>
          {steps.map((s) => (
            <div key={s.key}>
              <dt>{s.label}</dt>
              <dd>{answers[s.key]?.join(", ") || "Not selected"}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Preview
        title={`Preview ${name.toLowerCase()} brief`}
        disabled={!complete}
      >
        <p style={{ whiteSpace: "pre-line" }}>{brief}</p>
        <p>{disclosure}</p>
      </Preview>
      {complete ? (
        <BriefLink
          inHome={inHome}
          name={name}
          projectType={projectType}
          needs={needs}
          summary={brief}
        />
      ) : (
        <p className="lab-caption">
          Complete the steps to carry this brief into Start Project.
        </p>
      )}
    </section>
  );
}
