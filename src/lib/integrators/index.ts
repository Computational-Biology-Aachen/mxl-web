export type Model = (
  t: number,
  y: Array<number>,
  pars: Array<number>,
) => Array<number>;


export interface Integration {
  time: number[];
  values: number[][];
  err?: string;
}


export interface BaseIntegratorKws {
  initialValues: Array<number>;
  pars: number[];
  tEnd: number;
  // Optional ones
  tStart?: number;
}

export type Integrator = (model: Model, options: BaseIntegratorKws) => Integration
