// extractors/pronunciation.ts

import {
  COMMON_PHONETIC_TRANSITIONS,
  CONSONANTS,
  IMPOSSIBLE_TRANSITIONS,
  NATURAL_TRANSITIONS,
  SEPARATORS,
  VOWELS,
} from "../constants/pronunciation.constants.js";
import type { Extractor } from "./types.js";
import type { PronunciationMetadata } from "./types.pronunciation.js";



function isLetter(char: string | undefined): boolean {
  return char !== undefined && (VOWELS.has(char) || CONSONANTS.has(char));
}

export const pronunciationExtractor: Extractor<PronunciationMetadata> = {
  name: "pronunciation",

  extract(username) {
    const text = username.normalized;
    const totalLength = text.length;

    if (totalLength === 0) {
      return {
        name: this.name,
        value: 0,
        metadata: {
          vowelCount: 0,
          vowelRatio: 0,
          consonantRuns: [],
          longestConsonantRun: 0,
          commonTransitionScore: 0,
          impossibleTransitions: 0,
          numbersCount: 0,
          numberInterruptions: 0,
          separatorCount: 0,
          separatorDensity: 0,
          estimatedSyllables: 0,
          pronounceabilityScore: 0,
        } satisfies PronunciationMetadata,
      };
    }

    // ==========================================
    // PHASE 1 — Basic Signals
    // ==========================================

    let vowelCount = 0;
    let letterCount = 0;
    let separatorCount = 0;

    const consonantRuns: number[] = [];
    let currentConsonantRun = 0;

    for (let i = 0; i < totalLength; i++) {
      const char = text.charAt(i);

      if (VOWELS.has(char)) {
        vowelCount++;
        letterCount++;

        if (currentConsonantRun > 0) {
          consonantRuns.push(currentConsonantRun);
          currentConsonantRun = 0;
        }
      } else if (CONSONANTS.has(char)) {
        letterCount++;
        currentConsonantRun++;
      } else {
        if (currentConsonantRun > 0) {
          consonantRuns.push(currentConsonantRun);
          currentConsonantRun = 0;
        }

        if (SEPARATORS.has(char)) {
          separatorCount++;
        }
      }
    }

    if (currentConsonantRun > 0) {
      consonantRuns.push(currentConsonantRun);
    }

    const vowelRatio = letterCount > 0 ? vowelCount / letterCount : 0;

    const longestConsonantRun =
      consonantRuns.length > 0 ? Math.max(...consonantRuns) : 0;

    const separatorDensity = totalLength > 0 ? separatorCount / totalLength : 0;

    // ==========================================
    // Numbers — evaluate runs
    // ==========================================

    const numbersCount = (text.match(/\d/g) ?? []).length;

    let numberInterruptions = 0;

    for (const match of text.matchAll(/\d+/g)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      const before = text[start - 1];
      const after = text[end];

      if (isLetter(before) && isLetter(after)) {
        numberInterruptions++;
      }
    }

    // ==========================================
    // PHASE 2 — Phonetic Patterns
    // ==========================================

    let transitionScore: number = 0;
    let totalLetterPairs = 0;
    let impossibleTransitions = 0;

    for (let i = 0; i < totalLength - 1; i++) {
      const first = text.charAt(i);
      const second = text.charAt(i + 1);

      if (!isLetter(first) || !isLetter(second)) {
        continue;
      }

      const pair = `${first}${second}`;

      totalLetterPairs++;

      if (COMMON_PHONETIC_TRANSITIONS.has(pair)) {
        transitionScore += 1;
      } else if (NATURAL_TRANSITIONS.has(pair)) {
        transitionScore += 0.5;
      }

      if (IMPOSSIBLE_TRANSITIONS.has(pair)) {
        impossibleTransitions++;
      }
    }

    const commonTransitionScore =
      totalLetterPairs > 0
        ? Math.min(1, transitionScore / totalLetterPairs)
        : 1;

    // ==========================================
    // Syllable Estimation
    // ==========================================

    const lettersOnly = text.replace(/[^a-z]/gi, "");

    const vowelGroups = lettersOnly.match(/[aeiouy]+/g) ?? [];

    const estimatedSyllables = vowelGroups.length;

    // ==========================================
    // PHASE 3 — Score
    // ==========================================

    let baseScore = 100;

    if (letterCount > 0 && vowelRatio === 0) {
      baseScore -= 40;
    } else if (vowelRatio < 0.25 || vowelRatio > 0.65) {
      baseScore -= 20;
    }

    if (longestConsonantRun >= 5) {
      baseScore -= 35;
    } else if (longestConsonantRun >= 4) {
      baseScore -= 20;
    } else if (longestConsonantRun === 3) {
      baseScore -= 5;
    }

    baseScore -= (1 - commonTransitionScore) * 15;

    baseScore -= impossibleTransitions * 25;

    baseScore -= numberInterruptions * 25;

    if (numbersCount > 0 && numberInterruptions === 0) {
      baseScore -= 10;
    }

    if (separatorDensity > 0.3) {
      baseScore -= 30;
    } else if (separatorCount > 0) {
      baseScore -= 5;
    }

    const pronounceabilityScore = Math.max(
      0,
      Math.min(100, Math.round(baseScore)),
    );

    return {
      name: this.name,

      value: pronounceabilityScore / 100,

      metadata: {
        vowelCount,

        vowelRatio: Math.round(vowelRatio * 100) / 100,

        consonantRuns,

        longestConsonantRun,

        commonTransitionScore: Math.round(commonTransitionScore * 100) / 100,

        impossibleTransitions,

        numbersCount,

        numberInterruptions,

        separatorCount,

        separatorDensity: Math.round(separatorDensity * 100) / 100,

        estimatedSyllables,

        pronounceabilityScore,
      } satisfies PronunciationMetadata,
    };
  },
};
