// index.ts

import { parseUsername } from "./parser/parser.js";
import { scoreUsername } from "./pipeline/scoreUsername.js";
import { score as combineScore } from "./engine/score.js";

import type { ScoreBreakdown, ScoreWeights } from "./engine/types.js";

const DEFAULT_WEIGHTS: ScoreWeights = {
  length: 0.2,
  dictionary: 0.2,
  pronunciation: 0.2,
  entropy: 0.2,
  readability: 0.2,
};

export function score(
  username: string,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): ScoreBreakdown {
  const parsed = parseUsername(username);
  const results = scoreUsername(parsed);

  return combineScore(results, weights);
}

console.log("this is the score:", score("john"));
