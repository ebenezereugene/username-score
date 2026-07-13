// extractors/repetition.ts

import {
  CHARACTER_RUN_PATTERN,
  REPEATED_SEQUENCE_PATTERN,
} from "../constants/repetition.constants.js";
import type { Extractor } from "./types.js";
import type { CharacterRun, RepetitionMetadata } from "./types.repetition.js";

function collectMatches(pattern: RegExp, text: string): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];

  pattern.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    matches.push(match);
  }

  return matches;
}

function findCharacterRuns(text: string): CharacterRun[] {
  const runs: CharacterRun[] = [];

  for (const match of collectMatches(CHARACTER_RUN_PATTERN, text)) {
    const character = match[1];
    const sequence = match[0];

    if (!character || !sequence) {
      continue;
    }

    runs.push({
      character,
      length: sequence.length,
    });
  }

  return runs;
}

function findRepeatedSequences(text: string): string[] {
  const sequences: string[] = [];

  for (const match of collectMatches(REPEATED_SEQUENCE_PATTERN, text)) {
    const sequence = match[1];

    if (!sequence) {
      continue;
    }

    // Avoid duplicate signals like "aaa"
    // since characterRuns already detects them.
    if (new Set(sequence).size === 1) {
      continue;
    }

    sequences.push(sequence);
  }

  return Array.from(new Set(sequences));
}

function getLongestCharacterRun(runs: CharacterRun[]): number {
  return runs.reduce((max, run) => Math.max(max, run.length), 0);
}

function getLongestRepeatedSequence(sequences: string[]): number {
  return sequences.reduce((max, sequence) => Math.max(max, sequence.length), 0);
}

export const repetitionExtractor: Extractor<RepetitionMetadata> = {
  name: "repetition",

  extract(username) {
    const text = username.normalized;

    const characterRuns = findCharacterRuns(text);
    const repeatedSequences = findRepeatedSequences(text);

    return {
      name: this.name,

      metadata: {
        characterRuns,
        repeatedSequences,

        repeatedCharacterCount: characterRuns.length,
        repeatedSequenceCount: repeatedSequences.length,

        longestCharacterRun: getLongestCharacterRun(characterRuns),
        longestRepeatedSequence: getLongestRepeatedSequence(repeatedSequences),
      },
    };
  },
};
