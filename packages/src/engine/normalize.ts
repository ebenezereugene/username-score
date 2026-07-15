// engine/normalize.ts

/**
 * Ensures a value is a finite number.
 */
function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number. Received: ${value}`);
  }
}

/**
 * Converts a value from any range into
 * a 0–100 score range.
 *
 * Values outside the input range are clamped
 * to keep the final score within bounds.
 *
 * Example:
 *
 * normalize(5, 0, 10)
 * // → 50
 */
export function normalize(value: number, min: number, max: number): number {
  assertFinite(value, "value");
  assertFinite(min, "min");
  assertFinite(max, "max");

  if (max <= min) {
    throw new Error(
      `normalize(): max (${max}) must be greater than min (${min})`,
    );
  }

  const normalized = ((value - min) / (max - min)) * 100;

  return clamp(normalized);
}

/**
 * Restricts a value to a specified range.
 *
 * Defaults to the scoring range of 0–100.
 *
 * Example:
 *
 * clamp(120)
 * // → 100
 */
export function clamp(value: number, min = 0, max = 100): number {
  assertFinite(value, "value");
  assertFinite(min, "min");
  assertFinite(max, "max");

  if (min > max) {
    throw new Error(
      `clamp(): min (${min}) must not be greater than max (${max})`,
    );
  }

  return Math.min(Math.max(value, min), max);
}

/**
 * Converts a decimal value in the range 0–1
 * into a percentage score in the range 0–100.
 *
 * Throws if the input is outside the expected
 * range to catch scorer bugs early.
 *
 * Example:
 *
 * percentage(0.85)
 * // → 85
 */
export function percentage(value: number): number {
  assertFinite(value, "value");

  if (value < 0 || value > 1) {
    throw new Error(
      `percentage(): expected a value between 0 and 1. Received: ${value}`,
    );
  }

  return value * 100;
}
