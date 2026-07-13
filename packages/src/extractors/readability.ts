// extractors/readability.ts

import {
  CONSONANT_CLUSTER_REGEX,
  CONSONANT_REGEX,
  NUMBER_CLUSTER_REGEX,
  SYMBOL_RUN_REGEX,
  VOWEL_REGEX,
} from "../constants/readability.constants.js";
import { isDigit, isLetter, isSymbol } from "../utils/character.js";
import type { Extractor } from "./types.js";
import type {
  ReadabilityMetadata,
  TransitionCounts,
} from "./types.readability.js";

export const readabilityExtractor: Extractor<ReadabilityMetadata> = {
  name: "readability",

  extract(username) {
    const text = username.normalized;
    const totalLength = text.length;

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
        } satisfies ReadabilityMetadata,
      };
    }

    // ----------------------------------------
    // Character counts
    // ----------------------------------------

    const vowelCount = (text.match(VOWEL_REGEX) ?? []).length;
    const consonantCount = (text.match(CONSONANT_REGEX) ?? []).length;

    const letterCount = vowelCount + consonantCount;

    const vowelRatio = letterCount > 0 ? vowelCount / letterCount : 0;
    const consonantRatio = letterCount > 0 ? consonantCount / letterCount : 0;

    // ----------------------------------------
    // Consonant clusters
    // ----------------------------------------

    const consonantClusters = text.match(CONSONANT_CLUSTER_REGEX) ?? [];

    const longestConsonantCluster = consonantClusters.reduce(
      (max, cluster) => Math.max(max, cluster.length),
      0,
    );

    // ----------------------------------------
    // Number clusters
    // ----------------------------------------

    const numberClusters = text.match(NUMBER_CLUSTER_REGEX) ?? [];

    const longestNumberCluster = numberClusters.reduce(
      (max, cluster) => Math.max(max, cluster.length),
      0,
    );

    // ----------------------------------------
    // Symbol runs
    // ----------------------------------------

    const symbolRuns = text.match(SYMBOL_RUN_REGEX) ?? [];

    const longestSymbolRun = symbolRuns.reduce(
      (max, run) => Math.max(max, run.length),
      0,
    );

    // ----------------------------------------
    // Character transitions
    // ----------------------------------------

    const transitionCounts: TransitionCounts = {
      letterToDigit: 0,
      digitToLetter: 0,
      letterToSymbol: 0,
      symbolToLetter: 0,
      symbolToDigit: 0,
      digitToSymbol: 0,
    };

    for (let i = 0; i < text.length - 1; i++) {
      const current = text.charAt(i);
      const next = text.charAt(i + 1);

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
    // Alphabetic coverage
    // ----------------------------------------

    const alphabeticCoverage = totalLength > 0 ? letterCount / totalLength : 0;

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
      } satisfies ReadabilityMetadata,
    };
  },
};
