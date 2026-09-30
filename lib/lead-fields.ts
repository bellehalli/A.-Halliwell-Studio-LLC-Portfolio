export const leadStages = ["new", "qualified", "consultation", "proposal", "negotiation", "won", "lost"] as const;
export type LeadStage = typeof leadStages[number];
export const leadStageLabels: Record<LeadStage, string> = { new: "New inquiry", qualified: "Qualified", consultation: "Consultation", proposal: "Proposal sent", negotiation: "In conversation", won: "Client confirmed", lost: "Closed" };
export type Lead = {
  consultations?: { bookingId: string; startsAt: string; endsAt: string; status: "confirmed" | "cancelled"; details: string }[];
  id: string; name: string; email: string; business: string; projectType: string; classification: string;
  needs: string[]; timing: string; investment: string; currentUrl: string; currentProblem: string; successGoal: string;
  assets: string[]; source: string; productCount: string; bookingType: string; guestPain: string;
  stage: LeadStage; notes: string; nextAction: string; followUpOn: string; projectId: string;
  createdAt: string; updatedAt: string; revision: number; studioEmailStatus: string; confirmationStatus: string;
  history: { at: string; action: string; stage?: string; by?: string; notes?: string; nextAction?: string; followUpOn?: string; name?: string; email?: string; business?: string }[];
};
export function validLeadStage(value: unknown): value is LeadStage { return typeof value === "string" && (leadStages as readonly string[]).includes(value); }
export function validFollowUpDate(value: string) {
  return value === "" || (/^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
}
export function leadInvestmentCents(value: string) {
  if (!value.trim()) return null;
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) throw new Error("Enter a valid project investment.");
  const [dollars, fraction = ""] = value.split(".");
  const cents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  if (cents <= 0) throw new Error("Enter a project investment greater than zero, or leave it blank.");
  return cents;
}
export function nextBusinessFollowUp(now = new Date()) {
  const date = new Date(now.toLocaleDateString("en-CA", { timeZone: "America/Detroit" }) + "T12:00:00Z");
  let days = 0;
  while (days < 2) { date.setUTCDate(date.getUTCDate() + 1); if (![0, 6].includes(date.getUTCDay())) days++; }
  return date.toISOString().slice(0, 10);
}
