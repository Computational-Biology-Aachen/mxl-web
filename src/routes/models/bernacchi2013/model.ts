import { SteadyStateModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Max,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
  Sqrt,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): SteadyStateModelBuilder {
  return new SteadyStateModelBuilder()
    .addCustomUnit("mol_e", {
      symbol: "mol e⁻",
      tex: "\\mathrm{mol\\,e^{-}}",
      description: "mole of electrons",
    })
    .addParameter("Ci", {
      value: 275,
      displayName: "Ci",
      unit: "umol mol^-1",
      texName: "C_i",
      slider: { min: "0", max: "1500", step: "5" },
    })
    .addParameter("PPFD", {
      value: 1500,
      displayName: "PPFD",
      unit: "umol m^-2 s^-1",
      texName: "\\mathrm{PPFD}",
      slider: { min: "0", max: "2500", step: "10" },
    })
    .addParameter("Vcmax", {
      value: 100,
      unit: "umol m^-2 s^-1",
      texName: "V_{cmax}",
    })
    .addParameter("Jmax", {
      value: 200,
      unit: "umol m^-2 s^-1",
      texName: "J_{max}",
    })
    .addParameter("TPU", {
      value: 12,
      unit: "umol m^-2 s^-1",
      texName: "T_{PU}",
    })
    .addParameter("Rd", {
      value: 1.5,
      unit: "umol m^-2 s^-1",
      texName: "R_d",
    })
    .addParameter("Gamma_star", {
      value: 42.75,
      unit: "umol mol^-1",
      texName: "\\Gamma^*",
    })
    .addParameter("Kc", {
      value: 404.9,
      unit: "umol mol^-1",
      texName: "K_c",
    })
    .addParameter("Ko", {
      value: 278.4,
      unit: "mmol mol^-1",
      texName: "K_o",
    })
    .addParameter("O", {
      value: 210,
      displayName: "O",
      unit: "mmol mol^-1",
      texName: "O",
    })
    .addParameter("alpha", {
      value: 0.24,
      unit: "mol_e E^-1",
      texName: "\\alpha",
    })
    .addParameter("theta", {
      value: 0.7,
      unit: "dimensionless",
      texName: "\\theta",
    })
    .addAssignment("absorbed", {
      fn: new Mul([new Name("alpha"), new Name("PPFD")]),
      displayName: "absorbed",
      unit: "umol m^-2 s^-1",
      texName: "\\text{abs}",
    })
    .addAssignment("Ci_safe", {
      fn: new Max([new Name("Ci"), new Num(1)]),
      displayName: "Ci_safe",
      unit: "umol mol^-1",
      texName: "C_{i, safe}",
    })
    .addAssignment("J", {
      fn: new Divide([
        new Minus([
          new Add([new Name("absorbed"), new Name("Jmax")]),
          new Sqrt(
            new Max([
              new Minus([
                new Pow(
                  new Add([new Name("absorbed"), new Name("Jmax")]),
                  new Num(2),
                ),
                new Mul([
                  new Num(4),
                  new Name("theta"),
                  new Name("absorbed"),
                  new Name("Jmax"),
                ]),
              ]),
              new Num(0),
            ]),
            new Num(2),
          ),
        ]),
        new Mul([new Num(2), new Name("theta")]),
      ]),
      displayName: "J",
      unit: "umol m^-2 s^-1",
      texName: "J",
    })
    .addAssignment("Wc", {
      fn: new Divide([
        new Mul([new Name("Vcmax"), new Name("Ci_safe")]),
        new Add([
          new Name("Ci_safe"),
          new Mul([
            new Name("Kc"),
            new Add([new Num(1), new Divide([new Name("O"), new Name("Ko")])]),
          ]),
        ]),
      ]),
      displayName: "Wc",
      unit: "umol m^-2 s^-1",
      texName: "W_c",
    })
    .addAssignment("rubisco", {
      fn: new Minus([
        new Mul([
          new Minus([
            new Num(1),
            new Divide([new Name("Gamma_star"), new Name("Ci_safe")]),
          ]),
          new Name("Wc"),
        ]),
        new Name("Rd"),
      ]),
      displayName: "Ac",
      unit: "umol m^-2 s^-1",
      texName: "A_c",
    })
    .addAssignment("rubp", {
      fn: new Minus([
        new Divide([
          new Mul([
            new Name("J"),
            new Minus([new Name("Ci_safe"), new Name("Gamma_star")]),
          ]),
          new Add([
            new Mul([new Num(4), new Name("Ci_safe")]),
            new Mul([new Num(8), new Name("Gamma_star")]),
          ]),
        ]),
        new Name("Rd"),
      ]),
      displayName: "Aj",
      unit: "umol m^-2 s^-1",
      texName: "A_j",
    })
    .addAssignment("tpu", {
      fn: new Minus([new Mul([new Num(3), new Name("TPU")]), new Name("Rd")]),
      displayName: "Ap",
      unit: "umol m^-2 s^-1",
      texName: "A_p",
    })
    .addAssignment("an", {
      fn: new Min([new Name("rubisco"), new Name("rubp"), new Name("tpu")]),
      displayName: "An",
      unit: "umol m^-2 s^-1",
      texName: "A_n",
    });
}
