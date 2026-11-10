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
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
  Pow,
  Simpson,
} from "@computational-biology-aachen/mxlweb-core/mathml";
import data from "./model.data.json";

/**
 * Pfennig 2024 cyanobacteria model.
 *
 * |             |                                                                                                                                        |
 * | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
 * | doi         | 10.1371/journal.pcbi.1012445                                                                                                           |
 * | main author | Tobias Pfennig                                                                                                                         |
 * | paper title | Shedding light on blue-green photosynthesis: A wavelength-dependent mathematical model of photosynthesis in Synechocystis sp. PCC 6803 |
 * | published   | September 2024                                                                                                                         |
 * | journal     | PLOS Computational Biology                                                                                                             |
 * | organism    | Synechocystis sp. PCC 6803                                                                                                             |
 * | Ported by   | Marvin van Aalst ( @marvinvanaalst )                                                                                                   |
 *
 * ## Terms
 *
 * cbb: Calvin-Benson-Bassham cycle ocp: orange carotenoid protein pbs:
 * phycobilisome psi: photosystem I psii: photosystem II lcf: light conversion
 * factor pq: plastoquinone pc: plastocyanine fd: ferredoxin Ho: cytoplasmic
 * protons Hi: lumenal protons CCM: carbon-concentrating mechanism FNR:
 * Ferredoxin-NADP+ Reductase 2PG: 2-phosphoglycolate 3PGA: 3-phosphoglycerate
 * ADP: Adenosine diphosphate ATP: Adenosine triphosphate ATPsynth: ATP synthase
 * COX: Cytochrome c oxidase Cyd: Cytochrome bd quinol oxidase Cyt b6f: Cytochrome
 * b6f complex Flv 1/3: Flavodiiron protein dimer 1/3 NADP+: Nicotinamide adenine
 * dinucleotide phosphate NADPH: reduced Nicotinamide adenine dinucleotide
 * phosphate NAD+: Nicotinamide adenine dinucleotide NADH: reduced Nicotinamide
 * adenine dinucleotide NDH-1: NAD(P)H Dehydrogenase-like complex 1 NDH-2: NAD(P)H
 * Dehydrogenase complex 2 Oxy: RuBisCO oxygenation PR: Photorespiration SDH:
 * Succinate dehydrogenase
 */
export function initModel(): KineticModelBuilder {
  return new KineticModelBuilder()
    .addData("wavelength", data["wavelength"])
    .addData("light_spectrum", {
      values: data["light_spectrum"].values,
      texName: "light\\_spectrum",
    })
    .addData("light_spectrum_measure", {
      values: data["light_spectrum_measure"].values,
      texName: "light\\_spectrum\\_measure",
    })
    .addData("ocp_absorption", {
      values: data["ocp_absorption"].values,
      texName: "ocp\\_absorption",
    })
    .addData("abs_coef_chla", {
      values: data["abs_coef_chla"].values,
      texName: "abs\\_coef\\_chla",
    })
    .addData("abs_coef_beta_carotene", {
      values: data["abs_coef_beta_carotene"].values,
      texName: "abs\\_coef\\_beta\\_carotene",
    })
    .addData("abs_coef_allophycocyanin", {
      values: data["abs_coef_allophycocyanin"].values,
      texName: "abs\\_coef\\_allophycocyanin",
    })
    .addData("abs_coef_phycocyanin", {
      values: data["abs_coef_phycocyanin"].values,
      texName: "abs\\_coef\\_phycocyanin",
    })
    .addParameter("PSIItot", {
      value: 0.83,
      texName: "PSIItot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PSItot", {
      value: 3.27,
      texName: "PSItot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PQ_tot", {
      value: 13.0,
      texName: "PQ\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("PC_tot", {
      value: 1.571,
      texName: "PC\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("Fd_tot", {
      value: 3.597,
      texName: "Fd\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("NADP_tot", {
      value: 26.805,
      texName: "NADP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("NAD_tot", {
      value: 11.169,
      texName: "NAD\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("AP_tot", {
      value: 430.143,
      texName: "AP\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("O2ext", {
      value: 55.402,
      texName: "O2ext",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("CO2ext", {
      value: 3.103,
      texName: "CO2ext",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("F", {
      value: 96.485,
      texName: "F",
      unit: Unit.fromJson({
        factors: [
          { kind: "coulomb", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
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
      value: 298.15,
      texName: "T",
      unit: Unit.fromJson({ factors: [{ kind: "kelvin", exponent: 1 }] }),
    })
    .addParameter("bHi", {
      value: 100.0,
      texName: "bHi",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("bHo", {
      value: 1111.0,
      texName: "bHo",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("cf_lumen", {
      value: 4.613e-5,
      texName: "cf\\_lumen",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", prefix: "kilo", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("cf_cytoplasm", {
      value: 4.562e-6,
      texName: "cf\\_cytoplasm",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", prefix: "kilo", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("E0_QA", {
      value: -0.14,
      texName: "E0\\_QA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_PQ", {
      value: 0.533,
      texName: "E0\\_PQ",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_PC", {
      value: 0.35,
      texName: "E0\\_PC",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_P700", {
      value: 0.41,
      texName: "E0\\_P700",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_FA", {
      value: -0.58,
      texName: "E0\\_FA",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_Fd", {
      value: -0.41,
      texName: "E0\\_Fd",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_NADP", {
      value: -0.113,
      texName: "E0\\_NADP",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("E0_succinate_per_fumarate", {
      value: 0.443,
      displayName: "E0_succinate/fumarate",
      texName: "E0\\_succinate/fumarate",
      unit: Unit.fromJson({ factors: [{ kind: "volt", exponent: 1 }] }),
    })
    .addParameter("kH0", {
      value: 500000000.0,
      texName: "kH0",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kHst", {
      value: 1000000000.0,
      texName: "kHst",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kF", {
      value: 625000000.0,
      texName: "kF",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k2", {
      value: 2500000000.0,
      texName: "k2",
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
    .addParameter("kFlvactivation", {
      value: 0.5,
      texName: "kFlvactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kFlvdeactivation", {
      value: 0.1,
      texName: "kFlvdeactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kCBBdeactivation", {
      value: 0.0025,
      texName: "kCBBdeactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
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
    .addParameter("k_ox1", {
      value: 0.211,
      texName: "k\\_ox1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_NDH", {
      value: 3.136,
      texName: "k\\_NDH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_SDH", {
      value: 0.43,
      texName: "k\\_SDH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_FN_fwd", {
      value: 3.73,
      texName: "k\\_FN\\_fwd",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_FN_rev", {
      value: 53.364,
      texName: "k\\_FN\\_rev",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 3 },
          { kind: "mole", prefix: "milli", exponent: -3 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_NQ", {
      value: 100.0,
      texName: "k\\_NQ",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kRespiration", {
      value: 3.506e-6,
      texName: "kRespiration",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 3 },
          { kind: "mole", prefix: "milli", exponent: -3 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kO2out", {
      value: 4025.0,
      texName: "kO2out",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kCCM", {
      value: 4025.0,
      texName: "kCCM",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("PBS_free", {
      value: 0.09,
      texName: "PBS\\_free",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PBS_PS1", {
      value: 0.39,
      texName: "PBS\\_PS1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PBS_PS2", {
      value: 0.51,
      texName: "PBS\\_PS2",
      unit: Unit.fromJson({ factors: [] }),
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
      value: 4.667,
      texName: "HPR",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("vOxy_max", {
      value: 16.059,
      texName: "vOxy\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "second", exponent: -1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMATP", {
      value: 24.088,
      texName: "KMATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMNADPH", {
      value: 18.066,
      texName: "KMNADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMCO2", {
      value: 72.264,
      texName: "KMCO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KIO2", {
      value: 240.88,
      texName: "KIO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMO2", {
      value: 240.88,
      texName: "KMO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KICO2", {
      value: 72.264,
      texName: "KICO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("vCBB_max", {
      value: 51.301,
      texName: "vCBB\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "second", exponent: -1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kPR", {
      value: 1.523e-6,
      texName: "kPR",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 3 },
          { kind: "mole", prefix: "milli", exponent: -3 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("cChl", {
      value: 0.004151,
      texName: "cChl",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", exponent: 1 },
          { kind: "litre", exponent: -1 },
        ],
      }),
    })
    .addParameter("CO2ext_pp", {
      value: 0.05,
      texName: "CO2ext\\_pp",
      unit: Unit.fromJson({ factors: [{ kind: "pascal", exponent: 1 }] }),
    })
    .addParameter("S", {
      value: 35.0,
      texName: "S",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_O2", {
      value: 12.926,
      texName: "k\\_O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("KHillFdred_CBB", {
      value: 0.0001,
      texName: "KHillFdred\\_CBB",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nHillFdred_CBB", {
      value: 4.0,
      texName: "nHillFdred\\_CBB",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("fCin", {
      value: 1032.3825198828176,
      texName: "fCin",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("k_F1", {
      value: 1.0144691550897802,
      texName: "k\\_F1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("k_Q", {
      value: 1789.6877149900638,
      texName: "k\\_Q",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_pass", {
      value: 0.0103757688087645,
      texName: "k\\_pass",
      unit: Unit.fromJson({
        factors: [
          { kind: "litre", prefix: "milli", exponent: 1 },
          { kind: "second", exponent: -1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("k_aa", {
      value: 1.0726342220286855,
      texName: "k\\_aa",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 2 },
          { kind: "mole", prefix: "milli", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("fluo_influence_ps2", {
      value: 1.0871604554468057,
      texName: "fluo\\_influence\\_ps2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("fluo_influence_ps1", {
      value: 1.0580747331180056,
      texName: "fluo\\_influence\\_ps1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("fluo_influence_pbs", {
      value: 1.2652931291892002,
      texName: "fluo\\_influence\\_pbs",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("PPFD", {
      value: 100.0,
      displayName: "PPFD",
      texName: "PPFD",
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
        step: "10",
      },
    })
    .addParameter("PPFD_measure", {
      value: 1.0,
      texName: "PPFD\\_measure",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("lcf", {
      value: 0.4852970468572075,
      texName: "lcf",
      unit: Unit.fromJson({
        factors: [
          { kind: "metre", exponent: 2 },
          { kind: "mole", prefix: "micro", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMPGA", {
      value: 0.108119035344566,
      texName: "KMPGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kATPsynth", {
      value: 10.508685365751944,
      texName: "kATPsynth",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kATPconsumption", {
      value: 0.3007216562727887,
      texName: "kATPconsumption",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("kNADHconsumption", {
      value: 10.774127129643528,
      texName: "kNADHconsumption",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("kUnquench", {
      value: 0.1084895168082126,
      texName: "kUnquench",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("KMUnquench", {
      value: 0.2057753667172297,
      texName: "KMUnquench",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kQuench", {
      value: 0.0021298894016293,
      texName: "kQuench",
      unit: Unit.fromJson({
        factors: [
          { kind: "mol_chl", exponent: 1 },
          { kind: "mole", prefix: "milli", exponent: -1 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addParameter("KHillFdred", {
      value: 39.138885950985646,
      texName: "KHillFdred",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("nHillFdred", {
      value: 3.803733201004677,
      texName: "nHillFdred",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kCBBactivation", {
      value: 0.0368469911771887,
      texName: "kCBBactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("KMFdred", {
      value: 0.2867372651572032,
      texName: "KMFdred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("kOCPactivation", {
      value: 9.119349718302952e-5,
      texName: "kOCPactivation",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("kOCPdeactivation", {
      value: 0.0013779872861697,
      texName: "kOCPdeactivation",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addParameter("OCPmax", {
      value: 0.2894610142573665,
      texName: "OCPmax",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("vNQ_max", {
      value: 47.52413111835536,
      texName: "vNQ\\_max",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "second", exponent: -1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMNQ_Qox", {
      value: 1.225188500783819,
      texName: "KMNQ\\_Qox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("KMNQ_Fdred", {
      value: 1.3324893590389415,
      texName: "KMNQ\\_Fdred",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addParameter("chla_content", {
      value: 1.0,
      texName: "chla\\_content",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("beta_carotene_content", {
      value: 0.176,
      texName: "beta\\_carotene\\_content",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("allophycocyanin_content", {
      value: 1.118,
      texName: "allophycocyanin\\_content",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("phycocyanin_content", {
      value: 6.765,
      texName: "phycocyanin\\_content",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("M_chla", {
      value: 893.509,
      texName: "M\\_chla",
      unit: Unit.fromJson({
        factors: [
          { kind: "gram", exponent: 1 },
          { kind: "mole", exponent: -1 },
        ],
      }),
    })
    .addParameter("M_beta_carotene", {
      value: 536.888,
      texName: "M\\_beta\\_carotene",
      unit: Unit.fromJson({
        factors: [
          { kind: "gram", exponent: 1 },
          { kind: "mole", exponent: -1 },
        ],
      }),
    })
    .addParameter("n_chla_PS1", {
      value: 96.0,
      texName: "n\\_chla\\_PS1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_chla_PS2", {
      value: 35.0,
      texName: "n\\_chla\\_PS2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_beta_carotene_PS1", {
      value: 22.0,
      texName: "n\\_beta\\_carotene\\_PS1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addParameter("n_beta_carotene_PS2", {
      value: 11.0,
      texName: "n\\_beta\\_carotene\\_PS2",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("PSII", {
      value: 0.415,
      texName: "PSII",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("O2", {
      value: 55.402,
      texName: "O2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PC_ox", {
      value: 0.157,
      texName: "PC\\_ox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Fd_ox", {
      value: 3.237,
      texName: "Fd\\_ox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("NADPH", {
      value: 20.104,
      texName: "NADPH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("NADH", {
      value: 3.574,
      texName: "NADH",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("ATP", {
      value: 172.057,
      texName: "ATP",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PG", {
      value: 0.894,
      texName: "PG",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("succinate", {
      value: 2.0,
      texName: "succinate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("fumarate", {
      value: 2.0,
      texName: "fumarate",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("_3PGA", {
      value: 2000.0,
      displayName: "3PGA",
      texName: "3PGA",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("CBBa", {
      value: 0.0,
      texName: "CBBa",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addVariable("Hi", {
      value: 0.217,
      texName: "Hi",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("Ho", {
      value: 0.006932,
      texName: "Ho",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("PQ_ox", {
      value: 7.202,
      texName: "PQ\\_ox",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("CO2", {
      value: 3.103,
      texName: "CO2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addVariable("OCP", {
      value: 0.0,
      texName: "OCP",
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
    .addAssignment("ps_ratio", {
      fn: new Divide([
        new Mul([new Num(1.5), new Name("PSItot")]),
        new Name("PSIItot"),
      ]),
      texName: "ps\\_ratio",
    })
    .addAssignment("Hi_mol", {
      fn: new Mul([new Name("Hi"), new Name("cf_lumen")]),
      texName: "Hi\\_mol",
    })
    .addAssignment("Ho_mol", {
      fn: new Mul([new Name("Ho"), new Name("cf_cytoplasm")]),
      texName: "Ho\\_mol",
    })
    .addAssignment("pHlumen", {
      fn: new Minus([
        new Mul([new Num(0.43429448190325176), new Ln(new Name("Hi_mol"))]),
      ]),
      texName: "pHlumen",
    })
    .addAssignment("pHcytoplasm", {
      fn: new Minus([
        new Mul([new Num(0.43429448190325176), new Ln(new Name("Ho_mol"))]),
      ]),
      texName: "pHcytoplasm",
    })
    .addAssignment("dpH", {
      fn: new Add([new Name("pHcytoplasm"), new Minus([new Name("pHlumen")])]),
      texName: "dpH",
    })
    .addAssignment("light_OCP", {
      fn: new Mul([
        new Name("PPFD"),
        new Simpson([
          new Mul([new Name("light_spectrum"), new Name("ocp_absorption")]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "light\\_OCP",
    })
    .addAssignment("chla_fraction_PS1", {
      fn: new Divide([
        new Mul([new Name("n_chla_PS1"), new Name("ps_ratio")]),
        new Add([
          new Name("n_chla_PS2"),
          new Mul([new Name("n_chla_PS1"), new Name("ps_ratio")]),
        ]),
      ]),
      texName: "chla\\_fraction\\_PS1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("beta_carotene_fraction_PS1", {
      fn: new Divide([
        new Mul([
          new Name("n_beta_carotene_PS1"),
          new Name("ps_ratio"),
          new Min([
            new Num(1.0),
            new Divide([
              new Mul([
                new Name("M_beta_carotene"),
                new Add([
                  new Divide([
                    new Name("n_beta_carotene_PS2"),
                    new Name("n_chla_PS2"),
                  ]),
                  new Divide([
                    new Mul([
                      new Name("n_beta_carotene_PS1"),
                      new Name("ps_ratio"),
                    ]),
                    new Name("n_chla_PS1"),
                  ]),
                ]),
              ]),
              new Mul([
                new Name("M_chla"),
                new Name("beta_carotene_content"),
                new Add([new Num(1.0), new Name("ps_ratio")]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Name("n_beta_carotene_PS2"),
          new Mul([new Name("n_beta_carotene_PS1"), new Name("ps_ratio")]),
        ]),
      ]),
      texName: "beta\\_carotene\\_fraction\\_PS1",
      unit: Unit.fromJson({ factors: [] }),
    })
    .addAssignment("absorption_chla", {
      fn: new Mul([
        new Name("PPFD"),
        new Name("chla_content"),
        new Simpson([
          new Mul([new Name("abs_coef_chla"), new Name("light_spectrum")]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "absorption\\_chla",
    })
    .addAssignment("absorption_beta_carotene", {
      fn: new Mul([
        new Name("PPFD"),
        new Name("beta_carotene_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_beta_carotene"),
            new Name("light_spectrum"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "absorption\\_beta\\_carotene",
    })
    .addAssignment("absorption_allophycocyanin", {
      fn: new Mul([
        new Name("PPFD"),
        new Name("allophycocyanin_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_allophycocyanin"),
            new Name("light_spectrum"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "absorption\\_allophycocyanin",
    })
    .addAssignment("absorption_phycocyanin", {
      fn: new Mul([
        new Name("PPFD"),
        new Name("phycocyanin_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_phycocyanin"),
            new Name("light_spectrum"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "absorption\\_phycocyanin",
    })
    .addAssignment("absorption_ps1", {
      fn: new Mul([
        new Name("M_chla"),
        new Add([
          new Mul([
            new Name("absorption_beta_carotene"),
            new Name("beta_carotene_fraction_PS1"),
          ]),
          new Mul([new Name("absorption_chla"), new Name("chla_fraction_PS1")]),
        ]),
      ]),
      texName: "absorption\\_ps1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("absorption_ps2", {
      fn: new Mul([
        new Name("M_chla"),
        new Name("absorption_chla"),
        new Add([new Num(1.0), new Minus([new Name("chla_fraction_PS1")])]),
      ]),
      texName: "absorption\\_ps2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("absorption_pbs", {
      fn: new Mul([
        new Name("M_chla"),
        new Add([
          new Name("absorption_allophycocyanin"),
          new Name("absorption_phycocyanin"),
        ]),
      ]),
      texName: "absorption\\_pbs",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ml_absorption_chla", {
      fn: new Mul([
        new Name("PPFD_measure"),
        new Name("chla_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_chla"),
            new Name("light_spectrum_measure"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "ml\\_absorption\\_chla",
    })
    .addAssignment("ml_absorption_beta_carotene", {
      fn: new Mul([
        new Name("PPFD_measure"),
        new Name("beta_carotene_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_beta_carotene"),
            new Name("light_spectrum_measure"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "ml\\_absorption\\_beta\\_carotene",
    })
    .addAssignment("ml_absorption_allophycocyanin", {
      fn: new Mul([
        new Name("PPFD_measure"),
        new Name("allophycocyanin_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_allophycocyanin"),
            new Name("light_spectrum_measure"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "ml\\_absorption\\_allophycocyanin",
    })
    .addAssignment("ml_absorption_phycocyanin", {
      fn: new Mul([
        new Name("PPFD_measure"),
        new Name("phycocyanin_content"),
        new Simpson([
          new Mul([
            new Name("abs_coef_phycocyanin"),
            new Name("light_spectrum_measure"),
          ]),
          new Name("wavelength"),
        ]),
      ]),
      texName: "ml\\_absorption\\_phycocyanin",
    })
    .addAssignment("ml_absorption_ps1", {
      fn: new Mul([
        new Name("M_chla"),
        new Add([
          new Mul([
            new Name("beta_carotene_fraction_PS1"),
            new Name("ml_absorption_beta_carotene"),
          ]),
          new Mul([
            new Name("chla_fraction_PS1"),
            new Name("ml_absorption_chla"),
          ]),
        ]),
      ]),
      texName: "ml\\_absorption\\_ps1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ml_absorption_ps2", {
      fn: new Mul([
        new Name("M_chla"),
        new Name("ml_absorption_chla"),
        new Add([new Num(1.0), new Minus([new Name("chla_fraction_PS1")])]),
      ]),
      texName: "ml\\_absorption\\_ps2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("ml_absorption_pbs", {
      fn: new Mul([
        new Name("M_chla"),
        new Add([
          new Name("ml_absorption_allophycocyanin"),
          new Name("ml_absorption_phycocyanin"),
        ]),
      ]),
      texName: "ml\\_absorption\\_pbs",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "micro", exponent: 1 },
          { kind: "metre", exponent: -2 },
          { kind: "second", exponent: -1 },
        ],
      }),
    })
    .addAssignment("PQ_red", {
      fn: new Add([new Name("PQ_tot"), new Minus([new Name("PQ_ox")])]),
      texName: "PQ\\_red",
    })
    .addAssignment("PC_red", {
      fn: new Add([new Name("PC_tot"), new Minus([new Name("PC_ox")])]),
      texName: "PC\\_red",
    })
    .addAssignment("Fd_red", {
      fn: new Add([new Name("Fd_tot"), new Minus([new Name("Fd_ox")])]),
      texName: "Fd\\_red",
    })
    .addAssignment("NADP", {
      fn: new Add([new Name("NADP_tot"), new Minus([new Name("NADPH")])]),
      texName: "NADP",
    })
    .addAssignment("NAD", {
      fn: new Add([new Name("NAD_tot"), new Minus([new Name("NADH")])]),
      texName: "NAD",
    })
    .addAssignment("ADP", {
      fn: new Add([new Name("AP_tot"), new Minus([new Name("ATP")])]),
      texName: "ADP",
    })
    .addAssignment("PSIIq", {
      fn: new Add([new Name("PSIItot"), new Minus([new Name("PSII")])]),
      texName: "PSIIq",
    })
    .addAssignment("Keq_PQred", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
            new Minus([
              new Mul([new Num(2.0), new Name("E0_QA"), new Name("F")]),
            ]),
            new Minus([
              new Mul([
                new Num(2.0),
                new Name("dG_pH"),
                new Name("pHcytoplasm"),
              ]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "Keq\\_PQred",
    })
    .addAssignment("Keq_FAFd", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E0_Fd"), new Name("F")]),
            new Minus([new Mul([new Name("E0_FA"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "Keq\\_FAFd",
    })
    .addAssignment("Keq_PCP700", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Name("E0_P700"), new Name("F")]),
            new Minus([new Mul([new Name("E0_PC"), new Name("F")])]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "Keq\\_PCP700",
    })
    .addAssignment("Keq_vSDH", {
      fn: new Exp(
        new Divide([
          new Add([
            new Mul([new Num(2.0), new Name("E0_PQ"), new Name("F")]),
            new Minus([
              new Mul([
                new Num(2.0),
                new Name("E0_succinate_per_fumarate"),
                new Name("F"),
              ]),
            ]),
          ]),
          new Name("RT"),
        ]),
      ),
      texName: "Keq\\_vSDH",
    })
    .addAssignment("FPS2", {
      fn: new Mul([
        new Name("fluo_influence_ps2"),
        new Add([
          new Mul([
            new Name("kF"),
            new Add([new Name("B1_tot"), new Minus([new Name("B1")])]),
          ]),
          new Mul([
            new Name("kF"),
            new Add([new Name("B3_tot"), new Minus([new Name("B3")])]),
          ]),
        ]),
      ]),
      texName: "FPS2",
    })
    .addAssignment("FPS1", {
      fn: new Mul([
        new Name("fluo_influence_ps1"),
        new Name("k_F1"),
        new Add([new Name("Y1_tot"), new Minus([new Name("Y1")])]),
      ]),
      texName: "FPS1",
    })
    .addAssignment("FPBS", {
      fn: new Mul([
        new Name("PBS_free"),
        new Name("fluo_influence_pbs"),
        new Name("lcf"),
        new Name("ml_absorption_pbs"),
        new Add([new Num(1.0), new Minus([new Name("OCP")])]),
      ]),
      texName: "FPBS",
    })
    .addAssignment("Fluo", {
      fn: new Add([new Name("FPBS"), new Name("FPS1"), new Name("FPS2")]),
      texName: "Fluo",
    })
    .addAssignment("dG0_FNR", {
      fn: new Add([
        new Mul([new Name("dG_pH"), new Name("pHcytoplasm")]),
        new Mul([new Num(2.0), new Name("E0_Fd"), new Name("F")]),
        new Minus([
          new Mul([new Num(2.0), new Name("E0_NADP"), new Name("F")]),
        ]),
      ]),
      texName: "dG0\\_FNR",
    })
    .addAssignment("dG_FNR", {
      fn: new Add([
        new Name("dG0_FNR"),
        new Mul([
          new Name("RT"),
          new Ln(
            new Divide([
              new Mul([
                new Name("NADPH"),
                new Pow(new Name("Fd_ox"), new Num(2.0)),
              ]),
              new Mul([
                new Name("NADP"),
                new Pow(new Name("Fd_red"), new Num(2.0)),
              ]),
            ]),
          ),
        ]),
      ]),
      texName: "dG\\_FNR",
    })
    .addAssignment("f_CBB_energy", {
      fn: new Divide([
        new Mul([new Name("ATP"), new Name("NADPH")]),
        new Mul([
          new Add([new Name("ATP"), new Name("KMATP")]),
          new Add([new Name("KMNADPH"), new Name("NADPH")]),
        ]),
      ]),
      texName: "f\\_CBB\\_energy",
    })
    .addAssignment("f_CBB_gas", {
      fn: new Divide([
        new Mul([new Num(1.0), new Name("CO2")]),
        new Add([
          new Name("CO2"),
          new Mul([
            new Name("KMCO2"),
            new Add([
              new Num(1.0),
              new Divide([new Name("O2"), new Name("KIO2")]),
            ]),
          ]),
        ]),
      ]),
      texName: "f\\_CBB\\_gas",
    })
    .addAssignment("f_oxy_carbon", {
      fn: new Divide([
        new Name("_3PGA"),
        new Add([new Name("KMPGA"), new Name("_3PGA")]),
      ]),
      texName: "f\\_oxy\\_carbon",
    })
    .addAssignment("f_oxy_gas", {
      fn: new Divide([
        new Mul([new Num(1.0), new Name("O2")]),
        new Add([
          new Name("O2"),
          new Mul([
            new Name("KMO2"),
            new Add([
              new Num(1.0),
              new Divide([new Name("CO2"), new Name("KICO2")]),
            ]),
          ]),
        ]),
      ]),
      texName: "f\\_oxy\\_gas",
    })
    .addReaction("OCPactivation", {
      fn: new Add([
        new Minus([new Mul([new Name("OCP"), new Name("kOCPdeactivation")])]),
        new Mul([
          new Name("kOCPactivation"),
          new Name("lcf"),
          new Name("light_OCP"),
          new Add([new Name("OCPmax"), new Minus([new Name("OCP")])]),
        ]),
      ]),
      stoichiometry: [{ name: "OCP", value: new Num(1.0) }],
      texName: "OCPactivation",
    })
    .addReaction("vSDH", {
      fn: new Mul([
        new Name("k_SDH"),
        new Add([
          new Mul([new Name("PQ_ox"), new Name("succinate")]),
          new Minus([
            new Divide([
              new Mul([new Name("PQ_red"), new Name("fumarate")]),
              new Name("Keq_vSDH"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        { name: "PQ_ox", value: new Num(-1.0) },
        { name: "succinate", value: new Num(-1.0) },
        { name: "fumarate", value: new Num(1.0) },
      ],
      texName: "vSDH",
    })
    .addReaction("vRespiration", {
      fn: new Divide([
        new Mul([
          new Name("ADP"),
          new Name("NAD"),
          new Name("NADP"),
          new Name("_3PGA"),
          new Name("fumarate"),
          new Name("kRespiration"),
        ]),
        new Add([new Name("KMPGA"), new Name("_3PGA")]),
      ]),
      stoichiometry: [
        { name: "_3PGA", value: new Num(-1.0) },
        { name: "fumarate", value: new Num(-0.07402) },
        { name: "CO2", value: new Num(3.0) },
        { name: "succinate", value: new Num(0.07402) },
        { name: "ATP", value: new Num(0.567) },
        { name: "NADPH", value: new Num(2.237) },
        { name: "NADH", value: new Num(2.689) },
        { name: "Ho", value: new Divide([new Num(4.926), new Name("bHo")]) },
      ],
      texName: "vRespiration",
    })
    .addReaction("vbd", {
      fn: new Mul([
        new Name("Ho"),
        new Name("O2"),
        new Name("PQ_red"),
        new Name("k_ox1"),
      ]),
      stoichiometry: [
        { name: "PQ_ox", value: new Num(2.0) },
        { name: "O2", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(4.0), new Name("bHo")])]),
        },
        { name: "Hi", value: new Divide([new Num(4.0), new Name("bHi")]) },
      ],
      texName: "vbd",
    })
    .addReaction("vb6f", {
      fn: new Mul([
        new Name("Ho"),
        new Name("PC_ox"),
        new Name("PQ_red"),
        new Name("k_Q"),
      ]),
      stoichiometry: [
        { name: "PQ_ox", value: new Num(1.0) },
        { name: "Hi", value: new Divide([new Num(4.0), new Name("bHi")]) },
        { name: "PC_ox", value: new Num(-2.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(2.0), new Name("bHo")])]),
        },
      ],
      texName: "vb6f",
    })
    .addReaction("vaa", {
      fn: new Mul([
        new Name("Ho"),
        new Name("O2"),
        new Name("PC_red"),
        new Name("k_aa"),
      ]),
      stoichiometry: [
        { name: "PC_ox", value: new Num(4.0) },
        { name: "Hi", value: new Divide([new Num(1.0), new Name("bHi")]) },
        { name: "O2", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(5.0), new Name("bHo")])]),
        },
      ],
      texName: "vaa",
    })
    .addReaction("vPSIIquench", {
      fn: new Mul([new Name("PQ_red"), new Name("PSII"), new Name("kQuench")]),
      stoichiometry: [{ name: "PSII", value: new Num(-1.0) }],
      texName: "vPSIIquench",
    })
    .addReaction("vPSIIunquench", {
      fn: new Mul([
        new Name("PSIIq"),
        new Name("kUnquench"),
        new Add([
          new Num(1.0),
          new Minus([
            new Divide([
              new Pow(new Name("PQ_red"), new Num(1.0)),
              new Add([
                new Name("KMUnquench"),
                new Pow(new Name("PQ_red"), new Num(1.0)),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "PSII", value: new Num(1.0) }],
      texName: "vPSIIunquench",
    })
    .addReaction("vPS2", {
      fn: new Mul([new Num(0.5), new Name("B1"), new Name("k2")]),
      stoichiometry: [
        { name: "PQ_ox", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(2.0), new Name("bHo")])]),
        },
        { name: "Hi", value: new Divide([new Num(2.0), new Name("bHi")]) },
        { name: "O2", value: new Num(0.5) },
      ],
      texName: "vPS2",
    })
    .addReaction("vPS1", {
      fn: new Add([
        new Mul([new Name("Y0"), new Name("light_ps1")]),
        new Minus([new Mul([new Name("Y1"), new Name("k_F1")])]),
      ]),
      stoichiometry: [
        { name: "Fd_ox", value: new Num(-1.0) },
        { name: "PC_ox", value: new Num(1.0) },
      ],
      texName: "vPS1",
    })
    .addReaction("vFlv", {
      fn: new Divide([
        new Mul([
          new Num(1.0),
          new Name("Ho"),
          new Name("O2"),
          new Name("k_O2"),
          new Pow(new Name("Fd_red"), new Name("nHillFdred")),
        ]),
        new Add([
          new Name("KHillFdred"),
          new Pow(new Name("Fd_red"), new Name("nHillFdred")),
        ]),
      ]),
      stoichiometry: [
        { name: "Fd_ox", value: new Num(4.0) },
        { name: "O2", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(4.0), new Name("bHo")])]),
        },
      ],
      texName: "vFlv",
    })
    .addReaction("vNDH", {
      fn: new Mul([
        new Name("Ho"),
        new Name("NADH"),
        new Name("PQ_ox"),
        new Name("k_NDH"),
      ]),
      stoichiometry: [
        { name: "PQ_ox", value: new Num(-1.0) },
        { name: "NADH", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(1.0), new Name("bHo")])]),
        },
      ],
      texName: "vNDH",
    })
    .addReaction("vFNR", {
      fn: new Piecewise([
        new Num(0.0),
        new GreaterThan([new Name("dG_FNR"), new Num(0.0)]),
        new Mul([
          new Name("Fd_red"),
          new Name("NADP"),
          new Name("k_FN_fwd"),
          new Add([new Num(1.0), new Minus([new Exp(new Name("dG_FNR"))])]),
        ]),
      ]),
      stoichiometry: [
        { name: "Fd_ox", value: new Num(2.0) },
        { name: "NADPH", value: new Num(1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(1.0), new Name("bHo")])]),
        },
      ],
      texName: "vFNR",
    })
    .addReaction("vPass", {
      fn: new Mul([
        new Name("k_pass"),
        new Add([new Name("Hi_mol"), new Minus([new Name("Ho_mol")])]),
      ]),
      stoichiometry: [
        {
          name: "Hi",
          value: new Minus([new Divide([new Num(1.0), new Name("bHi")])]),
        },
        { name: "Ho", value: new Divide([new Num(1.0), new Name("bHo")]) },
      ],
      texName: "vPass",
    })
    .addReaction("vNQ", {
      fn: new Divide([
        new Mul([new Name("Fd_red"), new Name("PQ_ox"), new Name("vNQ_max")]),
        new Mul([
          new Add([new Name("Fd_red"), new Name("KMNQ_Fdred")]),
          new Add([new Name("KMNQ_Qox"), new Name("PQ_ox")]),
        ]),
      ]),
      stoichiometry: [
        { name: "Fd_ox", value: new Num(2.0) },
        { name: "PQ_ox", value: new Num(-1.0) },
        { name: "Hi", value: new Divide([new Num(1.0), new Name("bHi")]) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(3.0), new Name("bHo")])]),
        },
      ],
      texName: "vNQ",
    })
    .addReaction("vO2out", {
      fn: new Mul([
        new Name("kO2out"),
        new Add([new Name("O2"), new Minus([new Name("O2ext")])]),
      ]),
      stoichiometry: [{ name: "O2", value: new Num(-1.0) }],
      texName: "vO2out",
    })
    .addReaction("vCCM", {
      fn: new Mul([
        new Name("kCCM"),
        new Add([
          new Minus([new Name("CO2")]),
          new Divide([
            new Mul([
              new Num(1.5222543835659166e-67),
              new Name("CO2ext_pp"),
              new Name("Ho"),
              new Name("fCin"),
              new Pow(new Name("T"), new Num(22.294)),
              new Exp(
                new Add([
                  new Divide([new Num(9050.69), new Name("T")]),
                  new Mul([
                    new Name("S"),
                    new Add([
                      new Num(0.027766),
                      new Mul([
                        new Num(5.057800000000001e-7),
                        new Pow(new Name("T"), new Num(2.0)),
                      ]),
                      new Minus([
                        new Mul([new Num(0.00025888), new Name("T")]),
                      ]),
                    ]),
                  ]),
                ]),
              ),
            ]),
            new Mul([
              new Name("cChl"),
              new Add([
                new Name("Ho"),
                new Divide([
                  new Mul([
                    new Num(1000.0),
                    new Pow(
                      new Num(10.0),
                      new Add([
                        new Num(43.6977),
                        new Mul([new Num(0.0129037), new Name("S")]),
                        new Minus([
                          new Mul([
                            new Num(0.0001364),
                            new Pow(new Name("S"), new Num(2.0)),
                          ]),
                        ]),
                        new Minus([
                          new Mul([new Num(7.045159), new Ln(new Name("T"))]),
                        ]),
                        new Minus([
                          new Divide([new Num(2885.378), new Name("T")]),
                        ]),
                      ]),
                    ),
                  ]),
                  new Name("cChl"),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "CO2", value: new Num(1.0) }],
      texName: "vCCM",
    })
    .addReaction("vATPsynthase", {
      fn: new Mul([
        new Name("kATPsynth"),
        new Add([
          new Name("ADP"),
          new Minus([
            new Divide([
              new Mul([
                new Name("ATP"),
                new Exp(
                  new Minus([
                    new Divide([
                      new Add([
                        new Minus([new Name("DeltaG0_ATP")]),
                        new Mul([
                          new Name("HPR"),
                          new Name("dG_pH"),
                          new Add([
                            new Mul([
                              new Num(0.43429448190325176),
                              new Ln(
                                new Mul([new Num(2.9e-5), new Name("Hi")]),
                              ),
                            ]),
                            new Minus([
                              new Mul([
                                new Num(0.43429448190325176),
                                new Ln(
                                  new Mul([new Num(4.8e-6), new Name("Ho")]),
                                ),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                      new Name("RT"),
                    ]),
                  ]),
                ),
              ]),
              new Name("Pi_mol"),
            ]),
          ]),
        ]),
      ]),
      stoichiometry: [
        {
          name: "Hi",
          value: new Minus([new Divide([new Name("HPR"), new Name("bHi")])]),
        },
        { name: "Ho", value: new Divide([new Name("HPR"), new Name("bHo")]) },
        { name: "ATP", value: new Num(1.0) },
      ],
      texName: "vATPsynthase",
    })
    .addReaction("vATPconsumption", {
      fn: new Mul([new Name("ATP"), new Name("kATPconsumption")]),
      stoichiometry: [{ name: "ATP", value: new Num(-1.0) }],
      texName: "vATPconsumption",
    })
    .addReaction("vNADHconsumption", {
      fn: new Mul([
        new Name("Ho"),
        new Name("NADH"),
        new Name("kNADHconsumption"),
      ]),
      stoichiometry: [
        { name: "NADH", value: new Num(-1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(1.0), new Name("bHo")])]),
        },
      ],
      texName: "vNADHconsumption",
    })
    .addReaction("vCBBactivation", {
      fn: new Mul([
        new Name("kCBBactivation"),
        new Add([
          new Minus([new Name("CBBa")]),
          new Divide([
            new Name("Fd_red"),
            new Add([new Name("Fd_red"), new Name("KMFdred")]),
          ]),
        ]),
      ]),
      stoichiometry: [{ name: "CBBa", value: new Num(1.0) }],
      texName: "vCBBactivation",
    })
    .addReaction("vCBB", {
      fn: new Mul([
        new Name("CBBa"),
        new Name("f_CBB_energy"),
        new Name("f_CBB_gas"),
        new Name("vCBB_max"),
      ]),
      stoichiometry: [
        { name: "CO2", value: new Num(-3.0) },
        { name: "ATP", value: new Num(-8.0) },
        { name: "NADPH", value: new Num(-5.0) },
        { name: "_3PGA", value: new Num(1.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(5.0), new Name("bHo")])]),
        },
      ],
      texName: "vCBB",
    })
    .addReaction("vOxy", {
      fn: new Mul([
        new Name("CBBa"),
        new Name("f_CBB_energy"),
        new Name("f_oxy_carbon"),
        new Name("f_oxy_gas"),
        new Name("vOxy_max"),
      ]),
      stoichiometry: [
        { name: "O2", value: new Num(-3.0) },
        { name: "ATP", value: new Num(-8.0) },
        { name: "NADPH", value: new Num(-5.0) },
        { name: "_3PGA", value: new Num(-2.0) },
        { name: "PG", value: new Num(3.0) },
        {
          name: "Ho",
          value: new Minus([new Divide([new Num(5.0), new Name("bHo")])]),
        },
      ],
      texName: "vOxy",
    })
    .addReaction("vPRsalv", {
      fn: new Mul([
        new Name("ATP"),
        new Name("NAD"),
        new Name("NADPH"),
        new Name("PG"),
        new Name("kPR"),
      ]),
      stoichiometry: [
        { name: "PG", value: new Num(-2.0) },
        { name: "ATP", value: new Num(-1.0) },
        { name: "NADPH", value: new Num(-1.0) },
        { name: "Ho", value: new Divide([new Num(1.0), new Name("bHo")]) },
        { name: "NADH", value: new Num(2.0) },
        { name: "_3PGA", value: new Num(1.0) },
        { name: "CO2", value: new Num(1.0) },
      ],
      texName: "vPRsalv",
    })
    .addAssignment("light_ps1", {
      fn: new Divide([
        new Mul([
          new Name("lcf"),
          new Add([
            new Name("absorption_ps1"),
            new Mul([
              new Name("PBS_PS1"),
              new Name("absorption_pbs"),
              new Add([new Num(1.0), new Minus([new Name("OCP")])]),
            ]),
          ]),
        ]),
        new Name("PSItot"),
      ]),
      texName: "light\\_ps1",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("light_ps2", {
      fn: new Divide([
        new Mul([
          new Name("lcf"),
          new Add([
            new Name("absorption_ps2"),
            new Mul([
              new Name("PBS_PS2"),
              new Name("absorption_pbs"),
              new Add([new Num(1.0), new Minus([new Name("OCP")])]),
            ]),
          ]),
        ]),
        new Name("PSIItot"),
      ]),
      texName: "light\\_ps2",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("light_ps1_ML", {
      fn: new Divide([
        new Mul([
          new Name("lcf"),
          new Add([
            new Name("absorption_ps1"),
            new Mul([
              new Name("PBS_PS1"),
              new Name("absorption_pbs"),
              new Add([new Num(1.0), new Minus([new Name("OCP")])]),
            ]),
          ]),
        ]),
        new Name("PSItot"),
      ]),
      texName: "light\\_ps1\\_ML",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("light_ps2_ML", {
      fn: new Divide([
        new Mul([
          new Name("lcf"),
          new Add([
            new Name("absorption_ps2"),
            new Mul([
              new Name("PBS_PS2"),
              new Name("absorption_pbs"),
              new Add([new Num(1.0), new Minus([new Name("OCP")])]),
            ]),
          ]),
        ]),
        new Name("PSIItot"),
      ]),
      texName: "light\\_ps2\\_ML",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("light_ps1_tot", {
      fn: new Add([new Name("light_ps1"), new Name("light_ps1_ML")]),
      texName: "light\\_ps1\\_tot",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("light_ps2_tot", {
      fn: new Add([new Name("light_ps2"), new Name("light_ps2_ML")]),
      texName: "light\\_ps2\\_tot",
      unit: Unit.fromJson({ factors: [{ kind: "second", exponent: -1 }] }),
    })
    .addAssignment("B0", {
      fn: new Divide([
        new Add([
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Pow(
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kPQred"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
          new Mul([
            new Num(2.0),
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kF"),
            new Name("kPQred"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([new Name("k2"), new Name("kF"), new Name("light_ps2")]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
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
        new Add([
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("light_ps2"),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Name("light_ps2"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([new Name("k2"), new Name("kF"), new Name("light_ps2")]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
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
        new Add([
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kF"),
            new Name("light_ps2"),
          ]),
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Name("light_ps2"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Num(2.0),
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([new Name("k2"), new Name("kF"), new Name("light_ps2")]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
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
        new Add([
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Pow(new Name("light_ps2"), new Num(2.0)),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([new Name("k2"), new Name("kF"), new Name("light_ps2")]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
      ]),
      texName: "B3",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B0_tot", {
      fn: new Divide([
        new Add([
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Pow(new Name("kF"), new Num(2.0)),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Pow(
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
              new Num(2.0),
            ),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kF"),
            new Name("kPQred"),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kPQred"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
          new Mul([
            new Num(2.0),
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kF"),
            new Name("kPQred"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2_tot"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
      ]),
      texName: "B0\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B1_tot", {
      fn: new Divide([
        new Add([
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kF"),
            new Name("kPQred"),
            new Name("light_ps2_tot"),
          ]),
          new Mul([
            new Name("PQ_ox"),
            new Name("PSIItot"),
            new Name("kPQred"),
            new Name("light_ps2_tot"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2_tot"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
      ]),
      texName: "B1\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B2_tot", {
      fn: new Divide([
        new Add([
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Name("kF"),
            new Name("light_ps2_tot"),
          ]),
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Name("light_ps2_tot"),
            new Add([
              new Name("kH0"),
              new Divide([
                new Mul([new Name("PSIIq"), new Name("kHst")]),
                new Name("PSIItot"),
              ]),
            ]),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Num(2.0),
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2_tot"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
      ]),
      texName: "B2\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("B3_tot", {
      fn: new Divide([
        new Add([
          new Mul([
            new Name("PSIItot"),
            new Name("k2"),
            new Pow(new Name("light_ps2_tot"), new Num(2.0)),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Name("Keq_PQred"),
          ]),
          new Divide([
            new Mul([
              new Name("PQ_red"),
              new Name("PSIItot"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Name("Keq_PQred"),
          ]),
        ]),
        new Pow(
          new Add([
            new Mul([
              new Name("k2"),
              new Pow(new Name("light_ps2_tot"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Pow(
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
                new Num(2.0),
              ),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("k2"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
            ]),
            new Mul([
              new Name("PQ_ox"),
              new Name("kPQred"),
              new Name("light_ps2_tot"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Pow(
                  new Add([
                    new Name("kH0"),
                    new Divide([
                      new Mul([new Name("PSIIq"), new Name("kHst")]),
                      new Name("PSIItot"),
                    ]),
                  ]),
                  new Num(2.0),
                ),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("PQ_ox"),
              new Name("kF"),
              new Name("kPQred"),
              new Add([
                new Name("kH0"),
                new Divide([
                  new Mul([new Name("PSIIq"), new Name("kHst")]),
                  new Name("PSIItot"),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("k2"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Name("PQ_red"),
                new Name("kPQred"),
                new Name("light_ps2_tot"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
            new Divide([
              new Mul([
                new Num(2.0),
                new Name("PQ_red"),
                new Name("kF"),
                new Name("kPQred"),
                new Add([
                  new Name("kH0"),
                  new Divide([
                    new Mul([new Name("PSIIq"), new Name("kHst")]),
                    new Name("PSIItot"),
                  ]),
                ]),
              ]),
              new Name("Keq_PQred"),
            ]),
          ]),
          new Num(1.0),
        ),
      ]),
      texName: "B3\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y0", {
      fn: new Divide([
        new Mul([
          new Name("PSItot"),
          new Add([
            new Num(1.0),
            new Minus([
              new Divide([
                new Mul([
                  new Name("light_ps1"),
                  new Add([
                    new Num(1.0),
                    new Minus([
                      new Divide([
                        new Mul([
                          new Name("k_F1"),
                          new Add([
                            new Num(1.0),
                            new Divide([
                              new Add([
                                new Minus([new Name("light_ps1")]),
                                new Divide([
                                  new Mul([
                                    new Name("Fd_red"),
                                    new Name("kFdred"),
                                  ]),
                                  new Name("Keq_FAFd"),
                                ]),
                              ]),
                              new Add([
                                new Name("k_F1"),
                                new Name("light_ps1"),
                                new Mul([
                                  new Name("Fd_ox"),
                                  new Name("kFdred"),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Mul([new Name("PC_red"), new Name("kPCox")]),
                          new Divide([
                            new Mul([
                              new Name("k_F1"),
                              new Add([
                                new Minus([new Name("light_ps1")]),
                                new Divide([
                                  new Mul([
                                    new Name("Fd_red"),
                                    new Name("kFdred"),
                                  ]),
                                  new Name("Keq_FAFd"),
                                ]),
                              ]),
                            ]),
                            new Add([
                              new Name("k_F1"),
                              new Name("light_ps1"),
                              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Num(1.0),
          new Divide([
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([
                  new Add([
                    new Minus([new Name("light_ps1")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                  new Add([
                    new Name("k_F1"),
                    new Name("light_ps1"),
                    new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                  ]),
                ]),
              ]),
              new Add([
                new Name("light_ps1"),
                new Divide([
                  new Mul([new Name("PC_ox"), new Name("kPCox")]),
                  new Name("Keq_PCP700"),
                ]),
              ]),
            ]),
            new Add([
              new Mul([new Name("PC_red"), new Name("kPCox")]),
              new Divide([
                new Mul([
                  new Name("k_F1"),
                  new Add([
                    new Minus([new Name("light_ps1")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y0",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y1", {
      fn: new Add([
        new Divide([
          new Mul([new Name("PSItot"), new Name("light_ps1")]),
          new Add([
            new Name("k_F1"),
            new Name("light_ps1"),
            new Mul([new Name("Fd_ox"), new Name("kFdred")]),
          ]),
        ]),
        new Divide([
          new Mul([
            new Add([
              new Minus([new Name("light_ps1")]),
              new Divide([
                new Mul([new Name("Fd_red"), new Name("kFdred")]),
                new Name("Keq_FAFd"),
              ]),
            ]),
            new Add([
              new Divide([
                new Mul([
                  new Name("PSItot"),
                  new Add([
                    new Num(1.0),
                    new Minus([
                      new Divide([
                        new Mul([
                          new Name("light_ps1"),
                          new Add([
                            new Num(1.0),
                            new Minus([
                              new Divide([
                                new Mul([
                                  new Name("k_F1"),
                                  new Add([
                                    new Num(1.0),
                                    new Divide([
                                      new Add([
                                        new Minus([new Name("light_ps1")]),
                                        new Divide([
                                          new Mul([
                                            new Name("Fd_red"),
                                            new Name("kFdred"),
                                          ]),
                                          new Name("Keq_FAFd"),
                                        ]),
                                      ]),
                                      new Add([
                                        new Name("k_F1"),
                                        new Name("light_ps1"),
                                        new Mul([
                                          new Name("Fd_ox"),
                                          new Name("kFdred"),
                                        ]),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                                new Add([
                                  new Mul([
                                    new Name("PC_red"),
                                    new Name("kPCox"),
                                  ]),
                                  new Divide([
                                    new Mul([
                                      new Name("k_F1"),
                                      new Add([
                                        new Minus([new Name("light_ps1")]),
                                        new Divide([
                                          new Mul([
                                            new Name("Fd_red"),
                                            new Name("kFdred"),
                                          ]),
                                          new Name("Keq_FAFd"),
                                        ]),
                                      ]),
                                    ]),
                                    new Add([
                                      new Name("k_F1"),
                                      new Name("light_ps1"),
                                      new Mul([
                                        new Name("Fd_ox"),
                                        new Name("kFdred"),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Name("k_F1"),
                          new Name("light_ps1"),
                          new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new Add([
                    new Name("light_ps1"),
                    new Divide([
                      new Mul([new Name("PC_ox"), new Name("kPCox")]),
                      new Name("Keq_PCP700"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Num(1.0),
                  new Divide([
                    new Mul([
                      new Add([
                        new Num(1.0),
                        new Divide([
                          new Add([
                            new Minus([new Name("light_ps1")]),
                            new Divide([
                              new Mul([new Name("Fd_red"), new Name("kFdred")]),
                              new Name("Keq_FAFd"),
                            ]),
                          ]),
                          new Add([
                            new Name("k_F1"),
                            new Name("light_ps1"),
                            new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                          ]),
                        ]),
                      ]),
                      new Add([
                        new Name("light_ps1"),
                        new Divide([
                          new Mul([new Name("PC_ox"), new Name("kPCox")]),
                          new Name("Keq_PCP700"),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Mul([new Name("PC_red"), new Name("kPCox")]),
                      new Divide([
                        new Mul([
                          new Name("k_F1"),
                          new Add([
                            new Minus([new Name("light_ps1")]),
                            new Divide([
                              new Mul([new Name("Fd_red"), new Name("kFdred")]),
                              new Name("Keq_FAFd"),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Name("k_F1"),
                          new Name("light_ps1"),
                          new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("PSItot"),
                    new Name("k_F1"),
                    new Name("light_ps1"),
                  ]),
                  new Add([
                    new Name("k_F1"),
                    new Name("light_ps1"),
                    new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Add([
              new Mul([new Name("PC_red"), new Name("kPCox")]),
              new Divide([
                new Mul([
                  new Name("k_F1"),
                  new Add([
                    new Minus([new Name("light_ps1")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
            new Add([
              new Name("k_F1"),
              new Name("light_ps1"),
              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y1",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y2", {
      fn: new Divide([
        new Add([
          new Divide([
            new Mul([
              new Name("PSItot"),
              new Add([
                new Num(1.0),
                new Minus([
                  new Divide([
                    new Mul([
                      new Name("light_ps1"),
                      new Add([
                        new Num(1.0),
                        new Minus([
                          new Divide([
                            new Mul([
                              new Name("k_F1"),
                              new Add([
                                new Num(1.0),
                                new Divide([
                                  new Add([
                                    new Minus([new Name("light_ps1")]),
                                    new Divide([
                                      new Mul([
                                        new Name("Fd_red"),
                                        new Name("kFdred"),
                                      ]),
                                      new Name("Keq_FAFd"),
                                    ]),
                                  ]),
                                  new Add([
                                    new Name("k_F1"),
                                    new Name("light_ps1"),
                                    new Mul([
                                      new Name("Fd_ox"),
                                      new Name("kFdred"),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                            new Add([
                              new Mul([new Name("PC_red"), new Name("kPCox")]),
                              new Divide([
                                new Mul([
                                  new Name("k_F1"),
                                  new Add([
                                    new Minus([new Name("light_ps1")]),
                                    new Divide([
                                      new Mul([
                                        new Name("Fd_red"),
                                        new Name("kFdred"),
                                      ]),
                                      new Name("Keq_FAFd"),
                                    ]),
                                  ]),
                                ]),
                                new Add([
                                  new Name("k_F1"),
                                  new Name("light_ps1"),
                                  new Mul([
                                    new Name("Fd_ox"),
                                    new Name("kFdred"),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Name("k_F1"),
                      new Name("light_ps1"),
                      new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                    ]),
                  ]),
                ]),
              ]),
              new Add([
                new Name("light_ps1"),
                new Divide([
                  new Mul([new Name("PC_ox"), new Name("kPCox")]),
                  new Name("Keq_PCP700"),
                ]),
              ]),
            ]),
            new Add([
              new Num(1.0),
              new Divide([
                new Mul([
                  new Add([
                    new Num(1.0),
                    new Divide([
                      new Add([
                        new Minus([new Name("light_ps1")]),
                        new Divide([
                          new Mul([new Name("Fd_red"), new Name("kFdred")]),
                          new Name("Keq_FAFd"),
                        ]),
                      ]),
                      new Add([
                        new Name("k_F1"),
                        new Name("light_ps1"),
                        new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                      ]),
                    ]),
                  ]),
                  new Add([
                    new Name("light_ps1"),
                    new Divide([
                      new Mul([new Name("PC_ox"), new Name("kPCox")]),
                      new Name("Keq_PCP700"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Mul([new Name("PC_red"), new Name("kPCox")]),
                  new Divide([
                    new Mul([
                      new Name("k_F1"),
                      new Add([
                        new Minus([new Name("light_ps1")]),
                        new Divide([
                          new Mul([new Name("Fd_red"), new Name("kFdred")]),
                          new Name("Keq_FAFd"),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Name("k_F1"),
                      new Name("light_ps1"),
                      new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Name("PSItot"),
                new Name("k_F1"),
                new Name("light_ps1"),
              ]),
              new Add([
                new Name("k_F1"),
                new Name("light_ps1"),
                new Mul([new Name("Fd_ox"), new Name("kFdred")]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Mul([new Name("PC_red"), new Name("kPCox")]),
          new Divide([
            new Mul([
              new Name("k_F1"),
              new Add([
                new Minus([new Name("light_ps1")]),
                new Divide([
                  new Mul([new Name("Fd_red"), new Name("kFdred")]),
                  new Name("Keq_FAFd"),
                ]),
              ]),
            ]),
            new Add([
              new Name("k_F1"),
              new Name("light_ps1"),
              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y2",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y0_tot", {
      fn: new Divide([
        new Mul([
          new Name("PSItot"),
          new Add([
            new Num(1.0),
            new Minus([
              new Divide([
                new Mul([
                  new Name("light_ps1_tot"),
                  new Add([
                    new Num(1.0),
                    new Minus([
                      new Divide([
                        new Mul([
                          new Name("k_F1"),
                          new Add([
                            new Num(1.0),
                            new Divide([
                              new Add([
                                new Minus([new Name("light_ps1_tot")]),
                                new Divide([
                                  new Mul([
                                    new Name("Fd_red"),
                                    new Name("kFdred"),
                                  ]),
                                  new Name("Keq_FAFd"),
                                ]),
                              ]),
                              new Add([
                                new Name("k_F1"),
                                new Name("light_ps1_tot"),
                                new Mul([
                                  new Name("Fd_ox"),
                                  new Name("kFdred"),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Mul([new Name("PC_red"), new Name("kPCox")]),
                          new Divide([
                            new Mul([
                              new Name("k_F1"),
                              new Add([
                                new Minus([new Name("light_ps1_tot")]),
                                new Divide([
                                  new Mul([
                                    new Name("Fd_red"),
                                    new Name("kFdred"),
                                  ]),
                                  new Name("Keq_FAFd"),
                                ]),
                              ]),
                            ]),
                            new Add([
                              new Name("k_F1"),
                              new Name("light_ps1_tot"),
                              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1_tot"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Num(1.0),
          new Divide([
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([
                  new Add([
                    new Minus([new Name("light_ps1_tot")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                  new Add([
                    new Name("k_F1"),
                    new Name("light_ps1_tot"),
                    new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                  ]),
                ]),
              ]),
              new Add([
                new Name("light_ps1_tot"),
                new Divide([
                  new Mul([new Name("PC_ox"), new Name("kPCox")]),
                  new Name("Keq_PCP700"),
                ]),
              ]),
            ]),
            new Add([
              new Mul([new Name("PC_red"), new Name("kPCox")]),
              new Divide([
                new Mul([
                  new Name("k_F1"),
                  new Add([
                    new Minus([new Name("light_ps1_tot")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1_tot"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y0\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y1_tot", {
      fn: new Add([
        new Divide([
          new Mul([new Name("PSItot"), new Name("light_ps1_tot")]),
          new Add([
            new Name("k_F1"),
            new Name("light_ps1_tot"),
            new Mul([new Name("Fd_ox"), new Name("kFdred")]),
          ]),
        ]),
        new Divide([
          new Mul([
            new Add([
              new Minus([new Name("light_ps1_tot")]),
              new Divide([
                new Mul([new Name("Fd_red"), new Name("kFdred")]),
                new Name("Keq_FAFd"),
              ]),
            ]),
            new Add([
              new Divide([
                new Mul([
                  new Name("PSItot"),
                  new Add([
                    new Num(1.0),
                    new Minus([
                      new Divide([
                        new Mul([
                          new Name("light_ps1_tot"),
                          new Add([
                            new Num(1.0),
                            new Minus([
                              new Divide([
                                new Mul([
                                  new Name("k_F1"),
                                  new Add([
                                    new Num(1.0),
                                    new Divide([
                                      new Add([
                                        new Minus([new Name("light_ps1_tot")]),
                                        new Divide([
                                          new Mul([
                                            new Name("Fd_red"),
                                            new Name("kFdred"),
                                          ]),
                                          new Name("Keq_FAFd"),
                                        ]),
                                      ]),
                                      new Add([
                                        new Name("k_F1"),
                                        new Name("light_ps1_tot"),
                                        new Mul([
                                          new Name("Fd_ox"),
                                          new Name("kFdred"),
                                        ]),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                                new Add([
                                  new Mul([
                                    new Name("PC_red"),
                                    new Name("kPCox"),
                                  ]),
                                  new Divide([
                                    new Mul([
                                      new Name("k_F1"),
                                      new Add([
                                        new Minus([new Name("light_ps1_tot")]),
                                        new Divide([
                                          new Mul([
                                            new Name("Fd_red"),
                                            new Name("kFdred"),
                                          ]),
                                          new Name("Keq_FAFd"),
                                        ]),
                                      ]),
                                    ]),
                                    new Add([
                                      new Name("k_F1"),
                                      new Name("light_ps1_tot"),
                                      new Mul([
                                        new Name("Fd_ox"),
                                        new Name("kFdred"),
                                      ]),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Name("k_F1"),
                          new Name("light_ps1_tot"),
                          new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                        ]),
                      ]),
                    ]),
                  ]),
                  new Add([
                    new Name("light_ps1_tot"),
                    new Divide([
                      new Mul([new Name("PC_ox"), new Name("kPCox")]),
                      new Name("Keq_PCP700"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Num(1.0),
                  new Divide([
                    new Mul([
                      new Add([
                        new Num(1.0),
                        new Divide([
                          new Add([
                            new Minus([new Name("light_ps1_tot")]),
                            new Divide([
                              new Mul([new Name("Fd_red"), new Name("kFdred")]),
                              new Name("Keq_FAFd"),
                            ]),
                          ]),
                          new Add([
                            new Name("k_F1"),
                            new Name("light_ps1_tot"),
                            new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                          ]),
                        ]),
                      ]),
                      new Add([
                        new Name("light_ps1_tot"),
                        new Divide([
                          new Mul([new Name("PC_ox"), new Name("kPCox")]),
                          new Name("Keq_PCP700"),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Mul([new Name("PC_red"), new Name("kPCox")]),
                      new Divide([
                        new Mul([
                          new Name("k_F1"),
                          new Add([
                            new Minus([new Name("light_ps1_tot")]),
                            new Divide([
                              new Mul([new Name("Fd_red"), new Name("kFdred")]),
                              new Name("Keq_FAFd"),
                            ]),
                          ]),
                        ]),
                        new Add([
                          new Name("k_F1"),
                          new Name("light_ps1_tot"),
                          new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("PSItot"),
                    new Name("k_F1"),
                    new Name("light_ps1_tot"),
                  ]),
                  new Add([
                    new Name("k_F1"),
                    new Name("light_ps1_tot"),
                    new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Mul([
            new Add([
              new Mul([new Name("PC_red"), new Name("kPCox")]),
              new Divide([
                new Mul([
                  new Name("k_F1"),
                  new Add([
                    new Minus([new Name("light_ps1_tot")]),
                    new Divide([
                      new Mul([new Name("Fd_red"), new Name("kFdred")]),
                      new Name("Keq_FAFd"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Name("k_F1"),
                  new Name("light_ps1_tot"),
                  new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                ]),
              ]),
            ]),
            new Add([
              new Name("k_F1"),
              new Name("light_ps1_tot"),
              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y1\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    })
    .addAssignment("Y2_tot", {
      fn: new Divide([
        new Add([
          new Divide([
            new Mul([
              new Name("PSItot"),
              new Add([
                new Num(1.0),
                new Minus([
                  new Divide([
                    new Mul([
                      new Name("light_ps1_tot"),
                      new Add([
                        new Num(1.0),
                        new Minus([
                          new Divide([
                            new Mul([
                              new Name("k_F1"),
                              new Add([
                                new Num(1.0),
                                new Divide([
                                  new Add([
                                    new Minus([new Name("light_ps1_tot")]),
                                    new Divide([
                                      new Mul([
                                        new Name("Fd_red"),
                                        new Name("kFdred"),
                                      ]),
                                      new Name("Keq_FAFd"),
                                    ]),
                                  ]),
                                  new Add([
                                    new Name("k_F1"),
                                    new Name("light_ps1_tot"),
                                    new Mul([
                                      new Name("Fd_ox"),
                                      new Name("kFdred"),
                                    ]),
                                  ]),
                                ]),
                              ]),
                            ]),
                            new Add([
                              new Mul([new Name("PC_red"), new Name("kPCox")]),
                              new Divide([
                                new Mul([
                                  new Name("k_F1"),
                                  new Add([
                                    new Minus([new Name("light_ps1_tot")]),
                                    new Divide([
                                      new Mul([
                                        new Name("Fd_red"),
                                        new Name("kFdred"),
                                      ]),
                                      new Name("Keq_FAFd"),
                                    ]),
                                  ]),
                                ]),
                                new Add([
                                  new Name("k_F1"),
                                  new Name("light_ps1_tot"),
                                  new Mul([
                                    new Name("Fd_ox"),
                                    new Name("kFdred"),
                                  ]),
                                ]),
                              ]),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Name("k_F1"),
                      new Name("light_ps1_tot"),
                      new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                    ]),
                  ]),
                ]),
              ]),
              new Add([
                new Name("light_ps1_tot"),
                new Divide([
                  new Mul([new Name("PC_ox"), new Name("kPCox")]),
                  new Name("Keq_PCP700"),
                ]),
              ]),
            ]),
            new Add([
              new Num(1.0),
              new Divide([
                new Mul([
                  new Add([
                    new Num(1.0),
                    new Divide([
                      new Add([
                        new Minus([new Name("light_ps1_tot")]),
                        new Divide([
                          new Mul([new Name("Fd_red"), new Name("kFdred")]),
                          new Name("Keq_FAFd"),
                        ]),
                      ]),
                      new Add([
                        new Name("k_F1"),
                        new Name("light_ps1_tot"),
                        new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                      ]),
                    ]),
                  ]),
                  new Add([
                    new Name("light_ps1_tot"),
                    new Divide([
                      new Mul([new Name("PC_ox"), new Name("kPCox")]),
                      new Name("Keq_PCP700"),
                    ]),
                  ]),
                ]),
                new Add([
                  new Mul([new Name("PC_red"), new Name("kPCox")]),
                  new Divide([
                    new Mul([
                      new Name("k_F1"),
                      new Add([
                        new Minus([new Name("light_ps1_tot")]),
                        new Divide([
                          new Mul([new Name("Fd_red"), new Name("kFdred")]),
                          new Name("Keq_FAFd"),
                        ]),
                      ]),
                    ]),
                    new Add([
                      new Name("k_F1"),
                      new Name("light_ps1_tot"),
                      new Mul([new Name("Fd_ox"), new Name("kFdred")]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          new Minus([
            new Divide([
              new Mul([
                new Name("PSItot"),
                new Name("k_F1"),
                new Name("light_ps1_tot"),
              ]),
              new Add([
                new Name("k_F1"),
                new Name("light_ps1_tot"),
                new Mul([new Name("Fd_ox"), new Name("kFdred")]),
              ]),
            ]),
          ]),
        ]),
        new Add([
          new Mul([new Name("PC_red"), new Name("kPCox")]),
          new Divide([
            new Mul([
              new Name("k_F1"),
              new Add([
                new Minus([new Name("light_ps1_tot")]),
                new Divide([
                  new Mul([new Name("Fd_red"), new Name("kFdred")]),
                  new Name("Keq_FAFd"),
                ]),
              ]),
            ]),
            new Add([
              new Name("k_F1"),
              new Name("light_ps1_tot"),
              new Mul([new Name("Fd_ox"), new Name("kFdred")]),
            ]),
          ]),
        ]),
      ]),
      texName: "Y2\\_tot",
      unit: Unit.fromJson({
        factors: [
          { kind: "mole", prefix: "milli", exponent: 1 },
          { kind: "mol_chl", exponent: -1 },
        ],
      }),
    });
}
