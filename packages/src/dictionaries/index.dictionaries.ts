// dictionaries/index.ts

import { COMMON_ABBREVIATIONS } from "./abbreviations.dictionary.js";
import { COMMON_WORDS } from "./commonWords.dictionary.js";
import { NAMES } from "./names.dictionary.js";

import { buildDictionaryMap } from "./buildDictionary.js";

export const DICTIONARY_SOURCES = {
  COMMON_WORDS: "commonWords",
  ABBREVIATIONS: "abbreviations",
  NAMES: "names",
} as const;

export const DICTIONARY = buildDictionaryMap({
  [DICTIONARY_SOURCES.COMMON_WORDS]: COMMON_WORDS,
  [DICTIONARY_SOURCES.ABBREVIATIONS]: COMMON_ABBREVIATIONS,
  [DICTIONARY_SOURCES.NAMES]: NAMES,
});

export const MAX_DICTIONARY_WORD_LENGTH = Math.max(
  ...Array.from(DICTIONARY.keys()).map((word) => word.length),
);
