import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Ln,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("PPFD", {
      value: 100.0,
      texName: "PPFD",
      slider: { min: "100", max: "2000", step: "10" },
    })
    .addParameter("k_recomb", {
      value: 0.33,
      texName: "k\\_recomb",
    })
    .addParameter("phi_triplet", {
      value: 0.45,
      texName: "phi\\_triplet",
    })
    .addParameter("phi_1O2", {
      value: 1.0,
      texName: "phi\\_1O2",
    })
    .addParameter("sigma0_II", {
      value: 1.0,
      texName: "sigma0\\_II",
    })
    .addParameter("c_b6f", {
      value: 1.0,
      texName: "c\\_b6f",
    })
    .addParameter("pKa_reg", {
      value: 6.5,
      texName: "pKa\\_reg",
    })
    .addParameter("Em_PC_pH7", {
      value: 0.37,
      texName: "Em\\_PC\\_pH7",
    })
    .addParameter("Em_PQH2_pH7", {
      value: 0.11,
      texName: "Em\\_PQH2\\_pH7",
    })
    .addParameter("Vmax_b6f", {
      value: 500.0,
      texName: "Vmax\\_b6f",
    })
    .addParameter("pKa_PsbS", {
      value: 6.4,
      texName: "pKa\\_PsbS",
    })
    .addParameter("NPQ_max", {
      value: 5.0,
      texName: "NPQ\\_max",
    })
    .addParameter("pH_stroma", {
      value: 7.8,
      texName: "pH\\_stroma",
    })
    .addParameter("PSI_antenna_size", {
      value: 1.0,
      texName: "PSI\\_antenna\\_size",
    })
    .addParameter("k_QA", {
      value: 1000.0,
      texName: "k\\_QA",
    })
    .addParameter("Keq_QA", {
      value: 200.0,
      texName: "Keq\\_QA",
    })
    .addParameter("k_PCtoP700", {
      value: 500.0,
      texName: "k\\_PCtoP700",
    })
    .addParameter("k_FdtoNADP", {
      value: 1000.0,
      texName: "k\\_FdtoNADP",
    })
    .addParameter("K_st", {
      value: 0.04,
      texName: "K\\_st",
    })
    .addParameter("k_KEA3", {
      value: 0.0,
      texName: "k\\_KEA3",
    })
    .addParameter("P_K", {
      value: 6000.0,
      texName: "P\\_K",
    })
    .addParameter("lumen_protons_per_turnover", {
      value: 1.4e-5,
      texName: "lumen\\_protons\\_per\\_turnover",
    })
    .addParameter("n", {
      value: 4.666666666666667,
      texName: "n",
    })
    .addParameter("DeltaGATP", {
      value: 42.0,
      texName: "DeltaGATP",
    })
    .addParameter("Vmax_ATPsynth", {
      value: 1000.0,
      texName: "Vmax\\_ATPsynth",
    })
    .addParameter("b_H", {
      value: 0.03,
      texName: "b\\_H",
    })
    .addParameter("volt_per_charge", {
      value: 0.033,
      texName: "volt\\_per\\_charge",
    })
    .addParameter("k_EZ", {
      value: 0.03,
      texName: "k\\_EZ",
    })
    .addParameter("nh_VDE", {
      value: 4.0,
      texName: "nh\\_VDE",
    })
    .addParameter("pKa_VDE", {
      value: 5.8,
      texName: "pKa\\_VDE",
    })
    .addParameter("Vmax_VDE", {
      value: 1.0,
      texName: "Vmax\\_VDE",
    })
    .addParameter("QA_total", {
      value: 1.0,
      texName: "QA\\_total",
    })
    .addParameter("PQ_tot", {
      value: 6.0,
      texName: "PQ\\_tot",
    })
    .addParameter("P700_total", {
      value: 1.0,
      texName: "P700\\_total",
    })
    .addParameter("PC_tot", {
      value: 2.0,
      texName: "PC\\_tot",
    })
    .addParameter("Fd_tot", {
      value: 1.0,
      texName: "Fd\\_tot",
    })
    .addParameter("NADP_tot", {
      value: 1.0,
      texName: "NADP\\_tot",
    })
    .addParameter("Xanthophyll_tot", {
      value: 1.0,
      texName: "Xanthophyll\\_tot",
    })
    .addParameter("k_CBB", {
      value: 3000.0,
      texName: "k\\_CBB",
    })
    .addVariable("QA_red", {
      value: 0.0,
      texName: "QA\\_red",
    })
    .addVariable("PQH_2", {
      value: 0.0,
      texName: "PQH\\_2",
    })
    .addVariable("pH_lumen", {
      value: 7.0,
      texName: "pH\\_lumen",
    })
    .addVariable("Dpsi", {
      value: 0.1,
      texName: "Dpsi",
    })
    .addVariable("K_lu", {
      value: 0.04,
      texName: "K\\_lu",
    })
    .addVariable("PC_ox", {
      value: 0.0,
      texName: "PC\\_ox",
    })
    .addVariable("Zx", {
      value: 0.0,
      texName: "Zx",
    })
    .addVariable("singO2", {
      value: 0.0,
      texName: "singO2",
    })
    .addVariable("P700_ox", {
      value: 0.0,
      texName: "P700\\_ox",
    })
    .addVariable("Fd_red", {
      value: 0.0,
      texName: "Fd\\_red",
    })
    .addVariable("NADPH_st", {
      value: 0.0,
      texName: "NADPH\\_st",
    })
    .addVariable("LEF", {
      value: 0.0,
      texName: "LEF",
    })
    .addVariable("ATP_made", {
      value: 0.0,
      texName: "ATP\\_made",
    })
    .addAssignment("QA", {
      fn: new Add([new Name("QA_total"), new Minus([new Name("QA_red")])]),
      texName: "QA",
    })
    .addAssignment("P700_red", {
      fn: new Add([new Name("P700_total"), new Minus([new Name("P700_ox")])]),
      texName: "P700\\_red",
    })
    .addAssignment("PQ", {
      fn: new Add([new Name("PQ_tot"), new Minus([new Name("PQH_2")])]),
      texName: "PQ",
    })
    .addAssignment("PC_red", {
      fn: new Add([new Name("PC_tot"), new Minus([new Name("PC_ox")])]),
      texName: "PC\\_red",
    })
    .addAssignment("Fd_ox", {
      fn: new Add([new Name("Fd_tot"), new Minus([new Name("Fd_red")])]),
      texName: "Fd\\_ox",
    })
    .addAssignment("NADP_st", {
      fn: new Add([new Name("NADP_tot"), new Minus([new Name("NADPH_st")])]),
      texName: "NADP\\_st",
    })
    .addAssignment("Vx", {
      fn: new Add([new Name("Xanthophyll_tot"), new Minus([new Name("Zx")])]),
      texName: "Vx",
    })
    .addAssignment("DeltaGATP_V", {
      fn: new Mul([new Num(0.010526315789473684), new Name("DeltaGATP")]),
      texName: "DeltaGATP\\_V",
    })
    .addAssignment("PsbSP", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Add([new Name("pH_lumen"), new Minus([new Name("pKa_PsbS")])]),
          ),
        ]),
      ]),
      texName: "PsbSP",
    })
    .addAssignment("NPQ", {
      fn: new Mul([new Name("NPQ_max"), new Name("PsbSP"), new Name("Zx")]),
      texName: "NPQ",
    })
    .addAssignment("PhiPSII", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Divide([
            new Add([
              new Num(0.20491803278688525),
              new Mul([new Num(0.20491803278688525), new Name("NPQ")]),
            ]),
            new Name("QA"),
          ]),
        ]),
      ]),
      texName: "PhiPSII",
    })
    .addAssignment("H_lumen", {
      fn: new Pow(
        new Num(10.0),
        new Minus([new Mul([new Num(1.0), new Name("pH_lumen")])]),
      ),
      texName: "H\\_lumen",
    })
    .addAssignment("H_stroma", {
      fn: new Pow(
        new Num(10.0),
        new Minus([new Mul([new Num(1.0), new Name("pH_stroma")])]),
      ),
      texName: "H\\_stroma",
    })
    .addAssignment("pmf", {
      fn: new Add([
        new Name("Dpsi"),
        new Mul([new Num(0.06), new Name("pH_stroma")]),
        new Minus([new Mul([new Num(0.06), new Name("pH_lumen")])]),
      ]),
      texName: "pmf",
    })
    .addAssignment("delta_pH", {
      fn: new Add([new Name("pH_stroma"), new Minus([new Name("pH_lumen")])]),
      texName: "delta\\_pH",
    })
    .addAssignment("delta_pH_inVolts", {
      fn: new Mul([new Num(0.06), new Name("delta_pH")]),
      texName: "delta\\_pH\\_inVolts",
    })
    .addAssignment("ATP_synthase_driving_force", {
      fn: new Add([
        new Name("pmf"),
        new Minus([new Divide([new Name("DeltaGATP_V"), new Name("n")])]),
      ]),
      texName: "ATP\\_synthase\\_driving\\_force",
    })
    .addAssignment("k_b6f", {
      fn: new Mul([
        new Name("c_b6f"),
        new Add([
          new Num(1.0),
          new Minus([
            new Divide([
              new Num(1.0),
              new Add([
                new Num(1.0),
                new Pow(
                  new Num(10.0),
                  new Add([
                    new Name("pH_lumen"),
                    new Minus([new Name("pKa_reg")]),
                  ]),
                ),
              ]),
            ]),
          ]),
        ]),
      ]),
      texName: "k\\_b6f",
    })
    .addReaction("vPSII_recomb", {
      fn: new Mul([
        new Name("QA_red"),
        new Name("k_recomb"),
        new Pow(
          new Num(10.0),
          new Add([
            new Num(7.0),
            new Mul([new Num(16.666666666666668), new Name("Dpsi")]),
            new Minus([new Mul([new Num(1.0), new Name("pH_lumen")])]),
          ]),
        ),
      ]),
      stoichiometry: [
        {
          name: "singO2",
          value: new Mul([new Name("phi_1O2"), new Name("phi_triplet")]),
        },
        { name: "QA_red", value: new Num(-1.0) },
        {
          name: "pH_lumen",
          value: new Divide([
            new Name("lumen_protons_per_turnover"),
            new Name("b_H"),
          ]),
        },
        { name: "Dpsi", value: new Minus([new Name("volt_per_charge")]) },
      ],
      texName: "vPSII\\_recomb",
    })
    .addReaction("vPSII_ChSep", {
      fn: new Mul([new Name("PPFD"), new Name("PhiPSII")]),
      stoichiometry: [
        { name: "QA_red", value: new Num(1.0) },
        {
          name: "pH_lumen",
          value: new Minus([
            new Divide([
              new Name("lumen_protons_per_turnover"),
              new Name("b_H"),
            ]),
          ]),
        },
        { name: "Dpsi", value: new Name("volt_per_charge") },
      ],
      texName: "vPSII\\_ChSep",
    })
    .addReaction("v_PSII", {
      fn: new Mul([new Name("PQ"), new Name("QA_red"), new Name("k_QA")]),
      stoichiometry: [
        { name: "QA_red", value: new Num(-1.0) },
        { name: "PQH_2", value: new Num(0.5) },
      ],
      texName: "v\\_PSII",
    })
    .addReaction("v_PQ", {
      fn: new Divide([
        new Mul([new Name("PQH_2"), new Name("QA"), new Name("k_QA")]),
        new Name("Keq_QA"),
      ]),
      stoichiometry: [
        { name: "QA_red", value: new Num(1.0) },
        { name: "PQH_2", value: new Num(-0.5) },
      ],
      texName: "v\\_PQ",
    })
    .addReaction("v_b6f", {
      fn: new Add([
        new Divide([
          new Mul([
            new Name("PC_ox"),
            new Name("PQH_2"),
            new Name("Vmax_b6f"),
            new Name("c_b6f"),
            new Add([
              new Num(1.0),
              new Minus([
                new Divide([
                  new Num(1.0),
                  new Add([
                    new Num(1.0),
                    new Pow(
                      new Num(10.0),
                      new Add([
                        new Name("pH_lumen"),
                        new Minus([new Name("pKa_reg")]),
                      ]),
                    ),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Add([new Name("PQ"), new Name("PQH_2")]),
        ]),
        new Minus([
          new Mul([
            new Name("PC_red"),
            new Name("Vmax_b6f"),
            new Name("c_b6f"),
            new Pow(
              new Num(10.0),
              new Add([
                new Num(7.0),
                new Mul([new Num(16.666666666666668), new Name("Em_PQH2_pH7")]),
                new Mul([new Num(16.666666666666668), new Name("pmf")]),
                new Minus([new Mul([new Num(1.0), new Name("pH_lumen")])]),
                new Minus([
                  new Mul([new Num(16.666666666666668), new Name("Em_PC_pH7")]),
                ]),
              ]),
            ),
            new Add([
              new Num(1.0),
              new Minus([
                new Divide([
                  new Num(1.0),
                  new Add([
                    new Num(1.0),
                    new Pow(
                      new Num(10.0),
                      new Add([
                        new Name("pH_lumen"),
                        new Minus([new Name("pKa_reg")]),
                      ]),
                    ),
                  ]),
                ]),
              ]),
            ]),
            new Add([
              new Num(1.0),
              new Minus([
                new Divide([
                  new Name("PQH_2"),
                  new Add([new Name("PQ"), new Name("PQH_2")]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQH_2", value: new Num(-0.5) },
        { name: "PC_ox", value: new Num(-1.0) },
        {
          name: "pH_lumen",
          value: new Minus([
            new Divide([
              new Mul([new Num(2.0), new Name("lumen_protons_per_turnover")]),
              new Name("b_H"),
            ]),
          ]),
        },
        { name: "Dpsi", value: new Name("volt_per_charge") },
      ],
      texName: "v\\_b6f",
    })
    .addReaction("PSI_ChSep", {
      fn: new Mul([
        new Name("Fd_ox"),
        new Name("P700_red"),
        new Name("PPFD"),
        new Name("PSI_antenna_size"),
      ]),
      stoichiometry: [
        { name: "P700_ox", value: new Num(1.0) },
        { name: "Fd_red", value: new Num(1.0) },
        { name: "Dpsi", value: new Name("volt_per_charge") },
      ],
      texName: "PSI\\_ChSep",
    })
    .addReaction("v_PSI_PCoxid", {
      fn: new Mul([
        new Name("P700_ox"),
        new Name("PC_red"),
        new Name("k_PCtoP700"),
      ]),
      stoichiometry: [
        { name: "P700_ox", value: new Num(-1.0) },
        { name: "PC_ox", value: new Num(1.0) },
      ],
      texName: "v\\_PSI\\_PCoxid",
    })
    .addReaction("v_FNR", {
      fn: new Mul([
        new Name("Fd_red"),
        new Name("NADP_st"),
        new Name("k_FdtoNADP"),
      ]),
      stoichiometry: [
        { name: "Fd_red", value: new Num(-1.0) },
        { name: "NADPH_st", value: new Num(0.5) },
        { name: "LEF", value: new Num(1.0) },
      ],
      texName: "v\\_FNR",
    })
    .addReaction("vATPsynthase", {
      fn: new Mul([
        new Name("ATP_synthase_driving_force"),
        new Name("Vmax_ATPsynth"),
      ]),
      stoichiometry: [
        { name: "ATP_made", value: new Num(1.0) },
        {
          name: "pH_lumen",
          value: new Divide([
            new Mul([new Name("lumen_protons_per_turnover"), new Name("n")]),
            new Name("b_H"),
          ]),
        },
        {
          name: "Dpsi",
          value: new Minus([
            new Mul([new Name("n"), new Name("volt_per_charge")]),
          ]),
        },
      ],
      texName: "vATPsynthase",
    })
    .addReaction("v_CBB", {
      fn: new Mul([new Name("NADPH_st"), new Name("k_CBB")]),
      stoichiometry: [{ name: "NADPH_st", value: new Num(-1.0) }],
      texName: "v\\_CBB",
    })
    .addReaction("v_KEA3", {
      fn: new Mul([
        new Name("k_KEA3"),
        new Add([
          new Mul([new Name("H_lumen"), new Name("K_st")]),
          new Minus([new Mul([new Name("H_stroma"), new Name("K_lu")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "K_lu", value: new Name("lumen_protons_per_turnover") },
        {
          name: "pH_lumen",
          value: new Divide([
            new Name("lumen_protons_per_turnover"),
            new Name("b_H"),
          ]),
        },
        { name: "Dpsi", value: new Minus([new Name("volt_per_charge")]) },
      ],
      texName: "v\\_KEA3",
    })
    .addReaction("v_VKC", {
      fn: new Mul([
        new Num(0.5),
        new Name("P_K"),
        new Add([
          new Name("Dpsi"),
          new Minus([
            new Divide([
              new Mul([
                new Num(0.06),
                new Ln(new Divide([new Name("K_st"), new Name("K_lu")])),
              ]),
              new Ln(new Num(10.0)),
            ]),
          ]),
        ]),
        new Add([new Name("K_lu"), new Name("K_st")]),
      ]),
      stoichiometry: [
        {
          name: "K_lu",
          value: new Minus([new Name("lumen_protons_per_turnover")]),
        },
        { name: "Dpsi", value: new Minus([new Name("volt_per_charge")]) },
      ],
      texName: "v\\_VKC",
    })
    .addReaction("v_Epox", {
      fn: new Mul([new Name("Zx"), new Name("k_EZ")]),
      stoichiometry: [{ name: "Zx", value: new Num(-1.0) }],
      texName: "v\\_Epox",
    })
    .addReaction("v_Deepox", {
      fn: new Divide([
        new Mul([new Num(1.0), new Name("Vmax_VDE"), new Name("Vx")]),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Mul([
              new Name("nh_VDE"),
              new Add([new Name("pH_lumen"), new Minus([new Name("pKa_VDE")])]),
            ]),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "Zx", value: new Num(1.0) }],
      texName: "v\\_Deepox",
    });
}
