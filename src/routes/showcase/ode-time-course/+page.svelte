<script lang="ts">
  import { resolve } from "$app/paths";
  import { backends, type Analyses } from "#lib";
  import AnalysesDashboard from "#lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "../../models/sir/model";
  import { data } from "./data";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Simulation",
      col: 1,
      span: 6,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      showDerived: false,
      nTimePoints: 200,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>ODE Fitting: Time Series - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="SIR"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
    fitPreset={{ csv: data, fit: ["beta", "gamma"] }}
  >
    <h1>ODE fitting: time series</h1>
    <p>
      The simplest kind of fit: a measured time series, compared point by point
      against one simulation with constant parameters. This page uses the <a
        href={resolve("/models/sir")}>SIR epidemic model</a
      >
      and an outbreak observed every four days — the infected (<code>i</code>)
      and recovered (<code>r</code>) fractions, with a few percent of noise.
    </p>
    <p>
      Open "Fit": the data is already loaded and mapped by column name, and the
      infection rate <code>beta</code> and recovery rate <code>gamma</code> are selected
      for fitting. The model starts at β = 0.2, γ = 0.1; the data was generated with
      β = 0.35, γ = 0.08. Run the fit to recover them, then "Apply" to write the result
      back into the model.
    </p>
  </AnalysesDashboard>
</Main>
