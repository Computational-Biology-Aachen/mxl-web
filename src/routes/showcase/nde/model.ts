import {
  additiveMechanism,
  KineticModelBuilder,
  softplusActivation,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Divide,
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
 * Pure neural differential equation (NDE) version of the Lotka-Volterra
 * predator-prey system: no mechanistic parameters or reactions at all, only
 * the two state variables and a small neural network standing in for the
 * entire dx/dt. With no reaction wired to either variable,
 * `KineticModelBuilder.dxdtExpr` returns a bare `0` for both — the
 * `relativeMultiply` mechanism the UDE showcase uses (`f · (1 + scale·NN)`)
 * would collapse to `0 · (1 + scale·NN) = 0` here, so this uses `additive`
 * (`f + scale·NN = 0 + scale·NN`) instead, matching the UDE showcase's
 * default NN block otherwise (1 hidden layer of width 4, softplus, linear
 * output, scale 0.01, same fixed seed) except for reading normalized
 * (PreyNorm/PredatorNorm, see NORMALIZATION_SCALE above) rather than raw
 * inputs — the block's targets (what it corrects) stay the real Prey/
 * Predator state variables either way.
 *
 * Variables: Prey, Predator
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
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
    .addNNBlock("nde_correction", {
      inputs: ["PreyNorm", "PredatorNorm"],
      targets: ["Prey", "Predator"],
      layers: [
        { type: "dense", width: 4, activation: softplusActivation() },
        { type: "dense", width: 2 },
      ],
      seed: 42,
      scale: 0.01,
      trained: true,
      mechanism: additiveMechanism(),
    });
}
