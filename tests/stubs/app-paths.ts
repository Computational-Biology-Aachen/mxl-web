// Stub for SvelteKit's `$app/paths` virtual module — see
// tests/stubs/app-env.ts for why this alias exists at all. These match a
// SvelteKit build with no base path configured.
export const resolve = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;
export const asset = (file: string): string => `/${file}`;
