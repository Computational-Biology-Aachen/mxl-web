<script lang="ts">
  import { base } from "$app/paths";
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import scheme from "$lib/assets/lotka-volterra-scheme.png";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import FitUde from "./FitUde.svelte";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Short Simulation",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      showDerived: false,
      nTimePoints: 100,
      lineDisplay: "last",
    },
    {
      type: "simulation" as const,
      id: 1,
      idx: 1,
      title: "Extended Simulation",
      col: 4,
      span: 3,
      tEnd: 200,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      showDerived: true,
      nTimePoints: 500,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>UDE Fitting Showcase - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Lotka-Volterra UDE"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
    fitComponent={FitUde}
  >
    <h1>UDE fitting: Lotka-Volterra</h1>
    <p>
      A universal differential equation (UDE) augments an otherwise mechanistic
      model with a small neural-network correction term, trained alongside — or
      instead of — the model's own kinetic parameters. This page takes the
      ordinary <a href="{base}/models/lotka-volterra"
        >Lotka-Volterra predator-prey model</a
      > and attaches the default correction block (one hidden layer, softplus activation,
      relative-multiply mechanism — see the "NN Blocks" tab under "Edit model") to
      both state variables, left untrained.
    </p>
    <p>
      Open "Fit" to see it in action: the popover comes pre-loaded with a real
      predator-prey time series (25 points, hardcoded into this page) already
      mapped to the <code>Prey</code>/<code>Predator</code> columns. Enable the block
      for training and run the fit to watch the network learn the residual the mechanistic
      α/β/γ/δ terms alone can't capture.
    </p>
    <div class="centered">
      <img
        src={scheme}
        alt="Diagram of the Lotka-Volterra predator-prey system used as the mechanistic reference for this UDE fitting demo"
      />
    </div>
  </AnalysesDashboard>
</Main>

<style>
  img {
    max-width: min(90rem, 100%);
    max-height: 25rem;
  }

  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
