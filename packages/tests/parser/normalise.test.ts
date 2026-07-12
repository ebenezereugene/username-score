import { describe, expect, test } from "vitest";
import { normaliseUsername } from "../../src/parser/normalise.js";

describe("normaliseUsername", () => {
  test("removes spaces", () => {
    expect(normaliseUsername("john doe")).toBe("johndoe");
  });

  test("converts uppercase letters to lowercase", () => {
    expect(normaliseUsername("JohnDOE")).toBe("johndoe");
  });

  test("removes emojis", () => {
    expect(normaliseUsername("john🔥")).toBe("john");
  });

  test("keeps numbers", () => {
    expect(normaliseUsername("john99")).toBe("john99");
  });

  test("keeps underscores and periods", () => {
    expect(normaliseUsername("john.doe_99")).toBe("john.doe_99");
  });

  test("removes unsupported symbols", () => {
    expect(normaliseUsername("john@doe!")).toBe("johndoe");
  });
});
