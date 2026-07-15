// engine/score.ts

import { buildComponents, combineScores } from "./combine.js";

import type { ScoreBreakdown, ScoreWeights, ScorerResult } from "./types.js";

/**
 * Scores a username by combining
 * normalized scorer results using
 * the supplied weight configuration.
 *
 * Example:
 *
 * const result = score(
 *   [
 *     { name: "length", score: 82 },
 *     { name: "entropy", score: 91 },
 *     { name: "dictionary", score: 75 }
 *   ],
 *   {
 *     length: 0.3,
 *     entropy: 0.4,
 *     dictionary: 0.3
 *   }
 * );
 */
export function score(
  results: ScorerResult[],
  weights: ScoreWeights,
): ScoreBreakdown {
  const components = buildComponents(results, weights);

  const total = combineScores(components);

  return {
    total: Math.round(total * 100) / 100,
    components,
  };
}
