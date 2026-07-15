// pipeline/scoreUsername.ts

import { extractFeatures } from "../extractors/index.extractors.js";
import { extractBrandTerms } from "../extractors/brandTerms.js";

import {
  dictionaryScorer,
  pronunciationScorer,
  entropyScorer,
  lengthScorer,
  readabilityScorer,
} from "../scorers/index.scorers.js";
import { brandTermsScorer } from "../scorers/brandTerms.js";

import type { ParsedUsername } from "../parser/types.js";
import type { ScorerResult } from "../engine/types.js";

export function scoreUsername(
  username: ParsedUsername,
  customWords: string[] = [],
): ScorerResult[] {
  const features = extractFeatures(username);

  const lengthResult = lengthScorer.score({
    length: username.normalized.length,
  });

  const dictionaryResult = dictionaryScorer.score(features.dictionary.metadata);
  const pronunciationResult = pronunciationScorer.score(
    features.pronunciation.metadata,
  );
  const entropyResult = entropyScorer.score(features.entropy.metadata);
  const readabilityResult = readabilityScorer.score(
    features.readability.metadata,
  );

  const results: ScorerResult[] = [
    { name: lengthScorer.name, score: lengthResult.score },
    { name: dictionaryScorer.name, score: dictionaryResult.score },
    { name: pronunciationScorer.name, score: pronunciationResult.score },
    { name: entropyScorer.name, score: entropyResult.score },
    { name: readabilityScorer.name, score: readabilityResult.score },
  ];

  if (customWords.length > 0) {
    const brandFeature = extractBrandTerms(username, customWords);
    const brandResult = brandTermsScorer.score(brandFeature.metadata);

    results.push({ name: brandTermsScorer.name, score: brandResult.score });
  }

  return results;
}
