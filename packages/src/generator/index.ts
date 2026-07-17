// generator/index.ts

import { parseUsername } from "../parser/parser.js";
import { scoreUsername } from "../pipeline/scoreUsername.js";
import { combinePillars } from "../engine/pillars.js";

import {
  generateConversational,
  generateCreator,
  generateHybrid,
  generateLeetspeak,
  generateMinimalist,
  generatePlayful,
  mutateUsername,
  repairUsername,
} from "./strategies.js";

export type SuggestionStrategy =
  | "original"
  | "repair"
  | "conversation"
  | "creator"
  | "minimalist"
  | "playful"
  | "leetspeak"
  | "mutation"
  | "hybrid";

export interface UsernameSuggestion {
  username: string;
  score: number;
  breakdown: ReturnType<typeof combinePillars>;
  strategy: SuggestionStrategy;
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

  /**
   * Restrict generation to specific strategies. When omitted, all
   * strategies run. Strategies not listed here are skipped entirely
   * (not generated, not scored) rather than filtered out afterward.
   */
  strategies?: SuggestionStrategy[];
}

function scoreCandidate(
  candidate: string,
  strategy: SuggestionStrategy,
): UsernameSuggestion {
  const parsed = parseUsername(candidate);
  const scorerResults = scoreUsername(parsed);
  const breakdown = combinePillars(scorerResults);

  return {
    username: candidate,
    score: breakdown.total,
    breakdown,
    strategy,
  };
}

/**
 * Scores every candidate in a strategy and returns them sorted
 * best-first, deduplicated and length-filtered.
 */
function rankStrategy(
  strategy: SuggestionStrategy,
  candidates: string[],
): UsernameSuggestion[] {
  const seen = new Set<string>();
  const scored: UsernameSuggestion[] = [];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();

    if (seen.has(normalized)) continue;
    seen.add(normalized);

    if (normalized.length < 2) continue;

    scored.push(scoreCandidate(normalized, strategy));
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
    strategies: requestedStrategies,
  } = options;

  const normalized = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");

  if (!normalized) {
    return [];
  }

  // Lazy builders — candidates are only generated for strategies that
  // actually get used, so filtering by `strategies` skips real work
  // rather than just discarding results afterward.
  const strategyBuilders: Record<SuggestionStrategy, () => string[]> = {
    original: () => (includeOriginal ? [normalized] : []),
    repair: () => repairUsername(normalized),
    conversation: () => generateConversational(normalized),
    creator: () => generateCreator(normalized),
    minimalist: () => generateMinimalist(normalized),
    playful: () => generatePlayful(normalized),
    leetspeak: () => generateLeetspeak(normalized),
    mutation: () => mutateUsername(normalized),
    hybrid: () => generateHybrid(normalized),
  };

  const activeStrategies = (
    requestedStrategies && requestedStrategies.length > 0
      ? requestedStrategies
      : (Object.keys(strategyBuilders) as SuggestionStrategy[])
  ).filter((strategy) => strategy in strategyBuilders);

  const suggestions: UsernameSuggestion[] = [];
  const seen = new Set<string>();

  for (const strategy of activeStrategies) {
    const candidates = strategyBuilders[strategy]();
    const ranked = rankStrategy(strategy, candidates);
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
