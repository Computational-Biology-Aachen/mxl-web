import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Simple Calvin Cycle model from Zhu et al. (2009).
 *
 * |             |                                                                                                                          |
 * | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
 * | doi         | 10.1016/j.nonrwa.2008.01.021                                                                                             |
 * | main author | Xin-Guang Zhu                                                                                                            |
 * | paper title | A simple model of the Calvin cycle has only one physiologically feasible steady state under the same external conditions |
 * | published   | June 2009                                                                                                                |
 * | journal     | Nonlinear Analysis: Real World Applications                                                                              |
 * | organism    | C3 plant (Calvin cycle)                                                                                                  |
 * | Ported by   | ElouenCorvest ( @ElouenCorvest )                                                                                         |
 *
 * Note: dynamics do not yet perfectly reproduce the published figures.
 *
 * The [Zhu 2009](https://doi.org/10.1016/j.nonrwa.2008.01.021) model is a
 * deliberately simplified kinetic model of the Calvin-Benson-Bassham (CBB) cycle,
 * the carbon-fixing dark reactions of photosynthesis. It tracks only five
 * metabolites - ribulose-1,5-bisphosphate (RuBP), 3-phosphoglycerate (PGA),
 * 1,3-bisphosphoglycerate (DPGA), glyceraldehyde-3-phosphate (GAP), and
 * ribulose-5-phosphate (Ru5P) - and lumps the many intermediate steps of the
 * cycle into a handful of Michaelis-Menten reactions, with ATP supplied as a
 * fixed external parameter rather than a dynamic variable. This reduction keeps
 * the system small enough to be analysed mathematically while still capturing the
 * essential autocatalytic structure of carbon fixation, where RuBP is both
 * consumed by RuBisCO and regenerated downstream.
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("V1_max", {
      value: 3.78,
      texName: "V1\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "1.9",
        max: "7.6",
        step: "0.1",
      },
    })
    .addParameter("V2_max", {
      value: 11.75,
      texName: "V2\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "5.9",
        max: "23.5",
        step: "0.1",
      },
    })
    .addParameter("V3_max", {
      value: 5.04,
      texName: "V3\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "2.5",
        max: "10.1",
        step: "0.1",
      },
    })
    .addParameter("V4_max", {
      value: 3.05,
      texName: "V4\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "1.5",
        max: "6.1",
        step: "0.1",
      },
    })
    .addParameter("V5_max", {
      value: 3.0,
      texName: "V5\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "1.5",
        max: "6",
        step: "0.1",
      },
    })
    .addParameter("V6_max", {
      value: 0.1,
      texName: "V6\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "0.1",
        max: "0.2",
        step: "0.1",
      },
    })
    .addParameter("V13_max", {
      value: 8.0,
      texName: "V13\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "4.0",
        max: "16",
        step: "0.1",
      },
    })
    .addParameter("K_m1", {
      value: 1.0,
      texName: "K\\_m1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m21", {
      value: 0.24,
      texName: "K\\_m21",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m22", {
      value: 0.39,
      texName: "K\\_m22",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m3", {
      value: 0.5,
      texName: "K\\_m3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m4", {
      value: 0.84,
      texName: "K\\_m4",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m51", {
      value: 0.75,
      texName: "K\\_m51",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m52", {
      value: 0.275,
      texName: "K\\_m52",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m6", {
      value: 5.0,
      texName: "K\\_m6",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m131", {
      value: 0.15,
      texName: "K\\_m131",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K_m132", {
      value: 0.059,
      texName: "K\\_m132",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ATP", {
      value: 0.2,
      texName: "ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
      slider: {
        min: "0.1",
        max: "0.4",
        step: "0.1",
      },
    })
    .addVariable("RuBP", {
      value: 2.0,
      displayName: "RUBP",
      texName: "RuBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("PGA", {
      value: 2.4,
      texName: "PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("DPGA", {
      value: 1.0,
      displayName: "BPGA",
      texName: "DPGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ru5P", {
      value: 1.0,
      displayName: "RU5P",
      texName: "Ru5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("GAP", {
      value: 1.0,
      texName: "GAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addAssignment("A", {
      fn: new Mul([new Num(33.33), new Name("v1")]),
      texName: "A",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addReaction("v1", {
      fn: new Divide([
        new Mul([new Name("RuBP"), new Name("V1_max")]),
        new Add([new Name("K_m1"), new Name("RuBP")]),
      ]),
      stoichiometry: [
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGA", value: new Num(2.0) },
      ],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("PGA"), new Name("V2_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m22")]),
          new Add([new Name("K_m21"), new Name("PGA")]),
        ]),
      ]),
      stoichiometry: [
        { name: "PGA", value: new Num(-1.0) },
        { name: "DPGA", value: new Num(1.0) },
      ],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Divide([
        new Mul([new Name("DPGA"), new Name("V3_max")]),
        new Add([new Name("DPGA"), new Name("K_m3")]),
      ]),
      stoichiometry: [
        { name: "DPGA", value: new Num(-1.0) },
        { name: "GAP", value: new Num(1.0) },
      ],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("V4_max")]),
        new Add([new Name("GAP"), new Name("K_m4")]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "Ru5P", value: new Num(0.6) },
      ],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("PGA"), new Name("V5_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m52")]),
          new Add([new Name("K_m51"), new Name("PGA")]),
        ]),
      ]),
      stoichiometry: [{ name: "PGA", value: new Num(-1.0) }],
      texName: "v5",
    })
    .addReaction("v6", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("V6_max")]),
        new Add([new Name("GAP"), new Name("K_m6")]),
      ]),
      stoichiometry: [{ name: "GAP", value: new Num(-1.0) }],
      texName: "v6",
    })
    .addReaction("v13", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("Ru5P"), new Name("V13_max")]),
        new Mul([
          new Add([new Name("ATP"), new Name("K_m132")]),
          new Add([new Name("K_m131"), new Name("Ru5P")]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ru5P", value: new Num(-1.0) },
        { name: "RuBP", value: new Num(1.0) },
      ],
      texName: "v13",
    });
}
