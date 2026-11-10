import {
  KineticModelBuilder,
  Unit,
} from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  GreaterEqual,
  GreaterThan,
  LessEqual,
  Ln,
  Max,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
  Pow,
} from "@computational-biology-aachen/mxlweb-core/mathml";

/**
 * Complete mxlpy port of the Zaks et al. photosynthesis model.
 *
 * |             |                                                                  |
 * | ----------- | ---------------------------------------------------------------- |
 * | doi         | 10.1073/pnas.1211017109                                          |
 * | main author | Julia Zaks                                                       |
 * | paper title | A kinetic model of rapidly reversible nonphotochemical quenching |
 * | published   | September 25, 2012                                               |
 * | journal     | PNAS                                                             |
 * | organism    | Higher plants                                                    |
 * | Ported by   | Quang Huy Nguyen ( @PhotosyntheticBatman )                       |
 *
 * The model provides one of the first mechanistic description of energy dependent
 * quenching process qE within NPQ. qE activity is simulated under 2 different
 * light conditions: low light and high light.
 *
 * Sections: F1 - PSII (antenna + reaction centre) F2 - qE / xanthophyll cycle F3
 * \- PQ pool (QB site + plastoquinone) F4 - Cytochrome b6f F5 - PSI F7 - ATP
 * synthase F8 - Lumen ion fluxes (Mg, Cl, K)
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addParameter("crosssection", {
      value: 0.25,
      texName: "crosssection",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "mole", prefix: "micro", exponent: -1 },
        ],
      }),
    })
    .addParameter("kEETLHP680QAox", {
      value: 5000000000.0,
      texName: "kEETLHP680QAox",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kEETLHP680QAred", {
      value: 850000000.0,
      texName: "kEETLHP680QAred",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kQ", {
      value: 3000000000.0,
      texName: "kQ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kEETLHP680revQAox", {
      value: 10000000000.0,
      texName: "kEETLHP680revQAox",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kEETLHP680revQAred", {
      value: 10000000000.0,
      texName: "kEETLHP680revQAred",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kquenchP680plus", {
      value: 500000000.0,
      texName: "kquenchP680plus",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kNRantenna", {
      value: 500000000.0,
      texName: "kNRantenna",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kNRP680", {
      value: 100000000.0,
      texName: "kNRP680",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PsbSDose", {
      value: 0.6,
      texName: "PsbSDose",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kF", {
      value: 70000000.0,
      texName: "kF",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("alphaRC", {
      value: 0.4,
      texName: "alphaRC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("alphaQ", {
      value: 0.1,
      texName: "alphaQ",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kETP680PheOpenRC", {
      value: 3000000000000.0,
      texName: "kETP680PheOpenRC",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETP680PheClosedRC", {
      value: 10000000000.0,
      texName: "kETP680PheClosedRC",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETPheToQA", {
      value: 3000000000.0,
      texName: "kETPheToQA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETWaterOxidation", {
      value: 30000000.0,
      texName: "kETWaterOxidation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kP680Pherecombination", {
      value: 500000000.0,
      texName: "kP680Pherecombination",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kP680QArecombination", {
      value: 30.0,
      texName: "kP680QArecombination",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kP680QArecombinationClosedRC", {
      value: 580.0,
      texName: "kP680QArecombinationClosedRC",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETQAtoQB1", {
      value: 3500.0,
      texName: "kETQAtoQB1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETQB1toQA", {
      value: 350.0,
      texName: "kETQB1toQA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETQAtoQB2", {
      value: 1600.0,
      texName: "kETQAtoQB2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETQB2toQA", {
      value: 1600.0,
      texName: "kETQB2toQA",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PQH2undock", {
      value: 800.0,
      texName: "PQH2undock",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("QReoxidationRate", {
      value: 100.0,
      texName: "QReoxidationRate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PQdockingrate", {
      value: 500.0,
      texName: "PQdockingrate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("QuinonePoolSize", {
      value: 10.0,
      texName: "QuinonePoolSize",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("pKaC", {
      value: 5.8,
      texName: "pKaC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nC", {
      value: 1.2,
      texName: "nC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("pHStromaStart", {
      value: 7.2,
      texName: "pHStromaStart",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("pHLumenStart", {
      value: 7.2,
      texName: "pHLumenStart",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("StromaProtonsStart", {
      value: 1e-10,
      texName: "StromaProtonsStart",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("bufferCapacityStroma", {
      value: 0.1,
      texName: "bufferCapacityStroma",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("bufferCapacityLumen", {
      value: 0.03,
      texName: "bufferCapacityLumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("ATPConductivity", {
      value: 6e-10,
      texName: "ATPConductivity",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("kATPsActivate", {
      value: 0.25,
      texName: "kATPsActivate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kATPsInactivate", {
      value: 0.003,
      texName: "kATPsInactivate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("thresholdpmf", {
      value: 0.001,
      texName: "thresholdpmf",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("leakpmf", {
      value: 0.8,
      texName: "leakpmf",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("leakConductivity", {
      value: 1e-7,
      texName: "leakConductivity",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("PCl", {
      value: 1.8e-8,
      texName: "PCl",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("PMg", {
      value: 3.6e-8,
      texName: "PMg",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("PK", {
      value: 1.8e-8,
      texName: "PK",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("zCl", {
      value: -1.0,
      texName: "zCl",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("zMg", {
      value: 2.0,
      texName: "zMg",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("zK", {
      value: 1.0,
      texName: "zK",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("StromaClStart", {
      value: 0.01,
      texName: "StromaClStart",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("StromaMgStart", {
      value: 0.01,
      texName: "StromaMgStart",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("StromaKStart", {
      value: 0.01,
      texName: "StromaKStart",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("Rconst", {
      value: 8.314,
      displayName: "R",
      texName: "Rconst",
      unit: Unit.fromJson({
        factors: [
          { kind: "joule", exponent: 1 },
          { kind: "kelvin", exponent: -1 },
          { kind: "mole", exponent: -1 },
        ],
      }),
    })
    .addParameter("Fconst", {
      value: 96485.0,
      displayName: "F",
      texName: "Fconst",
      unit: Unit.fromJson({
        factors: [
          { kind: "coulomb", exponent: 1 },
          { kind: "mole", exponent: -1 },
        ],
      }),
    })
    .addParameter("Tconst", {
      value: 300.0,
      displayName: "T",
      texName: "Tconst",
      unit: Unit.fromJson({ factors: [{ kind: "kelvin", exponent: 1 }] }),
    })
    .addParameter("LumenVolume", {
      value: 6.7e-21,
      texName: "LumenVolume",
      unit: Unit.fromJson({ factors: [{ kind: "litre", exponent: 1 }] }),
    })
    .addParameter("StromaVolume", {
      value: 5.36e-20,
      texName: "StromaVolume",
      unit: Unit.fromJson({ factors: [{ kind: "litre", exponent: 1 }] }),
    })
    .addParameter("lumenVolumePerArea", {
      value: 8e-10,
      texName: "lumenVolumePerArea",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
        ],
      }),
    })
    .addParameter("MembraneCapacitance", {
      value: 1e-6,
      texName: "MembraneCapacitance",
      unit: Unit.fromJson({
        factors: [
          { kind: "coulomb", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("Na", {
      value: 6.022e23,
      texName: "Na",
      unit: Unit.fromJson({ factors: [{ kind: "mole", exponent: -1 }] }),
    })
    .addParameter("VDErateVioToAnth", {
      value: 0.04,
      texName: "VDErateVioToAnth",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("VDErateAnthToZea", {
      value: 0.02,
      texName: "VDErateAnthToZea",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("ZErate", {
      value: 0.0004,
      texName: "ZErate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("TotalXanthophyll", {
      value: 1.0,
      texName: "TotalXanthophyll",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("VDEpKa", {
      value: 6.0,
      texName: "VDEpKa",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nVDE", {
      value: 6.0,
      texName: "nVDE",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PsbSpKa", {
      value: 6.4,
      texName: "PsbSpKa",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nPsbS", {
      value: 3.0,
      texName: "nPsbS",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("zfrac", {
      value: 0.8,
      texName: "zfrac",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PsbSConvertRate", {
      value: 0.1,
      texName: "PsbSConvertRate",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PSIcrossSection", {
      value: 0.35,
      texName: "PSIcrossSection",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "mole", prefix: "micro", exponent: -1 },
        ],
      }),
    })
    .addParameter("kETPCP700", {
      value: 6000.0,
      texName: "kETPCP700",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETP700Fdx", {
      value: 10.0,
      texName: "kETP700Fdx",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PCperPSI", {
      value: 3.0,
      texName: "PCperPSI",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("ElectronsPerPC", {
      value: 1.0,
      texName: "ElectronsPerPC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("fracIntactRC", {
      value: 1.0,
      texName: "fracIntactRC",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("voltsperlog", {
      value: 0.02585065036015961,
      texName: "voltsperlog",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("LightIntensity", {
      value: 100.0,
      displayName: "PPFD",
      texName: "LightIntensity",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
      slider: {
        min: "0",
        max: "1000",
        step: "100",
      },
    })
    .addParameter("P680neut", {
      value: 1.0,
      texName: "P680neut",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("qtrigg1", {
      value: 1.0,
      texName: "qtrigg1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("qtrigg2", {
      value: 0.0,
      texName: "qtrigg2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("qtrigg3", {
      value: 1.0,
      texName: "qtrigg3",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("ATPConductivityReverse", {
      value: 1e-10,
      texName: "ATPConductivityReverse",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "metre", prefix: "centi", exponent: -2 },
          { kind: "second", exponent: -1 },
          { kind: "volt", exponent: -1 },
        ],
      }),
    })
    .addParameter("ATPperPSI", {
      value: 600.0,
      texName: "ATPperPSI",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("CytRegulateYesNO", {
      value: 1.0,
      texName: "CytRegulateYesNO",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("F_PsbS", {
      value: 0.6,
      texName: "F\\_PsbS",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("NADPperPSI", {
      value: 15.0,
      texName: "NADPperPSI",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PsbSperPSII", {
      value: 1.0,
      texName: "PsbSperPSII",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("damageyesno", {
      value: 0.0,
      texName: "damageyesno",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("electronsPerNADPH", {
      value: 2.0,
      texName: "electronsPerNADPH",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kEETP700", {
      value: 14000000000.0,
      texName: "kEETP700",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETFdxMV", {
      value: 1000.0,
      texName: "kETFdxMV",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETFdxPQ", {
      value: 0.005,
      texName: "kETFdxPQ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETFdxThrdx", {
      value: 1000.0,
      texName: "kETFdxThrdx",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETNADPHPQ", {
      value: 100.0,
      texName: "kETNADPHPQ",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kETThrdxOx", {
      value: 100.0,
      texName: "kETThrdxOx",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kP680PherecombinationClosedRC", {
      value: 500.0,
      texName: "kP680PherecombinationClosedRC",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kP680PherecombinationOpenRC", {
      value: 200000000.0,
      texName: "kP680PherecombinationOpenRC",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kPheQArecombination", {
      value: 500.0,
      texName: "kPheQArecombination",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kQuenchDamage", {
      value: 0.0,
      texName: "kQuenchDamage",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("repairyesno", {
      value: 0.0,
      texName: "repairyesno",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("tF", {
      value: 1.5e-9,
      texName: "tF",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("tHop", {
      value: 1.7e-11,
      texName: "tHop",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("tauCS", {
      value: 5.5e-12,
      texName: "tauCS",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("tauqE", {
      value: 1e-11,
      texName: "tauqE",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: 1 }] }),
    })
    .addParameter("ATPperProton", {
      value: 0.25,
      texName: "ATPperProton",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("ATP", {
      value: 2.0,
      texName: "ATP",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("ActiveATPs", {
      value: 0.05,
      texName: "ActiveATPs",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Antheraxanthin", {
      value: 1e-14,
      texName: "Antheraxanthin",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Fdxox", {
      value: 1.0,
      displayName: "Fd_ox",
      texName: "Fdxox",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Fdxr", {
      value: 1e-14,
      displayName: "Fd_red",
      texName: "Fdxr",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("LumenCl", {
      value: 0.01,
      texName: "LumenCl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("LumenK", {
      value: 0.01,
      texName: "LumenK",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("LumenMg", {
      value: 0.01,
      texName: "LumenMg",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("LumenProtons", {
      value: 1e-14,
      texName: "LumenProtons",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addVariable("P680ex", {
      value: 1e-14,
      texName: "P680ex",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("P680plus", {
      value: 1e-14,
      texName: "P680plus",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("P700ox", {
      value: 1e-14,
      texName: "P700ox",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("P700r", {
      value: 1.0,
      texName: "P700r",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PCr", {
      value: 0.2,
      texName: "PCr",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PQ", {
      value: 8.999,
      texName: "PQ",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PQH2", {
      value: 0.001,
      texName: "PQH2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PSIIChlEx", {
      value: 1e-14,
      texName: "PSIIChlEx",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PheAnion", {
      value: 1e-14,
      texName: "PheAnion",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PsbSQ", {
      value: 1e-14,
      texName: "PsbSQ",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("QAox", {
      value: 1.0,
      displayName: "QA",
      texName: "QAox",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("QBneut", {
      value: 1.0,
      texName: "QBneut",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("QBred1", {
      value: 1e-7,
      texName: "QBred1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("QBred2", {
      value: 1e-7,
      texName: "QBred2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Thrdx", {
      value: 1e-14,
      texName: "Thrdx",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("TotalLEF", {
      value: 1e-14,
      texName: "TotalLEF",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Zeaxanthin", {
      value: 1e-14,
      texName: "Zeaxanthin",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("pH_stroma", {
      fn: new Add([
        new Name("pHStromaStart"),
        new Minus([
          new Divide([
            new Name("StromaProtonsStart"),
            new Name("bufferCapacityStroma"),
          ]),
        ]),
      ]),
      texName: "pH\\_stroma",
    })
    .addAssignment("pH_lumen", {
      fn: new Add([
        new Name("pHLumenStart"),
        new Minus([
          new Divide([
            new Name("LumenProtons"),
            new Name("bufferCapacityLumen"),
          ]),
        ]),
      ]),
      texName: "pH\\_lumen",
    })
    .addAssignment("total_charge_lumen", {
      fn: new Add([
        new Name("LumenProtons"),
        new Mul([new Name("LumenCl"), new Name("zCl")]),
        new Mul([new Name("LumenK"), new Name("zK")]),
        new Mul([new Name("LumenMg"), new Name("zMg")]),
      ]),
      texName: "total\\_charge\\_lumen",
    })
    .addAssignment("total_charge_stroma", {
      fn: new Add([
        new Name("StromaProtonsStart"),
        new Mul([new Name("StromaClStart"), new Name("zCl")]),
        new Mul([new Name("StromaKStart"), new Name("zK")]),
        new Mul([new Name("StromaMgStart"), new Name("zMg")]),
      ]),
      texName: "total\\_charge\\_stroma",
    })
    .addAssignment("deltapsi", {
      fn: new Divide([
        new Mul([
          new Name("Fconst"),
          new Name("lumenVolumePerArea"),
          new Add([
            new Name("total_charge_lumen"),
            new Minus([new Name("total_charge_stroma")]),
          ]),
        ]),
        new Name("MembraneCapacitance"),
      ]),
      texName: "deltapsi",
    })
    .addAssignment("deltapH", {
      fn: new Add([new Name("pH_stroma"), new Minus([new Name("pH_lumen")])]),
      displayName: "delta_pH",
      texName: "deltapH",
    })
    .addAssignment("pmf", {
      fn: new Add([
        new Name("deltapsi"),
        new Mul([
          new Num(2.302585092994046),
          new Name("deltapH"),
          new Name("voltsperlog"),
        ]),
      ]),
      texName: "pmf",
    })
    .addAssignment("deltamuCl", {
      fn: new Add([
        new Mul([new Name("deltapsi"), new Name("zCl")]),
        new Mul([
          new Name("voltsperlog"),
          new Ln(new Divide([new Name("LumenCl"), new Name("StromaClStart")])),
        ]),
      ]),
      texName: "deltamuCl",
    })
    .addAssignment("deltamuMg", {
      fn: new Add([
        new Mul([new Name("deltapsi"), new Name("zMg")]),
        new Mul([
          new Name("voltsperlog"),
          new Ln(new Divide([new Name("LumenMg"), new Name("StromaMgStart")])),
        ]),
      ]),
      texName: "deltamuMg",
    })
    .addAssignment("deltamuK", {
      fn: new Add([
        new Mul([new Name("deltapsi"), new Name("zK")]),
        new Mul([
          new Name("voltsperlog"),
          new Ln(new Divide([new Name("LumenK"), new Name("StromaKStart")])),
        ]),
      ]),
      texName: "deltamuK",
    })
    .addAssignment("efield_slowdown_r", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Mul([new Name("alphaRC"), new Name("deltapsi")]),
            new Name("voltsperlog"),
          ]),
        ]),
      ),
      texName: "efield\\_slowdown\\_r",
    })
    .addAssignment("efield_slowdown_q", {
      fn: new Exp(
        new Minus([
          new Divide([
            new Mul([new Name("alphaQ"), new Name("deltapsi")]),
            new Name("voltsperlog"),
          ]),
        ]),
      ),
      texName: "efield\\_slowdown\\_q",
    })
    .addAssignment("Violaxanthin", {
      fn: new Add([
        new Name("TotalXanthophyll"),
        new Minus([new Name("Antheraxanthin")]),
        new Minus([new Name("Zeaxanthin")]),
      ]),
      texName: "Violaxanthin",
    })
    .addAssignment("PsbS_unprot", {
      fn: new Add([new Num(1.0), new Minus([new Name("PsbSQ")])]),
      texName: "PsbS\\_unprot",
    })
    .addAssignment("active_vde", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Mul([
              new Name("nVDE"),
              new Add([new Name("pH_lumen"), new Minus([new Name("VDEpKa")])]),
            ]),
          ),
        ]),
      ]),
      texName: "active\\_vde",
    })
    .addAssignment("active_psbs", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Pow(
            new Num(10.0),
            new Mul([
              new Name("nPsbS"),
              new Add([new Name("pH_lumen"), new Minus([new Name("PsbSpKa")])]),
            ]),
          ),
        ]),
      ]),
      texName: "active\\_psbs",
    })
    .addAssignment("deact_psbs", {
      fn: new Add([new Num(1.0), new Minus([new Name("active_psbs")])]),
      texName: "deact\\_psbs",
    })
    .addAssignment("q_total", {
      fn: new Mul([
        new Name("PsbSDose"),
        new Add([
          new Mul([new Name("PsbSQ"), new Name("qtrigg2"), new Name("zfrac")]),
          new Mul([
            new Name("PsbSQ"),
            new Name("qtrigg3"),
            new Add([new Num(1.0), new Minus([new Name("zfrac")])]),
          ]),
          new Mul([
            new Name("PsbSQ"),
            new Name("qtrigg1"),
            new Name("zfrac"),
            new Add([
              new Name("Zeaxanthin"),
              new Mul([new Num(0.5), new Name("Antheraxanthin")]),
            ]),
          ]),
        ]),
      ]),
      texName: "q\\_total",
    })
    .addAssignment("QAred", {
      fn: new Mul([
        new Name("fracIntactRC"),
        new Add([new Num(1.0), new Minus([new Name("QAox")])]),
      ]),
      displayName: "QA_red",
      texName: "QAred",
    })
    .addAssignment("Pheneut", {
      fn: new Mul([
        new Name("fracIntactRC"),
        new Add([new Num(1.0), new Minus([new Name("PheAnion")])]),
      ]),
      texName: "Pheneut",
    })
    .addAssignment("PQfrac", {
      fn: new Divide([new Name("PQ"), new Name("QuinonePoolSize")]),
      texName: "PQfrac",
    })
    .addAssignment("PQH2frac", {
      fn: new Divide([new Name("PQH2"), new Name("QuinonePoolSize")]),
      texName: "PQH2frac",
    })
    .addAssignment("QBempty", {
      fn: new Add([
        new Num(1.0),
        new Minus([new Name("QBneut")]),
        new Minus([new Name("QBred1")]),
        new Minus([new Name("QBred2")]),
      ]),
      texName: "QBempty",
    })
    .addAssignment("frac_active_cyt", {
      fn: new Add([
        new Num(1.0),
        new Minus([
          new Divide([
            new Num(1.0),
            new Add([
              new Num(1.0),
              new Pow(
                new Num(10.0),
                new Mul([
                  new Name("nC"),
                  new Add([
                    new Name("pH_lumen"),
                    new Minus([new Name("pKaC")]),
                  ]),
                ]),
              ),
            ]),
          ]),
        ]),
      ]),
      texName: "frac\\_active\\_cyt",
    })
    .addAssignment("frac_pq_red", {
      fn: new Divide([
        new Name("PQH2"),
        new Add([new Name("PQ"), new Name("PQH2")]),
      ]),
      texName: "frac\\_pq\\_red",
    })
    .addAssignment("frac_active_pc", {
      fn: new Divide([
        new Add([new Name("PCperPSI"), new Minus([new Name("PCr")])]),
        new Name("PCperPSI"),
      ]),
      texName: "frac\\_active\\_pc",
    })
    .addAssignment("InactiveATPs", {
      fn: new Add([new Num(1.0), new Minus([new Name("ActiveATPs")])]),
      texName: "InactiveATPs",
    })
    .addReaction("V_to_A", {
      fn: new Mul([
        new Name("VDErateVioToAnth"),
        new Name("Violaxanthin"),
        new Name("active_vde"),
      ]),
      stoichiometry: [{ name: "Antheraxanthin", value: new Num(1.0) }],
      texName: "V\\_to\\_A",
    })
    .addReaction("A_to_Z", {
      fn: new Mul([
        new Name("Antheraxanthin"),
        new Name("VDErateAnthToZea"),
        new Name("active_vde"),
      ]),
      stoichiometry: [
        { name: "Antheraxanthin", value: new Num(-1.0) },
        { name: "Zeaxanthin", value: new Num(1.0) },
      ],
      texName: "A\\_to\\_Z",
    })
    .addReaction("Z_to_A", {
      fn: new Mul([new Name("ZErate"), new Name("Zeaxanthin")]),
      stoichiometry: [
        { name: "Zeaxanthin", value: new Num(-1.0) },
        { name: "Antheraxanthin", value: new Num(1.0) },
      ],
      texName: "Z\\_to\\_A",
    })
    .addReaction("A_to_V", {
      fn: new Mul([new Name("Antheraxanthin"), new Name("ZErate")]),
      stoichiometry: [{ name: "Antheraxanthin", value: new Num(-1.0) }],
      texName: "A\\_to\\_V",
    })
    .addReaction("PsbS_prot", {
      fn: new Mul([
        new Name("PsbSConvertRate"),
        new Name("PsbS_unprot"),
        new Name("active_psbs"),
      ]),
      stoichiometry: [{ name: "PsbSQ", value: new Num(1.0) }],
      texName: "PsbS\\_prot",
    })
    .addReaction("PsbS_deprot", {
      fn: new Mul([
        new Name("PsbSConvertRate"),
        new Name("PsbSQ"),
        new Name("deact_psbs"),
      ]),
      stoichiometry: [{ name: "PsbSQ", value: new Num(-1.0) }],
      texName: "PsbS\\_deprot",
    })
    .addReaction("v1", {
      fn: new Mul([
        new Name("LightIntensity"),
        new Name("crosssection"),
        new Name("fracIntactRC"),
      ]),
      stoichiometry: [{ name: "PSIIChlEx", value: new Num(1.0) }],
      texName: "v1",
    })
    .addReaction("v2", {
      fn: new Mul([new Name("PSIIChlEx"), new Name("kQ"), new Name("q_total")]),
      stoichiometry: [{ name: "PSIIChlEx", value: new Num(-1.0) }],
      texName: "v2",
    })
    .addReaction("v3", {
      fn: new Mul([new Name("PSIIChlEx"), new Name("kF")]),
      stoichiometry: [{ name: "PSIIChlEx", value: new Num(-1.0) }],
      texName: "v3",
    })
    .addReaction("v4", {
      fn: new Mul([
        new Name("P680plus"),
        new Name("PSIIChlEx"),
        new Name("kquenchP680plus"),
      ]),
      stoichiometry: [{ name: "PSIIChlEx", value: new Num(-1.0) }],
      texName: "v4",
    })
    .addReaction("v5", {
      fn: new Mul([new Name("PSIIChlEx"), new Name("kNRantenna")]),
      stoichiometry: [{ name: "PSIIChlEx", value: new Num(-1.0) }],
      texName: "v5",
    })
    .addReaction("v7", {
      fn: new Mul([
        new Name("P680neut"),
        new Add([
          new Mul([
            new Name("PSIIChlEx"),
            new Name("QAox"),
            new Name("kEETLHP680QAox"),
          ]),
          new Mul([
            new Name("PSIIChlEx"),
            new Name("QAred"),
            new Name("kEETLHP680QAred"),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "PSIIChlEx", value: new Num(-1.0) },
        { name: "P680ex", value: new Num(1.0) },
      ],
      texName: "v7",
    })
    .addReaction("v8", {
      fn: new Add([
        new Mul([
          new Name("P680ex"),
          new Name("QAox"),
          new Name("kEETLHP680revQAox"),
        ]),
        new Mul([
          new Name("P680ex"),
          new Name("QAred"),
          new Name("kEETLHP680revQAred"),
        ]),
      ]),
      stoichiometry: [
        { name: "PSIIChlEx", value: new Num(1.0) },
        { name: "P680ex", value: new Num(-1.0) },
      ],
      texName: "v8",
    })
    .addReaction("v9", {
      fn: new Mul([new Name("P680ex"), new Name("kNRP680")]),
      stoichiometry: [{ name: "P680ex", value: new Num(-1.0) }],
      texName: "v9",
    })
    .addReaction("v12", {
      fn: new Mul([
        new Name("P680ex"),
        new Name("Pheneut"),
        new Name("QAox"),
        new Name("efield_slowdown_r"),
        new Name("kETP680PheOpenRC"),
      ]),
      stoichiometry: [
        { name: "P680ex", value: new Num(-1.0) },
        { name: "P680plus", value: new Num(1.0) },
        { name: "PheAnion", value: new Num(1.0) },
      ],
      texName: "v12",
    })
    .addReaction("v13", {
      fn: new Mul([
        new Name("P680ex"),
        new Name("Pheneut"),
        new Name("QAred"),
        new Name("efield_slowdown_r"),
        new Name("kETP680PheClosedRC"),
      ]),
      stoichiometry: [
        { name: "P680ex", value: new Num(-1.0) },
        { name: "P680plus", value: new Num(1.0) },
        { name: "PheAnion", value: new Num(1.0) },
      ],
      texName: "v13",
    })
    .addReaction("v14", {
      fn: new Mul([
        new Name("PheAnion"),
        new Name("QAox"),
        new Name("efield_slowdown_r"),
        new Name("kETPheToQA"),
      ]),
      stoichiometry: [
        { name: "PheAnion", value: new Num(-1.0) },
        { name: "QAox", value: new Num(-1.0) },
      ],
      texName: "v14",
    })
    .addReaction("v15", {
      fn: new Mul([
        new Name("P680plus"),
        new Name("efield_slowdown_q"),
        new Name("kETWaterOxidation"),
      ]),
      stoichiometry: [
        { name: "P680plus", value: new Num(-1.0) },
        {
          name: "LumenProtons",
          value: new Divide([
            new Num(1.0),
            new Mul([new Name("LumenVolume"), new Name("Na")]),
          ]),
        },
      ],
      texName: "v15",
    })
    .addReaction("v16", {
      fn: new Divide([
        new Mul([
          new Name("P680plus"),
          new Name("PheAnion"),
          new Name("kP680Pherecombination"),
        ]),
        new Name("efield_slowdown_r"),
      ]),
      stoichiometry: [
        { name: "P680plus", value: new Num(-1.0) },
        { name: "PheAnion", value: new Num(-1.0) },
      ],
      texName: "v16",
    })
    .addReaction("v17", {
      fn: new Divide([
        new Mul([
          new Name("P680plus"),
          new Name("Pheneut"),
          new Name("QAred"),
          new Name("kP680QArecombination"),
        ]),
        new Name("efield_slowdown_r"),
      ]),
      stoichiometry: [
        { name: "P680plus", value: new Num(-1.0) },
        { name: "QAox", value: new Num(1.0) },
      ],
      texName: "v17",
    })
    .addReaction("v18", {
      fn: new Divide([
        new Mul([
          new Name("P680plus"),
          new Name("PheAnion"),
          new Name("QAred"),
          new Name("kP680QArecombinationClosedRC"),
        ]),
        new Name("efield_slowdown_r"),
      ]),
      stoichiometry: [
        { name: "P680plus", value: new Num(-1.0) },
        { name: "QAox", value: new Num(1.0) },
      ],
      texName: "v18",
    })
    .addReaction("r_q2", {
      fn: new Mul([
        new Name("QAred"),
        new Name("QBneut"),
        new Name("efield_slowdown_q"),
        new Name("kETQAtoQB1"),
      ]),
      stoichiometry: [
        { name: "QAox", value: new Num(1.0) },
        { name: "QBneut", value: new Num(-1.0) },
        { name: "QBred1", value: new Num(1.0) },
      ],
      texName: "r\\_q2",
    })
    .addReaction("r_q3", {
      fn: new Mul([
        new Name("QAred"),
        new Name("QBred1"),
        new Name("efield_slowdown_q"),
        new Name("kETQAtoQB2"),
      ]),
      stoichiometry: [
        { name: "QAox", value: new Num(1.0) },
        { name: "QBred1", value: new Num(-1.0) },
        { name: "QBred2", value: new Num(1.0) },
      ],
      texName: "r\\_q3",
    })
    .addReaction("r_q4", {
      fn: new Mul([
        new Name("QAox"),
        new Name("QBred1"),
        new Name("kETQB1toQA"),
      ]),
      stoichiometry: [
        { name: "QAox", value: new Num(-1.0) },
        { name: "QBred1", value: new Num(-1.0) },
        { name: "QBneut", value: new Num(1.0) },
      ],
      texName: "r\\_q4",
    })
    .addReaction("r_q5", {
      fn: new Mul([
        new Name("QAox"),
        new Name("QBred2"),
        new Name("kETQB2toQA"),
      ]),
      stoichiometry: [
        { name: "QAox", value: new Num(-1.0) },
        { name: "QBred1", value: new Num(1.0) },
        { name: "QBred2", value: new Num(-1.0) },
      ],
      texName: "r\\_q5",
    })
    .addReaction("r_q6", {
      fn: new Mul([
        new Name("PQdockingrate"),
        new Name("PQfrac"),
        new Name("QBempty"),
      ]),
      stoichiometry: [
        { name: "PQ", value: new Num(-1.0) },
        { name: "QBneut", value: new Num(1.0) },
      ],
      texName: "r\\_q6",
    })
    .addReaction("r_q7", {
      fn: new Mul([new Name("PQH2undock"), new Name("QBred2")]),
      stoichiometry: [
        { name: "QBred2", value: new Num(-1.0) },
        { name: "PQH2", value: new Num(1.0) },
      ],
      texName: "r\\_q7",
    })
    .addReaction("r_q8", {
      fn: new Mul([new Num(0.1), new Name("PQH2frac"), new Name("PQH2undock")]),
      stoichiometry: [
        { name: "PQH2", value: new Num(-1.0) },
        { name: "QBred2", value: new Num(1.0) },
      ],
      texName: "r\\_q8",
    })
    .addReaction("r_cyt_b6f", {
      fn: new Mul([
        new Name("QReoxidationRate"),
        new Name("frac_active_cyt"),
        new Name("frac_active_pc"),
        new Name("frac_pq_red"),
      ]),
      stoichiometry: [
        { name: "PQH2", value: new Num(-1.0) },
        { name: "PQ", value: new Num(1.0) },
        {
          name: "PCr",
          value: new Divide([new Num(2.0), new Name("ElectronsPerPC")]),
        },
        {
          name: "LumenProtons",
          value: new Divide([
            new Num(4.0),
            new Mul([new Name("LumenVolume"), new Name("Na")]),
          ]),
        },
      ],
      texName: "r\\_cyt\\_b6f",
    })
    .addReaction("psi_1", {
      fn: new Max([
        new Num(0.0),
        new Mul([new Name("P700ox"), new Name("PCr"), new Name("kETPCP700")]),
      ]),
      stoichiometry: [
        { name: "PCr", value: new Num(-1.0) },
        { name: "P700ox", value: new Num(-1.0) },
        { name: "P700r", value: new Num(1.0) },
      ],
      texName: "psi\\_1",
    })
    .addReaction("psi_2", {
      fn: new Max([
        new Num(0.0),
        new Mul([
          new Name("Fdxox"),
          new Name("LightIntensity"),
          new Name("P700r"),
          new Name("PSIcrossSection"),
          new Name("kETP700Fdx"),
        ]),
      ]),
      stoichiometry: [
        { name: "P700r", value: new Num(-1.0) },
        { name: "P700ox", value: new Num(1.0) },
        { name: "Fdxr", value: new Num(1.0) },
        { name: "Fdxox", value: new Num(-1.0) },
        { name: "TotalLEF", value: new Num(1.0) },
      ],
      texName: "psi\\_2",
    })
    .addReaction("atp_synthesis", {
      fn: new Piecewise([
        new Num(0.0),
        new LessEqual([
          new Add([new Name("pmf"), new Minus([new Name("thresholdpmf")])]),
          new Num(0.0),
        ]),
        new Mul([
          new Name("ATPConductivity"),
          new Name("ActiveATPs"),
          new Add([new Name("pmf"), new Minus([new Name("thresholdpmf")])]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "ATP",
          value: new Divide([
            new Mul([
              new Name("ATPperProton"),
              new Name("LumenVolume"),
              new Name("Na"),
            ]),
            new Name("lumenVolumePerArea"),
          ]),
        },
        {
          name: "LumenProtons",
          value: new Minus([
            new Divide([new Num(1.0), new Name("lumenVolumePerArea")]),
          ]),
        },
      ],
      texName: "atp\\_synthesis",
    })
    .addReaction("vleak", {
      fn: new Piecewise([
        new Num(0.0),
        new GreaterEqual([
          new Add([new Name("leakpmf"), new Minus([new Name("pmf")])]),
          new Num(0.0),
        ]),
        new Mul([
          new Name("leakConductivity"),
          new Add([new Name("pmf"), new Minus([new Name("leakpmf")])]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "LumenProtons",
          value: new Minus([
            new Divide([new Num(1.0), new Name("lumenVolumePerArea")]),
          ]),
        },
      ],
      displayName: "proton leak",
      texName: "vleak",
    })
    .addReaction("atps_activate", {
      fn: new Mul([
        new Name("Fdxr"),
        new Name("InactiveATPs"),
        new Name("kATPsActivate"),
      ]),
      stoichiometry: [{ name: "ActiveATPs", value: new Num(1.0) }],
      texName: "atps\\_activate",
    })
    .addReaction("atps_inactivate", {
      fn: new Mul([new Name("ActiveATPs"), new Name("kATPsInactivate")]),
      stoichiometry: [{ name: "ActiveATPs", value: new Num(-1.0) }],
      texName: "atps\\_inactivate",
    })
    .addReaction("flux_Mg", {
      fn: new Minus([
        new Divide([
          new Mul([
            new Num(0.001),
            new Name("PMg"),
            new Name("deltamuMg"),
            new Piecewise([
              new Name("LumenMg"),
              new GreaterThan([new Name("deltamuMg"), new Num(0.0)]),
              new Name("StromaMgStart"),
            ]),
          ]),
          new Mul([new Name("lumenVolumePerArea"), new Name("voltsperlog")]),
        ]),
      ]),
      stoichiometry: [{ name: "LumenMg", value: new Num(1.0) }],
      texName: "flux\\_Mg",
    })
    .addReaction("flux_Cl", {
      fn: new Minus([
        new Divide([
          new Mul([
            new Num(0.001),
            new Name("PCl"),
            new Name("deltamuCl"),
            new Piecewise([
              new Name("LumenCl"),
              new GreaterThan([new Name("deltamuCl"), new Num(0.0)]),
              new Name("StromaClStart"),
            ]),
          ]),
          new Mul([new Name("lumenVolumePerArea"), new Name("voltsperlog")]),
        ]),
      ]),
      stoichiometry: [{ name: "LumenCl", value: new Num(1.0) }],
      texName: "flux\\_Cl",
    })
    .addReaction("flux_K", {
      fn: new Minus([
        new Divide([
          new Mul([
            new Num(0.001),
            new Name("PCl"),
            new Name("deltamuK"),
            new Piecewise([
              new Name("LumenK"),
              new GreaterThan([new Name("deltamuK"), new Num(0.0)]),
              new Name("StromaKStart"),
            ]),
          ]),
          new Mul([new Name("lumenVolumePerArea"), new Name("voltsperlog")]),
        ]),
      ]),
      stoichiometry: [{ name: "LumenK", value: new Num(1.0) }],
      texName: "flux\\_K",
    })
    .addReaction("mv_1", {
      fn: new Mul([new Name("Fdxr"), new Name("kETFdxMV")]),
      stoichiometry: [{ name: "Fdxr", value: new Num(-1.0) }],
      texName: "mv\\_1",
    })
    .addReaction("mv_2", {
      fn: new Mul([new Name("Fdxr"), new Name("kETFdxThrdx")]),
      stoichiometry: [
        { name: "Fdxox", value: new Num(1.0) },
        { name: "Thrdx", value: new Num(1.0) },
      ],
      texName: "mv\\_2",
    })
    .addReaction("mv_3", {
      fn: new Mul([new Name("Thrdx"), new Name("kETThrdxOx")]),
      stoichiometry: [{ name: "Thrdx", value: new Num(-1.0) }],
      texName: "mv\\_3",
    })
    .addReadout("light", {
      fn: new Name("LightIntensity"),
      texName: "light",
    })
    .addReadout("kF_obs", {
      fn: new Mul([new Name("PSIIChlEx"), new Name("kF")]),
      texName: "kF\\_obs",
    })
    .addReadout("kqE_obs", {
      fn: new Mul([new Name("PSIIChlEx"), new Name("kQ"), new Name("q_total")]),
      texName: "kqE\\_obs",
    })
    .addReadout("kPC_obs", {
      fn: new Mul([
        new Name("P680neut"),
        new Add([
          new Mul([
            new Name("PSIIChlEx"),
            new Name("QAox"),
            new Name("kEETLHP680QAox"),
          ]),
          new Mul([
            new Name("PSIIChlEx"),
            new Name("QAred"),
            new Name("kEETLHP680QAred"),
          ]),
        ]),
      ]),
      texName: "kPC\\_obs",
    })
    .addReadout("kPCRCC_obs", {
      fn: new Mul([
        new Num(1.0),
        new Name("P680neut"),
        new Name("PSIIChlEx"),
        new Name("kEETLHP680QAox"),
      ]),
      texName: "kPCRCC\\_obs",
    })
    .addReadout("kC_obs", {
      fn: new Add([
        new Name("kF_obs"),
        new Mul([new Name("PSIIChlEx"), new Name("kNRantenna")]),
        new Mul([
          new Name("P680plus"),
          new Name("PSIIChlEx"),
          new Name("kquenchP680plus"),
        ]),
      ]),
      texName: "kC\\_obs",
    })
    .addReadout("allrates", {
      fn: new Add([
        new Name("kC_obs"),
        new Name("kPC_obs"),
        new Name("kqE_obs"),
      ]),
      texName: "allrates",
    })
    .addReadout("allratesRCC", {
      fn: new Add([
        new Name("kC_obs"),
        new Name("kPCRCC_obs"),
        new Name("kqE_obs"),
      ]),
      texName: "allratesRCC",
    })
    .addReadout("fluorescenceyield", {
      fn: new Divide([new Name("kF_obs"), new Name("allrates")]),
      texName: "fluorescenceyield",
    })
    .addReadout("fluorescenceyieldRCC", {
      fn: new Divide([new Name("kF_obs"), new Name("allratesRCC")]),
      texName: "fluorescenceyieldRCC",
    })
    .addReadout("qE_model", {
      fn: new Divide([new Name("kqE_obs"), new Name("kC_obs")]),
      texName: "qE\\_model",
    })
    .addReadout("phi_npq", {
      fn: new Divide([new Name("kqE_obs"), new Name("allrates")]),
      texName: "phi\\_npq",
    });
}
