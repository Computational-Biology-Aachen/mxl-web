// place files you want to import through the `$lib` alias in this folder.

export type Analysis = {
  id: number;
  idx: number;
  title: string;
  span: number;
  tEnd: number;
  yMax: number | undefined;
  timeoutInSeconds: number;
};

export type Analyses = Analysis[];
