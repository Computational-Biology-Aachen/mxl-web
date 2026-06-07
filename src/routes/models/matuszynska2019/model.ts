import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  Ln,
  Max,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Matuszyńska et al. (2019) supply–demand model of photosynthesis.
 *
 * "Balancing energy supply during photosynthesis – a theoretical perspective."
 * Merges two previously developed models — a photosynthetic electron transport
 * chain (PETC) model (originally for non-photochemical quenching) and a dynamic
 * Calvin–Benson–Bassham (CBB) cycle model for C3 carbon fixation — into one ODE
 * system to study how energy/redox supply by photosynthesis matches downstream
 * demand. Illustrates the dark stand-by mode needed to restart carbon fixation
 * after dark–light transitions.
 *
 * Ref: Matuszyńska et al. (2019), Physiologia Plantarum.
 * DOI: https://doi.org/10.1111/ppl.12962
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("protons", {
      value: 1.2589254117941661e-5,
      texName: "protons",
    })
    .addParameter("pH", {
      value: 7.9,
      texName: "pH",
    })
    .addParameter("CO2_dissolved", {
      value: 0.2,
      texName: "CO2 (dissolved)",
      slider: {
        min: "0.0008",
        max: "0.014",
        step: "0.0001",
      },
    })
    .addParameter("O2_dissolved_lumen", {
      value: 8.0,
      texName: "O2 (dissolved)\\_lumen",
    })
    .addParameter("PPFD", {
      value: 100.0,
      texName: "PPFD",
      slider: { min: "100", max: "2000", step: "10" },
    })
    .addParameter("bH", {
      value: 100.0,
      texName: "bH",
    })
    .addParameter("F", {
      value: 96.485,
      texName: "F",
    })
    .addParameter("E0_PC", {
      value: 0.38,
      texName: "E^0\\_PC",
    })
    .addParameter("E0_P700", {
      value: 0.48,
      texName: "E^0\\_P700",
    })
    .addParameter("E0_FA", {
      value: -0.55,
      texName: "E^0\\_FA",
    })
    .addParameter("E0_Fd", {
      value: -0.43,
      texName: "E^0\\_Fd",
    })
    .addParameter("E0_NADP", {
      value: -0.113,
      texName: "E^0\\_NADP",
    })
    .addParameter("convf", {
      value: 0.032,
      texName: "convf",
    })
    .addParameter("R", {
      value: 0.0083,
      texName: "R",
    })
    .addParameter("T", {
      value: 298.0,
      texName: "T",
    })
    .addParameter("Carotenoids_tot", {
      value: 1.0,
      texName: "Carotenoids\\_tot",
    })
    .addParameter("Fd_star", {
      value: 5.0,
      texName: "Fd*",
    })
    .addParameter("PC_tot", {
      value: 4.0,
      texName: "PC\\_tot",
    })
    .addParameter("PSBS_tot", {
      value: 1.0,
      texName: "PSBS\\_tot",
    })
    .addParameter("LHC_tot", {
      value: 1.0,
      texName: "LHC\\_tot",
    })
    .addParameter("gamma0", {
      value: 0.1,
      texName: "gamma0",
    })
    .addParameter("gamma1", {
      value: 0.25,
      texName: "gamma1",
    })
    .addParameter("gamma2", {
      value: 0.6,
      texName: "gamma2",
    })
    .addParameter("gamma3", {
      value: 0.15,
      texName: "gamma3",
    })
    .addParameter("kZSat", {
      value: 0.12,
      texName: "kZSat",
    })
    .addParameter("E0_QA", {
      value: -0.14,
      texName: "E^0\\_QA",
    })
    .addParameter("E0_PQ", {
      value: 0.354,
      texName: "E^0\\_PQ",
    })
    .addParameter("PQ_tot", {
      value: 17.5,
      texName: "PQ\\_tot",
    })
    .addParameter("staticAntII", {
      value: 0.1,
      texName: "staticAntII",
    })
    .addParameter("staticAntI", {
      value: 0.37,
      texName: "staticAntI",
    })
    .addParameter("NADP_star", {
      value: 0.8,
      texName: "NADP*",
    })
    .addParameter("A_star_P", {
      value: 2.55,
      texName: "A*P",
    })
    .addParameter("Pi_tot", {
      value: 17.05,
      texName: "Pi\\_tot",
    })
    .addParameter("kf_atp_synthase", {
      value: 20.0,
      texName: "kf\\_atp\\_synthase",
    })
    .addParameter("HPR", {
      value: 4.666666666666667,
      texName: "HPR",
    })
    .addParameter("Pi_mol", {
      value: 0.01,
      texName: "Pi\\_mol",
    })
    .addParameter("DeltaG0_ATP", {
      value: 30.6,
      texName: "DeltaG0\\_ATP",
    })
    .addParameter("kcat_b6f", {
      value: 2.5,
      texName: "kcat\\_b6f",
    })
    .addParameter("kh_lhc_protonation", {
      value: 3.0,
      texName: "kh\\_lhc\\_protonation",
    })
    .addParameter("kf_lhc_protonation", {
      value: 0.0096,
      texName: "kf\\_lhc\\_protonation",
    })
    .addParameter("ksat_lhc_protonation", {
      value: 5.8,
      texName: "ksat\\_lhc\\_protonation",
    })
    .addParameter("kf_lhc_deprotonation", {
      value: 0.0096,
      texName: "kf\\_lhc\\_deprotonation",
    })
    .addParameter("kf_cyclic_electron_flow", {
      value: 1.0,
      texName: "kf\\_cyclic\\_electron\\_flow",
      slider: {
        min: "0.0",
        max: "1.0",
        step: "0.1",
      },
    })
    .addParameter("kf_violaxanthin_deepoxidase", {
      value: 0.0024,
      texName: "kf\\_violaxanthin\\_deepoxidase",
    })
    .addParameter("kh_violaxanthin_deepoxidase", {
      value: 5.0,
      texName: "kh\\_violaxanthin\\_deepoxidase",
    })
    .addParameter("ksat_violaxanthin_deepoxidase", {
      value: 5.8,
      texName: "ksat\\_violaxanthin\\_deepoxidase",
    })
    .addParameter("kf_zeaxanthin_epoxidase", {
      value: 0.00024,
      texName: "kf\\_zeaxanthin\\_epoxidase",
    })
    .addParameter("km_fnr_Ferredoxine_reduced", {
      value: 1.56,
      texName: "km\\_fnr\\_Ferredoxine (reduced)",
    })
    .addParameter("km_fnr_NADP", {
      value: 0.22,
      texName: "km\\_fnr\\_NADP",
    })
    .addParameter("E0_fnr", {
      value: 3.0,
      texName: "E0\\_fnr",
    })
    .addParameter("kcat_fnr", {
      value: 500.0,
      texName: "kcat\\_fnr",
    })
    .addParameter("kf_ndh", {
      value: 0.002,
      texName: "kf\\_ndh",
    })
    .addParameter("PSII_total", {
      value: 2.5,
      texName: "PSII\\_total",
    })
    .addParameter("PSI_total", {
      value: 2.5,
      texName: "PSI\\_total",
    })
    .addParameter("kH0", {
      value: 500000000.0,
      texName: "kH0",
    })
    .addParameter("kPQred", {
      value: 250.0,
      texName: "kPQred",
    })
    .addParameter("kPCox", {
      value: 2500.0,
      texName: "kPCox",
    })
    .addParameter("kFdred", {
      value: 250000.0,
      texName: "kFdred",
    })
    .addParameter("k2", {
      value: 5000000000.0,
      texName: "k2",
    })
    .addParameter("kH", {
      value: 5000000000.0,
      texName: "kH",
    })
    .addParameter("kF", {
      value: 625000000.0,
      texName: "kF",
    })
    .addParameter("kf_proton_leak", {
      value: 10.0,
      texName: "kf\\_proton\\_leak",
    })
    .addParameter("kPTOX", {
      value: 0.01,
      texName: "kPTOX",
    })
    .addParameter("kStt7", {
      value: 0.0035,
      texName: "kStt7",
    })
    .addParameter("km_lhc_state_transition_12", {
      value: 0.2,
      texName: "km\\_lhc\\_state\\_transition\\_12",
    })
    .addParameter("n_ST", {
      value: 2.0,
      texName: "n\\_ST",
    })
    .addParameter("kPph1", {
      value: 0.0013,
      texName: "kPph1",
    })
    .addParameter("E0_rubisco", {
      value: 1.0,
      texName: "E0\\_rubisco",
    })
    .addParameter("kcat_rubisco_carboxylase", {
      value: 2.72,
      texName: "kcat\\_rubisco\\_carboxylase",
    })
    .addParameter("km_rubisco_carboxylase_RUBP", {
      value: 0.02,
      texName: "km\\_rubisco\\_carboxylase\\_RUBP",
    })
    .addParameter("km_rubisco_carboxylase_CO2_dissolved", {
      value: 0.0107,
      texName: "km\\_rubisco\\_carboxylase\\_CO2 (dissolved)",
    })
    .addParameter("ki_rubisco_carboxylase_3PGA", {
      value: 0.04,
      texName: "ki\\_rubisco\\_carboxylase\\_3PGA",
    })
    .addParameter("ki_rubisco_carboxylase_FBP", {
      value: 0.04,
      texName: "ki\\_rubisco\\_carboxylase\\_FBP",
    })
    .addParameter("ki_rubisco_carboxylase_SBP", {
      value: 0.075,
      texName: "ki\\_rubisco\\_carboxylase\\_SBP",
    })
    .addParameter("ki_rubisco_carboxylase_Orthophosphate", {
      value: 0.9,
      texName: "ki\\_rubisco\\_carboxylase\\_Orthophosphate",
    })
    .addParameter("ki_rubisco_carboxylase_NADPH", {
      value: 0.07,
      texName: "ki\\_rubisco\\_carboxylase\\_NADPH",
    })
    .addParameter("kre_phosphoglycerate_kinase", {
      value: 800000000.0,
      texName: "kre\\_phosphoglycerate\\_kinase",
    })
    .addParameter("keq_phosphoglycerate_kinase", {
      value: 0.00031,
      texName: "keq\\_phosphoglycerate\\_kinase",
    })
    .addParameter("kre_gadph", {
      value: 800000000.0,
      texName: "kre\\_gadph",
    })
    .addParameter("keq_gadph", {
      value: 16000000.0,
      texName: "keq\\_gadph",
    })
    .addParameter("kre_triose_phosphate_isomerase", {
      value: 800000000.0,
      texName: "kre\\_triose\\_phosphate\\_isomerase",
    })
    .addParameter("keq_triose_phosphate_isomerase", {
      value: 22.0,
      texName: "keq\\_triose\\_phosphate\\_isomerase",
    })
    .addParameter("kre_aldolase_dhap_gap", {
      value: 800000000.0,
      texName: "kre\\_aldolase\\_dhap\\_gap",
    })
    .addParameter("keq_aldolase_dhap_gap", {
      value: 7.1,
      texName: "keq\\_aldolase\\_dhap\\_gap",
    })
    .addParameter("kre_aldolase_dhap_e4p", {
      value: 800000000.0,
      texName: "kre\\_aldolase\\_dhap\\_e4p",
    })
    .addParameter("keq_aldolase_dhap_e4p", {
      value: 13.0,
      texName: "keq\\_aldolase\\_dhap\\_e4p",
    })
    .addParameter("E0_fbpase", {
      value: 1.0,
      texName: "E0\\_fbpase",
    })
    .addParameter("kcat_fbpase", {
      value: 1.6,
      texName: "kcat\\_fbpase",
    })
    .addParameter("km_fbpase_s", {
      value: 0.03,
      texName: "km\\_fbpase\\_s",
    })
    .addParameter("ki_fbpase_F6P", {
      value: 0.7,
      texName: "ki\\_fbpase\\_F6P",
    })
    .addParameter("ki_fbpase_Orthophosphate", {
      value: 12.0,
      texName: "ki\\_fbpase\\_Orthophosphate",
    })
    .addParameter("kre_transketolase_gap_f6p", {
      value: 800000000.0,
      texName: "kre\\_transketolase\\_gap\\_f6p",
    })
    .addParameter("keq_transketolase_gap_f6p", {
      value: 0.084,
      texName: "keq\\_transketolase\\_gap\\_f6p",
    })
    .addParameter("kre_transketolase_gap_s7p", {
      value: 800000000.0,
      texName: "kre\\_transketolase\\_gap\\_s7p",
    })
    .addParameter("keq_transketolase_gap_s7p", {
      value: 0.85,
      texName: "keq\\_transketolase\\_gap\\_s7p",
    })
    .addParameter("E0_SBPase", {
      value: 1.0,
      texName: "E0\\_SBPase",
    })
    .addParameter("kcat_SBPase", {
      value: 0.32,
      texName: "kcat\\_SBPase",
    })
    .addParameter("km_SBPase_s", {
      value: 0.013,
      texName: "km\\_SBPase\\_s",
    })
    .addParameter("ki_SBPase_Orthophosphate", {
      value: 12.0,
      texName: "ki\\_SBPase\\_Orthophosphate",
    })
    .addParameter("kre_ribose_phosphate_isomerase", {
      value: 800000000.0,
      texName: "kre\\_ribose\\_phosphate\\_isomerase",
    })
    .addParameter("keq_ribose_phosphate_isomerase", {
      value: 0.4,
      texName: "keq\\_ribose\\_phosphate\\_isomerase",
    })
    .addParameter("kre_ribulose_phosphate_epimerase", {
      value: 800000000.0,
      texName: "kre\\_ribulose\\_phosphate\\_epimerase",
    })
    .addParameter("keq_ribulose_phosphate_epimerase", {
      value: 0.67,
      texName: "keq\\_ribulose\\_phosphate\\_epimerase",
    })
    .addParameter("E0_phosphoribulokinase", {
      value: 1.0,
      texName: "E0\\_phosphoribulokinase",
    })
    .addParameter("kcat_phosphoribulokinase", {
      value: 7.9992,
      texName: "kcat\\_phosphoribulokinase",
    })
    .addParameter("km_phosphoribulokinase_RU5P", {
      value: 0.05,
      texName: "km\\_phosphoribulokinase\\_RU5P",
    })
    .addParameter("km_phosphoribulokinase_ATP", {
      value: 0.05,
      texName: "km\\_phosphoribulokinase\\_ATP",
    })
    .addParameter("ki_phosphoribulokinase_3PGA", {
      value: 2.0,
      texName: "ki\\_phosphoribulokinase\\_3PGA",
    })
    .addParameter("ki_phosphoribulokinase_RUBP", {
      value: 0.7,
      texName: "ki\\_phosphoribulokinase\\_RUBP",
    })
    .addParameter("ki_phosphoribulokinase_Orthophosphate", {
      value: 4.0,
      texName: "ki\\_phosphoribulokinase\\_Orthophosphate",
    })
    .addParameter("ki_phosphoribulokinase_4", {
      value: 2.5,
      texName: "ki\\_phosphoribulokinase\\_4",
    })
    .addParameter("ki_phosphoribulokinase_5", {
      value: 0.4,
      texName: "ki\\_phosphoribulokinase\\_5",
    })
    .addParameter("kre_g6pi", {
      value: 800000000.0,
      texName: "kre\\_g6pi",
    })
    .addParameter("keq_g6pi", {
      value: 2.3,
      texName: "keq\\_g6pi",
    })
    .addParameter("kre_phosphoglucomutase", {
      value: 800000000.0,
      texName: "kre\\_phosphoglucomutase",
    })
    .addParameter("keq_phosphoglucomutase", {
      value: 0.058,
      texName: "keq\\_phosphoglucomutase",
    })
    .addParameter("Orthophosphate_external", {
      value: 0.5,
      texName: "Orthophosphate (external)",
    })
    .addParameter("km_ex_pga", {
      value: 0.25,
      texName: "km\\_ex\\_pga",
    })
    .addParameter("km_ex_gap", {
      value: 0.075,
      texName: "km\\_ex\\_gap",
    })
    .addParameter("km_ex_dhap", {
      value: 0.077,
      texName: "km\\_ex\\_dhap",
    })
    .addParameter("km_N_translocator_Orthophosphate_external", {
      value: 0.74,
      texName: "km\\_N\\_translocator\\_Orthophosphate (external)",
    })
    .addParameter("km_N_translocator_Orthophosphate", {
      value: 0.63,
      texName: "km\\_N\\_translocator\\_Orthophosphate",
    })
    .addParameter("kcat_N_translocator", {
      value: 2.0,
      texName: "kcat\\_N\\_translocator",
    })
    .addParameter("E0_N_translocator", {
      value: 1.0,
      texName: "E0\\_N\\_translocator",
    })
    .addParameter("E0_ex_g1p", {
      value: 1.0,
      texName: "E0\\_ex\\_g1p",
    })
    .addParameter("km_ex_g1p_G1P", {
      value: 0.08,
      texName: "km\\_ex\\_g1p\\_G1P",
    })
    .addParameter("km_ex_g1p_ATP", {
      value: 0.08,
      texName: "km\\_ex\\_g1p\\_ATP",
    })
    .addParameter("ki_ex_g1p", {
      value: 10.0,
      texName: "ki\\_ex\\_g1p",
    })
    .addParameter("ki_ex_g1p_3PGA", {
      value: 0.1,
      texName: "ki\\_ex\\_g1p\\_3PGA",
    })
    .addParameter("ki_ex_g1p_F6P", {
      value: 0.02,
      texName: "ki\\_ex\\_g1p\\_F6P",
    })
    .addParameter("ki_ex_g1p_FBP", {
      value: 0.02,
      texName: "ki\\_ex\\_g1p\\_FBP",
    })
    .addParameter("kcat_ex_g1p", {
      value: 0.32,
      texName: "kcat\\_ex\\_g1p",
    })
    .addVariable("_3PGA", {
      value: 0.9928653922138561,
      texName: "3PGA",
    })
    .addVariable("BPGA", {
      value: 0.0005297732935310749,
      texName: "BPGA",
    })
    .addVariable("GAP", {
      value: 0.0062663539939955834,
      texName: "GAP",
    })
    .addVariable("DHAP", {
      value: 0.13785977143668732,
      texName: "DHAP",
    })
    .addVariable("FBP", {
      value: 0.006133532145409954,
      texName: "FBP",
    })
    .addVariable("F6P", {
      value: 0.31271973359685457,
      texName: "F6P",
    })
    .addVariable("G6P", {
      value: 0.719255387166192,
      texName: "G6P",
    })
    .addVariable("G1P", {
      value: 0.041716812452951633,
      texName: "G1P",
    })
    .addVariable("SBP", {
      value: 0.013123745088361893,
      texName: "SBP",
    })
    .addVariable("S7P", {
      value: 0.15890073845176905,
      texName: "S7P",
    })
    .addVariable("E4P", {
      value: 0.007322797350442026,
      texName: "E4P",
    })
    .addVariable("X5P", {
      value: 0.022478763225333428,
      texName: "X5P",
    })
    .addVariable("R5P", {
      value: 0.037651927659696716,
      texName: "R5P",
    })
    .addVariable("RUBP", {
      value: 0.13184790283048484,
      texName: "RUBP",
    })
    .addVariable("RU5P", {
      value: 0.015060770937455408,
      texName: "RU5P",
    })
    .addVariable("ATP", {
      value: 1.612922506604933,
      texName: "ATP",
    })
    .addVariable("Ferredoxine_oxidised", {
      value: 3.8624032084329674,
      texName: "Ferredoxine (oxidised)",
    })
    .addVariable("protons_lumen", {
      value: 0.002208423037307405,
      texName: "protons\\_lumen",
    })
    .addVariable("Light_minus_harvesting_complex", {
      value: 0.80137477470646,
      texName: "Light-harvesting complex",
    })
    .addVariable("NADPH", {
      value: 0.491395685599137,
      texName: "NADPH",
    })
    .addVariable("Plastocyanine_oxidised", {
      value: 1.885391998090184,
      texName: "Plastocyanine (oxidised)",
    })
    .addVariable("Plastoquinone_oxidised", {
      value: 10.991562708096392,
      texName: "Plastoquinone (oxidised)",
    })
    .addVariable("PsbS_de_minus_protonated", {
      value: 0.9610220887579118,
      texName: "PsbS (de-protonated)",
    })
    .addVariable("Violaxanthin", {
      value: 0.9514408605906095,
      texName: "Violaxanthin",
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
          new Ln(new Mul([new Num(0.00025), new Name("protons_lumen")])),
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
      texName: "Zeaxanthin",
    })
    .addAssignment("Ferredoxine_reduced", {
      fn: new Add([
        new Name("Fd_star"),
        new Minus([new Name("Ferredoxine_oxidised")]),
      ]),
      texName: "Ferredoxine (reduced)",
    })
    .addAssignment("Plastocyanine_reduced", {
      fn: new Add([
        new Name("PC_tot"),
        new Minus([new Name("Plastocyanine_oxidised")]),
      ]),
      texName: "Plastocyanine (reduced)",
    })
    .addAssignment("PsbS_protonated", {
      fn: new Add([
        new Name("PSBS_tot"),
        new Minus([new Name("PsbS_de_minus_protonated")]),
      ]),
      texName: "PsbS (protonated)",
    })
    .addAssignment("Light_minus_harvesting_complex_protonated", {
      fn: new Add([
        new Name("LHC_tot"),
        new Minus([new Name("Light_minus_harvesting_complex")]),
      ]),
      texName: "Light-harvesting complex (protonated)",
    })
    .addAssignment("Q", {
      fn: new Add([
        new Mul([
          new Name("PsbS_de_minus_protonated"),
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
            new Name("PsbS_de_minus_protonated"),
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
            new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_QA"), new Name("F")]),
            ]),
            new Minus([
              new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH")]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_Plastoquinone (reduced)",
    })
    .addAssignment("Plastoquinone_reduced", {
      fn: new Add([
        new Name("PQ_tot"),
        new Minus([new Name("Plastoquinone_oxidised")]),
      ]),
      texName: "Plastoquinone (reduced)",
    })
    .addAssignment("PSII_cross_section", {
      fn: new Add([
        new Name("staticAntII"),
        new Mul([
          new Name("Light_minus_harvesting_complex"),
          new Add([
            new Num(1.0),
            new Minus([new Name("staticAntI")]),
            new Minus([new Name("staticAntII")]),
          ]),
        ]),
      ]),
      texName: "PSII\\_cross\\_section",
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
      texName: "Orthophosphate",
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
            new Mul([new Num(2.0), new Name("E0_PC"), new Name("F")]),
            new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH_lumen")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
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
            new Mul([new Num(2.0), new Name("E0_NADP"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_Fd"), new Name("F")]),
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
            new Mul([new Name("E0_P700"), new Name("F")]),
            new Minus([new Mul([new Name("E0_PC"), new Name("F")])]),
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
            new Mul([new Name("E0_Fd"), new Name("F")]),
            new Minus([new Mul([new Name("E0_FA"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_ferredoxin\\_reductase",
    })
    .addAssignment("A1", {
      fn: new Divide([
        new Name("PSI_total"),
        new Add([
          new Num(1.0),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([
                new Name("Ferredoxine_reduced"),
                new Mul([
                  new Name("Ferredoxine_oxidised"),
                  new Name("keq_ferredoxin_reductase"),
                ]),
              ]),
            ]),
            new Add([
              new Divide([
                new Name("Plastocyanine_oxidised"),
                new Mul([
                  new Name("Plastocyanine_reduced"),
                  new Name("keq_PCP700"),
                ]),
              ]),
              new Divide([
                new Mul([
                  new Name("PPFD"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
                new Mul([new Name("Plastocyanine_reduced"), new Name("kPCox")]),
              ]),
            ]),
          ]),
          new Divide([
            new Mul([
              new Name("PPFD"),
              new Add([
                new Num(1.0),
                new Minus([new Name("PSII_cross_section")]),
              ]),
            ]),
            new Mul([new Name("Ferredoxine_oxidised"), new Name("kFdred")]),
          ]),
        ]),
      ]),
      texName: "A1",
    })
    .addAssignment("vmax_rubisco_carboxylase", {
      fn: new Mul([
        new Name("E0_rubisco"),
        new Name("kcat_rubisco_carboxylase"),
      ]),
      texName: "vmax\\_rubisco\\_carboxylase",
    })
    .addAssignment("vmax_fbpase", {
      fn: new Mul([new Name("E0_fbpase"), new Name("kcat_fbpase")]),
      texName: "vmax\\_fbpase",
    })
    .addAssignment("vmax_SBPase", {
      fn: new Mul([new Name("E0_SBPase"), new Name("kcat_SBPase")]),
      texName: "vmax\\_SBPase",
    })
    .addAssignment("vmax_phosphoribulokinase", {
      fn: new Mul([
        new Name("E0_phosphoribulokinase"),
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
    .addAssignment("vmax_ex_g1p", {
      fn: new Mul([new Name("E0_ex_g1p"), new Name("kcat_ex_g1p")]),
      texName: "vmax\\_ex\\_g1p",
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
      texName: "b6f",
    })
    .addReaction("lhc_protonation", {
      fn: new Divide([
        new Mul([
          new Name("PsbS_de_minus_protonated"),
          new Name("kf_lhc_protonation"),
          new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
        ]),
        new Add([
          new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
          new Pow(
            new Mul([
              new Num(4000.0),
              new Pow(
                new Num(10.0),
                new Minus([new Name("ksat_lhc_protonation")]),
              ),
            ]),
            new Name("kh_lhc_protonation"),
          ),
        ]),
      ]),
      stoichiometry: [
        { name: "PsbS_de_minus_protonated", value: new Num(-1.0) },
      ],
      texName: "lhc\\_protonation",
    })
    .addReaction("lhc_deprotonation", {
      fn: new Mul([
        new Name("PsbS_protonated"),
        new Name("kf_lhc_deprotonation"),
      ]),
      stoichiometry: [
        { name: "PsbS_de_minus_protonated", value: new Num(1.0) },
      ],
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
            new Name("protons_lumen"),
            new Name("kh_violaxanthin_deepoxidase"),
          ),
          new Pow(
            new Mul([
              new Num(4000.0),
              new Pow(
                new Num(10.0),
                new Minus([new Name("ksat_violaxanthin_deepoxidase")]),
              ),
            ]),
            new Name("kh_violaxanthin_deepoxidase"),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "Violaxanthin", value: new Num(-1.0) }],
      texName: "violaxanthin\\_deepoxidase",
    })
    .addReaction("zeaxanthin_epoxidase", {
      fn: new Mul([
        new Name("Zeaxanthin"),
        new Name("kf_zeaxanthin_epoxidase"),
      ]),
      stoichiometry: [{ name: "Violaxanthin", value: new Num(1.0) }],
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
      texName: "fnr",
    })
    .addReaction("ndh", {
      fn: new Mul([new Name("Plastoquinone_oxidised"), new Name("kf_ndh")]),
      stoichiometry: [{ name: "Plastoquinone_oxidised", value: new Num(-1.0) }],
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
        new Name("A1"),
        new Name("PPFD"),
        new Add([new Num(1.0), new Minus([new Name("PSII_cross_section")])]),
      ]),
      stoichiometry: [
        { name: "Ferredoxine_oxidised", value: new Num(-1.0) },
        { name: "Plastocyanine_oxidised", value: new Num(1.0) },
      ],
      texName: "PSI",
    })
    .addReaction("proton_leak", {
      fn: new Mul([
        new Name("kf_proton_leak"),
        new Add([
          new Name("protons_lumen"),
          new Minus([
            new Mul([
              new Num(4000.0),
              new Pow(new Num(10.0), new Minus([new Name("pH")])),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "protons_lumen",
          value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
        },
      ],
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
          new Name("Light_minus_harvesting_complex"),
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
        { name: "Light_minus_harvesting_complex", value: new Num(-1.0) },
      ],
      texName: "lhc\\_state\\_transition\\_12",
    })
    .addReaction("lhc_state_transition_21", {
      fn: new Mul([
        new Name("Light_minus_harvesting_complex_protonated"),
        new Name("kPph1"),
      ]),
      stoichiometry: [
        { name: "Light_minus_harvesting_complex", value: new Num(1.0) },
      ],
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
      texName: "ex\\_pga",
    })
    .addReaction("ex_gap", {
      fn: new Divide([
        new Mul([new Name("GAP"), new Name("vmax_ex_pga")]),
        new Mul([new Name("N_translocator"), new Name("km_ex_gap")]),
      ]),
      stoichiometry: [{ name: "GAP", value: new Num(-1.0) }],
      texName: "ex\\_gap",
    })
    .addReaction("ex_dhap", {
      fn: new Divide([
        new Mul([new Name("DHAP"), new Name("vmax_ex_pga")]),
        new Mul([new Name("N_translocator"), new Name("km_ex_dhap")]),
      ]),
      stoichiometry: [{ name: "DHAP", value: new Num(-1.0) }],
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
      texName: "ex\\_g1p",
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
    })
    .addAssignment("PQ_ox_div_tot", {
      fn: new Divide([new Name("Plastoquinone_reduced"), new Name("PQ_tot")]),
      texName: "PQ\\_ox/tot",
    })
    .addAssignment("Fd_ox_div_tot", {
      fn: new Divide([new Name("Ferredoxine_reduced"), new Name("Fd_star")]),
      texName: "Fd\\_ox/tot",
    })
    .addAssignment("PC_ox_div_tot", {
      fn: new Divide([new Name("Plastocyanine_reduced"), new Name("PC_tot")]),
      texName: "PC\\_ox/tot",
    })
    .addAssignment("NADPH_div_tot", {
      fn: new Divide([new Name("NADPH"), new Name("NADP_star")]),
      texName: "NADPH/tot",
    })
    .addAssignment("ATP_div_tot", {
      fn: new Divide([new Name("ATP"), new Name("A_star_P")]),
      texName: "ATP/tot",
    })
    .addAssignment("Fluo", {
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
