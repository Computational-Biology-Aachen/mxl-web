import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  Ln,
  Max,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Saadat 2021 chloroplast model.
 *
 * With ROS scavenging, Calvin cycle, and thioredoxin regulation.
 *
 * |             |                                                                                                  |
 * | ----------- | ------------------------------------------------------------------------------------------------ |
 * | doi         | 10.3389/fpls.2021.750580                                                                         |
 * | main author | Nima P. Saadat                                                                                   |
 * | paper title | Computational Analysis of Alternative Photosynthetic Electron Flows Linked With Oxidative Stress |
 * | published   | October 2021                                                                                     |
 * | journal     | Frontiers in Plant Science                                                                       |
 * | organism    | higher plants                                                                                    |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                             |
 *
 * Linear electron flow runs from plastocyanin (PC) through P700, the iron-sulfur
 * cluster (FA) and ferredoxin (Fd) to NADPH, driven by PPFD and governed by the
 * Nernst equilibrium potentials of the carriers. Includes the Mehler reaction (O2
 * reduction at PSI).
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("PPFD", {
      value: 100.0,
      texName: "PPFD",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
      slider: {
        min: "100",
        max: "2000",
        step: "10",
      },
    })
    .addParameter("CO2_dissolved", {
      value: 0.2,
      displayName: "CO2",
      texName: "CO2 (dissolved)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("O2_dissolved_lumen", {
      value: 8.0,
      displayName: "O2 (dissolved)_lumen",
      texName: "O2 (dissolved)\\_lumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("pH", {
      value: 7.9,
      texName: "pH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("protons", {
      value: 1.2589254117941661e-5,
      texName: "protons",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("bH", {
      value: 100.0,
      texName: "bH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("F", {
      value: 96.485,
      texName: "F",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("E_0_PC", {
      value: 0.38,
      displayName: "E0_PC",
      texName: "E^0\\_PC",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_P700", {
      value: 0.48,
      displayName: "E0_P700",
      texName: "E^0\\_P700",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_FA", {
      value: -0.55,
      displayName: "E0_FA",
      texName: "E^0\\_FA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_Fd", {
      value: -0.43,
      displayName: "E0_Fd",
      texName: "E^0\\_Fd",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_NADP", {
      value: -0.113,
      displayName: "E0_NADP",
      texName: "E^0\\_NADP",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("convf", {
      value: 0.032,
      texName: "convf",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("R", {
      value: 0.0083,
      texName: "R",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "kelvin", exponent: -1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("T", {
      value: 298.0,
      texName: "T",
      unit: Unit.fromJson({ factors: [{ kind: "kelvin", exponent: 1 }] }),
    })
    .addParameter("Carotenoids_tot", {
      value: 1.0,
      texName: "Carotenoids\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Fd_star", {
      value: 5.0,
      displayName: "Fd_tot",
      texName: "Fd*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PC_tot", {
      value: 4.0,
      texName: "PC\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PSBS_tot", {
      value: 1.0,
      displayName: "PsbS_tot",
      texName: "PSBS\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("LHC_tot", {
      value: 1.0,
      texName: "LHC\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma0", {
      value: 0.1,
      texName: "gamma0",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma1", {
      value: 0.25,
      texName: "gamma1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma2", {
      value: 0.6,
      texName: "gamma2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma3", {
      value: 0.15,
      texName: "gamma3",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kZSat", {
      value: 0.12,
      displayName: "K_ZSat",
      texName: "kZSat",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("E_0_QA", {
      value: -0.14,
      displayName: "E0_QA",
      texName: "E^0\\_QA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_PQ", {
      value: 0.354,
      displayName: "E0_PQ",
      texName: "E^0\\_PQ",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("PQ_tot", {
      value: 17.5,
      texName: "PQ\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("staticAntII", {
      value: 0.1,
      texName: "staticAntII",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("staticAntI", {
      value: 0.37,
      texName: "staticAntI",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Thioredoxin_tot", {
      value: 1.0,
      texName: "Thioredoxin\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("E_total", {
      value: 6.0,
      texName: "E\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("NADP_star", {
      value: 0.8,
      displayName: "NADP_tot",
      texName: "NADP*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("A_star_P", {
      value: 2.55,
      displayName: "AP_tot",
      texName: "A*P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Pi_tot", {
      value: 17.05,
      texName: "Pi\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_ferredoxin_thioredoxin_reductase", {
      value: 1.0,
      texName: "kf\\_ferredoxin\\_thioredoxin\\_reductase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_tr_activation", {
      value: 1.0,
      texName: "kf\\_tr\\_activation",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_tr_inactivation", {
      value: 0.1,
      texName: "kf\\_tr\\_inactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ASC_tot_star", {
      value: 10.0,
      displayName: "ASC_tot*",
      texName: "ASC\\_tot*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Glutathion_tot", {
      value: 10.0,
      texName: "Glutathion\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_atp_synthase", {
      value: 20.0,
      texName: "kf\\_atp\\_synthase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("HPR", {
      value: 4.666666666666667,
      texName: "HPR",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Pi_mol", {
      value: 0.01,
      texName: "Pi\\_mol",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("DeltaG0_ATP", {
      value: 30.6,
      texName: "DeltaG0\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_b6f", {
      value: 2.5,
      texName: "kcat\\_b6f",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kh_lhc_protonation", {
      value: 3.0,
      texName: "kh\\_lhc\\_protonation",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kf_lhc_protonation", {
      value: 0.0096,
      texName: "kf\\_lhc\\_protonation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ksat_lhc_protonation", {
      value: 5.8,
      texName: "ksat\\_lhc\\_protonation",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kf_lhc_deprotonation", {
      value: 0.0096,
      texName: "kf\\_lhc\\_deprotonation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_cyclic_electron_flow", {
      value: 1.0,
      texName: "kf\\_cyclic\\_electron\\_flow",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_violaxanthin_deepoxidase", {
      value: 0.0024,
      texName: "kf\\_violaxanthin\\_deepoxidase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kh_violaxanthin_deepoxidase", {
      value: 5.0,
      texName: "kh\\_violaxanthin\\_deepoxidase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("ksat_violaxanthin_deepoxidase", {
      value: 5.8,
      texName: "ksat\\_violaxanthin\\_deepoxidase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kf_zeaxanthin_epoxidase", {
      value: 0.00024,
      texName: "kf\\_zeaxanthin\\_epoxidase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_fnr_Ferredoxine_reduced", {
      value: 1.56,
      displayName: "km_fnr_Ferredoxine (reduced)",
      texName: "km\\_fnr\\_Ferredoxine (reduced)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_fnr_NADP", {
      value: 0.22,
      texName: "km\\_fnr\\_NADP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_fnr", {
      value: 3.0,
      texName: "E0\\_fnr",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_fnr", {
      value: 500.0,
      texName: "kcat\\_fnr",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_ndh", {
      value: 0.002,
      texName: "kf\\_ndh",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PSII_total", {
      value: 2.5,
      texName: "PSII\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PSI_total", {
      value: 2.5,
      texName: "PSI\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kH0", {
      value: 500000000.0,
      texName: "kH0",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kPQred", {
      value: 250.0,
      texName: "kPQred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kPCox", {
      value: 2500.0,
      texName: "kPCox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kFdred", {
      value: 250000.0,
      texName: "kFdred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k2", {
      value: 5000000000.0,
      texName: "k2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kH", {
      value: 5000000000.0,
      texName: "kH",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kF", {
      value: 625000000.0,
      texName: "kF",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kMehler", {
      value: 1.0,
      texName: "kMehler",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_ferredoxin_reductase", {
      value: 1.0,
      texName: "E0\\_ferredoxin\\_reductase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kcat_ferredoxin_reductase", {
      value: 250000.0,
      texName: "kcat\\_ferredoxin\\_reductase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_proton_leak", {
      value: 10.0,
      texName: "kf\\_proton\\_leak",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kPTOX", {
      value: 0.01,
      texName: "kPTOX",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kStt7", {
      value: 0.0035,
      texName: "kStt7",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_lhc_state_transition_12", {
      value: 0.2,
      texName: "km\\_lhc\\_state\\_transition\\_12",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_ST", {
      value: 2.0,
      texName: "n\\_ST",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kPph1", {
      value: 0.0013,
      texName: "kPph1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("E0_rubisco", {
      value: 1.0,
      texName: "E0\\_rubisco",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
      slider: {
        min: "0.1",
        max: "2.0",
        step: "0.1",
      },
    })
    .addParameter("kcat_rubisco_carboxylase", {
      value: 2.72,
      texName: "kcat\\_rubisco\\_carboxylase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_rubisco_carboxylase_RUBP", {
      value: 0.02,
      texName: "km\\_rubisco\\_carboxylase\\_RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_rubisco_carboxylase_CO2_dissolved", {
      value: 0.0107,
      displayName: "km_rubisco_carboxylase_CO2",
      texName: "km\\_rubisco\\_carboxylase\\_CO2 (dissolved)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_rubisco_carboxylase_3PGA", {
      value: 0.04,
      texName: "ki\\_rubisco\\_carboxylase\\_3PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_rubisco_carboxylase_FBP", {
      value: 0.04,
      texName: "ki\\_rubisco\\_carboxylase\\_FBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_rubisco_carboxylase_SBP", {
      value: 0.075,
      texName: "ki\\_rubisco\\_carboxylase\\_SBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_rubisco_carboxylase_Orthophosphate", {
      value: 0.9,
      displayName: "ki_rubisco_carboxylase_Pi",
      texName: "ki\\_rubisco\\_carboxylase\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_rubisco_carboxylase_NADPH", {
      value: 0.07,
      texName: "ki\\_rubisco\\_carboxylase\\_NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kre_phosphoglycerate_kinase", {
      value: 800000000.0,
      texName: "kre\\_phosphoglycerate\\_kinase",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_phosphoglycerate_kinase", {
      value: 0.00031,
      texName: "keq\\_phosphoglycerate\\_kinase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_gadph", {
      value: 800000000.0,
      texName: "kre\\_gadph",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_gadph", {
      value: 16000000.0,
      texName: "keq\\_gadph",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_triose_phosphate_isomerase", {
      value: 800000000.0,
      texName: "kre\\_triose\\_phosphate\\_isomerase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("keq_triose_phosphate_isomerase", {
      value: 22.0,
      texName: "keq\\_triose\\_phosphate\\_isomerase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_aldolase_dhap_gap", {
      value: 800000000.0,
      texName: "kre\\_aldolase\\_dhap\\_gap",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_aldolase_dhap_gap", {
      value: 7.1,
      texName: "keq\\_aldolase\\_dhap\\_gap",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("kre_aldolase_dhap_e4p", {
      value: 800000000.0,
      texName: "kre\\_aldolase\\_dhap\\_e4p",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_aldolase_dhap_e4p", {
      value: 13.0,
      texName: "keq\\_aldolase\\_dhap\\_e4p",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_fbpase", {
      value: 1.0,
      texName: "E0\\_fbpase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_fbpase", {
      value: 1.6,
      texName: "kcat\\_fbpase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_fbpase_s", {
      value: 0.03,
      texName: "km\\_fbpase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_fbpase_F6P", {
      value: 0.7,
      texName: "ki\\_fbpase\\_F6P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_fbpase_Orthophosphate", {
      value: 12.0,
      displayName: "ki_fbpase_Pi",
      texName: "ki\\_fbpase\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kre_transketolase_gap_f6p", {
      value: 800000000.0,
      texName: "kre\\_transketolase\\_gap\\_f6p",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_transketolase_gap_f6p", {
      value: 0.084,
      texName: "keq\\_transketolase\\_gap\\_f6p",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_transketolase_gap_s7p", {
      value: 800000000.0,
      texName: "kre\\_transketolase\\_gap\\_s7p",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_transketolase_gap_s7p", {
      value: 0.85,
      texName: "keq\\_transketolase\\_gap\\_s7p",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("E0_SBPase", {
      value: 1.0,
      texName: "E0\\_SBPase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_SBPase", {
      value: 0.32,
      texName: "kcat\\_SBPase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_SBPase_s", {
      value: 0.013,
      texName: "km\\_SBPase\\_s",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_SBPase_Orthophosphate", {
      value: 12.0,
      displayName: "ki_SBPase_Pi",
      texName: "ki\\_SBPase\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kre_ribose_phosphate_isomerase", {
      value: 800000000.0,
      texName: "kre\\_ribose\\_phosphate\\_isomerase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("keq_ribose_phosphate_isomerase", {
      value: 0.4,
      texName: "keq\\_ribose\\_phosphate\\_isomerase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_ribulose_phosphate_epimerase", {
      value: 800000000.0,
      texName: "kre\\_ribulose\\_phosphate\\_epimerase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("keq_ribulose_phosphate_epimerase", {
      value: 0.67,
      texName: "keq\\_ribulose\\_phosphate\\_epimerase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("E0_phosphoribulokinase", {
      value: 1.0,
      texName: "E0\\_phosphoribulokinase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_phosphoribulokinase", {
      value: 7.9992,
      texName: "kcat\\_phosphoribulokinase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_phosphoribulokinase_RU5P", {
      value: 0.05,
      texName: "km\\_phosphoribulokinase\\_RU5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_phosphoribulokinase_ATP", {
      value: 0.05,
      texName: "km\\_phosphoribulokinase\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_phosphoribulokinase_3PGA", {
      value: 2.0,
      texName: "ki\\_phosphoribulokinase\\_3PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_phosphoribulokinase_RUBP", {
      value: 0.7,
      texName: "ki\\_phosphoribulokinase\\_RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_phosphoribulokinase_Orthophosphate", {
      value: 4.0,
      displayName: "ki_phosphoribulokinase_Pi",
      texName: "ki\\_phosphoribulokinase\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_phosphoribulokinase_4", {
      value: 2.5,
      texName: "ki\\_phosphoribulokinase\\_4",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_phosphoribulokinase_5", {
      value: 0.4,
      texName: "ki\\_phosphoribulokinase\\_5",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kre_g6pi", {
      value: 800000000.0,
      texName: "kre\\_g6pi",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("keq_g6pi", {
      value: 2.3,
      texName: "keq\\_g6pi",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kre_phosphoglucomutase", {
      value: 800000000.0,
      texName: "kre\\_phosphoglucomutase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("keq_phosphoglucomutase", {
      value: 0.058,
      texName: "keq\\_phosphoglucomutase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Orthophosphate_external", {
      value: 0.5,
      displayName: "Orthophosphate (external)",
      texName: "Orthophosphate (external)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_ex_pga", {
      value: 0.25,
      texName: "km\\_ex\\_pga",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_ex_gap", {
      value: 0.075,
      texName: "km\\_ex\\_gap",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_ex_dhap", {
      value: 0.077,
      texName: "km\\_ex\\_dhap",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_N_translocator_Orthophosphate_external", {
      value: 0.74,
      displayName: "km_N_translocator_Orthophosphate (external)",
      texName: "km\\_N\\_translocator\\_Orthophosphate (external)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_N_translocator_Orthophosphate", {
      value: 0.63,
      texName: "km\\_N\\_translocator\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_N_translocator", {
      value: 2.0,
      texName: "kcat\\_N\\_translocator",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("E0_N_translocator", {
      value: 1.0,
      texName: "E0\\_N\\_translocator",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_ex_g1p", {
      value: 1.0,
      texName: "E0\\_ex\\_g1p",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_ex_g1p_G1P", {
      value: 0.08,
      texName: "km\\_ex\\_g1p\\_G1P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_ex_g1p_ATP", {
      value: 0.08,
      texName: "km\\_ex\\_g1p\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_ex_g1p", {
      value: 10.0,
      texName: "ki\\_ex\\_g1p",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_ex_g1p_3PGA", {
      value: 0.1,
      texName: "ki\\_ex\\_g1p\\_3PGA",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("ki_ex_g1p_F6P", {
      value: 0.02,
      texName: "ki\\_ex\\_g1p\\_F6P",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("ki_ex_g1p_FBP", {
      value: 0.02,
      texName: "ki\\_ex\\_g1p\\_FBP",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kcat_ex_g1p", {
      value: 0.32,
      texName: "kcat\\_ex\\_g1p",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_mda_reductase_1", {
      value: 500.0,
      texName: "kf\\_mda\\_reductase\\_1",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_mda_reductase_2", {
      value: 0.002,
      texName: "E0\\_mda\\_reductase\\_2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_mda_reductase_2", {
      value: 300.0,
      texName: "kcat\\_mda\\_reductase\\_2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_mda_reductase_2_NADPH", {
      value: 0.023,
      texName: "km\\_mda\\_reductase\\_2\\_NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_mda_reductase_2_MDA", {
      value: 0.0014,
      texName: "km\\_mda\\_reductase\\_2\\_MDA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf1", {
      value: 10000.0,
      texName: "kf1",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kr1", {
      value: 220.0,
      texName: "kr1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf2", {
      value: 10000.0,
      texName: "kf2",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kr2", {
      value: 4000.0,
      texName: "kr2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf3", {
      value: 2510.0,
      texName: "kf3",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf4", {
      value: 10000.0,
      texName: "kf4",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kr4", {
      value: 4000.0,
      texName: "kr4",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf5", {
      value: 2510.0,
      texName: "kf5",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("XT", {
      value: 0.07,
      texName: "XT",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_glutathion_reductase", {
      value: 0.0014,
      texName: "E0\\_glutathion\\_reductase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_glutathion_reductase", {
      value: 595.0,
      texName: "kcat\\_glutathion\\_reductase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_glutathion_reductase_NADPH", {
      value: 0.003,
      texName: "km\\_glutathion\\_reductase\\_NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_glutathion_reductase_GSSG", {
      value: 0.2,
      texName: "km\\_glutathion\\_reductase\\_GSSG",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_dehydroascorbate_reductase_DHA", {
      value: 0.07,
      texName: "km\\_dehydroascorbate\\_reductase\\_DHA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_dehydroascorbate_reductase_GSH", {
      value: 2.5,
      texName: "km\\_dehydroascorbate\\_reductase\\_GSH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("K", {
      value: 0.5,
      texName: "K",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 2 },
          { kind: "litre", exponent: -2 },
        ],
      }),
    })
    .addParameter("E0_dehydroascorbate_reductase", {
      value: 0.0017,
      texName: "E0\\_dehydroascorbate\\_reductase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_dehydroascorbate_reductase", {
      value: 142.0,
      texName: "kcat\\_dehydroascorbate\\_reductase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_ex_atp", {
      value: 0.2,
      texName: "kf\\_ex\\_atp",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_ex_nadph", {
      value: 0.2,
      texName: "kf\\_ex\\_nadph",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addVariable("_3PGA", {
      value: 0.9167729479368978,
      displayName: "PGA",
      texName: "3PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("BPGA", {
      value: 0.0003814495319659031,
      texName: "BPGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("GAP", {
      value: 0.00580821050261484,
      texName: "GAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("DHAP", {
      value: 0.1277806166216142,
      texName: "DHAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("FBP", {
      value: 0.005269452472931973,
      texName: "FBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("F6P", {
      value: 0.2874944558066638,
      texName: "F6P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("G6P", {
      value: 0.6612372482712676,
      texName: "G6P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("G1P", {
      value: 0.03835176039761378,
      texName: "G1P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("SBP", {
      value: 0.011101373736607443,
      texName: "SBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("S7P", {
      value: 0.1494578301900007,
      texName: "S7P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("E4P", {
      value: 0.00668295494870102,
      texName: "E4P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("X5P", {
      value: 0.020988553174809618,
      texName: "X5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("R5P", {
      value: 0.035155825913785584,
      texName: "R5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RUBP", {
      value: 0.11293260727162346,
      texName: "RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RU5P", {
      value: 0.014062330254191594,
      texName: "RU5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("ATP", {
      value: 1.4612747767895344,
      texName: "ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ferredoxine_oxidised", {
      value: 3.715702384326767,
      displayName: "Fd_ox",
      texName: "Ferredoxine (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("protons_lumen", {
      value: 0.002086128887296243,
      texName: "protons\\_lumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Light_harvesting_complex", {
      value: 0.7805901436176024,
      displayName: "Light-harvesting complex",
      texName: "Light-harvesting complex",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("NADPH", {
      value: 0.5578718406315588,
      texName: "NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("Plastocyanine_oxidised", {
      value: 1.8083642974980014,
      displayName: "PC_ox",
      texName: "Plastocyanine (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Plastoquinone_oxidised", {
      value: 10.251099271612473,
      displayName: "PQ",
      texName: "Plastoquinone (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PsbS_de_protonated", {
      value: 0.9667381262477079,
      displayName: "psbs_de",
      texName: "PsbS (de-protonated)",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Violaxanthin", {
      value: 0.9629870646993118,
      displayName: "vx",
      texName: "Violaxanthin",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("MDA", {
      value: 2.0353396709300447e-7,
      texName: "MDA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("H2O2", {
      value: 1.2034405327140102e-7,
      texName: "H2O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("DHA", {
      value: 1.0296456279861962e-11,
      texName: "DHA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("GSSG", {
      value: 4.99986167652437e-12,
      texName: "GSSG",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("Thioredoxin_oxidised", {
      value: 0.9334426859846461,
      displayName: "Thioredoxin (oxidised)",
      texName: "Thioredoxin (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("E_inactive", {
      value: 3.6023635680406634,
      texName: "E\\_inactive",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("protons_stroma_chl", {
      fn: new Mul([
        new Num(4000.0),
        new Pow(new Num(10.0), new Minus([new Name("pH")])),
      ]),
      texName: "protons\\_stroma\\_chl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ksat_lhc_protonation_protons", {
      fn: new Mul([
        new Num(4000.0),
        new Pow(new Num(10.0), new Minus([new Name("ksat_lhc_protonation")])),
      ]),
      texName: "ksat\\_lhc\\_protonation\\_protons",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ksat_violaxanthin_deepoxidase_protons", {
      fn: new Mul([
        new Num(4000.0),
        new Pow(
          new Num(10.0),
          new Minus([new Name("ksat_violaxanthin_deepoxidase")]),
        ),
      ]),
      texName: "ksat\\_violaxanthin\\_deepoxidase\\_protons",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("RT", {
      fn: new Mul([new Name("R"), new Name("T")]),
      texName: "RT",
    })
    .addAssignment("dG_pH", {
      fn: new Mul([new Num(2.302585092994046), new Name("R"), new Name("T")]),
      texName: "dG\\_pH",
    })
    .addAssignment("pH_lumen", {
      fn: new Minus([
        new Divide([
          new Ln(
            new Min([
              new Num(0.1),
              new Max([
                new Num(1e-14),
                new Mul([new Num(0.00025), new Name("protons_lumen")]),
              ]),
            ]),
          ),
          new Ln(new Num(10.0)),
        ]),
      ]),
      texName: "pH\\_lumen",
    })
    .addAssignment("Zeaxanthin", {
      fn: new Add([
        new Name("Carotenoids_tot"),
        new Minus([new Name("Violaxanthin")]),
      ]),
      displayName: "zx",
      texName: "Zeaxanthin",
    })
    .addAssignment("Ferredoxine_reduced", {
      fn: new Add([
        new Name("Fd_star"),
        new Minus([new Name("Ferredoxine_oxidised")]),
      ]),
      displayName: "Fd_red",
      texName: "Ferredoxine (reduced)",
    })
    .addAssignment("Plastocyanine_reduced", {
      fn: new Add([
        new Name("PC_tot"),
        new Minus([new Name("Plastocyanine_oxidised")]),
      ]),
      displayName: "PC_red",
      texName: "Plastocyanine (reduced)",
    })
    .addAssignment("PsbS_protonated", {
      fn: new Add([
        new Name("PSBS_tot"),
        new Minus([new Name("PsbS_de_protonated")]),
      ]),
      displayName: "psbs_pr",
      texName: "PsbS (protonated)",
    })
    .addAssignment("Light_harvesting_complex_protonated", {
      fn: new Add([
        new Name("LHC_tot"),
        new Minus([new Name("Light_harvesting_complex")]),
      ]),
      displayName: "Light-harvesting complex (protonated)",
      texName: "Light-harvesting complex (protonated)",
    })
    .addAssignment("Q", {
      fn: new Add([
        new Mul([
          new Name("PsbS_de_protonated"),
          new Name("Violaxanthin"),
          new Name("gamma0"),
        ]),
        new Mul([
          new Name("PsbS_protonated"),
          new Name("Violaxanthin"),
          new Name("gamma1"),
        ]),
        new Divide([
          new Mul([
            new Name("PsbS_de_protonated"),
            new Name("Zeaxanthin"),
            new Name("gamma3"),
          ]),
          new Add([new Name("Zeaxanthin"), new Name("kZSat")]),
        ]),
        new Divide([
          new Mul([
            new Name("PsbS_protonated"),
            new Name("Zeaxanthin"),
            new Name("gamma2"),
          ]),
          new Add([new Name("Zeaxanthin"), new Name("kZSat")]),
        ]),
      ]),
      texName: "Q",
    })
    .addAssignment("keq_Plastoquinone_reduced", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_QA"), new Name("F")]),
            ]),
            new Minus([
              new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH")]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      displayName: "keq_Plastoquinone (reduced)",
      texName: "keq\\_Plastoquinone (reduced)",
    })
    .addAssignment("Plastoquinone_reduced", {
      fn: new Add([
        new Name("PQ_tot"),
        new Minus([new Name("Plastoquinone_oxidised")]),
      ]),
      displayName: "PQH2",
      texName: "Plastoquinone (reduced)",
    })
    .addAssignment("PSII_cross_section", {
      fn: new Add([
        new Name("staticAntII"),
        new Mul([
          new Name("Light_harvesting_complex"),
          new Add([
            new Num(1.0),
            new Minus([new Name("staticAntI")]),
            new Minus([new Name("staticAntII")]),
          ]),
        ]),
      ]),
      texName: "PSII\\_cross\\_section",
    })
    .addAssignment("Thioredoxin_reduced", {
      fn: new Add([
        new Name("Thioredoxin_tot"),
        new Minus([new Name("Thioredoxin_oxidised")]),
      ]),
      displayName: "Thioredoxin (reduced)",
      texName: "Thioredoxin (reduced)",
    })
    .addAssignment("E_active", {
      fn: new Add([new Name("E_total"), new Minus([new Name("E_inactive")])]),
      texName: "E\\_active",
    })
    .addAssignment("NADP", {
      fn: new Add([new Name("NADP_star"), new Minus([new Name("NADPH")])]),
      texName: "NADP",
    })
    .addAssignment("ADP", {
      fn: new Add([new Name("A_star_P"), new Minus([new Name("ATP")])]),
      texName: "ADP",
    })
    .addAssignment("Orthophosphate", {
      fn: new Add([
        new Name("Pi_tot"),
        new Minus([new Name("ATP")]),
        new Minus([new Name("DHAP")]),
        new Minus([new Name("E4P")]),
        new Minus([new Name("F6P")]),
        new Minus([new Name("G1P")]),
        new Minus([new Name("G6P")]),
        new Minus([new Name("GAP")]),
        new Minus([new Name("R5P")]),
        new Minus([new Name("RU5P")]),
        new Minus([new Name("S7P")]),
        new Minus([new Name("X5P")]),
        new Minus([new Name("_3PGA")]),
        new Minus([new Mul([new Num(2.0), new Name("BPGA")])]),
        new Minus([new Mul([new Num(2.0), new Name("FBP")])]),
        new Minus([new Mul([new Num(2.0), new Name("RUBP")])]),
        new Minus([new Mul([new Num(2.0), new Name("SBP")])]),
      ]),
      displayName: "Pi",
      texName: "Orthophosphate",
    })
    .addAssignment("ascorbate", {
      fn: new Add([
        new Name("ASC_tot_star"),
        new Minus([new Name("DHA")]),
        new Minus([new Name("MDA")]),
      ]),
      texName: "ascorbate",
    })
    .addAssignment("GSH", {
      fn: new Add([
        new Name("Glutathion_tot"),
        new Minus([new Mul([new Num(2.0), new Name("GSSG")])]),
      ]),
      texName: "GSH",
    })
    .addAssignment("keq_atp_synthase", {
      fn: new Mul([
        new Name("Pi_mol"),
        new Exp(
          new Divide([
            new Add([
              new Minus([new Name("DeltaG0_ATP")]),
              new Mul([
                new Name("HPR"),
                new Name("dG_pH"),
                new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
              ]),
            ]),
            new Name("RT"),
          ]),
        ),
      ]),
      texName: "keq\\_atp\\_synthase",
    })
    .addAssignment("keq_b6f", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E_0_PC"), new Name("F")]),
            new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH_lumen")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
            ]),
            new Minus([
              new Mul([
                new Num(2.0),
                new Name("dG_pH"),
                new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
              ]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_b6f",
    })
    .addAssignment("keq_fnr", {
      fn: new Exp(
        new Divide([
          new Add([
            new Minus([new Mul([new Name("dG_pH"), new Name("pH")])]),
            new Mul([new Num(2.0), new Name("E_0_NADP"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_Fd"), new Name("F")]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_fnr",
    })
    .addAssignment("vmax_fnr", {
      fn: new Mul([new Name("E0_fnr"), new Name("kcat_fnr")]),
      texName: "vmax\\_fnr",
    })
    .addAssignment("keq_PCP700", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E_0_P700"), new Name("F")]),
            new Minus([new Mul([new Name("E_0_PC"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_PCP700",
    })
    .addAssignment("keq_ferredoxin_reductase", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E_0_Fd"), new Name("F")]),
            new Minus([new Mul([new Name("E_0_FA"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_ferredoxin\\_reductase",
    })
    .addAssignment("vmax_ferredoxin_reductase", {
      fn: new Mul([
        new Name("E0_ferredoxin_reductase"),
        new Name("kcat_ferredoxin_reductase"),
      ]),
      texName: "vmax\\_ferredoxin\\_reductase",
    })
    .addAssignment("E0_rubisco_active", {
      fn: new Mul([new Name("E0_rubisco"), new Name("E_active")]),
      texName: "E0\\_rubisco\\_active",
    })
    .addAssignment("vmax_rubisco_carboxylase", {
      fn: new Mul([
        new Name("E0_rubisco_active"),
        new Name("kcat_rubisco_carboxylase"),
      ]),
      texName: "vmax\\_rubisco\\_carboxylase",
    })
    .addAssignment("E0_fbpase_active", {
      fn: new Mul([new Name("E0_fbpase"), new Name("E_active")]),
      texName: "E0\\_fbpase\\_active",
    })
    .addAssignment("vmax_fbpase", {
      fn: new Mul([new Name("E0_fbpase_active"), new Name("kcat_fbpase")]),
      texName: "vmax\\_fbpase",
    })
    .addAssignment("E0_SBPase_active", {
      fn: new Mul([new Name("E0_SBPase"), new Name("E_active")]),
      texName: "E0\\_SBPase\\_active",
    })
    .addAssignment("vmax_SBPase", {
      fn: new Mul([new Name("E0_SBPase_active"), new Name("kcat_SBPase")]),
      texName: "vmax\\_SBPase",
    })
    .addAssignment("E0_phosphoribulokinase_active", {
      fn: new Mul([new Name("E0_phosphoribulokinase"), new Name("E_active")]),
      texName: "E0\\_phosphoribulokinase\\_active",
    })
    .addAssignment("vmax_phosphoribulokinase", {
      fn: new Mul([
        new Name("E0_phosphoribulokinase_active"),
        new Name("kcat_phosphoribulokinase"),
      ]),
      texName: "vmax\\_phosphoribulokinase",
    })
    .addAssignment("vmax_ex_pga", {
      fn: new Mul([
        new Name("E0_N_translocator"),
        new Name("kcat_N_translocator"),
      ]),
      texName: "vmax\\_ex\\_pga",
    })
    .addAssignment("N_translocator", {
      fn: new Add([
        new Num(1.0),
        new Mul([
          new Add([
            new Num(1.0),
            new Divide([
              new Name("km_N_translocator_Orthophosphate_external"),
              new Name("Orthophosphate_external"),
            ]),
          ]),
          new Add([
            new Divide([new Name("DHAP"), new Name("km_ex_dhap")]),
            new Divide([new Name("GAP"), new Name("km_ex_gap")]),
            new Divide([
              new Name("Orthophosphate"),
              new Name("km_N_translocator_Orthophosphate"),
            ]),
            new Divide([new Name("_3PGA"), new Name("km_ex_pga")]),
          ]),
        ]),
      ]),
      texName: "N\\_translocator",
    })
    .addAssignment("E0_ex_g1p_active", {
      fn: new Mul([new Name("E0_ex_g1p"), new Name("E_active")]),
      texName: "E0\\_ex\\_g1p\\_active",
    })
    .addAssignment("vmax_ex_g1p", {
      fn: new Mul([new Name("E0_ex_g1p_active"), new Name("kcat_ex_g1p")]),
      texName: "vmax\\_ex\\_g1p",
    })
    .addAssignment("vmax_mda_reductase_2", {
      fn: new Mul([
        new Name("E0_mda_reductase_2"),
        new Name("kcat_mda_reductase_2"),
      ]),
      texName: "vmax\\_mda\\_reductase\\_2",
    })
    .addAssignment("vmax_glutathion_reductase", {
      fn: new Mul([
        new Name("E0_glutathion_reductase"),
        new Name("kcat_glutathion_reductase"),
      ]),
      texName: "vmax\\_glutathion\\_reductase",
    })
    .addAssignment("vmax_dehydroascorbate_reductase", {
      fn: new Mul([
        new Name("E0_dehydroascorbate_reductase"),
        new Name("kcat_dehydroascorbate_reductase"),
      ]),
      texName: "vmax\\_dehydroascorbate\\_reductase",
    })
    .addReaction("ferredoxin_thioredoxin_reductase", {
      fn: new Mul([
        new Name("Ferredoxine_reduced"),
        new Name("Thioredoxin_oxidised"),
        new Name("kf_ferredoxin_thioredoxin_reductase"),
      ]),
      stoichiometry: [
        { name: "Thioredoxin_oxidised", value: new Num(-1.0) },
        { name: "Ferredoxine_oxidised", value: new Num(1.0) },
      ],
      texName: "ferredoxin\\_thioredoxin\\_reductase",
    })
    .addReaction("tr_activation", {
      fn: new Mul([
        new Name("E_inactive"),
        new Name("Thioredoxin_reduced"),
        new Name("kf_tr_activation"),
      ]),
      stoichiometry: [
        { name: "E_inactive", value: new Num(-5.0) },
        { name: "Thioredoxin_oxidised", value: new Num(5.0) },
      ],
      texName: "tr\\_activation",
    })
    .addReaction("tr_inactivation", {
      fn: new Mul([new Name("E_active"), new Name("kf_tr_inactivation")]),
      stoichiometry: [{ name: "E_inactive", value: new Num(5.0) }],
      texName: "tr\\_inactivation",
    })
    .addReaction("atp_synthase", {
      fn: new Mul([
        new Name("kf_atp_synthase"),
        new Add([
          new Divide([new Name("ADP"), new Name("convf")]),
          new Minus([
            new Divide([
              new Name("ATP"),
              new Mul([new Name("convf"), new Name("keq_atp_synthase")]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "protons_lumen",
          value: new Minus([new Divide([new Name("HPR"), new Name("bH")])]),
        },
        { name: "ATP", value: new Name("convf") },
      ],
      displayName: "ATP synthase",
      texName: "atp\\_synthase",
    })
    .addReaction("b6f", {
      fn: new Max([
        new Minus([new Name("kcat_b6f")]),
        new Mul([
          new Name("kcat_b6f"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Pow(new Name("Plastocyanine_oxidised"), new Num(2.0)),
            ]),
            new Minus([
              new Divide([
                new Mul([
                  new Name("Plastoquinone_oxidised"),
                  new Pow(new Name("Plastocyanine_reduced"), new Num(2.0)),
                ]),
                new Name("keq_b6f"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Plastocyanine_oxidised", value: new Num(-2.0) },
        { name: "Plastoquinone_oxidised", value: new Num(1.0) },
        {
          name: "protons_lumen",
          value: new Divide([new Num(4.0), new Name("bH")]),
        },
      ],
      displayName: "cyt b6f",
      texName: "b6f",
    })
    .addReaction("lhc_protonation", {
      fn: new Divide([
        new Mul([
          new Name("PsbS_de_protonated"),
          new Name("kf_lhc_protonation"),
          new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
        ]),
        new Add([
          new Pow(
            new Name("ksat_lhc_protonation_protons"),
            new Name("kh_lhc_protonation"),
          ),
          new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
        ]),
      ]),
      stoichiometry: [{ name: "PsbS_de_protonated", value: new Num(-1.0) }],
      displayName: "LHC protonation",
      texName: "lhc\\_protonation",
    })
    .addReaction("lhc_deprotonation", {
      fn: new Mul([
        new Name("PsbS_protonated"),
        new Name("kf_lhc_deprotonation"),
      ]),
      stoichiometry: [{ name: "PsbS_de_protonated", value: new Num(1.0) }],
      displayName: "LHC deprotonation",
      texName: "lhc\\_deprotonation",
    })
    .addReaction("cyclic_electron_flow", {
      fn: new Mul([
        new Name("Plastoquinone_oxidised"),
        new Name("kf_cyclic_electron_flow"),
        new Pow(new Name("Ferredoxine_reduced"), new Num(2.0)),
      ]),
      stoichiometry: [
        { name: "Plastoquinone_oxidised", value: new Num(-1.0) },
        { name: "Ferredoxine_oxidised", value: new Num(2.0) },
      ],
      displayName: "cyclic electron flow",
      texName: "cyclic\\_electron\\_flow",
    })
    .addReaction("violaxanthin_deepoxidase", {
      fn: new Divide([
        new Mul([
          new Name("Violaxanthin"),
          new Name("kf_violaxanthin_deepoxidase"),
          new Pow(
            new Name("protons_lumen"),
            new Name("kh_violaxanthin_deepoxidase"),
          ),
        ]),
        new Add([
          new Pow(
            new Name("ksat_violaxanthin_deepoxidase_protons"),
            new Name("kh_violaxanthin_deepoxidase"),
          ),
          new Pow(
            new Name("protons_lumen"),
            new Name("kh_violaxanthin_deepoxidase"),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "Violaxanthin", value: new Num(-1.0) }],
      displayName: "violaxanthin deepoxidase",
      texName: "violaxanthin\\_deepoxidase",
    })
    .addReaction("zeaxanthin_epoxidase", {
      fn: new Mul([
        new Name("Zeaxanthin"),
        new Name("kf_zeaxanthin_epoxidase"),
      ]),
      stoichiometry: [{ name: "Violaxanthin", value: new Num(1.0) }],
      displayName: "zeaxanthin epoxidase",
      texName: "zeaxanthin\\_epoxidase",
    })
    .addReaction("fnr", {
      fn: new Divide([
        new Mul([
          new Name("vmax_fnr"),
          new Add([
            new Divide([
              new Mul([
                new Name("NADP"),
                new Pow(
                  new Divide([
                    new Name("Ferredoxine_reduced"),
                    new Name("km_fnr_Ferredoxine_reduced"),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Mul([new Name("convf"), new Name("km_fnr_NADP")]),
            ]),
            new Minus([
              new Divide([
                new Mul([
                  new Name("NADPH"),
                  new Pow(
                    new Divide([
                      new Name("Ferredoxine_oxidised"),
                      new Name("km_fnr_Ferredoxine_reduced"),
                    ]),
                    new Num(2.0),
                  ),
                ]),
                new Mul([
                  new Name("convf"),
                  new Name("keq_fnr"),
                  new Name("km_fnr_NADP"),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Num(-1.0),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([
                new Name("NADP"),
                new Mul([new Name("convf"), new Name("km_fnr_NADP")]),
              ]),
            ]),
            new Add([
              new Num(1.0),
              new Pow(
                new Divide([
                  new Name("Ferredoxine_reduced"),
                  new Name("km_fnr_Ferredoxine_reduced"),
                ]),
                new Num(2.0),
              ),
              new Divide([
                new Name("Ferredoxine_reduced"),
                new Name("km_fnr_Ferredoxine_reduced"),
              ]),
            ]),
          ]),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([
                new Name("NADPH"),
                new Mul([new Name("convf"), new Name("km_fnr_NADP")]),
              ]),
            ]),
            new Add([
              new Num(1.0),
              new Pow(
                new Divide([
                  new Name("Ferredoxine_oxidised"),
                  new Name("km_fnr_Ferredoxine_reduced"),
                ]),
                new Num(2.0),
              ),
              new Divide([
                new Name("Ferredoxine_oxidised"),
                new Name("km_fnr_Ferredoxine_reduced"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ferredoxine_oxidised", value: new Num(2.0) },
        { name: "NADPH", value: new Name("convf") },
      ],
      displayName: "FNR",
      texName: "fnr",
    })
    .addReaction("ndh", {
      fn: new Mul([new Name("Plastoquinone_oxidised"), new Name("kf_ndh")]),
      stoichiometry: [{ name: "Plastoquinone_oxidised", value: new Num(-1.0) }],
      displayName: "NDH",
      texName: "ndh",
    })
    .addReaction("PSII", {
      fn: new Mul([new Num(0.5), new Name("B1"), new Name("k2")]),
      stoichiometry: [
        { name: "Plastoquinone_oxidised", value: new Num(-1.0) },
        {
          name: "protons_lumen",
          value: new Divide([new Num(2.0), new Name("bH")]),
        },
      ],
      texName: "PSII",
    })
    .addReaction("PSI", {
      fn: new Mul([
        new Name("A0"),
        new Name("PPFD"),
        new Add([new Num(1.0), new Minus([new Name("PSII_cross_section")])]),
      ]),
      stoichiometry: [{ name: "Plastocyanine_oxidised", value: new Num(1.0) }],
      texName: "PSI",
    })
    .addReaction("mehler", {
      fn: new Mul([
        new Name("A1"),
        new Name("O2_dissolved_lumen"),
        new Name("kMehler"),
      ]),
      stoichiometry: [{ name: "H2O2", value: new Name("convf") }],
      texName: "mehler",
    })
    .addReaction("ferredoxin_reductase", {
      fn: new Add([
        new Mul([
          new Name("A1"),
          new Name("Ferredoxine_oxidised"),
          new Name("vmax_ferredoxin_reductase"),
        ]),
        new Minus([
          new Divide([
            new Mul([
              new Name("A2"),
              new Name("Ferredoxine_reduced"),
              new Name("vmax_ferredoxin_reductase"),
            ]),
            new Name("keq_ferredoxin_reductase"),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "Ferredoxine_oxidised", value: new Num(-1.0) }],
      texName: "ferredoxin\\_reductase",
    })
    .addReaction("proton_leak", {
      fn: new Mul([
        new Name("kf_proton_leak"),
        new Add([
          new Name("protons_lumen"),
          new Minus([new Name("protons_stroma_chl")]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "protons_lumen",
          value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
        },
      ],
      displayName: "proton leak",
      texName: "proton\\_leak",
    })
    .addReaction("PTOX", {
      fn: new Mul([
        new Name("O2_dissolved_lumen"),
        new Name("Plastoquinone_reduced"),
        new Name("kPTOX"),
      ]),
      stoichiometry: [{ name: "Plastoquinone_oxidised", value: new Num(1.0) }],
      texName: "PTOX",
    })
    .addReaction("lhc_state_transition_12", {
      fn: new Divide([
        new Mul([
          new Num(1.0),
          new Name("Light_harvesting_complex"),
          new Name("kStt7"),
        ]),
        new Add([
          new Num(1.0),
          new Pow(
            new Divide([
              new Name("Plastoquinone_oxidised"),
              new Mul([
                new Name("PQ_tot"),
                new Name("km_lhc_state_transition_12"),
              ]),
            ]),
            new Name("n_ST"),
          ),
        ]),
      ]),
      stoichiometry: [
        { name: "Light_harvesting_complex", value: new Num(-1.0) },
      ],
      displayName: "LHC state transition 1->2",
      texName: "lhc\\_state\\_transition\\_12",
    })
    .addReaction("lhc_state_transition_21", {
      fn: new Mul([
        new Name("Light_harvesting_complex_protonated"),
        new Name("kPph1"),
      ]),
      stoichiometry: [
        { name: "Light_harvesting_complex", value: new Num(1.0) },
      ],
      displayName: "LHC state transition 2->1",
      texName: "lhc\\_state\\_transition\\_21",
    })
    .addReaction("rubisco_carboxylase", {
      fn: new Divide([
        new Mul([
          new Name("CO2_dissolved"),
          new Name("RUBP"),
          new Name("vmax_rubisco_carboxylase"),
        ]),
        new Mul([
          new Add([
            new Name("CO2_dissolved"),
            new Name("km_rubisco_carboxylase_CO2_dissolved"),
          ]),
          new Add([
            new Name("RUBP"),
            new Mul([
              new Name("km_rubisco_carboxylase_RUBP"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("FBP"),
                  new Name("ki_rubisco_carboxylase_FBP"),
                ]),
                new Divide([
                  new Name("NADPH"),
                  new Name("ki_rubisco_carboxylase_NADPH"),
                ]),
                new Divide([
                  new Name("Orthophosphate"),
                  new Name("ki_rubisco_carboxylase_Orthophosphate"),
                ]),
                new Divide([
                  new Name("SBP"),
                  new Name("ki_rubisco_carboxylase_SBP"),
                ]),
                new Divide([
                  new Name("_3PGA"),
                  new Name("ki_rubisco_carboxylase_3PGA"),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "RUBP", value: new Num(-1.0) },
        { name: "_3PGA", value: new Num(2.0) },
      ],
      displayName: "rubisco carboxylase",
      texName: "rubisco\\_carboxylase",
    })
    .addReaction("phosphoglycerate_kinase", {
      fn: new Mul([
        new Name("kre_phosphoglycerate_kinase"),
        new Add([
          new Mul([new Name("ATP"), new Name("_3PGA")]),
          new Minus([
            new Divide([
              new Mul([new Name("ADP"), new Name("BPGA")]),
              new Name("keq_phosphoglycerate_kinase"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "_3PGA", value: new Num(-1.0) },
        { name: "ATP", value: new Num(-1.0) },
        { name: "BPGA", value: new Num(1.0) },
      ],
      displayName: "phosphoglycerate kinase",
      texName: "phosphoglycerate\\_kinase",
    })
    .addReaction("gadph", {
      fn: new Mul([
        new Name("kre_gadph"),
        new Add([
          new Mul([new Name("BPGA"), new Name("NADPH"), new Name("protons")]),
          new Minus([
            new Divide([
              new Mul([
                new Name("GAP"),
                new Name("NADP"),
                new Name("Orthophosphate"),
              ]),
              new Name("keq_gadph"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "NADPH", value: new Num(-1.0) },
        { name: "BPGA", value: new Num(-1.0) },
        { name: "GAP", value: new Num(1.0) },
      ],
      displayName: "GAPDH",
      texName: "gadph",
    })
    .addReaction("triose_phosphate_isomerase", {
      fn: new Mul([
        new Name("kre_triose_phosphate_isomerase"),
        new Add([
          new Name("GAP"),
          new Minus([
            new Divide([
              new Name("DHAP"),
              new Name("keq_triose_phosphate_isomerase"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "DHAP", value: new Num(1.0) },
      ],
      displayName: "triose phosphate isomerase",
      texName: "triose\\_phosphate\\_isomerase",
    })
    .addReaction("aldolase_dhap_gap", {
      fn: new Mul([
        new Name("kre_aldolase_dhap_gap"),
        new Add([
          new Mul([new Name("DHAP"), new Name("GAP")]),
          new Minus([
            new Divide([new Name("FBP"), new Name("keq_aldolase_dhap_gap")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "DHAP", value: new Num(-1.0) },
        { name: "FBP", value: new Num(1.0) },
      ],
      displayName: "aldolase (DHAP+GAP)",
      texName: "aldolase\\_dhap\\_gap",
    })
    .addReaction("aldolase_dhap_e4p", {
      fn: new Mul([
        new Name("kre_aldolase_dhap_e4p"),
        new Add([
          new Mul([new Name("DHAP"), new Name("E4P")]),
          new Minus([
            new Divide([new Name("SBP"), new Name("keq_aldolase_dhap_e4p")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "DHAP", value: new Num(-1.0) },
        { name: "E4P", value: new Num(-1.0) },
        { name: "SBP", value: new Num(1.0) },
      ],
      displayName: "aldolase (DHAP+E4P)",
      texName: "aldolase\\_dhap\\_e4p",
    })
    .addReaction("fbpase", {
      fn: new Divide([
        new Mul([new Name("FBP"), new Name("vmax_fbpase")]),
        new Add([
          new Name("FBP"),
          new Mul([
            new Name("km_fbpase_s"),
            new Add([
              new Num(1.0),
              new Divide([new Name("F6P"), new Name("ki_fbpase_F6P")]),
              new Divide([
                new Name("Orthophosphate"),
                new Name("ki_fbpase_Orthophosphate"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "FBP", value: new Num(-1.0) },
        { name: "F6P", value: new Num(1.0) },
      ],
      displayName: "FBPase",
      texName: "fbpase",
    })
    .addReaction("transketolase_gap_f6p", {
      fn: new Mul([
        new Name("kre_transketolase_gap_f6p"),
        new Add([
          new Mul([new Name("F6P"), new Name("GAP")]),
          new Minus([
            new Divide([
              new Mul([new Name("E4P"), new Name("X5P")]),
              new Name("keq_transketolase_gap_f6p"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "F6P", value: new Num(-1.0) },
        { name: "E4P", value: new Num(1.0) },
        { name: "X5P", value: new Num(1.0) },
      ],
      displayName: "transketolase (GAP+F6P)",
      texName: "transketolase\\_gap\\_f6p",
    })
    .addReaction("transketolase_gap_s7p", {
      fn: new Mul([
        new Name("kre_transketolase_gap_s7p"),
        new Add([
          new Mul([new Name("GAP"), new Name("S7P")]),
          new Minus([
            new Divide([
              new Mul([new Name("R5P"), new Name("X5P")]),
              new Name("keq_transketolase_gap_s7p"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "GAP", value: new Num(-1.0) },
        { name: "S7P", value: new Num(-1.0) },
        { name: "R5P", value: new Num(1.0) },
        { name: "X5P", value: new Num(1.0) },
      ],
      displayName: "transketolase (GAP+S7P)",
      texName: "transketolase\\_gap\\_s7p",
    })
    .addReaction("SBPase", {
      fn: new Divide([
        new Mul([new Name("SBP"), new Name("vmax_SBPase")]),
        new Add([
          new Name("SBP"),
          new Mul([
            new Name("km_SBPase_s"),
            new Add([
              new Num(1.0),
              new Divide([
                new Name("Orthophosphate"),
                new Name("ki_SBPase_Orthophosphate"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "SBP", value: new Num(-1.0) },
        { name: "S7P", value: new Num(1.0) },
      ],
      texName: "SBPase",
    })
    .addReaction("ribose_phosphate_isomerase", {
      fn: new Mul([
        new Name("kre_ribose_phosphate_isomerase"),
        new Add([
          new Name("R5P"),
          new Minus([
            new Divide([
              new Name("RU5P"),
              new Name("keq_ribose_phosphate_isomerase"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "R5P", value: new Num(-1.0) },
        { name: "RU5P", value: new Num(1.0) },
      ],
      displayName: "ribose phosphate isomerase",
      texName: "ribose\\_phosphate\\_isomerase",
    })
    .addReaction("ribulose_phosphate_epimerase", {
      fn: new Mul([
        new Name("kre_ribulose_phosphate_epimerase"),
        new Add([
          new Name("X5P"),
          new Minus([
            new Divide([
              new Name("RU5P"),
              new Name("keq_ribulose_phosphate_epimerase"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "X5P", value: new Num(-1.0) },
        { name: "RU5P", value: new Num(1.0) },
      ],
      displayName: "ribulose phosphate epimerase",
      texName: "ribulose\\_phosphate\\_epimerase",
    })
    .addReaction("phosphoribulokinase", {
      fn: new Divide([
        new Mul([
          new Name("ATP"),
          new Name("RU5P"),
          new Name("vmax_phosphoribulokinase"),
        ]),
        new Mul([
          new Add([
            new Name("RU5P"),
            new Mul([
              new Name("km_phosphoribulokinase_RU5P"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("Orthophosphate"),
                  new Name("ki_phosphoribulokinase_Orthophosphate"),
                ]),
                new Divide([
                  new Name("RUBP"),
                  new Name("ki_phosphoribulokinase_RUBP"),
                ]),
                new Divide([
                  new Name("_3PGA"),
                  new Name("ki_phosphoribulokinase_3PGA"),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("ATP"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP"),
                  new Name("ki_phosphoribulokinase_4"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("km_phosphoribulokinase_ATP"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP"),
                  new Name("ki_phosphoribulokinase_5"),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "RU5P", value: new Num(-1.0) },
        { name: "ATP", value: new Num(-1.0) },
        { name: "RUBP", value: new Num(1.0) },
      ],
      texName: "phosphoribulokinase",
    })
    .addReaction("g6pi", {
      fn: new Mul([
        new Name("kre_g6pi"),
        new Add([
          new Name("F6P"),
          new Minus([new Divide([new Name("G6P"), new Name("keq_g6pi")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "F6P", value: new Num(-1.0) },
        { name: "G6P", value: new Num(1.0) },
      ],
      displayName: "G6P isomerase",
      texName: "g6pi",
    })
    .addReaction("phosphoglucomutase", {
      fn: new Mul([
        new Name("kre_phosphoglucomutase"),
        new Add([
          new Name("G6P"),
          new Minus([
            new Divide([new Name("G1P"), new Name("keq_phosphoglucomutase")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "G6P", value: new Num(-1.0) },
        { name: "G1P", value: new Num(1.0) },
      ],
      texName: "phosphoglucomutase",
    })
    .addReaction("ex_pga", {
      fn: new Divide([
        new Mul([new Name("_3PGA"), new Name("vmax_ex_pga")]),
        new Mul([new Name("N_translocator"), new Name("km_ex_pga")]),
      ]),
      stoichiometry: [{ name: "_3PGA", value: new Num(-1.0) }],
      displayName: "PGA export",
      texName: "ex\\_pga",
    })
    .addReaction("ex_gap", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("vmax_ex_pga")]),
        new Mul([new Name("N_translocator"), new Name("km_ex_gap")]),
      ]),
      stoichiometry: [{ name: "GAP", value: new Num(-1.0) }],
      displayName: "GAP export",
      texName: "ex\\_gap",
    })
    .addReaction("ex_dhap", {
      fn: new Divide([
        new Mul([new Name("DHAP"), new Name("vmax_ex_pga")]),
        new Mul([new Name("N_translocator"), new Name("km_ex_dhap")]),
      ]),
      stoichiometry: [{ name: "DHAP", value: new Num(-1.0) }],
      displayName: "DHAP export",
      texName: "ex\\_dhap",
    })
    .addReaction("ex_g1p", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("G1P"), new Name("vmax_ex_g1p")]),
        new Mul([
          new Add([new Name("G1P"), new Name("km_ex_g1p_G1P")]),
          new Add([
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([new Name("ADP"), new Name("ki_ex_g1p")]),
              ]),
              new Add([new Name("ATP"), new Name("km_ex_g1p_ATP")]),
            ]),
            new Divide([
              new Mul([new Name("Orthophosphate"), new Name("km_ex_g1p_ATP")]),
              new Add([
                new Mul([new Name("F6P"), new Name("ki_ex_g1p_F6P")]),
                new Mul([new Name("FBP"), new Name("ki_ex_g1p_FBP")]),
                new Mul([new Name("_3PGA"), new Name("ki_ex_g1p_3PGA")]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "G1P", value: new Num(-1.0) },
        { name: "ATP", value: new Num(-1.0) },
      ],
      displayName: "G1P export",
      texName: "ex\\_g1p",
    })
    .addReaction("mda_reductase_1", {
      fn: new Mul([
        new Name("kf_mda_reductase_1"),
        new Pow(new Name("MDA"), new Num(2.0)),
      ]),
      stoichiometry: [
        { name: "MDA", value: new Num(-2.0) },
        { name: "DHA", value: new Num(1.0) },
      ],
      texName: "mda\\_reductase\\_1",
    })
    .addReaction("mda_reductase_2", {
      fn: new Divide([
        new Mul([
          new Name("MDA"),
          new Name("NADPH"),
          new Name("vmax_mda_reductase_2"),
        ]),
        new Add([
          new Mul([new Name("MDA"), new Name("NADPH")]),
          new Mul([new Name("MDA"), new Name("km_mda_reductase_2_NADPH")]),
          new Mul([new Name("NADPH"), new Name("km_mda_reductase_2_MDA")]),
          new Mul([
            new Name("km_mda_reductase_2_MDA"),
            new Name("km_mda_reductase_2_NADPH"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "NADPH", value: new Num(-1.0) },
        { name: "MDA", value: new Num(-2.0) },
      ],
      texName: "mda\\_reductase\\_2",
    })
    .addReaction("ascorbate_peroxidase", {
      fn: new Divide([
        new Mul([new Name("H2O2"), new Name("XT"), new Name("ascorbate")]),
        new Add([
          new Divide([new Name("H2O2"), new Name("kf2")]),
          new Divide([new Name("H2O2"), new Name("kf4")]),
          new Divide([new Name("ascorbate"), new Name("kf1")]),
          new Mul([
            new Name("H2O2"),
            new Name("ascorbate"),
            new Add([
              new Divide([new Num(1.0), new Name("kf3")]),
              new Divide([new Num(1.0), new Name("kf5")]),
            ]),
          ]),
          new Divide([
            new Name("kr1"),
            new Mul([new Name("kf1"), new Name("kf2")]),
          ]),
          new Divide([
            new Mul([new Name("H2O2"), new Name("kr2")]),
            new Mul([new Name("kf2"), new Name("kf3")]),
          ]),
          new Divide([
            new Mul([new Name("H2O2"), new Name("kr4")]),
            new Mul([new Name("kf4"), new Name("kf5")]),
          ]),
          new Divide([
            new Mul([new Name("kr1"), new Name("kr2")]),
            new Mul([new Name("kf1"), new Name("kf2"), new Name("kf3")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "H2O2", value: new Num(-1.0) },
        { name: "MDA", value: new Num(2.0) },
      ],
      texName: "ascorbate\\_peroxidase",
    })
    .addReaction("glutathion_reductase", {
      fn: new Divide([
        new Mul([
          new Name("GSSG"),
          new Name("NADPH"),
          new Name("vmax_glutathion_reductase"),
        ]),
        new Add([
          new Mul([new Name("GSSG"), new Name("NADPH")]),
          new Mul([
            new Name("GSSG"),
            new Name("km_glutathion_reductase_NADPH"),
          ]),
          new Mul([
            new Name("NADPH"),
            new Name("km_glutathion_reductase_GSSG"),
          ]),
          new Mul([
            new Name("km_glutathion_reductase_GSSG"),
            new Name("km_glutathion_reductase_NADPH"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "NADPH", value: new Num(-1.0) },
        { name: "GSSG", value: new Num(-1.0) },
      ],
      texName: "glutathion\\_reductase",
    })
    .addReaction("dehydroascorbate_reductase", {
      fn: new Divide([
        new Mul([
          new Name("DHA"),
          new Name("GSH"),
          new Name("vmax_dehydroascorbate_reductase"),
        ]),
        new Add([
          new Name("K"),
          new Mul([new Name("DHA"), new Name("GSH")]),
          new Mul([
            new Name("DHA"),
            new Name("km_dehydroascorbate_reductase_GSH"),
          ]),
          new Mul([
            new Name("GSH"),
            new Name("km_dehydroascorbate_reductase_DHA"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "DHA", value: new Num(-1.0) },
        { name: "GSSG", value: new Num(1.0) },
      ],
      texName: "dehydroascorbate\\_reductase",
    })
    .addReaction("ex_atp", {
      fn: new Mul([new Name("ATP"), new Name("kf_ex_atp")]),
      stoichiometry: [{ name: "ATP", value: new Num(-1.0) }],
      texName: "ex\\_atp",
    })
    .addReaction("ex_nadph", {
      fn: new Mul([new Name("NADPH"), new Name("kf_ex_nadph")]),
      stoichiometry: [{ name: "NADPH", value: new Num(-1.0) }],
      texName: "ex\\_nadph",
    })
    .addAssignment("B0", {
      fn: new Divide([
        new Mul([
          new Name("PSII_total"),
          new Name("Plastoquinone_oxidised"),
          new Name("kPQred"),
          new Name("keq_Plastoquinone_reduced"),
          new Add([
            new Pow(new Name("kF"), new Num(2.0)),
            new Pow(new Name("kH0"), new Num(2.0)),
            new Mul([new Name("k2"), new Name("kF")]),
            new Mul([new Name("k2"), new Name("kH0")]),
            new Mul([
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([new Num(2.0), new Name("kF"), new Name("kH0")]),
            new Mul([new Name("Q"), new Name("k2"), new Name("kH")]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PPFD"), new Num(2.0)),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
        ]),
      ]),
      texName: "B0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B1", {
      fn: new Divide([
        new Mul([
          new Name("PPFD"),
          new Name("PSII_cross_section"),
          new Name("PSII_total"),
          new Name("Plastoquinone_oxidised"),
          new Name("kPQred"),
          new Name("keq_Plastoquinone_reduced"),
          new Add([
            new Name("kF"),
            new Name("kH0"),
            new Mul([new Name("Q"), new Name("kH")]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PPFD"), new Num(2.0)),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
        ]),
      ]),
      texName: "B1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B2", {
      fn: new Divide([
        new Mul([
          new Name("PSII_total"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PPFD"), new Num(2.0)),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
        ]),
      ]),
      texName: "B2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B3", {
      fn: new Divide([
        new Mul([
          new Name("PPFD"),
          new Name("PSII_cross_section"),
          new Name("PSII_total"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PPFD"), new Num(2.0)),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
        ]),
      ]),
      texName: "B3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("A0", {
      fn: new Divide([
        new Mul([
          new Name("PSI_total"),
          new Name("Plastocyanine_reduced"),
          new Name("kPCox"),
          new Name("keq_PCP700"),
          new Name("keq_ferredoxin_reductase"),
          new Add([
            new Mul([new Name("Ferredoxine_oxidised"), new Name("kFdred")]),
            new Mul([new Name("O2_dissolved_lumen"), new Name("kMehler")]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Ferredoxine_reduced"),
            new Name("kFdred"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("Ferredoxine_oxidised"),
            new Name("kFdred"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("O2_dissolved_lumen"),
            new Name("kMehler"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("Ferredoxine_oxidised"),
            new Name("Plastocyanine_reduced"),
            new Name("kFdred"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
          ]),
          new Mul([
            new Name("O2_dissolved_lumen"),
            new Name("Plastocyanine_reduced"),
            new Name("kMehler"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Plastocyanine_reduced"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Num(1.0),
              new Minus([new Name("PSII_cross_section")]),
            ]),
          ]),
        ]),
      ]),
      texName: "A0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("A1", {
      fn: new Divide([
        new Mul([
          new Name("PSI_total"),
          new Add([
            new Mul([
              new Name("Ferredoxine_reduced"),
              new Name("kFdred"),
              new Add([
                new Mul([
                  new Name("Plastocyanine_oxidised"),
                  new Name("kPCox"),
                ]),
                new Mul([
                  new Name("PPFD"),
                  new Name("keq_PCP700"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("Plastocyanine_reduced"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Num(1.0),
                new Minus([new Name("PSII_cross_section")]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Ferredoxine_reduced"),
            new Name("kFdred"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("Ferredoxine_oxidised"),
            new Name("kFdred"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("O2_dissolved_lumen"),
            new Name("kMehler"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Mul([new Name("Plastocyanine_oxidised"), new Name("kPCox")]),
              new Mul([
                new Name("PPFD"),
                new Name("keq_PCP700"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("Ferredoxine_oxidised"),
            new Name("Plastocyanine_reduced"),
            new Name("kFdred"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
          ]),
          new Mul([
            new Name("O2_dissolved_lumen"),
            new Name("Plastocyanine_reduced"),
            new Name("kMehler"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Plastocyanine_reduced"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
            new Add([
              new Num(1.0),
              new Minus([new Name("PSII_cross_section")]),
            ]),
          ]),
        ]),
      ]),
      texName: "A1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("A2", {
      fn: new Add([
        new Name("PSI_total"),
        new Minus([
          new Divide([
            new Mul([
              new Name("PSI_total"),
              new Add([
                new Mul([
                  new Name("Ferredoxine_reduced"),
                  new Name("kFdred"),
                  new Add([
                    new Mul([
                      new Name("Plastocyanine_oxidised"),
                      new Name("kPCox"),
                    ]),
                    new Mul([
                      new Name("PPFD"),
                      new Name("keq_PCP700"),
                      new Add([
                        new Num(1.0),
                        new Minus([new Name("PSII_cross_section")]),
                      ]),
                    ]),
                  ]),
                ]),
                new Mul([
                  new Name("PPFD"),
                  new Name("Plastocyanine_reduced"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
              ]),
            ]),
            new Add([
              new Mul([
                new Name("Ferredoxine_reduced"),
                new Name("kFdred"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("Ferredoxine_oxidised"),
                new Name("kFdred"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("O2_dissolved_lumen"),
                new Name("kMehler"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("Ferredoxine_oxidised"),
                new Name("Plastocyanine_reduced"),
                new Name("kFdred"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
              ]),
              new Mul([
                new Name("O2_dissolved_lumen"),
                new Name("Plastocyanine_reduced"),
                new Name("kMehler"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("Plastocyanine_reduced"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Minus([
          new Divide([
            new Mul([
              new Name("PSI_total"),
              new Name("Plastocyanine_reduced"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Mul([new Name("Ferredoxine_oxidised"), new Name("kFdred")]),
                new Mul([new Name("O2_dissolved_lumen"), new Name("kMehler")]),
              ]),
            ]),
            new Add([
              new Mul([
                new Name("Ferredoxine_reduced"),
                new Name("kFdred"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("Ferredoxine_oxidised"),
                new Name("kFdred"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("O2_dissolved_lumen"),
                new Name("kMehler"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Mul([
                    new Name("Plastocyanine_oxidised"),
                    new Name("kPCox"),
                  ]),
                  new Mul([
                    new Name("PPFD"),
                    new Name("keq_PCP700"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("Ferredoxine_oxidised"),
                new Name("Plastocyanine_reduced"),
                new Name("kFdred"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
              ]),
              new Mul([
                new Name("O2_dissolved_lumen"),
                new Name("Plastocyanine_reduced"),
                new Name("kMehler"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("Plastocyanine_reduced"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      texName: "A2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addReadout("PQ_ox_per_tot", {
      fn: new Divide([new Name("Plastoquinone_reduced"), new Name("PQ_tot")]),
      displayName: "PQ_ox/tot",
      texName: "PQ\\_ox/tot",
    })
    .addReadout("Fd_ox_per_tot", {
      fn: new Divide([new Name("Ferredoxine_reduced"), new Name("Fd_star")]),
      displayName: "Fd_ox/tot",
      texName: "Fd\\_ox/tot",
    })
    .addReadout("PC_ox_per_tot", {
      fn: new Divide([new Name("Plastocyanine_reduced"), new Name("PC_tot")]),
      displayName: "PC_ox/tot",
      texName: "PC\\_ox/tot",
    })
    .addReadout("NADPH_per_tot", {
      fn: new Divide([new Name("NADPH"), new Name("NADP_star")]),
      displayName: "NADPH/tot",
      texName: "NADPH/tot",
    })
    .addReadout("ATP_per_tot", {
      fn: new Divide([new Name("ATP"), new Name("A_star_P")]),
      displayName: "ATP/tot",
      texName: "ATP/tot",
    })
    .addReadout("Fluo", {
      fn: new Add([
        new Divide([
          new Mul([
            new Name("B0"),
            new Name("PSII_cross_section"),
            new Name("kF"),
          ]),
          new Add([
            new Name("k2"),
            new Name("kF"),
            new Mul([new Name("Q"), new Name("kH")]),
          ]),
        ]),
        new Divide([
          new Mul([
            new Name("B2"),
            new Name("PSII_cross_section"),
            new Name("kF"),
          ]),
          new Add([new Name("kF"), new Mul([new Name("Q"), new Name("kH")])]),
        ]),
      ]),
      texName: "Fluo",
    });
}
