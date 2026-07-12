// normalise.ts

import type { NormaliseUsernameFn } from "./types.js";


export const normaliseUsername: NormaliseUsernameFn = (rawInput) => {
  return rawInput
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/[_.]{2,}/g, "_")
    .replace(/^[._]+|[._]+$/g, "");
};
