import { SteadyStateModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import {
  Add,
  Divide,
  Exp,
  Minus,
  Mul,
  Name,
  Num,
  Sqrt,
} from "@computational-biology-aachen/mxlweb-core/mathml";

export function initModel(): SteadyStateModelBuilder {
  return new SteadyStateModelBuilder()
    .addParameter("q", {
      value: 0.7,
      unit: "dimensionless",
      texName: "q",
    })
    .addParameter("U", {
      value: 250.0,
      unit: "umol m^-2 s^-1",
      texName: "U",
    })
    .addParameter("R1", {
      value: 0.2,
      unit: "dimensionless",
      texName: "R1",
    })
    .addParameter("R2", {
      value: 0.5,
      unit: "dimensionless",
      texName: "R2",
    })
    .addParameter("q_r", {
      value: 1.0,
      unit: "dimensionless",
      texName: "q\\_r",
    })
    .addParameter("a_q", {
      value: 0.0,
      unit: "dimensionless",
      texName: "a\\_q",
    })
    .addParameter("b_s", {
      value: 0.0,
      unit: "(umol m^-2 s^-1)^-1",
      texName: "b\\_s",
    })
    .addParameter("c_s", {
      value: 0.0,
      unit: "dimensionless",
      texName: "c\\_s",
    })
    .addParameter("alpha", {
      value: 0.85,
      unit: "dimensionless",
      texName: "alpha",
    })
    .addParameter("PAR", {
      value: 588.2352941176471,
      unit: "umol m^-2 s^-1",
      texName: "PAR",
    })
    .addParameter("T", {
      value: 298.15,
      unit: "K",
      texName: "T",
    })
    .addParameter("T0", {
      value: 298.15,
      unit: "K",
      texName: "T0",
    })
    .addParameter("E_T", {
      value: 0.0,
      unit: "K",
      texName: "E\\_T",
    })
    .addAssignment("ft", {
      fn: new Mul([
        new Sqrt(new Divide([new Name("T0"), new Name("T")]), new Num(2)),
        new Exp(
          new Mul([
            new Name("E_T"),
            new Add([
              new Divide([new Num(1.0), new Name("T0")]),
              new Minus([new Divide([new Num(1.0), new Name("T")])]),
            ]),
          ]),
        ),
      ]),
      unit: "dimensionless",
      texName: "ft",
    })
    .addAssignment("fq", {
      fn: new Divide([
        new Add([new Num(1.0), new Name("a_q")]),
        new Add([new Num(1.0), new Mul([new Name("a_q"), new Name("q")])]),
      ]),
      unit: "dimensionless",
      texName: "fq",
    })
    .addAssignment("fs", {
      fn: new Divide([
        new Num(1.0),
        new Add([
          new Num(1.0),
          new Mul([
            new Name("c_s"),
            new Exp(
              new Minus([
                new Mul([new Name("PAR"), new Name("alpha"), new Name("b_s")]),
              ]),
            ),
          ]),
        ]),
      ]),
      unit: "dimensionless",
      texName: "fs",
    })
    .addAssignment("J_PSII", {
      fn: new Divide([
        new Mul([
          new Num(2.0),
          new Name("U"),
          new Name("fq"),
          new Name("fs"),
          new Name("ft"),
          new Name("q"),
          new Add([new Name("q_r"), new Minus([new Name("q")])]),
        ]),
        new Add([
          new Name("q_r"),
          new Mul([
            new Name("q"),
            new Add([
              new Num(-1.0),
              new Name("R1"),
              new Mul([
                new Num(2.0),
                new Name("R2"),
                new Name("fq"),
                new Name("fs"),
              ]),
            ]),
          ]),
        ]),
      ]),
      unit: "umol m^-2 s^-1",
      texName: "J\\_PSII",
    })
    .addAssignment("h_cyt", {
      fn: new Divide([
        new Mul([new Name("q"), new Add([new Num(1.0), new Name("a_q")])]),
        new Add([new Num(1.0), new Mul([new Name("a_q"), new Name("q")])]),
      ]),
      unit: "dimensionless",
      texName: "h\\_cyt",
    })
    .addAssignment("h_pqh2", {
      fn: new Divide([
        new Mul([new Num(0.5), new Name("J_PSII")]),
        new Mul([
          new Name("U"),
          new Name("fq"),
          new Name("fs"),
          new Name("ft"),
          new Name("q"),
        ]),
      ]),
      unit: "dimensionless",
      texName: "h\\_pqh2",
    })
    .addAssignment("h_pq", {
      fn: new Add([new Num(1.0), new Minus([new Name("h_pqh2")])]),
      unit: "dimensionless",
      texName: "h\\_pq",
    });
}
