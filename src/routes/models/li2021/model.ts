import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  GreaterThan,
  Ln,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("PPFD", {
      value: 50.0,
      texName: "PPFD",
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
      value: 0.5,
      texName: "sigma0\\_II",
    })
    .addParameter("c_b6f", {
      value: 0.433,
      texName: "c\\_b6f",
    })
    .addParameter("pKa_reg", {
      value: 6.2,
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
      value: 300.0,
      texName: "Vmax\\_b6f",
    })
    .addParameter("pKa_PsbS", {
      value: 6.2,
      texName: "pKa\\_PsbS",
    })
    .addParameter("NPQ_max", {
      value: 3.0,
      texName: "NPQ\\_max",
    })
    .addParameter("pH_st", {
      value: 7.8,
      texName: "pH\\_st",
    })
    .addParameter("Em_Fd", {
      value: -0.42,
      texName: "Em\\_Fd",
    })
    .addParameter("k_NDH1", {
      value: 1000.0,
      texName: "k\\_NDH1",
    })
    .addParameter("Vmax_PGR", {
      value: 0.0,
      texName: "Vmax\\_PGR",
    })
    .addParameter("sigma0_I", {
      value: 0.5,
      texName: "sigma0\\_I",
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
      value: 5000.0,
      texName: "k\\_PCtoP700",
    })
    .addParameter("k_FdtoNADP", {
      value: 1000.0,
      texName: "k\\_FdtoNADP",
    })
    .addParameter("K_st", {
      value: 0.1,
      texName: "K\\_st",
    })
    .addParameter("k_KEA3", {
      value: 2500000.0,
      texName: "k\\_KEA3",
    })
    .addParameter("P_K", {
      value: 150.0,
      texName: "P\\_K",
    })
    .addParameter("ipt_lu", {
      value: 0.000587,
      texName: "ipt\\_lu",
    })
    .addParameter("k_VCCN1", {
      value: 12.0,
      texName: "k\\_VCCN1",
    })
    .addParameter("k_ClCe", {
      value: 800000.0,
      texName: "k\\_ClCe",
    })
    .addParameter("HPR", {
      value: 4.666666666666667,
      texName: "HPR",
    })
    .addParameter("Vmax_ATPsynth", {
      value: 200.0,
      texName: "Vmax\\_ATPsynth",
    })
    .addParameter("b_H", {
      value: 0.014,
      texName: "b\\_H",
    })
    .addParameter("vpc", {
      value: 0.047,
      texName: "vpc",
    })
    .addParameter("k_EZ", {
      value: 0.004,
      texName: "k\\_EZ",
    })
    .addParameter("nh_VDE", {
      value: 4.0,
      texName: "nh\\_VDE",
    })
    .addParameter("pKa_VDE", {
      value: 5.65,
      texName: "pKa\\_VDE",
    })
    .addParameter("Vmax_VDE", {
      value: 0.08,
      texName: "Vmax\\_VDE",
    })
    .addParameter("k_leak", {
      value: 30000000.0,
      texName: "k\\_leak",
    })
    .addParameter("QA_total", {
      value: 1.0,
      texName: "QA\\_total",
    })
    .addParameter("PQ_tot", {
      value: 7.0,
      texName: "PQ\\_tot",
    })
    .addParameter("P700_total", {
      value: 0.667,
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
      value: 5.0,
      texName: "NADP\\_tot",
    })
    .addParameter("Carotenoids_tot", {
      value: 1.0,
      texName: "Carotenoids\\_tot",
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
      value: 7.8,
      texName: "pH\\_lumen",
    })
    .addVariable("Dpsi", {
      value: 0.0,
      texName: "Dpsi",
    })
    .addVariable("K_lu", {
      value: 0.1,
      texName: "K\\_lu",
    })
    .addVariable("PC_ox", {
      value: 0.0,
      texName: "PC\\_ox",
    })
    .addVariable("Y2", {
      value: 0.0,
      texName: "Y2",
    })
    .addVariable("Zx", {
      value: 0.0,
      texName: "Zx",
    })
    .addVariable("singO2", {
      value: 0.0,
      texName: "singO2",
    })
    .addVariable("Fd_red", {
      value: 0.0,
      texName: "Fd\\_red",
    })
    .addVariable("NADPH_st", {
      value: 1.5,
      texName: "NADPH\\_st",
    })
    .addVariable("Cl_lu", {
      value: 0.04,
      texName: "Cl\\_lu",
    })
    .addVariable("Cl_st", {
      value: 0.04,
      texName: "Cl\\_st",
    })
    .addAssignment("QA", {
      fn: new Add([new Name("QA_total"), new Minus([new Name("QA_red")])]),
      texName: "QA",
    })
    .addAssignment("Y0", {
      fn: new Add([new Name("P700_total"), new Minus([new Name("Y2")])]),
      texName: "Y0",
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
      fn: new Add([new Name("Carotenoids_tot"), new Minus([new Name("Zx")])]),
      texName: "Vx",
    })
    .addAssignment("light_per_L", {
      fn: new Mul([new Num(1.2), new Name("PPFD")]),
      texName: "light\\_per\\_L",
    })
    .addAssignment("driving_force_Cl", {
      fn: new Add([
        new Name("Dpsi"),
        new Divide([
          new Mul([
            new Num(0.06),
            new Ln(new Divide([new Name("Cl_st"), new Name("Cl_lu")])),
          ]),
          new Ln(new Num(10.0)),
        ]),
      ]),
      texName: "driving\\_force\\_Cl",
    })
    .addAssignment("PsbSP", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Add([
              new Mul([new Num(3.0), new Name("pH_lumen")]),
              new Minus([new Mul([new Num(3.0), new Name("pKa_PsbS")])]),
            ]),
          ),
        ]),
      ]),
      texName: "PsbSP",
    })
    .addAssignment("NPQ", {
      fn: new Add([
        new Mul([new Num(0.5), new Name("NPQ_max"), new Name("PsbSP")]),
        new Mul([new Num(0.1), new Name("NPQ_max"), new Name("Zx")]),
        new Mul([
          new Num(0.4),
          new Name("NPQ_max"),
          new Name("PsbSP"),
          new Name("Zx"),
        ]),
      ]),
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
    .addAssignment("H_st", {
      fn: new Pow(
        new Num(10.0),
        new Minus([new Mul([new Num(1.0), new Name("pH_st")])]),
      ),
      texName: "H\\_st",
    })
    .addAssignment("pmf", {
      fn: new Add([
        new Name("Dpsi"),
        new Mul([new Num(0.06), new Name("pH_st")]),
        new Minus([new Mul([new Num(0.06), new Name("pH_lumen")])]),
      ]),
      texName: "pmf",
    })
    .addAssignment("kCBB", {
      fn: new Divide([
        new Mul([new Num(60.0), new Name("PPFD")]),
        new Add([new Num(250.0), new Name("PPFD")]),
      ]),
      texName: "kCBB",
    })
    .addAssignment("delta_pH", {
      fn: new Add([new Name("pH_st"), new Minus([new Name("pH_lumen")])]),
      texName: "delta\\_pH",
    })
    .addAssignment("delta_pH_inVolts", {
      fn: new Mul([new Num(0.06), new Name("delta_pH")]),
      texName: "delta\\_pH\\_inVolts",
    })
    .addAssignment("qL_act", {
      fn: new Divide([
        new Pow(new Name("QA"), new Num(3.0)),
        new Add([
          new Num(0.0033749999999999995),
          new Pow(new Name("QA"), new Num(3.0)),
        ]),
      ]),
      texName: "qL\\_act",
    })
    .addAssignment("pH_act", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Add([
              new Num(-6.0),
              new Mul([new Num(1.0), new Name("pH_lumen")]),
            ]),
          ),
        ]),
      ]),
      texName: "pH\\_act",
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
          value: new Divide([new Name("ipt_lu"), new Name("b_H")]),
        },
        { name: "Dpsi", value: new Minus([new Name("vpc")]) },
      ],
      texName: "vPSII\\_recomb",
    })
    .addReaction("vPSII_ChSep", {
      fn: new Mul([
        new Name("PhiPSII"),
        new Name("light_per_L"),
        new Name("sigma0_II"),
      ]),
      stoichiometry: [
        { name: "QA_red", value: new Num(1.0) },
        {
          name: "pH_lumen",
          value: new Minus([new Divide([new Name("ipt_lu"), new Name("b_H")])]),
        },
        { name: "Dpsi", value: new Name("vpc") },
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
              new Mul([new Num(2.0), new Name("ipt_lu")]),
              new Name("b_H"),
            ]),
          ]),
        },
        { name: "Dpsi", value: new Name("vpc") },
      ],
      texName: "v\\_b6f",
    })
    .addReaction("v_NDH", {
      fn: new Add([
        new Mul([new Name("Fd_red"), new Name("PQ"), new Name("k_NDH1")]),
        new Minus([
          new Mul([
            new Name("Fd_ox"),
            new Name("PQH_2"),
            new Name("k_NDH1"),
            new Pow(
              new Num(10.0),
              new Add([
                new Num(-7.0),
                new Mul([new Num(1.0), new Name("pH_st")]),
                new Mul([new Num(16.666666666666668), new Name("Em_Fd")]),
                new Mul([new Num(33.333333333333336), new Name("pmf")]),
                new Minus([
                  new Mul([
                    new Num(16.666666666666668),
                    new Name("Em_PQH2_pH7"),
                  ]),
                ]),
              ]),
            ),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQH_2", value: new Num(0.5) },
        { name: "Fd_red", value: new Num(-1.0) },
        {
          name: "pH_lumen",
          value: new Minus([
            new Divide([
              new Mul([new Num(2.0), new Name("ipt_lu")]),
              new Name("b_H"),
            ]),
          ]),
        },
        { name: "Dpsi", value: new Mul([new Num(2.0), new Name("vpc")]) },
      ],
      texName: "v\\_NDH",
    })
    .addReaction("v_PGR", {
      fn: new Divide([
        new Mul([
          new Name("PQ"),
          new Name("Vmax_PGR"),
          new Pow(new Name("Fd_red"), new Num(4.0)),
        ]),
        new Mul([
          new Add([
            new Num(0.00010000000000000002),
            new Pow(new Name("Fd_red"), new Num(4.0)),
          ]),
          new Add([new Name("PQ"), new Name("PQH_2")]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQH_2", value: new Num(0.5) },
        { name: "Fd_red", value: new Num(-1.0) },
      ],
      texName: "v\\_PGR",
    })
    .addReaction("PSI_ChSep", {
      fn: new Mul([
        new Name("Fd_ox"),
        new Name("Y0"),
        new Name("light_per_L"),
        new Name("sigma0_I"),
      ]),
      stoichiometry: [
        { name: "Y2", value: new Num(1.0) },
        { name: "Fd_red", value: new Num(1.0) },
        { name: "Dpsi", value: new Name("vpc") },
      ],
      texName: "PSI\\_ChSep",
    })
    .addReaction("v_PSI_PCoxid", {
      fn: new Mul([new Name("PC_red"), new Name("Y2"), new Name("k_PCtoP700")]),
      stoichiometry: [
        { name: "Y2", value: new Num(-1.0) },
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
      ],
      texName: "v\\_FNR",
    })
    .addReaction("v_Mehler", {
      fn: new Divide([
        new Mul([new Num(0.00106), new Name("Fd_red")]),
        new Add([new Name("Fd_ox"), new Name("Fd_red")]),
      ]),
      stoichiometry: [{ name: "Fd_red", value: new Num(-1.0) }],
      texName: "v\\_Mehler",
    })
    .addReaction("v_CBB", {
      fn: new Mul([
        new Num(0.9712326548170112),
        new Name("kCBB"),
        new Add([
          new Num(1.0),
          new Minus([
            new Exp(
              new Minus([
                new Mul([new Num(0.0016666666666666668), new Name("time")]),
              ]),
            ),
          ]),
        ]),
        new Add([
          new Num(-0.22314355131420976),
          new Ln(new Divide([new Name("NADPH_st"), new Name("NADP_st")])),
        ]),
      ]),
      stoichiometry: [{ name: "NADPH_st", value: new Num(-1.0) }],
      texName: "v\\_CBB",
    })
    .addReaction("v_KEA3", {
      fn: new Mul([
        new Name("k_KEA3"),
        new Name("pH_act"),
        new Name("qL_act"),
        new Add([
          new Mul([new Name("H_lumen"), new Name("K_st")]),
          new Minus([new Mul([new Name("H_st"), new Name("K_lu")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "K_lu", value: new Name("ipt_lu") },
        {
          name: "pH_lumen",
          value: new Divide([new Name("ipt_lu"), new Name("b_H")]),
        },
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
        { name: "K_lu", value: new Minus([new Name("ipt_lu")]) },
        { name: "Dpsi", value: new Minus([new Name("vpc")]) },
      ],
      texName: "v\\_VKC",
    })
    .addReaction("v_VCCN1", {
      fn: new Mul([
        new Num(0.5),
        new Name("k_VCCN1"),
        new Add([new Name("Cl_lu"), new Name("Cl_st")]),
        new Add([
          new Mul([
            new Num(332.0),
            new Pow(new Name("driving_force_Cl"), new Num(3.0)),
          ]),
          new Mul([new Num(3.6), new Name("driving_force_Cl")]),
          new Mul([
            new Num(30.8),
            new Pow(new Name("driving_force_Cl"), new Num(2.0)),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Cl_lu", value: new Name("ipt_lu") },
        {
          name: "Cl_st",
          value: new Minus([new Mul([new Num(0.1), new Name("ipt_lu")])]),
        },
        { name: "Dpsi", value: new Minus([new Name("vpc")]) },
      ],
      texName: "v\\_VCCN1",
    })
    .addReaction("v_ClCe", {
      fn: new Mul([
        new Num(0.25),
        new Name("k_ClCe"),
        new Add([new Name("Cl_lu"), new Name("Cl_st")]),
        new Add([new Name("H_lumen"), new Name("H_st")]),
        new Add([
          new Name("pmf"),
          new Mul([new Num(2.0), new Name("driving_force_Cl")]),
        ]),
      ]),
      stoichiometry: [
        { name: "Cl_lu", value: new Mul([new Num(2.0), new Name("ipt_lu")]) },
        {
          name: "Cl_st",
          value: new Minus([new Mul([new Num(0.2), new Name("ipt_lu")])]),
        },
        {
          name: "pH_lumen",
          value: new Divide([new Name("ipt_lu"), new Name("b_H")]),
        },
        {
          name: "Dpsi",
          value: new Minus([new Mul([new Num(3.0), new Name("vpc")])]),
        },
      ],
      texName: "v\\_ClCe",
    })
    .addReaction("v_Leak", {
      fn: new Mul([new Name("H_lumen"), new Name("k_leak"), new Name("pmf")]),
      stoichiometry: [
        {
          name: "pH_lumen",
          value: new Divide([new Name("ipt_lu"), new Name("b_H")]),
        },
        { name: "Dpsi", value: new Minus([new Name("vpc")]) },
      ],
      texName: "v\\_Leak",
    })
    .addReaction("v_pmf_protons_activity", {
      fn: new Piecewise([
        new Add([
          new Mul([
            new Name("HPR"),
            new Name("Vmax_ATPsynth"),
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
                        new Num(-5.1000000000000005),
                        new Mul([new Num(25.0), new Name("pmf")]),
                      ]),
                    ),
                  ]),
                ]),
              ]),
            ]),
            new Add([
              new Num(0.8),
              new Minus([
                new Divide([
                  new Mul([
                    new Num(1.0793299047744327e-9),
                    new Pow(new Name("time"), new Num(4.0)),
                  ]),
                  new Add([
                    new Num(1.0),
                    new Mul([
                      new Num(1.349162380968041e-9),
                      new Pow(new Name("time"), new Num(4.0)),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Name("HPR"),
            new Name("Vmax_ATPsynth"),
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
                        new Num(-3.3000000000000003),
                        new Mul([new Num(25.0), new Name("pmf")]),
                      ]),
                    ),
                  ]),
                ]),
              ]),
            ]),
            new Add([
              new Num(0.2),
              new Divide([
                new Mul([
                  new Num(1.0793299047744327e-9),
                  new Pow(new Name("time"), new Num(4.0)),
                ]),
                new Add([
                  new Num(1.0),
                  new Mul([
                    new Num(1.349162380968041e-9),
                    new Pow(new Name("time"), new Num(4.0)),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new GreaterThan([new Name("light_per_L"), new Num(0.0)]),
        new Num(0.0),
      ]),
      stoichiometry: [
        {
          name: "pH_lumen",
          value: new Divide([new Name("ipt_lu"), new Name("b_H")]),
        },
        { name: "Dpsi", value: new Minus([new Name("vpc")]) },
      ],
      texName: "v\\_pmf\\_protons\\_activity",
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
