export const IDEAL_MIN = 6;
export const IDEAL_MAX = 12;

/**
 * Length at which the long-name scoring curve reaches zero.
 */
export const MAX_REASONABLE_LENGTH = 27;

/**
 * Length where the tail-decay begins.
 * This should correspond to the final explicit entry in LENGTH_SCORES.
 */
export const TAIL_START_LENGTH = 17;

export const REASONS = {
  tooShort: "Extremely short usernames are harder to distinguish.",
  veryShort: "Very short usernames can be hard to distinguish.",
  short: "Slightly shorter than the recommended length.",
  ideal: "Falls within the ideal length range.",
  memorable: "Likely to be easy to remember.",
  long: "Slightly longer than the recommended length.",
  tooLong: "Too long, making it harder to read and remember.",
} as const;

/**
 * Explicit scores for lengths that fall just outside the ideal range.
 * These values define the scoring curve and can be tuned without
 * changing the scoring logic.
 */
export const LENGTH_SCORES: Readonly<Record<number, number>> = Object.freeze({
  3: 20,
  4: 45,
  5: 70,
  13: 90,
  14: 80,
  15: 70,
  16: 55,
  17: 40,
});

export const VERY_SHORT_LENGTHS = new Set([3, 4]);
