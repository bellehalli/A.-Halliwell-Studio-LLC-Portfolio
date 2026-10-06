export type RoutingStep = {
  key: string;
  label: string;
  options: readonly string[];
  multiple?: boolean;
};
export type RoutingAnswers = Record<string, string[]>;
export function updateRoutingAnswer(
  answers: RoutingAnswers,
  steps: readonly RoutingStep[],
  index: number,
  value: string,
): RoutingAnswers {
  const step = steps[index];
  if (!step || !step.options.includes(value)) return answers;
  const next = { ...answers };
  const current = answers[step.key] || [];
  const exclusive = (v: string) =>
    /^(No |Unsure|Help me|Discuss requirements)/.test(v);
  next[step.key] = step.multiple
    ? current.includes(value)
      ? current.filter((v) => v !== value)
      : exclusive(value)
        ? [value]
        : [...current.filter((v) => !exclusive(v)), value]
    : [value];
  // Changing an upstream answer invalidates all dependent selections.
  for (const dependent of steps.slice(index + 1)) delete next[dependent.key];
  return next;
}
export function routingBrief(
  steps: readonly RoutingStep[],
  answers: RoutingAnswers,
) {
  return steps
    .map(
      (step) =>
        `${step.label}: ${(answers[step.key] || []).join(", ") || "Not selected"}`,
    )
    .join("\n");
}
export const homeSymptoms = [
  "My home is too hot or cold",
  "Water is leaking or not draining",
  "Lights or outlets are not working",
  "I want better comfort or efficiency",
  "Something else / not sure",
] as const;
export function homeServicePath(symptom: string, system: string) {
  if (system === "Not sure") return "General service intake / staff triage";
  if (system === "Water / drains") return "Plumbing service conversation";
  if (system === "Power / lighting") return "Electrical service conversation";
  if (system === "Heating / cooling" || system === "Air / ventilation")
    return symptom === "I want better comfort or efficiency"
      ? "HVAC comfort and upgrade conversation"
      : "HVAC service conversation";
  return "General service intake / staff triage";
}
export const eventSteps: readonly RoutingStep[] = [
  {
    key: "type",
    label: "Event type",
    options: [
      "Corporate meeting",
      "Celebration",
      "Wedding-related event",
      "Brand activation",
      "Retreat",
      "Other",
    ],
  },
  {
    key: "guests",
    label: "Guest count",
    options: ["1–20", "21–50", "51–100", "101–200", "201+", "Not sure yet"],
  },
  {
    key: "format",
    label: "Desired format",
    options: [
      "Seated meal",
      "Standing reception",
      "Presentation / meeting",
      "Mixed format",
      "Help me plan",
    ],
  },
  {
    key: "spaces",
    label: "Spaces requested",
    options: [
      "Indoor gathering space",
      "Outdoor space",
      "Breakout rooms",
      "Accessible arrival / circulation",
      "Help me choose",
    ],
    multiple: true,
  },
  {
    key: "production",
    label: "Production / AV",
    options: [
      "Microphones / sound",
      "Screens / projection",
      "Stage / lighting",
      "Hybrid / livestream",
      "No AV needed",
      "Discuss requirements",
    ],
    multiple: true,
  },
  {
    key: "hospitality",
    label: "Food / beverage",
    options: [
      "Full meal",
      "Light bites",
      "Beverage service",
      "Outside catering conversation",
      "No catering needed",
      "Unsure",
    ],
    multiple: true,
  },
  {
    key: "privacy",
    label: "Privacy",
    options: [
      "Dedicated private room",
      "Full property buyout",
      "Shared property is fine",
      "Discuss options",
    ],
  },
  {
    key: "lodging",
    label: "Optional lodging",
    options: [
      "No lodging",
      "On-site lodging requested",
      "Nearby hotel coordination",
      "Not sure yet",
    ],
  },
];
export const consultationSteps: readonly RoutingStep[] = [
  {
    key: "pathway",
    label: "Pathway to discuss",
    options: [
      "Non-surgical conversation",
      "Surgical consultation",
      "Compare both with a clinician",
      "Unsure",
    ],
  },
  {
    key: "serviceLine",
    label: "Service line",
    options: [
      "Skin / aesthetics",
      "Body / plastic surgery",
      "Wellness services",
      "Multiple service lines",
      "Staff triage",
    ],
  },
  {
    key: "location",
    label: "Location preference",
    options: [
      "Closest location",
      "Specific location to discuss",
      "Flexible",
      "Virtual first",
    ],
  },
  {
    key: "provider",
    label: "Provider preference",
    options: [
      "Existing provider",
      "Request a provider",
      "First available qualified team",
      "Help me choose",
    ],
  },
  {
    key: "visit",
    label: "Visit format",
    options: [
      "In-person consultation",
      "Virtual consultation if offered",
      "Either / discuss availability",
    ],
  },
];
