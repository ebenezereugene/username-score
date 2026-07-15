// constants/pronunciation.constants.ts

export const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

export const CONSONANTS = new Set([
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "z",
]);

export const SEPARATORS = new Set([".", "_", "-"]);

// Strong pronunciation-friendly transitions
export const COMMON_PHONETIC_TRANSITIONS = new Set([
  "th",
  "ch",
  "sh",
  "ph",
  "wh",

  "br",
  "cr",
  "dr",
  "fr",
  "gr",
  "pr",
  "tr",

  "st",
  "sl",
  "cl",
  "pl",
]);

// Common natural transitions.
// These are not special sounds, but they occur naturally in pronounceable names.
export const NATURAL_TRANSITIONS = new Set([
  "an",
  "en",
  "er",
  "el",
  "on",
  "in",
  "ar",
  "al",
  "am",
  "em",
  "na",
  "ne",
  "ni",
  "no",
  "is",
  "es",
  "re",
]);

export const IMPOSSIBLE_TRANSITIONS = new Set([
  "qx",
  "qz",
  "zx",
  "jq",
  "xz",
  "jk",
  "qv",
  "qw",
  "qj",
  "zk",
  "mx",
  "cx",
  "vj",
]);
