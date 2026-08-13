import { cpSync, existsSync, readdirSync, readFileSync } from "fs";
import { createRequire } from "module";
import { dirname, extname, join } from "path";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type Plugin } from "vite";
import wasm from "vite-plugin-wasm";

const require = createRequire(import.meta.url);
const coreStatic = join(
  dirname(
    require.resolve("@computational-biology-aachen/mxlweb-core/package.json"),
  ),
  "static",
);

// In the meta-repo, svelte.config.js aliases the design package to its
// source under ../design/src/lib for live edits (see workspaceAlias there).
// That makes imports resolve relative to ../design, so a package it depends
// on (e.g. katex, for its fonts) can resolve to ../design's own nested
// node_modules rather than this project's — which SvelteKit's dev server
// doesn't allow serving from by default. Allow it explicitly when present.
const designNodeModules = new URL("../design/node_modules", import.meta.url)
  .pathname;
const designSrc = new URL("../design/src/lib", import.meta.url).pathname;

const MIME: Record<string, string> = {
  ".js": "application/javascript",
  ".wasm": "application/wasm",
};

function serveAndCopyCoreStatic(): Plugin {
  return {
    name: "mxlweb-core-static",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        const filePath = join(coreStatic, url);
        try {
          const content = readFileSync(filePath);
          res.setHeader(
            "Content-Type",
            MIME[extname(filePath)] ?? "application/octet-stream",
          );
          res.end(content);
        } catch {
          next();
        }
      });
    },
    closeBundle() {
      if (this.environment?.name !== "client") return;
      const wasmSrc = join(coreStatic, "wasm");
      // Copy into the client output dir so adapter-static picks them up
      const wasmDest = join(".svelte-kit", "output", "client", "wasm");
      const files = readdirSync(wasmSrc).filter((f) => f !== ".gitkeep");
      cpSync(wasmSrc, wasmDest, {
        recursive: true,
        filter: (f) => !f.endsWith(".gitkeep"),
      });
      this.warn?.(`copied ${files.length} wasm files → ${wasmDest}`);
    },
  };
}

export default defineConfig({
  plugins: [enhancedImages(), sveltekit(), wasm(), serveAndCopyCoreStatic()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: [
      "pyodide",
      "@computational-biology-aachen/design",
      "@computational-biology-aachen/mxlweb-core",
    ],
  },
  server: {
    port: 5175,
    strictPort: true,
    fs: {
      allow: existsSync(designSrc) ? [designNodeModules] : undefined,
    },
  },
});
