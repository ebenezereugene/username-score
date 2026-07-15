// engine/pillars.ts

import type { ScorerResult } from "./types.js";

const SCARCITY_WEIGHTS: Record<string, number> = {
  length: 0.5,
  entropy: 0.5,
};

const FLUENCY_WEIGHTS: Record<string, number> = {
  pronunciation: 0.5,
  readability: 0.5,
};

function weightedAverage(
  results: ScorerResult[],
  weights: Record<string, number>,
): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const [name, weight] of Object.entries(weights)) {
    const result = results.find((r) => r.name === name);

    if (!result) continue;

    weightedSum += result.score * weight;
    weightTotal += weight;
  }

  return weightTotal > 0 ? weightedSum / weightTotal : 0;
}

export interface PillarBreakdown {
  total: number;
  pillars: {
    scarcity: number;
    fluency: number;
    brandability: number;
  };
}

/**
 * Value = Scarcity × Fluency × Brandability
 *
 * Each pillar is a weighted average of its sub-scorers (0-100).
 * Brandability = MAX(dictionary, brandTerms) — best signal wins, and
 * an absent/unmatched brandTerms signal (score 0) simply loses to
 * dictionary rather than dragging Brandability down.
 */

export function combinePillars(results: ScorerResult[]): PillarBreakdown {
  const scarcity = weightedAverage(results, SCARCITY_WEIGHTS);
  const fluency = weightedAverage(results, FLUENCY_WEIGHTS);

  const dictionaryScore =
    results.find((r) => r.name === "dictionary")?.score ?? 0;

  const brandTermsScore =
    results.find((r) => r.name === "brandTerms")?.score ?? 0;

  const brandability = Math.max(dictionaryScore, brandTermsScore);

  const total =
    Math.cbrt((scarcity / 100) * (fluency / 100) * (brandability / 100)) * 100;

  return {
    total: Math.round(total * 100) / 100,
    pillars: {
      scarcity: Math.round(scarcity * 100) / 100,
      fluency: Math.round(fluency * 100) / 100,
      brandability: Math.round(brandability * 100) / 100,
    },
  };
}
