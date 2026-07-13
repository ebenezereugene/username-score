// extractors/length.ts

import {
  ABSOLUTE_MAX_LENGTH,
  MAX_IDEAL_LENGTH,
  MIN_IDEAL_LENGTH,
} from "../constants/length.constants.js";
import type { Extractor } from "./types.js";

const FEATURE_NAME = "length";

export type LengthCategory =
  | "below-ideal"
  | "ideal"
  | "above-ideal"
  | "excessive";

export function evaluateLength(length: number): {
  value: number;
  category: LengthCategory;
} {
  if (length < MIN_IDEAL_LENGTH) {
    return {
      value: length <= 2 ? 0.2 : 0.4,
      category: "below-ideal",
    };
  }

  if (length <= MAX_IDEAL_LENGTH) {
    if (length === MIN_IDEAL_LENGTH) {
      return { value: 0.7, category: "ideal" };
    }

    if (length <= 12) {
      return { value: 1.0, category: "ideal" };
    }

    return {
      value: 1 - (length - 12) * 0.05,
      category: "ideal",
    };
  }

  if (length <= ABSOLUTE_MAX_LENGTH) {
    const over = length - MAX_IDEAL_LENGTH;

    return {
      value: 0.9 - over * 0.1,
      category: "above-ideal",
    };
  }

  return {
    value: 0.2,
    category: "excessive",
  };
}

export const lengthExtractor: Extractor = {
  name: FEATURE_NAME,

  extract(username) {
    const length = username.normalized.length;
    const { value, category } = evaluateLength(length);

    return {
      name: FEATURE_NAME,
      value,
      metadata: {
        length,
        category,

        minIdealLength: MIN_IDEAL_LENGTH,
        maxIdealLength: MAX_IDEAL_LENGTH,
        absoluteMaxLength: ABSOLUTE_MAX_LENGTH,

        isBelowIdeal: category === "below-ideal",
        isIdeal: category === "ideal",
        isAboveIdeal: category === "above-ideal",
        isExcessive: category === "excessive",
      },
    };
  },
};
