import { Add, Divide, Minus, Mul, Name, Num } from "$lib/mathml";
import { ModelBuilder } from "$lib/model-editor/modelBuilder";

export function initModel(): ModelBuilder {
  return new ModelBuilder()
    .addParameter("mu_max_e_coli", {
      value: 0.25,
      texName: "mu\\_max\\_e\\_coli",
    })
    .addParameter("mu_min_e_coli", {
      value: 0.15,
      texName: "mu\\_min\\_e\\_coli",
    })
    .addParameter("mu_max_c_gluta", {
      value: 0.4,
      texName: "mu\\_max\\_c\\_gluta",
    })
    .addParameter("km_e_coli", {
      value: 0.2678,
      texName: "km\\_e\\_coli",
    })
    .addParameter("km_c_gluta", {
      value: 2.678,
      texName: "km\\_c\\_gluta",
    })
    .addParameter("qmax_p1_ecoli", {
      value: 0.24101999999999998,
      texName: "qmax\\_p1\\_ecoli",
    })
    .addParameter("qmax_c1_ecoli", {
      value: 0.09640800000000001,
      texName: "qmax\\_c1\\_ecoli",
    })
    .addParameter("qmax_c1_gluta", {
      value: 0.15425280000000005,
      texName: "qmax\\_c1\\_gluta",
    })
    .addVariable("e_coli", {
      value: 100.0,
      texName: "e\\_coli",
    })
    .addVariable("c_gluta", {
      value: 100.0,
      texName: "c\\_gluta",
    })
    .addVariable("enterobactin", {
      value: 15.0,
      texName: "enterobactin",
    })
    .addAssignment("qp1", {
      fn: new Divide([
        new Mul([new Name("mu_e_coli"), new Name("qmax_p1_ecoli")]),
        new Name("mu_max_e_coli"),
      ]),
      texName: "qp1",
    })
    .addAssignment("qc1_e_coli", {
      fn: new Divide([
        new Mul([new Name("mu_e_coli"), new Name("qmax_c1_ecoli")]),
        new Name("mu_max_e_coli"),
      ]),
      texName: "qc1\\_e\\_coli",
    })
    .addAssignment("qc1_c_gluta", {
      fn: new Divide([
        new Mul([new Name("mu_c_gluta"), new Name("qmax_c1_gluta")]),
        new Name("mu_max_c_gluta"),
      ]),
      texName: "qc1\\_c\\_gluta",
    })
    .addReaction("mu_e_coli", {
      fn: new Add([
        new Name("mu_min_e_coli"),
        new Divide([
          new Mul([
            new Name("enterobactin"),
            new Add([
              new Name("mu_max_e_coli"),
              new Minus([new Name("mu_min_e_coli")]),
            ]),
          ]),
          new Add([new Name("enterobactin"), new Name("km_e_coli")]),
        ]),
      ]),
      stoichiometry: [{ name: "e_coli", value: new Name("e_coli") }],
      texName: "mu\\_e\\_coli",
    })
    .addReaction("mu_c_gluta", {
      fn: new Divide([
        new Mul([new Name("enterobactin"), new Name("mu_max_c_gluta")]),
        new Add([new Name("enterobactin"), new Name("km_c_gluta")]),
      ]),
      stoichiometry: [{ name: "c_gluta", value: new Name("c_gluta") }],
      texName: "mu\\_c\\_gluta",
    })
    .addReaction("eb_prod", {
      fn: new Mul([new Name("e_coli"), new Name("qp1")]),
      stoichiometry: [{ name: "enterobactin", value: new Num(1.0) }],
      texName: "eb\\_prod",
    })
    .addReaction("eb_cons_coli", {
      fn: new Mul([new Name("e_coli"), new Name("qc1_e_coli")]),
      stoichiometry: [{ name: "enterobactin", value: new Num(-1.0) }],
      texName: "eb\\_cons\\_coli",
    })
    .addReaction("eb_cons_gluta", {
      fn: new Mul([new Name("c_gluta"), new Name("qc1_c_gluta")]),
      stoichiometry: [{ name: "enterobactin", value: new Num(-1.0) }],
      texName: "eb\\_cons\\_gluta",
    });
}
