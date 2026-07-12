// tokenise.ts

import type { TokenizeUsernameFn } from "./types.js";

export const tokenizeUsername: TokenizeUsernameFn = (username) => {
  const tokens = username.match(/[a-zA-Z]+|[0-9]+|[_.]/g);
  return tokens ?? [];
};
