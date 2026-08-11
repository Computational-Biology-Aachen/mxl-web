# ADR 0003: Shared `design` Package for CPBL Branding

**Status:** Implemented
**Scope:** `@computational-biology-aachen/design` dependency (59+ files import it)

---

## 1. Context

MxlWeb depends on `@computational-biology-aachen/design`
(`github:Computational-Biology-Aachen/design`) — a separate repo providing CPBL design
tokens and Svelte components — used across 59+ files in this site. The same package is
shared by GreenSloth and ComPhot.

## 2. Decision

Pull design tokens and shared Svelte components from a single external `design` package
rather than maintaining site-local styling/component primitives.

## 3. Rationale

All CPBL web tools (MxlWeb, GreenSloth, ComPhot) should present a consistent visual
identity without each site independently maintaining (and inevitably drifting from) its
own copy of tokens and base components. Centralizing this in one dependency means a
branding update propagates to every site by bumping one dependency, rather than being
manually re-applied per site.

## 4. Consequences

- Site-specific styling should build on top of `design`'s tokens/components, not
  duplicate or fork them locally.
- A branding change belongs in the `design` repo, not patched around in individual
  sites.
