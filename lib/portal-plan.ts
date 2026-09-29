export const milestoneLabels = ["Project deposit", "First concept", "Final production"] as const;

export function defaultMilestoneAmounts(total: number): [number, number, number] {
  if (!Number.isSafeInteger(total) || total < 3) return [0, 0, 0];
  const deposit = Math.min(total - 2, Math.max(1, Math.round(total / 2)));
  const concept = Math.min(total - deposit - 1, Math.max(1, Math.round(total / 4)));
  return [deposit, concept, total - deposit - concept];
}

export function projectMilestoneAmounts(project: {
  investment_cents?: number | null;
  milestone_1_cents?: number | null;
  milestone_2_cents?: number | null;
  milestone_3_cents?: number | null;
}): [number, number, number] {
  const saved = [project.milestone_1_cents, project.milestone_2_cents, project.milestone_3_cents];
  return saved.every(value => Number.isSafeInteger(value) && Number(value) > 0) && saved.reduce<number>((sum, value) => sum + Number(value), 0) === Number(project.investment_cents)
    ? saved.map(Number) as [number, number, number]
    : defaultMilestoneAmounts(Number(project.investment_cents || 0));
}
