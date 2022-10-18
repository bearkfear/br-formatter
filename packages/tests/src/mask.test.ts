import { test, expect } from "vitest";
import { stringify } from "mask";

test("should run test with single mask", () => {
  expect(stringify("1234567", "X-X-X-X-X-XX")).toBe("1-2-3-4-5-67");
});


test("should run test with value minor than mask", () => {
    expect(stringify("12345", "X-X-X-X-X-XX")).toBe("1-2-3-4-5-");
  });
  