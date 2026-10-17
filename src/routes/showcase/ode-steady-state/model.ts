import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Inducible gene expression: an inducer activates transcription through a
 * Hill function (plus a small leak), mRNA is translated into protein, and
 * both decay first-order. At steady state
 *   mRNA* = (v_leak + v_max·I^n / (K_ind^n + I^n)) / d_m,
 *   protein* = k_tl·mRNA* / d_p,
 * so a dose-response series of steady states pins down K_ind and v_max.
 *
 * Variables: mRNA, protein
 * Parameters: inducer (the condition), v_max, K_ind, n_hill, v_leak, d_m, k_tl, d_p
 */
export function initModel(): KineticModelBuilder {
  const hill = (x: string) => new Pow(new Name(x), new Name("n_hill"));
  return new KineticModelBuilder()
    .addParameter("inducer", {
      value: 1,
      texName: "I",
      slider: { min: "0", max: "32", step: "0.5" },
    })
    .addParameter("v_max", { value: 1, texName: "v_{max}" })
    .addParameter("K_ind", { value: 5, texName: "K_{ind}" })
    .addParameter("n_hill", { value: 2, texName: "n" })
    .addParameter("v_leak", { value: 0.02, texName: "v_{leak}" })
    .addParameter("d_m", { value: 0.2, texName: "d_m" })
    .addParameter("k_tl", { value: 2, texName: "k_{tl}" })
    .addParameter("d_p", { value: 0.05, texName: "d_p" })
    .addVariable("mRNA", { value: 0, texName: "mRNA" })
    .addVariable("protein", { value: 0, texName: "protein" })
    .addReaction("transcription", {
      fn: new Add([
        new Name("v_leak"),
        new Divide([
          new Mul([new Name("v_max"), hill("inducer")]),
          new Add([hill("K_ind"), hill("inducer")]),
        ]),
      ]),
      stoichiometry: [{ name: "mRNA", value: new Num(1) }],
    })
    .addReaction("mRNA_decay", {
      fn: new Mul([new Name("d_m"), new Name("mRNA")]),
      stoichiometry: [{ name: "mRNA", value: new Num(-1) }],
    })
    .addReaction("translation", {
      fn: new Mul([new Name("k_tl"), new Name("mRNA")]),
      stoichiometry: [{ name: "protein", value: new Num(1) }],
    })
    .addReaction("protein_decay", {
      fn: new Mul([new Name("d_p"), new Name("protein")]),
      stoichiometry: [{ name: "protein", value: new Num(-1) }],
    });
}
