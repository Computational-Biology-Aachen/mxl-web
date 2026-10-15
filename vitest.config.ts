import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // SvelteKit's $app/env only resolves under the full
      // @sveltejs/kit/vite plugin (vite.config.ts's dev/build pipeline,
      // not wired into this standalone vitest config) — see
      // tests/stubs/app-env.ts.
      "$app/env": fileURLToPath(
        new URL("./tests/stubs/app-env.ts", import.meta.url),
      ),
      "$app/paths": fileURLToPath(
        new URL("./tests/stubs/app-paths.ts", import.meta.url),
      ),
    },
  },
  test: {
    server: {
      deps: {
        // mxlweb-core's ./workers subpath imports its fit worker via Vite's
        // `?worker&url` — only Vite can load that, so run the package through
        // Vite's transform pipeline instead of externalizing it to plain Node.
        inline: [/@computational-biology-aachen\/mxlweb-core/],
      },
    },
    coverage: {
      provider: "v8", // or 'istanbul'
    },
  },
});
