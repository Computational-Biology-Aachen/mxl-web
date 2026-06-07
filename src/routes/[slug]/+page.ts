import { base } from "$app/paths";
import { aliasSlugs } from "$lib/modelAliases";
import { error, redirect } from "@sveltejs/kit";
import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () =>
  aliasSlugs.map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  if (!aliasSlugs.includes(params.slug)) error(404);
  redirect(308, `${base}/models/${params.slug}`);
};
