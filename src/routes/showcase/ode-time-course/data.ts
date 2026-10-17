import type { ParsedCsv } from "@computational-biology-aachen/mxlweb-core/fit";

/** Synthetic SIR outbreak: infected/recovered fractions every 4 days, simulated with beta = 0.35, gamma = 0.08 (the model starts at 0.2 / 0.1) plus 3% multiplicative noise. */
export const data: ParsedCsv = {
  headers: ["time", "i", "r"],
  columns: {
    time: [
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72,
      76, 80, 84, 88, 92, 96, 100,
    ],
    i: [
      0.09907, 0.2352, 0.3777, 0.4756, 0.4375, 0.3588, 0.2898, 0.2221, 0.1698,
      0.127, 0.08824, 0.06888, 0.05027, 0.03885, 0.0275, 0.02129, 0.01523,
      0.01105, 0.008465, 0.00632, 0.004776, 0.003413, 0.002586, 0.001911,
      0.00142, 0.001,
    ],
    r: [
      0, 0.05081, 0.1444, 0.2973, 0.4474, 0.5774, 0.6806, 0.7371, 0.8121,
      0.8357, 0.9045, 0.905, 0.8594, 0.9113, 0.9511, 0.999, 0.9198, 0.9658,
      0.9244, 0.9594, 0.9755, 0.9969, 0.9826, 0.9372, 1.004, 0.976,
    ],
  },
  rowCount: 26,
};
