// Stub for SvelteKit's `$app/environment` virtual module, which only
// resolves under the full `@sveltejs/kit/vite` plugin (wired into
// `vite.config.ts` for the dev/build/preview pipeline, not into
// `vitest.config.ts`). Aliased in for plain `vitest run` so a unit test can
// import a module that happens to touch `$app/environment` (e.g.
// `stores/backends.ts`) without needing the full SvelteKit test harness —
// `browser: false` is the correct value outside a real browser regardless.
export const browser = false;
export const building = false;
export const dev = true;
export const version = "test";
