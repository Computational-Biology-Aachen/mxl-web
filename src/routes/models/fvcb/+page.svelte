<!--
  FvCB model — Farquhar, von Caemmerer & Berry (1980) C3 photosynthesis.

  Net CO₂ assimilation (An) = min(Wc, Wj, Wp) · (1 − Γ*/Ci) − Rd, where:
    Wc — RuBisCO-limited rate (Vcmax, Kc, Ko, Γ*)
    Wj — electron-transport-limited rate (J, Γ*)
    Wp — triose-phosphate-utilisation-limited rate (Tp)
  A pure algebraic steady-state model swept over Ci — no ODE worker needed.
-->
<script lang="ts">
  import type { SteadyStateAnalyses } from "$lib";
  import SteadyStateDashboard from "$lib/SteadyStateDashboard.svelte";
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
      selectedKeys: ["an", "wc", "wj", "wp"],
      lineDisplay: "current",
    },
    {
      type: "steadyState" as const,
      id: 1,
      idx: 1,
      title: "Assimilation vs ccp",
      span: 3,
      parameter: "ccp",
      min: 0,
      max: 100,
      steps: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: 60,
      selectedKeys: ["an", "wc", "wj", "wp"],
      lineDisplay: "current",
    },
  ]);
</script>

<svelte:head>
  <title>FvCB - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <SteadyStateDashboard
    name="FvCB"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>FvCB</h1>
    <Text>
      The FvCB model (Farquhar, von Caemmerer & Berry, 1980) is a widely used
      framework for C3 photosynthesis. It describes net carbon assimilation
      <em>An</em> as the minimum of three potential rates — the RuBisCO-limited
      rate <em>Wc</em>, the electron-transport-limited rate <em>Wj</em>, and the
      triose-phosphate-utilisation-limited rate <em>Wp</em> — evaluated across a
      range of intercellular CO₂ (<em>Ci</em>).
    </Text>
  </SteadyStateDashboard>
</Main>
