import { defaultTokens, Tokens } from "./tokens";
export type Value = string | number;

export type Mask = Array<string> | string;

const masker = (valueToMask: Value, mask: string, tokens: Tokens) => {
  const MAXIMUM_ITERATION_LOOP = 1000;

  const value = String(valueToMask);
  let result = "";

  let maskCharIndex = 0;
  let valueCharIndex = 0;

  for (let index = 0; index < MAXIMUM_ITERATION_LOOP; index++) {
    // if mask is ended, break.
    if (maskCharIndex === mask.length) {
      break;
    }

    // if value is ended, break.
    if (valueCharIndex === value.length) {
      break;
    }

    let maskChar = mask[maskCharIndex];
    let valueChar = value[valueCharIndex];

    // value equals mask, just set
    if (maskChar === valueChar) {
      result += maskChar;
      valueCharIndex += 1;
      maskCharIndex += 1;
      continue;
    }

    type TransformHandler = ((v: string) => string) | undefined;

    // apply translator if match
    let translationHandler: TransformHandler = undefined;
    if (tokens[maskChar]) {
      translationHandler = (v: string) => {
        const token = tokens[maskChar];

        let tempV = v;

        if (token.transform) {
          tempV = token.transform(tempV);
        }

        if (token.pattern) {
          tempV = tempV.replace(token.pattern, "");
        }

        return tempV;
      };
    }

    if (translationHandler) {
      const resolverValue = translationHandler(valueChar || "");
      if (resolverValue === "") {
        //valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
        valueCharIndex += 1;
        continue;
      } else if (resolverValue !== null) {
        result += resolverValue;
        valueCharIndex += 1;
      } else {
        result += maskChar;
      }
      maskCharIndex += 1;
      continue;
    }

    // not masked value, fixed char on mask
    result += maskChar;
    maskCharIndex += 1;
    continue;
  }

  return result;
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
