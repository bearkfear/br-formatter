import { defaultTokens, Tokens } from "./tokens";
export type Value = string | number;

export type Mask = Array<string> | string;
type TransformHandler = ((v: string) => string) | undefined;

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
          const match = tempV.match(token.pattern);
          if (!(match && match.length)) {
            tempV = "";
          }
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

  return { result, hasRest: value.length > valueCharIndex };
};

export function stringify(
  value: Value,
  masks: Mask,
  tokens = defaultTokens
): string {
  if (Array.isArray(masks)) {
    const sorted = masks.sort((a, b) => {
      return a.length - b.length;
    });

    let lastMasked = "";
    let lastMask = "";
    for (const mask of sorted) {
      const masked = masker(value, mask, tokens);

      if (mask.length === masked.result.length && masked.hasRest === false) {
        return masked.result;
      }

      lastMasked = masked.result;
      lastMask = mask;
    }
    return lastMasked;
  } else {
    return masker(value, masks, tokens).result;
  }
}

export default stringify;
