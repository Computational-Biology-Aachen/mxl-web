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

export type Analysis = SimulationAnalysis | ParameterScanAnalysis | PamAnalysis;
export type Analyses = Analysis[];
