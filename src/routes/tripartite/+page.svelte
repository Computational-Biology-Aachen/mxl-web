<script lang="ts">
  import type { Analyses } from "$lib";
  import { Minus, Mul, Name, Num } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/model";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("Public", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
          texName: String.raw`P`,
        },
      })
      .addVariable("Cheater", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
          texName: String.raw`C`,
        },
      })
      .addVariable("Private", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
          texName: String.raw`M`,
        },
      })
      .addParameter("r_p", {
        value: 0.4,
        slider: {
          desc: "(growth rate)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
          texName: String.raw`r_P`,
        },
      })
      .addParameter("eta", {
        value: 0.0001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
          texName: String.raw`\eta`,
        },
      })
      .addParameter("nu", {
        value: 0.00001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
          texName: String.raw`\nu`,
        },
      })
      .addParameter("r_m", {
        value: 0.2,
        slider: {
          desc: "(growth rate)",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
          texName: String.raw`r_M`,
        },
      })
      .addParameter("gamma", {
        value: 0.0001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
          texName: String.raw`\gamma`,
        },
      })
      .addParameter("alpha", {
        value: 0.0002,
        slider: {
          desc: "(P→C cooperation)",
          min: "0.0",
          max: "1.0",
          step: "0.0001",
          texName: String.raw`\alpha`,
        },
      })
      .addParameter("beta", {
        value: 0.0001,
        slider: {
          desc: "(P↔M competition)",
          min: "0.0",
          max: "1.0",
          step: "0.0001",
          texName: String.raw`\beta`,
        },
      })
      .addReaction("dPdt", {
        fn: new Minus([
          new Mul([new Name("r_p"), new Name("Public")]),
          new Mul([new Name("alpha"), new Name("Public"), new Name("Cheater")]),
          new Mul([new Name("beta"), new Name("Public"), new Name("Private")]),
          new Mul([
            new Name("eta"),
            // FIXME: square
            new Name("Public"),
            new Name("Public"),
          ]),
        ]),
        stoichiometry: [{ name: "Public", value: new Num(1.0) }],
      })
      .addReaction("dCdt", {
        fn: new Minus([
          new Mul([new Name("alpha"), new Name("Public"), new Name("Cheater")]),
          new Mul([
            new Name("nu"),
            // FIXME: square
            new Name("Cheater"),
            new Name("Cheater"),
          ]),
        ]),
        stoichiometry: [{ name: "Cheater", value: new Num(1.0) }],
      })
      .addReaction("dMdt", {
        fn: new Minus([
          new Mul([new Name("r_m"), new Name("Private")]),
          new Mul([new Name("beta"), new Name("Public"), new Name("Private")]),
          new Mul([
            new Name("gamma"),
            // FIXME: Square
            new Name("Private"),
            new Name("Private"),
          ]),
        ]),
        stoichiometry: [{ name: "Private", value: new Num(1.0) }],
      });
  }

  let analyses: Analyses = $state([
    {
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 6,
      tEnd: 100,
      yMax: undefined,
    },
  ]);
</script>

<AnalysesDashboard
  name={"Tripartite dynamics"}
  initModel={initModel}
  analyses={analyses}
>
  <p>
    Dynamic model of a tripartite population of <b>P</b>ublic consumers,
    <b>C</b>heaters and private <b>m</b>etabolisers.
  </p>
</AnalysesDashboard>
