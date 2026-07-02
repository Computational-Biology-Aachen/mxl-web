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
    .addParameter("PAR", {
      value: 800,
      displayName: "PAR",
      texName: "\\mathrm{PAR}",
      slider: { min: "0", max: "2400", step: "10" },
    })
    .addParameter("Temp", { value: 25, texName: "T" })
    .addParameter("CO2", {
      value: 200,
      displayName: "CO2",
      texName: "\\mathrm{CO_2}",
    })
    .addParameter("O2", {
      value: 209,
      displayName: "O2",
      texName: "\\mathrm{O_2}",
    })
    .addParameter("Abs", { value: 0.85, texName: "\\mathrm{Abs}" })
    .addParameter("beta", { value: 0.52, texName: "\\beta" })
    .addParameter("CB6F", {
      value: 0.0000011666666666666668,
      texName: "\\mathrm{CB6F}",
    })
    .addParameter("RUB", {
      value: 0.00002777777777777778,
      texName: "\\mathrm{RUB}",
    })
    .addParameter("Rds", { value: 0.01, texName: "R_{ds}" })
    .addParameter("Ku2", { value: 0, texName: "K_{u2}" })
    .addParameter("theta1", { value: 1, texName: "\\theta_1" })
    .addParameter("eps1", { value: 0, texName: "\\epsilon_1" })
    .addParameter("eps2", { value: 1, texName: "\\epsilon_2" })
    .addParameter("nl", { value: 0.75, texName: "n_l" })
    .addParameter("nc", { value: 1, texName: "n_c" })
    .addParameter("Kf", { value: 50000000, texName: "K_f" })
    .addParameter("Kd", { value: 550000000, texName: "K_d" })
    .addParameter("Kp1", { value: 14500000000, texName: "K_{p1}" })
    .addParameter("Kn1", { value: 14500000000, texName: "K_{n1}" })
    .addParameter("Kp2", { value: 4500000000, texName: "K_{p2}" })
    .addParameter("kq", { value: 300, texName: "k_q" })
    .addParameter("kc", { value: 3.6, texName: "k_c" })
    .addParameter("ko", { value: 0.9720000000000001, texName: "k_o" })
    .addParameter("Kc", { value: 0.00026, texName: "K_c" })
    .addParameter("Ko", { value: 0.179, texName: "K_o" })
    .addAssignment("Q", {
      fn: new Divide([new Name("PAR"), new Num(1000000)]),
      displayName: "Q",
    })
    .addAssignment("C", {
      fn: new Divide([new Name("CO2"), new Num(1000000)]),
      displayName: "C",
    })
    .addAssignment("O_bar", {
      fn: new Divide([new Name("O2"), new Num(1000)]),
      displayName: "O",
    })
    .addAssignment("Vqmax", {
      fn: new Mul([new Name("CB6F"), new Name("kq")]),
      displayName: "Vqmax",
      texName: "V_{qmax}",
    })
    .addAssignment("Vcmax", {
      fn: new Mul([new Name("RUB"), new Name("kc")]),
      displayName: "Vcmax",
      texName: "V_{cmax}",
    })
    .addAssignment("Rd", {
      fn: new Mul([new Name("Vcmax"), new Name("Rds")]),
      displayName: "Rd",
      texName: "R_d",
    })
    .addAssignment("S", {
      fn: new Mul([
        new Divide([new Name("kc"), new Name("Kc")]),
        new Divide([new Name("Ko"), new Name("ko")]),
      ]),
      displayName: "S",
    })
    .addAssignment("gammas", {
      fn: new Divide([new Name("O_bar"), new Mul([new Num(2), new Name("S")])]),
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
      displayName: "eta",
      texName: "\\eta",
    })
    .addAssignment("phi1P_max", {
      fn: new Divide([
        new Name("Kp1"),
        new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
      ]),
      displayName: "phi1P_max",
    })
    .addAssignment("a2", {
      fn: new Mul([new Name("Abs"), new Name("beta")]),
      displayName: "a2",
    })
    .addAssignment("a1", {
      fn: new Minus([new Name("Abs"), new Name("a2")]),
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
      displayName: "JP700_j",
    })
    .addAssignment("JP680_j", {
      fn: new Divide([new Name("JP700_j"), new Name("eta")]),
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
      displayName: "Vc_j",
    })
    .addAssignment("Vo_j", {
      fn: new Divide([
        new Mul([new Name("Vc_j"), new Num(2), new Name("gammas")]),
        new Name("C"),
      ]),
      displayName: "Vo_j",
    })
    .addAssignment("Ag_j", {
      fn: new Minus([
        new Name("Vc_j"),
        new Divide([new Name("Vo_j"), new Num(2)]),
      ]),
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
      displayName: "Vc_c",
    })
    .addAssignment("Vo_c", {
      fn: new Divide([
        new Mul([new Name("Vc_c"), new Num(2), new Name("gammas")]),
        new Name("C"),
      ]),
      displayName: "Vo_c",
    })
    .addAssignment("Ag_c", {
      fn: new Minus([
        new Name("Vc_c"),
        new Divide([new Name("Vo_c"), new Num(2)]),
      ]),
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
      displayName: "JP680_c",
    })
    .addAssignment("JP700_c", {
      fn: new Mul([new Name("JP680_c"), new Name("eta")]),
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
      displayName: "Ag_a",
      texName: "A_g",
    })
    .addAssignment("An_a", {
      fn: new Minus([new Name("Ag_a"), new Name("Rd")]),
      displayName: "An_a",
      texName: "A_n",
    })
    .addAssignment("phi1P_a0", {
      fn: new Divide([
        new Name("JP700_a"),
        new Mul([new Name("Q"), new Name("a1")]),
      ]),
    })
    .addAssignment("q1_a", {
      fn: new Divide([new Name("phi1P_a0"), new Name("phi1P_max")]),
      displayName: "q1_a",
    })
    .addAssignment("phi2P_a0", {
      fn: new Divide([
        new Name("JP680_a"),
        new Mul([new Name("Q"), new Name("a2")]),
      ]),
    })
    .addAssignment("CB6F_a", {
      fn: new Divide([new Name("JP700_j"), new Name("kq")]),
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
    })
    .addAssignment("denom2c", {
      fn: new Add([
        new Name("Kn2_a"),
        new Name("Kd"),
        new Name("Kf"),
        new Name("Ku2"),
      ]),
    })
    .addAssignment("phi2p_a", {
      fn: new Divide([
        new Mul([new Name("q2_a"), new Name("Kp2")]),
        new Name("denom2"),
      ]),
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
      displayName: "phi2u_a",
    })
    .addAssignment("phi2P_a", {
      fn: new Divide([
        new Name("phi2p_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      displayName: "phi2P_a",
    })
    .addAssignment("phi2N_a", {
      fn: new Divide([
        new Name("phi2n_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      displayName: "phi2N_a",
    })
    .addAssignment("phi2D_a", {
      fn: new Divide([
        new Name("phi2d_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      displayName: "phi2D_a",
    })
    .addAssignment("phi2F_a", {
      fn: new Divide([
        new Name("phi2f_a"),
        new Minus([new Num(1), new Name("phi2u_a")]),
      ]),
      displayName: "phi2F_a",
    })
    .addAssignment("denom1_open", {
      fn: new Add([new Name("Kp1"), new Name("Kd"), new Name("Kf")]),
    })
    .addAssignment("denom1_closed", {
      fn: new Add([new Name("Kn1"), new Name("Kd"), new Name("Kf")]),
    })
    .addAssignment("phi1P_a", {
      fn: new Divide([
        new Mul([new Name("q1_a"), new Name("Kp1")]),
        new Name("denom1_open"),
      ]),
      displayName: "phi1P_a",
    })
    .addAssignment("phi1N_a", {
      fn: new Divide([
        new Mul([new Minus([new Num(1), new Name("q1_a")]), new Name("Kn1")]),
        new Name("denom1_closed"),
      ]),
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
      displayName: "Fop_a",
    })
    .addAssignment("Fs_a", {
      fn: new Add([
        new Mul([new Name("a2"), new Name("phi2F_a"), new Name("eps2")]),
        new Mul([new Name("a1"), new Name("phi1F_a"), new Name("eps1")]),
      ]),
      displayName: "Fs_a",
    })
    .addAssignment("PAM1_a", {
      fn: new Minus([
        new Num(1),
        new Divide([new Name("Fs_a"), new Name("Fmp_a")]),
      ]),
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
      displayName: "PAM2_a",
    })
    .addAssignment("PAM3_a", {
      fn: new Divide([new Name("Fs_a"), new Name("Fm_a")]),
      displayName: "PAM3_a",
    })
    .addAssignment("ETR", {
      fn: new Mul([
        new Divide([new Mul([new Name("Q"), new Num(0.85)]), new Num(2)]),
        new Name("PAM1_a"),
      ]),
      displayName: "ETR",
    })
    .addAssignment("qP", {
      fn: new Divide([
        new Minus([new Name("Fmp_a"), new Name("Fs_a")]),
        new Minus([new Name("Fmp_a"), new Name("Fop_a")]),
      ]),
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
      displayName: "qL",
    })
    .addAssignment("kPuddle", {
      fn: new Divide([
        new Name("ETR"),
        new Minus([new Num(1), new Name("qP")]),
      ]),
      displayName: "kPuddle",
    })
    .addAssignment("kLake", {
      fn: new Divide([
        new Name("ETR"),
        new Minus([new Num(1), new Name("qL")]),
      ]),
      displayName: "kLake",
    })
    .addAssignment("NPQ", {
      fn: new Minus([
        new Divide([new Name("Fm_a"), new Name("Fmp_a")]),
        new Num(1),
      ]),
      displayName: "NPQ",
    })
    .addAssignment("active_cb6f", {
      fn: new Max([
        new Mul([new Name("CB6F"), new Minus([new Num(1), new Name("q2_a")])]),
        new Num(1e-12),
      ]),
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
      displayName: "k_CB6F",
    });
}
