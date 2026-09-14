/**
 * Regression coverage for a data-loss bug found (twice) during ADR 0005
 * review: ModelEditor/OdeModelEditor round-trip the live model through
 * ModelView/OdeModelView.toBuilder() on every Save. A fitted NN block
 * weight's (or the block's own trainable scale factor's) current value must
 * survive that round-trip untouched, not be reset to a fresh
 * Glorot-initialized/default one — see modelView.ts's own comments on
 * `toBuilder()`'s nnBlocks-before-parameters ordering and on why
 * ModelEditor.svelte's `parameters`/`reactions` arrays must stay unfiltered
 * even though the corresponding table UI must not render block-owned rows.
 *
 * mxl-schemas nn_blocks v2 split weights (nnWeights, never `parameters`)
 * from scale (still an ordinary Parameter) — this file now exercises both
 * halves of that split.
 */
import {
  KineticModelBuilder,
  additiveMechanism,
  softplusActivation,
  OdeModelBuilder,
  type NNBlockConfig,
} from "@computational-biology-aachen/mxlweb-core";
import { Num } from "@computational-biology-aachen/mxlweb-core/mathml";
import { describe, expect, it } from "vitest";
import {
  ModelView,
  OdeModelView,
  type NNBlockView,
} from "../src/lib/modelView";

function makeBlock(): NNBlockConfig {
  return {
    inputs: ["x"],
    layers: [
      { type: "dense", width: 2, activation: softplusActivation() },
      { type: "dense", width: 1 },
    ],
    seed: 1,
    targetKind: "variable",
    targets: ["x"],
    trained: true,
    scale: 0.1,
    mechanism: additiveMechanism(),
  };
}

// Mirrors ModelEditor.svelte's own `parameters`/`nnBlocks`/`nnWeights`
// derivations exactly (full parameters, no NN-block exclusion) so this test
// fails the same way the app would if that filtering crept back in.
function viewArraysFrom(builder: KineticModelBuilder | OdeModelBuilder) {
  const parameters = [...builder.parameters.entries()].map(([id, p]) => ({
    ...p,
    id,
    texName: p.texName ?? id,
  }));
  const nnBlocks: NNBlockView = [...builder.nnBlocks.entries()].map(
    ([id, b]) => ({ ...b, id }),
  );
  const nnWeights = new Map(builder.nnWeights.entries());
  return { parameters, nnBlocks, nnWeights };
}

describe("ModelView.toBuilder round-trips fitted NN block weights", () => {
  it("preserves a manually-set weight value and a manually-set scale, not a fresh re-init", () => {
    const builder = new KineticModelBuilder()
      .addVariable("x", { value: 1 })
      .addNNBlock("corr", makeBlock());

    const weightName = [...builder.nnWeights.keys()].find((n) =>
      n.startsWith("corr_w"),
    )!;
    // Simulate Fit.svelte's applyFittedParameters writing a fitted value
    // straight into the live model — both a weight (nnWeights) and the
    // block's own trainable scale factor (still a Parameter;
    // TableNNBlocks.svelte's "Output scale" field edits the exact same way
    // once the parameter exists).
    builder.nnWeights = builder.nnWeights.set(weightName, 42);
    const originalScale = builder.parameters.get("corr_scale")!;
    builder.parameters = builder.parameters.set("corr_scale", {
      ...originalScale,
      value: 7,
    });

    const { parameters, nnBlocks, nnWeights } = viewArraysFrom(builder);
    const variables = [...builder.variables.entries()].map(([id, v]) => ({
      ...v,
      id,
      texName: v.texName ?? id,
    }));
    const assignments = [...builder.assignments.entries()].map(([id, a]) => ({
      ...a,
      id,
      texName: a.texName ?? id,
    }));
    const reactions = [...builder.reactions.entries()].map(([id, r]) => ({
      ...r,
      id,
      texName: r.texName ?? id,
    }));

    const rebuilt = new ModelView(
      parameters,
      variables,
      assignments,
      reactions,
      nnBlocks,
      nnWeights,
    ).toBuilder();

    expect(rebuilt.nnWeights.get(weightName)).toBe(42);
    expect(rebuilt.parameters.get("corr_scale")?.value).toBe(7);
    // Weights never leak into parameters — only scale does.
    expect(rebuilt.parameters.has(weightName)).toBe(false);
  });
});

// Regression test: switching a block's "Corrects" selector (targetKind) in
// TableNNBlocks.svelte resizes its output layer to match the new target
// count (2 variables vs. 3 reactions here) — every reactive rebuild before
// the next explicit Save (ModelEditor.svelte's `modelView.toBuilder()`)
// must see that resized config paired with the *stale*, pre-resize
// nnWeights snapshot, since nnWeights only updates on Save. addNNBlock's
// trainedWeights contract requires an exact key-set match and throws
// otherwise; toBuilder()/trainedWeightsFor() must instead fall back to a
// fresh re-init (matching updateNNBlock's own established behavior for an
// architecture change), so the live preview keeps showing the correction
// term with new weights rather than throwing and losing it entirely.
describe("ModelView.toBuilder survives an architecture change since the last Save", () => {
  it("switching targetKind (and thus the output layer width) doesn't throw, and the correction term survives with freshly re-initialized weights", () => {
    const builder = new KineticModelBuilder()
      .addVariable("x", { value: 1 })
      .addVariable("y", { value: 1 })
      .addReaction("v1", {
        fn: new Num(0),
        stoichiometry: [{ name: "x", value: new Num(-1) }],
      })
      .addReaction("v2", {
        fn: new Num(0),
        stoichiometry: [{ name: "y", value: new Num(-1) }],
      })
      .addReaction("v3", {
        fn: new Num(0),
        stoichiometry: [{ name: "x", value: new Num(1) }],
      })
      .addNNBlock("corr", {
        inputs: ["x", "y"],
        layers: [
          { type: "dense", width: 2, activation: softplusActivation() },
          { type: "dense", width: 2 },
        ],
        seed: 1,
        targetKind: "variable",
        targets: ["x", "y"],
        trained: true,
        scale: 0.1,
        mechanism: additiveMechanism(),
      });

    const { parameters, nnBlocks, nnWeights } = viewArraysFrom(builder);
    const variables = [...builder.variables.entries()].map(([id, v]) => ({
      ...v,
      id,
      texName: v.texName ?? id,
    }));
    const reactions = [...builder.reactions.entries()].map(([id, r]) => ({
      ...r,
      id,
      texName: r.texName ?? id,
    }));

    // Simulate the $effect after the user flips "Corrects" to "Reactions":
    // targets/output width resize to the model's 3 reactions, but
    // `nnWeights` above is still the stale 2-output snapshot.
    const switched: NNBlockView = nnBlocks.map((b) => ({
      ...b,
      targetKind: "reaction",
      targets: ["v1", "v2", "v3"],
      layers: [b.layers[0], { ...b.layers[1], width: 3 }],
    }));

    let rebuilt!: KineticModelBuilder;
    expect(() => {
      rebuilt = new ModelView(
        parameters,
        variables,
        [],
        reactions,
        switched,
        nnWeights,
      ).toBuilder();
    }).not.toThrow();

    expect(rebuilt.nnBlockWeightNames("corr").size).toBeGreaterThan(0);
    expect(rebuilt.buildTex()).toContain("NN_{corr}");
  });
});

describe("OdeModelView.toBuilder round-trips fitted NN block weights", () => {
  it("preserves a manually-set weight value and a manually-set scale, not a fresh re-init", () => {
    const builder = new OdeModelBuilder()
      .addVariable("x", { value: 1 })
      .addNNBlock("corr", makeBlock());

    const weightName = [...builder.nnWeights.keys()].find((n) =>
      n.startsWith("corr_w"),
    )!;
    builder.nnWeights = builder.nnWeights.set(weightName, 42);
    const originalScale = builder.parameters.get("corr_scale")!;
    builder.parameters = builder.parameters.set("corr_scale", {
      ...originalScale,
      value: 7,
    });

    const { parameters, nnBlocks, nnWeights } = viewArraysFrom(builder);
    const variables = [...builder.variables.entries()].map(([id, v]) => ({
      ...v,
      id,
      texName: v.texName ?? id,
      differential: builder.differentials.get(id)!,
    }));
    const assignments = [...builder.assignments.entries()].map(([id, a]) => ({
      ...a,
      id,
      texName: a.texName ?? id,
    }));

    const rebuilt = new OdeModelView(
      parameters,
      variables,
      assignments,
      nnBlocks,
      nnWeights,
    ).toBuilder();

    expect(rebuilt.nnWeights.get(weightName)).toBe(42);
    expect(rebuilt.parameters.get("corr_scale")?.value).toBe(7);
    expect(rebuilt.parameters.has(weightName)).toBe(false);
  });
});

// mxlweb-core issue #6: TableAssignment.svelte's readout toggle moves an
// entry between the model's `assignments` and `readouts` views — this
// exercises that both views' `toBuilder()` actually wires a `readouts`
// entry back onto the rebuilt model, not just an `assignments` one.
describe("ModelView/OdeModelView.toBuilder round-trip readouts", () => {
  it("KineticModelBuilder: a readout survives the view round-trip", () => {
    const builder = new KineticModelBuilder()
      .addVariable("x", { value: 1 })
      .addReadout("ro", { fn: new Num(1), displayName: "my readout" });

    const readouts = [...builder.readouts.entries()].map(([id, r]) => ({
      ...r,
      id,
      texName: r.texName ?? id,
    }));
    const variables = [...builder.variables.entries()].map(([id, v]) => ({
      ...v,
      id,
      texName: v.texName ?? id,
    }));

    const rebuilt = new ModelView(
      [],
      variables,
      [],
      [],
      [],
      new Map(),
      readouts,
    ).toBuilder();

    expect(rebuilt.readouts.get("ro")?.displayName).toBe("my readout");
    expect(rebuilt.assignments.has("ro")).toBe(false);
  });

  it("OdeModelBuilder: a readout survives the view round-trip", () => {
    const builder = new OdeModelBuilder()
      .addVariable("x", { value: 1 })
      .addReadout("ro", { fn: new Num(1), displayName: "my readout" });

    const readouts = [...builder.readouts.entries()].map(([id, r]) => ({
      ...r,
      id,
      texName: r.texName ?? id,
    }));
    const variables = [...builder.variables.entries()].map(([id, v]) => ({
      ...v,
      id,
      texName: v.texName ?? id,
      differential: builder.differentials.get(id) ?? new Num(0),
    }));

    const rebuilt = new OdeModelView(
      [],
      variables,
      [],
      [],
      new Map(),
      readouts,
    ).toBuilder();

    expect(rebuilt.readouts.get("ro")?.displayName).toBe("my readout");
    expect(rebuilt.assignments.has("ro")).toBe(false);
  });
});
