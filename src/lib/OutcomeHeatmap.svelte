<!--
  @component

  Ecological outcome heatmap: for each point on a 2D grid of two parameter
  values, simulate the model to `analysis.tEnd`, classify the final
  Public/Cheater/Private composition into one of six ecological outcomes
  (reproducing Steps 26-29 of the tripartite-ph model's source notebook,
  `Tripartite_environmental_model_analysis(without data).ipynb`), and render
  the grid via `CategoricalHeatmap`.

  Wired into `AnalysesDashboard` as the `"outcomeHeatmap"` Analysis variant
  (see `$lib/index.ts` and `OutcomeHeatmapEditor.svelte`) exactly like
  `TimeCourse`/`ParameterScan`: the two swept parameters, their ranges, step
  counts, and `tEnd` are user-editable, every other parameter/initial
  condition uses the live model's current value (whatever the sliders above
  are set to), and `runScan` is re-run automatically on every slider commit
  via `AnalysesDashboard`'s `runAllSimulations`, not a manual button.

  Unlike the other variants this still isn't fully generic: the
  classification itself reads fixed variable names
  ("PublicMetabolizer"/"Cheater"/"PrivateMetabolizer"), hardcoded to the
  tripartite-ph model specifically — the same way `PamAnalysis` is only
  meaningful for a model exposing PPFD/Fluo-like variables.
-->
<script lang="ts">
  import { backends, type OutcomeHeatmapAnalysis } from "$lib";
  import { createWasmPool } from "$lib/stores/backends";
  import type { WorkerPool } from "$lib/stores/workerPool";
  import type { SimulationResult } from "$lib/stores/workerStore";
  import { WorkerManager } from "$lib/stores/workerStore";
  import { linspace } from "$lib/utils";
  import type { ModelBuilderBase } from "@computational-biology-aachen/mxlweb-core";
  import { onDestroy, onMount } from "svelte";
  import CategoricalHeatmap from "./CategoricalHeatmap.svelte";

  let {
    model,
    analysis,
  }: { model: ModelBuilderBase; analysis: OutcomeHeatmapAnalysis } = $props();

  const COLLAPSE_FRACTION = 0.01;
  const DOMINANCE_FRACTION = 0.5;
  const COEXISTENCE_MIN_FRACTION = 0.05;

  type Category = { label: string; color: string };

  // Colors: DESIGN.md's "Categorical Outcome Series" (registered alongside
  // Extended Series rather than reusing it — Extended Series is scoped to
  // Fit.svelte's ensemble views only).
  const CATEGORIES: Category[] = [
    {
      label: "Tripartite community collapse (< 1% in any population)",
      color: "#d3d3d3",
    },
    { label: "Public dominance (≥ 50%)", color: "#008000" },
    { label: "Cheater dominance (≥ 50%)", color: "#000000" },
    { label: "Private dominance (≥ 50%)", color: "#ffa500" },
    {
      label: "Three-way coexistence (≥ 5% each, none ≥ 50%)",
      color: "#4169e1",
    },
    { label: "Unstable coexistence", color: "#708090" },
  ];
  const COLLAPSE = 0;
  const PUBLIC_DOMINANCE = 1;
  const CHEATER_DOMINANCE = 2;
  const PRIVATE_DOMINANCE = 3;
  const COEXISTENCE = 4;
  const UNSTABLE = 5;

  function classifyOutcome(p: number, c: number, m: number): number {
    const values = [p, c, m].map((v) => Math.max(v, 0));
    const total = values[0] + values[1] + values[2];
    if (total <= 0) return COLLAPSE;

    const fractions = values.map((v) => v / total);
    if (fractions.some((f) => f < COLLAPSE_FRACTION)) return COLLAPSE;

    const dominantIdx = fractions.indexOf(Math.max(...fractions));
    if (fractions[dominantIdx] >= DOMINANCE_FRACTION) {
      return [PUBLIC_DOMINANCE, CHEATER_DOMINANCE, PRIVATE_DOMINANCE][
        dominantIdx
      ];
    }

    if (fractions.every((f) => f >= COEXISTENCE_MIN_FRACTION)) {
      return COEXISTENCE;
    }
    return UNSTABLE;
  }

  let xValues = $derived(
    linspace(analysis.xMin, analysis.xMax, analysis.xSteps),
  );
  let yValues = $derived(
    linspace(analysis.yMin, analysis.yMax, analysis.ySteps),
  );
  let xLabel = $derived(
    model.parameters.get(analysis.xParameter)?.displayName ??
      analysis.xParameter,
  );
  let yLabel = $derived(
    model.parameters.get(analysis.yParameter)?.displayName ??
      analysis.yParameter,
  );

  let grid = $state<(number | null)[][]>([]);
  let completedCount = $state(0);
  let erroredCount = $state(0);
  let totalCount = $state(0);
  let running = $state(false);

  let pool: WorkerPool | null = null;
  let unsubscribe: (() => void) | null = null;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  const requestMap = new Map<string, { i: number; j: number }>();
  // Set at the start of each runScan() call — every request from that call
  // shares the same variable ordering, so these don't need to be per-result.
  let pIdx = -1;
  let cIdx = -1;
  let mIdx = -1;

  function handleResult(data: SimulationResult) {
    if (!data.requestId) return;
    const entry = requestMap.get(data.requestId);
    if (!entry) return;
    requestMap.delete(data.requestId);

    if (data.err !== undefined) {
      erroredCount++;
      completedCount++;
      return;
    }

    const lastValues = data.values[data.values.length - 1];
    const p = lastValues[pIdx];
    const c = lastValues[cIdx];
    const m = lastValues[mIdx];

    const row = grid[entry.i];
    row[entry.j] = classifyOutcome(p, c, m);
    grid[entry.i] = [...row];
    completedCount++;

    if (completedCount >= totalCount) running = false;
  }

  function teardownPool() {
    unsubscribe?.();
    unsubscribe = null;
    pool?.terminate();
    pool = null;
  }

  export function runScan(currentModel: ModelBuilderBase) {
    teardownPool();
    requestMap.clear();

    const xs = xValues;
    const ys = yValues;
    grid = ys.map(() => xs.map(() => null));
    completedCount = 0;
    erroredCount = 0;
    totalCount = xs.length * ys.length;
    running = true;

    pool = createWasmPool(navigator.hardwareConcurrency || 4);
    unsubscribe = pool.onMessage(handleResult);

    // The compiled WAT/derived-JS source, parameter/variable names, and
    // initial values depend only on model structure, not current parameter
    // values (those travel separately as `pars`) — identical for every grid
    // point. Build them once instead of recompiling the model per point;
    // only `pars` (the two swept axis values) varies.
    const baseReq = backends.wasmRadau5.buildRequest(currentModel, {});
    const initialValues = currentModel.resolveInitialValues();
    const rhsNames = currentModel.getNames();
    pIdx = rhsNames.indexOf("PublicMetabolizer");
    cIdx = rhsNames.indexOf("Cheater");
    mIdx = rhsNames.indexOf("PrivateMetabolizer");
    const parNames = baseReq.parNames!;
    const xIdx = parNames.indexOf(analysis.xParameter);
    const yIdx = parNames.indexOf(analysis.yParameter);

    ys.forEach((yVal, i) => {
      xs.forEach((xVal, j) => {
        const requestId = WorkerManager.generateRequestId();
        requestMap.set(requestId, { i, j });

        const pars = [...baseReq.pars];
        pars[xIdx] = xVal;
        pars[yIdx] = yVal;

        pool!.postMessage({
          ...baseReq,
          pars,
          initialValues,
          rhsNames,
          allDerivedNames: [],
          selectDerivedNames: [],
          tEnd: analysis.tEnd,
          requestId,
          calculateDerived: false,
          nTimePoints: 2,
        });
      });
    });
  }

  onMount(() => runScan(model));
  onDestroy(teardownPool);
</script>

<div class="heatmap-section">
  <p class="caption">
    Community outcome at t = {analysis.tEnd} h, using the model's current parameter
    values except the two axes swept below.
  </p>
  <div class="progress">
    {#if running}
      <div class="spinner"></div>
    {/if}
    <span class="counter">
      {completedCount} / {totalCount} finished
      {#if erroredCount > 0}
        &nbsp;&middot;&nbsp;<span class="errored">{erroredCount} errored</span>
      {/if}
    </span>
  </div>
  <CategoricalHeatmap
    grid={grid}
    xValues={xValues}
    yValues={yValues}
    categories={CATEGORIES}
    xLabel={xLabel}
    yLabel={yLabel}
  />
</div>

<style>
  .heatmap-section {
    width: 100%;
  }

  .caption {
    margin: 0 0 0.75rem;
    color: var(--color-text-muted, #666);
    font-size: 0.9rem;
  }

  .progress {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .counter {
    color: var(--color-text-muted, #888);
    font-size: 0.85rem;
  }

  .errored {
    color: var(--color-warning);
  }

  .spinner {
    animation: spin 1s linear infinite;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: var(--radius-full);
    width: 20px;
    height: 20px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
</style>
