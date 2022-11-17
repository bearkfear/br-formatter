import { Mask, masker, Value } from "./masker";
import { defaultTokens } from "./tokens";

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
  }

  return masker(value, masks, tokens).result;
}

export default stringify;
