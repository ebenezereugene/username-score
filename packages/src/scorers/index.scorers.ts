// scorers/index.scorers.ts

import { lengthScorer } from "./length.js";
import { entropyScorer } from "./entropy.js";
import { pronunciationScorer } from "./pronunciation.js";
import { dictionaryScorer } from "./dictionary.js";
import { readabilityScorer } from "./readability.js";

export const SCORERS = [
  lengthScorer,
  entropyScorer,
  pronunciationScorer,
  dictionaryScorer,
  readabilityScorer,
] as const;

export {
  lengthScorer,
  entropyScorer,
  pronunciationScorer,
  dictionaryScorer,
  readabilityScorer,
};
