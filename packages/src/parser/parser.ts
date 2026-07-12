// parser.ts

import { normaliseUsername } from "./normalise.js";
import { tokenizeUsername } from "./tokenise.js";
import type { ParseUsernameFn } from "./types.js";

export const parseUsername: ParseUsernameFn = (rawInput) => {
  const normalized = normaliseUsername(rawInput);
  const tokens = tokenizeUsername(normalized);

  const separatorMatches = normalized.match(/[._]/g);
  const separatorCount = separatorMatches ? separatorMatches.length : 0;

  return {
    original: rawInput,
    normalized,
    tokens,
    length: normalized.length,
    features: {
      hasNumbers: /\d/.test(normalized),
      hasSeparator: separatorCount > 0,
      separatorCount,
    },
  };
};
