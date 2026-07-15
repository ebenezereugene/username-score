// generator/index.ts

import { parseUsername } from "../parser/parser.js";
import { scoreUsername } from "../pipeline/scoreUsername.js";
import { combinePillars } from "../engine/pillars.js";

import {
  generateConversational,
  generateCreator,
  generateLeetspeak,
  generateMinimalist,
  generatePlayful,
  mutateUsername,
  repairUsername,
} from "./strategies.js";

export interface UsernameSuggestion {
  username: string;
  score: number;
  breakdown: ReturnType<typeof combinePillars>;
  strategy: string;
}

export interface SuggestionOptions {
  /**
   * Maximum number of suggestions returned.
   * @default 10
   */
  limit?: number;

  /**
   * Include the original username.
   * @default true
   */
  includeOriginal?: boolean;

  /**
   * Ignore usernames below this score.
   * @default 0
   */
  minimumScore?: number;
}

interface StrategyResult {
  strategy: string;
  candidates: string[];
}

function scoreCandidate(candidate: string): UsernameSuggestion {
  const parsed = parseUsername(candidate);
  const scorerResults = scoreUsername(parsed);
  const breakdown = combinePillars(scorerResults);

  return {
    username: candidate,
    score: breakdown.total,
    breakdown,
    strategy: "",
  };
}

function bestFromStrategy(
  strategy: string,
  candidates: string[],
): UsernameSuggestion | null {
  let best: UsernameSuggestion | null = null;

  const seen = new Set<string>();

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();

    if (seen.has(normalized)) continue;

    seen.add(normalized);

    if (normalized.length < 2) continue;

    const scored = scoreCandidate(normalized);

    scored.strategy = strategy;

    if (!best || scored.score > best.score) {
      best = scored;
    }
  }

  return best;
}

/**
 * Generate username suggestions.
 *
 * Instead of allowing one strategy to dominate the results,
 * each strategy first selects its strongest candidate before
 * entering the final ranking.
 */
export function generateUsernameSuggestions(
  username: string,
  options: SuggestionOptions = {},
): UsernameSuggestion[] {
  const { limit = 10, includeOriginal = true, minimumScore = 0 } = options;

  const normalized = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");

  if (!normalized) {
    return [];
  }

  const strategies: StrategyResult[] = [
    {
      strategy: "original",
      candidates: includeOriginal ? [normalized] : [],
    },
    {
      strategy: "repair",
      candidates: repairUsername(normalized),
    },
    {
      strategy: "conversation",
      candidates: generateConversational(normalized),
    },
    {
      strategy: "creator",
      candidates: generateCreator(normalized),
    },
    {
      strategy: "minimalist",
      candidates: generateMinimalist(normalized),
    },
    {
      strategy: "playful",
      candidates: generatePlayful(normalized),
    },
    {
      strategy: "leetspeak",
      candidates: generateLeetspeak(normalized),
    },
    {
      strategy: "mutation",
      candidates: mutateUsername(normalized),
    },
  ];

  const suggestions: UsernameSuggestion[] = [];
  const seen = new Set<string>();

  for (const strategy of strategies) {
    const best = bestFromStrategy(strategy.strategy, strategy.candidates);

    if (!best) continue;

    if (best.score < minimumScore) continue;

    if (seen.has(best.username)) continue;

    seen.add(best.username);

    suggestions.push(best);
  }

  suggestions.sort((a, b) => b.score - a.score);

  return suggestions.slice(0, limit);
}
