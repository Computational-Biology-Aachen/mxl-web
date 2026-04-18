<script lang="ts">
  import type { Analyses } from "$lib";
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
  } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addParameter("PPFD", { value: 100.0, texName: "PPFD" })
      .addParameter("CO2__dissolved_", {
        value: 0.2,
        texName: "CO2 (dissolved)",
      })
      .addParameter("O2_lumen", { value: 8.0, texName: "O2\\_lumen" })
      .addParameter("pH", { value: 7.9, texName: "pH" })
      .addParameter("protons", {
        value: 1.2589254117941661e-5,
        texName: "protons",
      })
      .addParameter("bH", { value: 100.0, texName: "bH" })
      .addParameter("F", { value: 96.485, texName: "F" })
      .addParameter("E_0_PC", { value: 0.38, texName: "E^0\\_PC" })
      .addParameter("E_0_P700", { value: 0.48, texName: "E^0\\_P700" })
      .addParameter("E_0_FA", { value: -0.55, texName: "E^0\\_FA" })
      .addParameter("E_0_Fd", { value: -0.43, texName: "E^0\\_Fd" })
      .addParameter("E_0_NADP", { value: -0.113, texName: "E^0\\_NADP" })
      .addParameter("convf", { value: 0.032, texName: "convf" })
      .addParameter("R", { value: 0.0083, texName: "R" })
      .addParameter("T", { value: 298.0, texName: "T" })
      .addParameter("Carotenoids_tot", {
        value: 1.0,
        texName: "Carotenoids\\_tot",
      })
      .addParameter("Fd_", { value: 5.0, texName: "Fd*" })
      .addParameter("PC_tot", { value: 4.0, texName: "PC\\_tot" })
      .addParameter("PSBS_tot", { value: 1.0, texName: "PSBS\\_tot" })
      .addParameter("LHC_tot", { value: 1.0, texName: "LHC\\_tot" })
      .addParameter("gamma0", { value: 0.1, texName: "gamma0" })
      .addParameter("gamma1", { value: 0.25, texName: "gamma1" })
      .addParameter("gamma2", { value: 0.6, texName: "gamma2" })
      .addParameter("gamma3", { value: 0.15, texName: "gamma3" })
      .addParameter("kZSat", { value: 0.12, texName: "kZSat" })
      .addParameter("E_0_QA", { value: -0.14, texName: "E^0\\_QA" })
      .addParameter("E_0_PQ", { value: 0.354, texName: "E^0\\_PQ" })
      .addParameter("PQ_tot", { value: 17.5, texName: "PQ\\_tot" })
      .addParameter("staticAntII", { value: 0.1, texName: "staticAntII" })
      .addParameter("staticAntI", { value: 0.37, texName: "staticAntI" })
      .addParameter("Thioredoxin_tot", {
        value: 1.0,
        texName: "Thioredoxin\\_tot",
      })
      .addParameter("E_total", { value: 6.0, texName: "E\\_total" })
      .addParameter("NADP_", { value: 0.8, texName: "NADP*" })
      .addParameter("A_P", { value: 2.55, texName: "A*P" })
      .addParameter("Pi_tot", { value: 17.05, texName: "Pi\\_tot" })
      .addParameter("kf_ferredoxin_thioredoxin_reductase", {
        value: 1.0,
        texName: "kf\\_ferredoxin\\_thioredoxin\\_reductase",
      })
      .addParameter("kf_tr_activation", {
        value: 1.0,
        texName: "kf\\_tr\\_activation",
      })
      .addParameter("kf_tr_inactivation", {
        value: 0.1,
        texName: "kf\\_tr\\_inactivation",
      })
      .addParameter("ASC_tot_", { value: 10, texName: "ASC\\_tot*" })
      .addParameter("Glutathion_tot", {
        value: 10.0,
        texName: "Glutathion\\_tot",
      })
      .addParameter("kf_atp_synthase", {
        value: 20.0,
        texName: "kf\\_atp\\_synthase",
      })
      .addParameter("HPR", { value: 4.666666666666667, texName: "HPR" })
      .addParameter("Pi_mol", { value: 0.01, texName: "Pi\\_mol" })
      .addParameter("DeltaG0_ATP", { value: 30.6, texName: "DeltaG0\\_ATP" })
      .addParameter("kcat_b6f", { value: 2.5, texName: "kcat\\_b6f" })
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
      .addParameter("km_fnr_fd_red", {
        value: 1.56,
        texName: "km\\_fnr\\_fd\\_red",
      })
      .addParameter("km_fnr_nadp", { value: 0.22, texName: "km\\_fnr\\_nadp" })
      .addParameter("E0_fnr", { value: 3.0, texName: "E0\\_fnr" })
      .addParameter("kcat_fnr", { value: 500.0, texName: "kcat\\_fnr" })
      .addParameter("kf_ndh", { value: 0.002, texName: "kf\\_ndh" })
      .addParameter("PSII_total", { value: 2.5, texName: "PSII\\_total" })
      .addParameter("PSI_total", { value: 2.5, texName: "PSI\\_total" })
      .addParameter("kH0", { value: 500000000.0, texName: "kH0" })
      .addParameter("kPQred", { value: 250.0, texName: "kPQred" })
      .addParameter("kPCox", { value: 2500.0, texName: "kPCox" })
      .addParameter("kFdred", { value: 250000.0, texName: "kFdred" })
      .addParameter("k2", { value: 5000000000.0, texName: "k2" })
      .addParameter("kH", { value: 5000000000.0, texName: "kH" })
      .addParameter("kF", { value: 625000000.0, texName: "kF" })
      .addParameter("kMehler", { value: 1.0, texName: "kMehler" })
      .addParameter("E0_ferredoxin_reductase", {
        value: 1.0,
        texName: "E0\\_ferredoxin\\_reductase",
      })
      .addParameter("kcat_ferredoxin_reductase", {
        value: 250000.0,
        texName: "kcat\\_ferredoxin\\_reductase",
      })
      .addParameter("kf_proton_leak", {
        value: 10.0,
        texName: "kf\\_proton\\_leak",
      })
      .addParameter("kPTOX", { value: 0.01, texName: "kPTOX" })
      .addParameter("kStt7", { value: 0.0035, texName: "kStt7" })
      .addParameter("km_lhc_state_transition_12", {
        value: 0.2,
        texName: "km\\_lhc\\_state\\_transition\\_12",
      })
      .addParameter("n_ST", { value: 2.0, texName: "n\\_ST" })
      .addParameter("kPph1", { value: 0.0013, texName: "kPph1" })
      .addParameter("E0_rubisco", {
        value: 1.0,
        texName: "E0\\_rubisco",
        slider: {
          min: "0.1",
          max: "2.0",
          step: "0.1",
        },
      })
      .addParameter("kcat_rubisco_carboxylase", {
        value: 2.72,
        texName: "kcat\\_rubisco\\_carboxylase",
      })
      .addParameter("km_rubisco_carboxylase_RUBP", {
        value: 0.02,
        texName: "km\\_rubisco\\_carboxylase\\_RUBP",
      })
      .addParameter("km_rubisco_carboxylase_CO2__dissolved_", {
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
      .addParameter("ki_rubisco_carboxylase_pi", {
        value: 0.9,
        texName: "ki\\_rubisco\\_carboxylase\\_pi",
      })
      .addParameter("ki_rubisco_carboxylase_nadph", {
        value: 0.07,
        texName: "ki\\_rubisco\\_carboxylase\\_nadph",
      })
      .addParameter("kre_phosphoglycerate_kinase", {
        value: 800000000.0,
        texName: "kre\\_phosphoglycerate\\_kinase",
      })
      .addParameter("keq_phosphoglycerate_kinase", {
        value: 0.00031,
        texName: "keq\\_phosphoglycerate\\_kinase",
      })
      .addParameter("kre_gadph", { value: 800000000.0, texName: "kre\\_gadph" })
      .addParameter("keq_gadph", { value: 16000000.0, texName: "keq\\_gadph" })
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
      .addParameter("E0_fbpase", { value: 1.0, texName: "E0\\_fbpase" })
      .addParameter("kcat_fbpase", { value: 1.6, texName: "kcat\\_fbpase" })
      .addParameter("km_fbpase_s", { value: 0.03, texName: "km\\_fbpase\\_s" })
      .addParameter("ki_fbpase_F6P", {
        value: 0.7,
        texName: "ki\\_fbpase\\_F6P",
      })
      .addParameter("ki_fbpase_pi", {
        value: 12.0,
        texName: "ki\\_fbpase\\_pi",
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
      .addParameter("E0_SBPase", { value: 1.0, texName: "E0\\_SBPase" })
      .addParameter("kcat_SBPase", { value: 0.32, texName: "kcat\\_SBPase" })
      .addParameter("km_SBPase_s", { value: 0.013, texName: "km\\_SBPase\\_s" })
      .addParameter("ki_SBPase_pi", {
        value: 12.0,
        texName: "ki\\_SBPase\\_pi",
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
      .addParameter("km_phosphoribulokinase_atp", {
        value: 0.05,
        texName: "km\\_phosphoribulokinase\\_atp",
      })
      .addParameter("ki_phosphoribulokinase_3PGA", {
        value: 2.0,
        texName: "ki\\_phosphoribulokinase\\_3PGA",
      })
      .addParameter("ki_phosphoribulokinase_RUBP", {
        value: 0.7,
        texName: "ki\\_phosphoribulokinase\\_RUBP",
      })
      .addParameter("ki_phosphoribulokinase_pi", {
        value: 4.0,
        texName: "ki\\_phosphoribulokinase\\_pi",
      })
      .addParameter("ki_phosphoribulokinase_4", {
        value: 2.5,
        texName: "ki\\_phosphoribulokinase\\_4",
      })
      .addParameter("ki_phosphoribulokinase_5", {
        value: 0.4,
        texName: "ki\\_phosphoribulokinase\\_5",
      })
      .addParameter("kre_g6pi", { value: 800000000.0, texName: "kre\\_g6pi" })
      .addParameter("keq_g6pi", { value: 2.3, texName: "keq\\_g6pi" })
      .addParameter("kre_phosphoglucomutase", {
        value: 800000000.0,
        texName: "kre\\_phosphoglucomutase",
      })
      .addParameter("keq_phosphoglucomutase", {
        value: 0.058,
        texName: "keq\\_phosphoglucomutase",
      })
      .addParameter("pi_ext", { value: 0.5, texName: "pi\\_ext" })
      .addParameter("km_ex_pga", { value: 0.25, texName: "km\\_ex\\_pga" })
      .addParameter("km_ex_gap", { value: 0.075, texName: "km\\_ex\\_gap" })
      .addParameter("km_ex_dhap", { value: 0.077, texName: "km\\_ex\\_dhap" })
      .addParameter("km_N_translocator_pi_ext", {
        value: 0.74,
        texName: "km\\_N\\_translocator\\_pi\\_ext",
      })
      .addParameter("km_N_translocator_pi", {
        value: 0.63,
        texName: "km\\_N\\_translocator\\_pi",
      })
      .addParameter("kcat_N_translocator", {
        value: 2.0,
        texName: "kcat\\_N\\_translocator",
      })
      .addParameter("E0_N_translocator", {
        value: 1.0,
        texName: "E0\\_N\\_translocator",
      })
      .addParameter("E0_ex_g1p", { value: 1.0, texName: "E0\\_ex\\_g1p" })
      .addParameter("km_ex_g1p_G1P", {
        value: 0.08,
        texName: "km\\_ex\\_g1p\\_G1P",
      })
      .addParameter("km_ex_g1p_atp", {
        value: 0.08,
        texName: "km\\_ex\\_g1p\\_atp",
      })
      .addParameter("ki_ex_g1p", { value: 10.0, texName: "ki\\_ex\\_g1p" })
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
      .addParameter("kcat_ex_g1p", { value: 0.32, texName: "kcat\\_ex\\_g1p" })
      .addParameter("kf_mda_reductase_1", {
        value: 500.0,
        texName: "kf\\_mda\\_reductase\\_1",
      })
      .addParameter("E0_mda_reductase_2", {
        value: 0.002,
        texName: "E0\\_mda\\_reductase\\_2",
      })
      .addParameter("kcat_mda_reductase_2", {
        value: 300.0,
        texName: "kcat\\_mda\\_reductase\\_2",
      })
      .addParameter("km_mda_reductase_2_nadph", {
        value: 0.023,
        texName: "km\\_mda\\_reductase\\_2\\_nadph",
      })
      .addParameter("km_mda_reductase_2_MDA", {
        value: 0.0014,
        texName: "km\\_mda\\_reductase\\_2\\_MDA",
      })
      .addParameter("kf1", { value: 10000.0, texName: "kf1" })
      .addParameter("kr1", { value: 220.0, texName: "kr1" })
      .addParameter("kf2", { value: 10000.0, texName: "kf2" })
      .addParameter("kr2", { value: 4000.0, texName: "kr2" })
      .addParameter("kf3", { value: 2510.0, texName: "kf3" })
      .addParameter("kf4", { value: 10000.0, texName: "kf4" })
      .addParameter("kr4", { value: 4000.0, texName: "kr4" })
      .addParameter("kf5", { value: 2510.0, texName: "kf5" })
      .addParameter("XT", { value: 0.07, texName: "XT" })
      .addParameter("E0_glutathion_reductase", {
        value: 0.0014,
        texName: "E0\\_glutathion\\_reductase",
      })
      .addParameter("kcat_glutathion_reductase", {
        value: 595,
        texName: "kcat\\_glutathion\\_reductase",
      })
      .addParameter("km_glutathion_reductase_nadph", {
        value: 0.003,
        texName: "km\\_glutathion\\_reductase\\_nadph",
      })
      .addParameter("km_glutathion_reductase_GSSG", {
        value: 0.2,
        texName: "km\\_glutathion\\_reductase\\_GSSG",
      })
      .addParameter("km_dehydroascorbate_reductase_DHA", {
        value: 0.07,
        texName: "km\\_dehydroascorbate\\_reductase\\_DHA",
      })
      .addParameter("km_dehydroascorbate_reductase_GSH", {
        value: 2.5,
        texName: "km\\_dehydroascorbate\\_reductase\\_GSH",
      })
      .addParameter("K", { value: 0.5, texName: "K" })
      .addParameter("E0_dehydroascorbate_reductase", {
        value: 0.0017,
        texName: "E0\\_dehydroascorbate\\_reductase",
      })
      .addParameter("kcat_dehydroascorbate_reductase", {
        value: 142,
        texName: "kcat\\_dehydroascorbate\\_reductase",
      })
      .addParameter("kf_ex_atp", { value: 0.2, texName: "kf\\_ex\\_atp" })
      .addParameter("kf_ex_nadph", { value: 0.2, texName: "kf\\_ex\\_nadph" })
      .addVariable("_3PGA", { value: 0.9167729479368978, texName: "3PGA" })
      .addVariable("BPGA", { value: 0.0003814495319659031, texName: "BPGA" })
      .addVariable("GAP", { value: 0.00580821050261484, texName: "GAP" })
      .addVariable("DHAP", { value: 0.1277806166216142, texName: "DHAP" })
      .addVariable("FBP", { value: 0.005269452472931973, texName: "FBP" })
      .addVariable("F6P", { value: 0.2874944558066638, texName: "F6P" })
      .addVariable("G6P", { value: 0.6612372482712676, texName: "G6P" })
      .addVariable("G1P", { value: 0.03835176039761378, texName: "G1P" })
      .addVariable("SBP", { value: 0.011101373736607443, texName: "SBP" })
      .addVariable("S7P", { value: 0.1494578301900007, texName: "S7P" })
      .addVariable("E4P", { value: 0.00668295494870102, texName: "E4P" })
      .addVariable("X5P", { value: 0.020988553174809618, texName: "X5P" })
      .addVariable("R5P", { value: 0.035155825913785584, texName: "R5P" })
      .addVariable("RUBP", { value: 0.11293260727162346, texName: "RUBP" })
      .addVariable("RU5P", { value: 0.014062330254191594, texName: "RU5P" })
      .addVariable("atp", { value: 1.4612747767895344, texName: "atp" })
      .addVariable("fd_ox", { value: 3.715702384326767, texName: "fd\\_ox" })
      .addVariable("protons_lumen", {
        value: 0.002086128887296243,
        texName: "protons\\_lumen",
      })
      .addVariable("lhc", { value: 0.7805901436176024, texName: "lhc" })
      .addVariable("nadph", { value: 0.5578718406315588, texName: "nadph" })
      .addVariable("pc_ox", { value: 1.8083642974980014, texName: "pc\\_ox" })
      .addVariable("pq_ox", { value: 10.251099271612473, texName: "pq\\_ox" })
      .addVariable("psbs_de", {
        value: 0.9667381262477079,
        texName: "psbs\\_de",
      })
      .addVariable("vx", { value: 0.9629870646993118, texName: "vx" })
      .addVariable("MDA", { value: 2.0353396709300447e-7, texName: "MDA" })
      .addVariable("H2O2", { value: 1.2034405327140102e-7, texName: "H2O2" })
      .addVariable("DHA", { value: 1.0296456279861962e-11, texName: "DHA" })
      .addVariable("GSSG", { value: 4.99986167652437e-12, texName: "GSSG" })
      .addVariable("tr_ox", { value: 0.9334426859846461, texName: "tr\\_ox" })
      .addVariable("E_inactive", {
        value: 3.6023635680406634,
        texName: "E\\_inactive",
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
      .addAssignment("zx", {
        fn: new Add([new Name("Carotenoids_tot"), new Minus([new Name("vx")])]),
        texName: "zx",
      })
      .addAssignment("fd_red", {
        fn: new Add([new Name("Fd_"), new Minus([new Name("fd_ox")])]),
        texName: "fd\\_red",
      })
      .addAssignment("pc_red", {
        fn: new Add([new Name("PC_tot"), new Minus([new Name("pc_ox")])]),
        texName: "pc\\_red",
      })
      .addAssignment("psbs_pr", {
        fn: new Add([new Name("PSBS_tot"), new Minus([new Name("psbs_de")])]),
        texName: "psbs\\_pr",
      })
      .addAssignment("lhc_prot", {
        fn: new Add([new Name("LHC_tot"), new Minus([new Name("lhc")])]),
        texName: "lhc\\_prot",
      })
      .addAssignment("Q", {
        fn: new Add([
          new Mul([new Name("gamma0"), new Name("psbs_de"), new Name("vx")]),
          new Mul([new Name("gamma1"), new Name("psbs_pr"), new Name("vx")]),
          new Divide([
            new Mul([new Name("gamma2"), new Name("psbs_pr"), new Name("zx")]),
            new Add([new Name("kZSat"), new Name("zx")]),
          ]),
          new Divide([
            new Mul([new Name("gamma3"), new Name("psbs_de"), new Name("zx")]),
            new Add([new Name("kZSat"), new Name("zx")]),
          ]),
        ]),
        texName: "Q",
      })
      .addAssignment("keq_pq_red", {
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
        texName: "keq\\_pq\\_red",
      })
      .addAssignment("pq_red", {
        fn: new Add([new Name("PQ_tot"), new Minus([new Name("pq_ox")])]),
        texName: "pq\\_red",
      })
      .addAssignment("PSII_cross_section", {
        fn: new Add([
          new Name("staticAntII"),
          new Mul([
            new Name("lhc"),
            new Add([
              new Num(1.0),
              new Minus([new Name("staticAntI")]),
              new Minus([new Name("staticAntII")]),
            ]),
          ]),
        ]),
        texName: "PSII\\_cross\\_section",
      })
      .addAssignment("tr_red", {
        fn: new Add([
          new Name("Thioredoxin_tot"),
          new Minus([new Name("tr_ox")]),
        ]),
        texName: "tr\\_red",
      })
      .addAssignment("E_active", {
        fn: new Add([new Name("E_total"), new Minus([new Name("E_inactive")])]),
        texName: "E\\_active",
      })
      .addAssignment("nadp", {
        fn: new Add([new Name("NADP_"), new Minus([new Name("nadph")])]),
        texName: "nadp",
      })
      .addAssignment("adp", {
        fn: new Add([new Name("A_P"), new Minus([new Name("atp")])]),
        texName: "adp",
      })
      .addAssignment("pi", {
        fn: new Add([
          new Name("Pi_tot"),
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
          new Minus([new Name("atp")]),
          new Minus([new Mul([new Num(2.0), new Name("BPGA")])]),
          new Minus([new Mul([new Num(2.0), new Name("FBP")])]),
          new Minus([new Mul([new Num(2.0), new Name("RUBP")])]),
          new Minus([new Mul([new Num(2.0), new Name("SBP")])]),
        ]),
        texName: "pi",
      })
      .addAssignment("ascorbate", {
        fn: new Add([
          new Name("ASC_tot_"),
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
                new Name("km_N_translocator_pi_ext"),
                new Name("pi_ext"),
              ]),
            ]),
            new Add([
              new Divide([new Name("DHAP"), new Name("km_ex_dhap")]),
              new Divide([new Name("GAP"), new Name("km_ex_gap")]),
              new Divide([new Name("_3PGA"), new Name("km_ex_pga")]),
              new Divide([new Name("pi"), new Name("km_N_translocator_pi")]),
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
      .addAssignment("B0", {
        fn: new Divide([
          new Mul([
            new Name("PSII_total"),
            new Name("kPQred"),
            new Name("keq_pq_red"),
            new Name("pq_ox"),
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
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B1", {
        fn: new Divide([
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("PSII_total"),
            new Name("kPQred"),
            new Name("keq_pq_red"),
            new Name("pq_ox"),
            new Add([
              new Name("kF"),
              new Name("kH0"),
              new Mul([new Name("Q"), new Name("kH")]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B2", {
        fn: new Divide([
          new Mul([
            new Name("PSII_total"),
            new Add([
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("kH0"), new Num(2.0)),
              ]),
              new Mul([
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("k2"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("Q"), new Num(2.0)),
                new Pow(new Name("kH"), new Num(2.0)),
              ]),
              new Mul([
                new Num(2.0),
                new Name("kF"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("kF"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("kH0"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("Q"),
                new Name("k2"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kF"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kH"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("Q"),
                new Name("k2"),
                new Name("kH"),
                new Name("keq_pq_red"),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B3", {
        fn: new Divide([
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("PSII_total"),
            new Add([
              new Mul([new Name("k2"), new Name("kPQred"), new Name("pq_red")]),
              new Mul([new Name("kF"), new Name("kPQred"), new Name("pq_red")]),
              new Mul([
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("Q"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("A0", {
        fn: new Divide([
          new Mul([
            new Name("PSI_total"),
            new Name("kPCox"),
            new Name("keq_PCP700"),
            new Name("keq_ferredoxin_reductase"),
            new Name("pc_red"),
            new Add([
              new Mul([new Name("O2_lumen"), new Name("kMehler")]),
              new Mul([new Name("fd_ox"), new Name("kFdred")]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("fd_red"),
              new Name("kFdred"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("O2_lumen"),
              new Name("kMehler"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("fd_ox"),
              new Name("kFdred"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("O2_lumen"),
              new Name("kMehler"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
              new Add([
                new Num(1.0),
                new Minus([new Name("PSII_cross_section")]),
              ]),
            ]),
            new Mul([
              new Name("fd_ox"),
              new Name("kFdred"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
            ]),
          ]),
        ]),
        texName: "ps1states",
      })
      .addAssignment("A1", {
        fn: new Divide([
          new Mul([
            new Name("PSI_total"),
            new Add([
              new Mul([
                new Name("fd_red"),
                new Name("kFdred"),
                new Add([
                  new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
                new Name("pc_red"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("fd_red"),
              new Name("kFdred"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("O2_lumen"),
              new Name("kMehler"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("fd_ox"),
              new Name("kFdred"),
              new Name("keq_ferredoxin_reductase"),
              new Add([
                new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
              new Name("O2_lumen"),
              new Name("kMehler"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
              new Add([
                new Num(1.0),
                new Minus([new Name("PSII_cross_section")]),
              ]),
            ]),
            new Mul([
              new Name("fd_ox"),
              new Name("kFdred"),
              new Name("kPCox"),
              new Name("keq_PCP700"),
              new Name("keq_ferredoxin_reductase"),
              new Name("pc_red"),
            ]),
          ]),
        ]),
        texName: "ps1states",
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
                    new Name("fd_red"),
                    new Name("kFdred"),
                    new Add([
                      new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                    new Name("kPCox"),
                    new Name("keq_PCP700"),
                    new Name("keq_ferredoxin_reductase"),
                    new Name("pc_red"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                ]),
              ]),
              new Add([
                new Mul([
                  new Name("fd_red"),
                  new Name("kFdred"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("O2_lumen"),
                  new Name("kMehler"),
                  new Name("keq_ferredoxin_reductase"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("fd_ox"),
                  new Name("kFdred"),
                  new Name("keq_ferredoxin_reductase"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("O2_lumen"),
                  new Name("kMehler"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                ]),
                new Mul([
                  new Name("PPFD"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
                new Mul([
                  new Name("fd_ox"),
                  new Name("kFdred"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                ]),
              ]),
            ]),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Name("PSI_total"),
                new Name("kPCox"),
                new Name("keq_PCP700"),
                new Name("keq_ferredoxin_reductase"),
                new Name("pc_red"),
                new Add([
                  new Mul([new Name("O2_lumen"), new Name("kMehler")]),
                  new Mul([new Name("fd_ox"), new Name("kFdred")]),
                ]),
              ]),
              new Add([
                new Mul([
                  new Name("fd_red"),
                  new Name("kFdred"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("O2_lumen"),
                  new Name("kMehler"),
                  new Name("keq_ferredoxin_reductase"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("fd_ox"),
                  new Name("kFdred"),
                  new Name("keq_ferredoxin_reductase"),
                  new Add([
                    new Mul([new Name("kPCox"), new Name("pc_ox")]),
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
                  new Name("O2_lumen"),
                  new Name("kMehler"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                ]),
                new Mul([
                  new Name("PPFD"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
                new Mul([
                  new Name("fd_ox"),
                  new Name("kFdred"),
                  new Name("kPCox"),
                  new Name("keq_PCP700"),
                  new Name("keq_ferredoxin_reductase"),
                  new Name("pc_red"),
                ]),
              ]),
            ]),
          ]),
        ]),
        texName: "ps1states",
      })
      .addReaction("ferredoxin_thioredoxin_reductase", {
        fn: new Mul([
          new Name("fd_red"),
          new Name("kf_ferredoxin_thioredoxin_reductase"),
          new Name("tr_ox"),
        ]),
        stoichiometry: [
          { name: "tr_ox", value: new Num(-1.0) },
          { name: "fd_ox", value: new Num(1.0) },
        ],
        texName: "ferredoxin\\_thioredoxin\\_reductase",
      })
      .addReaction("tr_activation", {
        fn: new Mul([
          new Name("E_inactive"),
          new Name("kf_tr_activation"),
          new Name("tr_red"),
        ]),
        stoichiometry: [
          { name: "E_inactive", value: new Num(-5.0) },
          { name: "tr_ox", value: new Num(5.0) },
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
            new Divide([new Name("adp"), new Name("convf")]),
            new Minus([
              new Divide([
                new Name("atp"),
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
          { name: "atp", value: new Name("convf") },
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
                new Name("pq_red"),
                new Pow(new Name("pc_ox"), new Num(2.0)),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("pq_ox"),
                    new Pow(new Name("pc_red"), new Num(2.0)),
                  ]),
                  new Name("keq_b6f"),
                ]),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "pc_ox", value: new Num(-2.0) },
          { name: "pq_ox", value: new Num(1.0) },
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
            new Name("kf_lhc_protonation"),
            new Name("psbs_de"),
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
        stoichiometry: [{ name: "psbs_de", value: new Num(-1.0) }],
        texName: "lhc\\_protonation",
      })
      .addReaction("lhc_deprotonation", {
        fn: new Mul([new Name("kf_lhc_deprotonation"), new Name("psbs_pr")]),
        stoichiometry: [{ name: "psbs_de", value: new Num(1.0) }],
        texName: "lhc\\_deprotonation",
      })
      .addReaction("cyclic_electron_flow", {
        fn: new Mul([
          new Name("kf_cyclic_electron_flow"),
          new Name("pq_ox"),
          new Pow(new Name("fd_red"), new Num(2.0)),
        ]),
        stoichiometry: [
          { name: "pq_ox", value: new Num(-1.0) },
          { name: "fd_ox", value: new Num(2.0) },
        ],
        texName: "cyclic\\_electron\\_flow",
      })
      .addReaction("violaxanthin_deepoxidase", {
        fn: new Divide([
          new Mul([
            new Name("kf_violaxanthin_deepoxidase"),
            new Name("vx"),
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
        stoichiometry: [{ name: "vx", value: new Num(-1.0) }],
        texName: "violaxanthin\\_deepoxidase",
      })
      .addReaction("zeaxanthin_epoxidase", {
        fn: new Mul([new Name("kf_zeaxanthin_epoxidase"), new Name("zx")]),
        stoichiometry: [{ name: "vx", value: new Num(1.0) }],
        texName: "zeaxanthin\\_epoxidase",
      })
      .addReaction("fnr", {
        fn: new Divide([
          new Mul([
            new Name("vmax_fnr"),
            new Add([
              new Divide([
                new Mul([
                  new Name("nadp"),
                  new Pow(
                    new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
                    new Num(2.0),
                  ),
                ]),
                new Mul([new Name("convf"), new Name("km_fnr_nadp")]),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("nadph"),
                    new Pow(
                      new Divide([
                        new Name("fd_ox"),
                        new Name("km_fnr_fd_red"),
                      ]),
                      new Num(2.0),
                    ),
                  ]),
                  new Mul([
                    new Name("convf"),
                    new Name("keq_fnr"),
                    new Name("km_fnr_nadp"),
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
                  new Name("nadp"),
                  new Mul([new Name("convf"), new Name("km_fnr_nadp")]),
                ]),
              ]),
              new Add([
                new Num(1.0),
                new Pow(
                  new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
                  new Num(2.0),
                ),
                new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
              ]),
            ]),
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("nadph"),
                  new Mul([new Name("convf"), new Name("km_fnr_nadp")]),
                ]),
              ]),
              new Add([
                new Num(1.0),
                new Pow(
                  new Divide([new Name("fd_ox"), new Name("km_fnr_fd_red")]),
                  new Num(2.0),
                ),
                new Divide([new Name("fd_ox"), new Name("km_fnr_fd_red")]),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "fd_ox", value: new Num(2.0) },
          { name: "nadph", value: new Name("convf") },
        ],
        texName: "fnr",
      })
      .addReaction("ndh", {
        fn: new Mul([new Name("kf_ndh"), new Name("pq_ox")]),
        stoichiometry: [{ name: "pq_ox", value: new Num(-1.0) }],
        texName: "ndh",
      })
      .addReaction("PSII", {
        fn: new Mul([new Num(0.5), new Name("B1"), new Name("k2")]),
        stoichiometry: [
          { name: "pq_ox", value: new Num(-1.0) },
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
        stoichiometry: [{ name: "pc_ox", value: new Num(1.0) }],
        texName: "PSI",
      })
      .addReaction("mehler", {
        fn: new Mul([
          new Name("A1"),
          new Name("O2_lumen"),
          new Name("kMehler"),
        ]),
        stoichiometry: [{ name: "H2O2", value: new Name("convf") }],
        texName: "mehler",
      })
      .addReaction("ferredoxin_reductase", {
        fn: new Add([
          new Mul([
            new Name("A1"),
            new Name("fd_ox"),
            new Name("vmax_ferredoxin_reductase"),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Name("A2"),
                new Name("fd_red"),
                new Name("vmax_ferredoxin_reductase"),
              ]),
              new Name("keq_ferredoxin_reductase"),
            ]),
          ]),
        ]),
        stoichiometry: [{ name: "fd_ox", value: new Num(-1.0) }],
        texName: "ferredoxin\\_reductase",
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
          new Name("O2_lumen"),
          new Name("kPTOX"),
          new Name("pq_red"),
        ]),
        stoichiometry: [{ name: "pq_ox", value: new Num(1.0) }],
        texName: "PTOX",
      })
      .addReaction("lhc_state_transition_12", {
        fn: new Divide([
          new Mul([new Num(1.0), new Name("kStt7"), new Name("lhc")]),
          new Add([
            new Num(1.0),
            new Pow(
              new Divide([
                new Name("pq_ox"),
                new Mul([
                  new Name("PQ_tot"),
                  new Name("km_lhc_state_transition_12"),
                ]),
              ]),
              new Name("n_ST"),
            ),
          ]),
        ]),
        stoichiometry: [{ name: "lhc", value: new Num(-1.0) }],
        texName: "lhc\\_state\\_transition\\_12",
      })
      .addReaction("lhc_state_transition_21", {
        fn: new Mul([new Name("kPph1"), new Name("lhc_prot")]),
        stoichiometry: [{ name: "lhc", value: new Num(1.0) }],
        texName: "lhc\\_state\\_transition\\_21",
      })
      .addReaction("rubisco_carboxylase", {
        fn: new Divide([
          new Mul([
            new Name("CO2__dissolved_"),
            new Name("RUBP"),
            new Name("vmax_rubisco_carboxylase"),
          ]),
          new Mul([
            new Add([
              new Name("CO2__dissolved_"),
              new Name("km_rubisco_carboxylase_CO2__dissolved_"),
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
                    new Name("SBP"),
                    new Name("ki_rubisco_carboxylase_SBP"),
                  ]),
                  new Divide([
                    new Name("_3PGA"),
                    new Name("ki_rubisco_carboxylase_3PGA"),
                  ]),
                  new Divide([
                    new Name("nadph"),
                    new Name("ki_rubisco_carboxylase_nadph"),
                  ]),
                  new Divide([
                    new Name("pi"),
                    new Name("ki_rubisco_carboxylase_pi"),
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
            new Mul([new Name("_3PGA"), new Name("atp")]),
            new Minus([
              new Divide([
                new Mul([new Name("BPGA"), new Name("adp")]),
                new Name("keq_phosphoglycerate_kinase"),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "_3PGA", value: new Num(-1.0) },
          { name: "atp", value: new Num(-1.0) },
          { name: "BPGA", value: new Num(1.0) },
        ],
        texName: "phosphoglycerate\\_kinase",
      })
      .addReaction("gadph", {
        fn: new Mul([
          new Name("kre_gadph"),
          new Add([
            new Mul([new Name("BPGA"), new Name("nadph"), new Name("protons")]),
            new Minus([
              new Divide([
                new Mul([new Name("GAP"), new Name("nadp"), new Name("pi")]),
                new Name("keq_gadph"),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "nadph", value: new Num(-1.0) },
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
                new Divide([new Name("pi"), new Name("ki_fbpase_pi")]),
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
                new Divide([new Name("pi"), new Name("ki_SBPase_pi")]),
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
            new Name("RU5P"),
            new Name("atp"),
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
                    new Name("RUBP"),
                    new Name("ki_phosphoribulokinase_RUBP"),
                  ]),
                  new Divide([
                    new Name("_3PGA"),
                    new Name("ki_phosphoribulokinase_3PGA"),
                  ]),
                  new Divide([
                    new Name("pi"),
                    new Name("ki_phosphoribulokinase_pi"),
                  ]),
                ]),
              ]),
            ]),
            new Add([
              new Mul([
                new Name("atp"),
                new Add([
                  new Num(1.0),
                  new Divide([
                    new Name("adp"),
                    new Name("ki_phosphoribulokinase_4"),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("km_phosphoribulokinase_atp"),
                new Add([
                  new Num(1.0),
                  new Divide([
                    new Name("adp"),
                    new Name("ki_phosphoribulokinase_5"),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "RU5P", value: new Num(-1.0) },
          { name: "atp", value: new Num(-1.0) },
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
          new Mul([new Name("G1P"), new Name("atp"), new Name("vmax_ex_g1p")]),
          new Mul([
            new Add([new Name("G1P"), new Name("km_ex_g1p_G1P")]),
            new Add([
              new Mul([
                new Add([
                  new Num(1.0),
                  new Divide([new Name("adp"), new Name("ki_ex_g1p")]),
                ]),
                new Add([new Name("atp"), new Name("km_ex_g1p_atp")]),
              ]),
              new Divide([
                new Mul([new Name("km_ex_g1p_atp"), new Name("pi")]),
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
          { name: "atp", value: new Num(-1.0) },
        ],
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
            new Name("nadph"),
            new Name("vmax_mda_reductase_2"),
          ]),
          new Add([
            new Mul([new Name("MDA"), new Name("km_mda_reductase_2_nadph")]),
            new Mul([new Name("MDA"), new Name("nadph")]),
            new Mul([
              new Name("km_mda_reductase_2_MDA"),
              new Name("km_mda_reductase_2_nadph"),
            ]),
            new Mul([new Name("km_mda_reductase_2_MDA"), new Name("nadph")]),
          ]),
        ]),
        stoichiometry: [
          { name: "nadph", value: new Num(-1.0) },
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
            new Name("nadph"),
            new Name("vmax_glutathion_reductase"),
          ]),
          new Add([
            new Mul([
              new Name("GSSG"),
              new Name("km_glutathion_reductase_nadph"),
            ]),
            new Mul([new Name("GSSG"), new Name("nadph")]),
            new Mul([
              new Name("km_glutathion_reductase_GSSG"),
              new Name("km_glutathion_reductase_nadph"),
            ]),
            new Mul([
              new Name("km_glutathion_reductase_GSSG"),
              new Name("nadph"),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "nadph", value: new Num(-1.0) },
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
        fn: new Mul([new Name("atp"), new Name("kf_ex_atp")]),
        stoichiometry: [{ name: "atp", value: new Num(-1.0) }],
        texName: "ex\\_atp",
      })
      .addReaction("ex_nadph", {
        fn: new Mul([new Name("kf_ex_nadph"), new Name("nadph")]),
        stoichiometry: [{ name: "nadph", value: new Num(-1.0) }],
        texName: "ex\\_nadph",
      });
  }

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Simulation",
      col: 1,
      span: 6,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      method: "Radau",
      nTimePoints: 100,
    },
  ]);
</script>

<AnalysesDashboard
  name={"Model"}
  initModel={initModel}
  bind:analyses={analyses}
></AnalysesDashboard>
