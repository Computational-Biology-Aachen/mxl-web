<script lang="ts">
  import type { SteadyStateAnalyses } from "$lib";
  import SteadyStateDashboard from "$lib/SteadyStateDashboard.svelte";
  import {
    SectionMain as Main,
    Text,
  } from "@computational-biology-aachen/design";
  import { SteadyStateModelBuilder } from "@computational-biology-aachen/mxlweb-core";
  import {
    Add,
    Divide,
    Mul,
    Name,
  } from "@computational-biology-aachen/mxlweb-core/mathml";

  // Starter model: Michaelis-Menten rate v = Vmax·S / (Km + S), swept over S.
  function initModel(): SteadyStateModelBuilder {
    return new SteadyStateModelBuilder()
      .addParameter("S", { value: 1, texName: "S" })
      .addParameter("Vmax", {
        value: 2,
        displayName: "Vmax",
        texName: "V_{max}",
        slider: { min: "0", max: "10", step: "0.1" },
      })
      .addParameter("Km", {
        value: 0.5,
        displayName: "Km",
        texName: "K_m",
        slider: { min: "0.1", max: "5", step: "0.1" },
      })
      .addAssignment("v", {
        displayName: "v",
        texName: "v",
        fn: new Divide([
          new Mul([new Name("Vmax"), new Name("S")]),
          new Add([new Name("Km"), new Name("S")]),
        ]),
      });
  }

  let analyses: SteadyStateAnalyses = $state([
    {
      type: "steadyState" as const,
      id: 0,
      idx: 0,
      title: "Rate vs S",
      span: 6,
      parameter: "S",
      min: 0,
      max: 10,
      steps: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      lineDisplay: "current",
    },
  ]);
</script>

<svelte:head>
  <title>Build a steady-state model - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <SteadyStateDashboard
    name="Your steady-state model"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Build your own steady-state model</h1>
    <Text>
      Define your system as a set of algebraic assignments — closed-form outputs
      of the model's parameters, with no differential equations.
    </Text>
    <Text>
      Open <strong>Edit model</strong> to add parameters and assignments, then sweep
      any parameter across a range to see how the outputs respond.
    </Text>
  </SteadyStateDashboard>
</Main>
