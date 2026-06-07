import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("k1", {
      value: 0.344,
      texName: "k1",
    })
    .addParameter("k2", {
      value: 0.046,
      texName: "k2",
    })
    .addParameter("k3", {
      value: 0.0261,
      texName: "k3",
    })
    .addParameter("k4", {
      value: 0.0455,
      texName: "k4",
    })
    .addParameter("k5", {
      value: 0.0455,
      texName: "k5",
    })
    .addParameter("k6", {
      value: 0.455,
      texName: "k6",
    })
    .addParameter("k7", {
      value: 0.455,
      texName: "k7",
    })
    .addParameter("k8", {
      value: 0.909,
      texName: "k8",
    })
    .addParameter("k9", {
      value: 0.0136,
      texName: "k9",
    })
    .addParameter("k10", {
      value: 0.004,
      texName: "k10",
    })
    .addParameter("k11", {
      value: 4e-5,
      texName: "k11",
    })
    .addParameter("k12", {
      value: 0.0341,
      texName: "k12",
    })
    .addParameter("k13", {
      value: 1.7,
      texName: "k13",
    })
    .addParameter("k14", {
      value: 0.000852,
      texName: "k14",
    })
    .addParameter("k15", {
      value: 0.00852,
      texName: "k15",
    })
    .addParameter("k16", {
      value: 0.0928,
      texName: "k16",
    })
    .addParameter("k17", {
      value: 0.0227,
      texName: "k17",
    })
    .addParameter("k18", {
      value: 0.0467,
      texName: "k18",
    })
    .addParameter("k19", {
      value: 0.00114,
      texName: "k19",
    })
    .addParameter("k20", {
      value: 0.0114,
      texName: "k20",
    })
    .addParameter("k21", {
      value: 0.00114,
      texName: "k21",
    })
    .addParameter("k22", {
      value: 0.00114,
      texName: "k22",
    })
    .addParameter("k23", {
      value: 0.0114,
      texName: "k23",
    })
    .addParameter("k24", {
      value: 0.0114,
      texName: "k24",
    })
    .addParameter("kc1", {
      value: 1.0,
      texName: "kc1",
    })
    .addParameter("kc2", {
      value: 0.933,
      texName: "kc2",
    })
    .addParameter("rd", {
      value: 1.1e-5,
      texName: "rd",
    })
    .addParameter("ko1", {
      value: 0.01,
      texName: "ko1",
    })
    .addParameter("ko2", {
      value: 4.31,
      texName: "ko2",
    })
    .addParameter("phic", {
      value: 1.84,
      texName: "phic",
    })
    .addParameter("phio", {
      value: 0.0453,
      texName: "phio",
    })
    .addParameter("phis", {
      value: 0.0001,
      texName: "phis",
    })
    .addParameter("D", {
      value: 0.0001,
      texName: "D",
    })
    .addParameter("E", {
      value: 0.5,
      texName: "E",
    })
    .addParameter("Oa", {
      value: 100.0,
      texName: "Oa",
    })
    .addParameter("Ca", {
      value: 0.45,
      texName: "Ca",
    })
    .addParameter("PAg", {
      value: 0.001,
      texName: "PAg",
    })
    .addParameter("PAr", {
      value: 0.0002,
      texName: "PAr",
    })
    .addParameter("h", {
      value: 0.0002,
      texName: "h",
    })
    .addVariable("RuBP", {
      value: 1.0,
      texName: "RuBP",
    })
    .addVariable("PGA", {
      value: 1.0,
      texName: "PGA",
    })
    .addVariable("ADP", {
      value: 1.0,
      texName: "ADP",
    })
    .addVariable("Pi", {
      value: 10.0,
      texName: "Pi",
    })
    .addVariable("TP", {
      value: 1.0,
      texName: "TP",
    })
    .addVariable("HP", {
      value: 1.0,
      texName: "HP",
    })
    .addVariable("GG", {
      value: 100.0,
      texName: "GG",
    })
    .addVariable("Pio", {
      value: 1.0,
      texName: "Pio",
    })
    .addVariable("TPo", {
      value: 0.1,
      texName: "TPo",
    })
    .addVariable("HPo", {
      value: 0.1,
      texName: "HPo",
    })
    .addVariable("UDP", {
      value: 10.0,
      texName: "UDP",
    })
    .addVariable("GF", {
      value: 77.3,
      texName: "GF",
    })
    .addVariable("GFV", {
      value: 77.3,
      texName: "GFV",
    })
    .addVariable("TPGA", {
      value: 0.1,
      texName: "TPGA",
    })
    .addVariable("E4P", {
      value: 0.1,
      texName: "E4P",
    })
    .addVariable("S7P", {
      value: 0.1,
      texName: "S7P",
    })
    .addVariable("Ru5P", {
      value: 1.0,
      texName: "Ru5P",
    })
    .addVariable("PGl", {
      value: 1.0,
      texName: "PGl",
    })
    .addVariable("Gl", {
      value: 1.0,
      texName: "Gl",
    })
    .addVariable("Gx", {
      value: 1.0,
      texName: "Gx",
    })
    .addVariable("Sn", {
      value: 10.0,
      texName: "Sn",
    })
    .addVariable("Gn", {
      value: 1.0,
      texName: "Gn",
    })
    .addVariable("GA", {
      value: 1.0,
      texName: "GA",
    })
    .addVariable("GmA", {
      value: 1.0,
      texName: "GmA",
    })
    .addVariable("Glm", {
      value: 1.0,
      texName: "Glm",
    })
    .addVariable("OxA", {
      value: 1.0,
      texName: "OxA",
    })
    .addVariable("NH3", {
      value: 1.0,
      texName: "NH3",
    })
    .addVariable("CO2", {
      value: 0.33,
      texName: "CO2",
      slider: { min: "0.1", max: "1.0", step: "0.01" },
    })
    .addVariable("O2", {
      value: 0.245,
      texName: "O2",
    })
    .addVariable("Ci", {
      value: 0.4,
      texName: "Ci",
    })
    .addVariable("Oi", {
      value: 101.0,
      texName: "Oi",
    })
    .addVariable("AP_tot", {
      value: 11.0,
      texName: "AP\\_tot",
    })
    .addVariable("UP_tot", {
      value: 20.0,
      texName: "UP\\_tot",
    })
    .addAssignment("ATP", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("ADP")])]),
      texName: "ATP",
    })
    .addAssignment("UTP", {
      fn: new Add([new Name("UP_tot"), new Minus([new Name("UDP")])]),
      texName: "UTP",
    })
    .addReaction("v1", {
      fn: new Mul([new Name("CO2"), new Name("RuBP"), new Name("k1")]),
      stoichiometry: [
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGA", value: new Num(2.0) },
        { name: "CO2", value: new Num(-1.0) },
        { name: "O2", value: new Num(-0.5) },
      ],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Mul([new Name("ADP"), new Name("Pi"), new Name("k2")]),
      stoichiometry: [
        { name: "ADP", value: new Num(-1.0) },
        { name: "Pi", value: new Num(-1.0) },
      ],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Mul([new Name("ATP"), new Name("PGA"), new Name("k3")]),
      stoichiometry: [
        { name: "PGA", value: new Num(-1.0) },
        { name: "ADP", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "TP", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Mul([new Name("k4"), new Pow(new Name("TP"), new Num(2.0))]),
      stoichiometry: [
        { name: "TP", value: new Num(-2.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "HP", value: new Num(1.0) },
      ],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Mul([new Name("HP"), new Name("k5")]),
      stoichiometry: [
        { name: "HP", value: new Num(-1.0) },
        { name: "TPGA", value: new Num(1.0) },
        { name: "E4P", value: new Num(1.0) },
      ],
      texName: "v5",
    })
    .addReaction("v6", {
      fn: new Mul([new Name("E4P"), new Name("TP"), new Name("k6")]),
      stoichiometry: [
        { name: "E4P", value: new Num(-1.0) },
        { name: "TP", value: new Num(-1.0) },
        { name: "S7P", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
      ],
      texName: "v6",
    })
    .addReaction("v7", {
      fn: new Mul([new Name("S7P"), new Name("k7")]),
      stoichiometry: [
        { name: "S7P", value: new Num(-1.0) },
        { name: "TPGA", value: new Num(1.0) },
        { name: "Ru5P", value: new Num(1.0) },
      ],
      texName: "v7",
    })
    .addReaction("v8", {
      fn: new Mul([new Name("TP"), new Name("TPGA"), new Name("k8")]),
      stoichiometry: [
        { name: "TPGA", value: new Num(-1.0) },
        { name: "TP", value: new Num(-1.0) },
        { name: "Ru5P", value: new Num(1.0) },
      ],
      texName: "v8",
    })
    .addReaction("v9", {
      fn: new Mul([new Name("ATP"), new Name("Ru5P"), new Name("k9")]),
      stoichiometry: [
        { name: "Ru5P", value: new Num(-1.0) },
        { name: "ADP", value: new Num(1.0) },
        { name: "RuBP", value: new Num(1.0) },
      ],
      texName: "v9",
    })
    .addReaction("v10", {
      fn: new Mul([new Name("ATP"), new Name("HP"), new Name("k10")]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "HP", value: new Num(-1.0) },
        { name: "Pi", value: new Num(2.0) },
        { name: "GG", value: new Num(1.0) },
      ],
      texName: "v10",
    })
    .addReaction("v11", {
      fn: new Mul([new Name("GG"), new Name("Pi"), new Name("k11")]),
      stoichiometry: [
        { name: "HP", value: new Num(1.0) },
        { name: "GG", value: new Num(-1.0) },
        { name: "Pi", value: new Num(-1.0) },
      ],
      texName: "v11",
    })
    .addReaction("v12", {
      fn: new Mul([new Name("Pio"), new Name("TP"), new Name("k12")]),
      stoichiometry: [
        { name: "TP", value: new Num(-1.0) },
        { name: "Pio", value: new Num(-1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "TPo", value: new Num(1.0) },
      ],
      texName: "v12",
    })
    .addReaction("v13", {
      fn: new Mul([new Name("k13"), new Pow(new Name("TPo"), new Num(2.0))]),
      stoichiometry: [
        { name: "TPo", value: new Num(-2.0) },
        { name: "Pio", value: new Num(1.0) },
        { name: "HPo", value: new Num(1.0) },
      ],
      texName: "v13",
    })
    .addReaction("v14", {
      fn: new Mul([new Name("Pio"), new Name("UDP"), new Name("k14")]),
      stoichiometry: [
        { name: "UDP", value: new Num(-1.0) },
        { name: "Pio", value: new Num(-1.0) },
      ],
      texName: "v14",
    })
    .addReaction("v15", {
      fn: new Mul([new Name("HPo"), new Name("UTP"), new Name("k15")]),
      stoichiometry: [
        { name: "UDP", value: new Num(1.0) },
        { name: "HPo", value: new Num(-2.0) },
        { name: "Pio", value: new Num(3.0) },
        { name: "GF", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v15",
    })
    .addReaction("v16", {
      fn: new Mul([new Name("O2"), new Name("RuBP"), new Name("k16")]),
      stoichiometry: [
        { name: "O2", value: new Num(-1.0) },
        { name: "RuBP", value: new Num(-1.0) },
        { name: "PGl", value: new Num(1.0) },
        { name: "PGA", value: new Num(1.0) },
      ],
      texName: "v16",
    })
    .addReaction("v17", {
      fn: new Mul([new Name("PGl"), new Name("k17")]),
      stoichiometry: [
        { name: "PGl", value: new Num(-1.0) },
        { name: "Gl", value: new Num(1.0) },
        { name: "Pi", value: new Num(1.0) },
      ],
      texName: "v17",
    })
    .addReaction("v18", {
      fn: new Mul([
        new Name("O2"),
        new Name("k18"),
        new Pow(new Name("Gl"), new Num(2.0)),
      ]),
      stoichiometry: [
        { name: "Gl", value: new Num(-2.0) },
        { name: "Gx", value: new Num(2.0) },
      ],
      texName: "v18",
    })
    .addReaction("v19", {
      fn: new Mul([new Name("Gx"), new Name("Sn"), new Name("k19")]),
      stoichiometry: [
        { name: "Gx", value: new Num(-1.0) },
        { name: "Sn", value: new Num(-1.0) },
        { name: "Gn", value: new Num(1.0) },
        { name: "GA", value: new Num(1.0) },
      ],
      texName: "v19",
    })
    .addReaction("v20", {
      fn: new Mul([new Name("k20"), new Pow(new Name("Gn"), new Num(2.0))]),
      stoichiometry: [
        { name: "Gn", value: new Num(-2.0) },
        { name: "Sn", value: new Num(1.0) },
        { name: "NH3", value: new Num(1.0) },
        { name: "CO2", value: new Num(1.0) },
        { name: "O2", value: new Num(-0.5) },
      ],
      texName: "v20",
    })
    .addReaction("v21", {
      fn: new Mul([new Name("ATP"), new Name("GA"), new Name("k21")]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "GA", value: new Num(-1.0) },
        { name: "PGA", value: new Num(1.0) },
      ],
      texName: "v21",
    })
    .addReaction("v22", {
      fn: new Mul([
        new Name("ATP"),
        new Name("GmA"),
        new Name("NH3"),
        new Name("k22"),
      ]),
      stoichiometry: [
        { name: "ADP", value: new Num(1.0) },
        { name: "GmA", value: new Num(-1.0) },
        { name: "NH3", value: new Num(-1.0) },
        { name: "Pi", value: new Num(1.0) },
        { name: "Glm", value: new Num(1.0) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "v22",
    })
    .addReaction("v23", {
      fn: new Mul([new Name("Glm"), new Name("OxA"), new Name("k23")]),
      stoichiometry: [
        { name: "Glm", value: new Num(-1.0) },
        { name: "OxA", value: new Num(-1.0) },
        { name: "GmA", value: new Num(2.0) },
      ],
      texName: "v23",
    })
    .addReaction("v24", {
      fn: new Mul([new Name("GmA"), new Name("Gx"), new Name("k24")]),
      stoichiometry: [
        { name: "Gx", value: new Num(-1.0) },
        { name: "GmA", value: new Num(-1.0) },
        { name: "Gn", value: new Num(1.0) },
        { name: "OxA", value: new Num(1.0) },
      ],
      texName: "v24",
    })
    .addReaction("vrd", {
      fn: new Mul([new Name("GF"), new Name("rd")]),
      stoichiometry: [
        { name: "GF", value: new Num(-1.0) },
        { name: "CO2", value: new Num(12.0) },
        { name: "O2", value: new Num(-12.0) },
      ],
      texName: "vrd",
    })
    .addReaction("vphis", {
      fn: new Mul([
        new Name("phis"),
        new Add([new Name("GF"), new Minus([new Name("E")])]),
      ]),
      stoichiometry: [{ name: "GF", value: new Num(-1.0) }],
      texName: "vphis",
    })
    .addReaction("vD", {
      fn: new Mul([
        new Name("D"),
        new Add([new Name("GF"), new Minus([new Name("GFV")])]),
      ]),
      stoichiometry: [
        { name: "GF", value: new Num(-1.0) },
        { name: "GFV", value: new Num(1.0) },
      ],
      texName: "vD",
    })
    .addReaction("vc1", {
      fn: new Mul([new Name("Ci"), new Name("kc1")]),
      stoichiometry: [
        { name: "Ci", value: new Num(-1.0) },
        { name: "CO2", value: new Num(1.0) },
      ],
      texName: "vc1",
    })
    .addReaction("vc2", {
      fn: new Mul([new Name("CO2"), new Name("kc2")]),
      stoichiometry: [
        { name: "CO2", value: new Num(-1.0) },
        { name: "Ci", value: new Num(1.0) },
      ],
      texName: "vc2",
    })
    .addReaction("vo1", {
      fn: new Mul([new Name("Oi"), new Name("ko1")]),
      stoichiometry: [
        { name: "Oi", value: new Num(-1.0) },
        { name: "O2", value: new Num(1.0) },
      ],
      texName: "vo1",
    })
    .addReaction("vo2", {
      fn: new Mul([new Name("O2"), new Name("ko2")]),
      stoichiometry: [
        { name: "O2", value: new Num(-1.0) },
        { name: "Oi", value: new Num(1.0) },
      ],
      texName: "vo2",
    })
    .addReaction("vphic", {
      fn: new Mul([
        new Name("phic"),
        new Add([new Name("Ca"), new Minus([new Name("Ci")])]),
      ]),
      stoichiometry: [{ name: "Ci", value: new Num(1.0) }],
      texName: "vphic",
    })
    .addReaction("vphio", {
      fn: new Mul([
        new Name("phio"),
        new Add([new Name("Oa"), new Minus([new Name("Oi")])]),
      ]),
      stoichiometry: [{ name: "Oi", value: new Num(1.0) }],
      texName: "vphio",
    });
}
