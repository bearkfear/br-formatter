import { Mask, masker, Value } from "./masker";
import { defaultTokens } from "./tokens";

export function stringify(
  value: Value,
  masks: Mask,
  tokens = defaultTokens
): string {
  if (masks.length === 0 || value === "") {
    return "";
  }

  if (Array.isArray(masks)) {
    const sorted = masks.sort((a, b) => {
      return a.length - b.length;
    });

    const maskedValues = sorted
      .map((mask) => {
        const masked = masker(value, mask, tokens);

        const exact = masked.result.length === mask.length;

        return { ...masked, exact };
      })
      .sort((a, b) => b.result.length - a.result.length);

    const finded = maskedValues.find(
      (item) => item.exact && item.hasRest === false
    );

    if (finded) {
      return finded.result;
    }

    return maskedValues[0].result;
  }

  return masker(value, masks, tokens).result;
}

export default stringify;
