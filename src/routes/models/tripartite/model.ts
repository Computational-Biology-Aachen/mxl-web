import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Minus,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Tripartite microbial community — cooperation, privatization and cheating.
 *
 * Hassan, Dwivedi, Schuster & Matuszyńska (2026), Open Biol. 16:250484.
 * https://doi.org/10.1098/rsob.250484
 *
 * A closed, well-mixed batch culture in which sucrose is the sole carbon
 * source. Three strategies compete for it: the public metabolizer secretes
 * invertase to hydrolyse sucrose into glucose, making it a shared resource;
 * the cheater exploits that glucose without paying the production cost; the
 * private metabolizer imports and digests sucrose intracellularly, avoiding
 * both sharing and exploitation. Growth follows a generalized Lotka-Volterra
 * model (eq. 2.1) with density-dependent self-limitation for each strategy.
 *
 * Variables: PublicMetabolizer (P), Cheater (C), PrivateMetabolizer (M)
 * Parameters: growthRatePublic (r_P), growthRatePrivate (r_M),
 *   exploitationRatePublicToCheater (alpha), competitionRatePublicPrivate (beta),
 *   selfLimitationPublic (eta), selfLimitationCheater (nu), selfLimitationPrivate (gamma)
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addVariable("PublicMetabolizer", {
      value: 1.0,
      displayName: "Public Metabolizer",
      texName: String.raw`\text{Public}`,
      slider: {
        min: "0.0",
        max: "10000.0",
        step: "1",
      },
    })
    .addVariable("Cheater", {
      value: 1.0,
      displayName: "Cheater",
      texName: String.raw`\text{Cheater}`,
      slider: {
        min: "0.0",
        max: "10000.0",
        step: "1",
      },
    })
    .addVariable("PrivateMetabolizer", {
      value: 1.0,
      displayName: "Private Metabolizer",
      texName: String.raw`\text{Private}`,
      slider: {
        min: "0.0",
        max: "10000.0",
        step: "1",
      },
    })
    .addParameter("growthRatePublic", {
      value: 0.5,
      texName: String.raw`r_P`,
      displayName: "Public growth rate",
      slider: {
        desc: "(growth rate)",
        min: "0.0",
        max: "1.0",
        step: "0.00001",
      },
    })
    .addParameter("selfLimitationPublic", {
      value: 0.0001,
      displayName: "Public self-limitation",
      texName: String.raw`\eta`,
      slider: {
        desc: "(density)",
        min: "0.0",
        max: "1.0",
        step: "0.00001",
      },
    })
    .addParameter("selfLimitationCheater", {
      value: 0.0001,
      displayName: "Cheater self-limitation",
      texName: String.raw`\nu`,
      slider: {
        desc: "(density)",
        min: "0.0",
        max: "1.0",
        step: "0.00001",
      },
    })
    .addParameter("growthRatePrivate", {
      value: 0.2,
      texName: String.raw`r_M`,
      displayName: "Private growth rate",
      slider: {
        desc: "(growth rate)",
        min: "0.0",
        max: "5.0",
        step: "0.0001",
      },
    })
    .addParameter("selfLimitationPrivate", {
      value: 0.0001,
      displayName: "Private self-limitation",
      texName: String.raw`\gamma`,
      slider: {
        desc: "(density)",
        min: "0.0",
        max: "5.0",
        step: "0.0001",
      },
    })
    .addParameter("exploitationRatePublicToCheater", {
      value: 0.0002,
      displayName: "Exploitation rate",
      texName: String.raw`\alpha`,
      slider: {
        desc: "(P→C cooperation)",
        min: "0.0",
        max: "1.0",
        step: "0.0001",
      },
    })
    .addParameter("competitionRatePublicPrivate", {
      value: 0.0001,
      displayName: "Competition rate",
      texName: String.raw`\beta`,
      slider: {
        desc: "(P↔M competition)",
        min: "0.0",
        max: "1.0",
        step: "0.0001",
      },
    })
    .addReaction("dPublicMetabolizerDt", {
      fn: new Minus([
        new Mul([new Name("growthRatePublic"), new Name("PublicMetabolizer")]),
        new Mul([
          new Name("exploitationRatePublicToCheater"),
          new Name("PublicMetabolizer"),
          new Name("Cheater"),
        ]),
        new Mul([
          new Name("competitionRatePublicPrivate"),
          new Name("PublicMetabolizer"),
          new Name("PrivateMetabolizer"),
        ]),
        new Mul([
          new Name("selfLimitationPublic"),
          // FIXME: square
          new Name("PublicMetabolizer"),
          new Name("PublicMetabolizer"),
        ]),
      ]),
      stoichiometry: [{ name: "PublicMetabolizer", value: new Num(1.0) }],
    })
    .addReaction("dCheaterDt", {
      fn: new Minus([
        new Mul([
          new Name("exploitationRatePublicToCheater"),
          new Name("PublicMetabolizer"),
          new Name("Cheater"),
        ]),
        new Mul([
          new Name("selfLimitationCheater"),
          // FIXME: square
          new Name("Cheater"),
          new Name("Cheater"),
        ]),
      ]),
      stoichiometry: [{ name: "Cheater", value: new Num(1.0) }],
    })
    .addReaction("dPrivateMetabolizerDt", {
      fn: new Minus([
        new Mul([
          new Name("growthRatePrivate"),
          new Name("PrivateMetabolizer"),
        ]),
        new Mul([
          new Name("competitionRatePublicPrivate"),
          new Name("PublicMetabolizer"),
          new Name("PrivateMetabolizer"),
        ]),
        new Mul([
          new Name("selfLimitationPrivate"),
          // FIXME: Square
          new Name("PrivateMetabolizer"),
          new Name("PrivateMetabolizer"),
        ]),
      ]),
      stoichiometry: [{ name: "PrivateMetabolizer", value: new Num(1.0) }],
    });
}
