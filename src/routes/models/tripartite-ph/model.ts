import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Tripartite microbial community with pH-dependent, resource-explicit growth.
 *
 * Unpublished extension of the tripartite Public/Cheater/Private model (see
 * the `tripartite` route for the published version) that replaces its
 * constant growth rates with Monod kinetics on explicit sucrose (S) and
 * extracellular glucose (G) pools, each additionally gated by a per-species
 * Gaussian pH-response curve. The public metabolizer hydrolyses sucrose,
 * retaining a (1-r) share of the resulting growth for itself and releasing
 * the rest as extracellular glucose that the cheater consumes.
 *
 * Variables: PublicMetabolizer (P), Cheater (C), PrivateMetabolizer (M),
 *   Sucrose (S), ExtracellularGlucose (G)
 * Parameters: pH (H), mu_PS_max/mu_MS_max/mu_CG_max (maximum growth rates),
 *   K_PS/K_MS/K_CG (half-saturation constants), H_opt_P/H_opt_C/H_opt_M
 *   (pH optima), sigma_H_P/sigma_H_C/sigma_H_M (pH-response widths), r
 *   (fraction of Public's sucrose growth released as glucose), alpha
 *   (Cheater-driven burden on Public — a pure cost, not a mass transfer:
 *   unlike beta, Cheater gets no corresponding gain from it), beta (P<->M
 *   transfer), eta/nu/gamma (self-limitation), Y_PS/Y_MS/Y_CG
 *   (resource-to-cell yield coefficients)
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addVariable("PublicMetabolizer", {
      value: 1.0e5,
      displayName: "Public Metabolizer",
      texName: String.raw`\text{Public}`,
      slider: {
        min: "0.0",
        max: "500000.0",
        step: "1000",
      },
    })
    .addVariable("Cheater", {
      value: 1.0e5,
      displayName: "Cheater",
      texName: String.raw`\text{Cheater}`,
      slider: {
        min: "0.0",
        max: "500000.0",
        step: "1000",
      },
    })
    .addVariable("PrivateMetabolizer", {
      value: 1.0e5,
      displayName: "Private Metabolizer",
      texName: String.raw`\text{Private}`,
      slider: {
        min: "0.0",
        max: "500000.0",
        step: "1000",
      },
    })
    .addVariable("Sucrose", {
      value: 20.0,
      displayName: "Sucrose",
      texName: String.raw`S`,
      slider: {
        min: "10.0",
        max: "30.0",
        step: "0.5",
      },
    })
    .addVariable("ExtracellularGlucose", {
      value: 0.0,
      displayName: "Extracellular Glucose",
      texName: String.raw`G`,
      // slider: {
      //   min: "0.0",
      //   max: "30.0",
      //   step: "0.1",
      // },
    })
    .addParameter("pH", {
      value: 6.0,
      displayName: "Environmental pH",
      texName: String.raw`H`,
      slider: {
        desc: "(environmental pH)",
        min: "4.5",
        max: "7.5",
        step: "0.1",
      },
    })
    .addParameter("mu_PS_max", {
      value: 0.2,
      displayName: "Public max. sucrose growth rate",
      texName: String.raw`\mu_{P,S}^{\max}`,
      slider: {
        desc: "(h^-1)",
        min: "0.0",
        max: "0.8",
        step: "0.01",
      },
    })
    .addParameter("mu_MS_max", {
      value: 0.18,
      displayName: "Private max. sucrose growth rate",
      texName: String.raw`\mu_{M,S}^{\max}`,
      slider: {
        desc: "(h^-1)",
        min: "0.0",
        max: "0.8",
        step: "0.01",
      },
    })
    .addParameter("mu_CG_max", {
      value: 0.2,
      displayName: "Cheater max. glucose growth rate",
      texName: String.raw`\mu_{C,G}^{\max}`,
      slider: {
        desc: "(h^-1)",
        min: "0.0",
        max: "0.8",
        step: "0.01",
      },
    })
    .addParameter("K_PS", {
      value: 2.0,
      displayName: "Public sucrose half-saturation",
      texName: String.raw`K_{P,S}`,
      // slider: {
      //   desc: "(mM)",
      //   min: "0.0",
      //   max: "10.0",
      //   step: "0.1",
      // },
    })
    .addParameter("K_MS", {
      value: 1.5,
      displayName: "Private sucrose half-saturation",
      texName: String.raw`K_{M,S}`,
      // slider: {
      //   desc: "(mM)",
      //   min: "0.0",
      //   max: "10.0",
      //   step: "0.1",
      // },
    })
    .addParameter("K_CG", {
      value: 0.25,
      displayName: "Cheater glucose half-saturation",
      texName: String.raw`K_{C,G}`,
      // slider: {
      //   desc: "(mM)",
      //   min: "0.0",
      //   max: "2.0",
      //   step: "0.01",
      // },
    })
    .addParameter("H_opt_P", {
      value: 5.5,
      displayName: "Public pH optimum",
      texName: String.raw`H_{\mathrm{opt},P}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "4.5",
      //   max: "7.5",
      //   step: "0.1",
      // },
    })
    .addParameter("H_opt_C", {
      value: 6.0,
      displayName: "Cheater pH optimum",
      texName: String.raw`H_{\mathrm{opt},C}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "4.5",
      //   max: "7.5",
      //   step: "0.1",
      // },
    })
    .addParameter("H_opt_M", {
      value: 6.5,
      displayName: "Private pH optimum",
      texName: String.raw`H_{\mathrm{opt},M}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "4.5",
      //   max: "7.5",
      //   step: "0.1",
      // },
    })
    .addParameter("sigma_H_P", {
      value: 0.9,
      displayName: "Public pH-response width",
      texName: String.raw`\sigma_{H,P}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "0.1",
      //   max: "3.0",
      //   step: "0.05",
      // },
    })
    .addParameter("sigma_H_C", {
      value: 0.9,
      displayName: "Cheater pH-response width",
      texName: String.raw`\sigma_{H,C}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "0.1",
      //   max: "3.0",
      //   step: "0.05",
      // },
    })
    .addParameter("sigma_H_M", {
      value: 0.9,
      displayName: "Private pH-response width",
      texName: String.raw`\sigma_{H,M}`,
      // slider: {
      //   desc: "(pH)",
      //   min: "0.1",
      //   max: "3.0",
      //   step: "0.05",
      // },
    })
    .addParameter("r", {
      value: 0.4,
      displayName: "Public glucose-release fraction",
      texName: String.raw`r`,
      // slider: {
      //   desc: "(fraction)",
      //   min: "0.0",
      //   max: "1.0",
      //   step: "0.01",
      // },
    })
    .addParameter("alpha", {
      value: 1.5e-8,
      displayName: "Cheater burden on Public",
      texName: String.raw`\alpha`,
      // slider: {
      //   desc: "(cost only, no Cheater gain; mL cell^-1 h^-1)",
      //   min: "0.0",
      //   max: "5.0e-8",
      //   step: "1.0e-10",
      // },
    })
    .addParameter("beta", {
      value: 1.0e-8,
      displayName: "Transfer rate",
      texName: String.raw`\beta`,
      // slider: {
      //   desc: "(P↔M, mL cell^-1 h^-1)",
      //   min: "0.0",
      //   max: "5.0e-8",
      //   step: "1.0e-10",
      // },
    })
    .addParameter("eta", {
      value: 5.0e-8,
      displayName: "Public self-limitation",
      texName: String.raw`\eta`,
      // slider: {
      //   desc: "(mL cell^-1 h^-1)",
      //   min: "0.0",
      //   max: "2.0e-7",
      //   step: "1.0e-9",
      // },
    })
    .addParameter("nu", {
      value: 5.0e-8,
      displayName: "Cheater self-limitation",
      texName: String.raw`\nu`,
      // slider: {
      //   desc: "(mL cell^-1 h^-1)",
      //   min: "0.0",
      //   max: "2.0e-7",
      //   step: "1.0e-9",
      // },
    })
    .addParameter("gamma", {
      value: 5.0e-8,
      displayName: "Private self-limitation",
      texName: String.raw`\gamma`,
      // slider: {
      //   desc: "(mL cell^-1 h^-1)",
      //   min: "0.0",
      //   max: "2.0e-7",
      //   step: "1.0e-9",
      // },
    })
    .addParameter("Y_PS", {
      value: 1.7e6,
      displayName: "Public sucrose yield",
      texName: String.raw`Y_{P,S}`,
      // slider: {
      //   desc: "(cells mL^-1 mM^-1)",
      //   min: "0.0",
      //   max: "3.0e6",
      //   step: "1.0e4",
      // },
    })
    .addParameter("Y_MS", {
      value: 1.7e6,
      displayName: "Private sucrose yield",
      texName: String.raw`Y_{M,S}`,
      // slider: {
      //   desc: "(cells mL^-1 mM^-1)",
      //   min: "0.0",
      //   max: "3.0e6",
      //   step: "1.0e4",
      // },
    })
    .addParameter("Y_CG", {
      value: 8.7e5,
      displayName: "Cheater glucose yield",
      texName: String.raw`Y_{C,G}`,
      // slider: {
      //   desc: "(cells mL^-1 mM^-1)",
      //   min: "0.0",
      //   max: "2.0e6",
      //   step: "1.0e4",
      // },
    })
    .addAssignment("fPH_Public", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Pow(
              new Minus([new Name("pH"), new Name("H_opt_P")]),
              new Num(2.0),
            ),
            new Mul([
              new Num(2.0),
              new Pow(new Name("sigma_H_P"), new Num(2.0)),
            ]),
          ]),
        ]),
      ),
      displayName: "Public pH response",
      texName: String.raw`f_{P,H}`,
    })
    .addAssignment("fPH_Cheater", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Pow(
              new Minus([new Name("pH"), new Name("H_opt_C")]),
              new Num(2.0),
            ),
            new Mul([
              new Num(2.0),
              new Pow(new Name("sigma_H_C"), new Num(2.0)),
            ]),
          ]),
        ]),
      ),
      displayName: "Cheater pH response",
      texName: String.raw`f_{C,H}`,
    })
    .addAssignment("fPH_Private", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Pow(
              new Minus([new Name("pH"), new Name("H_opt_M")]),
              new Num(2.0),
            ),
            new Mul([
              new Num(2.0),
              new Pow(new Name("sigma_H_M"), new Num(2.0)),
            ]),
          ]),
        ]),
      ),
      displayName: "Private pH response",
      texName: String.raw`f_{M,H}`,
    })
    .addAssignment("muPS", {
      fn: new Mul([
        new Name("mu_PS_max"),
        new Divide([
          new Name("Sucrose"),
          new Add([new Name("K_PS"), new Name("Sucrose")]),
        ]),
        new Name("fPH_Public"),
      ]),
      displayName: "Public sucrose growth rate",
      texName: String.raw`\mu_{P,S}`,
    })
    .addAssignment("muMS", {
      fn: new Mul([
        new Name("mu_MS_max"),
        new Divide([
          new Name("Sucrose"),
          new Add([new Name("K_MS"), new Name("Sucrose")]),
        ]),
        new Name("fPH_Private"),
      ]),
      displayName: "Private sucrose growth rate",
      texName: String.raw`\mu_{M,S}`,
    })
    .addAssignment("muCG", {
      fn: new Mul([
        new Name("mu_CG_max"),
        new Divide([
          new Name("ExtracellularGlucose"),
          new Add([new Name("K_CG"), new Name("ExtracellularGlucose")]),
        ]),
        new Name("fPH_Cheater"),
      ]),
      displayName: "Cheater glucose growth rate",
      texName: String.raw`\mu_{C,G}`,
    })
    .addReaction("public_retained_sucrose_growth", {
      fn: new Mul([
        new Minus([new Num(1.0), new Name("r")]),
        new Name("muPS"),
        new Name("PublicMetabolizer"),
      ]),
      stoichiometry: [{ name: "PublicMetabolizer", value: new Num(1.0) }],
    })
    .addReaction("private_sucrose_growth", {
      fn: new Mul([new Name("muMS"), new Name("PrivateMetabolizer")]),
      stoichiometry: [{ name: "PrivateMetabolizer", value: new Num(1.0) }],
    })
    .addReaction("cheater_glucose_growth", {
      fn: new Mul([new Name("muCG"), new Name("Cheater")]),
      stoichiometry: [{ name: "Cheater", value: new Num(1.0) }],
    })
    .addReaction("public_sucrose_consumption", {
      fn: new Divide([
        new Mul([new Name("muPS"), new Name("PublicMetabolizer")]),
        new Name("Y_PS"),
      ]),
      stoichiometry: [{ name: "Sucrose", value: new Num(-1.0) }],
    })
    .addReaction("private_sucrose_consumption", {
      fn: new Divide([
        new Mul([new Name("muMS"), new Name("PrivateMetabolizer")]),
        new Name("Y_MS"),
      ]),
      stoichiometry: [{ name: "Sucrose", value: new Num(-1.0) }],
    })
    .addReaction("public_resource_release", {
      fn: new Mul([
        new Name("r"),
        new Divide([
          new Mul([new Name("muPS"), new Name("PublicMetabolizer")]),
          new Name("Y_PS"),
        ]),
      ]),
      stoichiometry: [{ name: "ExtracellularGlucose", value: new Num(1.0) }],
    })
    .addReaction("cheater_glucose_consumption", {
      fn: new Divide([
        new Mul([new Name("muCG"), new Name("Cheater")]),
        new Name("Y_CG"),
      ]),
      stoichiometry: [{ name: "ExtracellularGlucose", value: new Num(-1.0) }],
    })
    .addReaction("cheater_pressure_on_public", {
      // Cost only, by design (matches the source notebook): Cheater grows
      // solely via cheater_glucose_growth above, not by consuming Public
      // here, so this reaction has no ExtracellularGlucose/Cheater credit.
      fn: new Mul([
        new Name("alpha"),
        new Name("PublicMetabolizer"),
        new Name("Cheater"),
      ]),
      stoichiometry: [{ name: "PublicMetabolizer", value: new Num(-1.0) }],
    })
    .addReaction("public_to_private_transfer", {
      fn: new Mul([
        new Name("beta"),
        new Name("PublicMetabolizer"),
        new Name("PrivateMetabolizer"),
      ]),
      stoichiometry: [
        { name: "PublicMetabolizer", value: new Num(-1.0) },
        { name: "PrivateMetabolizer", value: new Num(1.0) },
      ],
    })
    .addReaction("public_density_loss", {
      fn: new Mul([
        new Name("eta"),
        // FIXME: square
        new Name("PublicMetabolizer"),
        new Name("PublicMetabolizer"),
      ]),
      stoichiometry: [{ name: "PublicMetabolizer", value: new Num(-1.0) }],
    })
    .addReaction("cheater_density_loss", {
      fn: new Mul([
        new Name("nu"),
        // FIXME: square
        new Name("Cheater"),
        new Name("Cheater"),
      ]),
      stoichiometry: [{ name: "Cheater", value: new Num(-1.0) }],
    })
    .addReaction("private_density_loss", {
      fn: new Mul([
        new Name("gamma"),
        // FIXME: square
        new Name("PrivateMetabolizer"),
        new Name("PrivateMetabolizer"),
      ]),
      stoichiometry: [{ name: "PrivateMetabolizer", value: new Num(-1.0) }],
    });
}
