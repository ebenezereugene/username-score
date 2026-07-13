// extractors/entropy.ts

import type { Extractor } from "./types.js";

type EntropyTier = "low" | "medium" | "high";

// Thresholds apply to entropyDensity (entropy normalized against the max
// possible for the string's length), not raw entropy. Raw entropy's
// ceiling is log2(length), so a fixed raw threshold is length-biased:
// a 4-character string can never exceed log2(4) = 2.0 no matter how
// random it is, making short strings incapable of ever being classified
// "high" under a raw threshold. Density is length-independent (0-1),
// so it classifies fairly across username lengths.
const LOW_DENSITY_THRESHOLD = 0.6;
const HIGH_DENSITY_THRESHOLD = 0.85;

const MEDIUM_TIER_VALUE = 0.6;
const LOW_TIER_VALUE = 1.0; // human-readable names tend to land here
const HIGH_TIER_VALUE = 0.3; // random/generated usernames tend to land here

// Below this length, density alone can't reliably tell a real word from
// a random string apart — a short name with no repeated letters (e.g.
// "hyde") produces the exact same density as a short random string
// (e.g. "xq7k"), since there simply isn't enough length for repetition
// patterns to mean anything yet. Rather than trust the tier at full
// strength for short usernames, we blend the computed value toward a
// neutral "uncertain" value, phasing that dampening out linearly as
// length approaches MIN_RELIABLE_LENGTH. At/above that length, entropy
// is trusted at full strength.
const MIN_RELIABLE_LENGTH = 8;
const NEUTRAL_VALUE = MEDIUM_TIER_VALUE; // when unsure, assume "medium"

export const entropyExtractor: Extractor = {
  name: "entropy",

  extract(username) {
    const text = username.normalized;
    const length = text.length;

    if (length === 0) {
      return {
        name: this.name,
        value: 0,
        metadata: {
          entropy: 0,
          entropyDensity: 0,
          entropyTier: "low",
          uniqueCharacterCount: 0,
          uniqueCharacterRatio: 0,
          confidence: 0,
        },
      };
    }

    /**
     * Calculate character frequencies
     */
    const frequencies = new Map<string, number>();

    for (const char of text) {
      frequencies.set(char, (frequencies.get(char) ?? 0) + 1);
    }

    /**
     * Calculate Shannon entropy
     */
    let entropy = 0;

    for (const frequency of frequencies.values()) {
      const probability = frequency / length;

      entropy -= probability * Math.log2(probability);
    }

    /**
     * Normalize entropy against the maximum possible entropy
     * for this username length.
     */
    const maxEntropy = Math.log2(length);

    const entropyDensity = maxEntropy > 0 ? entropy / maxEntropy : 0;

    /**
     * Classify entropy level using density (length-independent),
     * not raw entropy.
     */
    let entropyTier: EntropyTier = "medium";
    let tierValue = MEDIUM_TIER_VALUE;

    if (entropyDensity < LOW_DENSITY_THRESHOLD) {
      entropyTier = "low";
      tierValue = LOW_TIER_VALUE;
    } else if (entropyDensity > HIGH_DENSITY_THRESHOLD) {
      entropyTier = "high";
      tierValue = HIGH_TIER_VALUE;
    }

    /**
     * Dampen the tier value toward NEUTRAL_VALUE for short usernames,
     * since density isn't a reliable signal yet at short lengths.
     */
    const confidence = Math.min(1, length / MIN_RELIABLE_LENGTH);
    const value =
      Math.round(
        (tierValue * confidence + NEUTRAL_VALUE * (1 - confidence)) * 100,
      ) / 100;

    const uniqueCharacterCount = frequencies.size;

    return {
      name: this.name,

      value,

      metadata: {
        entropy: Math.round(entropy * 100) / 100,

        entropyDensity: Math.round(entropyDensity * 100) / 100,

        entropyTier,

        uniqueCharacterCount,

        uniqueCharacterRatio:
          Math.round((uniqueCharacterCount / length) * 100) / 100,

        confidence: Math.round(confidence * 100) / 100,
      },
    };
  },
};
