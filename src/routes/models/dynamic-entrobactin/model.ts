import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Minus,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Dynamic enterobactin: siderophore-mediated cross-feeding between
 * E. coli (producer) and C. glutamicum (exploiter) under iron limitation.
 *
 * Krüger, Paik, Bund, Pesch et al. (2026), bioRxiv 2026.05.27.728356.
 * https://doi.org/10.64898/2026.05.27.728356
 *
 * E. coli secretes the siderophore enterobactin, which chelates iron and can
 * be taken up by both species. Growth of each organism follows a
 * double-Monod law on the shared glucose substrate and on enterobactin, with
 * biomass yield coefficients on glucose and separate maximum rates for
 * enterobactin production (E. coli only) and uptake (both species).
 *
 * Variables: e_coli, c_glutamicum, glucose, enterobactin
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addVariable("e_coli", {
      value: new Name("inoculation_ratio"),
      texName: String.raw`\text{E. coli}`,
    })
    .addVariable("c_glutamicum", {
      value: new Add([
        new Num(1.0),
        new Minus([new Name("inoculation_ratio")]),
      ]),
      texName: String.raw`\text{C. Glutamicum}`,
    })
    .addVariable("glucose", {
      value: 10.0,
      texName: String.raw`\text{Glucose}`,
    })
    .addVariable("enterobactin", {
      value: 0.02,
      texName: String.raw`\text{Enterobactin}`,
    })
    .addParameter("Y_e_coli_glucose", {
      value: 0.45,
      texName: String.raw`Y_{E.\ coli,\ Glucose}`,
    })
    .addParameter("Y_c_glutamicum_glucose", {
      value: 0.5,
      texName: String.raw`Y_{C.\ glutamicum,\ Glucose}`,
    })
    .addParameter("mu_max_e_coli", {
      value: 0.22,
      displayName: "E. coli max. growth rate",
      texName: String.raw`mu_{max,\ E.\ coli}`,
      slider: {
        min: "0.1",
        max: "0.9",
        step: "0.1",
      },
    })
    .addParameter("mu_max_c_glutamicum", {
      value: 0.45,
      displayName: "C. glutamicum max. growth rate",
      texName: String.raw`mu_{max,\ C.\ glutamicum}`,
      slider: {
        min: "0.1",
        max: "0.9",
        step: "0.1",
      },
    })
    .addParameter("K_s_glucose_e_coli", {
      value: 0.0005,
      texName: String.raw`K_{s,\ Glucose,\ E.\ coli}`,
    })
    .addParameter("K_s_glucose_c_glutamicum", {
      value: 0.005,
      texName: String.raw`K_{s,\ Glucose,\ C.\ Glutamicum}`,
    })
    .addParameter("q_enterobactin_production_max", {
      value: 0.015,
      texName: String.raw`q_{Enterobactin\ production\ max}`,
    })
    .addParameter("q_enterobactin_uptake_e_coli_max", {
      value: 0.005,
      texName: String.raw`q_{Enterobactin\ uptake\ E.\ coli\ max}`,
    })
    .addParameter("q_enterobactin_uptake_c_glutamicum_max", {
      value: 0.01,
      texName: String.raw`q_{Enterobactin\ uptake\ C.\ Glutamicum\ max}`,
    })
    .addParameter("K_s_enterobactin_e_coli", {
      value: 1e-5,
      texName: String.raw`K_{s,\ Enterobactin,\ E.\ coli}`,
    })
    .addParameter("K_s_enterobactin_c_glutamicum", {
      value: 0.001,
      texName: String.raw`K_{s,\ Enterobactin,\ C.\ Glutamicum}`,
    })
    .addParameter("inoculation_ratio", {
      value: 0.5,
      texName: String.raw`\theta`,
      // slider: {
      //   min: "0.1",
      //   max: "0.9",
      //   step: "0.1",
      // },
    })
    .addReaction("mu_e_coli", {
      fn: new Divide([
        new Mul([
          new Name("mu_max_e_coli"),
          new Name("enterobactin"),
          new Name("glucose"),
        ]),
        new Mul([
          new Add([new Name("K_s_glucose_e_coli"), new Name("glucose")]),
          new Add([
            new Name("K_s_enterobactin_e_coli"),
            new Name("enterobactin"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "e_coli", value: new Name("e_coli") },
        {
          name: "glucose",
          value: new Minus([
            new Divide([new Name("e_coli"), new Name("Y_e_coli_glucose")]),
          ]),
        },
      ],
      texName: String.raw`mu_{E.\ coli}`,
    })
    .addReaction("mu_c_glutamicum", {
      fn: new Divide([
        new Mul([
          new Name("mu_max_c_glutamicum"),
          new Name("enterobactin"),
          new Name("glucose"),
        ]),
        new Mul([
          new Add([new Name("K_s_glucose_c_glutamicum"), new Name("glucose")]),
          new Add([
            new Name("K_s_enterobactin_c_glutamicum"),
            new Name("enterobactin"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "c_glutamicum", value: new Name("c_glutamicum") },
        {
          name: "glucose",
          value: new Minus([
            new Divide([
              new Name("c_glutamicum"),
              new Name("Y_c_glutamicum_glucose"),
            ]),
          ]),
        },
      ],
      texName: String.raw`mu_{C.\ Glutamicum}`,
    })
    .addReaction("q_enterobactin_production", {
      fn: new Divide([
        new Mul([
          new Name("mu_e_coli"),
          new Name("q_enterobactin_production_max"),
        ]),
        new Name("mu_max_e_coli"),
      ]),
      stoichiometry: [{ name: "enterobactin", value: new Name("e_coli") }],
      texName: String.raw`q\\_enterobactin\\_production`,
    })
    .addReaction("q_enterobactin_uptake_e_coli", {
      fn: new Divide([
        new Mul([
          new Name("mu_e_coli"),
          new Name("q_enterobactin_uptake_e_coli_max"),
        ]),
        new Name("mu_max_e_coli"),
      ]),
      stoichiometry: [
        { name: "enterobactin", value: new Minus([new Name("e_coli")]) },
      ],
      texName: String.raw`q\\_enterobactin\\_uptake\\_E.\ coli`,
    })
    .addReaction("q_enterobactin_uptake_c_glutamicum", {
      fn: new Divide([
        new Mul([
          new Name("mu_c_glutamicum"),
          new Name("q_enterobactin_uptake_c_glutamicum_max"),
        ]),
        new Name("mu_max_c_glutamicum"),
      ]),
      stoichiometry: [
        {
          name: "enterobactin",
          value: new Minus([new Name("c_glutamicum")]),
        },
      ],
      texName: String.raw`q\\_enterobactin\\_uptake\\C.\ Glutamicum`,
    });
}
