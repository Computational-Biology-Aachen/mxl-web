import { describe, expect, it } from "vitest";
import {
  defaultFilters,
  filterModels,
  parseFilters,
  serializeFilters,
  type Filters,
} from "../src/lib/modelFilters";
import { models } from "../src/lib/models";

const run = (f: Partial<Filters>) =>
  filterModels(models, { ...defaultFilters, ...f }).map((m) => m.slug);

describe("registry", () => {
  it("has unique slugs", () => {
    const slugs = models.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("filterModels", () => {
  it("returns every model, sorted by name, with default filters", () => {
    const names = filterModels(models, defaultFilters).map((m) => m.name);
    expect(names).toHaveLength(models.length);
    expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b)));
  });

  it("filters by type", () => {
    const slugs = run({ type: "steady-state" });
    expect(slugs.toSorted()).toEqual(["bernacchi2023", "fvcb", "johnson2021"]);
  });

  it("combines systems with OR", () => {
    const slugs = run({ systems: ["ecology", "epidemiology"] });
    expect(slugs.toSorted()).toEqual(["lotka-volterra", "sir"]);
  });

  it("matches a multi-tag model on any of its tags", () => {
    expect(run({ systems: ["iron-metabolism"] })).toEqual([
      "dynamic-entrobactin",
    ]);
    expect(run({ systems: ["mixed-culture"] })).toContain(
      "dynamic-entrobactin",
    );
  });

  it("searches metadata beyond the name, all terms must match", () => {
    expect(run({ query: "iron coli" })).toEqual(["dynamic-entrobactin"]);
  });

  it("ignores diacritics", () => {
    expect(run({ query: "Matuszynska 2019" })).toContain("matuszynska2019");
  });

  it("falls back to fuzzy name matching", () => {
    expect(run({ query: "lkvlt" })).toContain("lotka-volterra");
  });

  it("sorts by year, unknown years last", () => {
    const desc = filterModels(models, { ...defaultFilters, sort: "year-desc" });
    expect(desc[0].year).toBe(2026);
    expect(desc.at(-1)?.year).toBeUndefined();
    const asc = filterModels(models, { ...defaultFilters, sort: "year-asc" });
    expect(asc[0].year).toBe(1926);
    expect(asc.at(-1)?.year).toBeUndefined();
  });
});

describe("URL state", () => {
  it("omits defaults", () => {
    expect(serializeFilters(defaultFilters).toString()).toBe("");
  });

  it("round-trips", () => {
    const f: Filters = {
      query: "photo",
      systems: ["photosynthesis", "ecology"],
      type: "ode",
      sort: "year-desc",
    };
    expect(parseFilters(serializeFilters(f))).toEqual(f);
  });

  it("ignores unknown or invalid values", () => {
    const f = parseFilters(
      new URLSearchParams("system=nope,constructor,ecology&type=x&sort=y"),
    );
    expect(f).toEqual({ ...defaultFilters, systems: ["ecology"] });
  });
});
