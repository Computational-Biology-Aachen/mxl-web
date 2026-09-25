import type { ModelMeta, ModelType, System } from "./models";
import { systemLabels, typeLabels } from "./models";
import { fuzzyMatch } from "./utils";

export type SortKey = "name" | "year-desc" | "year-asc";

export const sortLabels: Record<SortKey, string> = {
  name: "Name (A–Z)",
  "year-desc": "Year (newest first)",
  "year-asc": "Year (oldest first)",
};

export type Filters = {
  query: string;
  systems: System[];
  /** Empty string means all types. */
  type: ModelType | "";
  sort: SortKey;
};

export const defaultFilters: Filters = {
  query: "",
  systems: [],
  type: "",
  sort: "name",
};

/** Lowercase and strip diacritics, so "Matuszynska" finds "Matuszyńska". */
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function matchesQuery(model: ModelMeta, query: string): boolean {
  const needle = normalize(query).trim();
  if (needle === "") return true;

  const haystack = normalize(
    [
      model.name,
      model.authors,
      model.year,
      model.description,
      typeLabels[model.type],
      ...model.systems.map((s) => systemLabels[s]),
    ]
      .filter((x) => x !== undefined)
      .join(" "),
  );
  const terms = needle.split(/\s+/);
  return (
    terms.every((t) => haystack.includes(t)) ||
    fuzzyMatch(normalize(model.name), needle)
  );
}

export function compareModels(
  a: ModelMeta,
  b: ModelMeta,
  sort: SortKey,
): number {
  const byName = a.name.localeCompare(b.name);
  if (sort === "name") return byName;
  // Models without a year always sort last.
  if (a.year === undefined && b.year === undefined) return byName;
  if (a.year === undefined) return 1;
  if (b.year === undefined) return -1;
  const diff = sort === "year-desc" ? b.year - a.year : a.year - b.year;
  return diff || byName;
}

export function filterModels(
  models: ModelMeta[],
  filters: Filters,
): ModelMeta[] {
  return models
    .filter(
      (m) =>
        (filters.type === "" || m.type === filters.type) &&
        (filters.systems.length === 0 ||
          m.systems.some((s) => filters.systems.includes(s))) &&
        matchesQuery(m, filters.query),
    )
    .toSorted((a, b) => compareModels(a, b, filters.sort));
}

export function isFiltered(filters: Filters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.systems.length > 0 ||
    filters.type !== ""
  );
}

/** Parse filters from URL params; unknown or invalid values fall back to defaults. */
export function parseFilters(params: URLSearchParams): Filters {
  const systems = (params.get("system") ?? "")
    .split(",")
    .filter((s): s is System => Object.hasOwn(systemLabels, s));
  const type = params.get("type") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    query: params.get("q") ?? "",
    systems,
    type: Object.hasOwn(typeLabels, type) ? (type as ModelType) : "",
    sort: Object.hasOwn(sortLabels, sort)
      ? (sort as SortKey)
      : defaultFilters.sort,
  };
}

/** Serialize filters to URL params, omitting defaults. */
export function serializeFilters(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim() !== "") params.set("q", filters.query);
  if (filters.systems.length > 0)
    params.set("system", filters.systems.join(","));
  if (filters.type !== "") params.set("type", filters.type);
  if (filters.sort !== defaultFilters.sort) params.set("sort", filters.sort);
  return params;
}
