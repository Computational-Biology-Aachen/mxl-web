import { Mul, Name, Num } from "$lib/mathml";
import { ModelBuilder } from "$lib/model-editor/modelBuilder";

export function initModel(): ModelBuilder {
  return new ModelBuilder()
    .addParameter("Alpha", {
      value: 0.1,
      texName: String.raw`\alpha`,
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Beta", {
      value: 0.02,
      texName: String.raw`\beta`,
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Gamma", {
      value: 0.4,
      texName: String.raw`\gamma`,
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Delta", {
      value: 0.02,
      texName: String.raw`\delta`,
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.001",
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
      fn: new Mul([new Name("Delta"), new Name("Prey"), new Name("Predator")]),
      stoichiometry: [{ name: "Predator", value: new Num(1.0) }],
    })
    .addReaction("v3", {
      fn: new Mul([new Name("Gamma"), new Name("Predator")]),
      stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
    });
}
