"use client";
import { useState } from "react";
import {
  homeSymptoms,
  homeServicePath,
  type RoutingStep,
} from "@/lib/lab-routing";
import { Choices, usePublishLabBrief } from "./LabShared";
import RoutingEngine from "./RoutingEngine";
import ServiceCommand from "./ServiceCommand";
const systems = [
  "Heating / cooling",
  "Water / drains",
  "Power / lighting",
  "Air / ventilation",
  "Not sure",
];
export default function HomeIntelligence({
  inHome = false,
}: {
  inHome?: boolean;
}) {
  const [symptom, setSymptom] = useState("");
  const [system, setSystem] = useState("");
  const path = homeServicePath(symptom, system);
  usePublishLabBrief({
    name: "Home Intelligence",
    projectType: "Small business / service",
    needs: [
      "Custom interactive feature",
      "Quote or lead flow",
      "Booking or scheduling",
    ],
    summary: `Observation: ${symptom || "Not selected"}\nArea / system: ${system || "Not selected"}`,
  });
  const steps: RoutingStep[] = [
    {
      key: "urgency",
      label: "Urgency",
      options: [
        "Planning ahead",
        "Soon / contact me",
        "Urgent service request",
        "Immediate safety concern",
      ],
    },
    {
      key: "path",
      label: "Service path to discuss",
      options: [path, "Staff triage / unsure"],
    },
    {
      key: "intent",
      label: "What would you like to explore?",
      options: ["Repair", "Replace", "Upgrade", "Unsure"],
    },
  ];
  return (
    <div className="lab-experiment lab-service">
      <header className="lab-experiment-head">
        <div>
          <small>04 / HOME INTELLIGENCE</small>
          <h3>
            Your home.
            <br />
            <em>A clearer next step.</em>
          </h3>
        </div>
        <p>Describe what you notice. Route your request to a service team.</p>
      </header>
      <Choices
        label="What are you noticing?"
        options={homeSymptoms}
        value={symptom}
        onChange={(v) => {
          setSymptom(v);
          setSystem("");
        }}
      />
      {symptom ? (
        <>
          <div
            className="lab-house"
            aria-label="Interactive house system selector"
          >
            <svg
              viewBox="0 0 500 270"
              preserveAspectRatio="none"
              role="img"
              aria-label="House diagram: roof, living space, utility and water systems"
            >
              <path
                d="M30 110 L250 15 L470 110 M65 95 V250 H435 V95 M65 165 H435 M250 95 V250"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <rect
                x="95"
                y="190"
                width="70"
                height="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <rect
                x="310"
                y="110"
                width="55"
                height="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            {systems.slice(0, 4).map((s, i) => (
              <button
                type="button"
                key={s}
                aria-pressed={system === s}
                style={{
                  left: `${[28, 70, 70, 30][i]}%`,
                  top: `${[72, 75, 46, 38][i]}%`,
                }}
                onClick={() => setSystem(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <Choices
            label="Area / system you want to discuss"
            options={systems}
            value={system}
            onChange={setSystem}
          />
        </>
      ) : null}
      {system ? (
        <RoutingEngine
          key={`${symptom}-${system}`}
          steps={steps}
          name="Home Intelligence"
          projectType="Small business / service"
          needs={[
            "Custom interactive feature",
            "Quote or lead flow",
            "Booking or scheduling",
          ]}
          context={`Observation: ${symptom}\nArea / system: ${system}`}
          disclosure="This routes a request, without diagnosing a fault or confirming repairs. For immediate danger, leave the area and contact emergency services or your utility; this demo is not monitored."
          inHome={inHome}
        />
      ) : null}
      <details>
        <summary>
          Explore the existing Northstar appointment and dispatch demo
        </summary>
        <ServiceCommand inHome={inHome} />
      </details>
    </div>
  );
}
