export function parse(entry: string): number {
  return parseFloat(String(entry).split(".").join("").replace(",", "."));
}

export default parse;
