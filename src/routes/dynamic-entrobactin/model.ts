import { Add, Divide, Minus, Mul, Name, Num } from "$lib/mathml";
import { ModelBuilder } from "$lib/model-editor/modelBuilder";

export function initModel(): ModelBuilder {
  return new ModelBuilder()
    .addParameter("Y_X1_S", {
      value: 0.45,
      texName: "Y\\_X1\\_S",
    })
    .addParameter("Y_X2_S", {
      value: 0.5,
      texName: "Y\\_X2\\_S",
    })
    .addParameter("mu_max1", {
      value: 0.22,
      texName: "mu\\_max1",
    })
    .addParameter("mu_max2", {
      value: 0.45,
      texName: "mu\\_max2",
    })
    .addParameter("K_s1", {
      value: 0.0005,
      texName: "K\\_s1",
    })
    .addParameter("K_s2", {
      value: 0.005,
      texName: "K\\_s2",
    })
    .addParameter("q_p1_max", {
      value: 0.015,
      texName: "q\\_p1\\_max",
    })
    .addParameter("q_up_X1_max", {
      value: 0.005,
      texName: "q\\_up\\_X1\\_max",
    })
    .addParameter("q_up_X2_max", {
      value: 0.01,
      texName: "q\\_up\\_X2\\_max",
    })
    .addParameter("K_s_X1_minus_P", {
      value: 1e-5,
      texName: "K\\_s\\_X1-P",
    })
    .addParameter("K_s_X2_minus_P", {
      value: 0.001,
      texName: "K\\_s\\_X2-P",
    })
    .addParameter("innoculationRatio", {
      value: 0.5,
      texName: "innoculationRatio",
      slider: {
        min: "0.1",
        max: "0.9",
        step: "0.1",
      },
    })
    .addVariable("x1", {
      value: new Name("innoculationRatio"),
      texName: "x1",
    })
    .addVariable("x2", {
      value: new Add([
        new Num(1.0),
        new Minus([new Name("innoculationRatio")]),
      ]),
      texName: "x2",
    })
    .addVariable("s1", {
      value: 10.0,
      texName: "s1",
    })
    .addVariable("p1", {
      value: 0.02,
      texName: "p1",
    })
    .addReaction("mu1", {
      fn: new Divide([
        new Mul([new Name("mu_max1"), new Name("p1"), new Name("s1")]),
        new Mul([
          new Add([new Name("K_s1"), new Name("s1")]),
          new Add([new Name("K_s_X1_minus_P"), new Name("p1")]),
        ]),
      ]),
      stoichiometry: [
        { name: "x1", value: new Name("x1") },
        {
          name: "s1",
          value: new Minus([new Divide([new Name("x1"), new Name("Y_X1_S")])]),
        },
      ],
      texName: "mu1",
    })
    .addReaction("mu2", {
      fn: new Divide([
        new Mul([new Name("mu_max2"), new Name("p1"), new Name("s1")]),
        new Mul([
          new Add([new Name("K_s2"), new Name("s1")]),
          new Add([new Name("K_s_X2_minus_P"), new Name("p1")]),
        ]),
      ]),
      stoichiometry: [
        { name: "x2", value: new Name("x2") },
        {
          name: "s1",
          value: new Minus([new Divide([new Name("x2"), new Name("Y_X2_S")])]),
        },
      ],
      texName: "mu2",
    })
    .addReaction("q_p1", {
      fn: new Divide([
        new Mul([new Name("mu1"), new Name("q_p1_max")]),
        new Name("mu_max1"),
      ]),
      stoichiometry: [{ name: "p1", value: new Name("x1") }],
      texName: "q\\_p1",
    })
    .addReaction("q_up1", {
      fn: new Divide([
        new Mul([new Name("mu1"), new Name("q_up_X1_max")]),
        new Name("mu_max1"),
      ]),
      stoichiometry: [{ name: "p1", value: new Minus([new Name("x1")]) }],
      texName: "q\\_up1",
    })
    .addReaction("q_up2", {
      fn: new Divide([
        new Mul([new Name("mu2"), new Name("q_up_X2_max")]),
        new Name("mu_max2"),
      ]),
      stoichiometry: [{ name: "p1", value: new Minus([new Name("x2")]) }],
      texName: "q\\_up2",
    });
}
