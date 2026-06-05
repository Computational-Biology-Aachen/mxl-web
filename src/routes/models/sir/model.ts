import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("beta", {
      value: 0.2,
      texName: "beta",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addParameter("gamma", {
      value: 0.1,
      texName: "gamma",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addVariable("s", {
      value: 0.9,
      texName: "s",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addVariable("i", {
      value: 0.1,
      texName: "i",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addVariable("r", {
      value: 0.0,
      texName: "r",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addReaction("infection", {
      fn: new Mul([new Name("beta"), new Name("i"), new Name("s")]),
      stoichiometry: [
        { name: "s", value: new Num(-1.0) },
        { name: "i", value: new Num(1.0) },
      ],
      texName: "infection",
    })
    .addReaction("recovery", {
      fn: new Mul([new Name("gamma"), new Name("i")]),
      stoichiometry: [
        { name: "i", value: new Num(-1.0) },
        { name: "r", value: new Num(1.0) },
      ],
      texName: "recovery",
    });
}
