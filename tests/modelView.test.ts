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
