<script lang="ts">
  import {
    Button,
    ButtonIcon as IconButton,
    Popover,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { SvelteSet } from "svelte/reactivity";
  import {
    type AssView,
    type NNBlockView,
    type Parameter,
    type ParView,
    type RxnView,
    type Variable,
    type VarView,
  } from "./modelView";
  import SliderEditor from "./SliderEditor.svelte";
  import TableSearch from "./TableSearch.svelte";
  import TexNameInput from "./TexNameInput.svelte";
  import { fuzzyMatch } from "./utils";

  // All six model views are received for a uniform table API (see
  // OdeModelEditor), but this table only reads/edits `parameters`.
  let {
    // eslint-disable-next-line no-useless-assignment, @typescript-eslint/no-unused-vars
    variables = $bindable(),
    parameters = $bindable(),
    // eslint-disable-next-line no-useless-assignment, @typescript-eslint/no-unused-vars
    assignments = $bindable(),
    // eslint-disable-next-line no-useless-assignment, @typescript-eslint/no-unused-vars
    reactions = $bindable(),
    nnBlocks = $bindable(),
    // eslint-disable-next-line no-useless-assignment, @typescript-eslint/no-unused-vars
    readouts = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
    readouts?: AssView;
  } = $props();

  function onSaveSlider(idx: number, update: Variable | Parameter) {
    parameters[idx] = update as Parameter;
    parameters = parameters.slice();
  }

  // An NN block's own `scale` must never surface as an individual row here
  // (ADR 0005 §2.1.3) — weights/biases don't need this exclusion at all
  // any more, since they live in `nnWeights`, structurally separate from
  // `parameters`, not here to begin with (mxl-schemas nn_blocks v2).
  // `parameters` itself stays the full, unfiltered array (ModelEditor.svelte
  // round-trips it through toBuilder() on Save, which needs every entry's
  // live value, fitted or not), so the exclusion happens only in what this
  // table renders/edits.
  let ownedParamIds = $derived.by(() => {
    const owned = new SvelteSet<string>();
    for (const par of parameters) {
      if (nnBlocks.some((b) => par.id === `${b.id}_scale`)) {
        owned.add(par.id);
      }
    }
    return owned;
  });

  let query = $state("");
  let filtered = $derived(
    parameters
      .map((par, idx) => ({ par, idx }))
      .filter(({ par }) => !ownedParamIds.has(par.id))
      .filter(({ par }) =>
        fuzzyMatch(defaultValue(par.displayName, par.id), query),
      ),
  );
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    aria-label="Name"
    bind:value={
      () => defaultValue(parameters[idx].displayName, parameters[idx].id),
      (value) => {
        parameters[idx].displayName = value;
        parameters[idx].texName = defaultTexName(value);
        parameters = parameters.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <TexNameInput
    bind:value={
      () => parameters[idx].texName,
      (value) => {
        parameters[idx].texName = value;
        parameters = parameters.slice();
      }
    }
  />
{/snippet}

{#snippet valueInput(idx: number)}
  <input
    type="number"
    aria-label="Initial value"
    bind:value={
      () => parameters[idx].value, (value) => (parameters[idx].value = value)
    }
  />
{/snippet}

{#snippet actions(idx: number, par: Parameter)}
  <IconButton
    icon="edit"
    popovertarget="var-editor-{idx}"
    label="Edit parameter {parameters[idx].id}"
  />
  <IconButton
    icon="close"
    label="Remove {par.id}"
    onclick={() => {
      parameters = parameters.filter((i) => {
        return i.id !== par.id;
      });
    }}
  />
{/snippet}

<div class="padding">
  <TableSearch bind:value={query} />
</div>

<div class="rtable">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Tex name</th>
        <th>Initial value</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as { par, idx } (par.id)}
        <tr>
          <td data-label="Name">
            {@render nameInput(idx)}
          </td>
          <td data-label="Tex name">
            {@render texNameInput(idx)}
          </td>
          <td data-label="Initial value">
            {@render valueInput(idx)}
          </td>
          <td
            data-label="Actions"
            class="actions"
          >
            {@render actions(idx, par)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
{#if query !== "" && filtered.length === 0}
  <p class="empty">No items match “{query}”.</p>
{/if}
<div class="padding">
  <Button
    onclick={() => {
      parameters = [
        ...parameters,
        {
          id: `p${parameters.length}`,
          value: 1.0,
          texName: `p_${parameters.length}`,
        },
      ];
    }}>add new item</Button
  >
</div>

{#each parameters as par, idx (par.id)}
  <Popover
    size="sm"
    popovertarget={`var-editor-${idx}`}
    label="Parameter {par.id}"
  >
    <SliderEditor
      target={par}
      onSave={(root) => onSaveSlider(idx, root)}
      popovertarget={`var-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  /* General */
  .padding {
    padding: 1rem;
  }

  .empty {
    padding: 0 1rem;
    color: var(--color-text-muted);
  }

  /* Input styles shared between table and cards */
  input {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  input:hover {
    border: var(--border-primary);
  }

  /* Table layout */
  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    text-align: left;
    text-indent: 0;
  }

  thead th:first-of-type {
    border-top-left-radius: 0.5rem;
  }
  thead th:last-of-type {
    border-top-right-radius: 0.5rem;
  }
  tbody tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 0.5rem;
  }
  tbody tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 0.5rem;
  }
  th:last-child,
  td:last-child {
    width: 3rem;
    text-align: center;
  }
  th {
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
  }
  tr {
    background-color: var(--color-surface);
  }
  tr {
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  tr:hover {
    background-color: lch(from var(--color-surface) calc(l - 5) c h);
  }
  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }

  /* One DOM for every width: below 48rem of *editor* width (phones, or a
     narrow popover — a viewport query was the wrong measure here) each row
     becomes a card and cells are labelled from data-label. */
  .rtable {
    container-type: inline-size;
  }

  @container (width < 48rem) {
    table,
    tbody,
    tr,
    td {
      display: block;
    }

    thead {
      display: none;
    }

    tbody {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    tr {
      box-shadow: var(--shadow-sm);
      border: var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
    }

    td:nth-child(n) {
      border-radius: 0;
      padding: 0.5rem 0;
      width: auto;
      min-width: 0;
      text-align: left;
    }

    td::before {
      display: block;
      margin-bottom: 0.25rem;
      content: attr(data-label);
      color: var(--color-text-muted);
      font-weight: var(--weight-bold);
      font-size: 0.75rem;
      line-height: 1rem;
      text-transform: uppercase;
    }

    td:last-child {
      display: flex;
      gap: 0.5rem;
      border-top: var(--border);
    }

    td:last-child::before {
      content: none;
    }

    td:last-child :global(button) {
      margin: 0;
    }
  }
</style>
