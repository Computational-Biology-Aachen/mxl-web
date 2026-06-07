import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Minus,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("k1", {
      value: 1666.0,
      texName: "k1",
    })
    .addParameter("k2", {
      value: 1250.0,
      texName: "k2",
    })
    .addParameter("k3", {
      value: 500.0,
      texName: "k3",
    })
    .addParameter("k4", {
      value: 20000.0,
      texName: "k4",
    })
    .addParameter("k5", {
      value: 1666.0,
      texName: "k5",
    })
    .addParameter("k6", {
      value: 3500.0,
      texName: "k6",
    })
    .addParameter("k7", {
      value: 175.0,
      texName: "k7",
    })
    .addParameter("k8", {
      value: 1750.0,
      texName: "k8",
    })
    .addParameter("k9", {
      value: 35.0,
      texName: "k9",
    })
    .addParameter("k10", {
      value: 5000.0,
      texName: "k10",
    })
    .addParameter("k11", {
      value: 5000.0,
      texName: "k11",
    })
    .addParameter("k12", {
      value: 150.0,
      texName: "k12",
    })
    .addParameter("k13", {
      value: 100.0,
      texName: "k13",
    })
    .addParameter("k14", {
      value: 150.0,
      texName: "k14",
    })
    .addParameter("k15", {
      value: 100.0,
      texName: "k15",
    })
    .addParameter("k16", {
      value: 150.0,
      texName: "k16",
    })
    .addParameter("k17", {
      value: 100.0,
      texName: "k17",
    })
    .addParameter("k18", {
      value: 150.0,
      texName: "k18",
    })
    .addParameter("k19", {
      value: 100.0,
      texName: "k19",
    })
    .addParameter("k20", {
      value: 150.0,
      texName: "k20",
    })
    .addParameter("k21", {
      value: 100.0,
      texName: "k21",
    })
    .addParameter("k22", {
      value: 150.0,
      texName: "k22",
    })
    .addParameter("k23", {
      value: 100.0,
      texName: "k23",
    })
    .addParameter("k24", {
      value: 1.0,
      texName: "k24",
    })
    .addParameter("k25", {
      value: 1.0,
      texName: "k25",
    })
    .addParameter("k6n", {
      value: 3500.0,
      texName: "k6n",
    })
    .addParameter("p", {
      value: 0.55,
      texName: "p",
    })
    .addVariable("y1", {
      value: 0.66,
      texName: "y1",
    })
    .addVariable("y2", {
      value: 0.0,
      texName: "y2",
    })
    .addVariable("y3", {
      value: 0.0,
      texName: "y3",
    })
    .addVariable("y4", {
      value: 0.0,
      texName: "y4",
    })
    .addVariable("y5", {
      value: 0.0,
      texName: "y5",
    })
    .addVariable("y6", {
      value: 0.0,
      texName: "y6",
    })
    .addVariable("y7", {
      value: 0.0,
      texName: "y7",
    })
    .addVariable("y8", {
      value: 0.0,
      texName: "y8",
    })
    .addVariable("y9", {
      value: 7.0,
      texName: "y9",
    })
    .addVariable("y10", {
      value: 0.0,
      texName: "y10",
    })
    .addVariable("y11", {
      value: 0.0,
      texName: "y11",
    })
    .addVariable("y12", {
      value: 0.0,
      texName: "y12",
    })
    .addVariable("y13", {
      value: 0.22,
      texName: "y13",
    })
    .addVariable("y14", {
      value: 0.0,
      texName: "y14",
    })
    .addVariable("y15", {
      value: 0.12,
      texName: "y15",
    })
    .addAssignment("eprime", {
      fn: new Add([
        new Name("y12"),
        new Name("y14"),
        new Name("y2"),
        new Name("y4"),
        new Name("y6"),
        new Name("y8"),
      ]),
      texName: "eprime",
    })
    .addAssignment("F", {
      fn: new Add([
        new Name("y15"),
        new Divide([
          new Mul([
            new Name("eprime"),
            new Add([new Num(1.0), new Minus([new Name("p")])]),
          ]),
          new Add([
            new Num(1.0),
            new Minus([new Mul([new Name("eprime"), new Name("p")])]),
          ]),
        ]),
      ]),
      texName: "F",
    })
    .addReaction("v1", {
      fn: new Add([
        new Mul([new Name("k10"), new Name("y3")]),
        new Mul([
          new Name("y1"),
          new Add([new Minus([new Name("k1")]), new Minus([new Name("k17")])]),
        ]),
        new Mul([new Name("k16"), new Name("y11"), new Name("y9")]),
      ]),
      stoichiometry: [{ name: "y1", value: new Num(1.0) }],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Add([
        new Mul([new Name("k1"), new Name("y1")]),
        new Mul([new Name("k11"), new Name("y4")]),
        new Mul([new Name("k7"), new Name("y3")]),
        new Minus([
          new Mul([new Name("y2"), new Add([new Name("k23"), new Name("k6")])]),
        ]),
        new Mul([new Name("k22"), new Name("y12"), new Name("y9")]),
      ]),
      stoichiometry: [{ name: "y2", value: new Num(1.0) }],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Add([
        new Mul([new Name("k6"), new Name("y2")]),
        new Minus([
          new Mul([
            new Name("y3"),
            new Add([new Name("k10"), new Name("k2"), new Name("k7")]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y3", value: new Num(1.0) }],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Add([
        new Mul([new Name("k2"), new Name("y3")]),
        new Mul([new Name("k9"), new Name("y5")]),
        new Minus([
          new Mul([new Name("y4"), new Add([new Name("k11"), new Name("k8")])]),
        ]),
      ]),
      stoichiometry: [{ name: "y4", value: new Num(1.0) }],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Add([
        new Mul([new Name("k13"), new Name("y7")]),
        new Mul([new Name("k8"), new Name("y4")]),
        new Minus([
          new Mul([
            new Name("y5"),
            new Add([new Name("k12"), new Name("k3"), new Name("k9")]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y5", value: new Num(1.0) }],
      texName: "v5",
    })
    .addReaction("v6", {
      fn: new Add([
        new Mul([new Name("k19"), new Name("y8")]),
        new Mul([new Name("k3"), new Name("y5")]),
        new Minus([new Mul([new Name("k18"), new Name("y6")])]),
      ]),
      stoichiometry: [{ name: "y6", value: new Num(1.0) }],
      texName: "v6",
    })
    .addReaction("v7", {
      fn: new Add([
        new Mul([new Name("k12"), new Name("y5")]),
        new Minus([
          new Mul([
            new Name("y7"),
            new Add([new Name("k13"), new Name("k14"), new Name("k4")]),
          ]),
        ]),
        new Mul([new Name("k15"), new Name("y10"), new Name("y11")]),
      ]),
      stoichiometry: [{ name: "y7", value: new Num(1.0) }],
      texName: "v7",
    })
    .addReaction("v8", {
      fn: new Add([
        new Mul([new Name("k18"), new Name("y6")]),
        new Mul([new Name("k4"), new Name("y7")]),
        new Minus([
          new Mul([
            new Name("y8"),
            new Add([new Name("k19"), new Name("k20")]),
          ]),
        ]),
        new Mul([new Name("k21"), new Name("y10"), new Name("y12")]),
      ]),
      stoichiometry: [{ name: "y8", value: new Num(1.0) }],
      texName: "v8",
    })
    .addReaction("v9", {
      fn: new Add([
        new Mul([new Name("k17"), new Name("y1")]),
        new Mul([new Name("k23"), new Name("y2")]),
        new Mul([new Name("k24"), new Name("y10")]),
        new Minus([
          new Mul([
            new Name("y9"),
            new Add([
              new Name("k25"),
              new Mul([new Name("k16"), new Name("y11")]),
              new Mul([new Name("k22"), new Name("y12")]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y9", value: new Num(1.0) }],
      texName: "v9",
    })
    .addReaction("v10", {
      fn: new Add([
        new Mul([new Name("k14"), new Name("y7")]),
        new Mul([new Name("k20"), new Name("y8")]),
        new Mul([new Name("k25"), new Name("y9")]),
        new Minus([
          new Mul([
            new Name("y10"),
            new Add([
              new Name("k24"),
              new Mul([new Name("k15"), new Name("y11")]),
              new Mul([new Name("k21"), new Name("y12")]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y10", value: new Num(1.0) }],
      texName: "v10",
    })
    .addReaction("v11", {
      fn: new Add([
        new Mul([new Name("k14"), new Name("y7")]),
        new Mul([new Name("k17"), new Name("y1")]),
        new Minus([
          new Mul([
            new Name("y11"),
            new Add([
              new Mul([new Name("k15"), new Name("y10")]),
              new Mul([new Name("k16"), new Name("y9")]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y11", value: new Num(1.0) }],
      texName: "v11",
    })
    .addReaction("v12", {
      fn: new Add([
        new Mul([new Name("k20"), new Name("y8")]),
        new Mul([new Name("k23"), new Name("y2")]),
        new Minus([
          new Mul([
            new Name("y12"),
            new Add([
              new Mul([new Name("k21"), new Name("y10")]),
              new Mul([new Name("k22"), new Name("y9")]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "y12", value: new Num(1.0) }],
      texName: "v12",
    })
    .addReaction("v13", {
      fn: new Minus([new Mul([new Name("k6n"), new Name("y13")])]),
      stoichiometry: [{ name: "y13", value: new Num(1.0) }],
      texName: "v13",
    })
    .addReaction("v14", {
      fn: new Mul([new Name("k6n"), new Name("y13")]),
      stoichiometry: [{ name: "y14", value: new Num(1.0) }],
      texName: "v14",
    })
    .addReaction("v15", {
      fn: new Num(0.0),
      stoichiometry: [{ name: "y15", value: new Num(1.0) }],
      texName: "v15",
    });
}
