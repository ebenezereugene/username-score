// extractors/index.extractors.ts

import { entropyExtractor } from "./entropy.js";
import { repetitionExtractor } from "./repetition.js";
import { pronunciationExtractor } from "./pronunciation.js";
import { dictionaryExtractor } from "./dictionary.js";

import type { ParsedUsername } from "../parser/types.js";

const EXTRACTORS = [
  entropyExtractor,
  repetitionExtractor,
  pronunciationExtractor,
  dictionaryExtractor,
] as const;

export function extractFeatures(username: ParsedUsername) {
  const features = EXTRACTORS.map((extractor) => extractor.extract(username));

  return Object.fromEntries(features.map((feature) => [feature.name, feature]));
}

export { EXTRACTORS };