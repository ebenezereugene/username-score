// scorers/entropy.ts

import type { Scorer } from "./types.js";
import type { EntropyMetadata } from "../extractors/types.entropy.js";

export const entropyScorer: Scorer<EntropyMetadata> = {
  name: "entropy",

  score(metadata) {
    const { entropy, uniqueCharacterRatio, confidence } = metadata;

    let score = 50;
    const reasons: string[] = [];

    /**
     * Very high entropy usually indicates
     * random/generated usernames.
     */
    if (entropy > 4.5) {
      score -= 20;
      reasons.push("Username has high randomness");
    }

    if (entropy > 5.5) {
      score -= 15;
      reasons.push("Username appears highly unpredictable");
    }

    /**
     * Unique character distribution
     */
    if (uniqueCharacterRatio > 0.8) {
      score -= 20;
      reasons.push("Too many unique characters");
    }

    if (uniqueCharacterRatio < 0.3) {
      score -= 10;
      reasons.push("Low character diversity");
    }

    /**
     * Short usernames have unreliable entropy. `confidence` is computed
     * by the extractor as min(1, length / MIN_RELIABLE_LENGTH), where
     * MIN_RELIABLE_LENGTH is 8 — so confidence < 0.5 is equivalent to
     * the old `length < 4` check.
     */
    if (confidence < 0.5) {
      score -= 10;
      reasons.push("Username is too short");
    }

    return {
      score: Math.max(0, Math.min(100, score)),

      confidence,

      reasons,

      metadata,
    };
  },
};
