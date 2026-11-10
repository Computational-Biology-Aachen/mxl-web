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
 * Yokota 1985 photorespiratory carbon oxidation cycle model.
 *
 * |             |                                                                                                                   |
 * | ----------- | ----------------------------------------------------------------------------------------------------------------- |
 * | doi         | 10.1007/BF00392212                                                                                                |
 * | main author | Akiho Yokota                                                                                                      |
 * | paper title | Reactivity of glyoxylate with hydrogen perioxide and simulation of the glycolate pathway of C3 plants and Euglena |
 * | published   | 1985                                                                                                              |
 * | journal     | Planta                                                                                                            |
 * | organism    | Euglena gracilis                                                                                                  |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                                              |
 *
 * Units:
 *
 * - Vmax: umol mg^-1 Chl h^-1
 * - Km: mM
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("kf_phosphoglycolate_phosphatase", {
      value: 60.0,
      texName: "kf\\_phosphoglycolate\\_phosphatase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "0.1",
        max: "2.0",
        step: "0.1",
      },
    })
    .addParameter("E0_glycolate_oxidase", {
      value: 1.0,
      texName: "E0\\_glycolate\\_oxidase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_glycolate_oxidase", {
      value: 100.0,
      texName: "kcat\\_glycolate\\_oxidase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_glycolate_oxidase_s", {
      value: 0.06,
      texName: "km\\_glycolate\\_oxidase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_glycine_transaminase", {
      value: 1.0,
      texName: "E0\\_glycine\\_transaminase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_glycine_transaminase", {
      value: 143.0,
      texName: "kcat\\_glycine\\_transaminase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_glycine_transaminase_s", {
      value: 3.0,
      texName: "km\\_glycine\\_transaminase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_glycine_decarboxylase", {
      value: 0.5,
      texName: "E0\\_glycine\\_decarboxylase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_glycine_decarboxylase", {
      value: 100.0,
      texName: "kcat\\_glycine\\_decarboxylase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_glycine_decarboxylase_s", {
      value: 6.0,
      texName: "km\\_glycine\\_decarboxylase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_serine_glyoxylate_transaminase", {
      value: 1.0,
      texName: "E0\\_serine\\_glyoxylate\\_transaminase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_serine_glyoxylate_transaminase", {
      value: 159.0,
      texName: "kcat\\_serine\\_glyoxylate\\_transaminase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_serine_glyoxylate_transaminase_glyoxylate", {
      value: 0.15,
      texName: "km\\_serine\\_glyoxylate\\_transaminase\\_glyoxylate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_serine_glyoxylate_transaminase_serine", {
      value: 2.72,
      texName: "km\\_serine\\_glyoxylate\\_transaminase\\_serine",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_glycerate_dehydrogenase", {
      value: 1.0,
      texName: "E0\\_glycerate\\_dehydrogenase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_glycerate_dehydrogenase", {
      value: 398.0,
      texName: "kcat\\_glycerate\\_dehydrogenase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_glycerate_dehydrogenase_s", {
      value: 0.12,
      texName: "km\\_glycerate\\_dehydrogenase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_catalase", {
      value: 1.0,
      texName: "E0\\_catalase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_catalase", {
      value: 760500.0,
      texName: "kcat\\_catalase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_catalase_s", {
      value: 137.9,
      texName: "km\\_catalase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("glycolate", {
      value: 0.09,
      texName: "glycolate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("glyoxylate", {
      value: 0.7964601770483386,
      texName: "glyoxylate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("glycine", {
      value: 8.999999999424611,
      texName: "glycine",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("serine", {
      value: 2.5385608670239126,
      texName: "serine",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("hydroxypyruvate", {
      value: 0.009782608695111009,
      texName: "hydroxypyruvate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("H2O2", {
      value: 0.010880542843616855,
      texName: "H2O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addAssignment("vmax_glycolate_oxidase", {
      fn: new Mul([
        new Name("E0_glycolate_oxidase"),
        new Name("kcat_glycolate_oxidase"),
      ]),
      texName: "vmax\\_glycolate\\_oxidase",
    })
    .addAssignment("vmax_glycine_transaminase", {
      fn: new Mul([
        new Name("E0_glycine_transaminase"),
        new Name("kcat_glycine_transaminase"),
      ]),
      texName: "vmax\\_glycine\\_transaminase",
    })
    .addAssignment("vmax_glycine_decarboxylase", {
      fn: new Mul([
        new Name("E0_glycine_decarboxylase"),
        new Name("kcat_glycine_decarboxylase"),
      ]),
      texName: "vmax\\_glycine\\_decarboxylase",
    })
    .addAssignment("vmax_serine_glyoxylate_transaminase", {
      fn: new Mul([
        new Name("E0_serine_glyoxylate_transaminase"),
        new Name("kcat_serine_glyoxylate_transaminase"),
      ]),
      texName: "vmax\\_serine\\_glyoxylate\\_transaminase",
    })
    .addAssignment("vmax_glycerate_dehydrogenase", {
      fn: new Mul([
        new Name("E0_glycerate_dehydrogenase"),
        new Name("kcat_glycerate_dehydrogenase"),
      ]),
      texName: "vmax\\_glycerate\\_dehydrogenase",
    })
    .addAssignment("vmax_catalase", {
      fn: new Mul([new Name("E0_catalase"), new Name("kcat_catalase")]),
      texName: "vmax\\_catalase",
    })
    .addReaction("phosphoglycolate_phosphatase", {
      fn: new Name("kf_phosphoglycolate_phosphatase"),
      stoichiometry: [{ name: "glycolate", value: new Num(1.0) }],
      texName: "phosphoglycolate\\_phosphatase",
    })
    .addReaction("glycolate_oxidase", {
      fn: new Divide([
        new Mul([new Name("glycolate"), new Name("vmax_glycolate_oxidase")]),
        new Add([new Name("glycolate"), new Name("km_glycolate_oxidase_s")]),
      ]),
      stoichiometry: [
        { name: "glycolate", value: new Num(-1.0) },
        { name: "glyoxylate", value: new Num(1.0) },
        { name: "H2O2", value: new Num(1.0) },
      ],
      texName: "glycolate\\_oxidase",
    })
    .addReaction("glycine_transaminase", {
      fn: new Divide([
        new Mul([
          new Name("glyoxylate"),
          new Name("vmax_glycine_transaminase"),
        ]),
        new Add([
          new Name("glyoxylate"),
          new Name("km_glycine_transaminase_s"),
        ]),
      ]),
      stoichiometry: [
        { name: "glyoxylate", value: new Num(-1.0) },
        { name: "glycine", value: new Num(1.0) },
      ],
      texName: "glycine\\_transaminase",
    })
    .addReaction("glycine_decarboxylase", {
      fn: new Divide([
        new Mul([new Name("glycine"), new Name("vmax_glycine_decarboxylase")]),
        new Add([new Name("glycine"), new Name("km_glycine_decarboxylase_s")]),
      ]),
      stoichiometry: [
        { name: "glycine", value: new Num(-2.0) },
        { name: "serine", value: new Num(1.0) },
      ],
      displayName: "glycine decarboxylase",
      texName: "glycine\\_decarboxylase",
    })
    .addReaction("serine_glyoxylate_transaminase", {
      fn: new Divide([
        new Mul([
          new Name("glyoxylate"),
          new Name("serine"),
          new Name("vmax_serine_glyoxylate_transaminase"),
        ]),
        new Add([
          new Mul([new Name("glyoxylate"), new Name("serine")]),
          new Divide([
            new Name("glyoxylate"),
            new Name("km_serine_glyoxylate_transaminase_glyoxylate"),
          ]),
          new Divide([
            new Name("serine"),
            new Name("km_serine_glyoxylate_transaminase_serine"),
          ]),
          new Divide([
            new Num(1.0),
            new Mul([
              new Name("km_serine_glyoxylate_transaminase_glyoxylate"),
              new Name("km_serine_glyoxylate_transaminase_serine"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "glyoxylate", value: new Num(-1.0) },
        { name: "serine", value: new Num(-1.0) },
        { name: "glycine", value: new Num(1.0) },
        { name: "hydroxypyruvate", value: new Num(1.0) },
      ],
      texName: "serine\\_glyoxylate\\_transaminase",
    })
    .addReaction("glycerate_dehydrogenase", {
      fn: new Divide([
        new Mul([
          new Name("hydroxypyruvate"),
          new Name("vmax_glycerate_dehydrogenase"),
        ]),
        new Add([
          new Name("hydroxypyruvate"),
          new Name("km_glycerate_dehydrogenase_s"),
        ]),
      ]),
      stoichiometry: [{ name: "hydroxypyruvate", value: new Num(-1.0) }],
      texName: "glycerate\\_dehydrogenase",
    })
    .addReaction("catalase", {
      fn: new Divide([
        new Mul([new Name("H2O2"), new Name("vmax_catalase")]),
        new Add([new Name("H2O2"), new Name("km_catalase_s")]),
      ]),
      stoichiometry: [{ name: "H2O2", value: new Num(-1.0) }],
      texName: "catalase",
    });
}
