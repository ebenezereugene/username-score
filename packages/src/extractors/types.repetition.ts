// extractors/types.repetition.ts

export interface CharacterRun {
  character: string;
  length: number;
}

export interface RepetitionMetadata {
  characterRuns: CharacterRun[];

  repeatedSequences: string[];

  repeatedCharacterCount: number;
  repeatedSequenceCount: number;

  longestCharacterRun: number;
  longestRepeatedSequence: number;
}
