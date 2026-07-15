// extractors/readability.ts

import {
  CONSONANT_CLUSTER_REGEX,
  CONSONANT_REGEX,
  NUMBER_CLUSTER_REGEX,
  SYMBOL_RUN_REGEX,
  VOWEL_REGEX,
} from "../constants/readability.constants.js";
import {
  COMMON_PHONETIC_TRANSITIONS,
  NATURAL_TRANSITIONS,
} from "../constants/pronunciation.constants.js";
import { decodeLeetspeak } from "../normalizers/leetspeak.js";
import { isDigit, isLetter, isSymbol } from "../utils/character.js";
import type { Extractor } from "./types.js";
import type {
  ReadabilityMetadata,
  TransitionCounts,
} from "./types.readability.js";

export const readabilityExtractor: Extractor<ReadabilityMetadata> = {
  name: "readability",

  extract(username) {
    const rawText = username.normalized;
    const decodedText = decodeLeetspeak(rawText);
    const totalLength = rawText.length;

    if (totalLength === 0) {
      return {
        name: this.name,
        metadata: {
          totalLength: 0,

          letterCount: 0,
          vowelCount: 0,
          consonantCount: 0,

          vowelRatio: 0,
          consonantRatio: 0,

          consonantClusters: [],
          longestConsonantCluster: 0,
          consonantClusterCount: 0,

          longestNumberCluster: 0,
          numberClusterCount: 0,

          longestSymbolRun: 0,

          transitionCounts: {
            letterToDigit: 0,
            digitToLetter: 0,
            letterToSymbol: 0,
            symbolToLetter: 0,
            symbolToDigit: 0,
            digitToSymbol: 0,
          },

          alphabeticCoverage: 0,

          naturalTransitionRatio: 1,
        } satisfies ReadabilityMetadata,
      };
    }

    // ----------------------------------------
    // Character counts (decoded text — "bl00d"
    // is measured as "blood" phonetically)
    // ----------------------------------------

    const vowelCount = (decodedText.match(VOWEL_REGEX) ?? []).length;
    const consonantCount = (decodedText.match(CONSONANT_REGEX) ?? []).length;

    const letterCount = vowelCount + consonantCount;

    const vowelRatio = letterCount > 0 ? vowelCount / letterCount : 0;
    const consonantRatio = letterCount > 0 ? consonantCount / letterCount : 0;

    // ----------------------------------------
    // Consonant clusters (decoded text)
    // ----------------------------------------

    const consonantClusters = decodedText.match(CONSONANT_CLUSTER_REGEX) ?? [];

    const longestConsonantCluster = consonantClusters.reduce(
      (max, cluster) => Math.max(max, cluster.length),
      0,
    );

    // ----------------------------------------
    // Number clusters (raw text — preserves
    // detection of bolted-on random digits like
    // "john38291", which leetspeak-decoding would
    // otherwise hide)
    // ----------------------------------------

    const numberClusters = rawText.match(NUMBER_CLUSTER_REGEX) ?? [];

    const longestNumberCluster = numberClusters.reduce(
      (max, cluster) => Math.max(max, cluster.length),
      0,
    );

    // ----------------------------------------
    // Symbol runs (raw text)
    // ----------------------------------------

    const symbolRuns = rawText.match(SYMBOL_RUN_REGEX) ?? [];

    const longestSymbolRun = symbolRuns.reduce(
      (max, run) => Math.max(max, run.length),
      0,
    );

    // ----------------------------------------
    // Character transitions (raw text — digit
    // adjacency needs real digits, not decoded
    // letters)
    // ----------------------------------------

    const transitionCounts: TransitionCounts = {
      letterToDigit: 0,
      digitToLetter: 0,
      letterToSymbol: 0,
      symbolToLetter: 0,
      symbolToDigit: 0,
      digitToSymbol: 0,
    };

    for (let i = 0; i < rawText.length - 1; i++) {
      const current = rawText.charAt(i);
      const next = rawText.charAt(i + 1);

      if (isLetter(current) && isDigit(next)) {
        transitionCounts.letterToDigit++;
      } else if (isDigit(current) && isLetter(next)) {
        transitionCounts.digitToLetter++;
      } else if (isLetter(current) && isSymbol(next)) {
        transitionCounts.letterToSymbol++;
      } else if (isSymbol(current) && isLetter(next)) {
        transitionCounts.symbolToLetter++;
      } else if (isSymbol(current) && isDigit(next)) {
        transitionCounts.symbolToDigit++;
      } else if (isDigit(current) && isSymbol(next)) {
        transitionCounts.digitToSymbol++;
      }
    }

    // ----------------------------------------
    // Natural letter-pair transitions (decoded
    // text — same logic as pronunciationExtractor's
    // commonTransitionScore)
    // ----------------------------------------

    let naturalTransitionScore = 0;
    let totalLetterPairs = 0;

    for (let i = 0; i < decodedText.length - 1; i++) {
      const first = decodedText.charAt(i);
      const second = decodedText.charAt(i + 1);

      if (!isLetter(first) || !isLetter(second)) {
        continue;
      }

      const pair = `${first}${second}`;

      totalLetterPairs++;

      if (COMMON_PHONETIC_TRANSITIONS.has(pair)) {
        naturalTransitionScore += 1;
      } else if (NATURAL_TRANSITIONS.has(pair)) {
        naturalTransitionScore += 0.5;
      }
    }

    const naturalTransitionRatio =
      totalLetterPairs > 0
        ? Math.min(1, naturalTransitionScore / totalLetterPairs)
        : 1;

    // ----------------------------------------
    // Alphabetic coverage (raw text, deliberately
    // NOT decoded — digits still count against
    // coverage even if leetspeak-decodable, so
    // "john38291" keeps its low coverage signal)
    // ----------------------------------------

    const rawLetterCount =
      (rawText.match(VOWEL_REGEX) ?? []).length +
      (rawText.match(CONSONANT_REGEX) ?? []).length;

    const alphabeticCoverage =
      totalLength > 0 ? rawLetterCount / totalLength : 0;

    return {
      name: this.name,
      metadata: {
        totalLength,

        letterCount,
        vowelCount,
        consonantCount,

        vowelRatio,
        consonantRatio,

        consonantClusters,
        longestConsonantCluster,
        consonantClusterCount: consonantClusters.length,

        longestNumberCluster,
        numberClusterCount: numberClusters.length,

        longestSymbolRun,

        transitionCounts,

        alphabeticCoverage,

        naturalTransitionRatio: Math.round(naturalTransitionRatio * 100) / 100,
      } satisfies ReadabilityMetadata,
    };
  },
};
