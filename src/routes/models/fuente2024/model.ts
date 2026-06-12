import { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Cos,
  Divide,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("stoic_PSII", {
      value: 1.0,
      texName: "stoic\\_PSII",
    })
    .addParameter("stoic_PSI", {
      value: 1.0,
      texName: "stoic\\_PSI",
    })
    .addParameter("PQ_tot", {
      value: 7.0,
      texName: "PQ\\_tot",
    })
    .addParameter("H_stroma", {
      value: 0.015848931924611134,
      texName: "H\\_stroma",
    })
    .addParameter("AP_tot", {
      value: 1000.0,
      texName: "AP\\_tot",
    })
    .addParameter("V_lumen", {
      value: 2.62e-21,
      texName: "V\\_lumen",
    })
    .addParameter("V_stroma", {
      value: 2.09e-20,
      texName: "V\\_stroma",
    })
    .addParameter("sigma_PSI_0", {
      value: 1.0,
      texName: "sigma\\_PSI\\_0",
    })
    .addParameter("k1p", {
      value: 25000.0,
      texName: "k1p",
    })
    .addParameter("k1m", {
      value: 2500.0,
      texName: "k1m",
    })
    .addParameter("k2p", {
      value: 100.0,
      texName: "k2p",
    })
    .addParameter("k2m", {
      value: 10.0,
      texName: "k2m",
    })
    .addParameter("k3", {
      value: 0.05,
      texName: "k3",
    })
    .addParameter("k4", {
      value: 0.004,
      texName: "k4",
    })
    .addParameter("k5", {
      value: 100.0,
      texName: "k5",
    })
    .addParameter("k6", {
      value: 10.0,
      texName: "k6",
    })
    .addParameter("k7", {
      value: 500.0,
      texName: "k7",
    })
    .addParameter("k_X", {
      value: 1.0,
      texName: "k\\_X",
    })
    .addParameter("L_PSI", {
      value: 10000.0,
      texName: "L\\_PSI",
    })
    .addParameter("bH", {
      value: 0.01,
      texName: "bH",
    })
    .addParameter("NPQ_max", {
      value: 0.6,
      texName: "NPQ\\_max",
    })
    .addParameter("cEqP", {
      value: 4.3e-8,
      texName: "cEqP",
    })
    .addParameter("keq_NPQ", {
      value: 1.0,
      texName: "keq\\_NPQ",
    })
    .addParameter("n_NPQ", {
      value: 5.3,
      texName: "n\\_NPQ",
    })
    .addParameter("N_A", {
      value: 6.02214076e17,
      texName: "N\\_A",
    })
    .addParameter("PPFD", {
      value: 50.0,
      texName: "PPFD",
    })
    .addParameter("PPFD_add", {
      value: 0.0,
      texName: "PPFD\\_add",
    })
    .addParameter("f", {
      value: 1.0,
      texName: "f",
    })
    .addParameter("PSI_total", {
      value: 1.0,
      texName: "PSI\\_total",
    })
    .addParameter("Fluo_0", {
      value: 0.25,
      texName: "Fluo\\_0",
    })
    .addParameter("Q_total", {
      value: 1.0,
      texName: "Q\\_total",
    })
    .addVariable("Q_active", {
      value: 1.6044277821745498e-23,
      texName: "Q\\_active",
    })
    .addVariable("PQ", {
      value: 3.537090541057567,
      texName: "PQ",
    })
    .addVariable("PSI_ox", {
      value: 0.197310072778891,
      texName: "PSI\\_ox",
    })
    .addVariable("H_lumen", {
      value: 0.4120700665522831,
      texName: "H\\_lumen",
    })
    .addVariable("ATP_st", {
      value: 144.95412072145785,
      texName: "ATP\\_st",
    })
    .addAssignment("Q_inactive", {
      fn: new Add([new Name("Q_total"), new Minus([new Name("Q_active")])]),
      texName: "Q\\_inactive",
    })
    .addAssignment("PQH_2", {
      fn: new Add([new Name("PQ_tot"), new Minus([new Name("PQ")])]),
      texName: "PQH\\_2",
    })
    .addAssignment("PSI_red", {
      fn: new Add([new Name("PSI_total"), new Minus([new Name("PSI_ox")])]),
      texName: "PSI\\_red",
    })
    .addAssignment("ADP_st", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("ATP_st")])]),
      texName: "ADP\\_st",
    })
    .addAssignment("osc_light", {
      fn: new Add([
        new Name("PPFD"),
        new Mul([
          new Name("PPFD_add"),
          new Cos(
            new Mul([
              new Num(2.0),
              new Num(3.141592653589793),
              new Name("f"),
              new Name("time"),
            ]),
          ),
        ]),
      ]),
      texName: "osc\\_light",
    })
    .addAssignment("sigma_PSII", {
      fn: new Add([
        new Num(1.0),
        new Minus([new Mul([new Name("NPQ_max"), new Name("Q_active")])]),
      ]),
      texName: "sigma\\_PSII",
    })
    .addAssignment("RCII_closed", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Divide([
            new Mul([new Name("PQ"), new Name("k1p")]),
            new Add([
              new Mul([new Name("PQH_2"), new Name("k1m")]),
              new Mul([new Name("osc_light"), new Name("sigma_PSII")]),
            ]),
          ]),
        ]),
      ]),
      texName: "RCII\\_closed",
    })
    .addAssignment("RCII_open", {
      fn: new Divide([
        new Mul([new Name("PQ"), new Name("k1p")]),
        new Add([
          new Name("sigma_PSII"),
          new Mul([new Name("PQ"), new Name("k1p")]),
          new Mul([new Name("PQH_2"), new Name("k1m")]),
        ]),
      ]),
      texName: "RCII\\_open",
    })
    .addAssignment("Fluo", {
      fn: new Mul([
        new Name("sigma_PSII"),
        new Add([new Name("Fluo_0"), new Name("RCII_closed")]),
      ]),
      texName: "Fluo",
    })
    .addAssignment("NPQ", {
      fn: new Divide([
        new Mul([new Name("NPQ_max"), new Name("Q_active")]),
        new Add([
          new Num(1.0),
          new Minus([new Mul([new Name("NPQ_max"), new Name("Q_active")])]),
        ]),
      ]),
      texName: "NPQ",
    })
    .addAssignment("O2", {
      fn: new Mul([
        new Num(0.25),
        new Name("PSI_total"),
        new Add([
          new Mul([new Name("PQ"), new Name("RCII_closed"), new Name("k1p")]),
          new Minus([
            new Mul([
              new Name("PQH_2"),
              new Name("k1m"),
              new Add([new Num(1.0), new Minus([new Name("RCII_closed")])]),
            ]),
          ]),
        ]),
      ]),
      texName: "O2",
    })
    .addReaction("v_PSII_O2", {
      fn: new Mul([
        new Name("osc_light"),
        new Name("sigma_PSII"),
        new Name("stoic_PSII"),
        new Add([new Num(1.0), new Minus([new Name("RCII_closed")])]),
      ]),
      stoichiometry: [
        {
          name: "H_lumen",
          value: new Divide([
            new Name("bH"),
            new Mul([new Name("N_A"), new Name("V_lumen")]),
          ]),
        },
      ],
      texName: "v\\_PSII\\_O2",
    })
    .addReaction("v_PSI", {
      fn: new Divide([
        new Mul([
          new Name("L_PSI"),
          new Name("osc_light"),
          new Name("sigma_PSI_0"),
          new Name("stoic_PSI"),
          new Add([new Name("stoic_PSI"), new Minus([new Name("PSI_ox")])]),
        ]),
        new Add([new Name("L_PSI"), new Name("osc_light")]),
      ]),
      stoichiometry: [{ name: "PSI_ox", value: new Num(1.0) }],
      texName: "v\\_PSI",
    })
    .addReaction("v_PSII_PQ", {
      fn: new Add([
        new Mul([new Name("PQ"), new Name("RCII_closed"), new Name("k1p")]),
        new Minus([
          new Mul([new Name("PQH_2"), new Name("RCII_open"), new Name("k1m")]),
        ]),
      ]),
      stoichiometry: [{ name: "PQ", value: new Num(-0.5) }],
      texName: "v\\_PSII\\_PQ",
    })
    .addReaction("v_PQH2_PSI", {
      fn: new Add([
        new Mul([new Name("PQH_2"), new Name("PSI_ox"), new Name("k2p")]),
        new Minus([
          new Mul([new Name("PQ"), new Name("PSI_red"), new Name("k2m")]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQ", value: new Num(0.5) },
        { name: "PSI_ox", value: new Num(-1.0) },
        {
          name: "H_lumen",
          value: new Divide([
            new Name("bH"),
            new Mul([new Name("N_A"), new Name("V_lumen")]),
          ]),
        },
      ],
      texName: "v\\_PQH2\\_PSI",
    })
    .addReaction("v3", {
      fn: new Divide([
        new Mul([
          new Name("k3"),
          new Add([new Num(1.0), new Minus([new Name("Q_active")])]),
        ]),
        new Add([
          new Num(1.0),
          new Pow(
            new Divide([new Name("keq_NPQ"), new Name("H_lumen")]),
            new Name("n_NPQ"),
          ),
        ]),
      ]),
      stoichiometry: [{ name: "Q_active", value: new Num(1.0) }],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Mul([new Name("Q_active"), new Name("k4")]),
      stoichiometry: [{ name: "Q_active", value: new Num(-1.0) }],
      texName: "v4",
    })
    .addReaction("v_ATPsynth", {
      fn: new Mul([
        new Name("k5"),
        new Add([
          new Name("ADP_st"),
          new Minus([
            new Divide([
              new Mul([
                new Name("ATP_st"),
                new Pow(
                  new Divide([new Name("H_stroma"), new Name("H_lumen")]),
                  new Num(4.666666666666667),
                ),
              ]),
              new Name("cEqP"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "ATP_st", value: new Num(1.0) },
        {
          name: "H_lumen",
          value: new Minus([
            new Divide([
              new Mul([
                new Num(4.666666666666667),
                new Name("V_stroma"),
                new Name("bH"),
              ]),
              new Name("V_lumen"),
            ]),
          ]),
        },
      ],
      texName: "v\\_ATPsynth",
    })
    .addReaction("v_ATPcons", {
      fn: new Mul([new Name("ATP_st"), new Name("k6")]),
      stoichiometry: [{ name: "ATP_st", value: new Num(-1.0) }],
      texName: "v\\_ATPcons",
    })
    .addReaction("v_Leak", {
      fn: new Mul([
        new Name("k7"),
        new Add([new Name("H_lumen"), new Minus([new Name("H_stroma")])]),
      ]),
      stoichiometry: [{ name: "H_lumen", value: new Num(-1.0) }],
      texName: "v\\_Leak",
    })
    .addReaction("v_PQ", {
      fn: new Mul([new Name("PQH_2"), new Name("k_X")]),
      stoichiometry: [{ name: "PQ", value: new Num(1.0) }],
      texName: "v\\_PQ",
    });
}
