<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { base } from "$app/paths";
  import CardModel from "$lib/CardModel.svelte";
  import FilterDropdown from "$lib/FilterDropdown.svelte";
  import {
    defaultFilters,
    filterModels,
    isFiltered,
    parseFilters,
    serializeFilters,
    sortLabels,
    type SortKey,
  } from "$lib/modelFilters";
  import {
    models,
    systemLabels,
    typeLabels,
    type ModelType,
    type System,
  } from "$lib/models";
  import { H2, Icon, SectionMain } from "@computational-biology-aachen/design";
  import { onMount } from "svelte";

  const systemOptions = (Object.keys(systemLabels) as System[])
    .filter((s) => models.some((m) => m.systems.includes(s)))
    .map((s) => ({ value: s, label: systemLabels[s] }));
  const typeOptions = (Object.keys(typeLabels) as ModelType[])
    .filter((t) => models.some((m) => m.type === t))
    .map((t) => ({ value: t, label: typeLabels[t] }));
  const sortOptions = (Object.keys(sortLabels) as SortKey[]).map((k) => ({
    value: k,
    label: sortLabels[k],
  }));

  let query = $state(defaultFilters.query);
  let systems: string[] = $state(defaultFilters.systems);
  let type: string = $state(defaultFilters.type);
  let sort: string = $state(defaultFilters.sort);

  // Query params are unavailable while prerendering, so the URL state is
  // applied after mount, and only then written back.
  let restored = $state(false);

  onMount(() => {
    const filters = parseFilters(new URLSearchParams(location.search));
    query = filters.query;
    systems = filters.systems;
    type = filters.type;
    sort = filters.sort;
    restored = true;
  });

  const filters = $derived({
    query,
    systems: systems as System[],
    type: type as ModelType | "",
    sort: sort as SortKey,
  });

  $effect(() => {
    if (!restored) return;
    const search = serializeFilters(filters).toString();
    const next =
      location.pathname + (search ? `?${search}` : "") + location.hash;
    if (next !== location.pathname + location.search + location.hash) {
      replaceState(next, {});
    }
  });

  const shown = $derived(filterModels(models, filters));
  const active = $derived(isFiltered(filters));

  function clearFilters() {
    query = defaultFilters.query;
    systems = defaultFilters.systems;
    type = defaultFilters.type;
  }
</script>

<svelte:head>
  <title>Models - mxlweb</title>
</svelte:head>

<SectionMain align="start">
  <div class="heading">
    <H2>Explore models</H2>
    <p class="subtitle">
      Browse and filter pre-defined models, then simulate them in your browser.
    </p>
  </div>

  <div class="controls">
    <label class="search">
      <span class="search-icon"><Icon>search</Icon></span>
      <input
        type="search"
        placeholder="Search models, e.g. photosynthesis, E. coli, iron metabolism…"
        bind:value={query}
      />
    </label>
    <FilterDropdown
      label="Biological system"
      allLabel="All systems"
      options={systemOptions}
      multiple
      bind:values={systems}
    />
    <FilterDropdown
      label="Model type"
      allLabel="All types"
      options={typeOptions}
      bind:value={type}
    />
    <FilterDropdown
      label="Sort by"
      options={sortOptions}
      bind:value={sort}
    />
  </div>

  <div class="status">
    <span>
      {active ? `${shown.length} of ${models.length}` : models.length} models
    </span>
    {#if active}
      <button
        type="button"
        class="clear"
        onclick={clearFilters}
      >
        Clear filters
      </button>
    {/if}
  </div>

  {#if shown.length > 0}
    <div class="grid">
      {#each shown as model (model.slug)}
        <CardModel
          model={model}
          href="{base}/models/{model.slug}"
        />
      {/each}
    </div>
  {:else}
    <div class="empty">
      <p>No models match your filters.</p>
      <button
        type="button"
        class="clear"
        onclick={clearFilters}
      >
        Clear filters
      </button>
    </div>
  {/if}
</SectionMain>

<style>
  .heading {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    width: 100%;
  }

  .subtitle {
    margin: 0;
    color: var(--color-text-muted);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    width: 100%;
  }

  .controls :global(.dropdown) {
    flex: 1 1 10rem;
  }

  .search {
    display: flex;
    flex: 1 1 100%;
    align-items: center;
    gap: var(--space-2);
    border: var(--border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    padding: 0 var(--space-3);

    @media (min-width: 900px) {
      flex: 1 1 20rem;
    }
  }

  .search-icon {
    display: flex;
    color: var(--color-text-muted);
  }

  .search:focus-within {
    border-color: var(--color-primary);
  }

  .search input {
    flex: 1;
    border: none;
    background: none;
    padding: var(--space-3) 0;
    min-width: 0;
    color: inherit;
    font: inherit;
  }

  .search input:focus {
    outline: none;
  }

  .status {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .clear {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    color: var(--color-primary);
    font: inherit;
    text-decoration: underline;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap);
    width: 100%;

    @media (min-width: 500px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 800px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media (min-width: 1100px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    color: var(--color-text-muted);
  }

  .empty p {
    margin: 0;
  }
</style>
