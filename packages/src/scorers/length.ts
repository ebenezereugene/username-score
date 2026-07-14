// scorers/length.ts

import type { ParsedUsername } from "../parser/types.js";
import { IDEAL_MAX, IDEAL_MIN, LENGTH_SCORES, MAX_REASONABLE_LENGTH, REASONS, TAIL_START_LENGTH, VERY_SHORT_LENGTHS } from "./ constants.length.js";
import type { ScoreResult } from "./types.js";

import { clampScore, getScoreTier, type ScoreTier } from "./utils.js";

export interface LengthScoreMetadata {
  length: number;
  idealRange: boolean;
  deviation: number;
  tier: ScoreTier;
}
    

function getExplicitScore(length: number): number {
  const score = LENGTH_SCORES[length];

  if (score === undefined) {
    throw new Error(`No explicit score exists for username length ${length}.`);
  }

  return score;
}

/**
 * Continues the scoring curve beyond the final explicit score.
 */
function tailDecayScore(length: number): number {
  const tailStartScore = getExplicitScore(TAIL_START_LENGTH);

  const slope = tailStartScore / (MAX_REASONABLE_LENGTH - TAIL_START_LENGTH);

  const score = tailStartScore - (length - TAIL_START_LENGTH) * slope;

  return Math.round(Math.max(0, score));
}

export function scoreLength(
  username: ParsedUsername,
): ScoreResult<LengthScoreMetadata> {
  const length = username.length;

  const reasons: string[] = [];

  let deviation = 0;

  if (length < IDEAL_MIN) {
    deviation = IDEAL_MIN - length;
  } else if (length > IDEAL_MAX) {
    deviation = length - IDEAL_MAX;
  }

  const idealRange = deviation === 0;

  let score: number;

  if (length <= 2) {
    score = 0;
    reasons.push(REASONS.tooShort);
  } else if (idealRange) {
    score = 100;
    reasons.push(REASONS.ideal, REASONS.memorable);
  } else if (VERY_SHORT_LENGTHS.has(length)) {
    score = getExplicitScore(length);
    reasons.push(REASONS.veryShort);
  } else if (length in LENGTH_SCORES) {
    score = getExplicitScore(length);

    if (length < IDEAL_MIN) {
      reasons.push(REASONS.short);
    } else {
      reasons.push(REASONS.long);
    }
  } else {
    score = tailDecayScore(length);
    reasons.push(REASONS.tooLong);
  }

  score = clampScore(score);

  return {
    name: "length",
    score,
    confidence: 1,
    reasons,
    metadata: {
      length,
      idealRange,
      deviation,
      tier: getScoreTier(score),
    },
  };
}
