// scorers/dictionary.ts
import type { Scorer } from "./types.js";
import type { DictionaryMetadata } from "../extractors/types.dictionary.js";

export interface DictionaryScoreMetadata {
  isHighlyMemorable: boolean;
  wordBloatRisk: boolean;
  unrecognizedRatio: number;
  matchedWordCount: number;
  longestMatchLength: number;
  coverageRatio: number;
  recognizabilityScore: number;
}

export const dictionaryScorer: Scorer<
  DictionaryMetadata,
  DictionaryScoreMetadata
> = {
  name: "dictionary",

  score(metadata) {
    if (metadata.matchedWordCount === 0) {
      return {
        score: 10,
        confidence: 0.4,
        reasons: [
          "No recognizable dictionary patterns found.",
          "Memorability will depend more heavily on pronunciation and structural signals.",
        ],
        metadata: {
          isHighlyMemorable: false,
          wordBloatRisk: false,
          unrecognizedRatio: 1,
          matchedWordCount: 0,
          longestMatchLength: 0,
          coverageRatio: 0,
          recognizabilityScore: 0,
        },
      };
    }

    const {
      matchedWordCount,
      coverageRatio,
      longestMatchLength,
      recognizabilityScore,
      hasNameMatch,
      hasCommonWordMatch,
      hasAbbreviationMatch,
    } = metadata;

    const unrecognizedRatio = 1 - coverageRatio;
    let score = 50;
    const reasons: string[] = [];

    if (matchedWordCount === 1) {
      score += 25;
      reasons.push("Contains a single recognizable word component.");
    } else if (matchedWordCount === 2) {
      score += 25;
      reasons.push("Contains a concise two-word composition.");
    } else if (matchedWordCount === 3) {
      score += 10;
      reasons.push("Contains multiple recognizable components.");
    } else {
      const bloatPenalty = Math.min(40, (matchedWordCount - 3) * 8);
      score -= bloatPenalty;
      reasons.push(
        "Contains too many word components which may reduce memorability.",
      );
    }

    if (matchedWordCount <= 2) {
      if (coverageRatio >= 0.95) {
        score += 15;
        reasons.push("Username is mostly composed of recognizable terms.");
      } else if (coverageRatio >= 0.6) {
        score += 5;
        reasons.push("Username contains recognizable terms with some noise.");
      } else {
        score -= 15;
        reasons.push(
          "Large portions of the username are not recognizable words.",
        );
      }
    } else if (matchedWordCount === 3) {
      if (coverageRatio >= 0.95) {
        score += 5;
        reasons.push(
          "Composed almost entirely of words, though with several components.",
        );
      } else if (coverageRatio >= 0.6) {
        score += 2;
      } else {
        score -= 15;
        reasons.push(
          "Large portions of the username are not recognizable words.",
        );
      }
    } else {
      if (coverageRatio >= 0.95) {
        score -= 10;
        reasons.push(
          "High dictionary coverage reduces uniqueness because the username feels generic.",
        );
      } else if (coverageRatio >= 0.6) {
        score -= 5;
        reasons.push("High word density reduces distinctiveness.");
      } else {
        score -= 15;
        reasons.push(
          "Large portions of the username are not recognizable words.",
        );
      }
    }

    if (hasNameMatch) {
      score += 10;
      reasons.push("Contains a recognizable name pattern.");
    }
    if (hasCommonWordMatch) {
      score += 5;
      reasons.push("Uses common recognizable language.");
    }
    if (hasAbbreviationMatch) {
      score += 1;
      reasons.push("Contains recognizable abbreviation patterns.");
    }

    if (longestMatchLength <= 8) {
      score += 5;
      reasons.push("Uses compact word components.");
    } else if (longestMatchLength >= 14) {
      score -= 10;
      reasons.push("Contains very long word components.");
    }

    score += Math.round((recognizabilityScore - 0.5) * 10);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    let confidence = 0.75;
    if (coverageRatio >= 0.95) confidence += 0.15;
    if (matchedWordCount <= 2) confidence += 0.05;
    if (unrecognizedRatio > 0.5) confidence -= 0.15;
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      score: finalScore,
      confidence: Number(confidence.toFixed(2)),
      reasons,
      metadata: {
        isHighlyMemorable: finalScore >= 85,
        wordBloatRisk: matchedWordCount >= 4,
        unrecognizedRatio: Number(unrecognizedRatio.toFixed(2)),
        matchedWordCount,
        longestMatchLength,
        coverageRatio: Number(coverageRatio.toFixed(2)),
        recognizabilityScore: Number(recognizabilityScore.toFixed(2)),
      },
    };
  },
};
