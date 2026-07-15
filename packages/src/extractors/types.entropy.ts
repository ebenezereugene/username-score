// extractors/types.entropy.ts

export type EntropyTier = "low" | "medium" | "high";

export interface EntropyMetadata {
  entropy: number;
  entropyDensity: number;
  entropyTier: EntropyTier;
  uniqueCharacterCount: number;
  uniqueCharacterRatio: number;
  confidence: number;
}
