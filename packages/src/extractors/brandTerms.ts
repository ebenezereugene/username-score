// extractors/brandTerms.ts

import { decodeLeetspeak } from "../normalizers/leetspeak.js";
import type { ParsedUsername } from "../parser/types.js";
import type { BrandTermMatch, BrandTermsMetadata } from "./types.brandTerms.js";

const MIN_MATCH_LENGTH = 2; // shorter than dictionary's 3 — brand names like "kai" are often short

function buildBrandWordSet(customWords: string[]): Set<string> {
  const words = new Set<string>();

  for (const word of customWords) {
    const normalized = word.toLowerCase().trim();

    if (normalized.length >= MIN_MATCH_LENGTH) {
      words.add(normalized);
    }
  }

  return words;
}

function findLongestMatchAt(
  segment: string,
  start: number,
  words: Set<string>,
  maxWordLength: number,
): { word: string; length: number } | null {
  const maxLength = Math.min(segment.length - start, maxWordLength);

  for (let length = maxLength; length >= MIN_MATCH_LENGTH; length--) {
    const candidate = segment.slice(start, start + length);

    if (words.has(candidate)) {
      return { word: candidate, length };
    }
  }

  return null;
}

function scanSegment(
  segment: string,
  offset: number,
  words: Set<string>,
  maxWordLength: number,
): BrandTermMatch[] {
  const matches: BrandTermMatch[] = [];

  let index = 0;

  while (index < segment.length) {
    const match = findLongestMatchAt(segment, index, words, maxWordLength);

    if (match) {
      matches.push({
        word: match.word,
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

function extractUnmatchedFragments(
  text: string,
  matches: BrandTermMatch[],
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

/**
 * Unlike the standard extractors, brandTerms depends on a dev-supplied
 * word list and can't conform to the single-argument Extractor<T>
 * interface. It's not part of EXTRACTORS/FeatureMap — scoreUsername
 * calls it directly, and only when customWords is non-empty.
 */
export function extractBrandTerms(
  username: ParsedUsername,
  customWords: string[],
): { name: "brandTerms"; metadata: BrandTermsMetadata } {
  const text = decodeLeetspeak(username.normalized);

  if (!text || customWords.length === 0) {
    return {
      name: "brandTerms",
      metadata: {
        matches: [],
        matchedWordCount: 0,
        distinctWordCount: 0,
        coverageRatio: 0,
        longestMatchLength: 0,
        unmatchedFragments: [],
        recognizabilityScore: 0,
      } satisfies BrandTermsMetadata,
    };
  }

  const words = buildBrandWordSet(customWords);

  const maxWordLength = Math.max(
    0,
    ...Array.from(words, (word) => word.length),
  );

  const matches: BrandTermMatch[] = [];

  for (const segmentMatch of text.matchAll(/[a-z]+/g)) {
    const segment = segmentMatch[0];

    const offset = segmentMatch.index ?? 0;

    matches.push(...scanSegment(segment, offset, words, maxWordLength));
  }

  const distinctWords = new Set(matches.map((match) => match.word));

  const coveredIndexes = new Set<number>();

  let longestMatchLength = 0;

  for (const match of matches) {
    const length = match.end - match.start;

    longestMatchLength = Math.max(longestMatchLength, length);

    for (let index = match.start; index < match.end; index++) {
      coveredIndexes.add(index);
    }
  }

  const coverageRatio = text.length > 0 ? coveredIndexes.size / text.length : 0;

  const unmatchedFragments = extractUnmatchedFragments(text, matches);

  let recognizabilityScore = 0;

  recognizabilityScore += coverageRatio * 70;
  recognizabilityScore += Math.min(distinctWords.size, 3) * 10;
  recognizabilityScore = Math.min(100, Math.round(recognizabilityScore));

  return {
    name: "brandTerms",
    metadata: {
      matches,
      matchedWordCount: matches.length,
      distinctWordCount: distinctWords.size,
      coverageRatio: Math.round(coverageRatio * 100) / 100,
      longestMatchLength,
      unmatchedFragments,
      recognizabilityScore,
    } satisfies BrandTermsMetadata,
  };
}
