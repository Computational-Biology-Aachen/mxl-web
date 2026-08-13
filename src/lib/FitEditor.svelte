<script lang="ts">
  import type { FitAnalysis, FitTargetMapping } from "$lib";
  import type { ModelBuilderBase } from "@computational-biology-aachen/mxlweb-core";
  import {
    Button,
    InputNumber,
    InputNumberOptional,
    InputText,
    Row,
  } from "@computational-biology-aachen/design";
  import { untrack } from "svelte";
  import { parseCsvFile, type ParsedCsv } from "./csvParse";

  let {
    parent,
    model,
    onSave,
    popovertarget,
    csv = $bindable(null),
    timeColumn = $bindable(undefined),
    onTargetsChange,
  }: {
    parent: FitAnalysis;
    model: ModelBuilderBase;
    onSave: (options: FitAnalysis) => void;
    popovertarget: string;
    csv?: ParsedCsv | null;
    timeColumn?: string;
    /** Column->key mapping produced by auto-mapping an uploaded file. */
    onTargetsChange: (targets: FitTargetMapping[]) => void;
  } = $props();

  let title = $derived(parent.title);
  let chunkMaxfev = $derived(parent.chunkMaxfev);
  let maxFunctionEvaluations = $derived(parent.maxFunctionEvaluations);
  let targetResidualNorm = $derived(parent.targetResidualNorm);
  let yMax: number = $derived(parent.yMax || 10);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);

  // ---- Data upload + column mapping --------------------------------------

  // Candidate fit targets: state variables + derived quantities — the same
  // source Fit.svelte uses for its column-mapping table.
  let candidateKeys = $derived([
    ...model.getNames().map((key) => ({ key, kind: "state" as const })),
    ...model
      .sortDependencies()
      .map((key) => ({ key, kind: "derived" as const })),
  ]);

  function autoMapColumns() {
    if (!csv) return;
    if (!timeColumn) {
      const guess = csv.headers.find((h) => /^t(ime)?$/i.test(h));
      timeColumn = guess ?? csv.headers[0];
    }
    const displayNames = model.getDisplayNames();
    const mapped: FitTargetMapping[] = [];
    for (const header of csv.headers) {
      if (header === timeColumn) continue;
      const match = candidateKeys.find(
        ({ key }) =>
          key.toLowerCase() === header.toLowerCase() ||
          (displayNames.get(key) ?? "").toLowerCase() === header.toLowerCase(),
      );
      if (match) {
        mapped.push({ column: header, key: match.key, kind: match.kind });
      }
    }
    onTargetsChange(mapped);
  }

  let fileInput = $state<HTMLInputElement | null>(null);
  let fileError = $state<string | null>(null);

  async function handleFile(event: Event) {
    fileError = null;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      csv = await parseCsvFile(file);
      autoMapColumns();
    } catch (e) {
      fileError = e instanceof Error ? e.message : "Failed to parse file";
    }
    input.value = "";
  }
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <h2>Edit fit</h2>
  <Button
    onclick={() =>
      onSave({
        ...parent,
        title,
        chunkMaxfev,
        maxFunctionEvaluations,
        targetResidualNorm,
        yMax: yMaxAuto ? undefined : yMax,
      })}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<h3>Data</h3>
<Row
  align="center"
  gap="0.5rem"
>
  <Button
    variant="secondary"
    onclick={() => fileInput?.click()}>Upload data</Button
  >
  {#if csv}
    <span class="file-info"
      >{csv.rowCount} rows, {csv.headers.length} columns</span
    >
  {/if}
</Row>
<input
  type="file"
  accept=".csv,.tsv,.txt"
  bind:this={fileInput}
  onchange={handleFile}
  style="display:none"
/>
{#if fileError}
  <p class="error">{fileError}</p>
{/if}

<InputText
  id="fit-name"
  label="Name: "
  bind:value={title}
/>
<InputNumber
  id="chunk-maxfev"
  label="Function evaluations per progress update: "
  bind:value={chunkMaxfev}
/>
<InputNumber
  id="max-fev"
  label="Maximum total function evaluations: "
  bind:value={maxFunctionEvaluations}
/>
<InputNumber
  id="target-residual"
  label="Stop once residual norm reaches: "
  bind:value={targetResidualNorm}
/>

<h3>Plot options</h3>
<InputNumberOptional
  id="fit-yMax"
  valueLabel="yMax: "
  condLabel="Auto?"
  bind:value={yMax}
  bind:condition={yMaxAuto}
/>

<style>
  .file-info {
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .error {
    margin: 0;
    color: var(--error, #dc2626);
    font-size: 0.875rem;
  }
</style>
