import { SteadyStateModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  LessEqual,
  Min,
  Minus,
  Mul,
  Name,
  Num,
  Piecewise,
} from "@computational-biology-aachen/mxlweb-core/mathml";

function initModel(): SteadyStateModelBuilder {
  // (1 + 3·α) — the triose-phosphate term, with α = 0.
  const alphaTerm = new Add([
    new Num(1),
    new Mul([new Num(3), new Name("alpha")]),
  ]);

  return new SteadyStateModelBuilder()
    .addParameter("Ci", {
      value: 500,
      displayName: "Ci",
      texName: "C_i",
    })
    .addParameter("vcmax", { value: 80, texName: "V_{cmax}" })
    .addParameter("kc", { value: 259, texName: "K_c" })
    .addParameter("ko", { value: 179, texName: "K_o" })
    .addParameter("ccp", { value: 38.6, texName: "\\Gamma^*" })
    .addParameter("rl", { value: 1, texName: "R_d" })
    .addParameter("alpha", { value: 0, texName: "\\alpha" })
    .addParameter("o", {
      value: 210,
      displayName: "O₂",
      texName: "O",
      slider: { min: "100", max: "500", step: "1" },
    })
    .addParameter("j", {
      value: 124,
      displayName: "J",
      texName: "J",
      slider: { min: "50", max: "300", step: "1" },
    })
    .addParameter("tp", {
      value: 15,
      displayName: "Tp",
      texName: "T_p",
      slider: { min: "5", max: "50", step: "1" },
    })
    .addAssignment("wc", {
      displayName: "Wc",
      texName: "W_c",
      fn: new Divide([
        new Mul([new Name("Ci"), new Name("vcmax")]),
        new Add([
          new Name("Ci"),
          new Mul([
            new Name("kc"),
            new Add([new Num(1), new Divide([new Name("o"), new Name("ko")])]),
          ]),
        ]),
      ]),
    })
    .addAssignment("wj", {
      displayName: "Wj",
      texName: "W_j",
      fn: new Divide([
        new Mul([new Name("Ci"), new Name("j")]),
        new Add([
          new Mul([new Num(4), new Name("Ci")]),
          new Mul([new Num(8), new Name("ccp")]),
        ]),
      ]),
    })
    .addAssignment("wp", {
      displayName: "Wp",
      texName: "W_p",
      fn: new Piecewise([
        // Below the compensation point the TPU rate is unbounded; cap it.
        new Num(100),
        new LessEqual([new Name("Ci"), new Mul([new Name("ccp"), alphaTerm])]),
        new Divide([
          new Mul([new Num(3), new Name("Ci"), new Name("tp")]),
          new Minus([new Name("Ci"), new Mul([new Name("ccp"), alphaTerm])]),
        ]),
      ]),
    })
    .addAssignment("vc", {
      displayName: "Vc",
      texName: "V_c",
      fn: new Min([new Name("wc"), new Name("wj"), new Name("wp")]),
    })
    .addAssignment("an", {
      displayName: "An",
      texName: "A_n",
      fn: new Minus([
        new Mul([
          new Name("vc"),
          new Minus([
            new Num(1),
            new Divide([new Name("ccp"), new Name("Ci")]),
          ]),
        ]),
        new Name("rl"),
      ]),
    });
}
