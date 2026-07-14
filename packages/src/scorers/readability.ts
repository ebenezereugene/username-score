import type { Scorer } from "./types.js";
import type { ReadabilityMetadata } from "../extractors/types.readability.js";
import type { ReadabilityScoreMetadata } from "./types.readability.js";

import {
  ALPHABETIC_COVERAGE_BONUS,
  BASE_SCORE,
  CLUSTER_PENALTY,
  HIGH_ALPHABETIC_COVERAGE,
  IDEAL_MAX_VOWEL_RATIO,
  IDEAL_MIN_VOWEL_RATIO,
  NUMBER_PENALTY,
  SYMBOL_PENALTY,
  TRANSITION_PENALTY,
  VOWEL_BALANCE_BONUS,
} from "./constants.readability.js";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateConfidence(metadata: ReadabilityMetadata): number {
  if (metadata.totalLength === 0) {
    return 0;
  }

  // Confidence increases when we have enough characters
  // to make a meaningful readability judgment.
  const lengthConfidence = Math.min(metadata.totalLength / 10, 1);

  return Number(lengthConfidence.toFixed(2));
}

export const readabilityScorer: Scorer<
  ReadabilityMetadata,
  ReadabilityScoreMetadata
> = {
  name: "readability",

  score(metadata) {
    // -----------------------------
    // Penalties
    // -----------------------------

    const consonantClusterPenalty =
      Math.max(0, metadata.longestConsonantCluster - 2) * CLUSTER_PENALTY;

    const numberPenalty =
      metadata.numberClusterCount *
      Math.min(metadata.longestNumberCluster, 3) *
      NUMBER_PENALTY;

    const symbolPenalty = metadata.longestSymbolRun * SYMBOL_PENALTY;

    const totalTransitions = Object.values(metadata.transitionCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    const transitionPenalty = totalTransitions * TRANSITION_PENALTY;

    // -----------------------------
    // Bonuses
    // -----------------------------

    const hasBalancedVowels =
      metadata.vowelRatio >= IDEAL_MIN_VOWEL_RATIO &&
      metadata.vowelRatio <= IDEAL_MAX_VOWEL_RATIO;

    const vowelBalanceBonus = hasBalancedVowels ? VOWEL_BALANCE_BONUS : 0;

    const hasHighAlphabeticCoverage =
      metadata.alphabeticCoverage >= HIGH_ALPHABETIC_COVERAGE;

    const alphabeticCoverageBonus = hasHighAlphabeticCoverage
      ? ALPHABETIC_COVERAGE_BONUS
      : 0;

    // -----------------------------
    // Final score
    // -----------------------------

    const totalPenalties =
      consonantClusterPenalty +
      numberPenalty +
      symbolPenalty +
      transitionPenalty;

    const totalBonuses = vowelBalanceBonus + alphabeticCoverageBonus;

    const score = clampScore(BASE_SCORE - totalPenalties + totalBonuses);

    // -----------------------------
    // Explainability
    // -----------------------------

    const reasons: string[] = [];

    if (hasBalancedVowels) {
      reasons.push("Good vowel balance");
    } else {
      reasons.push("Unbalanced vowel distribution");
    }

    if (hasHighAlphabeticCoverage) {
      reasons.push("Mostly alphabetic characters");
    }

    if (consonantClusterPenalty > 0) {
      reasons.push("Contains difficult consonant clusters");
    }

    if (numberPenalty > 0) {
      reasons.push("Contains number interruptions");
    }

    if (symbolPenalty > 0) {
      reasons.push("Contains symbols that reduce readability");
    }

    if (transitionPenalty > 0) {
      reasons.push("Contains mixed character transitions");
    }

    return {
      score,

      confidence: calculateConfidence(metadata),

      reasons,

      metadata: {
        penalties: {
          consonantClusterPenalty,
          numberPenalty,
          symbolPenalty,
          transitionPenalty,
        },

        bonuses: {
          vowelBalanceBonus,
          alphabeticCoverageBonus,
        },

        finalScore: score,
      },
    };
  },
};
