import { test, expect } from "vitest";
import { stringify, masks } from "../src";

test("should format as CEP", () => {
  expect(stringify(9999999, masks.cep)).toBe("99999-99");
});

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

test("should test multiple masks with varing the value length", () => {
  const maskToTest = ["####-##-###", "##--##", "###-##"];
  expect(stringify("12345", maskToTest)).toBe("123-45");
  expect(stringify("123456", maskToTest)).toBe("1234-56-");
  expect(stringify("1234", maskToTest)).toBe("12--34");
});

test("should format with multiple masks that end with char that is not token", () => {
  const maskToTest = ["##,##%", "###,##%"];
  expect(stringify("1234", maskToTest)).toBe("12,34%");
  expect(stringify("12345", maskToTest)).toBe("123,45%");
});

test("Should format with incomplete masks ending with not token", () => {
  const maskToTest = "##,##%%";
  expect(stringify("12A4", maskToTest)).toBe("12,4");
});

test("Should format gradually with multiple masks", () => {
  const masksToTest = ["#,##%", "##,##%", "###,##%"];
  expect(stringify("9", masksToTest)).toBe("9,");
  expect(stringify("999", masksToTest)).toBe("9,99%");
  expect(stringify("9999", masksToTest)).toBe("99,99%");
  expect(stringify("99999", masksToTest)).toBe("999,99%");
});


test("Should return empty mask when value is empty", () => { 
  expect(stringify("", "(##)")).toBe("");
})