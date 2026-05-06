<!--
 @component
 Pulse amplitude modulation (PAM) scan
-->

<script lang="ts">
  import { onMount } from "svelte";

  import PamChart, { type PhaseRegion } from "../chartjs/PamChart.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import {
    WorkerManager,
    type SimulationError,
    type SimulationResult,
  } from "../stores/workerStore";
  import { arrayColumn } from "../utils";
  import { expandProtocol, type PamGroup } from "./protocol";
  import SimErrDisplay from "./SimErrDisplay.svelte";

  let {
    model,
    pamProtocol,
    yMax,
    timeoutInSeconds,
    method,
    showDerived = false,
    selectedKeys = undefined,
    normalizedKeys = undefined,
    nTimePoints,
    lineDisplay,
  }: {
    model: ModelBuilder;
    pamProtocol: PamGroup[];
    yMax?: number | undefined;
    timeoutInSeconds: number;
    method: string;
    showDerived?: boolean;
    selectedKeys?: string[];
    normalizedKeys?: string[];
    nTimePoints: number;
    lineDisplay: "current" | "last" | "first";
  } = $props();

  const pyWorker = pyWorkerPool;

  let loading = $state(true);
  let err: SimulationError | undefined = $state(undefined);
  let result = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });

  let currentRequestId = $state<string | null>(null);
  let timeoutInSecondsId = $state<ReturnType<typeof setTimeout> | null>(null);

  export function runSimulation(model: ModelBuilder) {
    loading = true;
    const requestId = WorkerManager.generateRequestId();
    currentRequestId = requestId;

    if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    err = undefined;

    timeoutInSecondsId = setTimeout(() => {
      if (currentRequestId === requestId) {
        err = {
          message: "Simulation timed out",
          hints: ["Increase the simulation timeout via the ≡ menu"],
        };
        loading = false;
      }
    }, timeoutInSeconds * 1000);

    const protocol = expandProtocol(pamProtocol);

    const order = model.sortDependencies();
    const allDerived = new Set(order);
    const derivedSelection =
      showDerived && selectedKeys
        ? selectedKeys.filter((k) => allDerived.has(k))
        : undefined;
    const built = model.buildPython(["PPFD"], derivedSelection);

    pyWorker.postMessage({
      model: `${built}\nmodel`,
      derived: `${built}\nderived`,
      initialValues: model.resolveInitialValues(),
      names: model.getNames(),
      derivedSelection: derivedSelection ? derivedSelection : order,
      tEnd: 0,
      pars: [],
      method: method,
      requestId: requestId,
      protocol: protocol,
      calculateDerived: showDerived,
      nTimePoints: nTimePoints,
    });
  }

  let maxPFD = $derived(
    Math.max(0, ...pamProtocol.flatMap((g) => g.steps.map((s) => s.pfd))),
  );

  function stepColor(pfd: number): string {
    if (pfd === 0) return "rgba(0,0,0,0.08)";
    const ratio = maxPFD > 0 ? pfd / maxPFD : 1;
    const alpha = (0.06 + ratio * 0.24).toFixed(2);
    return `rgba(255,200,0,${alpha})`;
  }

  let phaseRegions = $derived.by(() => {
    const regions: PhaseRegion[] = [];
    let t = 0;
    for (const group of pamProtocol) {
      for (let i = 0; i < group.repetitions; i++) {
        for (const step of group.steps) {
          const end = t + step.duration;
          regions.push({ start: t, end, color: stepColor(step.pfd) });
          t = end;
        }
      }
    }
    return regions;
  });

  function normalizeToMax(data: number[]): number[] {
    const max = Math.max(...data);
    if (max === 0 || !isFinite(max)) return data;
    return data.map((v) => v / max);
  }

  function maybeNormalize(key: string, data: number[]): number[] {
    return normalizedKeys?.includes(key) ? normalizeToMax(data) : data;
  }
  function maybeRename(key: string): string {
    return normalizedKeys?.includes(key) ? `Norm(${key})` : key;
  }

  function interpolateAtIndices(
    indices: number[],
    values: number[],
    length: number,
    method: "linear" | "akima" = "linear",
  ): number[] {
    const out = new Array(length).fill(NaN);
    if (indices.length === 0) return out;

    if (method === "akima") {
      // Akima piecewise cubic interpolation.
      // Uses x = indices, y = values as knots.
      const n = indices.length;

      if (n === 1) {
        for (let k = 0; k < length; k++) out[k] = values[0];
        return out;
      }

      // segment slopes m[i] = (y[i+1]-y[i]) / (x[i+1]-x[i])
      const m: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        m.push((values[i + 1] - values[i]) / (indices[i + 1] - indices[i]));
      }

      // extend m with 2 virtual slopes on each side (mirror extrapolation)
      const mExt = [
        2 * m[0] - m[1],
        2 * m[0] - m[1],
        ...m,
        2 * m[n - 2] - m[n - 3 < 0 ? 0 : n - 3],
        2 * m[n - 2] - m[n - 3 < 0 ? 0 : n - 3],
      ];

      // knot tangents t[i]
      const t: number[] = [];
      for (let i = 0; i < n; i++) {
        const mi = mExt; // alias
        const w1 = Math.abs(mi[i + 3] - mi[i + 2]);
        const w2 = Math.abs(mi[i + 1] - mi[i]);
        const denom = w1 + w2;
        t.push(
          denom < 1e-14
            ? (mi[i + 1] + mi[i + 2]) / 2
            : (w1 * mi[i + 1] + w2 * mi[i + 2]) / denom,
        );
      }

      // fill each segment with a Hermite cubic
      for (let p = 0; p < n - 1; p++) {
        const x0 = indices[p];
        const x1 = indices[p + 1];
        const y0 = values[p];
        const y1 = values[p + 1];
        const t0 = t[p];
        const t1 = t[p + 1];
        const h = x1 - x0;
        const end = p === n - 2 ? x1 : x1 - 1;
        for (let k = x0; k <= end; k++) {
          const u = (k - x0) / h;
          const u2 = u * u;
          const u3 = u2 * u;
          // Hermite basis
          const h00 = 2 * u3 - 3 * u2 + 1;
          const h10 = u3 - 2 * u2 + u;
          const h01 = -2 * u3 + 3 * u2;
          const h11 = u3 - u2;
          out[k] = h00 * y0 + h10 * h * t0 + h01 * y1 + h11 * h * t1;
        }
      }
      return out;
    }

    // linear (default)
    indices.forEach((i, j) => {
      out[i] = values[j];
    });
    for (let p = 0; p < indices.length - 1; p++) {
      const i0 = indices[p];
      const i1 = indices[p + 1];
      const v0 = values[p];
      const v1 = values[p + 1];
      for (let k = i0 + 1; k < i1; k++) {
        out[k] = v0 + ((v1 - v0) * (k - i0)) / (i1 - i0);
      }
    }
    return out;
  }

  function findPeaks(data: number[], minProminence: number): number[] {
    const n = data.length;
    const candidates: number[] = [];
    for (let i = 1; i < n - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) candidates.push(i);
    }
    return candidates.filter((peakIdx) => {
      const peakVal = data[peakIdx];
      let leftMin = peakVal;
      for (let j = peakIdx - 1; j >= 0; j--) {
        if (data[j] > peakVal) break;
        leftMin = Math.min(leftMin, data[j]);
      }
      let rightMin = peakVal;
      for (let j = peakIdx + 1; j < n; j++) {
        if (data[j] > peakVal) break;
        rightMin = Math.min(rightMin, data[j]);
      }
      return peakVal - Math.max(leftMin, rightMin) >= minProminence;
    });
  }

  let lineData = $derived.by(() => {
    const nVars = model.variables.size;
    const visible = (key: string) =>
      !selectedKeys || selectedKeys.includes(key);

    const varDatasets = [...model.variables.keys()]
      .map((name, idx) => ({ name, idx }))
      .filter(({ name }) => visible(name))
      .map(({ name, idx }) => ({
        label: maybeRename(model.variables.get(name)?.displayName ?? name),
        data: maybeNormalize(name, arrayColumn(result.values, idx) as number[]),
      }));

    if (!showDerived)
      return { labels: result.time as number[], datasets: varDatasets };

    const allDerived = model.sortDependencies();
    const activeDerived = selectedKeys
      ? allDerived.filter((k) => selectedKeys.includes(k))
      : allDerived;

    const derivedDatasets = activeDerived.map((name, i) => ({
      label: maybeRename(
        model.assignments.get(name)?.displayName ??
          model.reactions.get(name)?.displayName ??
          name,
      ),
      data: maybeNormalize(
        name,
        arrayColumn(result.values, nVars + i) as number[],
      ),
    }));

    const showNpq = !selectedKeys || selectedKeys.includes("NPQ");
    const fluoIdx = activeDerived.indexOf("Fluo");

    let npqDataset: { label: string; data: number[] } | undefined;
    if (fluoIdx !== -1 && showNpq) {
      const fluoNorm = normalizeToMax(
        arrayColumn(result.values, nVars + fluoIdx) as number[],
      );
      const peakIndices = findPeaks(fluoNorm, 0.2);
      const Fm = peakIndices.map((i) => fluoNorm[i]);
      const Fm0 = Fm[0] ?? NaN;

      console.log("fluoNorm", fluoNorm);
      console.log("Found peaks", peakIndices);
      const npqAtPeak = Fm.map((fm) => (Fm0 - fm) / fm);
      const npqValues = interpolateAtIndices(
        peakIndices,
        npqAtPeak,
        fluoNorm.length,
        "akima",
      );

      console.log("npqValues", npqValues);
      npqDataset = { label: "NPQ", data: npqValues };
    }

    return {
      labels: result.time as number[],
      datasets: [
        ...varDatasets,
        ...derivedDatasets,
        ...(npqDataset ? [npqDataset] : []),
      ],
    };
  });

  function handleResults(data: SimulationResult) {
    if (data.requestId === currentRequestId) {
      if (timeoutInSecondsId) {
        clearTimeout(timeoutInSecondsId);
        timeoutInSecondsId = null;
      }

      if (data.err !== undefined) {
        err = data.err;
        loading = false;
      } else {
        result = { time: data.time, values: data.values };
        loading = false;
      }
    }
  }

  onMount(() => {
    const unsub = pyWorker.onMessage(handleResults);
    runSimulation(model);
    return () => {
      unsub();
      if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    };
  });
</script>

<div>
  {#if err}
    <SimErrDisplay err={err} />
  {:else}
    <PamChart
      data={lineData}
      loading={loading}
      yMax={yMax}
      phases={phaseRegions}
      lineDisplay={lineDisplay}
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
