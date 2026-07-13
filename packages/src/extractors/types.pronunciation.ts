export interface PronunciationMetadata {
  vowelCount: number;
  vowelRatio: number;
  consonantRuns: number[];
  longestConsonantRun: number;
  commonTransitionScore: number;
  impossibleTransitions: number;
  numbersCount: number;
  numberInterruptions: number;
  separatorCount: number;
  separatorDensity: number;
  estimatedSyllables: number;
  pronounceabilityScore: number;
}
