import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Hahn 1987 Photorespiration and Photosynthesis model.
 *
 * |             |                                                             |
 * | ----------- | ----------------------------------------------------------- |
 * | doi         | 10.1093/oxfordjournals.aob.a087432                          |
 * | main author | Brian D. Hahn                                               |
 * | paper title | A Mathematical Model of Photorespiration and Photosynthesis |
 * | published   | August 1987                                                 |
 * | journal     | Annals of Botany                                            |
 * | organism    | C3 leaf                                                     |
 * | Ported by   | ElouenCorvest ( @ElouenCorvest )                            |
 *
 * A comprehensive model of C3 leaf carbon metabolism combining the Calvin cycle
 * with the glycolate and glycerate pathways of photorespiration, formulated as a
 * system of non-linear differential equations. It extends Hahn's earlier
 * Calvin-cycle models (1984, 1986) by adding the competitive inhibition of
 * ribulose-bisphosphate carboxylase by oxygen. The model reaches an effectively
 * stable steady state and behaves realistically when external CO2 and O2
 * concentrations are varied: photosynthesis is inhibited by higher oxygen levels,
 * while photorespiration is inhibited by higher carbon dioxide levels.
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("k1", {
      value: 0.344,
      texName: "k1",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k2", {
      value: 0.046,
      texName: "k2",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k3", {
      value: 0.0261,
      texName: "k3",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k4", {
      value: 0.0455,
      texName: "k4",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k5", {
      value: 0.0455,
      texName: "k5",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k6", {
      value: 0.455,
      texName: "k6",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k7", {
      value: 0.455,
      texName: "k7",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k8", {
      value: 0.909,
      texName: "k8",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k9", {
      value: 0.0136,
      texName: "k9",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k10", {
      value: 0.004,
      texName: "k10",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k11", {
      value: 4e-5,
      texName: "k11",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k12", {
      value: 0.0341,
      texName: "k12",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k13", {
      value: 1.7,
      texName: "k13",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k14", {
      value: 0.000852,
      texName: "k14",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k15", {
      value: 0.00852,
      texName: "k15",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k16", {
      value: 0.0928,
      texName: "k16",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k17", {
      value: 0.0227,
      texName: "k17",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k18", {
      value: 0.0467,
      texName: "k18",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 6 },
          { kind: "mole", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k19", {
      value: 0.00114,
      texName: "k19",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k20", {
      value: 0.0114,
      texName: "k20",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k21", {
      value: 0.00114,
      texName: "k21",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k22", {
      value: 0.00114,
      texName: "k22",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 6 },
          { kind: "mole", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k23", {
      value: 0.0114,
      texName: "k23",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k24", {
      value: 0.0114,
      texName: "k24",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 3 },
          { kind: "mole", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kc1", {
      value: 1.0,
      texName: "kc1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kc2", {
      value: 0.933,
      texName: "kc2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("rd", {
      value: 1.1e-5,
      texName: "rd",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ko1", {
      value: 0.01,
      texName: "ko1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ko2", {
      value: 4.31,
      texName: "ko2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("phic", {
      value: 1.84,
      texName: "phic",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("phio", {
      value: 0.0453,
      texName: "phio",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("phis", {
      value: 0.0001,
      texName: "phis",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("D", {
      value: 0.0001,
      texName: "D",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("E", {
      value: 0.5,
      texName: "E",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addParameter("Oa", {
      value: 100.0,
      texName: "Oa",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addParameter("Ca", {
      value: 0.45,
      texName: "Ca",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addParameter("PAg", {
      value: 0.001,
      texName: "PAg",
      unit: Unit.fromJson({
        factors: [
          { kind: "gram", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("PAr", {
      value: 0.0002,
      texName: "PAr",
      unit: Unit.fromJson({
        factors: [
          { kind: "gram", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("h", {
      value: 0.0002,
      texName: "h",
      unit: Unit.fromJson({ factors: [{ kind: "metre", exponent: 1 }] }),
    })
    .addVariable("RuBP", {
      value: 1.0,
      texName: "RuBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("PGA", {
      value: 1.0,
      texName: "PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("ADP", {
      value: 1.0,
      texName: "ADP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Pi", {
      value: 10.0,
      texName: "Pi",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("TP", {
      value: 1.0,
      texName: "TP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("HP", {
      value: 1.0,
      texName: "HP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("GG", {
      value: 100.0,
      texName: "GG",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Pio", {
      value: 1.0,
      texName: "Pio",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("TPo", {
      value: 0.1,
      texName: "TPo",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("HPo", {
      value: 0.1,
      texName: "HPo",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("UDP", {
      value: 10.0,
      texName: "UDP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("GF", {
      value: 77.3,
      texName: "GF",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("GFV", {
      value: 77.3,
      texName: "GFV",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("TPGA", {
      value: 0.1,
      texName: "TPGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("E4P", {
      value: 0.1,
      texName: "E4P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("S7P", {
      value: 0.1,
      texName: "S7P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Ru5P", {
      value: 1.0,
      texName: "Ru5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("PGl", {
      value: 1.0,
      texName: "PGl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Gl", {
      value: 1.0,
      texName: "Gl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Gx", {
      value: 1.0,
      texName: "Gx",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Sn", {
      value: 10.0,
      texName: "Sn",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Gn", {
      value: 1.0,
      texName: "Gn",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("GA", {
      value: 1.0,
      texName: "GA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("GmA", {
      value: 1.0,
      texName: "GmA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Glm", {
      value: 1.0,
      texName: "Glm",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("OxA", {
      value: 1.0,
      texName: "OxA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("NH3", {
      value: 1.0,
      texName: "NH3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("CO2", {
      value: 0.33,
      texName: "CO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
      slider: {
        min: "0.1",
        max: "1.0",
        step: "0.01",
      },
    })
    .addVariable("O2", {
      value: 0.245,
      texName: "O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Ci", {
      value: 0.4,
      texName: "Ci",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("Oi", {
      value: 101.0,
      texName: "Oi",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("AP_tot", {
      value: 11.0,
      texName: "AP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addVariable("UP_tot", {
      value: 20.0,
      texName: "UP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -3 },
        ],
      }),
    })
    .addAssignment("ATP", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("ADP")])]),
      texName: "ATP",
    })
    .addAssignment("UTP", {
      fn: new Add([new Name("UP_tot"), new Minus([new Name("UDP")])]),
      texName: "UTP",
    })
    .addAssignment("PAn", {
      fn: new Mul([
        new Num(1584000.0),
        new Name("h"),
        new Add([
          new Minus([
            new Mul([new Name("k20"), new Pow(new Name("Gn"), new Num(2.0))]),
          ]),
          new Minus([new Mul([new Num(12.0), new Name("GF"), new Name("rd")])]),
          new Mul([new Name("CO2"), new Name("RuBP"), new Name("k1")]),
        ]),
      ]),
      texName: "PAn",
    })
    .addReaction("v1", {
      fn: new Mul([new Name("CO2"), new Name("RuBP"), new Name("k1")]),
      stoichiometry: [
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGA", value: new Num(2.0) },
        { name: "CO2", value: new Num(-1.0) },
        { name: "O2", value: new Num(-0.5) },
      ],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Mul([new Name("ADP"), new Name("Pi"), new Name("k2")]),
      stoichiometry: [
        { name: "ADP", value: new Num(-1.0) },
        { name: "Pi", value: new Num(-1.0) },
      ],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Mul([new Name("ATP"), new Name("PGA"), new Name("k3")]),
      stoichiometry: [
        { name: "PGA", value: new Num(-1.0) },
        { name: "ADP", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "TP", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Mul([new Name("k4"), new Pow(new Name("TP"), new Num(2.0))]),
      stoichiometry: [
        { name: "TP", value: new Num(-2.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "HP", value: new Num(1.0) },
      ],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Mul([new Name("HP"), new Name("k5")]),
      stoichiometry: [
        { name: "HP", value: new Num(-1.0) },
        { name: "TPGA", value: new Num(1.0) },
        { name: "E4P", value: new Num(1.0) },
      ],
      texName: "v5",
    })
    .addReaction("v6", {
      fn: new Mul([new Name("E4P"), new Name("TP"), new Name("k6")]),
      stoichiometry: [
        { name: "E4P", value: new Num(-1.0) },
        { name: "TP", value: new Num(-1.0) },
        { name: "S7P", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
      ],
      texName: "v6",
    })
    .addReaction("v7", {
      fn: new Mul([new Name("S7P"), new Name("k7")]),
      stoichiometry: [
        { name: "S7P", value: new Num(-1.0) },
        { name: "TPGA", value: new Num(1.0) },
        { name: "Ru5P", value: new Num(1.0) },
      ],
      texName: "v7",
    })
    .addReaction("v8", {
      fn: new Mul([new Name("TP"), new Name("TPGA"), new Name("k8")]),
      stoichiometry: [
        { name: "TPGA", value: new Num(-1.0) },
        { name: "TP", value: new Num(-1.0) },
        { name: "Ru5P", value: new Num(1.0) },
      ],
      texName: "v8",
    })
    .addReaction("v9", {
      fn: new Mul([new Name("ATP"), new Name("Ru5P"), new Name("k9")]),
      stoichiometry: [
        { name: "Ru5P", value: new Num(-1.0) },
        { name: "ADP", value: new Num(1.0) },
        { name: "RuBP", value: new Num(1.0) },
      ],
      texName: "v9",
    })
    .addReaction("v10", {
      fn: new Mul([new Name("ATP"), new Name("HP"), new Name("k10")]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "HP", value: new Num(-1.0) },
        { name: "Pi", value: new Num(2.0) },
        { name: "GG", value: new Num(1.0) },
      ],
      texName: "v10",
    })
    .addReaction("v11", {
      fn: new Mul([new Name("GG"), new Name("Pi"), new Name("k11")]),
      stoichiometry: [
        { name: "HP", value: new Num(1.0) },
        { name: "GG", value: new Num(-1.0) },
        { name: "Pi", value: new Num(-1.0) },
      ],
      texName: "v11",
    })
    .addReaction("v12", {
      fn: new Mul([new Name("Pio"), new Name("TP"), new Name("k12")]),
      stoichiometry: [
        { name: "TP", value: new Num(-1.0) },
        { name: "Pio", value: new Num(-1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "TPo", value: new Num(1.0) },
      ],
      texName: "v12",
    })
    .addReaction("v13", {
      fn: new Mul([new Name("k13"), new Pow(new Name("TPo"), new Num(2.0))]),
      stoichiometry: [
        { name: "TPo", value: new Num(-2.0) },
        { name: "Pio", value: new Num(1.0) },
        { name: "HPo", value: new Num(1.0) },
      ],
      texName: "v13",
    })
    .addReaction("v14", {
      fn: new Mul([new Name("Pio"), new Name("UDP"), new Name("k14")]),
      stoichiometry: [
        { name: "UDP", value: new Num(-1.0) },
        { name: "Pio", value: new Num(-1.0) },
      ],
      texName: "v14",
    })
    .addReaction("v15", {
      fn: new Mul([new Name("HPo"), new Name("UTP"), new Name("k15")]),
      stoichiometry: [
        { name: "UDP", value: new Num(1.0) },
        { name: "HPo", value: new Num(-2.0) },
        { name: "Pio", value: new Num(3.0) },
        { name: "GF", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v15",
    })
    .addReaction("v16", {
      fn: new Mul([new Name("O2"), new Name("RuBP"), new Name("k16")]),
      stoichiometry: [
        { name: "O2", value: new Num(-1.0) },
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGl", value: new Num(1.0) },
        { name: "PGA", value: new Num(1.0) },
      ],
      texName: "v16",
    })
    .addReaction("v17", {
      fn: new Mul([new Name("PGl"), new Name("k17")]),
      stoichiometry: [
        { name: "PGl", value: new Num(-1.0) },
        { name: "Gl", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
      ],
      texName: "v17",
    })
    .addReaction("v18", {
      fn: new Mul([
        new Name("O2"),
        new Name("k18"),
        new Pow(new Name("Gl"), new Num(2.0)),
      ]),
      stoichiometry: [
        { name: "Gl", value: new Num(-2.0) },
        { name: "Gx", value: new Num(2.0) },
      ],
      texName: "v18",
    })
    .addReaction("v19", {
      fn: new Mul([new Name("Gx"), new Name("Sn"), new Name("k19")]),
      stoichiometry: [
        { name: "Gx", value: new Num(-1.0) },
        { name: "Sn", value: new Num(-1.0) },
        { name: "Gn", value: new Num(1.0) },
        { name: "GA", value: new Num(1.0) },
      ],
      texName: "v19",
    })
    .addReaction("v20", {
      fn: new Mul([new Name("k20"), new Pow(new Name("Gn"), new Num(2.0))]),
      stoichiometry: [
        { name: "Gn", value: new Num(-2.0) },
        { name: "Sn", value: new Num(1.0) },
        { name: "NH3", value: new Num(1.0) },
        { name: "CO2", value: new Num(1.0) },
        { name: "O2", value: new Num(-0.5) },
      ],
      texName: "v20",
    })
    .addReaction("v21", {
      fn: new Mul([new Name("ATP"), new Name("GA"), new Name("k21")]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "GA", value: new Num(-1.0) },
        { name: "PGA", value: new Num(1.0) },
      ],
      texName: "v21",
    })
    .addReaction("v22", {
      fn: new Mul([
        new Name("ATP"),
        new Name("GmA"),
        new Name("NH3"),
        new Name("k22"),
      ]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "GmA", value: new Num(-1.0) },
        { name: "NH3", value: new Num(-1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "Glm", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v22",
    })
    .addReaction("v23", {
      fn: new Mul([new Name("Glm"), new Name("OxA"), new Name("k23")]),
      stoichiometry: [
        { name: "Glm", value: new Num(-1.0) },
        { name: "OxA", value: new Num(-1.0) },
        { name: "GmA", value: new Num(2.0) },
      ],
      texName: "v23",
    })
    .addReaction("v24", {
      fn: new Mul([new Name("GmA"), new Name("Gx"), new Name("k24")]),
      stoichiometry: [
        { name: "Gx", value: new Num(-1.0) },
        { name: "GmA", value: new Num(-1.0) },
        { name: "Gn", value: new Num(1.0) },
        { name: "OxA", value: new Num(1.0) },
      ],
      texName: "v24",
    })
    .addReaction("vrd", {
      fn: new Mul([new Name("GF"), new Name("rd")]),
      stoichiometry: [
        { name: "GF", value: new Num(-1.0) },
        { name: "CO2", value: new Num(12.0) },
        { name: "O2", value: new Num(-12.0) },
      ],
      texName: "vrd",
    })
    .addReaction("vphis", {
      fn: new Mul([
        new Name("phis"),
        new Add([new Name("GF"), new Minus([new Name("E")])]),
      ]),
      stoichiometry: [{ name: "GF", value: new Num(-1.0) }],
      texName: "vphis",
    })
    .addReaction("vD", {
      fn: new Mul([
        new Name("D"),
        new Add([new Name("GF"), new Minus([new Name("GFV")])]),
      ]),
      stoichiometry: [
        { name: "GF", value: new Num(-1.0) },
        { name: "GFV", value: new Num(1.0) },
      ],
      texName: "vD",
    })
    .addReaction("vc1", {
      fn: new Mul([new Name("Ci"), new Name("kc1")]),
      stoichiometry: [
        { name: "Ci", value: new Num(-1.0) },
        { name: "CO2", value: new Num(1.0) },
      ],
      texName: "vc1",
    })
    .addReaction("vc2", {
      fn: new Mul([new Name("CO2"), new Name("kc2")]),
      stoichiometry: [
        { name: "CO2", value: new Num(-1.0) },
        { name: "Ci", value: new Num(1.0) },
      ],
      texName: "vc2",
    })
    .addReaction("vo1", {
      fn: new Mul([new Name("Oi"), new Name("ko1")]),
      stoichiometry: [
        { name: "Oi", value: new Num(-1.0) },
        { name: "O2", value: new Num(1.0) },
      ],
      texName: "vo1",
    })
    .addReaction("vo2", {
      fn: new Mul([new Name("O2"), new Name("ko2")]),
      stoichiometry: [
        { name: "O2", value: new Num(-1.0) },
        { name: "Oi", value: new Num(1.0) },
      ],
      texName: "vo2",
    })
    .addReaction("vphic", {
      fn: new Mul([
        new Name("phic"),
        new Add([new Name("Ca"), new Minus([new Name("Ci")])]),
      ]),
      stoichiometry: [{ name: "Ci", value: new Num(1.0) }],
      texName: "vphic",
    })
    .addReaction("vphio", {
      fn: new Mul([
        new Name("phio"),
        new Add([new Name("Oa"), new Minus([new Name("Oi")])]),
      ]),
      stoichiometry: [{ name: "Oi", value: new Num(1.0) }],
      texName: "vphio",
    });
}
