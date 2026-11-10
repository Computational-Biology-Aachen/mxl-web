import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  LessThan,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Salvatori 2022 model
 *
 * |             |                                                                                          |
 * | ----------- | ---------------------------------------------------------------------------------------- |
 * | doi         | 10.3389/fpls.2021.787877                                                                 |
 * | main author | Nicole Salvatori                                                                         |
 * | paper title | A System Dynamics Approach to Model Photosynthesis at Leaf Level Under Fluctuating Light |
 * | published   | January 2022                                                                             |
 * | journal     | Frontiers Plant Science                                                                  |
 * | organism    | soybean, leaf, c3 photosynthesis                                                         |
 * | Ported by   | Joshua Ebeling ( @pmfjosh )                                                              |
 *
 * The Salvatori 2022 model is a soybean leaf C3 photosynthesis model, developed
 * to investigate the effect of fluctuating light on two soybean varients: Eiko
 * (WT) and MinnGold (chlorophyll deficient mutant). The goal was to investigate
 * the role of the chlorophyll content to adjust to light fluctuations. It is a
 * simple, small model, only including the important processes for the goal of the
 * study. As RuBisCO activation is known to be the main limitation in dark-light
 * transition, and stomal conductance is the same in both varients, RuBisCO is
 * included but stomatal conductance not. CBB is also not included as the focus
 * lies on fluctuations, which makes CBB irrelevant. Only light harvesting around
 * PSII is included for simplicity, but represented as ETR, that produces NADPH.
 * The NADP+ to NADPH ratio determines the delta pH in the model, which activates
 * RuBisCO. In case of excess energy, energy can be dissipated through NPQ, here
 * only qE, as it is the fastest responding NPQ mechanism and the rest are
 * irrelevant for the study. CEF is inlcuded only as a regulator of qE, as it is
 * described to be only relevant in stress conditions when delta pH generation,
 * without NADPH production is necessary.
 *
 * The model is easy to reproduce, but their figure timescale is in minutes, even
 * though simulation results differe strongly when performed over the same
 * timescale. If reduced to seconds the simulations are 1:1. So either they used
 * different units for their simulations without a parameter change or put the
 * wrong labels on their figures.
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("PPFD", {
      value: 0.0,
      texName: "PPFD",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("alpha", {
      value: 0.78,
      texName: "alpha",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("c_in", {
      value: 0.23,
      texName: "c\\_in",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Ec_PSII", {
      value: 157.56,
      texName: "Ec\\_PSII",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("v_ETR", {
      value: 0.78,
      texName: "v\\_ETR",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("v_d", {
      value: 0.08,
      texName: "v\\_d",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("Qc", {
      value: 0.07,
      texName: "Qc",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("v_NPQ", {
      value: 70.58,
      texName: "v\\_NPQ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("v_p", {
      value: 0.07,
      texName: "v\\_p",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("v_C", {
      value: 11.75,
      texName: "v\\_C",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("eta_NADPH", {
      value: 5.07,
      texName: "eta\\_NADPH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("eta_NADP", {
      value: 0.89,
      texName: "eta\\_NADP",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("v_R", {
      value: 0.00089,
      texName: "v\\_R",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("d", {
      value: 8.4,
      texName: "d",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("c_y", {
      value: -4.0,
      texName: "c\\_y",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("E_PSII", {
      value: 0.0,
      texName: "E\\_PSII",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("Q", {
      value: 0.0,
      texName: "Q",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P_NPQ", {
      value: 0.0,
      texName: "P\\_NPQ",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("NADP", {
      value: 5.0,
      texName: "NADP",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("NADPH", {
      value: 5.0,
      texName: "NADPH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("R", {
      value: 0.001,
      texName: "R",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("pH", {
      fn: new Divide([new Name("NADPH"), new Name("NADP")]),
      texName: "pH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("ETR", {
      fn: new Mul([new Name("E_PSII"), new Name("NADP"), new Name("v_ETR")]),
      texName: "ETR",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("A", {
      fn: new Mul([new Name("NADPH"), new Name("R"), new Name("v_C")]),
      texName: "A",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("Energy_input", {
      fn: new Mul([
        new Name("PPFD"),
        new Name("alpha"),
        new Name("c_in"),
        new Add([
          new Num(1.0),
          new Minus([new Divide([new Name("E_PSII"), new Name("Ec_PSII")])]),
        ]),
      ]),
      stoichiometry: [{ name: "E_PSII", value: new Num(1.0) }],
      texName: "Energy\\_input",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("ETR_out", {
      fn: new Mul([new Name("E_PSII"), new Name("NADP"), new Name("v_ETR")]),
      stoichiometry: [{ name: "E_PSII", value: new Num(-1.0) }],
      texName: "ETR\\_out",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("ETR_in", {
      fn: new Mul([
        new Name("E_PSII"),
        new Name("NADP"),
        new Name("eta_NADP"),
        new Name("v_ETR"),
      ]),
      stoichiometry: [
        { name: "NADP", value: new Num(-1.0) },
        { name: "NADPH", value: new Num(1.0) },
      ],
      texName: "ETR\\_in",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("energy_dissipation", {
      fn: new Mul([
        new Name("E_PSII"),
        new Name("P_NPQ"),
        new Name("v_d"),
        new Add([
          new Num(1.0),
          new Minus([new Divide([new Name("Q"), new Name("Qc")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "E_PSII", value: new Num(-1.0) },
        { name: "Q", value: new Num(1.0) },
      ],
      texName: "energy\\_dissipation",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("NPQ", {
      fn: new Mul([new Name("Q"), new Name("v_NPQ")]),
      stoichiometry: [{ name: "Q", value: new Num(-1.0) }],
      texName: "NPQ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("NPQ_activation", {
      fn: new Piecewise([
        new Mul([
          new Name("v_p"),
          new Add([new Num(1.0), new Minus([new Name("P_NPQ")])]),
        ]),
        new LessThan([
          new Name("c_y"),
          new Add([
            new Minus([
              new Mul([
                new Name("E_PSII"),
                new Name("NADP"),
                new Name("v_ETR"),
              ]),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("alpha"),
              new Name("c_in"),
              new Add([
                new Num(1.0),
                new Minus([
                  new Divide([new Name("E_PSII"), new Name("Ec_PSII")]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Num(0.0),
      ]),
      stoichiometry: [{ name: "P_NPQ", value: new Num(1.0) }],
      texName: "NPQ\\_activation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addReaction("Carbon_assimilation", {
      fn: new Mul([
        new Name("NADPH"),
        new Name("R"),
        new Name("eta_NADPH"),
        new Name("v_C"),
      ]),
      stoichiometry: [
        { name: "NADPH", value: new Num(-1.0) },
        { name: "NADP", value: new Num(1.0) },
      ],
      texName: "Carbon\\_assimilation",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("RuBisCO_activation", {
      fn: new Mul([
        new Name("v_R"),
        new Add([new Num(1.0), new Minus([new Name("R")])]),
        new Min([new Name("d"), new Name("pH")]),
      ]),
      stoichiometry: [{ name: "R", value: new Num(1.0) }],
      texName: "RuBisCO\\_activation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    });
}
