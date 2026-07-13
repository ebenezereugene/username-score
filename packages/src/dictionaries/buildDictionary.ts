export interface DictionaryEntry {
  word: string;
  source: string;
}

export interface DictionaryMapEntry {
  source: string;
}

export function buildDictionaryMap(
  sources: Record<string, Iterable<string>>,
): Map<string, DictionaryMapEntry> {
  const dictionary = new Map<string, DictionaryMapEntry>();

  for (const [source, words] of Object.entries(sources)) {
    for (const rawWord of words) {
      const word = rawWord.trim().toLowerCase();

      if (word.length < 3) continue;
      if (!/^[a-z]+$/.test(word)) continue;

      if (!dictionary.has(word)) {
        dictionary.set(word, { source });
      }
    }
  }

  return dictionary;
}
