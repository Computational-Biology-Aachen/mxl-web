import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
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

/**
 * Matuszynska 2016 NPQ model.
 *
 * Non-photochemical quenching via PsbS and xanthophyll cycle.
 *
 * |             |                                                                                                |
 * | ----------- | ---------------------------------------------------------------------------------------------- |
 * | doi         | 10.1016/j.bbabio.2016.09.003                                                                   |
 * | main author | Anna Matuszyńska                                                                               |
 * | paper title | A mathematical model of non-photochemical quenching to study short-term light memory in plants |
 * | published   | September 2016                                                                                 |
 * | journal     | Biochimica et Biophysica Acta (BBA) - Bioenergetics                                            |
 * | organism    | Arabidopsis thaliana                                                                           |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                           |
 *
 * ODE model of photoprotection in plant PSII. Tracks PSII open/closed states,
 * plastoquinone (PQ/PQH2) redox, lumenal proton buffering, ATP synthesis, PsbS
 * protonation, and xanthophyll de-epoxidation (zeaxanthin formation). Supports PAM
 * fluorescence protocol simulation to reproduce Fm/Fm' quenching.
 *
 * Ref: Matuszynska et al. (2016) Biochim Biophys Acta 1857:1948-1960
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("PSII_tot", {
      value: 2.5,
      displayName: "PSII_total",
      texName: "PSII\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PQ_tot", {
      value: 20.0,
      texName: "PQ\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("AP_tot", {
      value: 50.0,
      texName: "AP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PsbS_tot", {
      value: 1.0,
      texName: "PsbS\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("X_tot", {
      value: 1.0,
      texName: "X\\_tot",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("O2_ex", {
      value: 8.0,
      texName: "O2\\_ex",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("Pi", {
      value: 0.01,
      texName: "Pi",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_Cytb6f", {
      value: 0.104,
      texName: "k\\_Cytb6f",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_ActATPase", {
      value: 0.01,
      texName: "k\\_ActATPase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_DeactATPase", {
      value: 0.002,
      texName: "k\\_DeactATPase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_ATPsynth", {
      value: 20.0,
      texName: "k\\_ATPsynth",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_ATPconsum", {
      value: 10.0,
      texName: "k\\_ATPconsum",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PQH2", {
      value: 250.0,
      texName: "k\\_PQH2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_H", {
      value: 5000000000.0,
      displayName: "kH",
      texName: "k\\_H",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_F", {
      value: 625000000.0,
      displayName: "kF",
      texName: "k\\_F",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_P", {
      value: 5000000000.0,
      displayName: "k2",
      texName: "k\\_P",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_PTOX", {
      value: 0.01,
      displayName: "kPTOX",
      texName: "k\\_PTOX",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("pH_st", {
      value: 7.8,
      displayName: "pH",
      texName: "pH\\_st",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_leak", {
      value: 1000.0,
      texName: "k\\_leak",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("b_H", {
      value: 100.0,
      displayName: "bH",
      texName: "b\\_H",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("hpr", {
      value: 4.666666666666667,
      displayName: "HPR",
      texName: "hpr",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_DV", {
      value: 0.0024,
      texName: "k\\_DV",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_EZ", {
      value: 0.00024,
      texName: "k\\_EZ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("K_pHSat", {
      value: 5.8,
      texName: "K\\_pHSat",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nhx", {
      value: 5.0,
      texName: "nhx",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("K_ZSat", {
      value: 0.12,
      texName: "K\\_ZSat",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nhl", {
      value: 3.0,
      texName: "nhl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_deprot", {
      value: 0.0096,
      texName: "k\\_deprot",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_prot", {
      value: 0.0096,
      texName: "k\\_prot",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("K_pHSatLHC", {
      value: 5.8,
      texName: "K\\_pHSatLHC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma_0", {
      value: 0.1,
      displayName: "gamma0",
      texName: "gamma\\_0",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma_1", {
      value: 0.25,
      displayName: "gamma1",
      texName: "gamma\\_1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma_2", {
      value: 0.6,
      displayName: "gamma2",
      texName: "gamma\\_2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("gamma_3", {
      value: 0.15,
      displayName: "gamma3",
      texName: "gamma\\_3",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("F", {
      value: 96.485,
      texName: "F",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("R", {
      value: 0.0083,
      texName: "R",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "kelvin", exponent: -1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("T", {
      value: 298.0,
      texName: "T",
      unit: Unit.fromJson({ factors: [{ kind: "kelvin", exponent: 1 }] }),
    })
    .addParameter("E0_QA", {
      value: -0.14,
      texName: "E0\\_QA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_PQ", {
      value: 0.354,
      texName: "E0\\_PQ",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_PC", {
      value: 0.38,
      texName: "E0\\_PC",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("DG_ATP", {
      value: 30.6,
      texName: "DG\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("PPFD", {
      value: 100.0,
      texName: "PPFD",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
      slider: {
        min: "50",
        max: "500",
        step: "10",
      },
    })
    .addVariable("pq_red", {
      value: 0.0,
      displayName: "PQH2",
      texName: "pq\\_red",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("protons", {
      value: 6.32975752e-5,
      texName: "protons",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("vmax_atp_synthase", {
      value: 0.0,
      texName: "vmax\\_atp\\_synthase",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("atp", {
      value: 25.0,
      displayName: "ATP",
      texName: "atp",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("psbs_de", {
      value: 1.0,
      texName: "psbs\\_de",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("vx", {
      value: 1.0,
      texName: "vx",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("pH_lu", {
      fn: new Minus([
        new Divide([
          new Ln(new Mul([new Num(0.00025), new Name("protons")])),
          new Ln(new Num(10.0)),
        ]),
      ]),
      displayName: "pH_lumen",
      texName: "pH\\_lu",
    })
    .addAssignment("H_st", {
      fn: new Mul([
        new Num(32000.0),
        new Pow(new Num(10.0), new Minus([new Name("pH_st")])),
      ]),
      texName: "H\\_st",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("K_pHSat_inv", {
      fn: new Mul([
        new Num(32000.0),
        new Pow(new Num(10.0), new Minus([new Name("K_pHSat")])),
      ]),
      texName: "K\\_pHSat\\_inv",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("K_pHSatLHC_inv", {
      fn: new Mul([
        new Num(32000.0),
        new Pow(new Num(10.0), new Minus([new Name("K_pHSatLHC")])),
      ]),
      texName: "K\\_pHSatLHC\\_inv",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("K_QAPQ", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_QA"), new Name("F")]),
            ]),
            new Minus([
              new Mul([
                new Num(4.605170185988092),
                new Name("R"),
                new Name("T"),
                new Name("pH_st"),
              ]),
            ]),
          ]),
          new Mul([new Name("R"), new Name("T")]),
        ]),
      ),
      texName: "K\\_QAPQ",
    })
    .addAssignment("K_cytb6f", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0_PC"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
            ]),
            new Mul([
              new Num(4.605170185988092),
              new Name("R"),
              new Name("T"),
              new Name("pH_lu"),
            ]),
            new Minus([
              new Mul([
                new Num(4.605170185988092),
                new Name("R"),
                new Name("T"),
                new Add([new Name("pH_st"), new Minus([new Name("pH_lu")])]),
              ]),
            ]),
          ]),
          new Mul([new Name("R"), new Name("T")]),
        ]),
      ),
      texName: "K\\_cytb6f",
    })
    .addAssignment("K_ATPsynth", {
      fn: new Mul([
        new Name("Pi"),
        new Exp(
          new Divide([
            new Add([
              new Minus([new Name("DG_ATP")]),
              new Mul([
                new Name("R"),
                new Name("T"),
                new Add([
                  new Mul([new Num(10.74539710063888), new Name("pH_st")]),
                  new Minus([
                    new Mul([new Num(10.74539710063888), new Name("pH_lu")]),
                  ]),
                ]),
              ]),
            ]),
            new Mul([new Name("R"), new Name("T")]),
          ]),
        ),
      ]),
      texName: "K\\_ATPsynth",
    })
    .addAssignment("pq_ox", {
      fn: new Add([new Name("PQ_tot"), new Minus([new Name("pq_red")])]),
      displayName: "PQ",
      texName: "pq\\_ox",
    })
    .addAssignment("adp", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("atp")])]),
      displayName: "ADP",
      texName: "adp",
    })
    .addAssignment("psbs_pr", {
      fn: new Add([new Name("PsbS_tot"), new Minus([new Name("psbs_de")])]),
      texName: "psbs\\_pr",
    })
    .addAssignment("zx", {
      fn: new Add([new Name("X_tot"), new Minus([new Name("vx")])]),
      texName: "zx",
    })
    .addAssignment("Q", {
      fn: new Add([
        new Mul([
          new Name("gamma_0"),
          new Name("psbs_de"),
          new Add([
            new Num(1.0),
            new Minus([
              new Divide([
                new Name("zx"),
                new Add([new Name("K_ZSat"), new Name("zx")]),
              ]),
            ]),
          ]),
        ]),
        new Mul([
          new Name("gamma_1"),
          new Name("psbs_pr"),
          new Add([
            new Num(1.0),
            new Minus([
              new Divide([
                new Name("zx"),
                new Add([new Name("K_ZSat"), new Name("zx")]),
              ]),
            ]),
          ]),
        ]),
        new Divide([
          new Mul([new Name("gamma_2"), new Name("psbs_pr"), new Name("zx")]),
          new Add([new Name("K_ZSat"), new Name("zx")]),
        ]),
        new Divide([
          new Mul([new Name("gamma_3"), new Name("psbs_de"), new Name("zx")]),
          new Add([new Name("K_ZSat"), new Name("zx")]),
        ]),
      ]),
      texName: "Q",
    })
    .addAssignment("Fluo", {
      fn: new Add([
        new Divide([
          new Mul([new Name("B0"), new Name("k_F")]),
          new Add([
            new Name("k_F"),
            new Name("k_P"),
            new Mul([new Name("Q"), new Name("k_H")]),
          ]),
        ]),
        new Divide([
          new Mul([new Name("B2"), new Name("k_F")]),
          new Add([new Name("k_F"), new Mul([new Name("Q"), new Name("k_H")])]),
        ]),
      ]),
      texName: "Fluo",
    })
    .addReaction("v_PSII", {
      fn: new Mul([new Num(0.5), new Name("B1"), new Name("k_P")]),
      stoichiometry: [
        { name: "pq_red", value: new Num(1.0) },
        { name: "protons", value: new Divide([new Num(2.0), new Name("b_H")]) },
      ],
      displayName: "PSII",
      texName: "v\\_PSII",
    })
    .addReaction("v_PQ", {
      fn: new Add([
        new Mul([
          new Name("pq_red"),
          new Add([
            new Mul([new Name("O2_ex"), new Name("k_PTOX")]),
            new Divide([
              new Mul([
                new Name("K_cytb6f"),
                new Name("PPFD"),
                new Name("k_Cytb6f"),
              ]),
              new Add([new Num(1.0), new Name("K_cytb6f")]),
            ]),
          ]),
        ]),
        new Minus([
          new Divide([
            new Mul([
              new Name("PPFD"),
              new Name("k_Cytb6f"),
              new Add([new Name("PQ_tot"), new Minus([new Name("pq_red")])]),
            ]),
            new Add([new Num(1.0), new Name("K_cytb6f")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "pq_red", value: new Num(-1.0) },
        { name: "protons", value: new Divide([new Num(4.0), new Name("b_H")]) },
      ],
      displayName: "PQ reduction",
      texName: "v\\_PQ",
    })
    .addReaction("atp_synthase", {
      fn: new Mul([
        new Name("k_ATPsynth"),
        new Name("vmax_atp_synthase"),
        new Add([
          new Name("AP_tot"),
          new Minus([new Name("atp")]),
          new Minus([new Divide([new Name("atp"), new Name("K_ATPsynth")])]),
        ]),
      ]),
      stoichiometry: [
        { name: "atp", value: new Num(1.0) },
        {
          name: "protons",
          value: new Minus([
            new Divide([new Num(4.666666666666667), new Name("b_H")]),
          ]),
        },
      ],
      displayName: "ATP synthase",
      texName: "atp\\_synthase",
    })
    .addReaction("atp_activase", {
      fn: new Piecewise([
        new Mul([
          new Name("k_ActATPase"),
          new Add([new Num(1.0), new Minus([new Name("vmax_atp_synthase")])]),
        ]),
        new GreaterThan([new Name("PPFD"), new Num(0.0)]),
        new Minus([
          new Mul([new Name("k_DeactATPase"), new Name("vmax_atp_synthase")]),
        ]),
      ]),
      stoichiometry: [{ name: "vmax_atp_synthase", value: new Num(1.0) }],
      texName: "atp\\_activase",
    })
    .addReaction("proton_leak", {
      fn: new Mul([
        new Name("k_leak"),
        new Add([new Name("protons"), new Minus([new Name("H_st")])]),
      ]),
      stoichiometry: [
        {
          name: "protons",
          value: new Minus([new Divide([new Num(1.0), new Name("b_H")])]),
        },
      ],
      displayName: "proton leak",
      texName: "proton\\_leak",
    })
    .addReaction("v_ATPcons", {
      fn: new Mul([new Name("atp"), new Name("k_ATPconsum")]),
      stoichiometry: [{ name: "atp", value: new Num(-1.0) }],
      texName: "v\\_ATPcons",
    })
    .addReaction("v_Xcyc", {
      fn: new Add([
        new Minus([
          new Mul([
            new Name("k_EZ"),
            new Add([new Name("X_tot"), new Minus([new Name("vx")])]),
          ]),
        ]),
        new Divide([
          new Mul([
            new Name("k_DV"),
            new Name("vx"),
            new Pow(new Name("protons"), new Name("nhx")),
          ]),
          new Add([
            new Pow(new Name("K_pHSat_inv"), new Name("nhx")),
            new Pow(new Name("protons"), new Name("nhx")),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "vx", value: new Num(-1.0) }],
      texName: "v\\_Xcyc",
    })
    .addReaction("v_PsbSP", {
      fn: new Add([
        new Minus([
          new Mul([
            new Name("k_deprot"),
            new Add([new Name("PsbS_tot"), new Minus([new Name("psbs_de")])]),
          ]),
        ]),
        new Divide([
          new Mul([
            new Name("k_prot"),
            new Name("psbs_de"),
            new Pow(new Name("protons"), new Name("nhl")),
          ]),
          new Add([
            new Pow(new Name("K_pHSatLHC_inv"), new Name("nhl")),
            new Pow(new Name("protons"), new Name("nhl")),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "psbs_de", value: new Num(-1.0) }],
      texName: "v\\_PsbSP",
    })
    .addAssignment("B0", {
      fn: new Divide([
        new Mul([
          new Name("K_QAPQ"),
          new Name("PSII_tot"),
          new Name("k_PQH2"),
          new Name("pq_ox"),
          new Add([
            new Pow(new Name("k_F"), new Num(2.0)),
            new Mul([new Name("k_F"), new Name("k_P")]),
            new Mul([
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("k_H"), new Num(2.0)),
            ]),
            new Mul([new Name("Q"), new Name("k_H"), new Name("k_P")]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("k_F"),
              new Name("k_H"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_P"),
            new Pow(new Name("PPFD"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
        ]),
      ]),
      texName: "B0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B1", {
      fn: new Divide([
        new Mul([
          new Name("K_QAPQ"),
          new Name("PPFD"),
          new Name("PSII_tot"),
          new Name("k_PQH2"),
          new Name("pq_ox"),
          new Add([new Name("k_F"), new Mul([new Name("Q"), new Name("k_H")])]),
        ]),
        new Add([
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_P"),
            new Pow(new Name("PPFD"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
        ]),
      ]),
      texName: "B1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B2", {
      fn: new Divide([
        new Mul([
          new Name("PSII_tot"),
          new Add([
            new Mul([
              new Name("k_PQH2"),
              new Name("pq_red"),
              new Pow(new Name("k_F"), new Num(2.0)),
            ]),
            new Mul([
              new Name("K_QAPQ"),
              new Name("PPFD"),
              new Name("k_F"),
              new Name("k_P"),
            ]),
            new Mul([
              new Name("k_F"),
              new Name("k_P"),
              new Name("k_PQH2"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k_PQH2"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("k_H"), new Num(2.0)),
            ]),
            new Mul([
              new Name("K_QAPQ"),
              new Name("PPFD"),
              new Name("Q"),
              new Name("k_H"),
              new Name("k_P"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k_H"),
              new Name("k_P"),
              new Name("k_PQH2"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("k_F"),
              new Name("k_H"),
              new Name("k_PQH2"),
              new Name("pq_red"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_P"),
            new Pow(new Name("PPFD"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
        ]),
      ]),
      texName: "B2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B3", {
      fn: new Divide([
        new Mul([
          new Name("PPFD"),
          new Name("PSII_tot"),
          new Add([
            new Mul([new Name("K_QAPQ"), new Name("PPFD"), new Name("k_P")]),
            new Mul([new Name("k_F"), new Name("k_PQH2"), new Name("pq_red")]),
            new Mul([new Name("k_P"), new Name("k_PQH2"), new Name("pq_red")]),
            new Mul([
              new Name("Q"),
              new Name("k_H"),
              new Name("k_PQH2"),
              new Name("pq_red"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_P"),
            new Pow(new Name("PPFD"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("k_F"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("k_PQH2"),
            new Name("pq_red"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("k_F"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_F"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("k_H"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_red"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("PPFD"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_H"),
            new Name("k_P"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("K_QAPQ"),
            new Name("Q"),
            new Name("k_F"),
            new Name("k_H"),
            new Name("k_PQH2"),
            new Name("pq_ox"),
          ]),
        ]),
      ]),
      texName: "B3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    });
}
