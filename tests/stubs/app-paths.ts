// Stub for SvelteKit's `$app/paths` virtual module — see
// tests/stubs/app-environment.ts for why this alias exists at all. `base`
// is the correct "no base path configured" value outside a real SvelteKit
// build.
export const base = "";
export const assets = "";
export const resolveRoute: (id: string) => string = (id) => id;
