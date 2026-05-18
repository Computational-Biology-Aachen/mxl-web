<script lang="ts">
  import { base } from "$app/paths";
  import {
    backends,
    type Analyses,
    type PamAnalysis,
    type ParameterScanAnalysis,
    type SimulationAnalysis,
  } from "$lib";
  import Accordion from "$lib/Accordion.svelte";
  import ModelEditButton from "$lib/buttons/ModelEditButton.svelte";
  import ResetButton from "$lib/buttons/ResetButton.svelte";
  import DynBoxRow, { type Box } from "$lib/DynBoxRow.svelte";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import Pair from "$lib/Pair.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import PamSimulator from "$lib/simulations/Pam.svelte";
  import ParameterScanSimulator from "$lib/simulations/ParameterScan.svelte";
  import Simulator from "$lib/simulations/TimeCourse.svelte";
  import Slider from "$lib/Slider.svelte";
  import type { Snippet } from "svelte";
  import { tick } from "svelte";
  import Popover from "../Popover.svelte";
  import PamScanEditor from "../simulations/PamScanEditor.svelte";
  import ParameterScanEditor from "../simulations/ParameterScanEditor.svelte";
  import AnalysisEditor from "../simulations/TimeCourseEditor.svelte";
  import ModelEditor from "./ModelEditor.svelte";
  import { defaultValue } from "./modelUtils";
  import { modelToSbml, sbmlToModel } from "./sbml";

  let {
    children,
    name,
    initModel,
    analyses = $bindable(),
    equationsOpen = true,
  }: {
    name: string;
    initModel: () => ModelBuilder;
    analyses: Analyses;
    children?: Snippet;
    equationsOpen?: boolean;
  } = $props();

  let model = $derived(initModel());

  let simulatorRefs = $state<Record<number, Simulator | undefined>>({});
  let scannerRefs = $state<Record<number, ParameterScanSimulator | undefined>>(
    {},
  );
  let pamRefs = $state<Record<number, PamSimulator | undefined>>({});

  let analysisById = $derived.by(() => {
    const map = new Map<number, Analyses[number]>();
    for (const analysis of analyses) {
      map.set(analysis.id, analysis);
    }
    return map;
  });

  function runAllSimulations() {
    for (const simulator of Object.values(simulatorRefs)) {
      simulator?.runSimulation(model);
    }
    for (const scanner of Object.values(scannerRefs)) {
      scanner?.runScan(model);
    }
    for (const pam of Object.values(pamRefs)) {
      pam?.runSimulation(model);
    }
  }

  let parSliders = $derived.by(() => {
    return model.parameters
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([id, par]) => {
        return {
          id: id,
          name: par.displayName,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });

  let varSliders = $derived.by(() => {
    return model.variables
      .entries()
      .filter(
        (k) => k[1].slider !== undefined && typeof k[1].value === "number",
      )
      .map(([id, par]) => {
        return {
          id: id,
          name: par.displayName,
          init: par.value as number,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });

  let fileInput = $state<HTMLInputElement | null>(null);
  let loadError = $state<string | null>(null);
  let pendingBox = $state<Box | null>(null);
  let saveMenuOpen = $state(false);
  let saveMenuWrapEl = $state<HTMLDivElement | null>(null);
  let saveMenuCloseTimeout: ReturnType<typeof setTimeout> | undefined;
  let pickerEl = $state<HTMLDivElement | null | undefined>(null);
  let analysisEditorEls = $state<
    Record<number, HTMLDivElement | null | undefined>
  >({});

  function downloadText(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveModel() {
    downloadText(
      modelToSbml(model, name),
      `${name.replace(/[^A-Za-z0-9]/g, "_")}.sbml`,
      "application/xml",
    );
  }

  function savePython() {
    downloadText(
      model.buildPython([]),
      `${name.replace(/[^A-Za-z0-9]/g, "_")}.py`,
      "text/x-python",
    );
  }

  async function handleFileLoad(event: Event) {
    loadError = null;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const loaded = sbmlToModel(text);
      model = loaded;
      runAllSimulations();
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Failed to load model";
    }
    input.value = "";
  }

  function handleAdd(box: Box) {
    pendingBox = box;
    pickerEl?.showPopover();
  }

  function addTimeCourse(box: Box) {
    const newAnalysis: SimulationAnalysis = {
      type: "simulation",
      id: box.id,
      idx: analyses.length,
      title: "New",
      span: box.span,
      tEnd: 10,
      yMin: undefined,
      yMax: undefined,
      xMin: undefined,
      xMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 100,
      lineDisplay: "current",
    };
    analyses = [...analyses, newAnalysis];
  }

  function addPam(box: Box) {
    const newPam: PamAnalysis = {
      type: "pam",
      id: box.id,
      idx: analyses.length,
      title: "PAM",
      span: box.span,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      nTimePoints: 100,
      lineDisplay: "current",
      pamProtocol: [
        {
          steps: [
            { pfd: 0, duration: 2 },
            { pfd: 5000, duration: 0.8 },
          ],
          repetitions: 1,
        },
        {
          steps: [
            { pfd: 0, duration: 27.2 },
            { pfd: 5000, duration: 0.8 },
          ],
          repetitions: 1,
        },
        {
          steps: [
            { pfd: 100, duration: 84.2 },
            { pfd: 5000, duration: 0.8 },
          ],
          repetitions: 3,
        },
        {
          steps: [{ pfd: 100, duration: 14.2 }],
          repetitions: 1,
        },
      ],
    };
    analyses = [...analyses, newPam];
  }

  function addParameterScan(box: Box) {
    const firstParam = model.parameters.keys().next().value ?? "";
    const newScan: ParameterScanAnalysis = {
      type: "parameterScan",
      id: box.id,
      idx: analyses.length,
      title: `Parameter Scan`,
      span: 3,
      parameter: firstParam,
      min: 0,
      max: 10,
      steps: 20,
      tEnd: 10_000,
      tolerance: 1e-4,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
      backend: backends.wasmRadau5,
      lineDisplay: "current",
    };
    analyses = [...analyses, newScan];
  }

  function closeSaveMenu() {
    if (saveMenuCloseTimeout !== undefined) {
      clearTimeout(saveMenuCloseTimeout);
      saveMenuCloseTimeout = undefined;
    }
    saveMenuOpen = false;
  }

  function openSaveMenu() {
    if (saveMenuCloseTimeout !== undefined) {
      clearTimeout(saveMenuCloseTimeout);
      saveMenuCloseTimeout = undefined;
    }
    saveMenuOpen = true;
  }

  function scheduleCloseSaveMenu() {
    if (saveMenuCloseTimeout !== undefined) return;
    saveMenuCloseTimeout = setTimeout(() => {
      saveMenuCloseTimeout = undefined;
      saveMenuOpen = false;
    }, 100);
  }

  function toggleSaveMenu() {
    if (saveMenuOpen) {
      closeSaveMenu();
      return;
    }
    saveMenuOpen = !saveMenuOpen;
  }

  function handleDocumentClick(event: MouseEvent) {
    if (!saveMenuOpen) return;
    const target = event.target as Node | null;
    if (target && !saveMenuWrapEl?.contains(target)) {
      closeSaveMenu();
    }
  }
</script>

<RowApart>
  <Pair>
    <a
      class="light"
      style="font-size: var(--text-sm);"
      href={`${base}/`}>Models</a
    >
    <span
      class="light"
      style="font-size: var(--text-sm);">/</span
    >
    <span
      class="bold"
      style="font-size: var(--text-sm);">{name}</span
    >
  </Pair>
  <Pair justify="end">
    <button
      class="secondary"
      onclick={() => fileInput?.click()}>Load</button
    >
    <div
      class="save-menu-wrap"
      role="presentation"
      bind:this={saveMenuWrapEl}
      onmouseenter={openSaveMenu}
      onmouseleave={scheduleCloseSaveMenu}
    >
      <button
        class="secondary save-trigger"
        onclick={toggleSaveMenu}
      >
        <span>Save</span>
        <Icon>arrow_drop_down</Icon>
      </button>
      {#if saveMenuOpen}
        <div class="save-menu">
          <button
            class="save-option"
            onclick={() => {
              saveModel();
              closeSaveMenu();
            }}
          >
            SBML
          </button>
          <button
            class="save-option"
            onclick={() => {
              savePython();
              closeSaveMenu();
            }}
          >
            Python
          </button>
        </div>
      {/if}
    </div>
    <ResetButton
      onclick={() => {
        model = initModel();
        runAllSimulations();
      }}
    />
    <ModelEditButton popovertarget="model-editor" />
  </Pair>
</RowApart>
<input
  type="file"
  accept=".sbml,.xml"
  bind:this={fileInput}
  onchange={handleFileLoad}
  style="display:none"
/>
{#if loadError}
  <p class="load-error">{loadError}</p>
{/if}

<svelte:document onclick={handleDocumentClick} />

<Popover
  size="xs"
  popovertarget="add-analysis-picker"
  bind:el={pickerEl}
>
  <p class="picker-title">Add analysis</p>
  <button
    class="picker-option"
    onclick={async () => {
      if (!pendingBox) return;
      addTimeCourse(pendingBox);
      const id = pendingBox.id;
      pendingBox = null;
      pickerEl?.hidePopover();
      await tick();
      analysisEditorEls[id]?.showPopover();
    }}
  >
    <Icon>show_chart</Icon>
    Time Course
  </button>
  <button
    class="picker-option"
    onclick={async () => {
      if (!pendingBox) return;
      addParameterScan(pendingBox);
      const id = pendingBox.id;
      pendingBox = null;
      pickerEl?.hidePopover();
      await tick();
      analysisEditorEls[id]?.showPopover();
    }}
  >
    <Icon>stacked_line_chart</Icon>
    Parameter Scan
  </button>
  <button
    class="picker-option"
    onclick={async () => {
      if (!pendingBox) return;
      addPam(pendingBox);
      const id = pendingBox.id;
      pendingBox = null;
      pickerEl?.hidePopover();
      await tick();
      analysisEditorEls[id]?.showPopover();
    }}
  >
    <Icon>pulse_alert</Icon>
    PAM Fluorescence
  </button>
</Popover>

{#if children}
  {@render children()}
{/if}

<Accordion bind:open={equationsOpen}>
  {#snippet header()}
    <Icon>function</Icon>
    <h3>Model Equations</h3>
  {/snippet}
  <div class="centered">
    <Math
      tex={model.buildTex()}
      fontSize="0.9rem"
      display
    />
  </div>
</Accordion>

{#if parSliders.length > 0}
  <Pair>
    <Icon>tune</Icon>
    <h3>Simulation parameters</h3>
  </Pair>
  <div class="grid-row">
    {#each parSliders as par (par.id)}
      <Slider
        name={defaultValue(par.name, par.id)}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.parameters.get(par.id)!.value;
          },
          (val) => {
            let old = model.parameters.get(par.id)!;

            model.parameters = model.parameters.set(par.id, {
              ...old,
              value: val,
            });
          }
        }
        min={par.min}
        max={par.max}
        step={par.step}
      />
    {/each}
  </div>
{/if}

{#if varSliders.length > 0}
  <Pair>
    <Icon>tune</Icon>
    <h3>Initial conditions</h3>
  </Pair>
  <div class="grid-row">
    {#each varSliders as vari (vari.id)}
      <Slider
        name={defaultValue(vari.name, vari.id)}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.variables.get(vari.id)!.value as number;
          },
          (val) => {
            let old = model.variables.get(vari.id)!;
            model.variables = model.variables.set(vari.id, {
              ...old,
              value: val,
            });
          }
        }
        min={vari.min}
        max={vari.max}
        step={vari.step}
      />
    {/each}
  </div>
{/if}

<Pair>
  <Icon>analytics</Icon>
  <h3>Analyses</h3>
</Pair>

<DynBoxRow
  items={analyses}
  onAdd={handleAdd}
  onRemove={(box) => {
    analyses = analyses.filter((a) => a.id !== box.id);
    delete simulatorRefs[box.id];
    simulatorRefs = { ...simulatorRefs };
    delete scannerRefs[box.id];
    scannerRefs = { ...scannerRefs };
    delete pamRefs[box.id];
    pamRefs = { ...pamRefs };
  }}
>
  {#snippet children({ box })}
    {@const analysis = analysisById.get(box.id)}
    {#if analysis}
      {#if analysis.type === "simulation"}
        <Simulator
          bind:this={simulatorRefs[box.id]}
          model={model}
          tEnd={analysis.tEnd}
          yMax={analysis.yMax}
          timeoutInSeconds={analysis.timeoutInSeconds}
          backend={analysis.backend}
          showDerived={analysis.showDerived ?? false}
          selectedKeys={analysis.selectedKeys}
          normalizedKeys={analysis.normalizedKeys}
          nTimePoints={analysis.nTimePoints ?? 100}
          lineDisplay={analysis.lineDisplay}
        />
      {:else if analysis.type === "parameterScan"}
        <ParameterScanSimulator
          bind:this={scannerRefs[box.id]}
          model={model}
          analysis={analysis}
          tEnd={analysis.tEnd}
          backend={analysis.backend}
          showDerived={analysis.showDerived ?? false}
          selectedKeys={analysis.selectedKeys}
          normalizedKeys={analysis.normalizedKeys}
          nTimePoints={1000}
          lineDisplay={analysis.lineDisplay}
        />
      {:else if analysis.type === "pam"}
        <PamSimulator
          bind:this={pamRefs[box.id]}
          model={model}
          pamProtocol={analysis.pamProtocol}
          ppfdKey={analysis.ppfdKey}
          fluoKey={analysis.fluoKey}
          yMax={analysis.yMax}
          timeoutInSeconds={analysis.timeoutInSeconds}
          backend={analysis.backend}
          showDerived={analysis.showDerived ?? false}
          selectedKeys={analysis.selectedKeys}
          normalizedKeys={analysis.normalizedKeys}
          nTimePoints={analysis.nTimePoints ?? 100}
          lineDisplay={analysis.lineDisplay}
        />
      {/if}
    {/if}
  {/snippet}
</DynBoxRow>

<Popover
  size="lg"
  popovertarget="model-editor"
>
  <ModelEditor
    parent={model}
    popovertarget="model-editor"
    onSave={(edited) => {
      model = edited;
      runAllSimulations();
    }}
  />
</Popover>

{#each analyses as analysis (analysis.id)}
  <Popover
    size="sm"
    popovertarget={`analysis-editor-${analysis.id}`}
    bind:el={analysisEditorEls[analysis.id]}
  >
    {#if analysis.type === "simulation"}
      <AnalysisEditor
        parent={analysis}
        model={model}
        onSave={(updated) => {
          analyses = analyses.map((a) =>
            a.id === analysis.id ? updated : a,
          ) as Analyses;
          simulatorRefs[analysis.id]?.runSimulation(model);
        }}
        popovertarget={`analysis-editor-${analysis.id}`}
      />
    {:else if analysis.type === "parameterScan"}
      <ParameterScanEditor
        parent={analysis}
        model={model}
        onSave={(updated) => {
          analyses = analyses.map((a) =>
            a.id === analysis.id ? updated : a,
          ) as Analyses;
          scannerRefs[analysis.id]?.runScan(model);
        }}
        popovertarget={`analysis-editor-${analysis.id}`}
      />
    {:else if analysis.type === "pam"}
      <PamScanEditor
        parent={analysis}
        model={model}
        onSave={(updated) => {
          analyses = analyses.map((a) =>
            a.id === analysis.id ? updated : a,
          ) as Analyses;
          pamRefs[analysis.id]?.runSimulation(model);
        }}
        popovertarget={`analysis-editor-${analysis.id}`}
      />
    {/if}
  </Popover>
{/each}

<style>
  button.secondary {
    cursor: pointer;
    border: 1px solid var(--primary);
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0 1rem;
    height: 2rem;
    color: var(--primary);
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.secondary:hover {
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
  }
  .load-error {
    margin: 0;
    color: var(--error, #dc2626);
    font-size: 0.875rem;
  }
  .save-menu-wrap {
    display: inline-block;
    position: relative;
  }
  .save-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .save-menu {
    display: grid;
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    gap: 0.25rem;
    z-index: 20;
    box-shadow: var(--shadow);
    border: var(--border);
    border-radius: var(--border-radius);
    background: var(--bg-l1);
    padding: 0.35rem;
    min-width: 10rem;
  }
  .save-option {
    cursor: pointer;
    border: 0;
    border-radius: calc(var(--border-radius) - 0.125rem);
    background: transparent;
    padding: 0.6rem 0.75rem;
    color: var(--text);
    font-size: 0.875rem;
    text-align: left;
  }
  .save-option:hover {
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
  }
  .centered {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .grid-row {
    display: flex;
    flex-direction: column;
    align-items: inherit;
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background-color: var(--bg-l1);
    padding: 1.5rem;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      align-items: center;
    }
  }
  .bold {
    font-weight: 600;
  }
  .light {
    color: var(--slate-400);
    font-weight: 400;
  }
  a.light:hover {
    color: var(--primary);
  }
  .picker-title {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
  }
  .picker-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: background 0.15s ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--border-radius);
    background: transparent;
    padding: 0.75rem 1rem;
    width: 100%;
    font-size: 0.9rem;
    text-align: left;
  }
  .picker-option:hover {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
  }
</style>
