// constants/readability.constants.ts

export const VOWEL_REGEX = /[aeiou]/g;
export const CONSONANT_REGEX = /[bcdfghjklmnpqrstvwxyz]/g;
export const CONSONANT_CLUSTER_REGEX = /[bcdfghjklmnpqrstvwxyz]{2,}/g;
export const NUMBER_CLUSTER_REGEX = /\d+/g;
export const SYMBOL_RUN_REGEX = /[^a-z0-9]+/g;
