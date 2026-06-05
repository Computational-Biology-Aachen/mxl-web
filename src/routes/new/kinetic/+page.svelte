<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import {
    SectionMain as Main,
    Text,
  } from "@computational-biology-aachen/design";
  import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
  import {
    Mul,
    Name,
    Num,
  } from "@computational-biology-aachen/mxlweb-core/mathml";

  // Starter model: a single variable consumed by one decay reaction.
  function initModel(): KineticModelBuilder {
    return new KineticModelBuilder()
      .addVariable("x0", {
        value: 1.0,
        texName: "x_0",
        slider: { min: "0.0", max: "10.0", step: "0.5" },
      })
      .addReaction("v0", {
        fn: new Mul([new Name("p1"), new Name("x0")]),
        stoichiometry: [{ name: "x0", value: new Num(-1.0) }],
        texName: "v_0",
      });
  }

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
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Build a kinetic model - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Your kinetic model"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Build your own kinetic model</h1>
    <Text
      >Define your system as reactions with rate laws and stoichiometries.</Text
    >
    <Text>
      Open
      <strong>Edit model</strong> to add variables, parameters, assignments, and reactions,
      then watch the simulation update live.
    </Text>
  </AnalysesDashboard>
</Main>
