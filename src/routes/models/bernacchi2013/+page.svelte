<!--
  Bernacchi 2013 — FvCB model of C3 photosynthesis as reviewed in
  Bernacchi et al. (2013), Plant Cell Environ., doi:10.1111/pce.12118.

  Net CO₂ assimilation An = min(Ac, Aj, Ap), each net of day respiration Rd:
    Ac — Rubisco-limited rate (Vcmax, Kc, Ko, Γ*)
    Aj — RuBP-regeneration-limited rate (J from a non-rectangular hyperbola
         of absorbed PPFD and Jmax)
    Ap — triose-phosphate-utilisation-limited rate (TPU)
  A pure algebraic steady-state model swept over Ci — no ODE worker needed.
-->
<script lang="ts">
  import type { SteadyStateAnalyses } from "#lib";
  import SteadyStateDashboard from "#lib/SteadyStateDashboard.svelte";
  import {
    SectionMain as Main,
    Text,
  } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  let analyses: SteadyStateAnalyses = $state([
    {
      type: "steadyState" as const,
      id: 0,
      idx: 0,
      title: "Assimilation vs Ci",
      span: 3,
      parameter: "Ci",
      min: 0,
      max: 1000,
      steps: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: 60,
      selectedKeys: ["an", "rubisco", "rubp", "tpu"],
      lineDisplay: "current",
    },
  ]);
</script>

<svelte:head>
  <title>Bernacchi 2013 - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <SteadyStateDashboard
    name="Bernacchi 2013"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Bernacchi 2013</h1>
    <Text>
      Bernacchi et al. (2013) review the Farquhar, von Caemmerer & Berry (FvCB)
      model of C3 photosynthesis and show how the same steady-state framework
      scales from the chloroplast to canopies and ecosystems. Net CO₂
      assimilation <em>An</em> is the minimum of three limiting rates, each net
      of day respiration <em>Rd</em>: the Rubisco-limited rate <em>Ac</em>, the
      RuBP-regeneration-limited rate <em>Aj</em> and the
      triose-phosphate-utilisation-limited rate <em>Ap</em>.
    </Text>
    <Text>
      The electron transport rate <em>J</em> is computed from absorbed light
      (PPFD) and <em>Jmax</em> with a non-rectangular hyperbola, so the curves
      respond to both intercellular CO₂ (<em>Ci</em>) and light.
    </Text>
  </SteadyStateDashboard>
</Main>
