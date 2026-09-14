import {
  additiveMechanism,
  KineticModelBuilder,
  softplusActivation,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Divide,
  Minus,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

// Both state variables range roughly 1-38 over the data (lotka-volterra-
// data.csv), but Glorot init (nnBlock.ts's glorotUniform) sizes weights for
// O(1) inputs — feeding raw Prey/Predator into the first layer saturates
// softplus's flat (~0 output, ~0 gradient) side for roughly half the hidden
// units at initialization, permanently, regardless of learning rate. Rather
// than changing nnBlock.ts's shared Glorot init (would ripple into every
// model in the app), this feeds the block *normalized* inputs instead of the
// raw variables — ordinary derived assignments, no schema change needed,
// since NNBlockConfig.inputs already accepts "existing variables/parameters/
// derived quantities" (its own doc comment), not just variables;
// TableNNBlocks.svelte's UI restricts inputs to "every variable" only as its
// own simplification, not a schema rule.
const NORMALIZATION_SCALE = 20;

/**
 * Neural differential equation (NDE) version of the Lotka-Volterra
 * predator-prey system: the same three reactions the UDE showcase uses
 * (prey_growth, predation, predator_death), each with its rate law fixed at
 * `Num(0)` — only the *stoichiometry* is mechanistic here, not any rate.
 * A single `targetKind: "reaction"` NN block corrects all three reactions'
 * rates directly (mxl-schemas nn_blocks v2's reaction-mode target, not the
 * UDE showcase's per-equation `targetKind: "variable"`), so each learned
 * output *is* a reaction's whole rate law (`additive`: `0 + scale·NN =
 * scale·NN`) rather than a per-equation dx/dt correction — the network has
 * to discover Lotka-Volterra's mass-action rate structure on its own, not
 * just a residual on top of it.
 *
 * `predation`'s stoichiometry keeps Beta/Delta as ordinary trainable
 * `Parameter`s (same values as the UDE showcase) rather than collapsing to
 * unit ±1 coefficients like the other two reactions: this fixes the known
 * stoichiometric ratio between prey lost and predator gained per predation
 * event, while leaving the predation rate's actual functional form (in Prey,
 * Predator) entirely to the network — a deliberate partial-mechanism choice,
 * not an oversight. Architecture otherwise matches the UDE showcase's
 * default NN block (1 hidden layer of width 4, softplus, linear output,
 * scale 0.01, same fixed seed) except for reading normalized
 * (PreyNorm/PredatorNorm, see NORMALIZATION_SCALE above) rather than raw
 * inputs, and an output width of 3 (one per targeted reaction) instead of 2.
 *
 * Variables: Prey, Predator
 * Parameters: β (predation's prey-loss coefficient), δ (predation's
 * predator-gain coefficient)
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("Beta", {
      value: 0.02,
      texName: "\\beta",
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
    .addAssignment("PreyNorm", {
      fn: new Divide([new Name("Prey"), new Num(NORMALIZATION_SCALE)]),
      texName: "Prey\\_norm",
    })
    .addAssignment("PredatorNorm", {
      fn: new Divide([new Name("Predator"), new Num(NORMALIZATION_SCALE)]),
      texName: "Predator\\_norm",
    })
    .addReaction("prey_growth", {
      fn: new Num(0),
      stoichiometry: [{ name: "Prey", value: new Num(1.0) }],
      texName: "prey\\_growth",
    })
    .addReaction("predation", {
      fn: new Num(0),
      stoichiometry: [
        { name: "Prey", value: new Minus([new Name("Beta")]) },
        { name: "Predator", value: new Name("Delta") },
      ],
      texName: "predation",
    })
    .addReaction("predator_death", {
      fn: new Num(0),
      stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
      texName: "predator\\_death",
    })
    .addNNBlock("nde_correction", {
      inputs: ["PreyNorm", "PredatorNorm"],
      targetKind: "reaction",
      targets: ["prey_growth", "predation", "predator_death"],
      layers: [
        { type: "dense", width: 4, activation: softplusActivation() },
        { type: "dense", width: 3 },
      ],
      seed: 42,
      scale: 0.01,
      trained: true,
      mechanism: additiveMechanism(),
    });
}
