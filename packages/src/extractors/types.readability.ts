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
}
