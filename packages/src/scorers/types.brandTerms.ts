//scorers/types.brandTerms.ts

export interface BrandTermsScoreMetadata {
  hasBrandMatch: boolean;
  matchedWordCount: number;
  coverageRatio: number;
  recognizabilityScore: number;
}