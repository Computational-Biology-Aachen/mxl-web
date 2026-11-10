import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Abs,
  Add,
  Divide,
  Exp,
  GreaterThan,
  LessEqual,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Zhu et al. 2005 chlorophyll fluorescence induction model.
 *
 * |             |                                                                                                                                                                                        |
 * | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | doi         | 10.1007/s00425-005-0064-4                                                                                                                                                              |
 * | main author | Xin-Guang Zhu                                                                                                                                                                          |
 * | paper title | Chlorophyll a fluorescence induction kinetics in leaves predicted from a model describing each discrete step of excitation energy and electron transfer associated with Photosystem II |
 * | published   | October 2005                                                                                                                                                                           |
 * | journal     | Planta                                                                                                                                                                                 |
 * | organism    | C3                                                                                                                                                                                     |
 * | Ported by   | Malick Cisse ( @kosmosofmalick-spec )                                                                                                                                                  |
 *
 * mxlpy implementation:
 *
 * - 40 state variables
 * - 1 environmental forcing as a temporary parameter
 * - model and structural parameters
 * - antenna excitation, fluorescence, heat dissipation, P680/Pheo electron
 *   transfer, OEC S-state transitions, QA/QB redox reactions, and plastoquinone
 *   exchange and oxidation
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("Iin", {
      value: 3000.0,
      texName: "Iin",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("x", {
      value: 0.0,
      texName: "x",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("p", {
      value: 0.5,
      texName: "p",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("c_light", {
      value: 300000000.0,
      texName: "c\\_light",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("h", {
      value: 6.62e-34,
      texName: "h",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "second", exponent: 1 },
        ],
      }),
    })
    .addParameter("k_boltzmann", {
      value: 1.38e-23,
      texName: "k\\_boltzmann",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "kelvin", exponent: -1 },
        ],
      }),
    })
    .addParameter("temperature", {
      value: 298.0,
      texName: "temperature",
      unit: Unit.fromJson({ factors: [{ kind: "kelvin", exponent: 1 }] }),
    })
    .addParameter("lambda_chl", {
      value: 6.73e-7,
      texName: "lambda\\_chl",
      unit: Unit.fromJson({ factors: [{ kind: "metre", exponent: 1 }] }),
    })
    .addParameter("lambda_p680", {
      value: 6.8e-7,
      texName: "lambda\\_p680",
      unit: Unit.fromJson({ factors: [{ kind: "metre", exponent: 1 }] }),
    })
    .addParameter("n_psi_psii", {
      value: 1.0,
      texName: "n\\_psi\\_psii",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_core_chl", {
      value: 70.0,
      texName: "n\\_core\\_chl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_nonreducing_peripheral_chl", {
      value: 220.0,
      texName: "n\\_nonreducing\\_peripheral\\_chl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_nonreducing_core_chl", {
      value: 35.0,
      texName: "n\\_nonreducing\\_core\\_chl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_nonreducing_detached_chl", {
      value: 35.0,
      texName: "n\\_nonreducing\\_detached\\_chl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("P680Pheo_total", {
      value: 1.0,
      texName: "P680Pheo\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("PQ_total", {
      value: 6.0,
      texName: "PQ\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("k2", {
      value: 2000000000.0,
      texName: "k2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k3", {
      value: 800.0,
      texName: "k3",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kr3", {
      value: 80.0,
      texName: "kr3",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAB1", {
      value: 2500.0,
      texName: "kAB1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAB2", {
      value: 3300.0,
      texName: "kAB2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kBA1", {
      value: 175.0,
      texName: "kBA1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kBA2", {
      value: 250.0,
      texName: "kBA2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAd", {
      value: 100000000.0,
      texName: "kAd",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAf", {
      value: 30000000.0,
      texName: "kAf",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAU", {
      value: 10000000000.0,
      texName: "kAU",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kUA", {
      value: 10000000000.0,
      texName: "kUA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kUd_closed", {
      value: 100000000.0,
      texName: "kUd\\_closed",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kUd_open", {
      value: 0.0,
      texName: "kUd\\_open",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kUf", {
      value: 30000000.0,
      texName: "kUf",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_c", {
      value: 1000000000.0,
      texName: "k\\_c",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "mole", prefix: "micro", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kminus1_closed", {
      value: 900000000.0,
      texName: "kminus1\\_closed",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kminus1_open", {
      value: 300000000.0,
      texName: "kminus1\\_open",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k1_closed", {
      value: 4000000000.0,
      texName: "k1\\_closed",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k1_open", {
      value: 25000000000.0,
      texName: "k1\\_open",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("Ke", {
      value: 1000000.0,
      texName: "Ke",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k01", {
      value: 50.0,
      texName: "k01",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k12", {
      value: 30000.0,
      texName: "k12",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k23", {
      value: 10000.0,
      texName: "k23",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k30", {
      value: 3000.0,
      texName: "k30",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kox", {
      value: 250.0,
      texName: "kox",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kz", {
      value: 5000000.0,
      texName: "kz",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("P680Pheo_total_i", {
      value: 0.0,
      texName: "P680Pheo\\_total\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addParameter("kAB1_i", {
      value: 0.0,
      texName: "kAB1\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kAB2_i", {
      value: 0.0,
      texName: "kAB2\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kBA1_i", {
      value: 0.0,
      texName: "kBA1\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kBA2_i", {
      value: 0.0,
      texName: "kBA2\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k3_i", {
      value: 0.0,
      texName: "k3\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kr3_i", {
      value: 0.0,
      texName: "kr3\\_i",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addVariable("Ap", {
      value: 0.0,
      texName: "Ap",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("U", {
      value: 0.0,
      texName: "U",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680plus_Pheominus", {
      value: 0.0,
      texName: "P680plus\\_Pheominus",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680plus_Pheo", {
      value: 0.0,
      texName: "P680plus\\_Pheo",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680_Pheominus", {
      value: 0.0,
      texName: "P680\\_Pheominus",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S0T", {
      value: 0.2,
      texName: "S0T",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S1T", {
      value: 0.8,
      texName: "S1T",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S2T", {
      value: 0.0,
      texName: "S2T",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S3T", {
      value: 0.0,
      texName: "S3T",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S0Tp", {
      value: 0.0,
      texName: "S0Tp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S1Tp", {
      value: 0.0,
      texName: "S1Tp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S2Tp", {
      value: 0.0,
      texName: "S2Tp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S3Tp", {
      value: 0.0,
      texName: "S3Tp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QB", {
      value: 1.0,
      texName: "QA\\_QB",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QB", {
      value: 0.0,
      texName: "QAred\\_QB",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QBred", {
      value: 0.0,
      texName: "QA\\_QBred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QBred", {
      value: 0.0,
      texName: "QAred\\_QBred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QB2red", {
      value: 0.0,
      texName: "QA\\_QB2red",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QB2red", {
      value: 0.0,
      texName: "QAred\\_QB2red",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("PQH2", {
      value: 3.0,
      texName: "PQH2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("Aip", {
      value: 0.0,
      texName: "Aip",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("Ui", {
      value: 0.0,
      texName: "Ui",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("Uifc", {
      value: 0.0,
      texName: "Uifc",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680plus_Pheominus_i", {
      value: 0.0,
      texName: "P680plus\\_Pheominus\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680plus_Pheo_i", {
      value: 0.0,
      texName: "P680plus\\_Pheo\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("P680_Pheominus_i", {
      value: 0.0,
      texName: "P680\\_Pheominus\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S0T_i", {
      value: 0.0,
      texName: "S0T\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S1T_i", {
      value: 0.0,
      texName: "S1T\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S2T_i", {
      value: 0.0,
      texName: "S2T\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S3T_i", {
      value: 0.0,
      texName: "S3T\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S0Tp_i", {
      value: 0.0,
      texName: "S0Tp\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S1Tp_i", {
      value: 0.0,
      texName: "S1Tp\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S2Tp_i", {
      value: 0.0,
      texName: "S2Tp\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("S3Tp_i", {
      value: 0.0,
      texName: "S3Tp\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QB_i", {
      value: 0.0,
      texName: "QA\\_QB\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QB_i", {
      value: 0.0,
      texName: "QAred\\_QB\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QBred_i", {
      value: 0.0,
      texName: "QA\\_QBred\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QBred_i", {
      value: 0.0,
      texName: "QAred\\_QBred\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QA_QB2red_i", {
      value: 0.0,
      texName: "QA\\_QB2red\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addVariable("QAred_QB2red_i", {
      value: 0.0,
      texName: "QAred\\_QB2red\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addAssignment("P680_Pheo", {
      fn: new Add([
        new Name("P680Pheo_total"),
        new Minus([new Name("P680_Pheominus")]),
        new Minus([new Name("P680plus_Pheo")]),
        new Minus([new Name("P680plus_Pheominus")]),
      ]),
      texName: "P680\\_Pheo",
    })
    .addAssignment("PQ", {
      fn: new Add([new Name("PQ_total"), new Minus([new Name("PQH2")])]),
      texName: "PQ",
    })
    .addAssignment("QA_oxidised", {
      fn: new Add([
        new Name("QA_QB"),
        new Name("QA_QB2red"),
        new Name("QA_QBred"),
      ]),
      texName: "QA\\_oxidised",
    })
    .addAssignment("QA_reduced", {
      fn: new Add([
        new Name("QAred_QB"),
        new Name("QAred_QB2red"),
        new Name("QAred_QBred"),
      ]),
      texName: "QA\\_reduced",
    })
    .addAssignment("q", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_oxidised"),
          new Add([new Name("QA_oxidised"), new Name("QA_reduced")]),
        ]),
        new GreaterThan([
          new Add([new Name("QA_oxidised"), new Name("QA_reduced")]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "q",
    })
    .addAssignment("a_QB", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QB"),
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "a\\_QB",
    })
    .addAssignment("b_QBred", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QBred"),
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "b\\_QBred",
    })
    .addAssignment("c_QB2red", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QB2red"),
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB"),
            new Name("QA_QB2red"),
            new Name("QA_QBred"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "c\\_QB2red",
    })
    .addAssignment("Ia", {
      fn: new Divide([
        new Mul([new Num(220.0), new Name("Iin")]),
        new Mul([
          new Add([new Num(1.0), new Name("x")]),
          new Add([
            new Num(290.0),
            new Mul([new Num(200.0), new Name("n_psi_psii")]),
          ]),
        ]),
      ]),
      texName: "Ia",
    })
    .addAssignment("Ic", {
      fn: new Divide([
        new Mul([new Num(70.0), new Name("Iin")]),
        new Mul([
          new Add([new Num(1.0), new Name("x")]),
          new Add([
            new Num(290.0),
            new Mul([new Num(200.0), new Name("n_psi_psii")]),
          ]),
        ]),
      ]),
      texName: "Ic",
    })
    .addAssignment("Ai", {
      fn: new Divide([
        new Mul([
          new Name("Iin"),
          new Name("n_nonreducing_peripheral_chl"),
          new Name("x"),
        ]),
        new Mul([
          new Add([new Num(1.0), new Name("x")]),
          new Add([
            new Num(290.0),
            new Mul([new Num(200.0), new Name("n_psi_psii")]),
          ]),
        ]),
      ]),
      texName: "Ai",
    })
    .addAssignment("Iui", {
      fn: new Divide([
        new Mul([
          new Name("Iin"),
          new Name("n_nonreducing_core_chl"),
          new Name("x"),
        ]),
        new Mul([
          new Add([new Num(1.0), new Name("x")]),
          new Add([
            new Num(290.0),
            new Mul([new Num(200.0), new Name("n_psi_psii")]),
          ]),
        ]),
      ]),
      texName: "Iui",
    })
    .addAssignment("Iuif", {
      fn: new Divide([
        new Mul([
          new Name("Iin"),
          new Name("n_nonreducing_detached_chl"),
          new Name("x"),
        ]),
        new Mul([
          new Add([new Num(1.0), new Name("x")]),
          new Add([
            new Num(290.0),
            new Mul([new Num(200.0), new Name("n_psi_psii")]),
          ]),
        ]),
      ]),
      texName: "Iuif",
    })
    .addAssignment("equilibrium_ratio", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Mul([
              new Name("c_light"),
              new Name("h"),
              new Add([
                new Divide([new Num(1.0), new Name("lambda_chl")]),
                new Minus([
                  new Divide([new Num(1.0), new Name("lambda_p680")]),
                ]),
              ]),
            ]),
            new Mul([new Name("k_boltzmann"), new Name("temperature")]),
          ]),
        ]),
      ),
      texName: "equilibrium\\_ratio",
    })
    .addAssignment("P680_excited", {
      fn: new Divide([
        new Mul([new Name("P680_Pheo"), new Name("U")]),
        new Mul([
          new Name("n_core_chl"),
          new Add([new Num(1.0), new Name("equilibrium_ratio")]),
        ]),
      ]),
      texName: "P680\\_excited",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addAssignment("k_q", {
      fn: new Divide([
        new Add([
          new Mul([new Num(0.15), new Name("kUd_closed")]),
          new Mul([new Num(0.15), new Name("kUf")]),
        ]),
        new Name("PQ_total"),
      ]),
      texName: "k\\_q",
    })
    .addAssignment("P680plus_fraction", {
      fn: new Piecewise([
        new Divide([new Name("P680plus_Pheo"), new Name("P680Pheo_total")]),
        new GreaterThan([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Num(0.0),
      ]),
      texName: "P680plus\\_fraction",
    })
    .addAssignment("P680_ground_fraction", {
      fn: new Piecewise([
        new Divide([new Name("P680_Pheo"), new Name("P680Pheo_total")]),
        new GreaterThan([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Num(0.0),
      ]),
      texName: "P680\\_ground\\_fraction",
    })
    .addAssignment("P680_Pheo_i", {
      fn: new Add([
        new Name("P680Pheo_total_i"),
        new Minus([new Name("P680_Pheominus_i")]),
        new Minus([new Name("P680plus_Pheo_i")]),
        new Minus([new Name("P680plus_Pheominus_i")]),
      ]),
      texName: "P680\\_Pheo\\_i",
    })
    .addAssignment("QA_oxidised_i", {
      fn: new Add([
        new Name("QA_QB2red_i"),
        new Name("QA_QB_i"),
        new Name("QA_QBred_i"),
      ]),
      texName: "QA\\_oxidised\\_i",
    })
    .addAssignment("QA_reduced_i", {
      fn: new Add([
        new Name("QAred_QB2red_i"),
        new Name("QAred_QB_i"),
        new Name("QAred_QBred_i"),
      ]),
      texName: "QA\\_reduced\\_i",
    })
    .addAssignment("q_i", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_oxidised_i"),
          new Add([new Name("QA_oxidised_i"), new Name("QA_reduced_i")]),
        ]),
        new GreaterThan([
          new Add([new Name("QA_oxidised_i"), new Name("QA_reduced_i")]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "q\\_i",
    })
    .addAssignment("a_QB_i", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QB_i"),
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "a\\_QB\\_i",
    })
    .addAssignment("b_QBred_i", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QBred_i"),
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "b\\_QBred\\_i",
    })
    .addAssignment("c_QB2red_i", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_QB2red_i"),
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_QB2red_i"),
            new Name("QA_QB_i"),
            new Name("QA_QBred_i"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "c\\_QB2red\\_i",
    })
    .addAssignment("P680_excited_i", {
      fn: new Divide([
        new Mul([new Name("P680_Pheo_i"), new Name("Ui")]),
        new Mul([
          new Name("n_nonreducing_core_chl"),
          new Add([new Num(1.0), new Name("equilibrium_ratio")]),
        ]),
      ]),
      texName: "P680\\_excited\\_i",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
        ],
      }),
    })
    .addAssignment("P680plus_fraction_i", {
      fn: new Piecewise([
        new Divide([new Name("P680plus_Pheo_i"), new Name("P680Pheo_total_i")]),
        new GreaterThan([
          new Abs(new Name("P680Pheo_total_i")),
          new Num(1e-30),
        ]),
        new Num(0.0),
      ]),
      texName: "P680plus\\_fraction\\_i",
    })
    .addAssignment("P680_ground_fraction_i", {
      fn: new Piecewise([
        new Divide([new Name("P680_Pheo_i"), new Name("P680Pheo_total_i")]),
        new GreaterThan([
          new Abs(new Name("P680Pheo_total_i")),
          new Num(1e-30),
        ]),
        new Num(0.0),
      ]),
      texName: "P680\\_ground\\_fraction\\_i",
    })
    .addReaction("light_to_Ap", {
      fn: new Name("Ia"),
      stoichiometry: [{ name: "Ap", value: new Num(1.0) }],
      texName: "light\\_to\\_Ap",
    })
    .addReaction("light_to_U", {
      fn: new Name("Ic"),
      stoichiometry: [{ name: "U", value: new Num(1.0) }],
      texName: "light\\_to\\_U",
    })
    .addReaction("light_to_Aip", {
      fn: new Name("Ai"),
      stoichiometry: [{ name: "Aip", value: new Num(1.0) }],
      texName: "light\\_to\\_Aip",
    })
    .addReaction("light_to_Ui", {
      fn: new Name("Iui"),
      stoichiometry: [{ name: "Ui", value: new Num(1.0) }],
      texName: "light\\_to\\_Ui",
    })
    .addReaction("light_to_Uifc", {
      fn: new Name("Iuif"),
      stoichiometry: [{ name: "Uifc", value: new Num(1.0) }],
      texName: "light\\_to\\_Uifc",
    })
    .addReaction("vAipf", {
      fn: new Mul([new Name("Aip"), new Name("kAf")]),
      stoichiometry: [{ name: "Aip", value: new Num(-1.0) }],
      texName: "vAipf",
    })
    .addReaction("vUif", {
      fn: new Mul([new Name("Ui"), new Name("kUf")]),
      stoichiometry: [{ name: "Ui", value: new Num(-1.0) }],
      texName: "vUif",
    })
    .addReaction("vUifcf", {
      fn: new Mul([new Name("Uifc"), new Name("kUf")]),
      stoichiometry: [{ name: "Uifc", value: new Num(-1.0) }],
      texName: "vUifcf",
    })
    .addReaction("vAipd", {
      fn: new Mul([new Name("Aip"), new Name("kAd")]),
      stoichiometry: [{ name: "Aip", value: new Num(-1.0) }],
      texName: "vAipd",
    })
    .addReaction("vUifcd", {
      fn: new Mul([new Name("Uifc"), new Name("kUd_closed")]),
      stoichiometry: [{ name: "Uifc", value: new Num(-1.0) }],
      texName: "vUifcd",
    })
    .addReaction("vAf", {
      fn: new Mul([new Name("Ap"), new Name("kAf")]),
      stoichiometry: [{ name: "Ap", value: new Num(-1.0) }],
      texName: "vAf",
    })
    .addReaction("vAd", {
      fn: new Mul([new Name("Ap"), new Name("kAd")]),
      stoichiometry: [{ name: "Ap", value: new Num(-1.0) }],
      texName: "vAd",
    })
    .addReaction("vAU", {
      fn: new Mul([new Name("Ap"), new Name("kAU")]),
      stoichiometry: [
        { name: "Ap", value: new Num(-1.0) },
        { name: "U", value: new Num(1.0) },
      ],
      texName: "vAU",
    })
    .addReaction("vUA", {
      fn: new Mul([new Name("U"), new Name("kUA")]),
      stoichiometry: [
        { name: "U", value: new Num(-1.0) },
        { name: "Ap", value: new Num(1.0) },
      ],
      texName: "vUA",
    })
    .addReaction("vUf", {
      fn: new Mul([new Name("U"), new Name("kUf")]),
      stoichiometry: [{ name: "U", value: new Num(-1.0) }],
      texName: "vUf",
    })
    .addReaction("vUd", {
      fn: new Mul([
        new Name("U"),
        new Add([
          new Mul([
            new Name("kUd_closed"),
            new Add([new Num(1.0), new Minus([new Name("q")])]),
          ]),
          new Mul([new Name("kUd_open"), new Name("q")]),
        ]),
      ]),
      stoichiometry: [{ name: "U", value: new Num(-1.0) }],
      texName: "vUd",
    })
    .addReaction("vP680qA", {
      fn: new Mul([
        new Name("Ap"),
        new Name("k_c"),
        new Add([new Name("P680plus_Pheo"), new Name("P680plus_Pheominus")]),
      ]),
      stoichiometry: [{ name: "Ap", value: new Num(-1.0) }],
      texName: "vP680qA",
    })
    .addReaction("vPQqA", {
      fn: new Mul([new Name("Ap"), new Name("PQ"), new Name("k_q")]),
      stoichiometry: [{ name: "Ap", value: new Num(-1.0) }],
      texName: "vPQqA",
    })
    .addReaction("vP680qU", {
      fn: new Mul([
        new Name("U"),
        new Name("k_c"),
        new Add([new Name("P680plus_Pheo"), new Name("P680plus_Pheominus")]),
      ]),
      stoichiometry: [{ name: "U", value: new Num(-1.0) }],
      texName: "vP680qU",
    })
    .addReaction("vPQqU", {
      fn: new Mul([new Name("PQ"), new Name("U"), new Name("k_q")]),
      stoichiometry: [{ name: "U", value: new Num(-1.0) }],
      texName: "vPQqU",
    })
    .addReaction("v1", {
      fn: new Mul([
        new Name("P680_excited"),
        new Add([
          new Mul([new Name("k1_open"), new Name("q")]),
          new Mul([
            new Name("k1_closed"),
            new Add([new Num(1.0), new Minus([new Name("p")])]),
            new Add([new Num(1.0), new Minus([new Name("q")])]),
          ]),
          new Mul([
            new Name("k1_open"),
            new Name("p"),
            new Add([new Num(1.0), new Minus([new Name("q")])]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "U", value: new Num(-1.0) },
        { name: "P680plus_Pheominus", value: new Num(1.0) },
      ],
      texName: "v1",
    })
    .addReaction("vminus1", {
      fn: new Mul([
        new Name("P680plus_Pheominus"),
        new Add([
          new Mul([
            new Name("kminus1_closed"),
            new Add([new Num(1.0), new Minus([new Name("q")])]),
          ]),
          new Mul([new Name("kminus1_open"), new Name("q")]),
        ]),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "U", value: new Num(1.0) },
      ],
      texName: "vminus1",
    })
    .addReaction("v0z_1", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus"),
            new Name("S0T"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S0T", value: new Num(-1.0) },
        { name: "S0Tp", value: new Num(1.0) },
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680_Pheominus", value: new Num(1.0) },
      ],
      texName: "v0z\\_1",
    })
    .addReaction("v0z_2", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([new Name("P680plus_Pheo"), new Name("S0T"), new Name("kz")]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S0T", value: new Num(-1.0) },
        { name: "S0Tp", value: new Num(1.0) },
        { name: "P680plus_Pheo", value: new Num(-1.0) },
      ],
      texName: "v0z\\_2",
    })
    .addReaction("v1z_1", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus"),
            new Name("S1T"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S1T", value: new Num(-1.0) },
        { name: "S1Tp", value: new Num(1.0) },
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680_Pheominus", value: new Num(1.0) },
      ],
      texName: "v1z\\_1",
    })
    .addReaction("v1z_2", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([new Name("P680plus_Pheo"), new Name("S1T"), new Name("kz")]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S1T", value: new Num(-1.0) },
        { name: "S1Tp", value: new Num(1.0) },
        { name: "P680plus_Pheo", value: new Num(-1.0) },
      ],
      texName: "v1z\\_2",
    })
    .addReaction("v2z_1", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus"),
            new Name("S2T"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S2T", value: new Num(-1.0) },
        { name: "S2Tp", value: new Num(1.0) },
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680_Pheominus", value: new Num(1.0) },
      ],
      texName: "v2z\\_1",
    })
    .addReaction("v2z_2", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([new Name("P680plus_Pheo"), new Name("S2T"), new Name("kz")]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S2T", value: new Num(-1.0) },
        { name: "S2Tp", value: new Num(1.0) },
        { name: "P680plus_Pheo", value: new Num(-1.0) },
      ],
      texName: "v2z\\_2",
    })
    .addReaction("v3z_1", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus"),
            new Name("S3T"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S3T", value: new Num(-1.0) },
        { name: "S3Tp", value: new Num(1.0) },
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680_Pheominus", value: new Num(1.0) },
      ],
      texName: "v3z\\_1",
    })
    .addReaction("v3z_2", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total")), new Num(1e-30)]),
        new Divide([
          new Mul([new Name("P680plus_Pheo"), new Name("S3T"), new Name("kz")]),
          new Name("P680Pheo_total"),
        ]),
      ]),
      stoichiometry: [
        { name: "S3T", value: new Num(-1.0) },
        { name: "S3Tp", value: new Num(1.0) },
        { name: "P680plus_Pheo", value: new Num(-1.0) },
      ],
      texName: "v3z\\_2",
    })
    .addReaction("vS0Tp_S1T", {
      fn: new Mul([new Name("S0Tp"), new Name("k01")]),
      stoichiometry: [
        { name: "S0Tp", value: new Num(-1.0) },
        { name: "S1T", value: new Num(1.0) },
      ],
      texName: "vS0Tp\\_S1T",
    })
    .addReaction("vS1Tp_S2T", {
      fn: new Mul([new Name("S1Tp"), new Name("k12")]),
      stoichiometry: [
        { name: "S1Tp", value: new Num(-1.0) },
        { name: "S2T", value: new Num(1.0) },
      ],
      texName: "vS1Tp\\_S2T",
    })
    .addReaction("vS2Tp_S3T", {
      fn: new Mul([new Name("S2Tp"), new Name("k23")]),
      stoichiometry: [
        { name: "S2Tp", value: new Num(-1.0) },
        { name: "S3T", value: new Num(1.0) },
      ],
      texName: "vS2Tp\\_S3T",
    })
    .addReaction("vS3Tp_S0T", {
      fn: new Mul([new Name("S3Tp"), new Name("k30")]),
      stoichiometry: [
        { name: "S3Tp", value: new Num(-1.0) },
        { name: "S0T", value: new Num(1.0) },
      ],
      texName: "vS3Tp\\_S0T",
    })
    .addReaction("v2_0_1", {
      fn: new Mul([
        new Name("P680plus_Pheominus"),
        new Name("a_QB"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680plus_Pheo", value: new Num(1.0) },
        { name: "QA_QB", value: new Num(-1.0) },
        { name: "QAred_QB", value: new Num(1.0) },
      ],
      texName: "v2\\_0\\_1",
    })
    .addReaction("vr2_0_1", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction"),
          new Name("QAred_QB"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo", value: new Num(-1.0) },
        { name: "P680plus_Pheominus", value: new Num(1.0) },
        { name: "QAred_QB", value: new Num(-1.0) },
        { name: "QA_QB", value: new Num(1.0) },
      ],
      texName: "vr2\\_0\\_1",
    })
    .addReaction("v2_0_2", {
      fn: new Mul([
        new Name("P680_Pheominus"),
        new Name("a_QB"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(-1.0) },
        { name: "QA_QB", value: new Num(-1.0) },
        { name: "QAred_QB", value: new Num(1.0) },
      ],
      texName: "v2\\_0\\_2",
    })
    .addReaction("vr2_0_2", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction"),
          new Name("QAred_QB"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(1.0) },
        { name: "QAred_QB", value: new Num(-1.0) },
        { name: "QA_QB", value: new Num(1.0) },
      ],
      texName: "vr2\\_0\\_2",
    })
    .addReaction("v2_1_1", {
      fn: new Mul([
        new Name("P680plus_Pheominus"),
        new Name("b_QBred"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680plus_Pheo", value: new Num(1.0) },
        { name: "QA_QBred", value: new Num(-1.0) },
        { name: "QAred_QBred", value: new Num(1.0) },
      ],
      texName: "v2\\_1\\_1",
    })
    .addReaction("vr2_1_1", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction"),
          new Name("QAred_QBred"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo", value: new Num(-1.0) },
        { name: "P680plus_Pheominus", value: new Num(1.0) },
        { name: "QAred_QBred", value: new Num(-1.0) },
        { name: "QA_QBred", value: new Num(1.0) },
      ],
      texName: "vr2\\_1\\_1",
    })
    .addReaction("v2_1_2", {
      fn: new Mul([
        new Name("P680_Pheominus"),
        new Name("b_QBred"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(-1.0) },
        { name: "QA_QBred", value: new Num(-1.0) },
        { name: "QAred_QBred", value: new Num(1.0) },
      ],
      texName: "v2\\_1\\_2",
    })
    .addReaction("vr2_1_2", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction"),
          new Name("QAred_QBred"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(1.0) },
        { name: "QAred_QBred", value: new Num(-1.0) },
        { name: "QA_QBred", value: new Num(1.0) },
      ],
      texName: "vr2\\_1\\_2",
    })
    .addReaction("v2_2_1", {
      fn: new Mul([
        new Name("P680plus_Pheominus"),
        new Name("c_QB2red"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus", value: new Num(-1.0) },
        { name: "P680plus_Pheo", value: new Num(1.0) },
        { name: "QA_QB2red", value: new Num(-1.0) },
        { name: "QAred_QB2red", value: new Num(1.0) },
      ],
      texName: "v2\\_2\\_1",
    })
    .addReaction("vr2_2_1", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction"),
          new Name("QAred_QB2red"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo", value: new Num(-1.0) },
        { name: "P680plus_Pheominus", value: new Num(1.0) },
        { name: "QAred_QB2red", value: new Num(-1.0) },
        { name: "QA_QB2red", value: new Num(1.0) },
      ],
      texName: "vr2\\_2\\_1",
    })
    .addReaction("v2_2_2", {
      fn: new Mul([
        new Name("P680_Pheominus"),
        new Name("c_QB2red"),
        new Name("k2"),
        new Name("q"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(-1.0) },
        { name: "QA_QB2red", value: new Num(-1.0) },
        { name: "QAred_QB2red", value: new Num(1.0) },
      ],
      texName: "v2\\_2\\_2",
    })
    .addReaction("vr2_2_2", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction"),
          new Name("QAred_QB2red"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus", value: new Num(1.0) },
        { name: "QAred_QB2red", value: new Num(-1.0) },
        { name: "QA_QB2red", value: new Num(1.0) },
      ],
      texName: "vr2\\_2\\_2",
    })
    .addReaction("vAB1", {
      fn: new Mul([new Name("QAred_QB"), new Name("kAB1")]),
      stoichiometry: [
        { name: "QAred_QB", value: new Num(-1.0) },
        { name: "QA_QBred", value: new Num(1.0) },
      ],
      texName: "vAB1",
    })
    .addReaction("vBA1", {
      fn: new Mul([new Name("QA_QBred"), new Name("kBA1")]),
      stoichiometry: [
        { name: "QA_QBred", value: new Num(-1.0) },
        { name: "QAred_QB", value: new Num(1.0) },
      ],
      texName: "vBA1",
    })
    .addReaction("vAB2", {
      fn: new Mul([new Name("QAred_QBred"), new Name("kAB2")]),
      stoichiometry: [
        { name: "QAred_QBred", value: new Num(-1.0) },
        { name: "QA_QB2red", value: new Num(1.0) },
      ],
      texName: "vAB2",
    })
    .addReaction("vBA2", {
      fn: new Mul([new Name("QA_QB2red"), new Name("kBA2")]),
      stoichiometry: [
        { name: "QA_QB2red", value: new Num(-1.0) },
        { name: "QAred_QBred", value: new Num(1.0) },
      ],
      texName: "vBA2",
    })
    .addReaction("v3", {
      fn: new Divide([
        new Mul([new Name("PQ"), new Name("QA_QB2red"), new Name("k3")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QA_QB2red", value: new Num(-1.0) },
        { name: "QA_QB", value: new Num(1.0) },
        { name: "PQH2", value: new Num(1.0) },
      ],
      texName: "v3",
    })
    .addReaction("vr3", {
      fn: new Divide([
        new Mul([new Name("PQH2"), new Name("QA_QB"), new Name("kr3")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QA_QB", value: new Num(-1.0) },
        { name: "QA_QB2red", value: new Num(1.0) },
        { name: "PQH2", value: new Num(-1.0) },
      ],
      texName: "vr3",
    })
    .addReaction("v3_n", {
      fn: new Divide([
        new Mul([new Name("PQ"), new Name("QAred_QB2red"), new Name("k3")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QAred_QB2red", value: new Num(-1.0) },
        { name: "QAred_QB", value: new Num(1.0) },
        { name: "PQH2", value: new Num(1.0) },
      ],
      texName: "v3\\_n",
    })
    .addReaction("vr3_n", {
      fn: new Divide([
        new Mul([new Name("PQH2"), new Name("QAred_QB"), new Name("kr3")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QAred_QB", value: new Num(-1.0) },
        { name: "QAred_QB2red", value: new Num(1.0) },
        { name: "PQH2", value: new Num(-1.0) },
      ],
      texName: "vr3\\_n",
    })
    .addReaction("vUid", {
      fn: new Mul([
        new Name("Ui"),
        new Add([
          new Mul([
            new Name("kUd_closed"),
            new Add([new Num(1.0), new Minus([new Name("q_i")])]),
          ]),
          new Mul([new Name("kUd_open"), new Name("q_i")]),
        ]),
      ]),
      stoichiometry: [{ name: "Ui", value: new Num(-1.0) }],
      texName: "vUid",
    })
    .addReaction("vP680q_Ui", {
      fn: new Mul([
        new Name("Ui"),
        new Name("k_c"),
        new Add([
          new Name("P680plus_Pheo_i"),
          new Name("P680plus_Pheominus_i"),
        ]),
      ]),
      stoichiometry: [{ name: "Ui", value: new Num(-1.0) }],
      texName: "vP680q\\_Ui",
    })
    .addReaction("vPQq_Ui", {
      fn: new Mul([new Name("PQ"), new Name("Ui"), new Name("k_q")]),
      stoichiometry: [{ name: "Ui", value: new Num(-1.0) }],
      texName: "vPQq\\_Ui",
    })
    .addReaction("v1_i", {
      fn: new Mul([
        new Name("P680_excited_i"),
        new Add([
          new Mul([new Name("k1_open"), new Name("q_i")]),
          new Mul([
            new Name("k1_closed"),
            new Add([new Num(1.0), new Minus([new Name("p")])]),
            new Add([new Num(1.0), new Minus([new Name("q_i")])]),
          ]),
          new Mul([
            new Name("k1_open"),
            new Name("p"),
            new Add([new Num(1.0), new Minus([new Name("q_i")])]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ui", value: new Num(-1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(1.0) },
      ],
      texName: "v1\\_i",
    })
    .addReaction("vminus1_i", {
      fn: new Mul([
        new Name("P680plus_Pheominus_i"),
        new Add([
          new Mul([
            new Name("kminus1_closed"),
            new Add([new Num(1.0), new Minus([new Name("q_i")])]),
          ]),
          new Mul([new Name("kminus1_open"), new Name("q_i")]),
        ]),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "Ui", value: new Num(1.0) },
      ],
      texName: "vminus1\\_i",
    })
    .addReaction("v0z_1_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus_i"),
            new Name("S0T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S0T_i", value: new Num(-1.0) },
        { name: "S0Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680_Pheominus_i", value: new Num(1.0) },
      ],
      texName: "v0z\\_1\\_i",
    })
    .addReaction("v0z_2_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheo_i"),
            new Name("S0T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S0T_i", value: new Num(-1.0) },
        { name: "S0Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
      ],
      texName: "v0z\\_2\\_i",
    })
    .addReaction("v1z_1_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus_i"),
            new Name("S1T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S1T_i", value: new Num(-1.0) },
        { name: "S1Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680_Pheominus_i", value: new Num(1.0) },
      ],
      texName: "v1z\\_1\\_i",
    })
    .addReaction("v1z_2_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheo_i"),
            new Name("S1T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S1T_i", value: new Num(-1.0) },
        { name: "S1Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
      ],
      texName: "v1z\\_2\\_i",
    })
    .addReaction("v2z_1_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus_i"),
            new Name("S2T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S2T_i", value: new Num(-1.0) },
        { name: "S2Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680_Pheominus_i", value: new Num(1.0) },
      ],
      texName: "v2z\\_1\\_i",
    })
    .addReaction("v2z_2_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheo_i"),
            new Name("S2T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S2T_i", value: new Num(-1.0) },
        { name: "S2Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
      ],
      texName: "v2z\\_2\\_i",
    })
    .addReaction("v3z_1_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheominus_i"),
            new Name("S3T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S3T_i", value: new Num(-1.0) },
        { name: "S3Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680_Pheominus_i", value: new Num(1.0) },
      ],
      texName: "v3z\\_1\\_i",
    })
    .addReaction("v3z_2_i", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([new Abs(new Name("P680Pheo_total_i")), new Num(1e-30)]),
        new Divide([
          new Mul([
            new Name("P680plus_Pheo_i"),
            new Name("S3T_i"),
            new Name("kz"),
          ]),
          new Name("P680Pheo_total_i"),
        ]),
      ]),
      stoichiometry: [
        { name: "S3T_i", value: new Num(-1.0) },
        { name: "S3Tp_i", value: new Num(1.0) },
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
      ],
      texName: "v3z\\_2\\_i",
    })
    .addReaction("vS0Tp_i_S1T_i", {
      fn: new Mul([new Name("S0Tp_i"), new Name("k01")]),
      stoichiometry: [
        { name: "S0Tp_i", value: new Num(-1.0) },
        { name: "S1T_i", value: new Num(1.0) },
      ],
      texName: "vS0Tp\\_i\\_S1T\\_i",
    })
    .addReaction("vS1Tp_i_S2T_i", {
      fn: new Mul([new Name("S1Tp_i"), new Name("k12")]),
      stoichiometry: [
        { name: "S1Tp_i", value: new Num(-1.0) },
        { name: "S2T_i", value: new Num(1.0) },
      ],
      texName: "vS1Tp\\_i\\_S2T\\_i",
    })
    .addReaction("vS2Tp_i_S3T_i", {
      fn: new Mul([new Name("S2Tp_i"), new Name("k23")]),
      stoichiometry: [
        { name: "S2Tp_i", value: new Num(-1.0) },
        { name: "S3T_i", value: new Num(1.0) },
      ],
      texName: "vS2Tp\\_i\\_S3T\\_i",
    })
    .addReaction("vS3Tp_i_S0T_i", {
      fn: new Mul([new Name("S3Tp_i"), new Name("k30")]),
      stoichiometry: [
        { name: "S3Tp_i", value: new Num(-1.0) },
        { name: "S0T_i", value: new Num(1.0) },
      ],
      texName: "vS3Tp\\_i\\_S0T\\_i",
    })
    .addReaction("v2_0_1_i", {
      fn: new Mul([
        new Name("P680plus_Pheominus_i"),
        new Name("a_QB_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680plus_Pheo_i", value: new Num(1.0) },
        { name: "QA_QB_i", value: new Num(-1.0) },
        { name: "QAred_QB_i", value: new Num(1.0) },
      ],
      texName: "v2\\_0\\_1\\_i",
    })
    .addReaction("vr2_0_1_i", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction_i"),
          new Name("QAred_QB_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QB_i", value: new Num(-1.0) },
        { name: "QA_QB_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_0\\_1\\_i",
    })
    .addReaction("v2_0_2_i", {
      fn: new Mul([
        new Name("P680_Pheominus_i"),
        new Name("a_QB_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(-1.0) },
        { name: "QA_QB_i", value: new Num(-1.0) },
        { name: "QAred_QB_i", value: new Num(1.0) },
      ],
      texName: "v2\\_0\\_2\\_i",
    })
    .addReaction("vr2_0_2_i", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction_i"),
          new Name("QAred_QB_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QB_i", value: new Num(-1.0) },
        { name: "QA_QB_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_0\\_2\\_i",
    })
    .addReaction("v2_1_1_i", {
      fn: new Mul([
        new Name("P680plus_Pheominus_i"),
        new Name("b_QBred_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680plus_Pheo_i", value: new Num(1.0) },
        { name: "QA_QBred_i", value: new Num(-1.0) },
        { name: "QAred_QBred_i", value: new Num(1.0) },
      ],
      texName: "v2\\_1\\_1\\_i",
    })
    .addReaction("vr2_1_1_i", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction_i"),
          new Name("QAred_QBred_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QBred_i", value: new Num(-1.0) },
        { name: "QA_QBred_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_1\\_1\\_i",
    })
    .addReaction("v2_1_2_i", {
      fn: new Mul([
        new Name("P680_Pheominus_i"),
        new Name("b_QBred_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(-1.0) },
        { name: "QA_QBred_i", value: new Num(-1.0) },
        { name: "QAred_QBred_i", value: new Num(1.0) },
      ],
      texName: "v2\\_1\\_2\\_i",
    })
    .addReaction("vr2_1_2_i", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction_i"),
          new Name("QAred_QBred_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QBred_i", value: new Num(-1.0) },
        { name: "QA_QBred_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_1\\_2\\_i",
    })
    .addReaction("v2_2_1_i", {
      fn: new Mul([
        new Name("P680plus_Pheominus_i"),
        new Name("c_QB2red_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheominus_i", value: new Num(-1.0) },
        { name: "P680plus_Pheo_i", value: new Num(1.0) },
        { name: "QA_QB2red_i", value: new Num(-1.0) },
        { name: "QAred_QB2red_i", value: new Num(1.0) },
      ],
      texName: "v2\\_2\\_1\\_i",
    })
    .addReaction("vr2_2_1_i", {
      fn: new Divide([
        new Mul([
          new Name("P680plus_fraction_i"),
          new Name("QAred_QB2red_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680plus_Pheo_i", value: new Num(-1.0) },
        { name: "P680plus_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QB2red_i", value: new Num(-1.0) },
        { name: "QA_QB2red_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_2\\_1\\_i",
    })
    .addReaction("v2_2_2_i", {
      fn: new Mul([
        new Name("P680_Pheominus_i"),
        new Name("c_QB2red_i"),
        new Name("k2"),
        new Name("q_i"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(-1.0) },
        { name: "QA_QB2red_i", value: new Num(-1.0) },
        { name: "QAred_QB2red_i", value: new Num(1.0) },
      ],
      texName: "v2\\_2\\_2\\_i",
    })
    .addReaction("vr2_2_2_i", {
      fn: new Divide([
        new Mul([
          new Name("P680_ground_fraction_i"),
          new Name("QAred_QB2red_i"),
          new Name("k2"),
        ]),
        new Name("Ke"),
      ]),
      stoichiometry: [
        { name: "P680_Pheominus_i", value: new Num(1.0) },
        { name: "QAred_QB2red_i", value: new Num(-1.0) },
        { name: "QA_QB2red_i", value: new Num(1.0) },
      ],
      texName: "vr2\\_2\\_2\\_i",
    })
    .addReaction("vAB1_i", {
      fn: new Mul([new Name("QAred_QB_i"), new Name("kAB1_i")]),
      stoichiometry: [
        { name: "QAred_QB_i", value: new Num(-1.0) },
        { name: "QA_QBred_i", value: new Num(1.0) },
      ],
      texName: "vAB1\\_i",
    })
    .addReaction("vBA1_i", {
      fn: new Mul([new Name("QA_QBred_i"), new Name("kBA1_i")]),
      stoichiometry: [
        { name: "QA_QBred_i", value: new Num(-1.0) },
        { name: "QAred_QB_i", value: new Num(1.0) },
      ],
      texName: "vBA1\\_i",
    })
    .addReaction("vAB2_i", {
      fn: new Mul([new Name("QAred_QBred_i"), new Name("kAB2_i")]),
      stoichiometry: [
        { name: "QAred_QBred_i", value: new Num(-1.0) },
        { name: "QA_QB2red_i", value: new Num(1.0) },
      ],
      texName: "vAB2\\_i",
    })
    .addReaction("vBA2_i", {
      fn: new Mul([new Name("QA_QB2red_i"), new Name("kBA2_i")]),
      stoichiometry: [
        { name: "QA_QB2red_i", value: new Num(-1.0) },
        { name: "QAred_QBred_i", value: new Num(1.0) },
      ],
      texName: "vBA2\\_i",
    })
    .addReaction("v3_i", {
      fn: new Divide([
        new Mul([new Name("PQ"), new Name("QA_QB2red_i"), new Name("k3_i")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QA_QB2red_i", value: new Num(-1.0) },
        { name: "QA_QB_i", value: new Num(1.0) },
        { name: "PQH2", value: new Num(1.0) },
      ],
      texName: "v3\\_i",
    })
    .addReaction("vr3_i", {
      fn: new Divide([
        new Mul([new Name("PQH2"), new Name("QA_QB_i"), new Name("kr3_i")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QA_QB_i", value: new Num(-1.0) },
        { name: "QA_QB2red_i", value: new Num(1.0) },
        { name: "PQH2", value: new Num(-1.0) },
      ],
      texName: "vr3\\_i",
    })
    .addReaction("v3_n_i", {
      fn: new Divide([
        new Mul([new Name("PQ"), new Name("QAred_QB2red_i"), new Name("k3_i")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QAred_QB2red_i", value: new Num(-1.0) },
        { name: "QAred_QB_i", value: new Num(1.0) },
        { name: "PQH2", value: new Num(1.0) },
      ],
      texName: "v3\\_n\\_i",
    })
    .addReaction("vr3_n_i", {
      fn: new Divide([
        new Mul([new Name("PQH2"), new Name("QAred_QB_i"), new Name("kr3_i")]),
        new Name("PQ_total"),
      ]),
      stoichiometry: [
        { name: "QAred_QB_i", value: new Num(-1.0) },
        { name: "QAred_QB2red_i", value: new Num(1.0) },
        { name: "PQH2", value: new Num(-1.0) },
      ],
      texName: "vr3\\_n\\_i",
    })
    .addReaction("v_pq_ox", {
      fn: new Mul([new Name("PQH2"), new Name("kox")]),
      stoichiometry: [{ name: "PQH2", value: new Num(-1.0) }],
      texName: "v\\_pq\\_ox",
    })
    .addReadout("F", {
      fn: new Add([
        new Mul([new Name("kAf"), new Add([new Name("Aip"), new Name("Ap")])]),
        new Mul([
          new Name("kUf"),
          new Add([new Name("U"), new Name("Ui"), new Name("Uifc")]),
        ]),
      ]),
      texName: "F",
    })
    .addReadout("QA_reduction_fraction", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_reduced"),
          new Add([new Name("QA_oxidised"), new Name("QA_reduced")]),
        ]),
        new GreaterThan([
          new Add([new Name("QA_oxidised"), new Name("QA_reduced")]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "QA\\_reduction\\_fraction",
    })
    .addReadout("QA_reduction_fraction_i", {
      fn: new Piecewise([
        new Divide([
          new Name("QA_reduced_i"),
          new Add([new Name("QA_oxidised_i"), new Name("QA_reduced_i")]),
        ]),
        new GreaterThan([
          new Add([new Name("QA_oxidised_i"), new Name("QA_reduced_i")]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "QA\\_reduction\\_fraction\\_i",
    })
    .addReadout("QA_reduction_fraction_total", {
      fn: new Piecewise([
        new Divide([
          new Add([new Name("QA_reduced"), new Name("QA_reduced_i")]),
          new Add([
            new Name("QA_oxidised"),
            new Name("QA_oxidised_i"),
            new Name("QA_reduced"),
            new Name("QA_reduced_i"),
          ]),
        ]),
        new GreaterThan([
          new Add([
            new Name("QA_oxidised"),
            new Name("QA_oxidised_i"),
            new Name("QA_reduced"),
            new Name("QA_reduced_i"),
          ]),
          new Num(0.0),
        ]),
        new Num(0.0),
      ]),
      texName: "QA\\_reduction\\_fraction\\_total",
    })
    .addReadout("obs_q", {
      fn: new Name("q"),
      texName: "obs\\_q",
    })
    .addReadout("obs_q_i", {
      fn: new Name("q_i"),
      texName: "obs\\_q\\_i",
    })
    .addReadout("obs_QA_oxidised", {
      fn: new Name("QA_oxidised"),
      texName: "obs\\_QA\\_oxidised",
    })
    .addReadout("obs_QA_reduced", {
      fn: new Name("QA_reduced"),
      texName: "obs\\_QA\\_reduced",
    })
    .addReadout("obs_QA_oxidised_i", {
      fn: new Name("QA_oxidised_i"),
      texName: "obs\\_QA\\_oxidised\\_i",
    })
    .addReadout("obs_QA_reduced_i", {
      fn: new Name("QA_reduced_i"),
      texName: "obs\\_QA\\_reduced\\_i",
    })
    .addReadout("obs_PQ", {
      fn: new Name("PQ"),
      texName: "obs\\_PQ",
    })
    .addReadout("obs_P680_excited", {
      fn: new Name("P680_excited"),
      texName: "obs\\_P680\\_excited",
    })
    .addReadout("obs_P680_excited_i", {
      fn: new Name("P680_excited_i"),
      texName: "obs\\_P680\\_excited\\_i",
    })
    .addReadout("obs_Ia", {
      fn: new Name("Ia"),
      texName: "obs\\_Ia",
    })
    .addReadout("obs_Ic", {
      fn: new Name("Ic"),
      texName: "obs\\_Ic",
    })
    .addReadout("obs_Ai", {
      fn: new Name("Ai"),
      texName: "obs\\_Ai",
    })
    .addReadout("obs_Iui", {
      fn: new Name("Iui"),
      texName: "obs\\_Iui",
    })
    .addReadout("obs_Iuif", {
      fn: new Name("Iuif"),
      texName: "obs\\_Iuif",
    });
}
