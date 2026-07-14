// scorers/pronunciation.ts

import type { PronunciationMetadata } from "../extractors/types.pronunciation.js";
import type { Scorer } from "./types.js";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

function scoreVowelRatio(vowelRatio: number): number {
  if (vowelRatio < 0.2) {
    return clamp(100 - (0.2 - vowelRatio) * 500);
  }
  if (vowelRatio > 0.6) {
    return clamp(100 - (vowelRatio - 0.6) * 300);
  }
  return 100;
}

function scoreConsonantRuns(longestConsonantRun: number): number {
  return clamp(100 - Math.max(0, longestConsonantRun - 3) * 25);
}

function scoreImpossibleTransitions(count: number): number {
  return clamp(100 - count * 40);
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
  vowelRatio: 0.2,
  consonantRuns: 0.25,
  impossibleTransitions: 0.25,
  numbersCount: 0.05,
  numberInterruptions: 0.1,
  separators: 0.15,
} as const;

export const pronunciationScorer: Scorer<PronunciationMetadata> = {
  name: "pronunciation",

  score(metadata) {
    const weighted =
      scoreVowelRatio(metadata.vowelRatio) * WEIGHTS.vowelRatio +
      scoreConsonantRuns(metadata.longestConsonantRun) * WEIGHTS.consonantRuns +
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
