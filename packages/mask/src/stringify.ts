import { defaultTokens, Tokens } from "./tokens";
export type Value = string | number;

export type Mask = Array<string> | string;

const masker = (value: Value, mask: string, tokens: Tokens) => {
  const stringifiedValue = String(value);
  let indexValue = 0;
  let resultMasked: string[] = [];

  for (let index = 0; index < mask.length; index++) {
    const token = tokens[mask[index]];
    let resultChar = "";
    if (token !== undefined) {
      resultChar = stringifiedValue[indexValue];

      if (resultChar === undefined) {
        break;
      }
      indexValue++;

      if (token.pattern) {
        const mathResult = resultChar.match(token.pattern);

        if (mathResult === null || mathResult.length === 0) {
          resultChar = "";
        }
      }
      if (token.transform) {
        resultChar = token.transform(resultChar);
      }
    } else {
      resultChar = mask[index];
    }

    if (resultChar.length) {
      resultMasked.push(resultChar);
    }
  }

  return resultMasked.join("");
};

export function stringify(
  value: Value,
  masks: Mask,
  tokens = defaultTokens
): string {
  if (Array.isArray(masks)) {
    let maskedResult = "";
    for (const mask of masks.sort((a, b) => b.length - a.length)) {
      const masked = masker(value, mask, tokens);
      maskedResult = masked;

      if (masked.length === mask.length) {
        return maskedResult;
      }
    }
    return maskedResult;
  }
  return masker(value, masks, tokens);
}

export default stringify;