import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  Ln,
  Max,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Ebenhoeh 2014 photosynthetic electron transport chain (PETC) model.
 *
 * |             |                                                                                                              |
 * | ----------- | ------------------------------------------------------------------------------------------------------------ |
 * | doi         | 10.1098/rstb.2013.0223                                                                                       |
 * | main author | Oliver Ebenhöh                                                                                               |
 * | paper title | Short-term acclimation of the photosynthetic electron transfer chain to changing light: a mathematical model |
 * | published   | March 2014                                                                                                   |
 * | journal     | Philosophical Transactions of the Royal Society B                                                            |
 * | organism    | Chlamydomonas reinhardtii                                                                                    |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                                         |
 *
 * Core dynamic model of the thylakoid electron transport chain used to study
 * short-term light acclimation (state transitions) in *Chlamydomonas*. Covers
 * PSII/PSI, cytochrome b6f, FNR, ATP synthase, cyclic electron flow, PTOX/NDH and
 * LHCII state transitions. Non-photochemical quenching is a constant base term
 * (kH0); the xanthophyll/PsbS machinery of the later Matuszynska models is
 * absent. ATP and NADPH are consumed by lumped linear sinks instead of a Calvin
 * cycle.
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("pH", {
      value: 7.8,
      texName: "pH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PPFD", {
      value: 100.0,
      texName: "PPFD",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("cPPFD", {
      value: 0.3333333333333333,
      texName: "cPPFD",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PSII_total", {
      value: 2.5,
      texName: "PSII\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PSI_total", {
      value: 2.5,
      texName: "PSI\\_total",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PQ_tot", {
      value: 17.5,
      texName: "PQ\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PC_tot", {
      value: 4.0,
      texName: "PC\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("Fd_star", {
      value: 5.0,
      displayName: "Fd_tot",
      texName: "Fd*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("NADP_star", {
      value: 25.0,
      displayName: "NADP_tot",
      texName: "NADP*",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("A_star_P", {
      value: 60.0,
      displayName: "AP_tot",
      texName: "A*P",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("LHC_tot", {
      value: 1.0,
      texName: "LHC\\_tot",
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
    .addParameter("bH", {
      value: 100.0,
      texName: "bH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("E_0_QA", {
      value: -0.14,
      displayName: "E0_QA",
      texName: "E^0\\_QA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_PQ", {
      value: 0.354,
      displayName: "E0_PQ",
      texName: "E^0\\_PQ",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_PC", {
      value: 0.38,
      displayName: "E0_PC",
      texName: "E^0\\_PC",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_P700", {
      value: 0.48,
      displayName: "E0_P700",
      texName: "E^0\\_P700",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_FA", {
      value: -0.55,
      displayName: "E0_FA",
      texName: "E^0\\_FA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_Fd", {
      value: -0.43,
      displayName: "E0_Fd",
      texName: "E^0\\_Fd",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E_0_NADP", {
      value: -0.113,
      displayName: "E0_NADP",
      texName: "E^0\\_NADP",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("kH0", {
      value: 500000000.0,
      texName: "kH0",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kH", {
      value: 0.0,
      texName: "kH",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kF", {
      value: 62500000.0,
      texName: "kF",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k2", {
      value: 1200000000.0,
      texName: "k2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("Q", {
      value: 0.0,
      texName: "Q",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("staticAntI", {
      value: 0.2,
      texName: "staticAntI",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("staticAntII", {
      value: 0.0,
      texName: "staticAntII",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kf_atp_synthase", {
      value: 20.0,
      texName: "kf\\_atp\\_synthase",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_atp_consumption", {
      value: 10.0,
      texName: "kf\\_atp\\_consumption",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("Pi_mol", {
      value: 0.01,
      texName: "Pi\\_mol",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("DeltaG0_ATP", {
      value: 30.6,
      texName: "DeltaG0\\_ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
        ],
      }),
    })
    .addParameter("HPR", {
      value: 4.666666666666667,
      texName: "HPR",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kf_nadph_consumption", {
      value: 15.0,
      texName: "kf\\_nadph\\_consumption",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kf_proton_leak", {
      value: 0.01,
      texName: "kf\\_proton\\_leak",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kPQred", {
      value: 250.0,
      texName: "kPQred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_b6f", {
      value: 2.5,
      texName: "kcat\\_b6f",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kPTOX", {
      value: 0.01,
      texName: "kPTOX",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kPCox", {
      value: 2500.0,
      texName: "kPCox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kFdred", {
      value: 250000.0,
      texName: "kFdred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kcat_fnr", {
      value: 500.0,
      texName: "kcat\\_fnr",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("E0_fnr", {
      value: 3.0,
      texName: "E0\\_fnr",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_fnr_Ferredoxine_reduced", {
      value: 1.56,
      displayName: "km_fnr_Ferredoxine (reduced)",
      texName: "km\\_fnr\\_Ferredoxine (reduced)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("km_fnr_NADP", {
      value: 0.22,
      texName: "km\\_fnr\\_NADP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_cyclic_electron_flow", {
      value: 1.0,
      texName: "kf\\_cyclic\\_electron\\_flow",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("O2_dissolved_lumen", {
      value: 8.0,
      displayName: "O2 (dissolved)_lumen",
      texName: "O2 (dissolved)\\_lumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kf_ndh", {
      value: 0.004,
      texName: "kf\\_ndh",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kStt7", {
      value: 0.0035,
      texName: "kStt7",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kPph1", {
      value: 0.0013,
      texName: "kPph1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("km_lhc_state_transition_12", {
      value: 0.2,
      texName: "km\\_lhc\\_state\\_transition\\_12",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_ST", {
      value: 2.0,
      texName: "n\\_ST",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Plastoquinone_oxidised", {
      value: 17.5,
      displayName: "PQ",
      texName: "Plastoquinone (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Plastocyanine_oxidised", {
      value: 0.0202,
      displayName: "Plastocyanine (oxidised)",
      texName: "Plastocyanine (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ferredoxine_oxidised", {
      value: 5.0,
      displayName: "Fd_ox",
      texName: "Ferredoxine (oxidised)",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("ATP", {
      value: 0.0,
      texName: "ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("NADPH", {
      value: 0.0,
      texName: "NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("protons_lumen", {
      value: 0.00025238293779207717,
      texName: "protons\\_lumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Light_harvesting_complex", {
      value: 0.9,
      displayName: "Light-harvesting complex",
      texName: "Light-harvesting complex",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("RT", {
      fn: new Mul([new Name("R"), new Name("T")]),
      texName: "RT",
    })
    .addAssignment("dG_pH", {
      fn: new Mul([new Num(2.302585092994046), new Name("R"), new Name("T")]),
      texName: "dG\\_pH",
    })
    .addAssignment("pH_lumen", {
      fn: new Minus([
        new Divide([
          new Ln(
            new Min([
              new Num(0.1),
              new Max([
                new Num(1e-14),
                new Mul([new Num(0.00025), new Name("protons_lumen")]),
              ]),
            ]),
          ),
          new Ln(new Num(10.0)),
        ]),
      ]),
      texName: "pH\\_lumen",
    })
    .addAssignment("protons_stroma_chl", {
      fn: new Mul([
        new Num(4000.0),
        new Pow(new Num(10.0), new Minus([new Name("pH")])),
      ]),
      texName: "protons\\_stroma\\_chl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Plastoquinone_reduced", {
      fn: new Add([
        new Name("PQ_tot"),
        new Minus([new Name("Plastoquinone_oxidised")]),
      ]),
      displayName: "PQH2",
      texName: "Plastoquinone (reduced)",
    })
    .addAssignment("Plastocyanine_reduced", {
      fn: new Add([
        new Name("PC_tot"),
        new Minus([new Name("Plastocyanine_oxidised")]),
      ]),
      displayName: "Plastocyanine (reduced)",
      texName: "Plastocyanine (reduced)",
    })
    .addAssignment("Ferredoxine_reduced", {
      fn: new Add([
        new Name("Fd_star"),
        new Minus([new Name("Ferredoxine_oxidised")]),
      ]),
      displayName: "Fd_red",
      texName: "Ferredoxine (reduced)",
    })
    .addAssignment("ADP", {
      fn: new Add([new Name("A_star_P"), new Minus([new Name("ATP")])]),
      texName: "ADP",
    })
    .addAssignment("NADP", {
      fn: new Add([new Name("NADP_star"), new Minus([new Name("NADPH")])]),
      texName: "NADP",
    })
    .addAssignment("Light_harvesting_complex_protonated", {
      fn: new Add([
        new Name("LHC_tot"),
        new Minus([new Name("Light_harvesting_complex")]),
      ]),
      displayName: "Light-harvesting complex (protonated)",
      texName: "Light-harvesting complex (protonated)",
    })
    .addAssignment("PSII_cross_section", {
      fn: new Add([
        new Name("staticAntII"),
        new Mul([
          new Name("Light_harvesting_complex"),
          new Add([
            new Num(1.0),
            new Minus([new Name("staticAntI")]),
            new Minus([new Name("staticAntII")]),
          ]),
        ]),
      ]),
      texName: "PSII\\_cross\\_section",
    })
    .addAssignment("keq_Plastoquinone_reduced", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_QA"), new Name("F")]),
            ]),
            new Minus([
              new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH")]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      displayName: "keq_Plastoquinone (reduced)",
      texName: "keq\\_Plastoquinone (reduced)",
    })
    .addAssignment("keq_atp_synthase", {
      fn: new Mul([
        new Name("Pi_mol"),
        new Exp(
          new Divide([
            new Add([
              new Minus([new Name("DeltaG0_ATP")]),
              new Mul([
                new Name("HPR"),
                new Name("dG_pH"),
                new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
              ]),
            ]),
            new Name("RT"),
          ]),
        ),
      ]),
      texName: "keq\\_atp\\_synthase",
    })
    .addAssignment("keq_b6f", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E_0_PC"), new Name("F")]),
            new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH_lumen")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
            ]),
            new Minus([
              new Mul([
                new Num(2.0),
                new Name("dG_pH"),
                new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
              ]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_b6f",
    })
    .addAssignment("keq_fnr", {
      fn: new Exp(
        new Divide([
          new Add([
            new Minus([new Mul([new Name("dG_pH"), new Name("pH")])]),
            new Mul([new Num(2.0), new Name("E_0_NADP"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E_0_Fd"), new Name("F")]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_fnr",
    })
    .addAssignment("vmax_fnr", {
      fn: new Mul([new Name("E0_fnr"), new Name("kcat_fnr")]),
      texName: "vmax\\_fnr",
    })
    .addAssignment("keq_PCP700", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E_0_P700"), new Name("F")]),
            new Minus([new Mul([new Name("E_0_PC"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_PCP700",
    })
    .addAssignment("keq_ferredoxin_reductase", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E_0_Fd"), new Name("F")]),
            new Minus([new Mul([new Name("E_0_FA"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "keq\\_ferredoxin\\_reductase",
    })
    .addAssignment("A1", {
      fn: new Divide([
        new Name("PSI_total"),
        new Add([
          new Num(1.0),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([
                new Name("Ferredoxine_reduced"),
                new Mul([
                  new Name("Ferredoxine_oxidised"),
                  new Name("keq_ferredoxin_reductase"),
                ]),
              ]),
            ]),
            new Add([
              new Divide([
                new Name("Plastocyanine_oxidised"),
                new Mul([
                  new Name("Plastocyanine_reduced"),
                  new Name("keq_PCP700"),
                ]),
              ]),
              new Divide([
                new Mul([
                  new Name("PPFD"),
                  new Name("cPPFD"),
                  new Add([
                    new Num(1.0),
                    new Minus([new Name("PSII_cross_section")]),
                  ]),
                ]),
                new Mul([new Name("Plastocyanine_reduced"), new Name("kPCox")]),
              ]),
            ]),
          ]),
          new Divide([
            new Mul([
              new Name("PPFD"),
              new Name("cPPFD"),
              new Add([
                new Num(1.0),
                new Minus([new Name("PSII_cross_section")]),
              ]),
            ]),
            new Mul([new Name("Ferredoxine_oxidised"), new Name("kFdred")]),
          ]),
        ]),
      ]),
      texName: "A1",
    })
    .addReaction("PSII", {
      fn: new Mul([new Num(0.5), new Name("B1"), new Name("k2")]),
      stoichiometry: [
        { name: "Plastoquinone_oxidised", value: new Num(-1.0) },
        {
          name: "protons_lumen",
          value: new Divide([new Num(2.0), new Name("bH")]),
        },
      ],
      texName: "PSII",
    })
    .addReaction("PSI", {
      fn: new Mul([
        new Name("A1"),
        new Name("PPFD"),
        new Name("cPPFD"),
        new Add([new Num(1.0), new Minus([new Name("PSII_cross_section")])]),
      ]),
      stoichiometry: [
        { name: "Ferredoxine_oxidised", value: new Num(-1.0) },
        { name: "Plastocyanine_oxidised", value: new Num(1.0) },
      ],
      texName: "PSI",
    })
    .addReaction("PTOX", {
      fn: new Mul([
        new Name("O2_dissolved_lumen"),
        new Name("Plastoquinone_reduced"),
        new Name("kPTOX"),
      ]),
      stoichiometry: [{ name: "Plastoquinone_oxidised", value: new Num(1.0) }],
      texName: "PTOX",
    })
    .addReaction("ndh", {
      fn: new Mul([new Name("Plastoquinone_oxidised"), new Name("kf_ndh")]),
      stoichiometry: [{ name: "Plastoquinone_oxidised", value: new Num(-1.0) }],
      displayName: "NDH",
      texName: "ndh",
    })
    .addReaction("b6f", {
      fn: new Max([
        new Minus([new Name("kcat_b6f")]),
        new Mul([
          new Name("kcat_b6f"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Pow(new Name("Plastocyanine_oxidised"), new Num(2.0)),
            ]),
            new Minus([
              new Divide([
                new Mul([
                  new Name("Plastoquinone_oxidised"),
                  new Pow(new Name("Plastocyanine_reduced"), new Num(2.0)),
                ]),
                new Name("keq_b6f"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Plastocyanine_oxidised", value: new Num(-2.0) },
        { name: "Plastoquinone_oxidised", value: new Num(1.0) },
        {
          name: "protons_lumen",
          value: new Divide([new Num(4.0), new Name("bH")]),
        },
      ],
      displayName: "cyt b6f",
      texName: "b6f",
    })
    .addReaction("cyclic_electron_flow", {
      fn: new Mul([
        new Name("Plastoquinone_oxidised"),
        new Name("kf_cyclic_electron_flow"),
        new Pow(new Name("Ferredoxine_reduced"), new Num(2.0)),
      ]),
      stoichiometry: [
        { name: "Plastoquinone_oxidised", value: new Num(-1.0) },
        { name: "Ferredoxine_oxidised", value: new Num(2.0) },
      ],
      displayName: "cyclic electron flow",
      texName: "cyclic\\_electron\\_flow",
    })
    .addReaction("fnr", {
      fn: new Divide([
        new Mul([
          new Name("vmax_fnr"),
          new Add([
            new Divide([
              new Mul([
                new Name("NADP"),
                new Pow(
                  new Divide([
                    new Name("Ferredoxine_reduced"),
                    new Name("km_fnr_Ferredoxine_reduced"),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("km_fnr_NADP"),
            ]),
            new Minus([
              new Divide([
                new Mul([
                  new Name("NADPH"),
                  new Pow(
                    new Divide([
                      new Name("Ferredoxine_oxidised"),
                      new Name("km_fnr_Ferredoxine_reduced"),
                    ]),
                    new Num(2.0),
                  ),
                ]),
                new Mul([new Name("keq_fnr"), new Name("km_fnr_NADP")]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Num(-1.0),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([new Name("NADP"), new Name("km_fnr_NADP")]),
            ]),
            new Add([
              new Num(1.0),
              new Pow(
                new Divide([
                  new Name("Ferredoxine_reduced"),
                  new Name("km_fnr_Ferredoxine_reduced"),
                ]),
                new Num(2.0),
              ),
              new Divide([
                new Name("Ferredoxine_reduced"),
                new Name("km_fnr_Ferredoxine_reduced"),
              ]),
            ]),
          ]),
          new Mul([
            new Add([
              new Num(1.0),
              new Divide([new Name("NADPH"), new Name("km_fnr_NADP")]),
            ]),
            new Add([
              new Num(1.0),
              new Pow(
                new Divide([
                  new Name("Ferredoxine_oxidised"),
                  new Name("km_fnr_Ferredoxine_reduced"),
                ]),
                new Num(2.0),
              ),
              new Divide([
                new Name("Ferredoxine_oxidised"),
                new Name("km_fnr_Ferredoxine_reduced"),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "Ferredoxine_oxidised", value: new Num(2.0) },
        { name: "NADPH", value: new Num(1.0) },
      ],
      displayName: "FNR",
      texName: "fnr",
    })
    .addReaction("proton_leak", {
      fn: new Mul([
        new Name("kf_proton_leak"),
        new Add([
          new Name("protons_lumen"),
          new Minus([new Name("protons_stroma_chl")]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "protons_lumen",
          value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
        },
      ],
      displayName: "proton leak",
      texName: "proton\\_leak",
    })
    .addReaction("lhc_state_transition_12", {
      fn: new Divide([
        new Mul([
          new Num(1.0),
          new Name("Light_harvesting_complex"),
          new Name("kStt7"),
        ]),
        new Add([
          new Num(1.0),
          new Pow(
            new Divide([
              new Name("Plastoquinone_oxidised"),
              new Mul([
                new Name("PQ_tot"),
                new Name("km_lhc_state_transition_12"),
              ]),
            ]),
            new Name("n_ST"),
          ),
        ]),
      ]),
      stoichiometry: [
        { name: "Light_harvesting_complex", value: new Num(-1.0) },
      ],
      displayName: "LHC state transition 1->2",
      texName: "lhc\\_state\\_transition\\_12",
    })
    .addReaction("lhc_state_transition_21", {
      fn: new Mul([
        new Name("Light_harvesting_complex_protonated"),
        new Name("kPph1"),
      ]),
      stoichiometry: [
        { name: "Light_harvesting_complex", value: new Num(1.0) },
      ],
      displayName: "LHC state transition 2->1",
      texName: "lhc\\_state\\_transition\\_21",
    })
    .addReaction("atp_synthase", {
      fn: new Mul([
        new Name("kf_atp_synthase"),
        new Add([
          new Name("ADP"),
          new Minus([
            new Divide([new Name("ATP"), new Name("keq_atp_synthase")]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "ATP", value: new Num(1.0) },
        {
          name: "protons_lumen",
          value: new Minus([new Divide([new Name("HPR"), new Name("bH")])]),
        },
      ],
      displayName: "ATP synthase",
      texName: "atp\\_synthase",
    })
    .addReaction("atp_consumption", {
      fn: new Mul([new Name("ATP"), new Name("kf_atp_consumption")]),
      stoichiometry: [{ name: "ATP", value: new Num(-1.0) }],
      texName: "atp\\_consumption",
    })
    .addReaction("nadph_consumption", {
      fn: new Mul([new Name("NADPH"), new Name("kf_nadph_consumption")]),
      stoichiometry: [{ name: "NADPH", value: new Num(-1.0) }],
      texName: "nadph\\_consumption",
    })
    .addAssignment("B0", {
      fn: new Divide([
        new Mul([
          new Name("PSII_total"),
          new Name("Plastoquinone_oxidised"),
          new Name("kPQred"),
          new Name("keq_Plastoquinone_reduced"),
          new Add([
            new Pow(new Name("kF"), new Num(2.0)),
            new Pow(new Name("kH0"), new Num(2.0)),
            new Mul([new Name("k2"), new Name("kF")]),
            new Mul([new Name("k2"), new Name("kH0")]),
            new Mul([
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([new Num(2.0), new Name("kF"), new Name("kH0")]),
            new Mul([new Name("Q"), new Name("k2"), new Name("kH")]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            new Pow(
              new Mul([new Name("PPFD"), new Name("cPPFD")]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
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
          new Name("PPFD"),
          new Name("PSII_cross_section"),
          new Name("PSII_total"),
          new Name("Plastoquinone_oxidised"),
          new Name("cPPFD"),
          new Name("kPQred"),
          new Name("keq_Plastoquinone_reduced"),
          new Add([
            new Name("kF"),
            new Name("kH0"),
            new Mul([new Name("Q"), new Name("kH")]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            new Pow(
              new Mul([new Name("PPFD"), new Name("cPPFD")]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
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
          new Name("PSII_total"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kPQred"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("cPPFD"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("cPPFD"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("cPPFD"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            new Pow(
              new Mul([new Name("PPFD"), new Name("cPPFD")]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
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
          new Name("PSII_cross_section"),
          new Name("PSII_total"),
          new Name("cPPFD"),
          new Add([
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("k2"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("kH0"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("Plastoquinone_reduced"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("cPPFD"),
              new Name("k2"),
              new Name("keq_Plastoquinone_reduced"),
            ]),
          ]),
        ]),
        new Add([
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("kH0"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("kPQred"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("k2"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            new Pow(
              new Mul([new Name("PPFD"), new Name("cPPFD")]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("k2"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
            new Pow(new Name("Q"), new Num(2.0)),
            new Pow(new Name("kH"), new Num(2.0)),
          ]),
          new Mul([
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("kF"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kF"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH0"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("k2"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kF"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Num(2.0),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("kH"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("cPPFD"),
            new Name("kH0"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_reduced"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("k2"),
            new Name("kH"),
            new Name("keq_Plastoquinone_reduced"),
          ]),
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("Plastoquinone_oxidised"),
            new Name("Q"),
            new Name("cPPFD"),
            new Name("kH"),
            new Name("kPQred"),
            new Name("keq_Plastoquinone_reduced"),
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
    })
    .addReadout("PQ_red_per_tot", {
      fn: new Divide([new Name("Plastoquinone_reduced"), new Name("PQ_tot")]),
      displayName: "PQ_red/tot",
      texName: "PQ\\_red/tot",
    })
    .addReadout("Fd_red_per_tot", {
      fn: new Divide([new Name("Ferredoxine_reduced"), new Name("Fd_star")]),
      displayName: "Fd_red/tot",
      texName: "Fd\\_red/tot",
    })
    .addReadout("PC_red_per_tot", {
      fn: new Divide([new Name("Plastocyanine_reduced"), new Name("PC_tot")]),
      displayName: "PC_red/tot",
      texName: "PC\\_red/tot",
    })
    .addReadout("NADPH_per_tot", {
      fn: new Divide([new Name("NADPH"), new Name("NADP_star")]),
      displayName: "NADPH/tot",
      texName: "NADPH/tot",
    })
    .addReadout("ATP_per_tot", {
      fn: new Divide([new Name("ATP"), new Name("A_star_P")]),
      displayName: "ATP/tot",
      texName: "ATP/tot",
    })
    .addReadout("Fluo", {
      fn: new Add([
        new Divide([
          new Mul([
            new Name("B0"),
            new Name("PSII_cross_section"),
            new Name("kF"),
          ]),
          new Add([
            new Name("k2"),
            new Name("kF"),
            new Name("kH"),
            new Name("kH0"),
          ]),
        ]),
        new Divide([
          new Mul([
            new Name("B2"),
            new Name("PSII_cross_section"),
            new Name("kF"),
          ]),
          new Add([new Name("kF"), new Name("kH"), new Name("kH0")]),
        ]),
      ]),
      texName: "Fluo",
    });
}
