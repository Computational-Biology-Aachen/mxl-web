/**
 * Regression test for a bug caught by an independent implementation review
 * (not by the rest of the test suite, since it only manifests in a real
 * simulate/plot request, not in unit-level model-builder assertions):
 * `makeJsBackend`/`makeWasmBackend` kept sending `pars`/`parNames` built
 * from `model.resolveParameters()`/`model.getParameterNames()` (the
 * `parameters`-only subset) after `ModelBuilderBase.lower()` — which
 * `buildJs()`/`buildWat()` (called in the same `buildRequest`) compile
 * against — switched to `getAllAddressableNames()` (`parameters` then
 * `nnWeights`). For any model with an NN block, that positional-array
 * mismatch left every weight/bias binding to `undefined`, corrupting the
 * block's output and, via dx/dt coupling, the whole simulated trajectory —
 * on the primary simulate/plot path (`TimeCourse.svelte`/
 * `ParameterScan.svelte`/`Pam.svelte`), for every model this feature
 * exists to support.
 */
import {
  additiveMechanism,
  OdeModelBuilder,
  softplusActivation,
} from "@computational-biology-aachen/mxlweb-core";
import { Mul, Name } from "@computational-biology-aachen/mxlweb-core/mathml";
import { describe, expect, it } from "vitest";
import { jsRK45, wasmRadau5 } from "../src/lib/stores/backends";

function makeModelWithNNBlock(): OdeModelBuilder {
  return new OdeModelBuilder()
    .addVariable("x", { value: 1 })
    .addParameter("k", { value: 0.5 })
    .setDifferential("x", new Mul([new Name("k"), new Name("x")]))
    .addNNBlock("corr", {
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
    });
}

describe("backend buildRequest: pars/parNames stay aligned with an NN block present", () => {
  it.each([
    ["wasmRadau5", wasmRadau5],
    ["jsRK45", jsRK45],
  ])("%s: pars.length matches parNames.length", (_label, backend) => {
    const model = makeModelWithNNBlock();
    const req = backend.buildRequest(model, {});

    expect(req.parNames).toBeDefined();
    expect(req.pars).toHaveLength(req.parNames!.length);
    // Every generated weight/bias must actually be present and bound —
    // not just length-matched by coincidence.
    const weightNames = [...model.nnBlockWeightNames("corr")];
    expect(weightNames.length).toBeGreaterThan(0);
    for (const name of weightNames) {
      expect(req.parNames).toContain(name);
    }
    // Matches model.getAllAddressableNames()/resolveAllAddressableValues()
    // exactly — the array buildJs()/buildWat() actually compiled against.
    expect(req.parNames).toEqual(model.getAllAddressableNames());
    expect(req.pars).toEqual(model.resolveAllAddressableValues());
  });
});

describe("Fit.svelte-style preview request stays aligned too", () => {
  it("parNames matches a progress.params-shaped pars array (getAllAddressableNames length)", () => {
    // Mirrors Fit.svelte's previewTrajectory: pars comes from the fit
    // session's own progress.params, always getAllAddressableNames()-long.
    const model = makeModelWithNNBlock();
    const parValues = model.resolveAllAddressableValues();
    const parNames = model.getAllAddressableNames();
    expect(parValues).toHaveLength(parNames.length);
  });
});

// Documents the invariant fitTargets()/runFit() rely on: fitIdx computed
// against getAllAddressableNames() is safe to splice into combinedFitIdx,
// which is indexed against that same array everywhere else in Fit.svelte.
describe("getParameterNames() stays a positional prefix of getAllAddressableNames()", () => {
  it("ordinary parameters keep their index positions when nnWeights are appended", () => {
    const model = makeModelWithNNBlock();
    const paramNames = model.getParameterNames();
    const allNames = model.getAllAddressableNames();
    expect(allNames.slice(0, paramNames.length)).toEqual(paramNames);
  });
});
