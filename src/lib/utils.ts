export function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
  return arr.map((x) => x[n]);
}

/**
 * Serialize a map of CSS custom-property overrides into an inline `style`
 * attribute value, e.g. `{ "--foo": "1px" }` -> `"--foo:1px"`. Skips
 * undefined values so callers can spread optional overrides directly in.
 */
export function toStyleString(
  vars: Record<string, string | undefined>,
): string {
  return Object.entries(vars)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

export const widthSmall = "800px";

export function linspace(min: number, max: number, steps: number): number[] {
  if (steps <= 1) return [min];
  return Array.from(
    { length: steps },
    (_, i) => min + (i / (steps - 1)) * (max - min),
  );
}

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
