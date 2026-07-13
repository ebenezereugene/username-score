export const CHARACTER_RUN_PATTERN = /(.)\1{2,}/g;
export const REPEATED_SEQUENCE_PATTERN = /([a-z0-9]{2,})\1+/g;
export const CHARACTER_RUN_PENALTY = 0.2;
export const REPEATED_SEQUENCE_PENALTY = 0.15;
export const MIN_SCORE = 0.2;
