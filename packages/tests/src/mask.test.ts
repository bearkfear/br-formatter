import { test, expect } from "vitest";
import { stringify } from "mask";

test("should run test with single mask", () => {
  expect(stringify("1234567", "X-X-X-X-X-XX")).toBe("1-2-3-4-5-67");
});

test("should run test with value minor than mask", () => {
  expect(stringify("12345", "X-X-X-X-X-XX")).toBe("1-2-3-4-5-");
});

test("should run test with value major than mask", () => {
  expect(stringify("123456789011", "X-X-X-X-X-XX")).toBe("1-2-3-4-5-67");
});

test("should format when has more than one mask", () => {
  const masks = ["X-X-X-X-X-XX", "X-X-X-X-X-XXXX", "X-X-X-X-X-XXX"];

  expect(stringify("1234567", masks)).toBe("1-2-3-4-5-67");
  expect(stringify("123", masks)).toBe("1-2-3-");
  expect(stringify("123456789", masks)).toBe("1-2-3-4-5-6789");
  expect(stringify("12345678", masks)).toBe("1-2-3-4-5-678");
});
