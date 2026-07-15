// engine/combine.ts

import { clamp } from "./normalize.js";
import type { ScoreComponent, ScorerResult, ScoreWeights } from "./types.js";

/**
 * Tolerance for floating-point rounding
 * when validating total weights.
 */
const WEIGHT_EPSILON = 1e-6;

/**
 * Builds weighted score components from raw
 * scorer results and a weight configuration.
 *
 * This is the only place where scorer outputs
 * are paired with their weights.
 */
export function buildComponents(
  results: ScorerResult[],
  weights: ScoreWeights,
): ScoreComponent[] {
  if (results.length === 0) {
    throw new Error(
      "buildComponents(): at least one scorer result is required",
    );
  }

  const seen = new Set<string>();

  const components = results.map((result) => {
    if (seen.has(result.name)) {
      throw new Error(`buildComponents(): duplicate scorer "${result.name}"`);
    }

    seen.add(result.name);

    const weight = weights[result.name];

    if (weight === undefined) {
      throw new Error(
        `buildComponents(): no weight configured for scorer "${result.name}"`,
      );
    }

    if (!Number.isFinite(weight)) {
      throw new Error(
        `buildComponents(): weight for "${result.name}" must be a finite number`,
      );
    }

    if (weight < 0) {
      throw new Error(
        `buildComponents(): weight for "${result.name}" cannot be negative`,
      );
    }

    return {
      name: result.name,
      score: result.score,
      weight,
    };
  });

  // Detect unused or misspelled weights.
  for (const scorerName of Object.keys(weights)) {
    if (!seen.has(scorerName)) {
      throw new Error(
        `buildComponents(): weight configured for unknown scorer "${scorerName}"`,
      );
    }
  }

  return components;
}

/**
 * Ensures the supplied score components
 * are valid before combining them.
 */
function validateComponents(components: ScoreComponent[]): void {
  if (components.length === 0) {
    throw new Error(
      "combineScores(): at least one score component is required",
    );
  }

  let totalWeight = 0;

  for (const component of components) {
    if (!Number.isFinite(component.score)) {
      throw new Error(
        `combineScores(): score for "${component.name}" must be a finite number`,
      );
    }

    if (component.score < 0 || component.score > 100) {
      throw new Error(
        `combineScores(): score for "${component.name}" must be between 0 and 100. Received ${component.score}`,
      );
    }

    if (!Number.isFinite(component.weight)) {
      throw new Error(
        `combineScores(): weight for "${component.name}" must be a finite number`,
      );
    }

    if (component.weight < 0) {
      throw new Error(
        `combineScores(): weight for "${component.name}" cannot be negative`,
      );
    }

    totalWeight += component.weight;
  }

  if (Math.abs(totalWeight - 1) > WEIGHT_EPSILON) {
    throw new Error(
      `combineScores(): weights must sum to 1. Received ${totalWeight}`,
    );
  }
}

/**
 * Combines multiple normalized score components
 * into a single weighted score.
 *
 * All component scores are expected to already
 * be normalized to the range 0–100.
 */
export function combineScores(components: ScoreComponent[]): number {
  validateComponents(components);

  let total = 0;

  for (const component of components) {
    total += component.score * component.weight;
  }

  return clamp(total);
}
