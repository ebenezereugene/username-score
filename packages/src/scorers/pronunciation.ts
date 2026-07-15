// scorers/pronunciation.ts

import type { PronunciationMetadata } from "../extractors/types.pronunciation.js";
import type { Scorer } from "./types.js";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

// Ideal vowel ratio band for pronounceable names. Falloff outside the
// band is proportional (not a hard cliff), so a ratio just outside the
// band is barely penalized while an extreme ratio is penalized heavily.
const IDEAL_MIN_VOWEL_RATIO = 0.35;
const IDEAL_MAX_VOWEL_RATIO = 0.55;

function scoreVowelRatio(vowelRatio: number): number {
  if (
    vowelRatio >= IDEAL_MIN_VOWEL_RATIO &&
    vowelRatio <= IDEAL_MAX_VOWEL_RATIO
  ) {
    return 100;
  }
  if (vowelRatio < IDEAL_MIN_VOWEL_RATIO) {
    return clamp(100 - (IDEAL_MIN_VOWEL_RATIO - vowelRatio) * 400);
  }
  return clamp(100 - (vowelRatio - IDEAL_MAX_VOWEL_RATIO) * 300);
}

// Quadratic instead of linear: a run of 4 is mildly annoying, a run of
// 6+ is essentially unpronounceable and should approach 0, not linger
// in the 25-50 range.
function scoreConsonantRuns(longestConsonantRun: number): number {
  const excess = Math.max(0, longestConsonantRun - 3);
  return clamp(100 - excess * excess * 10);
}

// IMPOSSIBLE_TRANSITIONS is a small curated set of exotic pairs (qx, zx,
// jk, etc.) — it will never catch every unpronounceable pair, so it's
// kept as a low-weight signal rather than a primary one.
function scoreImpossibleTransitions(count: number): number {
  return clamp(100 - count * 40);
}

// commonTransitionScore (0-1) reflects the proportion of letter pairs
// that are phonetically common or natural. Unlike the impossible-pairs
// blocklist, this generalizes to unseen bad pairs — a string full of
// pairs like "tw", "hh", "gt" scores low here even though none of
// those pairs are individually blocklisted.
function scoreCommonTransitions(commonTransitionScore: number): number {
  return clamp(commonTransitionScore * 100);
}

function scoreNumbersCount(numbersCount: number): number {
  return clamp(100 - Math.min(numbersCount * 5, 30));
}

function scoreNumberInterruptions(numberInterruptions: number): number {
  return clamp(100 - numberInterruptions * 15);
}

// Requires PronunciationMetadata.separatorDensity = separatorCount / length.
// Density (not raw count) so a separator in "a_b" costs more than the
// same separator in "jonathan_smith_writes" — proportional, not flat.
function scoreSeparators(separatorDensity: number): number {
  return clamp(100 - separatorDensity * 100);
}

const WEIGHTS = {
  vowelRatio: 0.15,
  consonantRuns: 0.3,
  commonTransitions: 0.2,
  impossibleTransitions: 0.1,
  numbersCount: 0.05,
  numberInterruptions: 0.1,
  separators: 0.1,
} as const;

export const pronunciationScorer: Scorer<PronunciationMetadata> = {
  name: "pronunciation",

  score(metadata) {
    const weighted =
      scoreVowelRatio(metadata.vowelRatio) * WEIGHTS.vowelRatio +
      scoreConsonantRuns(metadata.longestConsonantRun) * WEIGHTS.consonantRuns +
      scoreCommonTransitions(metadata.commonTransitionScore) *
        WEIGHTS.commonTransitions +
      scoreImpossibleTransitions(metadata.impossibleTransitions) *
        WEIGHTS.impossibleTransitions +
      scoreNumbersCount(metadata.numbersCount) * WEIGHTS.numbersCount +
      scoreNumberInterruptions(metadata.numberInterruptions) *
        WEIGHTS.numberInterruptions +
      scoreSeparators(metadata.separatorDensity) * WEIGHTS.separators;

    return {
      score: Math.round(clamp(weighted)),
      metadata,
    };
  },
};
