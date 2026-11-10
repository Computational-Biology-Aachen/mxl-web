import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Eq,
  Max,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Lam 2026 model
 *
 * |             |                                                                                                    |
 * | ----------- | -------------------------------------------------------------------------------------------------- |
 * | doi         | 10.1038/s41467-026-70414-2                                                                         |
 * | main author | Lam Lam, Rebecca Lee                                                                               |
 * | paper title | Dissecting the contributions to non-photochemical quenching in a land plant under ﬂuctuating light |
 * | published   | 09 March 2026                                                                                      |
 * | journal     | Nature Communications                                                                              |
 * | organism    | Higher plants (Nicotiana benthamiana)                                                              |
 * | Ported by   | Quang Huy Nguyen ( @PhotosyntheticBatman )                                                         |
 *
 * The model provide a detailed, up-to-date descriptions regarding NPQ compoents
 * within higher plants, along with detailed dataset of fluorescence lifetime and
 * pigment qunatification from mutants that lacks one or more compoents of NPQ.
 * Combined with a rigorous fitting and optimization schedule for parameters, the
 * model brings up quantified contributions of different NPQ components and how it
 * changes overtime.
 *
 * Compoents: energy-depedent quenching (qE), zeaxanthin-depdent quenching (qZ)
 * and photoinhibition (qI)
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("k_L_VA", {
      value: 2.47,
      texName: "k\\_L\\_VA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_D_VA", {
      value: 0.014,
      texName: "k\\_D\\_VA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_AZ", {
      value: 0.5,
      texName: "k\\_L\\_AZ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_AV", {
      value: 1.12,
      texName: "k\\_AV",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_ZA", {
      value: 0.07,
      texName: "k\\_ZA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PV_f", {
      value: 2.18,
      texName: "k\\_PV\\_f",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PV_b", {
      value: 9.43,
      texName: "k\\_PV\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PA_f", {
      value: 130.0,
      texName: "k\\_PA\\_f",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PA_b", {
      value: 254.0,
      texName: "k\\_PA\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PZ_f", {
      value: 295.0,
      texName: "k\\_PZ\\_f",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PZ_b", {
      value: 126.0,
      texName: "k\\_PZ\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_QV_f", {
      value: 0.027,
      texName: "k\\_L\\_QV\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_D_QV_f", {
      value: 0.0,
      texName: "k\\_D\\_QV\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_QV_b", {
      value: 0.066,
      texName: "k\\_QV\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_QA_f", {
      value: 0.66,
      texName: "k\\_L\\_QA\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_D_QA_f", {
      value: 0.0,
      texName: "k\\_D\\_QA\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_QA_b", {
      value: 8.57,
      texName: "k\\_QA\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_QZ_f", {
      value: 0.56,
      texName: "k\\_L\\_QZ\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_D_QZ_f", {
      value: 0.0,
      texName: "k\\_D\\_QZ\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_QZ_b", {
      value: 1.22,
      texName: "k\\_QZ\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_QL_f", {
      value: 0.056,
      texName: "k\\_L\\_QL\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_QL_b", {
      value: 3.68,
      texName: "k\\_QL\\_b",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_D_QX_f", {
      value: 0.0,
      texName: "k\\_D\\_QX\\_f",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_damage", {
      value: 0.0222,
      texName: "k\\_L\\_damage",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -2 }] }),
    })
    .addParameter("k_D_damage", {
      value: 0.0161,
      texName: "k\\_D\\_damage",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -2 }] }),
    })
    .addParameter("k_D_VDE", {
      value: 0.24,
      texName: "k\\_D\\_VDE",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_L_VDE", {
      value: 0.28,
      texName: "k\\_L\\_VDE",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_AV_aba1", {
      value: 0.006,
      texName: "k\\_AV\\_aba1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_ZA_aba1", {
      value: 0.038,
      texName: "k\\_ZA\\_aba1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PV_f_lut2", {
      value: 1.43,
      texName: "k\\_PV\\_f\\_lut2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PV_b_lut2", {
      value: 13.1,
      texName: "k\\_PV\\_b\\_lut2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PA_f_lut2", {
      value: 34.4,
      texName: "k\\_PA\\_f\\_lut2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PA_b_lut2", {
      value: 294.0,
      texName: "k\\_PA\\_b\\_lut2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PZ_f_lut2", {
      value: 74.1,
      texName: "k\\_PZ\\_f\\_lut2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_PZ_b_lut2", {
      value: 168.0,
      texName: "k\\_PZ\\_b\\_lut2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("V_tot_npq1", {
      value: 49.8,
      texName: "V\\_tot\\_npq1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("V_tot_lut2", {
      value: 71.2,
      texName: "V\\_tot\\_lut2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("V_tot_npq4", {
      value: 40.6,
      texName: "V\\_tot\\_npq4",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("V_tot_aba1", {
      value: 10.7,
      texName: "V\\_tot\\_aba1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("V_tot_WT", {
      value: 35.9,
      texName: "V\\_tot\\_WT",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("P_tot", {
      value: 45.4,
      texName: "P\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("P_tot_lut2", {
      value: 49.9,
      texName: "P\\_tot\\_lut2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_QV", {
      value: 0.04,
      texName: "kappa\\_QV",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_QA", {
      value: 0.174,
      texName: "kappa\\_QA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_QZ", {
      value: 0.177,
      texName: "kappa\\_QZ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_QL", {
      value: 0.262,
      texName: "kappa\\_QL",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_qZ", {
      value: 0.03,
      texName: "kappa\\_qZ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kappa_qI", {
      value: 3.86,
      texName: "kappa\\_qI",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kappa_qI_double_mut", {
      value: 7.05,
      texName: "kappa\\_qI\\_double\\_mut",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ppfd", {
      value: 0.0,
      displayName: "PPFD",
      texName: "ppfd",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("tau_0", {
      value: 1.730890791,
      texName: "tau\\_0",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("PSII_tot", {
      value: 1.0,
      displayName: "PSII_total",
      texName: "PSII\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("V", {
      value: new Name("V_tot_WT"),
      texName: "V",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("A", {
      value: new Mul([new Name("Keq_a"), new Name("V_tot_WT")]),
      texName: "A",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Z", {
      value: new Mul([
        new Name("Keq_a"),
        new Name("Keq_z"),
        new Name("V_tot_WT"),
      ]),
      texName: "Z",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PV", {
      value: new Mul([
        new Name("Keq_pv"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "PV",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PA", {
      value: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pa"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "PA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PZ", {
      value: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pz"),
        new Name("Keq_z"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "PZ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("QV", {
      value: new Mul([
        new Name("Keq_pv"),
        new Name("Keq_qv"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QV",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("QA", {
      value: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pa"),
        new Name("Keq_qa"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("QZ", {
      value: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pz"),
        new Name("Keq_qz"),
        new Name("Keq_z"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QZ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("QL", {
      value: 0.0,
      texName: "QL",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PL", {
      value: 165.0,
      texName: "PL",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PSIId", {
      value: 0.0,
      texName: "PSIId",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("alpha_VDE", {
      value: new Divide([new Name("k_D_VA"), new Name("k_L_VA")]),
      texName: "alpha\\_VDE",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("gamma", {
      fn: new Divide([new Name("k_D_VA"), new Name("k_L_VA")]),
      texName: "gamma",
    })
    .addAssignment("k_D_AZ", {
      fn: new Mul([new Name("gamma"), new Name("k_L_AZ")]),
      texName: "k\\_D\\_AZ",
    })
    .addAssignment("Keq_pz", {
      fn: new Divide([new Name("k_PZ_f"), new Name("k_PZ_b")]),
      texName: "Keq\\_pz",
    })
    .addAssignment("Keq_pv", {
      fn: new Divide([new Name("k_PV_f"), new Name("k_PV_b")]),
      texName: "Keq\\_pv",
    })
    .addAssignment("Keq_pa", {
      fn: new Divide([new Name("k_PA_f"), new Name("k_PA_b")]),
      texName: "Keq\\_pa",
    })
    .addAssignment("Keq_a", {
      fn: new Divide([new Name("k_D_VA"), new Name("k_AV")]),
      texName: "Keq\\_a",
    })
    .addAssignment("Keq_z", {
      fn: new Divide([new Name("k_D_AZ"), new Name("k_ZA")]),
      texName: "Keq\\_z",
    })
    .addAssignment("Keq_qv", {
      fn: new Divide([new Name("k_D_QV_f"), new Name("k_QV_b")]),
      texName: "Keq\\_qv",
    })
    .addAssignment("Keq_qa", {
      fn: new Divide([new Name("k_D_QA_f"), new Name("k_QA_b")]),
      texName: "Keq\\_qa",
    })
    .addAssignment("Keq_qz", {
      fn: new Divide([new Name("k_D_QZ_f"), new Name("k_QZ_b")]),
      texName: "Keq\\_qz",
    })
    .addAssignment("P0", {
      fn: new Divide([
        new Name("P_tot"),
        new Add([
          new Num(1.0),
          new Mul([
            new Name("V_tot_WT"),
            new Add([
              new Name("Keq_pv"),
              new Mul([new Name("Keq_a"), new Name("Keq_pa")]),
              new Mul([new Name("Keq_pv"), new Name("Keq_qv")]),
              new Mul([
                new Name("Keq_a"),
                new Name("Keq_pa"),
                new Name("Keq_qa"),
              ]),
              new Mul([
                new Name("Keq_a"),
                new Name("Keq_pz"),
                new Name("Keq_z"),
              ]),
              new Mul([
                new Name("Keq_a"),
                new Name("Keq_pz"),
                new Name("Keq_qz"),
                new Name("Keq_z"),
              ]),
            ]),
          ]),
        ]),
      ]),
      texName: "P0",
    })
    .addAssignment("A_0", {
      fn: new Mul([new Name("Keq_a"), new Name("V_tot_WT")]),
      texName: "A\\_0",
    })
    .addAssignment("Z_0", {
      fn: new Mul([new Name("Keq_a"), new Name("Keq_z"), new Name("V_tot_WT")]),
      texName: "Z\\_0",
    })
    .addAssignment("PV_0", {
      fn: new Mul([new Name("Keq_pv"), new Name("P0"), new Name("V_tot_WT")]),
      texName: "PV\\_0",
    })
    .addAssignment("PA_0", {
      fn: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pa"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "PA\\_0",
    })
    .addAssignment("PZ_0", {
      fn: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pz"),
        new Name("Keq_z"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "PZ\\_0",
    })
    .addAssignment("QV_0", {
      fn: new Mul([
        new Name("Keq_pv"),
        new Name("Keq_qv"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QV\\_0",
    })
    .addAssignment("QA_0", {
      fn: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pa"),
        new Name("Keq_qa"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QA\\_0",
    })
    .addAssignment("QZ_0", {
      fn: new Mul([
        new Name("Keq_a"),
        new Name("Keq_pz"),
        new Name("Keq_qz"),
        new Name("Keq_z"),
        new Name("P0"),
        new Name("V_tot_WT"),
      ]),
      texName: "QZ\\_0",
    })
    .addAssignment("X_tot", {
      fn: new Add([
        new Name("A_0"),
        new Name("PA_0"),
        new Name("PV_0"),
        new Name("PZ_0"),
        new Name("QA_0"),
        new Name("QV_0"),
        new Name("QZ_0"),
        new Name("V_tot_WT"),
        new Name("Z_0"),
      ]),
      texName: "X\\_tot",
    })
    .addAssignment("kappa_r_nr", {
      fn: new Add([
        new Divide([new Num(1.0), new Name("tau_0")]),
        new Minus([new Mul([new Name("Z_0"), new Name("kappa_qZ")])]),
      ]),
      texName: "kappa\\_r\\_nr",
    })
    .addAssignment("PSII_active", {
      fn: new Add([new Name("PSII_tot"), new Minus([new Name("PSIId")])]),
      texName: "PSII\\_active",
    })
    .addAssignment("P_free", {
      fn: new Add([
        new Name("A"),
        new Name("P_tot"),
        new Name("V"),
        new Name("Z"),
        new Minus([new Name("X_tot")]),
      ]),
      texName: "P\\_free",
    })
    .addAssignment("tau_Fluo", {
      fn: new Divide([
        new Num(1.0),
        new Max([
          new Num(1e-10),
          new Add([
            new Name("kappa_r_nr"),
            new Mul([
              new Name("kappa_QA"),
              new Max([new Num(0.0), new Name("QA")]),
            ]),
            new Mul([
              new Name("kappa_QL"),
              new Max([new Num(0.0), new Name("QL")]),
            ]),
            new Mul([
              new Name("kappa_QV"),
              new Max([new Num(0.0), new Name("QV")]),
            ]),
            new Mul([
              new Name("kappa_QZ"),
              new Max([new Num(0.0), new Name("QZ")]),
            ]),
            new Mul([
              new Name("kappa_qI"),
              new Max([new Num(0.0), new Name("PSIId")]),
            ]),
            new Mul([
              new Name("kappa_qZ"),
              new Max([new Num(0.0), new Name("Z")]),
            ]),
          ]),
        ]),
      ]),
      texName: "tau\\_Fluo",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addReaction("VA", {
      fn: new Mul([new Name("V"), new Name("alpha_VDE"), new Name("k_L_VA")]),
      stoichiometry: [
        { name: "V", value: new Num(-1.0) },
        { name: "A", value: new Num(1.0) },
      ],
      texName: "VA",
    })
    .addReaction("AV", {
      fn: new Mul([new Name("A"), new Name("k_AV")]),
      stoichiometry: [
        { name: "A", value: new Num(-1.0) },
        { name: "V", value: new Num(1.0) },
      ],
      texName: "AV",
    })
    .addReaction("AZ", {
      fn: new Mul([new Name("A"), new Name("alpha_VDE"), new Name("k_L_AZ")]),
      stoichiometry: [
        { name: "A", value: new Num(-1.0) },
        { name: "Z", value: new Num(1.0) },
      ],
      texName: "AZ",
    })
    .addReaction("ZA", {
      fn: new Mul([new Name("Z"), new Name("k_ZA")]),
      stoichiometry: [
        { name: "Z", value: new Num(-1.0) },
        { name: "A", value: new Num(1.0) },
      ],
      texName: "ZA",
    })
    .addReaction("PVf", {
      fn: new Mul([new Name("P_free"), new Name("V"), new Name("k_PV_f")]),
      stoichiometry: [
        { name: "PV", value: new Num(1.0) },
        { name: "V", value: new Num(-1.0) },
      ],
      texName: "PVf",
    })
    .addReaction("PVb", {
      fn: new Mul([new Name("PV"), new Name("k_PV_b")]),
      stoichiometry: [
        { name: "PV", value: new Num(-1.0) },
        { name: "V", value: new Num(1.0) },
      ],
      texName: "PVb",
    })
    .addReaction("PAf", {
      fn: new Mul([new Name("A"), new Name("P_free"), new Name("k_PA_f")]),
      stoichiometry: [
        { name: "A", value: new Num(-1.0) },
        { name: "PA", value: new Num(1.0) },
      ],
      texName: "PAf",
    })
    .addReaction("PAb", {
      fn: new Mul([new Name("PA"), new Name("k_PA_b")]),
      stoichiometry: [
        { name: "PA", value: new Num(-1.0) },
        { name: "A", value: new Num(1.0) },
      ],
      texName: "PAb",
    })
    .addReaction("PZf", {
      fn: new Mul([new Name("P_free"), new Name("Z"), new Name("k_PZ_f")]),
      stoichiometry: [
        { name: "Z", value: new Num(-1.0) },
        { name: "PZ", value: new Num(1.0) },
      ],
      texName: "PZf",
    })
    .addReaction("PZb", {
      fn: new Mul([new Name("PZ"), new Name("k_PZ_b")]),
      stoichiometry: [
        { name: "PZ", value: new Num(-1.0) },
        { name: "Z", value: new Num(1.0) },
      ],
      texName: "PZb",
    })
    .addReaction("QVf", {
      fn: new Piecewise([
        new Mul([new Name("PV"), new Name("k_D_QX_f")]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Mul([new Name("PV"), new Name("k_L_QV_f")]),
      ]),
      stoichiometry: [
        { name: "PV", value: new Num(-1.0) },
        { name: "QV", value: new Num(1.0) },
      ],
      texName: "QVf",
    })
    .addReaction("QVb", {
      fn: new Mul([new Name("QV"), new Name("k_QV_b")]),
      stoichiometry: [
        { name: "QV", value: new Num(-1.0) },
        { name: "PV", value: new Num(1.0) },
      ],
      texName: "QVb",
    })
    .addReaction("QAf", {
      fn: new Piecewise([
        new Mul([new Name("PA"), new Name("k_D_QX_f")]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Mul([new Name("PA"), new Name("k_L_QA_f")]),
      ]),
      stoichiometry: [
        { name: "PA", value: new Num(-1.0) },
        { name: "QA", value: new Num(1.0) },
      ],
      texName: "QAf",
    })
    .addReaction("QAb", {
      fn: new Mul([new Name("QA"), new Name("k_QA_b")]),
      stoichiometry: [
        { name: "QA", value: new Num(-1.0) },
        { name: "PA", value: new Num(1.0) },
      ],
      texName: "QAb",
    })
    .addReaction("QZf", {
      fn: new Piecewise([
        new Mul([new Name("PZ"), new Name("k_D_QX_f")]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Mul([new Name("PZ"), new Name("k_L_QZ_f")]),
      ]),
      stoichiometry: [
        { name: "PZ", value: new Num(-1.0) },
        { name: "QZ", value: new Num(1.0) },
      ],
      texName: "QZf",
    })
    .addReaction("QZb", {
      fn: new Mul([new Name("QZ"), new Name("k_QA_b")]),
      stoichiometry: [
        { name: "QZ", value: new Num(-1.0) },
        { name: "PZ", value: new Num(1.0) },
      ],
      texName: "QZb",
    })
    .addReaction("QLf", {
      fn: new Piecewise([
        new Mul([new Name("PL"), new Name("k_D_QX_f")]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Mul([new Name("PL"), new Name("k_L_QL_f")]),
      ]),
      stoichiometry: [
        { name: "PL", value: new Num(-1.0) },
        { name: "QL", value: new Num(1.0) },
      ],
      texName: "QLf",
    })
    .addReaction("QLb", {
      fn: new Mul([new Name("QL"), new Name("k_QL_b")]),
      stoichiometry: [
        { name: "QL", value: new Num(-1.0) },
        { name: "PL", value: new Num(1.0) },
      ],
      texName: "QLb",
    })
    .addReaction("damage", {
      fn: new Piecewise([
        new Max([
          new Num(0.0),
          new Mul([
            new Name("k_D_damage"),
            new Add([new Num(1.0), new Minus([new Name("PSIId")])]),
            new Max([new Num(0.0), new Name("tau_Fluo")]),
          ]),
        ]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Max([
          new Num(0.0),
          new Mul([
            new Name("k_L_damage"),
            new Add([new Num(1.0), new Minus([new Name("PSIId")])]),
            new Max([new Num(0.0), new Name("tau_Fluo")]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "PSIId", value: new Num(1.0) }],
      texName: "damage",
    })
    .addReaction("v_alpha_VDE", {
      fn: new Piecewise([
        new Mul([
          new Name("k_D_VDE"),
          new Add([
            new Minus([new Name("alpha_VDE")]),
            new Divide([new Name("k_D_VA"), new Name("k_L_VA")]),
          ]),
        ]),
        new Eq([new Name("ppfd"), new Num(0.0)]),
        new Mul([
          new Name("k_L_VDE"),
          new Add([new Num(1.0), new Minus([new Name("alpha_VDE")])]),
        ]),
      ]),
      stoichiometry: [{ name: "alpha_VDE", value: new Num(1.0) }],
      texName: "v\\_alpha\\_VDE",
    })
    .addReadout("NPQ_V", {
      fn: new Mul([new Name("QV"), new Name("kappa_QV")]),
      texName: "NPQ\\_V",
    })
    .addReadout("NPQ_A", {
      fn: new Mul([new Name("QA"), new Name("kappa_QA")]),
      texName: "NPQ\\_A",
    })
    .addReadout("NPQ_Z_qE", {
      fn: new Mul([new Name("QZ"), new Name("kappa_QZ")]),
      texName: "NPQ\\_Z\\_qE",
    })
    .addReadout("NPQ_L", {
      fn: new Mul([new Name("QL"), new Name("kappa_QL")]),
      texName: "NPQ\\_L",
    })
    .addReadout("NPQ_Z_qZ", {
      fn: new Mul([new Name("Z"), new Name("kappa_qZ")]),
      texName: "NPQ\\_Z\\_qZ",
    })
    .addReadout("NPQ_qI", {
      fn: new Mul([new Name("PSIId"), new Name("kappa_qI")]),
      texName: "NPQ\\_qI",
    });
}
