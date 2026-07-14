export interface DictionaryMatch {
  word: string;
  source: string;
  start: number;
  end: number;
}

export interface DictionaryMetadata {
  matches: DictionaryMatch[];

  matchedWordCount: number;

  distinctWordCount: number;

  coverageRatio: number;

  longestMatchLength: number;

  sourceCounts: Record<string, number>;

  unmatchedFragments: string[];

  hasNameMatch: boolean;

  hasCommonWordMatch: boolean;

  hasAbbreviationMatch: boolean;

  recognizabilityScore: number;
}