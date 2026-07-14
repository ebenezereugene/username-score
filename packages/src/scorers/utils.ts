export type ScoreTier = "poor" | "fair" | "good" | "excellent";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}
