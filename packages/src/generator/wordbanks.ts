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
  "hi",
  "its",
  "meet",
  "the",
  "thisis",
  "callme",
  "yo",
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
  "crafts",
  "writes",
  "draws",
  "studio",
  "labs",
  "hq",
  "co",
  "media",
  "digital",
  "collective",
  "workshop",
];

/**
 * Creator-oriented prefixes.
 */
export const CREATOR_PREFIXES = [
  "build",
  "madeby",
  "designby",
  "createdby",
  "by",
  "from",
];

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
  "craft",
  "form",
  "lab",
];

/**
 * Minimal additions.
 */
export const MINIMAL_PREFIXES = ["the", "its", "mr", "ms"];

export const MINIMAL_SUFFIXES = ["_", ".", "x", "hq"];

/**
 * Friendly words.
 */
export const FRIENDLY_PREFIXES = [
  "real",
  "just",
  "official",
  "simply",
  "truly",
  "always",
];

/**
 * Small curated adjective list for alliterative usernames.
 */
export const ADJECTIVES_BY_LETTER: Record<string, string[]> = {
  a: ["ace", "apt", "avid", "artsy"],
  b: ["bold", "bright", "brave", "brisk"],
  c: ["cool", "clever", "crisp", "candid"],
  d: ["daring", "deft", "dapper", "driven"],
  e: ["epic", "elite", "eager", "earnest"],
  f: ["fresh", "fierce", "fast", "fluent"],
  g: ["grand", "great", "golden", "genuine"],
  h: ["happy", "honest", "handy", "humble"],
  i: ["ideal", "iconic", "inspired"],
  j: ["jolly", "joyful", "jazzy"],
  k: ["keen", "kind", "keenwit"],
  l: ["lively", "lucky", "loyal", "lucid"],
  m: ["mighty", "modern", "merry", "mindful"],
  n: ["neat", "noble", "nimble", "novel"],
  o: ["original", "open", "optimal"],
  p: ["prime", "pure", "plucky", "polished"],
  q: ["quick", "quiet", "quirky"],
  r: ["real", "rapid", "radiant", "rooted"],
  s: ["sharp", "swift", "smart", "steady"],
  t: ["true", "tidy", "tenacious", "thoughtful"],
  u: ["ultra", "unique", "upbeat"],
  v: ["vivid", "vital", "vibrant", "versatile"],
  w: ["wise", "wild", "witty", "warm"],
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
export const SEPARATORS = [".", "_", "-"];

/**
 * Mutation suffixes.
 * Used for simple stylistic variations.
 */
export const MUTATION_SUFFIXES = [
  "x",
  "xo",
  "tv",
  "io",
  "hq",
  "app",
  "world",
  "space",
];

/**
 * Number-as-word suffixes. A tasteful alternative to random digits —
 * "jimohone" reads as a name, "jimoh38291" doesn't.
 */
export const NUMBER_WORD_SUFFIXES = ["one", "prime", "zero", "x2"];

/**
 * Short standalone words that pair naturally as suffixes across most
 * names, for extra variety beyond the creator/mutation banks.
 */
export const VIBE_SUFFIXES = [
  "official",
  "world",
  "space",
  "club",
  "circle",
  "corner",
];

/**
 * Maximum candidates generated per strategy.
 * Prevents runaway generation while keeping
 * suggestion quality high.
 */
export const MAX_CANDIDATES_PER_STRATEGY = 10;
