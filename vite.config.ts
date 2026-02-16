import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [sveltekit(), wasm(), devtoolsJson(), topLevelAwait()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["pyodide"],
  },
});
