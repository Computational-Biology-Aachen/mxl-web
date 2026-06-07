export function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
  return arr.map((x) => x[n]);
}

export const widthSmall = "800px";

// Case-insensitive subsequence match: query chars appear in order in the name.
export function fuzzyMatch(name: string, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (needle === "") return true;
  let i = 0;
  for (const ch of name.toLowerCase()) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return false;
}
