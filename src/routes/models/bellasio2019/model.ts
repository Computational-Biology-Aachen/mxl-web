import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Abs,
  Add,
  Divide,
  LessThan,
  Max,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
  Pow,
  Sqrt,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Bellasio 2019 model.
 *
 * |             |                                                                                                                        |
 * | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
 * | doi         | 10.1007/s11120-018-0601-1                                                                                              |
 * | main author | Chandra Bellasio                                                                                                       |
 * | paper title | A generalised dynamic model of leaf-level C3 photosynthesis combining light and dark reactions with stomatal behaviour |
 * | published   | January 2019                                                                                                           |
 * | journal     | Photosynthesis Research                                                                                                |
 * | organism    | C3 leaf                                                                                                                |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                                                   |
 *
 * The [Bellasio2019](https://doi.org/10.1007/s11120-018-0601-1) model is a
 * generalized C3 leaf-photosynthesis model that includes simplified
 * representations of the light and dark reactions and a stomatal behavior
 * submodule. A lot of its implementation is based on past work by the same author
 * and is mainly inspired by the common Farquhar-von Caemmerer-Berry model. The
 * light reactions are modified from Yin et al. (2004) and include the potential
 * rates of ATP and NADPH production based on light intensity. This model has been
 * created with the simple user in mind, and the author has made an effort to show
 * its simplicity by giving access to a Microsoft Excel Workbook containing the
 * entire model. To showcase the model's capabilities, the author creates common
 * steady-state carbon assimilation curves against intercellular CO2 concentration
 * and light intensity, and compares them to experimental data from the
 * literature. As many models of photosynthesis rely on purely stead-state
 * assumptions, this model is also validated in dynamic conditions, showing for
 * example the response of the model to a fluctuation of ambient oxygen
 * concentration.
 *
 * This model was created to stay as simple as possible, while still being able to
 * accurately represent the main features of C<sub>3</sub> photosynthesis. As
 * such, it can be used as a base for more complex models, or as a starting block
 * in larger models of plant physiology. While giving access to the entire model
 * in an Excel Workbook format is transparent and great, the execution of said
 * practice has been inefficient in this instance. The entire mathematical
 * description of the model is also given in the Appendix of the publication,
 * however there are missing or different equations between the publication and
 * the Excel Workbook, which can lead to confusion. On top of that, the simulation
 * protocols used for each figure are only given in small details, which leads to
 * further confusion when trying to reproduce the results and see which equations
 * are correct or not.
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("AP_tot", {
      value: 1.5,
      texName: "AP\\_tot",
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
    .addParameter("p_o2", {
      value: 210000.0,
      texName: "p\\_o2",
      unit: Unit.fromJson({
        factors: [{ kind: "bar", prefix: "micro", exponent: 1 }],
      }),
    })
    .addParameter("Kh_o2", {
      value: 833300.0,
      texName: "Kh\\_o2",
      unit: Unit.fromJson({
        factors: [
          { kind: "bar", prefix: "micro", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "litre", exponent: 1 },
        ],
      }),
    })
    .addParameter("V_m", {
      value: 0.03,
      texName: "V\\_m",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("PPFD", {
      value: 1500.0,
      texName: "PPFD",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "100",
        max: "2000",
        step: "10",
      },
    })
    .addParameter("RLight", {
      value: 0.001,
      texName: "RLight",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("s", {
      value: 0.43,
      texName: "s",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PhiPSII_LL", {
      value: 0.72,
      texName: "PhiPSII\\_LL",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PhiPSI_LL", {
      value: 1.0,
      texName: "PhiPSI\\_LL",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("alpha_ppfd_PhiPSII", {
      value: 0.00125,
      texName: "alpha\\_ppfd\\_PhiPSII",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "second", exponent: 1 },
          { kind: "mole", prefix: "micro", exponent: -1 },
        ],
      }),
    })
    .addParameter("V0_ppfd_PhiPSII", {
      value: -0.8,
      texName: "V0\\_ppfd\\_PhiPSII",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("theta_ppfd_PhiPSII", {
      value: 0.7,
      texName: "theta\\_ppfd\\_PhiPSII",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("f_pseudocycNR", {
      value: 0.01,
      texName: "f\\_pseudocycNR",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("fq", {
      value: 1.0,
      texName: "fq",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("f_ndh", {
      value: 0.0,
      texName: "f\\_ndh",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("h", {
      value: 4.0,
      texName: "h",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("Ca", {
      value: 350.0,
      texName: "Ca",
      unit: Unit.fromJson({
        factors: [{ kind: "bar", prefix: "micro", exponent: 1 }],
      }),
    })
    .addParameter("alpha_ppfd_rub", {
      value: 0.0018,
      texName: "alpha\\_ppfd\\_rub",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "second", exponent: 1 },
          { kind: "mole", prefix: "micro", exponent: -1 },
        ],
      }),
    })
    .addParameter("V0_ppfd_rub", {
      value: 0.16,
      texName: "V0\\_ppfd\\_rub",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("theta_ppfd_rub", {
      value: 0.95,
      texName: "theta\\_ppfd\\_rub",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("alpha_co2", {
      value: 400.0,
      texName: "alpha\\_co2",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("V0_co2", {
      value: -0.2,
      texName: "V0\\_co2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("theta_co2", {
      value: 0.98,
      texName: "theta\\_co2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("tau_i", {
      value: 360.0,
      texName: "tau\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("tau_d", {
      value: 1200.0,
      texName: "tau\\_d",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("km_v_RuBisCO_c_CO2", {
      value: 0.014,
      displayName: "km_rubisco_carboxylase_CO2",
      texName: "km\\_v\\_RuBisCO\\_c\\_CO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_RuBisCO_c_RUBP", {
      value: 0.02,
      displayName: "km_rubisco_carboxylase_RUBP",
      texName: "km\\_v\\_RuBisCO\\_c\\_RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_RuBisCO_c_O2", {
      value: 0.222,
      texName: "km\\_v\\_RuBisCO\\_c\\_O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_RuBisCO_c_PGA", {
      value: 2.52,
      displayName: "ki_rubisco_carboxylase_3PGA",
      texName: "ki\\_v\\_RuBisCO\\_c\\_PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_RuBisCO_c_NADP_st", {
      value: 0.21,
      texName: "ki\\_v\\_RuBisCO\\_c\\_NADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_RuBisCO_c_ADP_st", {
      value: 0.2,
      texName: "ki\\_v\\_RuBisCO\\_c\\_ADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_RuBisCO_c_Pi_st", {
      value: 3.6,
      displayName: "ki_rubisco_carboxylase_Pi",
      texName: "ki\\_v\\_RuBisCO\\_c\\_Pi\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_RuBisCO_c", {
      value: 0.2,
      displayName: "vmax_rubisco_carboxylase",
      texName: "vmax\\_v\\_RuBisCO\\_c",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_v_RuBisCO_c", {
      value: 4.7,
      displayName: "kcat_rubisco_carboxylase",
      texName: "kcat\\_v\\_RuBisCO\\_c",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("S_co_gas", {
      value: 2200.0,
      texName: "S\\_co\\_gas",
      unit: Unit.fromJson({
        factors: [
          { kind: "bar", exponent: 1 },
          { kind: "bar", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_PRKase", {
      value: 1.17,
      displayName: "vmax_phosphoribulokinase",
      texName: "vmax\\_v\\_PRKase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_v_PRKase", {
      value: 6846.0,
      texName: "keq\\_v\\_PRKase",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_PRKase_ATP_st", {
      value: 0.625,
      displayName: "km_phosphoribulokinase_ATP",
      texName: "km\\_v\\_PRKase\\_ATP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_PRKase_ADP_st", {
      value: 0.1,
      texName: "ki\\_v\\_PRKase\\_ADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_PRKase_RU5P", {
      value: 0.034,
      displayName: "km_phosphoribulokinase_RU5P",
      texName: "km\\_v\\_PRKase\\_RU5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_PRKase_PGA", {
      value: 2.0,
      displayName: "ki_phosphoribulokinase_3PGA",
      texName: "ki\\_v\\_PRKase\\_PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_PRKase_RUBP", {
      value: 0.7,
      displayName: "ki_phosphoribulokinase_RUBP",
      texName: "ki\\_v\\_PRKase\\_RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_PRKase_Pi_st", {
      value: 4.0,
      displayName: "ki_phosphoribulokinase_Pi",
      texName: "ki\\_v\\_PRKase\\_Pi\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_pgareduction", {
      value: 0.4,
      texName: "vmax\\_v\\_pgareduction",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_pgareduction_ATP_st", {
      value: 0.3,
      texName: "km\\_v\\_pgareduction\\_ATP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_pgareduction_PGA", {
      value: 10.0,
      texName: "km\\_v\\_pgareduction\\_PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_pgareduction_NADPH_st", {
      value: 0.05,
      texName: "km\\_v\\_pgareduction\\_NADPH\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_pgareduction_ADP_st", {
      value: 0.89,
      texName: "ki\\_v\\_pgareduction\\_ADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_carbohydrate_synthesis", {
      value: 0.2235,
      texName: "vmax\\_v\\_carbohydrate\\_synthesis",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_v_carbohydrate_synthesis", {
      value: 0.8,
      texName: "keq\\_v\\_carbohydrate\\_synthesis",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 2 },
          { kind: "litre", exponent: -1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_carbohydrate_synthesis_DHAP", {
      value: 22.0,
      texName: "km\\_v\\_carbohydrate\\_synthesis\\_DHAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ki_v_carbohydrate_synthesis_ADP_st", {
      value: 1.0,
      texName: "ki\\_v\\_carbohydrate\\_synthesis\\_ADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_rpp", {
      value: 0.0585,
      texName: "vmax\\_v\\_rpp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_v_rpp", {
      value: 0.06,
      texName: "keq\\_v\\_rpp",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("km_v_rpp_DHAP", {
      value: 0.5,
      texName: "km\\_v\\_rpp\\_DHAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("H", {
      value: 5.012e-5,
      texName: "H",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("vmax_v_co2_hydration", {
      value: 200.0,
      texName: "vmax\\_v\\_co2\\_hydration",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_v_co2_hydration", {
      value: 0.00056,
      texName: "keq\\_v\\_co2\\_hydration",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_co2_hydration_CO2", {
      value: 2.8,
      texName: "km\\_v\\_co2\\_hydration\\_CO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_co2_hydration_HCO3", {
      value: 34.0,
      texName: "km\\_v\\_co2\\_hydration\\_HCO3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("keq_v_FNR", {
      value: 502.0,
      texName: "keq\\_v\\_FNR",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_FNR_NADP_st", {
      value: 0.0072,
      displayName: "km_fnr_NADP",
      texName: "km\\_v\\_FNR\\_NADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_FNR_NADPH_st", {
      value: 0.036,
      texName: "km\\_v\\_FNR\\_NADPH\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Kj_NADPH", {
      value: 200.0,
      texName: "Kj\\_NADPH",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("keq_v_ATPsynth", {
      value: 5734.0,
      displayName: "keq_atp_synthase",
      texName: "keq\\_v\\_ATPsynth",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_ATPsynth_ADP_st", {
      value: 0.014,
      texName: "km\\_v\\_ATPsynth\\_ADP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_ATPsynth_Pi_st", {
      value: 0.3,
      texName: "km\\_v\\_ATPsynth\\_Pi\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_v_ATPsynth_ATP_st", {
      value: 0.3,
      texName: "km\\_v\\_ATPsynth\\_ATP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Kj_ATP", {
      value: 200.0,
      texName: "Kj\\_ATP",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("gm", {
      value: 0.5,
      texName: "gm",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("Kh_co2", {
      value: 30303.0303030303,
      texName: "Kh\\_co2",
      unit: Unit.fromJson({
        factors: [
          { kind: "bar", prefix: "micro", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "litre", exponent: 1 },
        ],
      }),
    })
    .addParameter("Kd", {
      value: 150.0,
      texName: "Kd",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("Ki", {
      value: 900.0,
      texName: "Ki",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("tau0", {
      value: -0.1,
      texName: "tau0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("chi_beta", {
      value: 0.5,
      texName: "chi\\_beta",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "pascal", prefix: "mega", exponent: -1 },
        ],
      }),
    })
    .addParameter("phi", {
      value: 0.0,
      texName: "phi",
      unit: Unit.fromJson({
        factors: [{ kind: "pascal", prefix: "mega", exponent: 1 }],
      }),
    })
    .addParameter("pi_e", {
      value: 1.2,
      texName: "pi\\_e",
      unit: Unit.fromJson({
        factors: [{ kind: "pascal", prefix: "mega", exponent: 1 }],
      }),
    })
    .addParameter("Kh", {
      value: 12.0,
      texName: "Kh",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
          { kind: "pascal", prefix: "mega", exponent: -1 },
        ],
      }),
    })
    .addParameter("Ds", {
      value: 10.0,
      texName: "Ds",
      unit: Unit.fromJson({ factors: [], multiplier: 0.001 }),
    })
    .addParameter("gs0", {
      value: 0.01,
      texName: "gs0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("NADP_tot", {
      value: 0.5,
      texName: "NADP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("CO2", {
      value: new Divide([
        new Mul([new Num(0.3), new Name("Ca")]),
        new Name("Kh_co2"),
      ]),
      texName: "CO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("HCO3", {
      value: 0.1327,
      texName: "HCO3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RUBP", {
      value: 2.0,
      texName: "RUBP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("PGA", {
      value: 4.0,
      texName: "PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("DHAP", {
      value: 4.0,
      texName: "DHAP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("ATP_st", {
      value: 0.68,
      displayName: "ATP",
      texName: "ATP\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("NADPH_st", {
      value: 0.21,
      displayName: "NADPH",
      texName: "NADPH\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("RU5P", {
      value: 0.34,
      texName: "RU5P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ract", {
      value: 1.0,
      texName: "Ract",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("J_NADPH", {
      value: 0.1,
      texName: "J\\_NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addVariable("J_ATP", {
      value: 0.16,
      texName: "J\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ci", {
      value: new Mul([new Num(0.65), new Name("Ca")]),
      texName: "Ci",
      unit: Unit.fromJson({
        factors: [{ kind: "bar", prefix: "micro", exponent: 1 }],
      }),
    })
    .addVariable("gs", {
      value: 0.334934046786077,
      texName: "gs",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ADP_st", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("ATP_st")])]),
      displayName: "ADP",
      texName: "ADP\\_st",
    })
    .addAssignment("NADP_st", {
      fn: new Add([new Name("NADP_tot"), new Minus([new Name("NADPH_st")])]),
      displayName: "NADP",
      texName: "NADP\\_st",
    })
    .addAssignment("Pi_st", {
      fn: new Add([
        new Name("Pi_tot"),
        new Minus([new Name("ATP_st")]),
        new Minus([new Name("DHAP")]),
        new Minus([new Name("PGA")]),
        new Minus([new Name("RU5P")]),
        new Minus([new Mul([new Num(2.0), new Name("RUBP")])]),
      ]),
      texName: "Pi\\_st",
    })
    .addAssignment("Et", {
      fn: new Divide([
        new Name("vmax_v_RuBisCO_c"),
        new Mul([new Name("V_m"), new Name("kcat_v_RuBisCO_c")]),
      ]),
      texName: "Et",
    })
    .addAssignment("km_v_RuBisCO_c_RUBP_extra", {
      fn: new Mul([
        new Name("km_v_RuBisCO_c_RUBP"),
        new Add([
          new Num(1.0),
          new Divide([new Name("ADP_st"), new Name("ki_v_RuBisCO_c_ADP_st")]),
          new Divide([new Name("NADP_st"), new Name("ki_v_RuBisCO_c_NADP_st")]),
          new Divide([new Name("PGA"), new Name("ki_v_RuBisCO_c_PGA")]),
          new Divide([new Name("Pi_st"), new Name("ki_v_RuBisCO_c_Pi_st")]),
        ]),
      ]),
      texName: "km\\_v\\_RuBisCO\\_c\\_RUBP\\_extra",
    })
    .addAssignment("f_rubp", {
      fn: new Divide([
        new Add([
          new Mul([new Num(0.5), new Name("Et")]),
          new Mul([new Num(0.5), new Name("RUBP")]),
          new Mul([new Num(0.5), new Name("km_v_RuBisCO_c_RUBP_extra")]),
          new Minus([
            new Mul([
              new Num(0.5),
              new Sqrt(
                new Add([
                  new Pow(
                    new Add([
                      new Name("Et"),
                      new Name("RUBP"),
                      new Name("km_v_RuBisCO_c_RUBP_extra"),
                    ]),
                    new Num(2.0),
                  ),
                  new Minus([
                    new Mul([new Num(4.0), new Name("Et"), new Name("RUBP")]),
                  ]),
                ]),
                new Num(2),
              ),
            ]),
          ]),
        ]),
        new Name("Et"),
      ]),
      texName: "f\\_rubp",
    })
    .addAssignment("O2", {
      fn: new Divide([new Name("p_o2"), new Name("Kh_o2")]),
      texName: "O2",
    })
    .addAssignment("Ract_eq", {
      fn: new Mul([
        new Add([
          new Name("V0_co2"),
          new Divide([
            new Add([
              new Num(0.5),
              new Minus([new Mul([new Num(0.5), new Name("V0_co2")])]),
              new Mul([new Num(0.5), new Name("CO2"), new Name("alpha_co2")]),
            ]),
            new Name("theta_co2"),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Num(0.5),
                new Sqrt(
                  new Add([
                    new Pow(
                      new Add([
                        new Num(1.0),
                        new Minus([new Name("V0_co2")]),
                        new Mul([new Name("CO2"), new Name("alpha_co2")]),
                      ]),
                      new Num(2.0),
                    ),
                    new Minus([
                      new Mul([
                        new Num(4.0),
                        new Name("CO2"),
                        new Name("alpha_co2"),
                        new Name("theta_co2"),
                        new Add([
                          new Num(1.0),
                          new Minus([new Name("V0_co2")]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new Num(2),
                ),
              ]),
              new Name("theta_co2"),
            ]),
          ]),
        ]),
        new Add([
          new Name("V0_ppfd_rub"),
          new Divide([
            new Add([
              new Num(0.5),
              new Minus([new Mul([new Num(0.5), new Name("V0_ppfd_rub")])]),
              new Mul([
                new Num(0.5),
                new Name("PPFD"),
                new Name("alpha_ppfd_rub"),
              ]),
            ]),
            new Name("theta_ppfd_rub"),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Num(0.5),
                new Sqrt(
                  new Add([
                    new Pow(
                      new Add([
                        new Num(1.0),
                        new Minus([new Name("V0_ppfd_rub")]),
                        new Mul([new Name("PPFD"), new Name("alpha_ppfd_rub")]),
                      ]),
                      new Num(2.0),
                    ),
                    new Minus([
                      new Mul([
                        new Num(4.0),
                        new Name("PPFD"),
                        new Name("alpha_ppfd_rub"),
                        new Name("theta_ppfd_rub"),
                        new Add([
                          new Num(1.0),
                          new Minus([new Name("V0_ppfd_rub")]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new Num(2),
                ),
              ]),
              new Name("theta_ppfd_rub"),
            ]),
          ]),
        ]),
      ]),
      texName: "Ract\\_eq",
    })
    .addAssignment("I2_0", {
      fn: new Mul([new Name("PPFD"), new Name("s")]),
      texName: "I2\\_0",
    })
    .addAssignment("I1_0", {
      fn: new Divide([
        new Mul([new Name("I2_0"), new Name("PhiPSII_LL")]),
        new Name("PhiPSI_LL"),
      ]),
      texName: "I1\\_0",
    })
    .addAssignment("chi", {
      fn: new Divide([
        new Name("f_cyc"),
        new Add([new Num(1.0), new Name("PhiPSII_LL"), new Name("f_cyc")]),
      ]),
      texName: "chi",
    })
    .addAssignment("I1", {
      fn: new Mul([new Name("I1_0"), new Add([new Num(1.0), new Name("chi")])]),
      texName: "I1",
    })
    .addAssignment("f_cyc", {
      fn: new Max([
        new Num(0.0),
        new Add([
          new Num(-1.0),
          new Pow(
            new Num(15.0),
            new Add([
              new Divide([new Name("v_ATPsynth"), new Name("J_ATP")]),
              new Minus([new Divide([new Name("v_FNR"), new Name("J_NADPH")])]),
            ]),
          ),
        ]),
      ]),
      texName: "f\\_cyc",
    })
    .addAssignment("I2", {
      fn: new Mul([
        new Name("I2_0"),
        new Name("PhiPSII_LL"),
        new Add([
          new Minus([new Name("chi")]),
          new Divide([new Num(1.0), new Name("PhiPSII_LL")]),
        ]),
      ]),
      texName: "I2",
    })
    .addAssignment("PhiPSII", {
      fn: new Divide([
        new Mul([
          new Name("PhiPSII_LL"),
          new Name("v_ATPsynth"),
          new Name("v_FNR"),
          new Add([
            new Num(1.0),
            new Minus([
              new Max([
                new Num(0.0),
                new Add([
                  new Name("V0_ppfd_PhiPSII"),
                  new Divide([
                    new Add([
                      new Num(0.5),
                      new Minus([
                        new Mul([new Num(0.5), new Name("V0_ppfd_PhiPSII")]),
                      ]),
                      new Mul([
                        new Num(0.5),
                        new Name("PPFD"),
                        new Name("alpha_ppfd_PhiPSII"),
                      ]),
                    ]),
                    new Name("theta_ppfd_PhiPSII"),
                  ]),
                  new Minus([
                    new Divide([
                      new Mul([
                        new Num(0.5),
                        new Sqrt(
                          new Add([
                            new Pow(
                              new Add([
                                new Num(1.0),
                                new Minus([new Name("V0_ppfd_PhiPSII")]),
                                new Mul([
                                  new Name("PPFD"),
                                  new Name("alpha_ppfd_PhiPSII"),
                                ]),
                              ]),
                              new Num(2.0),
                            ),
                            new Minus([
                              new Mul([
                                new Num(4.0),
                                new Name("PPFD"),
                                new Name("alpha_ppfd_PhiPSII"),
                                new Name("theta_ppfd_PhiPSII"),
                                new Add([
                                  new Num(1.0),
                                  new Minus([new Name("V0_ppfd_PhiPSII")]),
                                ]),
                              ]),
                            ]),
                          ]),
                          new Num(2),
                        ),
                      ]),
                      new Name("theta_ppfd_PhiPSII"),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Mul([new Name("J_ATP"), new Name("J_NADPH")]),
      ]),
      texName: "PhiPSII",
    })
    .addAssignment("J2", {
      fn: new Mul([new Name("I2"), new Name("PhiPSII")]),
      texName: "J2",
    })
    .addAssignment("J1", {
      fn: new Add([
        new Minus([new Name("f_cyc")]),
        new Mul([new Num(1.0), new Name("J2")]),
      ]),
      texName: "J1",
    })
    .addAssignment("f_pseudocyc", {
      fn: new Add([
        new Name("f_pseudocycNR"),
        new Mul([
          new Num(4.0),
          new Name("O2"),
          new Add([
            new Num(1.0),
            new Minus([new Divide([new Name("v_FNR"), new Name("J_NADPH")])]),
          ]),
        ]),
      ]),
      texName: "f\\_pseudocyc",
    })
    .addAssignment("J_NADPH_steady", {
      fn: new Mul([
        new Num(0.0005),
        new Name("J1"),
        new Add([
          new Num(1.0),
          new Minus([new Name("f_cyc")]),
          new Minus([new Name("f_pseudocyc")]),
        ]),
      ]),
      texName: "J\\_NADPH\\_steady",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("J_ATP_steady", {
      fn: new Divide([
        new Add([
          new Mul([new Num(0.001), new Name("J2")]),
          new Mul([
            new Num(0.001),
            new Name("J1"),
            new Add([new Num(1.0), new Minus([new Name("fq")])]),
          ]),
          new Mul([new Num(0.002), new Name("J1"), new Name("fq")]),
          new Mul([
            new Num(0.002),
            new Name("J1"),
            new Name("f_cyc"),
            new Name("f_ndh"),
          ]),
        ]),
        new Name("h"),
      ]),
      texName: "J\\_ATP\\_steady",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("gs_steady", {
      fn: new Max([
        new Name("gs0"),
        new Divide([
          new Mul([
            new Name("chi_beta"),
            new Add([new Name("f_rubp"), new Name("tau0")]),
            new Add([new Name("phi"), new Name("pi_e")]),
          ]),
          new Add([
            new Num(1.0),
            new Divide([
              new Mul([
                new Num(1.0),
                new Name("Ds"),
                new Name("chi_beta"),
                new Add([new Name("f_rubp"), new Name("tau0")]),
              ]),
              new Name("Kh"),
            ]),
          ]),
        ]),
      ]),
      texName: "gs\\_steady",
    })
    .addAssignment("A", {
      fn: new Add([
        new Name("v_RuBisCO_c"),
        new Minus([new Name("RLight")]),
        new Minus([new Mul([new Num(0.5), new Name("rubisco_oxygenase")])]),
      ]),
      texName: "A",
    })
    .addReaction("Ract_rate", {
      fn: new Piecewise([
        new Divide([
          new Add([new Name("Ract_eq"), new Minus([new Name("Ract")])]),
          new Name("tau_i"),
        ]),
        new LessThan([new Name("Ract"), new Name("Ract_eq")]),
        new Divide([
          new Add([new Name("Ract_eq"), new Minus([new Name("Ract")])]),
          new Name("tau_d"),
        ]),
      ]),
      stoichiometry: [{ name: "Ract", value: new Num(1.0) }],
      texName: "Ract\\_rate",
    })
    .addReaction("v_J_NADPH", {
      fn: new Piecewise([
        new Divide([
          new Add([
            new Name("J_NADPH_steady"),
            new Minus([new Name("J_NADPH")]),
          ]),
          new Name("Kj_NADPH"),
        ]),
        new LessThan([new Name("J_NADPH"), new Name("J_NADPH_steady")]),
        new Divide([
          new Add([
            new Mul([new Num(10.0), new Name("J_NADPH_steady")]),
            new Minus([new Mul([new Num(10.0), new Name("J_NADPH")])]),
          ]),
          new Name("Kj_NADPH"),
        ]),
      ]),
      stoichiometry: [{ name: "J_NADPH", value: new Num(1.0) }],
      texName: "v\\_J\\_NADPH",
    })
    .addReaction("v_J_ATP", {
      fn: new Piecewise([
        new Divide([
          new Add([new Name("J_ATP_steady"), new Minus([new Name("J_ATP")])]),
          new Name("Kj_ATP"),
        ]),
        new LessThan([new Name("J_ATP"), new Name("J_ATP_steady")]),
        new Divide([
          new Add([
            new Mul([new Num(10.0), new Name("J_ATP_steady")]),
            new Minus([new Mul([new Num(10.0), new Name("J_ATP")])]),
          ]),
          new Name("Kj_ATP"),
        ]),
      ]),
      stoichiometry: [{ name: "J_ATP", value: new Num(1.0) }],
      texName: "v\\_J\\_ATP",
    })
    .addReaction("v_gs", {
      fn: new Piecewise([
        new Divide([
          new Add([new Name("gs_steady"), new Minus([new Name("gs")])]),
          new Name("Ki"),
        ]),
        new LessThan([new Name("gs"), new Name("gs_steady")]),
        new Divide([
          new Add([new Name("gs_steady"), new Minus([new Name("gs")])]),
          new Name("Kd"),
        ]),
      ]),
      stoichiometry: [{ name: "gs", value: new Num(1.0) }],
      texName: "v\\_gs",
    })
    .addReaction("v_RuBisCO_c", {
      fn: new Divide([
        new Mul([
          new Name("CO2"),
          new Name("RUBP"),
          new Name("Ract"),
          new Name("f_rubp"),
          new Name("vmax_v_RuBisCO_c"),
        ]),
        new Mul([
          new Add([
            new Name("CO2"),
            new Mul([
              new Name("km_v_RuBisCO_c_CO2"),
              new Add([
                new Num(1.0),
                new Divide([new Name("O2"), new Name("km_v_RuBisCO_c_O2")]),
              ]),
            ]),
          ]),
          new Add([new Name("RUBP"), new Name("km_v_RuBisCO_c_RUBP_extra")]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "CO2",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        {
          name: "RUBP",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        { name: "PGA", value: new Divide([new Num(2.0), new Name("V_m")]) },
      ],
      displayName: "rubisco carboxylase",
      texName: "v\\_RuBisCO\\_c",
    })
    .addReaction("rubisco_oxygenase", {
      fn: new Divide([
        new Mul([
          new Num(1.0),
          new Name("Kh_o2"),
          new Name("O2"),
          new Name("v_RuBisCO_c"),
        ]),
        new Mul([new Name("CO2"), new Name("Kh_co2"), new Name("S_co_gas")]),
      ]),
      stoichiometry: [
        {
          name: "RUBP",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        { name: "PGA", value: new Divide([new Num(1.0), new Name("V_m")]) },
        {
          name: "ATP_st",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        {
          name: "NADPH_st",
          value: new Minus([new Divide([new Num(0.5), new Name("V_m")])]),
        },
      ],
      texName: "rubisco\\_oxygenase",
    })
    .addReaction("glycine_decarboxylase", {
      fn: new Name("rubisco_oxygenase"),
      stoichiometry: [
        { name: "CO2", value: new Divide([new Num(0.5), new Name("V_m")]) },
        { name: "PGA", value: new Divide([new Num(0.5), new Name("V_m")]) },
      ],
      displayName: "glycine decarboxylase",
      texName: "glycine\\_decarboxylase",
    })
    .addReaction("v_PRKase", {
      fn: new Divide([
        new Mul([
          new Name("vmax_v_PRKase"),
          new Add([
            new Mul([new Name("ATP_st"), new Name("RU5P")]),
            new Minus([
              new Divide([
                new Mul([new Name("ADP_st"), new Name("RUBP")]),
                new Name("keq_v_PRKase"),
              ]),
            ]),
          ]),
        ]),
        new Mul([
          new Add([
            new Name("ATP_st"),
            new Mul([
              new Name("km_v_PRKase_ATP_st"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP_st"),
                  new Name("ki_v_PRKase_ADP_st"),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Name("RU5P"),
            new Mul([
              new Name("km_v_PRKase_RU5P"),
              new Add([
                new Num(1.0),
                new Divide([new Name("PGA"), new Name("ki_v_PRKase_PGA")]),
                new Divide([new Name("Pi_st"), new Name("ki_v_PRKase_Pi_st")]),
                new Divide([new Name("RUBP"), new Name("ki_v_PRKase_RUBP")]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "RUBP", value: new Divide([new Num(1.0), new Name("V_m")]) },
        {
          name: "DHAP",
          value: new Minus([
            new Divide([new Num(1.6666666666666667), new Name("V_m")]),
          ]),
        },
        {
          name: "ATP_st",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        {
          name: "RU5P",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
      ],
      displayName: "phosphoribulokinase",
      texName: "v\\_PRKase",
    })
    .addReaction("v_pgareduction", {
      fn: new Divide([
        new Mul([
          new Name("ATP_st"),
          new Name("NADPH_st"),
          new Name("PGA"),
          new Name("vmax_v_pgareduction"),
        ]),
        new Mul([
          new Add([
            new Name("ATP_st"),
            new Mul([
              new Name("km_v_pgareduction_ATP_st"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP_st"),
                  new Name("ki_v_pgareduction_ADP_st"),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Name("NADPH_st"),
            new Mul([
              new Name("km_v_pgareduction_NADPH_st"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP_st"),
                  new Name("ki_v_pgareduction_ADP_st"),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Name("PGA"),
            new Mul([
              new Name("km_v_pgareduction_PGA"),
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("ADP_st"),
                  new Name("ki_v_pgareduction_ADP_st"),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "PGA",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        { name: "DHAP", value: new Divide([new Num(1.0), new Name("V_m")]) },
        {
          name: "ATP_st",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        {
          name: "NADPH_st",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
      ],
      texName: "v\\_pgareduction",
    })
    .addReaction("v_carbohydrate_synthesis", {
      fn: new Divide([
        new Mul([
          new Name("vmax_v_carbohydrate_synthesis"),
          new Add([
            new Num(1.0),
            new Minus([
              new Divide([
                new Mul([
                  new Name("Pi_st"),
                  new Abs(new Name("v_pgareduction")),
                ]),
                new Name("keq_v_carbohydrate_synthesis"),
              ]),
            ]),
          ]),
          new Add([new Num(-0.4), new Name("DHAP")]),
        ]),
        new Add([
          new Name("DHAP"),
          new Mul([
            new Name("km_v_carbohydrate_synthesis_DHAP"),
            new Add([
              new Num(1.0),
              new Divide([
                new Name("ADP_st"),
                new Name("ki_v_carbohydrate_synthesis_ADP_st"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "DHAP",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        {
          name: "ATP_st",
          value: new Minus([new Divide([new Num(0.5), new Name("V_m")])]),
        },
      ],
      texName: "v\\_carbohydrate\\_synthesis",
    })
    .addReaction("v_rpp", {
      fn: new Divide([
        new Mul([
          new Name("vmax_v_rpp"),
          new Add([
            new Name("DHAP"),
            new Minus([new Divide([new Name("RU5P"), new Name("keq_v_rpp")])]),
          ]),
        ]),
        new Add([new Name("DHAP"), new Name("km_v_rpp_DHAP")]),
      ]),
      stoichiometry: [
        { name: "RU5P", value: new Divide([new Num(1.0), new Name("V_m")]) },
      ],
      texName: "v\\_rpp",
    })
    .addReaction("v_co2_hydration", {
      fn: new Divide([
        new Mul([
          new Name("vmax_v_co2_hydration"),
          new Add([
            new Name("CO2"),
            new Minus([
              new Divide([
                new Mul([new Name("H"), new Name("HCO3")]),
                new Name("keq_v_co2_hydration"),
              ]),
            ]),
          ]),
        ]),
        new Mul([
          new Name("km_v_co2_hydration_CO2"),
          new Add([
            new Num(1.0),
            new Divide([new Name("CO2"), new Name("km_v_co2_hydration_CO2")]),
            new Divide([new Name("HCO3"), new Name("km_v_co2_hydration_HCO3")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "CO2",
          value: new Minus([new Divide([new Num(1.0), new Name("V_m")])]),
        },
        { name: "HCO3", value: new Divide([new Num(1.0), new Name("V_m")]) },
      ],
      texName: "v\\_co2\\_hydration",
    })
    .addReaction("v_RLight", {
      fn: new Name("RLight"),
      stoichiometry: [
        { name: "CO2", value: new Divide([new Num(1.0), new Name("V_m")]) },
        {
          name: "PGA",
          value: new Minus([
            new Divide([new Num(0.3333333333333333), new Name("V_m")]),
          ]),
        },
      ],
      texName: "v\\_RLight",
    })
    .addReaction("v_FNR", {
      fn: new Divide([
        new Mul([
          new Name("J_NADPH"),
          new Add([
            new Name("NADP_st"),
            new Minus([
              new Divide([new Name("NADPH_st"), new Name("keq_v_FNR")]),
            ]),
          ]),
        ]),
        new Mul([
          new Name("km_v_FNR_NADP_st"),
          new Add([
            new Num(1.0),
            new Divide([new Name("NADPH_st"), new Name("km_v_FNR_NADPH_st")]),
            new Divide([new Name("NADP_st"), new Name("km_v_FNR_NADP_st")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "NADPH_st",
          value: new Divide([new Num(1.0), new Name("V_m")]),
        },
      ],
      displayName: "FNR",
      texName: "v\\_FNR",
    })
    .addReaction("v_ATPsynth", {
      fn: new Divide([
        new Mul([
          new Name("J_ATP"),
          new Add([
            new Mul([new Name("ADP_st"), new Name("Pi_st")]),
            new Minus([
              new Divide([new Name("ATP_st"), new Name("keq_v_ATPsynth")]),
            ]),
          ]),
        ]),
        new Mul([
          new Name("km_v_ATPsynth_ADP_st"),
          new Name("km_v_ATPsynth_Pi_st"),
          new Add([
            new Num(1.0),
            new Divide([new Name("ADP_st"), new Name("km_v_ATPsynth_ADP_st")]),
            new Divide([new Name("ATP_st"), new Name("km_v_ATPsynth_ATP_st")]),
            new Divide([new Name("Pi_st"), new Name("km_v_ATPsynth_Pi_st")]),
            new Divide([
              new Mul([new Name("ADP_st"), new Name("Pi_st")]),
              new Mul([
                new Name("km_v_ATPsynth_ADP_st"),
                new Name("km_v_ATPsynth_Pi_st"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "ATP_st", value: new Divide([new Num(1.0), new Name("V_m")]) },
      ],
      displayName: "ATP synthase",
      texName: "v\\_ATPsynth",
    })
    .addReaction("CO2_dissolution", {
      fn: new Mul([
        new Num(0.001),
        new Name("gm"),
        new Add([
          new Name("Ci"),
          new Minus([new Mul([new Name("CO2"), new Name("Kh_co2")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ci", value: new Num(-1.0) },
        { name: "CO2", value: new Divide([new Num(1.0), new Name("V_m")]) },
      ],
      texName: "CO2\\_dissolution",
    })
    .addReaction("CO2_stomatal_diffusion", {
      fn: new Mul([
        new Num(0.001),
        new Name("gs"),
        new Add([new Name("Ca"), new Minus([new Name("Ci")])]),
      ]),
      stoichiometry: [{ name: "Ci", value: new Num(1.0) }],
      texName: "CO2\\_stomatal\\_diffusion",
    });
}
