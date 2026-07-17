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

  /**
   * When true, randomly selects among each strategy's top-scoring
   * candidates instead of always returning the single best one —
   * so repeated calls for the same name can surface different
   * (still high-quality) suggestions. Off by default so results
   * stay deterministic and test-friendly.
   * @default false
   */
  randomize?: boolean;

  /**
   * How many top-scoring candidates per strategy are eligible for
   * random selection when randomize is true. Ignored otherwise.
   * @default 3
   */
  poolSize?: number;
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

/**
 * Scores every candidate in a strategy and returns them sorted
 * best-first, deduplicated and length-filtered.
 */
function rankStrategy(
  strategy: string,
  candidates: string[],
): UsernameSuggestion[] {
  const seen = new Set<string>();
  const scored: UsernameSuggestion[] = [];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();

    if (seen.has(normalized)) continue;
    seen.add(normalized);

    if (normalized.length < 2) continue;

    const result = scoreCandidate(normalized);
    result.strategy = strategy;
    scored.push(result);
  }

  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Picks one suggestion from a ranked strategy list — either the
 * single best (deterministic), or a random pick among the top
 * `poolSize` candidates (when randomize is true).
 */
function pickFromStrategy(
  ranked: UsernameSuggestion[],
  randomize: boolean,
  poolSize: number,
): UsernameSuggestion | null {
  if (ranked.length === 0) return null;

  if (!randomize) {
    return ranked[0] ?? null;
  }

  const pool = ranked.slice(0, Math.max(1, poolSize));
  const index = Math.floor(Math.random() * pool.length);

  return pool[index] ?? null;
}
/**
 * Generate username suggestions.
 *
 * Instead of allowing one strategy to dominate the results,
 * each strategy first selects its strongest candidate (or, with
 * randomize enabled, a random top-scoring candidate) before
 * entering the final ranking.
 */
export function generateUsernameSuggestions(
  username: string,
  options: SuggestionOptions = {},
): UsernameSuggestion[] {
  const {
    limit = 10,
    includeOriginal = true,
    minimumScore = 0,
    randomize = false,
    poolSize = 3,
  } = options;

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
    const ranked = rankStrategy(strategy.strategy, strategy.candidates);
    const picked = pickFromStrategy(ranked, randomize, poolSize);

    if (!picked) continue;
    if (picked.score < minimumScore) continue;
    if (seen.has(picked.username)) continue;

    seen.add(picked.username);
    suggestions.push(picked);
  }

  suggestions.sort((a, b) => b.score - a.score);

  return suggestions.slice(0, limit);
}



