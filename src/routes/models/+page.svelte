<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import schemeFvcb from "$lib/assets/fvcb.png";
  import schemeKea3 from "$lib/assets/kea3-tomato.png";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import scheme2016npq from "$lib/assets/matuszynska2016npq.png";
  import scheme2016phd from "$lib/assets/matuszynska2016phd.png";
  import schemeEnterobactin from "$lib/assets/mibinet-duo.png";
  import schemePopDyn from "$lib/assets/population-dynamics.png";
  import schemeSaadat from "$lib/assets/saadat2021.png";
  import schemeSir from "$lib/assets/sir.png";
  import schemeTripartite from "$lib/assets/tripartite.png";
  import schemeYokota from "$lib/assets/yokota.png";
  import { fuzzyMatch } from "$lib/utils";
  import {
    CardModel,
    GridGallery,
    H2,
    Icon,
    Row,
    SectionMain,
  } from "@computational-biology-aachen/design";

  type Model = { name: string; slug: string; image?: string };

  const odeModels: Model[] = [
    { name: "Lotka Volterra", slug: "lotka-volterra", image: schemeLotkaVolt },
    {
      name: "Population dynamics",
      slug: "population-dynamics",
      image: schemePopDyn,
    },
    {
      name: "Tripartite dynamics",
      slug: "tripartite",
      image: schemeTripartite,
    },
    {
      name: "Entrobactin",
      slug: "dynamic-entrobactin",
      image: schemeEnterobactin,
    },
    { name: "Yokota 1985", slug: "yokota1985", image: schemeYokota },
    { name: "Poolman 2000", slug: "poolman2000", image: scheme2016phd },
    {
      name: "Matuszyńska 2016 (NPQ)",
      slug: "matuszynska2016_npq",
      image: scheme2016npq,
    },
    {
      name: "Matuszyńska 2016 (PHD)",
      slug: "matuszynska2016_phd",
      image: scheme2016phd,
    },
    { name: "Matuszyńska 2019", slug: "matuszynska2019" },
    { name: "Saadat 2021", slug: "saadat2021", image: schemeSaadat },
    { name: "Ebeling 2026", slug: "ebeling-2026", image: schemeEbeling },
    { name: "Tomato KEA3", slug: "kea3-tomato", image: schemeKea3 },
    { name: "SIR", slug: "sir", image: schemeSir },
    { name: "Bellasio 2019", slug: "bellasio2019" },
    { name: "Davis 2017", slug: "davis2017" },
    { name: "Hahn 1987", slug: "hahn1987" },
    { name: "Lazar 1997", slug: "lazar1997" },
    { name: "Li 2021", slug: "li2021" },
  ];

  const steadyStateModels: Model[] = [
    { name: "FvCB", slug: "fvcb", image: schemeFvcb },
  ];

  let query = $state("");

  const filteredOde = $derived(
    odeModels
      .filter((m) => fuzzyMatch(m.name, query))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  );
  const filteredSteadyState = $derived(
    steadyStateModels
      .filter((m) => fuzzyMatch(m.name, query))
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  );
</script>

<svelte:head>
  <title>Models - mxlweb</title>
</svelte:head>

<SectionMain align="start">
  <Row
    justify="between"
    stack
  >
    <div class="heading">
      <Icon color="primary">bolt</Icon>
      <H2>Select a pre-defined model</H2>
    </div>
    <input
      type="search"
      class="filter"
      placeholder="Filter models…"
      bind:value={query}
    />
  </Row>

  {#if filteredOde.length > 0}
    <GridGallery title="ODE models">
      {#each filteredOde as model (model.slug)}
        <CardModel
          name={model.name}
          href="{base}/models/{model.slug}"
          image={model.image}
        />
      {/each}
    </GridGallery>
  {/if}

  {#if filteredSteadyState.length > 0}
    <GridGallery title="Steady-state models">
      {#each filteredSteadyState as model (model.slug)}
        <CardModel
          name={model.name}
          href="{base}/models/{model.slug}"
          image={model.image}
        />
      {/each}
    </GridGallery>
  {/if}

  {#if filteredOde.length === 0 && filteredSteadyState.length === 0}
    <p class="empty">No models match “{query}”.</p>
  {/if}
</SectionMain>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    /* container-type: inline-size; */
    width: 100%;
  }

  .filter {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    padding: var(--space-2) var(--space-3);
    width: 100%;
    color: inherit;
    font: inherit;

    @media (min-width: 768px) {
      max-width: 320px;
    }
  }

  .empty {
    color: var(--color-text-muted);
  }
</style>
