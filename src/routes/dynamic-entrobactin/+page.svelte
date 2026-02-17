<script lang="ts">
  import type { Analyses } from "$lib";
  import { Add, Divide, Minus, Mul, Name, Num } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";

  // FIXME @ Tanvir: you wrote
  // \frac{dE}{dt}&=\mu_E\,\frac{a_E\,B}{K_E+B}\,E-\delta_E\,E \\
  // but didn't implement the "-\delta_E\,E" part. Dunno what your
  // model is supposed to be, so I'm removing this from the tex display
  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("e_coli", {
        value: 5.0,
        texName: String.raw`E`,
        slider: {
          min: "0.0",
          max: "1000.0",
          step: "1",
        },
      })
      .addVariable("c_gluta", {
        value: 5.0,
        texName: String.raw`C`,
        slider: {
          min: "0.0",
          max: "1000.0",
          step: "1",
        },
      })
      .addVariable("enterobactin", {
        value: 1.0,
        texName: String.raw`B`,
        slider: {
          desc: "B₀",
          min: "0.0",
          max: "1000.0",
          step: "0.5",
        },
      })
      .addParameter("mu_e", {
        value: 0.4,
        texName: String.raw`\mu_e`,
        slider: {
          desc: "E. coli growth rate",
          min: "0.0",
          max: "2.0",
          step: "0.01",
        },
      })
      .addParameter("mu_c", {
        value: 0.3,
        texName: String.raw`\mu_c`,
        slider: {
          desc: "C. glut growth rate",
          min: "0.0",
          max: "2.0",
          step: "0.01",
        },
      })
      .addParameter("a_e", {
        value: 6.0,
        texName: String.raw`a_e`,
        slider: {
          desc: "E. coli affinity",
          min: "0.0",
          max: "10.0",
          step: "0.1",
        },
      })
      .addParameter("K_e", {
        value: 0.5,
        texName: String.raw`K_e`,
        slider: {
          desc: "(half-sat E. coli)",
          min: "0.00000001",
          max: "1.0",
          step: "0.000001",
        },
      })
      .addParameter("K_c", {
        value: 0.5,
        texName: String.raw`K_c`,
        slider: {
          desc: "(half-sat C)",
          min: "0.00000001",
          max: "1.0",
          step: "0.000001",
        },
      })
      .addParameter("theta", {
        value: 0.001,
        texName: String.raw`\theta`,
        slider: {
          desc: "C density loss",
          min: "0.0",
          max: "1.0",
          step: "0.0001",
        },
      })
      .addParameter("r_prod", {
        value: 0.2,
        texName: String.raw`r_{prod}`,
        slider: {
          desc: "B production by E",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
        },
      })
      .addParameter("r_cons_e", {
        value: 1.0,
        texName: String.raw`r_{cons,E}`,
        slider: {
          desc: "B consumption weight E",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
        },
      })
      .addParameter("r_cons_c", {
        value: 1.0,
        texName: String.raw`r_{cons,C}`,
        slider: {
          desc: "B consumption weight C",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
        },
      })
      .addAssignment("a_c", {
        fn: new Minus([new Num(10), new Name("a_e")]),
        texName: String.raw`a_c`,
      })
      .addAssignment("uptake_E_growth", {
        fn: new Divide([
          new Mul([new Name("a_e"), new Name("enterobactin")]),
          new Add([new Name("K_e"), new Name("enterobactin")]),
        ]),
        texName: String.raw`\text{uptake}_{E,growth}`,
      })
      .addAssignment("uptake_C_growth", {
        fn: new Divide([
          new Mul([new Name("a_c"), new Name("enterobactin")]),
          new Add([new Name("K_c"), new Name("enterobactin")]),
        ]),
        texName: String.raw`\text{uptake}_{C,growth}`,
      })
      .addAssignment("cons_term_E", {
        fn: new Mul([
          new Name("mu_e"),
          new Divide([
            new Mul([new Name("a_e"), new Name("enterobactin")]),
            new Mul([
              new Add([new Name("K_e"), new Name("a_e")]),
              new Name("enterobactin"),
            ]),
          ]),
          new Name("e_coli"),
        ]),
        texName: String.raw`\text{cons}_{E}`,
      })
      .addAssignment("cons_term_C", {
        fn: new Mul([
          new Name("mu_c"),
          new Divide([
            new Mul([new Name("a_c"), new Name("enterobactin")]),
            new Mul([
              new Add([new Name("K_c"), new Name("a_c")]),
              new Name("enterobactin"),
            ]),
          ]),
          new Name("c_gluta"),
        ]),
        texName: String.raw`\text{cons}_{C}`,
      })
      .addReaction("dEdt", {
        fn: new Mul([
          new Name("mu_e"),
          new Name("uptake_E_growth"),
          new Name("e_coli"),
        ]),
        stoichiometry: [{ name: "e_coli", value: new Num(1.0) }],
      })
      .addReaction("dCdt", {
        fn: new Minus([
          new Mul([
            new Name("mu_c"),
            new Name("uptake_C_growth"),
            new Name("c_gluta"),
          ]),
          new Mul([
            new Name("theta"),
            // FIXME: square
            new Name("c_gluta"),
            new Name("c_gluta"),
          ]),
        ]),
        stoichiometry: [{ name: "c_gluta", value: new Num(1.0) }],
      })
      .addReaction("dBdt", {
        fn: new Minus([
          new Mul([new Name("r_prod"), new Name("enterobactin")]),
          new Mul([new Name("r_cons_e"), new Name("cons_term_E")]),
          new Mul([new Name("r_cons_c"), new Name("cons_term_C")]),
        ]),
        stoichiometry: [{ name: "enterobactin", value: new Num(1.0) }],
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
  name={"Dynamic Entrobaction"}
  initModel={initModel}
  analyses={analyses}
/>
