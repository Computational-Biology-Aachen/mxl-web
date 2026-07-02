<script lang="ts">
  import { base } from "$app/paths";
  import type { SteadyStateAnalysis } from "$lib";
  import {
    Accordion2 as Accordion,
    Button,
    ButtonMenu,
    ButtonMenuItem,
    Div,
    DynBoxRow,
    Icon,
    Math,
    Pair,
    Popover,
    Row,
    Slider2 as Slider,
    type Box,
  } from "@computational-biology-aachen/design";
  import {
    defaultValue,
    SteadyStateModelBuilder,
  } from "@computational-biology-aachen/mxlweb-core";
  import type { Snippet } from "svelte";
  import { tick } from "svelte";
  import SteadyStateModelEditor from "./SteadyStateModelEditor.svelte";
  import SteadyStateSweep from "./SteadyStateSweep.svelte";
  import SteadyStateSweepEditor from "./SteadyStateSweepEditor.svelte";

  let {
    children,
    name,
    initModel,
    analyses = $bindable(),
    equationsOpen = true,
  }: {
    name: string;
    initModel: () => SteadyStateModelBuilder;
    analyses: SteadyStateAnalysis[];
    children?: Snippet;
    equationsOpen?: boolean;
  } = $props();

  let model = $derived(initModel());

  let analysisById = $derived.by(() => {
    // transient lookup rebuilt by this derived, not reactive state
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const map = new Map<number, SteadyStateAnalysis>();
    for (const analysis of analyses) {
      map.set(analysis.id, analysis);
    }
    return map;
  });

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

  function savePython() {
    downloadText(
      model.buildPython([]),
      `${name.replace(/[^A-Za-z0-9]/g, "_")}.py`,
      "text/x-python",
    );
  }

  function saveMxlweb() {
    downloadText(
      model.buildMxlweb(),
      `${name.replace(/[^A-Za-z0-9]/g, "_")}.ts`,
      "text/typescript",
    );
  }
  function saveMxlJson() {
    downloadText(
      model.buildMxlJson(name),
      `${name.replace(/[^A-Za-z0-9]/g, "_")}.json`,
      "text/json",
    );
  }

  async function handleAdd(box: Box) {
    const firstParam = model.parameters.keys().next().value ?? "";
    const newSweep: SteadyStateAnalysis = {
      type: "steadyState",
      id: box.id,
      idx: analyses.length,
      title: "Sweep",
      span: box.span,
      parameter: firstParam,
      min: 0,
      max: 10,
      steps: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      lineDisplay: "current",
    };
    analyses = [...analyses, newSweep];
    await tick();
    analysisEditorEls[box.id]?.showPopover();
  }
</script>

<Div>
  <Row
    stack
    justify="between"
    gap="0.5rem"
  >
    <Pair>
      <a
        class="light"
        style="font-size: var(--text-sm);"
        href={`${base}/models`}>Models</a
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
      <ButtonMenu label="Save">
        <ButtonMenuItem onclick={saveMxlJson}>mxl.json</ButtonMenuItem>
        <ButtonMenuItem onclick={saveMxlweb}>mxlweb</ButtonMenuItem>
        <ButtonMenuItem onclick={savePython}>Python</ButtonMenuItem>
      </ButtonMenu>
      <Button onclick={() => (model = initModel())}>Reset</Button>
      <Button popovertarget="model-editor">Edit model</Button>
    </Pair>
  </Row>
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
      <h3>Parameters</h3>
    </Pair>
    <div class="grid-row">
      {#each parSliders as par (par.id)}
        <Slider
          name={defaultValue(par.name, par.id)}
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

  <Pair>
    <Icon>analytics</Icon>
    <h3>Sweeps</h3>
  </Pair>

  <DynBoxRow
    items={analyses}
    onAdd={handleAdd}
    onRemove={(box) => {
      analyses = analyses.filter((a) => a.id !== box.id);
    }}
  >
    {#snippet children({ box })}
      {@const analysis = analysisById.get(box.id)}
      {#if analysis}
        <SteadyStateSweep
          model={model}
          analysis={analysis}
          lineDisplay={analysis.lineDisplay}
        />
      {/if}
    {/snippet}
  </DynBoxRow>
</Div>

<Popover
  size="lg"
  popovertarget="model-editor"
>
  <SteadyStateModelEditor
    parent={model}
    popovertarget="model-editor"
    onSave={(edited) => {
      model = edited;
    }}
  />
</Popover>

{#each analyses as analysis (analysis.id)}
  <Popover
    size="sm"
    popovertarget={`analysis-editor-${analysis.id}`}
    bind:el={analysisEditorEls[analysis.id]}
  >
    <SteadyStateSweepEditor
      parent={analysis}
      model={model}
      onSave={(updated) => {
        analyses = analyses.map((a) => (a.id === analysis.id ? updated : a));
      }}
      popovertarget={`analysis-editor-${analysis.id}`}
    />
  </Popover>
{/each}

<style>
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
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
    padding: 1.5rem;
    width: 100%;

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
    color: var(--color-primary);
  }
</style>
