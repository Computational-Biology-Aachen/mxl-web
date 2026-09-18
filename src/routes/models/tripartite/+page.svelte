<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import mibinetLogo from "$lib/assets/logos/mibinet.png";
  import scheme from "$lib/assets/tripartite-scheme.png";
  import PublicationBadge from "$lib/PublicationBadge.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import Row from "@computational-biology-aachen/design/Row.svelte";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 500,
      lineDisplay: "first",
    },
    {
      type: "parameterScan" as const,
      id: 1,
      idx: 1,
      title: "Public metabolizer growth rate scan",
      span: 3,
      parameter: "growthRatePublic",
      min: 0.4,
      max: 0.8,
      steps: 5,
      tEnd: 10_000,
      tolerance: 1e-4,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
      backend: backends.wasmRadau5,
      lineDisplay: "current" as const,
    },
  ]);
</script>

<svelte:head>
  <title>Tripartite - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Tripartite dynamics"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <Row
      stack
      justify="between"
      align="center"
    >
      <h1>Tripartite population model</h1>
      <PublicationBadge
        logo={mibinetLogo}
        href="https://doi.org/10.1098/rsob.250484"
        text="Read the paper: Hassan, Dwivedi, Schuster & Matuszyńska (2026), Open Biol."
      />
    </Row>
    <p>
      This model explores how cooperation, exploitation and privatization
      coexist in a microbial community built around a single shared carbon
      source, sucrose. Three metabolic strategies compete for it: the <b
        >public metabolizer</b
      >
      secretes invertase, hydrolysing sucrose into glucose that becomes freely available
      to the whole community; the <b>cheater</b> takes up that glucose without
      paying the metabolic cost of producing the enzyme; and the
      <b>private metabolizer</b> imports and digests sucrose intracellularly, avoiding
      both the cost of sharing and the risk of exploitation.
    </p>
    <p>
      Population growth follows a generalized Lotka-Volterra model with
      density-dependent self-limitation for each strategy, an exploitation term
      through which cheaters benefit at the public metabolizer's expense, and a
      competition term between public and private metabolizers for the shared
      sucrose pool. Because the same right-hand sides can be read as per-capita
      growth rates, the model doubles as a three-strategy evolutionary game:
      each strategy's fitness is exactly its payoff, and the interior
      equilibrium where all three coexist corresponds to the point where all
      three payoffs are equal.
    </p>
    <p>
      The public metabolizer needs a growth-rate advantage over the private
      metabolizer to sustain the community: this model's analysis finds stable
      three-way coexistence only for a narrow window of that ratio (roughly
      1.2-5x), with the most robust balance around 1.2-2x. Outside that window
      the system collapses to a boundary state, private-only dominance if the
      public metabolizer grows too slowly, or loss of the private metabolizer if
      it grows too fast relative to the public strategy.
    </p>
    <div class="centered">
      <img
        src={scheme}
        alt="Schematic of the tripartite community: the public metabolizer secretes extracellular enzymes that hydrolyse sucrose into glucose, a shared resource taken up by the cheater; the private metabolizer imports and digests sucrose intracellularly using its own enzymes"
      />
    </div>
  </AnalysesDashboard>
</Main>

<style>
  img {
    max-width: 90rem;
    max-height: 20rem;
  }
  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
