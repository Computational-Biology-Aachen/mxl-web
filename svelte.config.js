import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import { createHighlighter } from "shiki";
import { existsSync } from "fs";

// In the meta-repo, resolve the workspace packages from source for live edits;
// standalone installs fall back to the published package via its exports map.
const designSrc = new URL("../design/src/lib", import.meta.url).pathname;
const coreSrc = new URL("../../pkg/mxlweb-core/src", import.meta.url).pathname;
const workspaceAlias = {
  ...(existsSync(designSrc)
    ? { "@computational-biology-aachen/design": designSrc }
    : {}),
  ...(existsSync(coreSrc)
    ? { "@computational-biology-aachen/mxlweb-core": coreSrc }
    : {}),
};

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".md"],
  highlight: {
    highlighter: async (code, lang = "text") => {
      const highlighter = await createHighlighter({
        themes: ["poimandres"],
        langs: ["javascript", "typescript"],
      });
      await highlighter.loadLanguage("javascript", "typescript");
      const html = escapeSvelte(
        // @ts-ignore
        highlighter.codeToHtml(code, { lang, theme: "poimandres" }),
      );
      return `{@html \`${html}\` }`;
    },
  },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    alias: workspaceAlias,
    adapter: adapter({
      pages: "build",
      assets: "build",
      precompress: false,
      strict: true,
    }),
    paths: {
      base: process.argv.includes("dev") ? "" : "/mxl-web",
    },
  },
};

export default config;
