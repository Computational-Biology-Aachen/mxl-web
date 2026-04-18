// place files you want to import through the `$lib` alias in this folder.
import type { PamPhase } from "./simulations/protocol";

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
  method: string;
  showDerived?: boolean;
  selectedKeys?: string[];
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
  method: string;
  showDerived?: boolean;
  selectedKeys?: string[];
};

export type PamAnalysis = {
  type: "pam";
  id: number;
  idx: number;
  title: string;
  span: number;
  yMax: number | undefined;
  timeoutInSeconds: number;
  method: string;
  pamProtocol: PamPhase[];
  showDerived?: boolean;
  selectedKeys?: string[];
};

export type Analysis = SimulationAnalysis | ParameterScanAnalysis | PamAnalysis;
export type Analyses = Analysis[];
