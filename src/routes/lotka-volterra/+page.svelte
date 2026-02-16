<script lang="ts">
  import type { Analyses } from "$lib";
  import { Mul, Name, Num } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/model";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addParameter("Alpha", {
        value: 0.1,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\alpha`,
        },
      })
      .addParameter("Beta", {
        value: 0.02,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\beta`,
        },
      })
      .addParameter("Gamma", {
        value: 0.4,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\gamma`,
        },
      })
      .addParameter("Delta", {
        value: 0.02,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.001",
          texName: String.raw`\delta`,
        },
      })
      .addVariable("Prey", {
        value: 10.0,
        slider: {
          min: "1.0",
          max: "20.0",
          step: "1.0",
        },
      })
      .addVariable("Predator", {
        value: 10.0,
        slider: {
          min: "1.0",
          max: "20.0",
          step: "1.0",
        },
      })
      .addReaction("v0", {
        fn: new Mul([new Name("Alpha"), new Name("Prey")]),
        stoichiometry: [{ name: "Prey", value: new Num(1.0) }],
      })
      .addReaction("v1", {
        fn: new Mul([new Name("Beta"), new Name("Prey"), new Name("Predator")]),
        stoichiometry: [{ name: "Prey", value: new Num(-1.0) }],
      })
      .addReaction("v2", {
        fn: new Mul([
          new Name("Delta"),
          new Name("Prey"),
          new Name("Predator"),
        ]),
        stoichiometry: [{ name: "Predator", value: new Num(1.0) }],
      })
      .addReaction("v3", {
        fn: new Mul([new Name("Gamma"), new Name("Predator")]),
        stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
      });
  }

  let analyses: Analyses = $state([
    {
      id: 0,
      idx: 0,
      title: "Short Simulation",
      col: 1,
      span: 3,
      tEnd: 100,
      yMax: undefined,
    },
    {
      id: 1,
      idx: 1,
      title: "Long Simulation",
      col: 4,
      span: 3,
      tEnd: 200,
      yMax: 20,
    },
  ]);
</script>

<AnalysesDashboard {initModel} {analyses} />
