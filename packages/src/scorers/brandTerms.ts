// scorers/brandTerms.ts

import type { Scorer } from "./types.js";
import type { BrandTermsMetadata } from "../extractors/types.brandTerms.js";
import type { BrandTermsScoreMetadata } from "./types.brandTerms.js";

export const brandTermsScorer: Scorer<
  BrandTermsMetadata,
  BrandTermsScoreMetadata
> = {
  name: "brandTerms",

  score(metadata) {
    if (metadata.matchedWordCount === 0) {
      return {
        score: 0,
        confidence: 0.3,
        reasons: ["No match against the provided custom word list."],
        metadata: {
          hasBrandMatch: false,
          matchedWordCount: 0,
          coverageRatio: 0,
          recognizabilityScore: 0,
        },
      };
    }

    // A match against a dev-curated list is inherently valuable — this
    // starts much higher than dictionaryScorer's base of 50, per the
    // decision that custom matches carry more weight than generic ones.
    let score = 75;

    const reasons: string[] = [
      "Matches a word from the provided brand/custom list.",
    ];

    score += Math.round(metadata.coverageRatio * 20);

    if (metadata.coverageRatio >= 0.8) {
      reasons.push("Username is largely composed of the matched brand term.");
    }

    if (metadata.distinctWordCount > 1) {
      score -= Math.min(15, (metadata.distinctWordCount - 1) * 5);

      reasons.push("Multiple distinct brand-term matches may dilute focus.");
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      confidence: 0.8,
      reasons,
      metadata: {
        hasBrandMatch: true,
        matchedWordCount: metadata.matchedWordCount,
        coverageRatio: metadata.coverageRatio,
        recognizabilityScore: metadata.recognizabilityScore,
      },
    };
  },
};
