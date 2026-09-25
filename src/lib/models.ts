import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
import schemeFvcb from "$lib/assets/fvcb.png";
import mibinet from "$lib/assets/logos/mibinet.png";
import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
import scheme2016npq from "$lib/assets/matuszynska2016npq.png";
import scheme2016phd from "$lib/assets/matuszynska2016phd.png";
import schemeEnterobactin from "$lib/assets/mibinet-duo.png";
import schemePopDyn from "$lib/assets/population-dynamics.png";
import schemeSaadat from "$lib/assets/saadat2021.png";
import schemeSir from "$lib/assets/sir.png";
import schemeKea3 from "$lib/assets/tomato_KEA3.png";
import schemeTripartitePh from "$lib/assets/tripartite-ph.png";
import schemeTripartite from "$lib/assets/tripartite.png";
import schemeYokota from "$lib/assets/yokota.png";

export type ModelType = "ode" | "steady-state";

export type System =
  | "photosynthesis"
  | "ecology"
  | "epidemiology"
  | "iron-metabolism"
  | "mixed-culture"
  | "microbiology";

export const typeLabels: Record<ModelType, string> = {
  ode: "ODE model",
  "steady-state": "Steady-state model",
};

export const systemLabels: Record<System, string> = {
  photosynthesis: "Photosynthesis",
  ecology: "Ecology",
  epidemiology: "Epidemiology",
  "iron-metabolism": "Iron metabolism",
  "mixed-culture": "Mixed culture",
  microbiology: "Microbiology",
};

export type ModelMeta = {
  name: string;
  slug: string;
  type: ModelType;
  systems: System[];
  description: string;
  /** Short citation, e.g. "Ebeling et al."; omitted for unpublished models. */
  authors?: string;
  year?: number;
  image?: string;
  consortium?: string;
};

export const models: ModelMeta[] = [
  {
    name: "Lotka Volterra",
    slug: "lotka-volterra",
    type: "ode",
    systems: ["ecology"],
    authors: "Volterra",
    year: 1926,
    description:
      "Classical predator-prey model of two species with exponential prey growth, predator death and predation.",
    image: schemeLotkaVolt,
  },
  {
    name: "Population dynamics",
    slug: "population-dynamics",
    type: "ode",
    systems: ["microbiology", "mixed-culture"],
    description:
      "Two-species competition of E. coli and C. glutamicum with Monod-type growth and density-dependent death.",
    image: schemePopDyn,
  },
  {
    name: "Tripartite dynamics",
    slug: "tripartite",
    type: "ode",
    systems: ["microbiology", "mixed-culture"],
    authors: "Hassan et al.",
    year: 2026,
    description:
      "Generalized Lotka-Volterra model of a public metabolizer, a cheater and a private metabolizer competing for sucrose.",
    image: schemeTripartite,
    consortium: mibinet,
  },
  {
    name: "Tripartite dynamics (pH & resource)",
    slug: "tripartite-ph",
    type: "ode",
    systems: ["microbiology", "mixed-culture"],
    authors: "Hassan et al.",
    description:
      "Unpublished extension of the tripartite model with Monod kinetics on explicit sucrose and glucose pools and pH-dependent growth.",
    image: schemeTripartitePh,
    consortium: mibinet,
  },
  {
    name: "Enterobactin",
    slug: "dynamic-entrobactin",
    type: "ode",
    systems: ["iron-metabolism", "microbiology", "mixed-culture"],
    authors: "Krüger et al.",
    year: 2026,
    description:
      "Siderophore-mediated cross-feeding between E. coli and C. glutamicum under iron limitation.",
    image: schemeEnterobactin,
    consortium: mibinet,
  },
  {
    name: "Yokota 1985",
    slug: "yokota1985",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Yokota & Canvin",
    year: 1985,
    description:
      "Kinetic model of the photorespiratory C2 cycle, from glycolate to hydroxypyruvate with H₂O₂ scavenging.",
    image: schemeYokota,
  },
  {
    name: "Poolman 2000",
    slug: "poolman2000",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Poolman et al.",
    year: 2000,
    description:
      "Kinetic model of the Calvin–Benson cycle in C3 chloroplasts, with Rubisco carboxylase and oxygenase competing for RuBP.",
    image: scheme2016phd,
  },
  {
    name: "Matuszyńska 2016 (NPQ)",
    slug: "matuszynska2016_npq",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Matuszyńska et al.",
    year: 2016,
    description:
      "Non-photochemical quenching model of photoprotection in PSII, reproducing PAM fluorescence quenching.",
    image: scheme2016npq,
  },
  {
    name: "Matuszyńska 2016 (PHD)",
    slug: "matuszynska2016_phd",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Matuszyńska",
    year: 2016,
    description:
      "Extension of the NPQ model with PSI electron transport and explicit lumenal pH dynamics.",
    image: scheme2016phd,
  },
  {
    name: "Matuszyńska 2019",
    slug: "matuszynska2019",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Matuszyńska et al.",
    year: 2019,
    description:
      "Supply–demand model coupling the photosynthetic electron transport chain to the Calvin–Benson cycle.",
  },
  {
    name: "Saadat 2021",
    slug: "saadat2021",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Saadat et al.",
    year: 2021,
    description:
      "Linear electron flow through photosystem I, including the Mehler reaction.",
    image: schemeSaadat,
  },
  {
    name: "Ebeling 2026",
    slug: "ebeling-2026",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Ebeling et al.",
    year: 2026,
    description:
      "Light-driven model of the thylakoid membrane with cyclic electron flow and photoprotection.",
    image: schemeEbeling,
  },
  {
    name: "Tomato KEA3",
    slug: "kea3-tomato",
    type: "ode",
    systems: ["photosynthesis"],
    description:
      "Non-photochemical quenching model adapted for tomato, showing how the KEA3 antiporter shapes photoprotection kinetics.",
    image: schemeKea3,
  },
  {
    name: "SIR",
    slug: "sir",
    type: "ode",
    systems: ["epidemiology"],
    authors: "Kermack & McKendrick",
    year: 1927,
    description:
      "Classic compartmental model of infectious-disease spread with susceptible, infected and recovered groups.",
    image: schemeSir,
  },
  {
    name: "Bellasio 2019",
    slug: "bellasio2019",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Bellasio et al.",
    year: 2019,
    description:
      "Generalised model of leaf-level C3 photosynthesis coupling light and dark reactions with stomatal behaviour.",
  },
  {
    name: "Davis 2017",
    slug: "davis2017",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Davis et al.",
    year: 2017,
    description:
      "Electron transport chain model resolving the proton motive force into its electric and pH components.",
  },
  {
    name: "Hahn 1987",
    slug: "hahn1987",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Hahn",
    year: 1987,
    description:
      "Comprehensive model of C3 leaf carbon metabolism combining the Calvin cycle with photorespiration.",
  },
  {
    name: "Lazar 1997",
    slug: "lazar1997",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Lazár et al.",
    year: 1997,
    description:
      "Model of chlorophyll a fluorescence induction and how herbicides alter it, built on fifteen PSII states.",
  },
  {
    name: "Li 2021",
    slug: "li2021",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Li et al.",
    year: 2021,
    description:
      "Kinetic model of thylakoid ion fluxes and their effect on the proton motive force, built on Davis 2017.",
  },
  {
    name: "Zhu 2009",
    slug: "zhu2009",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Zhu et al.",
    year: 2009,
    description:
      "Deliberately simplified five-metabolite model of the Calvin–Benson–Bassham cycle.",
  },
  {
    name: "Fuente 2024",
    slug: "fuente2024",
    type: "ode",
    systems: ["photosynthesis"],
    authors: "Fuente et al.",
    year: 2024,
    description:
      "Photosynthetic electron transport model with PSII, PSI and non-photochemical quenching.",
  },
  {
    name: "Bernacchi 2023",
    slug: "bernacchi2023",
    type: "steady-state",
    systems: ["photosynthesis"],
    authors: "Bernacchi et al.",
    year: 2023,
    description:
      "FvCB model of C3 photosynthesis: net assimilation as the minimum of Rubisco-, electron-transport- and TPU-limited rates.",
    image: schemeFvcb,
  },
  {
    name: "FvCB 1980",
    slug: "fvcb",
    type: "steady-state",
    systems: ["photosynthesis"],
    authors: "Farquhar et al.",
    year: 1980,
    description:
      "The classic model of C3 photosynthesis: net assimilation as the minimum of Rubisco-, electron-transport- and TPU-limited rates.",
    image: schemeFvcb,
  },
  {
    name: "Johnson 2021",
    slug: "johnson2021",
    type: "steady-state",
    systems: ["photosynthesis"],
    authors: "Johnson & Berry",
    year: 2021,
    description:
      "FvCB model of C3 photosynthesis: net assimilation as the minimum of Rubisco-, electron-transport- and TPU-limited rates.",
    image: schemeFvcb,
  },
];
