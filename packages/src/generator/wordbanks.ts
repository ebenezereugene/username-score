// generator/wordbanks.ts

/**
 * Conversational prefixes.
 * Used for friendly, social-style usernames.
 */
export const GREETING_PREFIXES = [
  "iam",
  "im",
  "hey",
  "hello",
  "its",
  "meet",
  "the",
  "thisis",
];

/**
 * Professional / creator suffixes.
 */
export const CREATOR_SUFFIXES = [
  "builds",
  "creates",
  "codes",
  "designs",
  "makes",
  "works",
  "studio",
  "labs",
  "hq",
  "co",
  "media",
  "digital",
];

/**
 * Creator-oriented prefixes.
 */
export const CREATOR_PREFIXES = ["build", "madeby", "designby", "createdby"];

/**
 * Domain-style words.
 */
export const CREATOR_DOMAINS = [
  "design",
  "code",
  "build",
  "dev",
  "made",
  "studio",
];

/**
 * Minimal additions.
 */
export const MINIMAL_PREFIXES = ["the", "its"];

export const MINIMAL_SUFFIXES = ["_", ".", "x"];

/**
 * Friendly words.
 */
export const FRIENDLY_PREFIXES = ["real", "just", "official", "simply"];

/**
 * Small curated adjective list for alliterative usernames.
 */
export const ADJECTIVES_BY_LETTER: Record<string, string[]> = {
  a: ["ace", "apt", "avid"],
  b: ["bold", "bright", "brave"],
  c: ["cool", "clever", "crisp"],
  d: ["daring", "deft", "dapper"],
  e: ["epic", "elite", "eager"],
  f: ["fresh", "fierce", "fast"],
  g: ["grand", "great", "golden"],
  h: ["happy", "honest", "handy"],
  i: ["ideal", "iconic"],
  j: ["jolly", "joyful", "jazzy"],
  k: ["keen", "kind"],
  l: ["lively", "lucky", "loyal"],
  m: ["mighty", "modern", "merry"],
  n: ["neat", "noble", "nimble"],
  o: ["original", "open"],
  p: ["prime", "pure", "plucky"],
  q: ["quick", "quiet", "quirky"],
  r: ["real", "rapid", "radiant"],
  s: ["sharp", "swift", "smart"],
  t: ["true", "tidy", "tenacious"],
  u: ["ultra", "unique"],
  v: ["vivid", "vital", "vibrant"],
  w: ["wise", "wild", "witty"],
  x: ["xtra"],
  y: ["young", "youthful"],
  z: ["zesty", "zen", "zippy"],
};

/**
 * Tasteful leetspeak substitutions.
 * We intentionally avoid aggressive replacements
 * that make usernames unreadable.
 */
export const LEET_ENCODE_MAP: Record<string, string> = {
  a: "4",
  e: "3",
  i: "1",
  o: "0",
  s: "5",
};

/**
 * Common separators.
 */
export const SEPARATORS = [".", "_"];

/**
 * Mutation suffixes.
 * Used for simple stylistic variations.
 */
export const MUTATION_SUFFIXES = ["x", "xo", "tv", "io"];

/**
 * Maximum candidates generated per strategy.
 * Prevents runaway generation while keeping
 * suggestion quality high.
 */
export const MAX_CANDIDATES_PER_STRATEGY = 10;
