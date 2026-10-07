import type { RoutingAnswers, RoutingStep } from "./lab-routing";
export const journeyStages = ["Goal", "Concern", "Treatment family", "Location / provider", "Membership / financing", "Consultation"] as const;
// Practice configuration demonstrates operational branching, not clinical matching.
export function medspaJourneySteps(answers: RoutingAnswers): readonly RoutingStep[] {
 const body = answers.goal?.includes("Explore body concerns");
 const location = answers.location?.[0];
 return [
  { key: "goal", label: "What would you like to explore?", options: ["Explore facial concerns", "Explore body concerns", "Help me find a starting point"] },
  { key: "concern", label: "Your discussion priorities", options: body ? ["Skin texture", "Firmness", "Scars", "Unsure / discuss with the team"] : ["Texture and tone", "Expression lines", "Volume and definition", "Unsure / discuss with the team"], multiple: true },
  { key: "family", label: "Treatment family you want to learn about", options: body ? ["Body treatment education", "Skin treatment education", "Help me choose with a clinician"] : ["Skin treatment education", "Injectable treatment education", "Help me choose with a clinician"] },
  { key: "location", label: "Choose a demo location", options: ["City studio", "Garden clinic", "Flexible / staff triage"] },
  { key: "provider", label: "Consultation team preference", options: location === "City studio" ? ["City consultation team", "Existing provider at City", "Help me choose"] : location === "Garden clinic" ? ["Garden consultation team", "Existing provider at Garden", "Help me choose"] : ["First available qualified team", "Help me choose"] },
  { key: "support", label: "Information to include", options: ["Membership information", "Financing information", "Both membership and financing", "No information requested"] },
  { key: "consultation", label: "How would you like to begin?", options: ["In-person consultation request", "Virtual first if offered", "Ask the team before scheduling"] },
 ];
}
export function journeyStage(index: number) { return index < 3 ? index : index < 5 ? 3 : index - 1; }
