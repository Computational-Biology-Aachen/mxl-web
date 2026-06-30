<!--
 @component
 Steady-state sweep: evaluate a model's algebraic outputs across a range of one
 parameter axis. Pure closed-form evaluation — no solver, no worker.
-->

<script lang="ts">
  import type { SteadyStateAnalysis } from "$lib";
  import { LineChart } from "@computational-biology-aachen/design";
  import type { ModelBuilderBase } from "@computational-biology-aachen/mxlweb-core";

  let {
    model,
    analysis,
    lineDisplay,
  }: {
    model: ModelBuilderBase;
    analysis: SteadyStateAnalysis;
    lineDisplay: "current" | "last" | "first";
  } = $props();

  function linspace(min: number, max: number, steps: number): number[] {
    if (steps <= 1) return [min];
    return Array.from(
      { length: steps },
      (_, i) => min + (i / (steps - 1)) * (max - min),
    );
  }

  function normalizeToMax(data: number[]): number[] {
    const max = Math.max(...data);
    if (max === 0 || !isFinite(max)) return data;
    return data.map((v) => v / max);
  }

  type EvalFn = (time: number, variables: number[], pars: number[]) => number[];

  let result = $derived.by(() => {
    if (!model.parameters.has(analysis.parameter)) {
      return {
        err: `Parameter "${analysis.parameter}" does not exist in the model. Available parameters: ${[...model.parameters.keys()].join(", ")}`,
        axisValues: [] as number[],
        keys: [] as string[],
        labels: [] as string[],
        data: [] as number[][],
      };
    }
    try {
      const { allDerived } = model.buildJsDerived();
      const fn = new Function(`return ${allDerived}`)() as EvalFn;

      const parNames = model.getParameterNames();
      const axisIdx = parNames.indexOf(analysis.parameter);
      const basePars = model.resolveParameters();
      const keys = model.sortDependencies();
      const displayNames = model.getDisplayNames();
      const labels = keys.map((k) => displayNames.get(k) ?? k);

      const axisValues = linspace(analysis.min, analysis.max, analysis.steps);
      const rows = axisValues.map((x) => {
        const pars = basePars.slice();
        pars[axisIdx] = x;
        return fn(0, [], pars);
      });
      const data = keys.map((_, i) => rows.map((row) => row[i]));
      return { err: undefined, axisValues, keys, labels, data };
    } catch (e) {
      return {
        err: e instanceof Error ? e.message : "Failed to evaluate model",
        axisValues: [] as number[],
        keys: [] as string[],
        labels: [] as string[],
        data: [] as number[][],
      };
    }
  });

  let lineData = $derived.by(() => {
    const visible = (key: string) =>
      !analysis.selectedKeys || analysis.selectedKeys.includes(key);
    return {
      labels: result.axisValues,
      datasets: result.keys
        .map((key, i) => ({
          key,
          label: result.labels[i],
          data: result.data[i],
        }))
        .filter(({ key }) => visible(key))
        .map(({ key, label, data }) => ({
          label: analysis.normalizedKeys?.includes(key)
            ? `Norm(${label})`
            : label,
          data: analysis.normalizedKeys?.includes(key)
            ? normalizeToMax(data)
            : data,
        })),
    };
  });

  let axisLabel = $derived(
    model.getDisplayNames().get(analysis.parameter) ?? analysis.parameter,
  );
</script>

<div id="chart">
  {#if result.err}
    <p class="error">{result.err}</p>
  {:else}
    <LineChart
      data={lineData}
      loading={false}
      xMin={analysis.xMin}
      xMax={analysis.xMax}
      yMin={analysis.yMin}
      yMax={analysis.yMax}
      xLabel={axisLabel}
      yLabel="Output"
      lineDisplay={lineDisplay}
    />
  {/if}
</div>

<style>
  #chart {
    width: 100%;
  }

  .error {
    margin: 0;
    color: var(--color-warning, #e07b00);
    font-size: 0.875rem;
  }
</style>
