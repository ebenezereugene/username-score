// extractors/dictionary.ts

import type { Extractor } from "./types.js";

import {
  DICTIONARY,
  DICTIONARY_SOURCES,
  MAX_DICTIONARY_WORD_LENGTH,
} from "../dictionaries/index.dictionaries.js";

import { decodeLeetspeak } from "../normalizers/leetspeak.js";

import type {
  DictionaryMatch,
  DictionaryMetadata,
} from "./types.dictionary.js";

const MIN_MATCH_LENGTH = 3;

/**
 * Finds the longest dictionary match starting at a specific index.
 */
function findLongestMatchAt(
  segment: string,
  start: number,
): {
  word: string;
  source: string;
  length: number;
} | null {
  const maxLength = Math.min(
    segment.length - start,
    MAX_DICTIONARY_WORD_LENGTH,
  );

  for (let length = maxLength; length >= MIN_MATCH_LENGTH; length--) {
    const candidate = segment.slice(start, start + length);

    const entry = DICTIONARY.get(candidate);

    if (entry) {
      return {
        word: candidate,
        source: entry.source,
        length,
      };
    }
  }

  return null;
}

/**
 * Greedy longest-match tokenizer.
 */
function scanSegment(segment: string, offset: number): DictionaryMatch[] {
  const matches: DictionaryMatch[] = [];

  let index = 0;

  while (index < segment.length) {
    const match = findLongestMatchAt(segment, index);

    if (match) {
      matches.push({
        word: match.word,
        source: match.source,
        start: offset + index,
        end: offset + index + match.length,
      });

      index += match.length;
    } else {
      index += 1;
    }
  }

  return matches;
}

/**
 * Extract unmatched sections of a username.
 */
function extractUnmatchedFragments(
  text: string,
  matches: DictionaryMatch[],
): string[] {
  const covered = new Set<number>();

  for (const match of matches) {
    for (let i = match.start; i < match.end; i++) {
      covered.add(i);
    }
  }

  const fragments: string[] = [];

  let buffer = "";

  for (let i = 0; i < text.length; i++) {
    if (!covered.has(i)) {
      buffer += text[i];
    } else if (buffer) {
      fragments.push(buffer);

      buffer = "";
    }
  }

  if (buffer) {
    fragments.push(buffer);
  }

  return fragments;
}

export const dictionaryExtractor: Extractor<DictionaryMetadata> = {
  name: "dictionary",

  extract(username) {
    const text = decodeLeetspeak(username.normalized);

    if (!text) {
      return {
        name: this.name,

        value: 0,

        metadata: {
          matches: [],

          matchedWordCount: 0,

          distinctWordCount: 0,

          coverageRatio: 0,

          longestMatchLength: 0,

          sourceCounts: {},

          unmatchedFragments: [],

          hasNameMatch: false,

          hasCommonWordMatch: false,

          hasAbbreviationMatch: false,

          recognizabilityScore: 0,
        } satisfies DictionaryMetadata,
      };
    }

    const matches: DictionaryMatch[] = [];

    for (const segmentMatch of text.matchAll(/[a-z]+/g)) {
      const segment = segmentMatch[0];

      const offset = segmentMatch.index ?? 0;

      matches.push(...scanSegment(segment, offset));
    }

    const sourceCounts: Record<string, number> = {};

    const distinctWords = new Set(matches.map((match) => match.word));

    const coveredIndexes = new Set<number>();

    let longestMatchLength = 0;

    for (const match of matches) {
      const length = match.end - match.start;

      longestMatchLength = Math.max(longestMatchLength, length);

      sourceCounts[match.source] = (sourceCounts[match.source] ?? 0) + 1;

      for (let index = match.start; index < match.end; index++) {
        coveredIndexes.add(index);
      }
    }

    const coverageRatio =
      text.length > 0 ? coveredIndexes.size / text.length : 0;

    const unmatchedFragments = extractUnmatchedFragments(text, matches);

    const hasNameMatch = (sourceCounts[DICTIONARY_SOURCES.NAMES] ?? 0) > 0;

    const hasCommonWordMatch =
      (sourceCounts[DICTIONARY_SOURCES.COMMON_WORDS] ?? 0) > 0;

    const hasAbbreviationMatch =
      (sourceCounts[DICTIONARY_SOURCES.ABBREVIATIONS] ?? 0) > 0;

    let recognizabilityScore = 0;

    recognizabilityScore += coverageRatio * 60;

    recognizabilityScore += Math.min(distinctWords.size, 3) * 10;

    if (hasNameMatch) {
      recognizabilityScore += 10;
    }

    recognizabilityScore = Math.min(100, Math.round(recognizabilityScore));

    return {
      name: this.name,

      value: recognizabilityScore / 100,

      metadata: {
        matches,

        matchedWordCount: matches.length,

        distinctWordCount: distinctWords.size,

        coverageRatio: Math.round(coverageRatio * 100) / 100,

        longestMatchLength,

        sourceCounts,

        unmatchedFragments,

        hasNameMatch,

        hasCommonWordMatch,

        hasAbbreviationMatch,

        recognizabilityScore,
      } satisfies DictionaryMetadata,
    };
  },
};

/**
 * Convenience function.
 *
 * Allows:
 *
 * extractDictionary(parsed)
 *
 * while keeping the extractor object architecture.
 */
export function extractDictionary(
  username: Parameters<typeof dictionaryExtractor.extract>[0],
) {
  return dictionaryExtractor.extract(username);
}
