// place files you want to import through the `$lib` alias in this folder.
import type { PamGroup } from "./protocol";
import type { Backend } from "./stores/backends";

export { allBackends, backends } from "./stores/backends";
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

export type FitTargetMapping = {
  /** CSV column header this target reads from. */
  column: string;
  /** Model state-variable id or derived-quantity id this column is fit against. */
  key: string;
  kind: "state" | "derived";
};

export type FitParameterConfig = {
  id: string;
  fit: boolean;
  /** Fit in log-space (guarantees positivity) — requires the parameter's
   * current value to be > 0. */
  logSpace: boolean;
  /** Starting value the fit runs from — undefined falls back to the model's
   * current live parameter value. */
  initialGuess?: number;
};

export type FitAnalysis = {
  type: "fit";
  id: number;
  idx: number;
  title: string;
  span: number;
  /** CSV column used as the time axis; unset until a file is mapped. */
  timeColumn?: string;
  targets?: FitTargetMapping[];
  fitParameters?: FitParameterConfig[];
  /** Function evaluations per chunk — see ADR 0004 §2.7 in the mxlweb repo. */
  chunkMaxfev: number;
  /** Stop once the residual norm drops to or below this. */
  targetResidualNorm: number;
  /** Hard cap on total function evaluations across every chunk — also the
   * progress bar's denominator. */
  maxFunctionEvaluations: number;
  yMax: number | undefined;
};

export type Analysis =
  SimulationAnalysis | ParameterScanAnalysis | PamAnalysis | FitAnalysis;
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
