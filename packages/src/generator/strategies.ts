// generator/strategies.ts

import {
  ADJECTIVES_BY_LETTER,
  CREATOR_DOMAINS,
  CREATOR_PREFIXES,
  CREATOR_SUFFIXES,
  FRIENDLY_PREFIXES,
  GREETING_PREFIXES,
  LEET_ENCODE_MAP,
  MINIMAL_PREFIXES,
  MINIMAL_SUFFIXES,
  MUTATION_SUFFIXES,
  SEPARATORS,
} from "./wordbanks.js";

/**
 * Conversational usernames.
 * Example:
 * jimoh -> iamjimoh
 */
export function generateConversational(name: string): string[] {
  return GREETING_PREFIXES.map((prefix) => `${prefix}${name}`);
}

/**
 * Professional / creator usernames.
 */
export function generateCreator(name: string): string[] {
  return [
    ...CREATOR_SUFFIXES.map((suffix) => `${name}${suffix}`),

    ...CREATOR_PREFIXES.map((prefix) => `${prefix}${name}`),

    ...CREATOR_DOMAINS.map((domain) => `${domain}by${name}`),
  ];
}

/**
 * Minimal clean usernames.
 */
export function generateMinimalist(name: string): string[] {
  const candidates = new Set<string>();

  MINIMAL_PREFIXES.forEach((prefix) => {
    candidates.add(`${prefix}${name}`);
  });

  MINIMAL_SUFFIXES.forEach((suffix) => {
    candidates.add(`${name}${suffix}`);
  });

  if (name.length >= 3) {
    candidates.add(`${name[0]}_${name.slice(2)}`);
  }

  if (name.length >= 4) {
    const mid = Math.ceil(name.length / 2);

    SEPARATORS.forEach((separator) => {
      candidates.add(`${name.slice(0, mid)}${separator}${name.slice(mid)}`);
    });
  }

  return [...candidates];
}

/**
 * Fun / alliterative usernames.
 */
export function generatePlayful(name: string): string[] {
  const firstLetter = name[0] ?? "";

  const adjectives = ADJECTIVES_BY_LETTER[firstLetter] ?? [];

  return [
    ...adjectives.map((adj) => `${adj}${name}`),

    ...FRIENDLY_PREFIXES.map((prefix) => `${prefix}${name}`),
  ];
}

/**
 * Tasteful leetspeak.
 */
export function generateLeetspeak(name: string): string[] {
  const candidates = new Set<string>();

  for (const [letter, digit] of Object.entries(LEET_ENCODE_MAP)) {
    if (!name.includes(letter)) continue;

    candidates.add(name.replace(letter, digit));
    candidates.add(name.replaceAll(letter, digit));
  }

  return [...candidates];
}

/**
 * Small stylistic mutations.
 *
 * jimoh
 * ↓
 * jimohx
 * jimohtv
 * jimohio
 */
export function mutateUsername(name: string): string[] {
  return MUTATION_SUFFIXES.map((suffix) => `${name}${suffix}`);
}

/**
 * Removes repeated characters.
 *
 * xxxdarkkiller
 * ↓
 * xdarkkiller
 */
export function repairRepeatedCharacters(name: string): string {
  return name.replace(/(.)\1{2,}/g, "$1");
}

/**
 * Removes numbers.
 *
 * john123
 * ↓
 * john
 */
export function repairNumbers(name: string): string {
  return name.replace(/\d+/g, "");
}

/**
 * Repairs overly long usernames.
 */
export function repairLength(name: string, maxLength = 16): string {
  if (name.length <= maxLength) {
    return name;
  }

  return name.slice(0, maxLength);
}

/**
 * Cleans duplicated separators.
 *
 * john__doe
 * ↓
 * john_doe
 */
export function repairSeparators(name: string): string {
  return name
    .replace(/_{2,}/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^[_\.]+/, "")
    .replace(/[_\.]+$/, "");
}

/**
 * Runs every repair strategy.
 */
export function repairUsername(name: string): string[] {
  const repaired = new Set<string>();

  repaired.add(repairRepeatedCharacters(name));
  repaired.add(repairNumbers(name));
  repaired.add(repairLength(name));
  repaired.add(repairSeparators(name));

  return [...repaired].filter(Boolean);
}

/**
 * Runs every generation strategy.
 */
export function generateAllCandidates(name: string): string[] {
  const candidates = new Set<string>();

  [
    ...generateConversational(name),
    ...generateCreator(name),
    ...generateMinimalist(name),
    ...generatePlayful(name),
    ...generateLeetspeak(name),
    ...mutateUsername(name),
    ...repairUsername(name),
  ].forEach((candidate) => {
    candidates.add(candidate.toLowerCase());
  });

  return [...candidates];
}
