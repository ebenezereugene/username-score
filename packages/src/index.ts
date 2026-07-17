// index.ts

import { parseUsername } from "./parser/parser.js";
import { scoreUsername } from "./pipeline/scoreUsername.js";
import { combinePillars } from "./engine/pillars.js";
import { generateUsernameSuggestions } from "./generator/index.js";

import type { ParsedUsername } from "./parser/types.js";
import type { PillarBreakdown } from "./engine/pillars.js";
import type { ScorerResult } from "./engine/types.js";
import type {
  UsernameSuggestion,
  SuggestionOptions,
} from "./generator/index.js";

export interface ScoreOptions {
  /**
   * Additional brand-specific words to consider when
   * calculating brandability.
   */
  brandTerms?: string[];

  /**
   * When true, also generates alternative username suggestions
   * and includes them in the result. Off by default since it
   * scores many additional candidates internally.
   * @default false
   */
  includeSuggestions?: boolean;

  /**
   * Options forwarded to generateUsernameSuggestions when
   * includeSuggestions is true. Supports randomize/poolSize for
   * varied suggestions across repeated calls.
   */
  suggestionOptions?: SuggestionOptions;
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

  /**
   * Alternative username suggestions, present only when
   * includeSuggestions is true.
   */
  suggestions?: UsernameSuggestion[];
}

/**
 * Analyze a username and return a complete breakdown
 * of its quality, optionally including alternative
 * suggestions in the same result.
 */
export function analyze(
  username: string,
  options: ScoreOptions = {},
): UsernameAnalysis {
  const parsed = parseUsername(username);

  const features = scoreUsername(parsed, options.brandTerms ?? []);

  const pillars = combinePillars(features);

  const result: UsernameAnalysis = {
    ...pillars,
    parsed,
    features,
  };

  if (options.includeSuggestions) {
    result.suggestions = generateUsernameSuggestions(
      username,
      options.suggestionOptions,
    );
  }

  return result;
}

/**
 * Convenience helper that returns only the overall score.
 */
export function score(username: string, options: ScoreOptions = {}): number {
  return analyze(username, options).total;
}

export { generateUsernameSuggestions };
export type { UsernameSuggestion, SuggestionOptions };

const username = analyze("eugeneebenezer", {
  includeSuggestions: true,
  suggestionOptions: {  randomize: true, poolSize: 5, limit: 7 },
});

console.log("username", username);
