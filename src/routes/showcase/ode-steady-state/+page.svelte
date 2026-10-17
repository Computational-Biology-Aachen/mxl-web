<script lang="ts">
  import { backends, type Analyses } from "#lib";
  import AnalysesDashboard from "#lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { data } from "./data";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Induction",
      col: 1,
      span: 3,
      tEnd: 200,
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
    {
      type: "parameterScan" as const,
      id: 1,
      idx: 1,
      title: "Dose response",
      span: 3,
      parameter: "inducer",
      min: 0,
      max: 32,
      steps: 33,
      tEnd: 500,
      tolerance: 1e-6,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      selectedKeys: ["mRNA", "protein"],
      lineDisplay: "current" as const,
    },
  ]);
</script>

<svelte:head>
  <title>ODE Fitting: Steady States - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Inducible gene expression"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
    fitPreset={{
      csv: data,
      dataKind: "steadyState",
      fit: ["K_ind", "v_max"],
    }}
  >
    <h1>ODE fitting: steady states</h1>
    <p>
      Often only the end point of an experiment is measured: the steady state a
      system settles into under each of several conditions. Here, an inducer
      switches on transcription of a gene through a Hill function; mRNA and
      protein were measured once they had settled, at nine inducer
      concentrations — a dose-response curve.
    </p>
    <p>
      In a steady-state fit, every row of the data is one condition. Columns
      named after a parameter (<code>inducer</code>) set that parameter for the
      row; the rest are observations. Each condition is integrated from the
      initial state until it stops changing, and those steady states are
      compared against the data. Open "Fit" to see the mapping: the
      half-activation constant <code>K_ind</code> (starting at 5, true value 2)
      and the maximal transcription rate <code>v_max</code> (starting at 1, true value
      1.5) are selected for fitting.
    </p>
  </AnalysesDashboard>
</Main>
