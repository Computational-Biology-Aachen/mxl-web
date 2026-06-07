/** Model slugs that get a short-URL alias (`/<slug>` → `/models/<slug>`). */
export const aliasSlugs: string[] = Object.keys(
  import.meta.glob("/src/routes/models/*/+page.svelte"),
)
  .map((path) => path.split("/").at(-2) as string)
  .filter((slug) => slug !== "new");
