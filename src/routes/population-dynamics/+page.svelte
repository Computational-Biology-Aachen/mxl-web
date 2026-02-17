<script lang="ts">
  import type { Analyses } from "$lib";
  import { Minus, Mul, Name, Num } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("e_coli", {
        value: 5.0,
        texName: "E.\ coli",
        slider: { min: "0.0", max: "1000.0", step: "1.0" },
      })
      .addVariable("c_gluta", {
        value: 5.0,
        texName: "C.\ gluta",
        slider: {
          min: "0.0",
          max: "1000.0",
          step: "1.0",
        },
      })
      .addParameter("mu_e", {
        value: 0.4,
        texName: String.raw`\mu_e`,
        slider: {
          min: "0.0",
          max: "1.0",
          step: "0.05",
        },
      })
      .addParameter("mu_c", {
        value: 0.3,
        texName: String.raw`\mu_c`,
        slider: {
          min: "0.0",
          max: "1.0",
          step: "0.05",
        },
      })
      .addParameter("a_e", {
        value: 6.0,
        texName: String.raw`a_e`,
        slider: {
          min: "0.0",
          max: "10.0",
          step: "0.5",
        },
      })
      .addParameter("a_c", {
        value: 4.0,
        texName: String.raw`a_c`,
        slider: {
          min: "0.0",
          max: "10.0",
          step: "0.5",
        },
      })
      .addParameter("theta", {
        value: 0.001,
        texName: String.raw`\theta`,
        slider: {
          min: "0.0",
          max: "1.0",
          step: "0.05",
        },
      })
      .addReaction("dEdt", {
        fn: new Mul([new Name("e_coli"), new Name("a_e"), new Name("mu_e")]),
        stoichiometry: [{ name: "e_coli", value: new Num(1.0) }],
      })
      .addReaction("dCdt", {
        fn: new Minus([
          new Mul([new Name("c_gluta"), new Name("a_c"), new Name("mu_c")]),
          new Mul([
            new Name("theta"),
            // FIXME: square
            new Name("c_gluta"),
            new Name("c_gluta"),
          ]),
        ]),
        stoichiometry: [{ name: "c_gluta", value: new Num(1.0) }],
      });
  }

  let analyses: Analyses = $state([
    {
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 6,
      tEnd: 5,
      yMax: undefined,
    },
  ]);
</script>

<AnalysesDashboard
  name={"Population Dynamics"}
  initModel={initModel}
  analyses={analyses}
/>
