<script lang="ts">
  import { base } from "$app/paths";
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import FitNde from "./FitNde.svelte";
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
  <title>NDE Fitting Showcase - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Lotka-Volterra NDE"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
    fitComponent={FitNde}
  >
    <h1>NDE fitting: Lotka-Volterra</h1>
    <p>
      A neural differential equation (NDE) here replaces each reaction's rate
      law with a neural network, rather than correcting a differential equation
      directly (that's what the <a href="{base}/showcase/ude">UDE showcase</a>'s
      block does). This page keeps the same three reactions and predation
      stoichiometry (β, δ) as the UDE showcase's mechanistic
      <a href="{base}/models/lotka-volterra">Lotka-Volterra model</a>, but every
      reaction's rate law is fixed at 0 — the "NN Blocks" tab under "Edit model"
      shows a block set to correct reactions rather than equations, one network
      output per reaction, so the network alone has to discover how fast each
      reaction runs rather than refine a residual on top of a known rate. It
      composes additively (rate = 0 + scale·NN = scale·NN), since with no
      mechanistic rate left, relative-multiply's f·(1 + scale·NN) would collapse
      to 0 regardless of what the network learns.
    </p>
    <p>
      Open "Fit" to see it in action: the popover comes pre-loaded with the same
      25-point predator-prey time series as the UDE showcase, already mapped to
      the <code>Prey</code>/<code>Predator</code> columns. Run the fit to watch a
      network learn each reaction's rate from scratch, with only the fixed stoichiometry
      — not any rate law — as mechanistic scaffolding.
    </p>
  </AnalysesDashboard>
</Main>
