import { Minus, Mul, Name, Num } from "$lib/mathml";
import { ModelBuilder } from "$lib/model-editor/modelBuilder";

/**
 * Lotka-Volterra predator-prey model (Lotka 1925, Volterra 1926).
 *
 * Two-species ecological oscillator: Prey grows exponentially (α), Predator dies
 * exponentially (γ), and predation transfers biomass at rates β (prey loss) and
 * δ (predator gain per kill).
 *
 * Variables: Prey, Predator
 * Parameters: α (prey growth), β (predation loss), γ (predator death), δ (predator gain)
 */
export function initModel(): ModelBuilder {
  return new ModelBuilder()
    .addParameter("Alpha", {
      value: 0.1,
      texName: "\\alpha",
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Beta", {
      value: 0.02,
      texName: "\\beta",
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Gamma", {
      value: 0.4,
      texName: "\\gamma",
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.05",
      },
    })
    .addParameter("Delta", {
      value: 0.02,
      texName: "\\delta",
      slider: {
        min: "0.01",
        max: "1.0",
        step: "0.001",
      },
    })
    .addVariable("Prey", {
      value: 10.0,
      texName: "Prey",
      slider: {
        min: "1.0",
        max: "20.0",
        step: "1.0",
      },
    })
    .addVariable("Predator", {
      value: 10.0,
      texName: "Predator",
      slider: {
        min: "1.0",
        max: "20.0",
        step: "1.0",
      },
    })
    .addReaction("prey_growth", {
      fn: new Mul([new Name("Alpha"), new Name("Prey")]),
      stoichiometry: [{ name: "Prey", value: new Num(1.0) }],
      texName: "prey\\_growth",
    })
    .addReaction("predation", {
      fn: new Mul([new Name("Predator"), new Name("Prey")]),
      stoichiometry: [
        { name: "Prey", value: new Minus([new Name("Beta")]) },
        { name: "Predator", value: new Name("Delta") },
      ],
      texName: "predation",
    })
    .addReaction("predator_death", {
      fn: new Mul([new Name("Gamma"), new Name("Predator")]),
      stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
      texName: "predator\\_death",
    });
}
