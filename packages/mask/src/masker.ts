import { Tokens } from "./tokens";

export type Value = string | number;
export type Mask = Array<string> | string;

type Masker = (
  valueToMask: Value,
  mask: string,
  tokens: Tokens
) => { result: string; hasRest: boolean };

export const masker: Masker = (valueToMask, mask, tokens) => {
  let value = String(valueToMask).split("");

  const result: string[] = [];

  for (const maskChar of mask) {
    if (maskChar in tokens) {
      if (value.length === 0) {
        break;
      }
      const maskOptions = tokens[maskChar];

      while (value.length !== 0) {
        let newChar = value[0];
        value.shift();

        if (
          maskOptions.pattern &&
          newChar.match(maskOptions.pattern) === null
        ) {
          newChar = "";
        }

        if (newChar !== "") {
          result.push(newChar);
          break;
        }
      }
    } else {
      result.push(maskChar);
    }
  }

  return { result: result.join(""), hasRest: value.length !== 0 };
};
