// extractors/types.ts

import type { ParsedUsername } from "../parser/types.js";

export interface UsernameFeature<TMetadata = unknown> {
  name: string;
  metadata: TMetadata;
}

export interface Extractor<TMetadata = unknown> {
  name: string;

  extract(username: ParsedUsername): UsernameFeature<TMetadata>;
}
