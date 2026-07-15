// extractors/types.ts (relevant excerpt)

import type { ParsedUsername } from "../parser/types.js";
import type { EntropyMetadata } from "./types.entropy.js";
import type { DictionaryMetadata } from "./types.dictionary.js";
import type { PronunciationMetadata } from "./types.pronunciation.js";
import type { RepetitionMetadata } from "./types.repetition.js";
import type { ReadabilityMetadata } from "./types.readability.js";

export interface UsernameFeature<TMetadata = unknown> {
  name: string;
  metadata: TMetadata;
}

export interface Extractor<TMetadata = unknown> {
  name: string;
  extract(username: ParsedUsername): UsernameFeature<TMetadata>;
}

export interface FeatureMap {
  dictionary: UsernameFeature<DictionaryMetadata>;
  pronunciation: UsernameFeature<PronunciationMetadata>;
  entropy: UsernameFeature<EntropyMetadata>;
  repetition: UsernameFeature<RepetitionMetadata>;
  readability: UsernameFeature<ReadabilityMetadata>;
}
