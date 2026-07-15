export interface BrandTermMatch {
  word: string;
  start: number;
  end: number;
}

export interface BrandTermsMetadata {
  matches: BrandTermMatch[];
  matchedWordCount: number;
  distinctWordCount: number;
  coverageRatio: number;
  longestMatchLength: number;
  unmatchedFragments: string[];
  recognizabilityScore: number;
}
