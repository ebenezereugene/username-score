
// index.ts

import { parseUsername } from "./parser/parser.js";
import { scoreUsername } from "./pipeline/scoreUsername.js";
import { combinePillars } from "./engine/pillars.js";

import type { ParsedUsername } from "./parser/types.js";
import type { PillarBreakdown } from "./engine/pillars.js";
import type { ScorerResult } from "./engine/types.js";
import { generateUsernameSuggestions } from "./generator/index.js";

export interface ScoreOptions {
  /**
   * Additional brand-specific words to consider when
   * calculating brandability.
   */
  brandTerms?: string[];
}

export interface UsernameAnalysis extends PillarBreakdown {
  /**
   * Parsed representation of the username.
   */
  parsed: ParsedUsername;

  /**
   * Individual feature scores before they are combined
   * into the high-level pillars.
   */
  features: ScorerResult[];
}

/**
 * Analyze a username and return a complete breakdown
 * of its quality.
 */
export function analyze(
  username: string,
  options: ScoreOptions = {},
): UsernameAnalysis {
  const parsed = parseUsername(username);

  const features = scoreUsername(parsed, options.brandTerms ?? []);

  const pillars = combinePillars(features);

  return {
    ...pillars,
    parsed,
    features,
  };
}

/**
 * Convenience helper that returns only the overall score.
 */
export function score(
  username: string,
  options: ScoreOptions = {},
): number {
  return analyze(username, options).total;
}

// Example
console.log(analyze("fola"));

// const generatedSuggetions =generateUsernameSuggestions("emmah");

// console.log("generatedSuggetions", generatedSuggetions);


