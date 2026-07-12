import { describe, expect, test } from "vitest";
import { tokenizeUsername } from "../../src/parser/tokenise.js";

describe("tokenizeUsername", () => {
  test("splits words and numbers", () => {
    expect(tokenizeUsername("john99")).toEqual(["john", "99"]);
  });

  test("handles usernames with separators", () => {
    expect(tokenizeUsername("john_doe99")).toEqual(["john", "_", "doe", "99"]);
  });

  test("handles periods", () => {
    expect(tokenizeUsername("john.doe")).toEqual(["john", ".", "doe"]);
  });

  test("returns empty array for empty input", () => {
    expect(tokenizeUsername("")).toEqual([]);
  });
});
