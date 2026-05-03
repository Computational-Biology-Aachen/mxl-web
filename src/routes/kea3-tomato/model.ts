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
import { ModelBuilder } from "$lib/model-editor/modelBuilder";

export function initModel(): ModelBuilder {
  return new ModelBuilder()
    .addParameter("PSIItot", {
      value: 2.5,
      texName: "PSIItot",
    })
    .addParameter("PQtot", {
      value: 20.0,
      texName: "PQtot",
    })
    .addParameter("APtot", {
      value: 50.0,
      texName: "APtot",
    })
    .addParameter("PsbStot", {
      value: 1.0,
      texName: "PsbStot",
    })
    .addParameter("Xtot", {
      value: 1.0,
      texName: "Xtot",
    })
    .addParameter("O2ex", {
      value: 8.0,
      texName: "O2ex",
    })
    .addParameter("Pi", {
      value: 0.01,
      texName: "Pi",
    })
    .addParameter("k_b6f", {
      value: 0.22,
      texName: "k\\_b6f",
    })
    .addParameter("pKreg", {
      value: 6.4,
      texName: "pKreg",
    })
    .addParameter("kActATPase", {
      value: 0.01,
      texName: "kActATPase",
    })
    .addParameter("kDeactATPase", {
      value: 0.002,
      texName: "kDeactATPase",
    })
    .addParameter("kATPsynthase", {
      value: 20.0,
      texName: "kATPsynthase",
    })
    .addParameter("kATPconsumption", {
      value: 10.0,
      texName: "kATPconsumption",
    })
    .addParameter("HPR", {
      value: 4.666666666666667,
      texName: "HPR",
    })
    .addParameter("pKE0", {
      value: 7.211142552636095,
      texName: "pKE0",
    })
    .addParameter("b", {
      value: 3.1924977471697407,
      texName: "b",
    })
    .addParameter("kPQH2", {
      value: 250.0,
      texName: "kPQH2",
    })
    .addParameter("kPTOX", {
      value: 0.01,
      texName: "kPTOX",
    })
    .addParameter("kH_Qslope", {
      value: 5000000000.0,
      texName: "kH\\_Qslope",
    })
    .addParameter("kH0", {
      value: 500000000.0,
      texName: "kH0",
    })
    .addParameter("kF", {
      value: 625000000.0,
      texName: "kF",
    })
    .addParameter("kP", {
      value: 6939318750.0,
      texName: "kP",
    })
    .addParameter("pH_stroma", {
      value: 7.8,
      texName: "pH\\_stroma",
    })
    .addParameter("kleak", {
      value: 1000.0,
      texName: "kleak",
    })
    .addParameter("bH", {
      value: 100.0,
      texName: "bH",
    })
    .addParameter("kDeepoxV", {
      value: 0.00096,
      texName: "kDeepoxV",
      slider: {
        min: "0.000096",
        max: "0.0096",
        step: "0.000096",
      },
    })
    .addParameter("kEpoxZ", {
      value: 0.0013824,
      texName: "kEpoxZ",
      slider: {
        min: "0.00013824",
        max: "0.013824",
        step: "0.00013824",
      },
    })
    .addParameter("KphSatZ", {
      value: 5.8,
      texName: "KphSatZ",
    })
    .addParameter("KZsat", {
      value: 0.65,
      texName: "KZsat",
    })
    .addParameter("nHX", {
      value: 5.0,
      texName: "nHX",
    })
    .addParameter("nHZ", {
      value: 3.0,
      texName: "nHZ",
    })
    .addParameter("nHL", {
      value: 3.0,
      texName: "nHL",
    })
    .addParameter("kDeprot", {
      value: 0.0336,
      texName: "kDeprot",
      slider: {
        min: "0.00336",
        max: "0.336",
        step: "0.00336",
      },
    })
    .addParameter("kProt", {
      value: 0.07392,
      texName: "kProt",
      slider: {
        min: "0.007392",
        max: "0.7392",
        step: "0.007392",
      },
    })
    .addParameter("KphSatLHC", {
      value: 5.8,
      texName: "KphSatLHC",
    })
    .addParameter("gamma0", {
      value: 0.1,
      texName: "gamma0",
      slider: {
        min: "0.1",
        max: "1.0",
        step: "0.1",
      },
    })
    .addParameter("gamma1", {
      value: 1.0,
      texName: "gamma1",
      slider: {
        min: "1",
        max: "5",
        step: "0.1",
      },
    })
    .addParameter("gamma2", {
      value: 8.0,
      texName: "gamma2",
      slider: {
        min: "1",
        max: "10",
        step: "0.1",
      },
    })
    .addParameter("gamma3", {
      value: 2.0,
      texName: "gamma3",
      slider: {
        min: "1",
        max: "5",
        step: "0.1",
      },
    })
    .addParameter("pK_KEA3", {
      value: 6.75,
      texName: "pK\\_KEA3",
      slider: {
        min: "1",
        max: "10",
        step: "0.1",
      },
    })
    .addParameter("k_KEA3", {
      value: 5.0,
      texName: "k\\_KEA3",
      slider: {
        min: "1",
        max: "30",
        step: "1",
      },
    })
    .addParameter("K_lumen_conc_initial", {
      value: 0.1,
      texName: "K\\_lumen\\_conc\\_initial",
    })
    .addParameter("K_stroma_conc_initial", {
      value: 0.1,
      texName: "K\\_stroma\\_conc\\_initial",
    })
    .addParameter("ATP_thres_KEA3", {
      value: 20.5,
      texName: "ATP\\_thres\\_KEA3",
      slider: {
        min: "0",
        max: "50",
        step: "0.5",
      },
    })
    .addParameter("c", {
      value: 0.1,
      texName: "c",
    })
    .addParameter("F", {
      value: 96.485,
      texName: "F",
    })
    .addParameter("R", {
      value: 0.0083,
      texName: "R",
    })
    .addParameter("T", {
      value: 298.0,
      texName: "T",
    })
    .addParameter("E0QAQAm", {
      value: -0.14,
      texName: "E0QAQAm",
    })
    .addParameter("E0PQPQH2", {
      value: 0.354,
      texName: "E0PQPQH2",
    })
    .addParameter("E0PCPCm", {
      value: 0.38,
      texName: "E0PCPCm",
    })
    .addParameter("DeltaG0_ATP", {
      value: 30.6,
      texName: "DeltaG0\\_ATP",
    })
    .addParameter("e", {
      value: 2.71828,
      texName: "e",
    })
    .addParameter("lumen_volume_per_area_membrane", {
      value: 0.0014,
      texName: "lumen\\_volume\\_per\\_area\\_membrane",
    })
    .addParameter("stroma_volume_per_area_membrane", {
      value: 0.0112,
      texName: "stroma\\_volume\\_per\\_area\\_membrane",
    })
    .addParameter("molChl_per_area_membrane", {
      value: 0.00035,
      texName: "molChl\\_per\\_area\\_membrane",
    })
    .addParameter("thylakoid_membrane_capacitance", {
      value: 0.006,
      texName: "thylakoid\\_membrane\\_capacitance",
    })
    .addParameter("pHlumen_init", {
      value: 7.2,
      texName: "pHlumen\\_init",
    })
    .addParameter("pfd", {
      value: 200.0,
      texName: "pfd",
    })
    .addVariable("B0", {
      value: 2.5,
      texName: "B0",
    })
    .addVariable("B1", {
      value: 0.0,
      texName: "B1",
    })
    .addVariable("B2", {
      value: 0.0,
      texName: "B2",
    })
    .addVariable("PQH2", {
      value: 0.0,
      texName: "PQH2",
    })
    .addVariable("ATP", {
      value: 25.0,
      texName: "ATP",
    })
    .addVariable("H_lumen", {
      value: new Divide([
        new Mul([
          new Num(1000.0),
          new Name("lumen_volume_per_area_membrane"),
          new Pow(new Num(10.0), new Minus([new Name("pHlumen_init")])),
        ]),
        new Name("molChl_per_area_membrane"),
      ]),
      texName: "H\\_lumen",
    })
    .addVariable("delta_psi", {
      value: new Minus([
        new Mul([
          new Num(2.302585092994046),
          new Name("R"),
          new Name("delta_pH"),
        ]),
      ]),
      texName: "delta\\_psi",
    })
    .addVariable("Vx", {
      value: 1.0,
      texName: "Vx",
    })
    .addVariable("PsbS", {
      value: 1.0,
      texName: "PsbS",
    })
    .addVariable("ATPactivity", {
      value: 0.1,
      texName: "ATPactivity",
    })
    .addVariable("K_lumen", {
      value: new Divide([
        new Mul([
          new Num(1000.0),
          new Name("K_lumen_conc_initial"),
          new Name("lumen_volume_per_area_membrane"),
        ]),
        new Name("molChl_per_area_membrane"),
      ]),
      texName: "K\\_lumen",
    })
    .addVariable("K_stroma", {
      value: new Divide([
        new Mul([
          new Num(1000.0),
          new Name("K_stroma_conc_initial"),
          new Name("stroma_volume_per_area_membrane"),
        ]),
        new Name("molChl_per_area_membrane"),
      ]),
      texName: "K\\_stroma",
    })
    .addAssignment("RT", {
      fn: new Mul([new Name("R"), new Name("T")]),
      texName: "RT",
    })
    .addAssignment("pH_lumen", {
      fn: new Minus([
        new Divide([
          new Ln(
            new Divide([
              new Mul([
                new Num(0.001),
                new Name("H_lumen"),
                new Name("molChl_per_area_membrane"),
              ]),
              new Name("lumen_volume_per_area_membrane"),
            ]),
          ),
          new Ln(new Num(10.0)),
        ]),
      ]),
      texName: "pH\\_lumen",
    })
    .addAssignment("H_lumen_conc", {
      fn: new Divide([
        new Mul([
          new Num(0.001),
          new Name("H_lumen"),
          new Name("molChl_per_area_membrane"),
        ]),
        new Name("lumen_volume_per_area_membrane"),
      ]),
      texName: "H\\_lumen\\_conc",
    })
    .addAssignment("H_stroma", {
      fn: new Divide([
        new Mul([
          new Num(1000.0),
          new Name("stroma_volume_per_area_membrane"),
          new Pow(new Num(10.0), new Minus([new Name("pH_stroma")])),
        ]),
        new Name("molChl_per_area_membrane"),
      ]),
      texName: "H\\_stroma",
    })
    .addAssignment("H_stroma_conc", {
      fn: new Divide([
        new Mul([
          new Num(0.001),
          new Name("H_stroma"),
          new Name("molChl_per_area_membrane"),
        ]),
        new Name("stroma_volume_per_area_membrane"),
      ]),
      texName: "H\\_stroma\\_conc",
    })
    .addAssignment("delta_pH", {
      fn: new Add([new Name("pH_lumen"), new Minus([new Name("pH_stroma")])]),
      texName: "delta\\_pH",
    })
    .addAssignment("delta_pH_V", {
      fn: new Minus([
        new Divide([
          new Mul([
            new Num(2.302585092994046),
            new Name("R"),
            new Name("T"),
            new Name("delta_pH"),
          ]),
          new Name("F"),
        ]),
      ]),
      texName: "delta\\_pH\\_V",
    })
    .addAssignment("pmfV", {
      fn: new Add([
        new Name("delta_psi"),
        new Minus([
          new Divide([
            new Mul([
              new Num(2.302585092994046),
              new Name("R"),
              new Name("T"),
              new Name("delta_pH"),
            ]),
            new Name("F"),
          ]),
        ]),
      ]),
      texName: "pmf(V)",
    })
    .addAssignment("volts_per_charge", {
      fn: new Divide([
        new Mul([
          new Num(1.0),
          new Name("F"),
          new Name("molChl_per_area_membrane"),
        ]),
        new Name("thylakoid_membrane_capacitance"),
      ]),
      texName: "volts\\_per\\_charge",
    })
    .addAssignment("PQ", {
      fn: new Add([new Name("PQtot"), new Minus([new Name("PQH2")])]),
      texName: "PQ",
    })
    .addAssignment("ADP", {
      fn: new Add([new Name("APtot"), new Minus([new Name("ATP")])]),
      texName: "ADP",
    })
    .addAssignment("PsbSP", {
      fn: new Add([new Name("PsbStot"), new Minus([new Name("PsbS")])]),
      texName: "PsbSP",
    })
    .addAssignment("Zx", {
      fn: new Add([new Name("Xtot"), new Minus([new Name("Vx")])]),
      texName: "Zx",
    })
    .addAssignment("Keq_PQH2", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0PQPQH2"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0QAQAm"), new Name("F")]),
            ]),
            new Minus([
              new Mul([
                new Num(4.605170185988092),
                new Name("R"),
                new Name("T"),
                new Name("pH_stroma"),
              ]),
            ]),
          ]),
          new Mul([new Name("R"), new Name("T")]),
        ]),
      ),
      texName: "Keq\\_PQH2",
    })
    .addAssignment("Keqcytb6f", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0PCPCm"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0PQPQH2"), new Name("F")]),
            ]),
            new Minus([
              new Mul([new Num(2.0), new Name("F"), new Name("pmfV")]),
            ]),
            new Mul([
              new Num(4.605170185988092),
              new Name("R"),
              new Name("T"),
              new Name("pH_lumen"),
            ]),
          ]),
          new Mul([new Name("R"), new Name("T")]),
        ]),
      ),
      texName: "Keqcytb6f",
    })
    .addAssignment("KeqATPsyn", {
      fn: new Mul([
        new Name("Pi"),
        new Exp(
          new Divide([
            new Add([
              new Minus([new Name("DeltaG0_ATP")]),
              new Mul([new Name("F"), new Name("HPR"), new Name("pmfV")]),
            ]),
            new Mul([new Name("R"), new Name("T")]),
          ]),
        ),
      ]),
      texName: "KeqATPsyn",
    })
    .addAssignment("ATP_pmf_act", {
      fn: new Divide([
        new Pow(
          new Name("e"),
          new Add([
            new Divide([
              new Mul([new Name("F"), new Name("b"), new Name("pmfV")]),
              new Mul([new Name("R"), new Name("T")]),
            ]),
            new Ln(new Pow(new Num(10.0), new Minus([new Name("pKE0")]))),
          ]),
        ),
        new Add([
          new Num(1.0),
          new Pow(
            new Name("e"),
            new Add([
              new Divide([
                new Mul([new Name("F"), new Name("b"), new Name("pmfV")]),
                new Mul([new Name("R"), new Name("T")]),
              ]),
              new Ln(new Pow(new Num(10.0), new Minus([new Name("pKE0")]))),
            ]),
          ),
        ]),
      ]),
      texName: "ATP\\_pmf\\_act",
    })
    .addAssignment("pHmod", {
      fn: new Add([
        new Num(1.0),
        new Minus([
          new Divide([
            new Num(1.0),
            new Add([
              new Num(1.0),
              new Pow(
                new Num(10.0),
                new Add([new Name("pH_lumen"), new Minus([new Name("pKreg")])]),
              ),
            ]),
          ]),
        ]),
      ]),
      texName: "pHmod",
    })
    .addAssignment("k_cytb6f", {
      fn: new Mul([new Name("k_b6f"), new Name("pHmod")]),
      texName: "k\\_cytb6f",
    })
    .addAssignment("Q0", {
      fn: new Mul([new Name("PsbS"), new Name("Vx"), new Name("gamma0")]),
      texName: "Q0",
    })
    .addAssignment("Q1", {
      fn: new Mul([new Name("PsbSP"), new Name("Vx"), new Name("gamma1")]),
      texName: "Q1",
    })
    .addAssignment("Q2", {
      fn: new Mul([new Name("PsbSP"), new Name("Zx"), new Name("gamma2")]),
      texName: "Q2",
    })
    .addAssignment("Q3", {
      fn: new Mul([new Name("PsbS"), new Name("Zx"), new Name("gamma3")]),
      texName: "Q3",
    })
    .addAssignment("Quencher_act", {
      fn: new Add([
        new Name("Q0"),
        new Name("Q1"),
        new Name("Q2"),
        new Name("Q3"),
      ]),
      texName: "Quencher act.",
    })
    .addAssignment("B3", {
      fn: new Add([
        new Name("PSIItot"),
        new Minus([new Name("B0")]),
        new Minus([new Name("B1")]),
        new Minus([new Name("B2")]),
      ]),
      texName: "B3",
    })
    .addAssignment("rel_B0", {
      fn: new Divide([new Name("B0"), new Name("PSIItot")]),
      texName: "rel\\_B0",
    })
    .addAssignment("rel_B1", {
      fn: new Divide([new Name("B1"), new Name("PSIItot")]),
      texName: "rel\\_B1",
    })
    .addAssignment("rel_B2", {
      fn: new Divide([new Name("B2"), new Name("PSIItot")]),
      texName: "rel\\_B2",
    })
    .addAssignment("rel_B3", {
      fn: new Divide([new Name("B3"), new Name("PSIItot")]),
      texName: "rel\\_B3",
    })
    .addAssignment("qL", {
      fn: new Divide([
        new Add([new Name("B1"), new Name("B2")]),
        new Name("PSIItot"),
      ]),
      texName: "qL",
    })
    .addAssignment("Fluorescence", {
      fn: new Add([
        new Divide([
          new Mul([new Name("B0"), new Name("kF")]),
          new Add([
            new Name("kF"),
            new Name("kH0"),
            new Name("kP"),
            new Mul([new Name("Quencher_act"), new Name("kH_Qslope")]),
          ]),
        ]),
        new Divide([
          new Mul([new Name("B2"), new Name("kF")]),
          new Add([
            new Name("kF"),
            new Name("kH0"),
            new Mul([new Name("Quencher_act"), new Name("kH_Qslope")]),
          ]),
        ]),
      ]),
      texName: "Fluorescence",
    })
    .addAssignment("PsbS_deprot_act", {
      fn: new Divide([
        new Pow(new Name("KZsat"), new Name("nHZ")),
        new Add([
          new Pow(new Name("KZsat"), new Name("nHZ")),
          new Pow(new Name("Zx"), new Name("nHZ")),
        ]),
      ]),
      texName: "PsbS\\_deprot\\_act",
    })
    .addAssignment("K_stroma_conc", {
      fn: new Divide([
        new Mul([
          new Num(0.001),
          new Name("K_stroma"),
          new Name("molChl_per_area_membrane"),
        ]),
        new Name("stroma_volume_per_area_membrane"),
      ]),
      texName: "K\\_stroma\\_conc",
    })
    .addAssignment("K_lumen_conc", {
      fn: new Divide([
        new Mul([
          new Num(0.001),
          new Name("K_lumen"),
          new Name("molChl_per_area_membrane"),
        ]),
        new Name("lumen_volume_per_area_membrane"),
      ]),
      texName: "K\\_lumen\\_conc",
    })
    .addAssignment("reg_KEA3_ATP", {
      fn: new Divide([
        new Add([new Num(1.0), new Minus([new Name("c")])]),
        new Add([
          new Num(1.0),
          new Exp(
            new Divide([
              new Add([
                new Name("ATP"),
                new Minus([new Name("ATP_thres_KEA3")]),
              ]),
              new Name("c"),
            ]),
          ),
        ]),
      ]),
      texName: "reg\\_KEA3\\_ATP",
    })
    .addAssignment("reg_KEA3_pH", {
      fn: new Divide([
        new Pow(
          new Num(10.0),
          new Add([new Name("pH_lumen"), new Minus([new Name("pK_KEA3")])]),
        ),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Add([new Name("pH_lumen"), new Minus([new Name("pK_KEA3")])]),
          ),
        ]),
      ]),
      texName: "reg\\_KEA3\\_pH",
    })
    .addAssignment("reg_KEA3", {
      fn: new Mul([new Name("reg_KEA3_ATP"), new Name("reg_KEA3_pH")]),
      texName: "reg\\_KEA3",
    })
    .addReaction("B01", {
      fn: new Mul([new Name("B0"), new Name("pfd")]),
      stoichiometry: [
        { name: "B0", value: new Num(-2.0) },
        { name: "B1", value: new Num(2.0) },
      ],
      texName: "B01",
    })
    .addReaction("B10Q", {
      fn: new Mul([
        new Name("B1"),
        new Add([
          new Name("kH0"),
          new Mul([new Name("Quencher_act"), new Name("kH_Qslope")]),
        ]),
      ]),
      stoichiometry: [
        { name: "B1", value: new Num(-2.0) },
        { name: "B0", value: new Num(2.0) },
      ],
      texName: "B10Q",
    })
    .addReaction("B10F", {
      fn: new Mul([new Name("B1"), new Name("kF")]),
      stoichiometry: [
        { name: "B1", value: new Num(-2.0) },
        { name: "B0", value: new Num(2.0) },
      ],
      texName: "B10F",
    })
    .addReaction("vps2", {
      fn: new Mul([new Num(0.5), new Name("B1"), new Name("kP")]),
      stoichiometry: [
        { name: "B1", value: new Num(-2.0) },
        { name: "B2", value: new Num(2.0) },
        { name: "H_lumen", value: new Divide([new Num(2.0), new Name("bH")]) },
        {
          name: "delta_psi",
          value: new Divide([
            new Mul([new Num(2.0), new Name("volts_per_charge")]),
            new Name("bH"),
          ]),
        },
      ],
      texName: "vps2",
    })
    .addReaction("B20", {
      fn: new Add([
        new Mul([new Name("B2"), new Name("PQ"), new Name("kPQH2")]),
        new Minus([
          new Divide([
            new Mul([new Name("B0"), new Name("PQH2"), new Name("kPQH2")]),
            new Name("Keq_PQH2"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "B2", value: new Num(-2.0) },
        { name: "PQH2", value: new Num(1.0) },
        { name: "B0", value: new Num(2.0) },
      ],
      texName: "B20",
    })
    .addReaction("B23", {
      fn: new Mul([new Name("B2"), new Name("pfd")]),
      stoichiometry: [{ name: "B2", value: new Num(-2.0) }],
      texName: "B23",
    })
    .addReaction("B32F", {
      fn: new Mul([new Name("B3"), new Name("kF")]),
      stoichiometry: [{ name: "B2", value: new Num(2.0) }],
      texName: "B32F",
    })
    .addReaction("B32Q", {
      fn: new Mul([
        new Name("B3"),
        new Add([
          new Name("kH0"),
          new Mul([new Name("Quencher_act"), new Name("kH_Qslope")]),
        ]),
      ]),
      stoichiometry: [{ name: "B2", value: new Num(2.0) }],
      texName: "B32Q",
    })
    .addReaction("vPQox", {
      fn: new Add([
        new Mul([
          new Name("PQH2"),
          new Add([
            new Mul([new Name("O2ex"), new Name("kPTOX")]),
            new Divide([
              new Mul([
                new Name("Keqcytb6f"),
                new Name("k_cytb6f"),
                new Name("pfd"),
              ]),
              new Add([new Num(1.0), new Name("Keqcytb6f")]),
            ]),
          ]),
        ]),
        new Minus([
          new Divide([
            new Mul([
              new Name("k_cytb6f"),
              new Name("pfd"),
              new Add([new Name("PQtot"), new Minus([new Name("PQH2")])]),
            ]),
            new Add([new Num(1.0), new Name("Keqcytb6f")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQH2", value: new Num(-1.0) },
        { name: "H_lumen", value: new Divide([new Num(4.0), new Name("bH")]) },
        {
          name: "delta_psi",
          value: new Divide([
            new Mul([new Num(4.0), new Name("volts_per_charge")]),
            new Name("bH"),
          ]),
        },
      ],
      texName: "vPQox",
    })
    .addReaction("vATPactivity", {
      fn: new Add([
        new Divide([
          new Mul([
            new Name("kActATPase"),
            new Name("pfd"),
            new Add([new Num(1.0), new Minus([new Name("ATPactivity")])]),
          ]),
          new Add([new Num(1e-8), new Name("pfd")]),
        ]),
        new Minus([
          new Divide([
            new Mul([
              new Name("ATPactivity"),
              new Name("kDeactATPase"),
              new Name("pfd"),
            ]),
            new Add([new Num(1e-8), new Name("pfd")]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "ATPactivity", value: new Num(1.0) }],
      texName: "vATPactivity",
    })
    .addReaction("vATPsynthase", {
      fn: new Mul([
        new Name("ATP_pmf_act"),
        new Name("ATPactivity"),
        new Name("kATPsynthase"),
        new Add([
          new Name("ADP"),
          new Minus([new Divide([new Name("ATP"), new Name("KeqATPsyn")])]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "H_lumen",
          value: new Minus([new Divide([new Name("HPR"), new Name("bH")])]),
        },
        { name: "ATP", value: new Num(1.0) },
        {
          name: "delta_psi",
          value: new Minus([
            new Divide([
              new Mul([new Name("HPR"), new Name("volts_per_charge")]),
              new Name("bH"),
            ]),
          ]),
        },
      ],
      texName: "vATPsynthase",
    })
    .addReaction("vATPcons", {
      fn: new Mul([new Name("ATP"), new Name("kATPconsumption")]),
      stoichiometry: [{ name: "ATP", value: new Num(-1.0) }],
      texName: "vATPcons",
    })
    .addReaction("vleak", {
      fn: new Mul([
        new Name("kleak"),
        new Add([
          new Name("H_lumen_conc"),
          new Minus([new Name("H_stroma_conc")]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "H_lumen",
          value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
        },
        {
          name: "delta_psi",
          value: new Minus([
            new Divide([new Name("volts_per_charge"), new Name("bH")]),
          ]),
        },
      ],
      texName: "vleak",
    })
    .addReaction("vXdeepox", {
      fn: new Divide([
        new Mul([
          new Name("Vx"),
          new Name("kDeepoxV"),
          new Pow(new Name("H_lumen"), new Name("nHX")),
        ]),
        new Add([
          new Pow(new Name("H_lumen"), new Name("nHX")),
          new Pow(
            new Divide([
              new Mul([
                new Num(1000.0),
                new Name("lumen_volume_per_area_membrane"),
                new Pow(new Num(10.0), new Minus([new Name("KphSatZ")])),
              ]),
              new Name("molChl_per_area_membrane"),
            ]),
            new Name("nHX"),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "Vx", value: new Num(-1.0) }],
      texName: "vXdeepox",
    })
    .addReaction("vEpoxZ", {
      fn: new Mul([new Name("Zx"), new Name("kEpoxZ")]),
      stoichiometry: [{ name: "Vx", value: new Num(1.0) }],
      texName: "vEpoxZ",
    })
    .addReaction("vPsbSP", {
      fn: new Divide([
        new Mul([
          new Name("PsbS"),
          new Name("kProt"),
          new Pow(new Name("H_lumen"), new Name("nHL")),
        ]),
        new Add([
          new Pow(new Name("H_lumen"), new Name("nHL")),
          new Pow(
            new Divide([
              new Mul([
                new Num(1000.0),
                new Name("lumen_volume_per_area_membrane"),
                new Pow(new Num(10.0), new Minus([new Name("KphSatLHC")])),
              ]),
              new Name("molChl_per_area_membrane"),
            ]),
            new Name("nHL"),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "PsbS", value: new Num(-1.0) }],
      texName: "vPsbSP",
    })
    .addReaction("vPsbS", {
      fn: new Mul([
        new Name("PsbSP"),
        new Name("PsbS_deprot_act"),
        new Name("kDeprot"),
      ]),
      stoichiometry: [{ name: "PsbS", value: new Num(1.0) }],
      texName: "vPsbS",
    })
    .addReaction("vKEA3_in", {
      fn: new Max([
        new Num(0.0),
        new Divide([
          new Mul([
            new Num(1000.0),
            new Name("k_KEA3"),
            new Name("reg_KEA3"),
            new Name("stroma_volume_per_area_membrane"),
            new Add([
              new Mul([new Name("H_lumen_conc"), new Name("K_stroma_conc")]),
              new Minus([
                new Mul([new Name("H_stroma_conc"), new Name("K_lumen_conc")]),
              ]),
            ]),
          ]),
          new Name("molChl_per_area_membrane"),
        ]),
      ]),
      stoichiometry: [
        {
          name: "H_lumen",
          value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
        },
        { name: "K_lumen", value: new Num(1.0) },
        { name: "K_stroma", value: new Num(-1.0) },
      ],
      texName: "vKEA3\\_in",
    })
    .addReaction("vKEA3_out", {
      fn: new Max([
        new Num(0.0),
        new Divide([
          new Mul([
            new Num(1000.0),
            new Name("k_KEA3"),
            new Name("lumen_volume_per_area_membrane"),
            new Name("reg_KEA3"),
            new Add([
              new Mul([new Name("H_stroma_conc"), new Name("K_lumen_conc")]),
              new Minus([
                new Mul([new Name("H_lumen_conc"), new Name("K_stroma_conc")]),
              ]),
            ]),
          ]),
          new Name("molChl_per_area_membrane"),
        ]),
      ]),
      stoichiometry: [
        { name: "H_lumen", value: new Divide([new Num(1.0), new Name("bH")]) },
        { name: "K_lumen", value: new Num(-1.0) },
        { name: "K_stroma", value: new Num(1.0) },
      ],
      texName: "vKEA3\\_out",
    });
}
