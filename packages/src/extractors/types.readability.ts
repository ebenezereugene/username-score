export type TransitionCounts = {
  letterToDigit: number;
  digitToLetter: number;
  letterToSymbol: number;
  symbolToLetter: number;
  symbolToDigit: number;
  digitToSymbol: number;
};

export interface ReadabilityMetadata {
  totalLength: number;

  letterCount: number;
  vowelCount: number;
  consonantCount: number;

  vowelRatio: number;
  consonantRatio: number;

  consonantClusters: string[];
  longestConsonantCluster: number;
  consonantClusterCount: number;

  longestNumberCluster: number;
  numberClusterCount: number;

  longestSymbolRun: number;

  transitionCounts: TransitionCounts;

  alphabeticCoverage: number;

  // Proportion (0-1) of adjacent letter-pairs that are phonetically
  // common or natural (see COMMON_PHONETIC_TRANSITIONS / NATURAL_TRANSITIONS
  // in constants/pronunciation.constants.js). Catches strings with no long
  // runs and a fine vowel ratio, but sequences that don't occur naturally
  // — e.g. "qraquat" (qr, aq, qu are all uncommon pairs despite no single
  // run exceeding length 2).
  naturalTransitionRatio: number;
}
