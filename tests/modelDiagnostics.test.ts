import {
  Add,
  type Base,
  Mul,
  Name,
  Num,
} from "@computational-biology-aachen/mxlweb-core/mathml";
import { describe, expect, it } from "vitest";
import {
  analyzeModel,
  countBySeverity,
  nextFreeId,
  refKey,
  type ModelParts,
} from "../src/lib/modelDiagnostics";

const v = (id: string) => ({ id, value: 1, texName: id });
const p = (id: string) => ({ id, value: 1, texName: id });
const a = (id: string, fn: Base = new Num(1)) => ({ id, fn, texName: id });

function model(over: Partial<ModelParts> = {}): ModelParts {
  return { variables: [], parameters: [], assignments: [], ...over };
}

const codes = (parts: ModelParts) =>
  analyzeModel(parts).findings.map((f) => `${f.code}:${f.ref.id}`);

describe("analyzeModel", () => {
  it("reports nothing for a clean model", () => {
    const parts = model({
      parameters: [p("k")],
      assignments: [a("y", new Mul([new Name("k"), new Name("time")]))],
      readouts: [a("out", new Name("y"))],
    });
    expect(codes(parts)).toEqual([]);
  });

  it("flags undefined symbols but accepts time and NN weights", () => {
    const parts = model({
      parameters: [p("k")],
      assignments: [
        a("y", new Add([new Name("k"), new Name("time"), new Name("nn_w")])),
        a("z", new Name("ghost")),
      ],
      readouts: [a("out", new Add([new Name("y"), new Name("z")]))],
      nnWeights: new Map([["nn_w", 0.1]]),
    });
    expect(codes(parts)).toEqual(["undefined-symbol:z"]);
  });

  it("flags duplicate and empty ids across kinds", () => {
    const parts = model({
      variables: [v("x")],
      parameters: [p("x"), p(" ")],
      readouts: [a("out", new Name("x"))],
    });
    const found = codes(parts);
    expect(found).toContain("duplicate-id:x");
    expect(found).toContain("empty-id: ");
  });

  it("flags assignment cycles, including self-reference", () => {
    const parts = model({
      assignments: [
        a("a1", new Name("a2")),
        a("a2", new Name("a1")),
        a("a3", new Name("a3")),
        a("a4", new Name("a1")),
      ],
      readouts: [a("out", new Add([new Name("a3"), new Name("a4")]))],
    });
    const cycles = analyzeModel(parts)
      .findings.filter((f) => f.code === "cycle")
      .map((f) => f.ref.id)
      .sort();
    // a4 merely depends on the a1/a2 loop, so it is not itself flagged.
    expect(cycles).toEqual(["a1", "a2", "a3"]);
  });

  it("flags stoichiometry targets that are not variables", () => {
    const parts = model({
      variables: [v("x")],
      parameters: [p("k")],
      reactions: [
        {
          id: "r",
          fn: new Name("k"),
          texName: "r",
          stoichiometry: [
            { name: "x", value: new Num(-1) },
            { name: "k", value: new Num(1) },
          ],
        },
      ],
    });
    expect(codes(parts)).toEqual(["unknown-stoichiometry-target:r"]);
  });

  it("warns on unused parameters and assignments, not on NN scale params", () => {
    const parts = model({
      variables: [v("x")],
      parameters: [p("k"), p("blk_scale")],
      assignments: [a("dead")],
      nnBlocks: [
        {
          id: "blk",
          inputs: ["x"],
          layers: [],
          seed: 1,
          targetKind: "variable",
          targets: ["x"],
          trained: true,
          scale: 0.1,
          mechanism: new Name("nde"),
        },
      ],
    });
    expect(codes(parts).sort()).toEqual(["unused:dead", "unused:k"]);
  });

  it("builds usedBy/dependsOn without self edges or duplicates", () => {
    const parts = model({
      parameters: [p("k")],
      assignments: [a("y", new Mul([new Name("k"), new Name("k")]))],
      readouts: [a("out", new Name("y"))],
    });
    const { dependsOn, usedBy } = analyzeModel(parts);
    expect(dependsOn.get("assignment:y")).toEqual([
      { kind: "parameter", id: "k" },
    ]);
    expect(usedBy.get("assignment:y")).toEqual([
      { kind: "readout", id: "out" },
    ]);
    expect(refKey({ kind: "parameter", id: "k" })).toBe("parameter:k");
  });

  it("counts findings per tab", () => {
    const { findings } = analyzeModel(
      model({ assignments: [a("z", new Name("ghost"))] }),
    );
    expect(countBySeverity(findings, ["assignment"])).toEqual({
      error: 1,
      warning: 1,
    });
    expect(countBySeverity(findings, ["parameter"])).toEqual({
      error: 0,
      warning: 0,
    });
  });
});

describe("nextFreeId", () => {
  it("skips ids taken anywhere in the model", () => {
    const parts = model({
      assignments: [a("a0"), a("a2")],
      parameters: [p("a1")],
    });
    expect(nextFreeId("a", parts)).toBe("a3");
  });
});
