import { describe, expect, test } from "vitest";
import { parseUsername } from "../../src/parser/parser.js";

describe("parseUsername", () => {
  test("creates a complete username object", () => {
    const result = parseUsername("John_Doe99");

    expect(result).toEqual({
      original: "John_Doe99",

      normalized: "john_doe99",

      tokens: ["john", "_", "doe", "99"],

      length: 10,

      features: {
        hasNumbers: true,
        hasSeparator: true,
        separatorCount: 1,
      },
    });
  });

  test("handles usernames without numbers", () => {
    const result = parseUsername("john");

    expect(result.features.hasNumbers).toBe(false);
  });

  test("handles usernames without separators", () => {
    const result = parseUsername("john99");

    expect(result.features.hasSeparator).toBe(false);

    expect(result.features.separatorCount).toBe(0);
  });

  test("preserves original username", () => {
    const result = parseUsername(" John🔥Doe ");

    expect(result.original).toBe(" John🔥Doe ");
  });
});
