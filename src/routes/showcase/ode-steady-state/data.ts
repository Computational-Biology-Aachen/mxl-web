import type { ParsedCsv } from "@computational-biology-aachen/mxlweb-core/fit";

/** Synthetic dose-response: steady-state mRNA and protein at nine inducer levels, from K_ind = 2, v_max = 1.5 (the model starts at 5 / 1) plus 4% multiplicative noise. */
export const data: ParsedCsv = {
  headers: ["inducer", "mRNA", "protein"],
  columns: {
    inducer: [0, 0.25, 0.5, 1, 2, 4, 8, 16, 32],
    mRNA: [0.1019, 0.2136, 0.5637, 1.533, 3.806, 6.13, 6.844, 7.22, 7.24],
    protein: [3.988, 8.595, 22.6, 65.06, 152.4, 233.3, 299.9, 301.7, 291.7],
  },
  rowCount: 9,
};
