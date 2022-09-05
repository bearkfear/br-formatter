import { expect, test, describe } from "vitest";
import { parse, stringify } from "money";
import cases from "./__cases__/money.json";

describe("should test parse method", () => {
  for (const testCase of cases.parse) {
    test(`should parse ${testCase.from} to native value ${testCase.to}`, () => {
      expect(parse(testCase.from)).toBe(testCase.to);
    });
  }
});

describe("should test stringify method", () => {
  test("should stringify value 1 to external value 1", () => {
    expect(stringify(1)).toBe("1");
  });
});
