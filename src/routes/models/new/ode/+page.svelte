<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import {
    SectionMain as Main,
    Text,
  } from "@computational-biology-aachen/design";

  import { OdeModelBuilder } from "@computational-biology-aachen/mxlweb-core";
  import {
    Minus,
    Mul,
    Name,
  } from "@computational-biology-aachen/mxlweb-core/mathml";

  // Starter model: a single variable with exponential decay (dx0/dt = -x0).
  function initModel(): OdeModelBuilder {
    return new OdeModelBuilder()
      .addVariable("x0", {
        value: 1.0,
        texName: "x_0",
        slider: { min: "0.0", max: "10.0", step: "0.5" },
      })
      .addParameter("p1", {
        value: 1.0,
        texName: "\\lambda",
        slider: { min: "0.0", max: "1.0", step: "0.1" },
      })
      .setDifferential(
        "x0",
        new Minus([new Mul([new Name("p1"), new Name("x0")])]),
      );
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
  <title>Build an ODE model - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Your ODE model"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Build your own ODE model</h1>
    <Text>
      Define your system by writing each variable's differential equation
      directly.
    </Text>
    <Text>
      Open <strong>Edit model</strong> to add variables, parameters, and assignments,
      then watch the simulation update live.
    </Text>
  </AnalysesDashboard>
</Main>
