import { SteadyStateModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  GreaterEqual,
  GreaterThan,
  Max,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
  Pow,
  Sqrt,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): SteadyStateModelBuilder {
  return new SteadyStateModelBuilder()
    .addCustomUnit("mol_ATP", {
      symbol: "mol ATP",
      tex: "\\mathrm{mol\\,ATP}",
      description: "mole of ATP",
    })
    .addCustomUnit("mol_CO2", {
      symbol: "mol CO₂",
      tex: "\\mathrm{mol\\,CO_2}",
      description: "mole of CO2",
    })
    .addCustomUnit("mol_O2", {
      symbol: "mol O₂",
      tex: "\\mathrm{mol\\,O_2}",
      description: "mole of O2",
    })
    .addCustomUnit("mol_e", {
      symbol: "mol e⁻",
      tex: "\\mathrm{mol\\,e^{-}}",
      description: "mole of electrons",
    })
    .addCustomUnit("mol_sites", {
      symbol: "mol sites",
      tex: "\\mathrm{mol\\,sites}",
      description: "mole of reaction sites",
    })
    .addParameter("PAR", {
      value: 800,
      displayName: "PAR",
      texName: "\\mathrm{PAR}",
      unit: "umol m^-2 s^-1",
      slider: { min: "0", max: "2400", step: "10" },
    })
    .addParameter("Temp", { value: 25, texName: "T", unit: "°C" })
    .addParameter("CO2", {
      value: 200,
      displayName: "CO2",
      unit: "ubar",
      texName: "\\mathrm{CO_2}",
    })
    .addParameter("O2", {
      value: 209,
      displayName: "O2",
      unit: "mbar",
      texName: "\\mathrm{O_2}",
    })
    .addParameter("Abs", {
      value: 0.85,
      texName: "\\mathrm{Abs}",
      unit: "mol mol^-1",
    })
    .addParameter("beta", {
      value: 0.52,
      texName: "\\beta",
      unit: "mol mol^-1",
    })
    .addParameter("CB6F", {
      value: 0.0000011666666666666668,
      unit: "mol_sites m^-2",
      texName: "\\mathrm{CB6F}",
    })
    .addParameter("RUB", {
      value: 0.00002777777777777778,
      unit: "mol_sites m^-2",
      texName: "\\mathrm{RUB}",
    })
    .addParameter("Rds", {
      value: 0.01,
      texName: "R_{ds}",
      unit: "dimensionless",
    })
    .addParameter("Ku2", { value: 0, texName: "K_{u2}", unit: "s^-1" })
    .addParameter("theta1", {
      value: 1,
      texName: "\\theta_1",
      unit: "dimensionless",
    })
    .addParameter("eps1", {
      value: 0,
      texName: "\\epsilon_1",
      unit: "mol mol^-1",
    })
    .addParameter("eps2", {
      value: 1,
      texName: "\\epsilon_2",
      unit: "mol mol^-1",
    })
    .addParameter("nl", {
      value: 0.75,
      texName: "n_l",
      unit: "mol_ATP mol_e^-1",
    })
    .addParameter("nc", {
      value: 1,
      texName: "n_c",
      unit: "mol_ATP mol_e^-1",
    })
    .addParameter("Kf", { value: 50000000, texName: "K_f", unit: "s^-1" })
    .addParameter("Kd", { value: 550000000, texName: "K_d", unit: "s^-1" })
    .addParameter("Kp1", {
      value: 14500000000,
      texName: "K_{p1}",
      unit: "s^-1",
    })
    .addParameter("Kn1", {
      value: 14500000000,
      texName: "K_{n1}",
      unit: "s^-1",
    })
    .addParameter("Kp2", {
      value: 4500000000,
      texName: "K_{p2}",
      unit: "s^-1",
    })
    .addParameter("kq", {
      value: 300,
      texName: "k_q",
      unit: "mol_e mol_sites^-1 s^-1",
    })
    .addParameter("kc", {
      value: 3.6,
      texName: "k_c",
      unit: "mol_CO2 mol_sites^-1 s^-1",
    })
    .addParameter("ko", {
      value: 0.9720000000000001,
      texName: "k_o",
      unit: "mol_O2 mol_sites^-1 s^-1",
    })
    .addParameter("Kc", { value: 0.00026, texName: "K_c", unit: "bar" })
    .addParameter("Ko", { value: 0.179, texName: "K_o", unit: "bar" })
    .addAssignment("Q", {
      fn: new Divide([new Name("PAR"), new Num(1000000)]),
      unit: "mol m^-2 s^-1",
      displayName: "Q",
    })
    .addAssignment("C", {
      fn: new Divide([new Name("CO2"), new Num(1000000)]),
      unit: "bar",
      displayName: "C",
    })
    .addAssignment("O_bar", {
      fn: new Divide([new Name("O2"), new Num(1000)]),
      unit: "bar",
      displayName: "O",
    })
    .addAssignment("Vqmax", {
      fn: new Mul([new Name("CB6F"), new Name("kq")]),
      unit: "mol_e m^-2 s^-1",
      displayName: "Vqmax",
      texName: "V_{qmax}",
    })
    .addAssignment("Vcmax", {
      fn: new Mul([new Name("RUB"), new Name("kc")]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Vcmax",
      texName: "V_{cmax}",
    })
    .addAssignment("Rd", {
      fn: new Mul([new Name("Vcmax"), new Name("Rds")]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Rd",
      texName: "R_d",
    })
    .addAssignment("S", {
      fn: new Mul([
        new Divide([new Name("kc"), new Name("Kc")]),
        new Divide([new Name("Ko"), new Name("ko")]),
      ]),
      unit: "mol mol^-1",
      displayName: "S",
    })
    .addAssignment("gammas", {
      fn: new Divide([new Name("O_bar"), new Mul([new Num(2), new Name("S")])]),
      unit: "bar",
      displayName: "gammas",
      texName: "\\Gamma^*",
    })
    .addAssignment("eta", {
      fn: new Add([
        new Minus([new Num(1), new Divide([new Name("nl"), new Name("nc")])]),
        new Divide([
          new Add([
            new Num(3),
            new Divide([
              new Mul([new Num(7), new Name("gammas")]),
              new Name("C"),
            ]),
          ]),
          new Mul([
            new Add([
              new Num(4),
              new Divide([
                new Mul([new Num(8), new Name("gammas")]),
                new Name("C"),
              ]),
            ]),
            new Name("nc"),
          ]),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "eta",
      texName: "\\eta",
    })
    .addAssignment("phi1P_max", {
      fn: new Divide([
        new Name("Kp1"),
        new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
      ]),
      unit: "dimensionless",
      displayName: "phi1P_max",
    })
    .addAssignment("a2", {
      fn: new Mul([new Name("Abs"), new Name("beta")]),
      unit: "mol mol^-1",
      displayName: "a2",
    })
    .addAssignment("a1", {
      fn: new Minus([new Name("Abs"), new Name("a2")]),
      unit: "mol mol^-1",
      displayName: "a1",
    })
    .addAssignment("JP700_j", {
      fn: new Divide([
        new Mul([new Name("Q"), new Name("Vqmax")]),
        new Add([
          new Name("Q"),
          new Divide([
            new Name("Vqmax"),
            new Mul([new Name("a1"), new Name("phi1P_max")]),
          ]),
        ]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP700_j",
    })
    .addAssignment("JP680_j", {
      fn: new Divide([new Name("JP700_j"), new Name("eta")]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP680_j",
    })
    .addAssignment("Vc_j", {
      fn: new Divide([
        new Name("JP680_j"),
        new Mul([
          new Num(4),
          new Add([
            new Num(1),
            new Divide([
              new Mul([new Num(2), new Name("gammas")]),
              new Name("C"),
            ]),
          ]),
        ]),
      ]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Vc_j",
    })
    .addAssignment("Vo_j", {
      fn: new Divide([
        new Mul([new Name("Vc_j"), new Num(2), new Name("gammas")]),
        new Name("C"),
      ]),
      unit: "mol_O2 m^-2 s^-1",
      displayName: "Vo_j",
    })
    .addAssignment("Ag_j", {
      fn: new Minus([
        new Name("Vc_j"),
        new Divide([new Name("Vo_j"), new Num(2)]),
      ]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Ag_j",
    })
    .addAssignment("Vc_c", {
      fn: new Divide([
        new Mul([new Name("C"), new Name("Vcmax")]),
        new Add([
          new Name("C"),
          new Mul([
            new Name("Kc"),
            new Add([
              new Num(1),
              new Divide([new Name("O_bar"), new Name("Ko")]),
            ]),
          ]),
        ]),
      ]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Vc_c",
    })
    .addAssignment("Vo_c", {
      fn: new Divide([
        new Mul([new Name("Vc_c"), new Num(2), new Name("gammas")]),
        new Name("C"),
      ]),
      unit: "mol_O2 m^-2 s^-1",
      displayName: "Vo_c",
    })
    .addAssignment("Ag_c", {
      fn: new Minus([
        new Name("Vc_c"),
        new Divide([new Name("Vo_c"), new Num(2)]),
      ]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Ag_c",
    })
    .addAssignment("JP680_c", {
      fn: new Divide([
        new Mul([
          new Name("Ag_c"),
          new Num(4),
          new Add([
            new Num(1),
            new Divide([
              new Mul([new Num(2), new Name("gammas")]),
              new Name("C"),
            ]),
          ]),
        ]),
        new Minus([
          new Num(1),
          new Divide([new Name("gammas"), new Name("C")]),
        ]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP680_c",
    })
    .addAssignment("JP700_c", {
      fn: new Mul([new Name("JP680_c"), new Name("eta")]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP700_c",
    })
    .addAssignment("JP680_a", {
      fn: new Min([
        new Divide([
          new Add([
            new Add([new Name("JP680_j"), new Name("JP680_c")]),
            new Sqrt(
              new Max([
                new Minus([
                  new Pow(
                    new Add([new Name("JP680_j"), new Name("JP680_c")]),
                    new Num(2),
                  ),
                  new Mul([
                    new Num(4),
                    new Name("theta1"),
                    new Name("JP680_j"),
                    new Name("JP680_c"),
                  ]),
                ]),
                new Num(0),
              ]),
              new Num(2),
            ),
          ]),
          new Mul([new Num(2), new Name("theta1")]),
        ]),
        new Divide([
          new Minus([
            new Add([new Name("JP680_j"), new Name("JP680_c")]),
            new Sqrt(
              new Max([
                new Minus([
                  new Pow(
                    new Add([new Name("JP680_j"), new Name("JP680_c")]),
                    new Num(2),
                  ),
                  new Mul([
                    new Num(4),
                    new Name("theta1"),
                    new Name("JP680_j"),
                    new Name("JP680_c"),
                  ]),
                ]),
                new Num(0),
              ]),
              new Num(2),
            ),
          ]),
          new Mul([new Num(2), new Name("theta1")]),
        ]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP680_a",
    })
    .addAssignment("JP700_a", {
      fn: new Min([
        new Divide([
          new Add([
            new Add([new Name("JP700_j"), new Name("JP700_c")]),
            new Sqrt(
              new Max([
                new Minus([
                  new Pow(
                    new Add([new Name("JP700_j"), new Name("JP700_c")]),
                    new Num(2),
                  ),
                  new Mul([
                    new Num(4),
                    new Name("theta1"),
                    new Name("JP700_j"),
                    new Name("JP700_c"),
                  ]),
                ]),
                new Num(0),
              ]),
              new Num(2),
            ),
          ]),
          new Mul([new Num(2), new Name("theta1")]),
        ]),
        new Divide([
          new Minus([
            new Add([new Name("JP700_j"), new Name("JP700_c")]),
            new Sqrt(
              new Max([
                new Minus([
                  new Pow(
                    new Add([new Name("JP700_j"), new Name("JP700_c")]),
                    new Num(2),
                  ),
                  new Mul([
                    new Num(4),
                    new Name("theta1"),
                    new Name("JP700_j"),
                    new Name("JP700_c"),
                  ]),
                ]),
                new Num(0),
              ]),
              new Num(2),
            ),
          ]),
          new Mul([new Num(2), new Name("theta1")]),
        ]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "JP700_a",
    })
    .addAssignment("Ag_a", {
      fn: new Piecewise([
        new Min([
          new Divide([
            new Add([
              new Add([new Name("Ag_j"), new Name("Ag_c")]),
              new Sqrt(
                new Max([
                  new Minus([
                    new Pow(
                      new Add([new Name("Ag_j"), new Name("Ag_c")]),
                      new Num(2),
                    ),
                    new Mul([
                      new Num(4),
                      new Name("theta1"),
                      new Name("Ag_j"),
                      new Name("Ag_c"),
                    ]),
                  ]),
                  new Num(0),
                ]),
                new Num(2),
              ),
            ]),
            new Mul([new Num(2), new Name("theta1")]),
          ]),
          new Divide([
            new Minus([
              new Add([new Name("Ag_j"), new Name("Ag_c")]),
              new Sqrt(
                new Max([
                  new Minus([
                    new Pow(
                      new Add([new Name("Ag_j"), new Name("Ag_c")]),
                      new Num(2),
                    ),
                    new Mul([
                      new Num(4),
                      new Name("theta1"),
                      new Name("Ag_j"),
                      new Name("Ag_c"),
                    ]),
                  ]),
                  new Num(0),
                ]),
                new Num(2),
              ),
            ]),
            new Mul([new Num(2), new Name("theta1")]),
          ]),
        ]),
        new GreaterThan([new Name("C"), new Name("gammas")]),
        new Max([
          new Divide([
            new Add([
              new Add([new Name("Ag_j"), new Name("Ag_c")]),
              new Sqrt(
                new Max([
                  new Minus([
                    new Pow(
                      new Add([new Name("Ag_j"), new Name("Ag_c")]),
                      new Num(2),
                    ),
                    new Mul([
                      new Num(4),
                      new Name("theta1"),
                      new Name("Ag_j"),
                      new Name("Ag_c"),
                    ]),
                  ]),
                  new Num(0),
                ]),
                new Num(2),
              ),
            ]),
            new Mul([new Num(2), new Name("theta1")]),
          ]),
          new Divide([
            new Minus([
              new Add([new Name("Ag_j"), new Name("Ag_c")]),
              new Sqrt(
                new Max([
                  new Minus([
                    new Pow(
                      new Add([new Name("Ag_j"), new Name("Ag_c")]),
                      new Num(2),
                    ),
                    new Mul([
                      new Num(4),
                      new Name("theta1"),
                      new Name("Ag_j"),
                      new Name("Ag_c"),
                    ]),
                  ]),
                  new Num(0),
                ]),
                new Num(2),
              ),
            ]),
            new Mul([new Num(2), new Name("theta1")]),
          ]),
        ]),
      ]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "Ag_a",
      texName: "A_g",
    })
    .addAssignment("An_a", {
      fn: new Minus([new Name("Ag_a"), new Name("Rd")]),
      unit: "mol_CO2 m^-2 s^-1",
      displayName: "An_a",
      texName: "A_n",
    })
    .addAssignment("phi1P_a0", {
      fn: new Divide([
        new Name("JP700_a"),
        new Mul([new Name("Q"), new Name("a1")]),
      ]),
      unit: "dimensionless",
    })
    .addAssignment("q1_a", {
      fn: new Divide([new Name("phi1P_a0"), new Name("phi1P_max")]),
      unit: "dimensionless",
      displayName: "q1_a",
    })
    .addAssignment("phi2P_a0", {
      fn: new Divide([
        new Name("JP680_a"),
        new Mul([new Name("Q"), new Name("a2")]),
      ]),
      unit: "dimensionless",
    })
    .addAssignment("CB6F_a", {
      fn: new Divide([new Name("JP700_j"), new Name("kq")]),
      unit: "mol_sites m^-2",
      displayName: "CB6F_a",
    })
    .addAssignment("q2_a", {
      fn: new Min([
        new Max([
          new Minus([
            new Num(1),
            new Divide([new Name("CB6F_a"), new Name("CB6F")]),
          ]),
          new Num(0),
        ]),
        new Num(1),
      ]),
      unit: "dimensionless",
      displayName: "q2_a",
    })
    .addAssignment("num_kn", {
      fn: new Max([
        new Add([
          new Minus([
            new Add([
              new Minus([
                new Mul([
                  new Pow(new Name("Kp2"), new Num(2)),
                  new Pow(new Name("phi2P_a0"), new Num(2)),
                ]),
                new Mul([
                  new Num(2),
                  new Pow(new Name("Kp2"), new Num(2)),
                  new Name("phi2P_a0"),
                  new Name("q2_a"),
                ]),
              ]),
              new Mul([
                new Pow(new Name("Kp2"), new Num(2)),
                new Pow(new Name("q2_a"), new Num(2)),
              ]),
            ]),
            new Mul([
              new Num(4),
              new Name("Kp2"),
              new Name("Ku2"),
              new Pow(new Name("phi2P_a0"), new Num(2)),
              new Name("q2_a"),
            ]),
          ]),
          new Mul([
            new Num(2),
            new Name("Kp2"),
            new Name("Ku2"),
            new Pow(new Name("phi2P_a0"), new Num(2)),
          ]),
          new Mul([
            new Num(2),
            new Name("Kp2"),
            new Name("Ku2"),
            new Name("phi2P_a0"),
            new Name("q2_a"),
          ]),
          new Mul([
            new Pow(new Name("Ku2"), new Num(2)),
            new Pow(new Name("phi2P_a0"), new Num(2)),
          ]),
        ]),
        new Num(0),
      ]),
      unit: "s^-2",
    })
    .addAssignment("Kn2_a", {
      fn: new Minus([
        new Divide([
          new Add([
            new Minus([
              new Sqrt(new Name("num_kn"), new Num(2)),
              new Mul([new Name("Kp2"), new Name("phi2P_a0")]),
            ]),
            new Mul([new Name("Ku2"), new Name("phi2P_a0")]),
            new Mul([new Name("Kp2"), new Name("q2_a")]),
          ]),
          new Mul([new Num(2), new Name("phi2P_a0")]),
        ]),
        new Name("Kf"),
        new Name("Ku2"),
        new Name("Kd"),
      ]),
      unit: "s^-1",
      displayName: "Kn2_a",
      texName: "K_{n2}",
    })
    .addAssignment("denom2", {
      fn: new Add([
        new Name("Kp2"),
        new Name("Kn2_a"),
        new Name("Kd"),
        new Name("Kf"),
        new Name("Ku2"),
      ]),
      unit: "s^-1",
    })
    .addAssignment("denom2c", {
      fn: new Add([
        new Name("Kn2_a"),
        new Name("Kd"),
        new Name("Kf"),
        new Name("Ku2"),
      ]),
      unit: "s^-1",
    })
    .addAssignment("phi2p_a", {
      fn: new Divide([
        new Mul([new Name("q2_a"), new Name("Kp2")]),
        new Name("denom2"),
      ]),
      unit: "dimensionless",
      displayName: "phi2p_a",
    })
    .addAssignment("phi2n_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q2_a"), new Name("Kn2_a")]),
          new Name("denom2"),
        ]),
        new Divide([
          new Mul([
            new Minus([new Num(1), new Name("q2_a")]),
            new Name("Kn2_a"),
          ]),
          new Name("denom2c"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi2n_a",
    })
    .addAssignment("phi2d_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q2_a"), new Name("Kd")]),
          new Name("denom2"),
        ]),
        new Divide([
          new Mul([new Minus([new Num(1), new Name("q2_a")]), new Name("Kd")]),
          new Name("denom2c"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi2d_a",
    })
    .addAssignment("phi2f_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q2_a"), new Name("Kf")]),
          new Name("denom2"),
        ]),
        new Divide([
          new Mul([new Minus([new Num(1), new Name("q2_a")]), new Name("Kf")]),
          new Name("denom2c"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi2f_a",
    })
    .addAssignment("phi2u_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q2_a"), new Name("Ku2")]),
          new Name("denom2"),
        ]),
        new Divide([
          new Mul([new Minus([new Num(1), new Name("q2_a")]), new Name("Ku2")]),
          new Name("denom2c"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi2u_a",
    })
    .addAssignment("phi2P_a", {
      fn: new Divide([
        new Name("phi2p_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      unit: "dimensionless",
      displayName: "phi2P_a",
    })
    .addAssignment("phi2N_a", {
      fn: new Divide([
        new Name("phi2n_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      unit: "dimensionless",
      displayName: "phi2N_a",
    })
    .addAssignment("phi2D_a", {
      fn: new Divide([
        new Name("phi2d_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      unit: "dimensionless",
      displayName: "phi2D_a",
    })
    .addAssignment("phi2F_a", {
      fn: new Divide([
        new Name("phi2f_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      unit: "dimensionless",
      displayName: "phi2F_a",
    })
    .addAssignment("denom1_open", {
      fn: new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
      unit: "s^-1",
    })
    .addAssignment("denom1_closed", {
      fn: new Add([new Name("Kn1"), new Name("Kd"), new Name("Kf")]),
      unit: "s^-1",
    })
    .addAssignment("phi1P_a", {
      fn: new Divide([
        new Mul([new Name("q1_a"), new Name("Kp1")]),
        new Name("denom1_open"),
      ]),
      unit: "dimensionless",
      displayName: "phi1P_a",
    })
    .addAssignment("phi1N_a", {
      fn: new Divide([
        new Mul([new Minus([new Num(1), new Name("q1_a")]), new Name("Kn1")]),
        new Name("denom1_closed"),
      ]),
      unit: "dimensionless",
      displayName: "phi1N_a",
    })
    .addAssignment("phi1D_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q1_a"), new Name("Kd")]),
          new Name("denom1_open"),
        ]),
        new Divide([
          new Mul([new Minus([new Num(1), new Name("q1_a")]), new Name("Kd")]),
          new Name("denom1_closed"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi1D_a",
    })
    .addAssignment("phi1F_a", {
      fn: new Add([
        new Divide([
          new Mul([new Name("q1_a"), new Name("Kf")]),
          new Name("denom1_open"),
        ]),
        new Divide([
          new Mul([new Minus([new Num(1), new Name("q1_a")]), new Name("Kf")]),
          new Name("denom1_closed"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "phi1F_a",
    })
    .addAssignment("Fm_a", {
      fn: new Add([
        new Mul([
          new Divide([
            new Mul([new Name("a2"), new Name("Kf")]),
            new Add([new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps2"),
        ]),
        new Mul([
          new Divide([
            new Mul([new Name("a1"), new Name("Kf")]),
            new Add([new Name("Kn1"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps1"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "Fm_a",
    })
    .addAssignment("Fo_a", {
      fn: new Add([
        new Mul([
          new Divide([
            new Mul([new Name("a2"), new Name("Kf")]),
            new Add([new Name("Kp2"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps2"),
        ]),
        new Mul([
          new Divide([
            new Mul([new Name("a1"), new Name("Kf")]),
            new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps1"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "Fo_a",
    })
    .addAssignment("Fmp_a", {
      fn: new Add([
        new Mul([
          new Divide([
            new Mul([new Name("a2"), new Name("Kf")]),
            new Add([new Name("Kn2_a"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps2"),
        ]),
        new Mul([
          new Divide([
            new Mul([new Name("a1"), new Name("Kf")]),
            new Add([new Name("Kn1"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps1"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "Fmp_a",
    })
    .addAssignment("Fop_a", {
      fn: new Add([
        new Mul([
          new Divide([
            new Mul([new Name("a2"), new Name("Kf")]),
            new Add([
              new Name("Kp2"),
              new Name("Kn2_a"),
              new Name("Kd"),
              new Name("Kf"),
            ]),
          ]),
          new Name("eps2"),
        ]),
        new Mul([
          new Divide([
            new Mul([new Name("a1"), new Name("Kf")]),
            new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
          ]),
          new Name("eps1"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "Fop_a",
    })
    .addAssignment("Fs_a", {
      fn: new Add([
        new Mul([new Name("a2"), new Name("phi2F_a"), new Name("eps2")]),
        new Mul([new Name("a1"), new Name("phi1F_a"), new Name("eps1")]),
      ]),
      unit: "dimensionless",
      displayName: "Fs_a",
    })
    .addAssignment("PAM1_a", {
      fn: new Minus([
        new Num(1),
        new Divide([new Name("Fs_a"), new Name("Fmp_a")]),
      ]),
      unit: "dimensionless",
      displayName: "PAM1_a",
    })
    .addAssignment("PAM2_a", {
      fn: new Mul([
        new Name("Fs_a"),
        new Minus([
          new Divide([new Num(1), new Name("Fmp_a")]),
          new Divide([new Num(1), new Name("Fm_a")]),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "PAM2_a",
    })
    .addAssignment("PAM3_a", {
      fn: new Divide([new Name("Fs_a"), new Name("Fm_a")]),
      unit: "dimensionless",
      displayName: "PAM3_a",
    })
    .addAssignment("ETR", {
      fn: new Mul([
        new Divide([new Mul([new Name("Q"), new Num(0.85)]), new Num(2)]),
        new Name("PAM1_a"),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "ETR",
    })
    .addAssignment("qP", {
      fn: new Divide([
        new Minus([new Name("Fmp_a"), new Name("Fs_a")]),
        new Minus([new Name("Fmp_a"), new Name("Fop_a")]),
      ]),
      unit: "dimensionless",
      displayName: "qP",
    })
    .addAssignment("qL", {
      fn: new Divide([
        new Mul([
          new Minus([new Name("Fmp_a"), new Name("Fs_a")]),
          new Name("Fop_a"),
        ]),
        new Mul([
          new Minus([new Name("Fmp_a"), new Name("Fop_a")]),
          new Name("Fs_a"),
        ]),
      ]),
      unit: "dimensionless",
      displayName: "qL",
    })
    .addAssignment("kPuddle", {
      fn: new Divide([
        new Name("ETR"),
        new Minus([new Num(1), new Name("qP")]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "kPuddle",
    })
    .addAssignment("kLake", {
      fn: new Divide([
        new Name("ETR"),
        new Minus([new Num(1), new Name("qL")]),
      ]),
      unit: "mol_e m^-2 s^-1",
      displayName: "kLake",
    })
    .addAssignment("NPQ", {
      fn: new Minus([
        new Divide([new Name("Fm_a"), new Name("Fmp_a")]),
        new Num(1),
      ]),
      unit: "dimensionless",
      displayName: "NPQ",
    })
    .addAssignment("active_cb6f", {
      fn: new Max([
        new Mul([new Name("CB6F"), new Minus([new Num(1), new Name("q2_a")])]),
        new Num(1e-12),
      ]),
      unit: "mol_sites m^-2",
    })
    .addAssignment("k_CB6F", {
      fn: new Piecewise([
        new Name("kq"),
        new GreaterEqual([
          new Name("JP700_a"),
          new Mul([new Name("JP700_j"), new Num(0.999)]),
        ]),
        new Divide([new Name("JP700_a"), new Name("active_cb6f")]),
      ]),
      unit: "mol_e mol_sites^-1 s^-1",
      displayName: "k_CB6F",
    });
}
