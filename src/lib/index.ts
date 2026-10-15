// place files you want to import through the `#lib` alias in this folder.
import type { PamGroup } from "./protocol";
import type { Backend } from "./stores/backends";

export { allBackends, backends, createWasmPool } from "./stores/backends";
export type { Backend };

export type SimulationAnalysis = {
  type: "simulation";
  id: number;
  idx: number;
  title: string;
  span: number;
  tEnd: number;
  xMin: number | undefined;
  xMax: number | undefined;
  yMin: number | undefined;
  yMax: number | undefined;
  timeoutInSeconds: number;
  backend: Backend;
  showDerived?: boolean;
  selectedKeys?: string[];
  normalizedKeys?: string[];
  nTimePoints: number;
  lineDisplay: "current" | "last" | "first";
};

export type ParameterScanAnalysis = {
  type: "parameterScan";
  id: number;
  idx: number;
  title: string;
  span: number;
  parameter: string;
  min: number;
  max: number;
  steps: number;
  tEnd: number;
  tolerance: number;
  xMin: number | undefined;
  xMax: number | undefined;
  yMin: number | undefined;
  yMax: number | undefined;
  timeoutInSeconds: number;
  backend: Backend;
  showDerived?: boolean;
  selectedKeys?: string[];
  normalizedKeys?: string[];
  lineDisplay: "current" | "last" | "first";
};

export type PamAnalysis = {
  type: "pam";
  id: number;
  idx: number;
  title: string;
  span: number;
  yMax: number | undefined;
  timeoutInSeconds: number;
  backend: Backend;
  ppfdKey: string;
  fluoKey?: string;
  pamProtocol: PamGroup[];
  showDerived?: boolean;
  selectedKeys?: string[];
  normalizedKeys?: string[];
  nTimePoints: number;
  lineDisplay: "current" | "last" | "first";
};

/**
 * Renders `OutcomeHeatmap.svelte` — unlike the other Analysis variants, this
 * one isn't generic: the classification itself is hardcoded to the
 * tripartite-ph model's own variable names (PublicMetabolizer/Cheater/
 * PrivateMetabolizer), the same way PamAnalysis is only meaningful for a
 * model exposing PPFD/Fluo-like variables. The two swept parameters, their
 * ranges/step counts, and `tEnd` are editable like any other Analysis;
 * every other parameter/initial condition uses the live model's current
 * value at scan time. Always dispatched via the WASM backend (not
 * user-selectable) — the whole point of this analysis is running hundreds
 * of short simulations in parallel, which only `createWasmPool` supports.
 */
export type OutcomeHeatmapAnalysis = {
  type: "outcomeHeatmap";
  id: number;
  idx: number;
  title: string;
  span: number;
  xParameter: string;
  xMin: number;
  xMax: number;
  xSteps: number;
  yParameter: string;
  yMin: number;
  yMax: number;
  ySteps: number;
  tEnd: number;
};

export type {
  FitParameterConfig,
  FitTargetMapping,
} from "@computational-biology-aachen/mxlweb-core/fit";

export type Analysis =
  | SimulationAnalysis
  | ParameterScanAnalysis
  | PamAnalysis
  | OutcomeHeatmapAnalysis;
export type Analyses = Analysis[];

// Steady-state (algebraic) models have their own analysis: a closed-form sweep
// of one parameter axis. No solver, no time — kept out of the `Analysis` union
// since `AnalysesDashboard` never handles it.
export type SteadyStateAnalysis = {
  type: "steadyState";
  id: number;
  idx: number;
  title: string;
  span: number;
  parameter: string;
  min: number;
  max: number;
  steps: number;
  xMin: number | undefined;
  xMax: number | undefined;
  yMin: number | undefined;
  yMax: number | undefined;
  selectedKeys?: string[];
  normalizedKeys?: string[];
  lineDisplay: "current" | "last" | "first";
};

export type SteadyStateAnalyses = SteadyStateAnalysis[];
