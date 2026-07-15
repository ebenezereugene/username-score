export const BASE_SCORE = 100;

export const CLUSTER_PENALTY = 4;
export const NUMBER_PENALTY = 5;
export const SYMBOL_PENALTY = 10;
export const TRANSITION_PENALTY = 3;

// Max points lost when naturalTransitionRatio is 0 (no letter-pairs are
// phonetically common/natural). Scales linearly down to 0 penalty at
// ratio 1. Kept as a real penalty, not a bonus gate, so a string like
// "qraquat" — short runs, fine vowel ratio, but no natural pairs — still
// loses meaningful points instead of coasting on other dimensions.
export const NATURAL_TRANSITION_PENALTY = 40;

export const VOWEL_BALANCE_BONUS = 5;
export const ALPHABETIC_COVERAGE_BONUS = 10;

export const IDEAL_MIN_VOWEL_RATIO = 0.25;
export const IDEAL_MAX_VOWEL_RATIO = 0.6;
export const HIGH_ALPHABETIC_COVERAGE = 0.8;
