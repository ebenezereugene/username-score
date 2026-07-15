// engine/types.ts

/**
 * Raw output produced by an individual scorer.
 * Scores should already be normalized to the range 0–100.
 */
export interface ScorerResult {
  /**
   * Unique scorer identifier.
   * Must match a key in ScoreWeights.
   */
  name: string;

  score: number;
}

/**
 * A scorer result after its configured weight
 * has been applied by the engine.
 */
export interface ScoreComponent extends ScorerResult {
  /**
   * Relative contribution to the final score.
   * All component weights should sum to 1.
   */
  weight: number;
}

/**
 * Maps scorer names to their relative weights.
 *
 * Example:
 * {
 *   length: 0.2,
 *   entropy: 0.3,
 *   readability: 0.5
 * }
 */
export interface ScoreWeights {
  [scorerName: string]: number;
}

/**
 * Final output returned by the scoring engine.
 */
export interface ScoreBreakdown {
  /**
   * Final weighted score.
   */
  total: number;

  /**
   * Individual scorer contributions.
   */
  components: ScoreComponent[];
}