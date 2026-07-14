
// // scorers/types.ts
export interface ScoreResult<TMetadata = unknown> {
  score: number;
  confidence?: number;
  reasons?: string[];
  metadata: TMetadata;
}

// TInput: what the extractor produced. TOutput: derived metadata this
// scorer attaches to its result. Defaults to TInput for scorers like
// pronunciation that just pass extractor metadata through unchanged.
export interface Scorer<TInput = unknown, TOutput = TInput> {
  name: string;
  score(metadata: TInput): ScoreResult<TOutput>;
}