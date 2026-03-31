<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "./chartjs/LineChart.svelte";
  import type { ModelBuilder } from "./model-editor/modelBuilder";
  import type { ParameterScanAnalysis } from "$lib";
  import { WorkerManager } from "./stores/workerStore";
  import { pyWorkerPool } from "./stores/workerPool";

  let {
    model,
    analysis,
  }: {
    model: ModelBuilder;
    analysis: ParameterScanAnalysis;
  } = $props();

  type ScanResult = {
    paramValues: number[];
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };

  let loading = $state(true);
  let err = $state<string | undefined>(undefined);
  let scanResult = $state<ScanResult | null>(null);

  // Batch tracking — plain (non-reactive) fields, safe to mutate in handlers
  let activeScanId = 0;
  let pendingCount = 0;
  let completedCount = 0;
  let activeResults: (number[] | null)[] = [];
  let activeParamValues: number[] = [];
  let activeScanModel: ModelBuilder | null = null;
  // requestId → { paramIdx, scanId }
  const requestMap = new Map<string, { paramIdx: number; scanId: number }>();

  function linspace(min: number, max: number, steps: number): number[] {
    if (steps <= 1) return [min];
    return Array.from(
      { length: steps },
      (_, i) => min + (i / (steps - 1)) * (max - min),
    );
  }

  function evaluateAssignments(
    model: ModelBuilder,
    finalVarValues: number[],
    paramValue: number,
  ): { name: string; value: number }[] {
    const varKeys = [...model.variables.keys()];
    const context: Record<string, number> = {};

    varKeys.forEach((k, i) => {
      context[k] = finalVarValues[i];
    });
    for (const [k, par] of model.parameters) {
      context[k] = k === analysis.parameter ? paramValue : par.value;
    }

    const results: { name: string; value: number }[] = [];
    const order = model.sortDependencies();

    for (const name of order) {
      if (model.assignments.has(name)) {
        const assign = model.assignments.get(name)!;
        const jsExpr = assign.fn.toJs();
        const keys = Object.keys(context);
        const vals = Object.values(context);
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function(...keys, `return ${jsExpr};`);
          const value = fn(...vals) as number;
          context[name] = value;
          results.push({ name, value });
        } catch {
          results.push({ name, value: NaN });
        }
      }
    }
    return results;
  }

  function finalizeScan(model: ModelBuilder) {
    const paramValues = activeParamValues;
    const varKeys = [...model.variables.keys()];
    const assignKeys = [...model.assignments.keys()];

    // varResults[varIdx][paramIdx]
    const varResults: number[][] = varKeys.map((_, varIdx) =>
      activeResults.map((r) => (r ? r[varIdx] : NaN)),
    );

    // assignResults[assignIdx][paramIdx]
    const assignResults: number[][] = assignKeys.map(() =>
      new Array(analysis.steps).fill(NaN),
    );

    activeResults.forEach((finalVarValues, paramIdx) => {
      if (!finalVarValues) return;
      const assigns = evaluateAssignments(
        model,
        finalVarValues,
        paramValues[paramIdx],
      );
      assigns.forEach(({ name, value }) => {
        const assignIdx = assignKeys.indexOf(name);
        if (assignIdx >= 0) {
          assignResults[assignIdx][paramIdx] = value;
        }
      });
    });

    scanResult = {
      paramValues,
      labels: varKeys.map((k) => model.variables.get(k)?.displayName ?? k),
      datasets: [
        ...varKeys.map((k, i) => ({
          label: model.variables.get(k)?.displayName ?? k,
          data: varResults[i],
        })),
        ...assignKeys.map((k, i) => ({
          label: model.assignments.get(k)?.displayName ?? k,
          data: assignResults[i],
        })),
      ],
    };
    loading = false;
  }

  export function runScan(currentModel: ModelBuilder) {
    loading = true;
    err = undefined;

    activeScanId++;
    const scanId = activeScanId;
    const paramValues = linspace(analysis.min, analysis.max, analysis.steps);
    activeParamValues = paramValues;
    activeResults = new Array(analysis.steps).fill(null);
    activeScanModel = currentModel;
    pendingCount = analysis.steps;
    completedCount = 0;

    const varKeys = [...currentModel.variables.keys()];

    paramValues.forEach((paramValue, idx) => {
      const clonedModel = currentModel.clone();
      const existingParam = clonedModel.parameters.get(analysis.parameter);
      if (existingParam) {
        clonedModel.parameters = clonedModel.parameters.set(analysis.parameter, {
          ...existingParam,
          value: paramValue,
        });
      }

      const requestId = WorkerManager.generateRequestId();
      requestMap.set(requestId, { paramIdx: idx, scanId });

      pyWorkerPool.postMessage({
        model: `${clonedModel.buildPython([])}\nmodel`,
        initialValues: varKeys.map((k) => clonedModel.variables.get(k)!.value),
        tEnd: 1000,
        pars: [],
        requestId,
      });
    });
  }

  let lineData = $derived.by(() => {
    if (!scanResult) return { labels: [], datasets: [] };
    return {
      labels: scanResult.paramValues as number[],
      datasets: scanResult.datasets,
    };
  });

  onMount(() => {
    const unsub = pyWorkerPool.onMessage((data) => {
      if (!data.requestId) return;
      const entry = requestMap.get(data.requestId);
      if (!entry) return;
      requestMap.delete(data.requestId);

      if (entry.scanId !== activeScanId) return; // stale batch

      if (data.message !== undefined) {
        err = data.message;
        loading = false;
        return;
      }

      // Last time point = steady-state approximation
      const lastValues = data.values[data.values.length - 1];
      activeResults[entry.paramIdx] = lastValues;
      completedCount++;

      if (completedCount === pendingCount && activeScanModel) {
        finalizeScan(activeScanModel);
      }
    });

    runScan(model);

    return () => {
      unsub();
    };
  });
</script>

<div>
  {#if err}
    <span>{err}</span>
  {:else}
    <LineChart
      data={lineData}
      loading={loading}
      yMax={analysis.yMax}
      xLabel={analysis.parameter}
      yLabel="Steady-state value"
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
