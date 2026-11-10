import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Minus,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Poolman 2000 Calvin-Benson-Bassham cycle model.
 *
 * |             |                                          |
 * | ----------- | ---------------------------------------- |
 * | doi         | 10.1093/jexbot/51.suppl_1.319            |
 * | main author | Mark G. Poolman                          |
 * | paper title | Modelling photosynthesis and its control |
 * | published   | February 2000                            |
 * | journal     | Journal of Experimental Botany           |
 * | organism    | C3 plant (chloroplast)                   |
 * | biomodels   | BIOMD0000000013                          |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )     |
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
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
    .addParameter("NADPH", {
      value: 0.21,
      texName: "NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
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
    .addParameter("A_star_P", {
      value: 0.5,
      displayName: "AP_tot",
      texName: "A*P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("NADP_star", {
      value: 0.5,
      displayName: "NADP_tot",
      texName: "NADP*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Pi_tot", {
      value: 15.0,
      texName: "Pi\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_rubisco_carboxylase", {
      value: 1.0,
      texName: "E0\\_rubisco\\_carboxylase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
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
          { kind: "mole", prefix: "milli", exponent: 1 },
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
          { kind: "mole", prefix: "milli", exponent: 1 },
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
          { kind: "mole", prefix: "milli", exponent: 1 },
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
    .addParameter("E0_ex_g1p", {
      value: 1.0,
      texName: "E0\\_ex\\_g1p",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_ex_g1p", {
      value: 0.32,
      texName: "kcat\\_ex\\_g1p",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_atp_synthase_ADP", {
      value: 0.014,
      texName: "km\\_atp\\_synthase\\_ADP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_atp_synthase_Orthophosphate", {
      value: 0.3,
      texName: "km\\_atp\\_synthase\\_Orthophosphate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_atp_synthase", {
      value: 2.8,
      texName: "kcat\\_atp\\_synthase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("E0_atp_synthase", {
      value: 1.0,
      texName: "E0\\_atp\\_synthase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("_3PGA", {
      value: 0.6387788347932627,
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
      value: 0.0013570885908749779,
      texName: "BPGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("GAP", {
      value: 0.011259431827358068,
      texName: "GAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("DHAP", {
      value: 0.24770748227012374,
      texName: "DHAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("FBP", {
      value: 0.01980222074817044,
      texName: "FBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("F6P", {
      value: 1.093666906864421,
      texName: "F6P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("G6P", {
      value: 2.5154338857582377,
      texName: "G6P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("G1P", {
      value: 0.14589516537322303,
      texName: "G1P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("SBP", {
      value: 0.09132688566151095,
      texName: "SBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("S7P", {
      value: 0.23281380022778891,
      texName: "S7P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("E4P", {
      value: 0.02836065066520614,
      texName: "E4P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("X5P", {
      value: 0.03647242425941113,
      texName: "X5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("R5P", {
      value: 0.06109130988031577,
      texName: "R5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RUBP", {
      value: 0.2672164362349537,
      texName: "RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RU5P", {
      value: 0.0244365238237522,
      texName: "RU5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("ATP", {
      value: 0.43633201706180874,
      texName: "ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ADP", {
      fn: new Add([new Name("A_star_P"), new Minus([new Name("ATP")])]),
      texName: "ADP",
    })
    .addAssignment("NADP", {
      fn: new Add([new Name("NADP_star"), new Minus([new Name("NADPH")])]),
      texName: "NADP",
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
    .addAssignment("vmax_rubisco_carboxylase", {
      fn: new Mul([
        new Name("E0_rubisco_carboxylase"),
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
    .addAssignment("vmax_atp_synthase", {
      fn: new Mul([new Name("E0_atp_synthase"), new Name("kcat_atp_synthase")]),
      texName: "vmax\\_atp\\_synthase",
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
    .addReaction("atp_synthase", {
      fn: new Divide([
        new Mul([
          new Name("ADP"),
          new Name("Orthophosphate"),
          new Name("vmax_atp_synthase"),
        ]),
        new Mul([
          new Add([new Name("ADP"), new Name("km_atp_synthase_ADP")]),
          new Add([
            new Name("Orthophosphate"),
            new Name("km_atp_synthase_Orthophosphate"),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "ATP", value: new Num(1.0) }],
      displayName: "ATP synthase",
      texName: "atp\\_synthase",
    });
}
