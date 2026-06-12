import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("V1_max", {
      value: 3.78,
      texName: "V1\\_max",
      slider: {
        min: "1.9",
        max: "7.6",
        step: "0.1",
      },
    })
    .addParameter("V2_max", {
      value: 11.75,
      texName: "V2\\_max",
      slider: {
        min: "5.9",
        max: "23.5",
        step: "0.1",
      },
    })
    .addParameter("V3_max", {
      value: 5.04,
      texName: "V3\\_max",
      slider: {
        min: "2.5",
        max: "10.1",
        step: "0.1",
      },
    })
    .addParameter("V4_max", {
      value: 3.05,
      texName: "V4\\_max",
      slider: {
        min: "1.5",
        max: "6.1",
        step: "0.1",
      },
    })
    .addParameter("V5_max", {
      value: 3.0,
      texName: "V5\\_max",
      slider: {
        min: "1.5",
        max: "6",
        step: "0.1",
      },
    })
    .addParameter("V6_max", {
      value: 0.1,
      texName: "V6\\_max",
      slider: {
        min: "0.1",
        max: "0.2",
        step: "0.1",
      },
    })
    .addParameter("V13_max", {
      value: 8.0,
      texName: "V13\\_max",
      slider: {
        min: "4.0",
        max: "16",
        step: "0.1",
      },
    })
    .addParameter("K_m1", {
      value: 1.0,
      texName: "K\\_m1",
    })
    .addParameter("K_m21", {
      value: 0.24,
      texName: "K\\_m21",
    })
    .addParameter("K_m22", {
      value: 0.39,
      texName: "K\\_m22",
    })
    .addParameter("K_m3", {
      value: 0.5,
      texName: "K\\_m3",
    })
    .addParameter("K_m4", {
      value: 0.84,
      texName: "K\\_m4",
    })
    .addParameter("K_m51", {
      value: 0.75,
      texName: "K\\_m51",
    })
    .addParameter("K_m52", {
      value: 0.275,
      texName: "K\\_m52",
    })
    .addParameter("K_m6", {
      value: 5.0,
      texName: "K\\_m6",
    })
    .addParameter("K_m131", {
      value: 0.15,
      texName: "K\\_m131",
    })
    .addParameter("K_m132", {
      value: 0.059,
      texName: "K\\_m132",
    })
    .addParameter("ATP", {
      value: 0.2,
      texName: "ATP",
      slider: {
        min: "0.1",
        max: "0.4",
        step: "0.1",
      },
    })
    .addVariable("RuBP", {
      value: 2.0,
      texName: "RuBP",
    })
    .addVariable("PGA", {
      value: 2.4,
      texName: "PGA",
    })
    .addVariable("DPGA", {
      value: 1.0,
      texName: "DPGA",
    })
    .addVariable("Ru5P", {
      value: 1.0,
      texName: "Ru5P",
    })
    .addVariable("GAP", {
      value: 1.0,
      texName: "GAP",
    })
    .addReaction("v1", {
      fn: new Divide([
        new Mul([new Name("RuBP"), new Name("V1_max")]),
        new Add([new Name("K_m1"), new Name("RuBP")]),
      ]),
      stoichiometry: [
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGA", value: new Num(2.0) },
      ],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("PGA"), new Name("V2_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m22")]),
          new Add([new Name("K_m21"), new Name("PGA")]),
        ]),
      ]),
      stoichiometry: [
        { name: "PGA", value: new Num(-1.0) },
        { name: "DPGA", value: new Num(1.0) },
      ],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Divide([
        new Mul([new Name("DPGA"), new Name("V3_max")]),
        new Add([new Name("DPGA"), new Name("K_m3")]),
      ]),
      stoichiometry: [
        { name: "DPGA", value: new Num(-1.0) },
        { name: "GAP", value: new Num(1.0) },
      ],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("V4_max")]),
        new Add([new Name("GAP"), new Name("K_m4")]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "Ru5P", value: new Num(0.6) },
      ],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("PGA"), new Name("V5_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m52")]),
          new Add([new Name("K_m51"), new Name("PGA")]),
        ]),
      ]),
      stoichiometry: [{ name: "PGA", value: new Num(-1.0) }],
      texName: "v5",
    })
    .addReaction("v6", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("V6_max")]),
        new Add([new Name("GAP"), new Name("K_m6")]),
      ]),
      stoichiometry: [{ name: "GAP", value: new Num(-1.0) }],
      texName: "v6",
    })
    .addReaction("v13", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("Ru5P"), new Name("V13_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m132")]),
          new Add([new Name("K_m131"), new Name("Ru5P")]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ru5P", value: new Num(-1.0) },
        { name: "RuBP", value: new Num(1.0) },
      ],
      texName: "v13",
    });
}
