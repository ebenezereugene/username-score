// extractors/index.extractors.ts

import { entropyExtractor } from "./entropy.js";
import { repetitionExtractor } from "./repetition.js";
import { pronunciationExtractor } from "./pronunciation.js";
import { dictionaryExtractor } from "./dictionary.js";
import { readabilityExtractor } from "./readability.js";

import type { ParsedUsername } from "../parser/types.js";
import type { FeatureMap } from "./types.js";

const EXTRACTORS = [
  entropyExtractor,
  repetitionExtractor,
  pronunciationExtractor,
  dictionaryExtractor,
  readabilityExtractor,
] as const;

export function extractFeatures(username: ParsedUsername): FeatureMap {
  return {
    entropy: entropyExtractor.extract(username),
    repetition: repetitionExtractor.extract(username),
    pronunciation: pronunciationExtractor.extract(username),
    dictionary: dictionaryExtractor.extract(username),
    readability: readabilityExtractor.extract(username),
  };
}

export { EXTRACTORS };
