// place files you want to import through the `$lib` alias in this folder.

export type SimulationAnalysis = {
  type: "simulation";
  id: number;
  idx: number;
  title: string;
  span: number;
  tEnd: number;
  xMin: number | undefined;
  yMax: number | undefined;
  timeoutInSeconds: number;
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
  xMin: number | undefined;
  yMax: number | undefined;
  timeoutInSeconds: number;
};

export type Analysis = SimulationAnalysis | ParameterScanAnalysis;
export type Analyses = Analysis[];
