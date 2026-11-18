<script lang="ts">
  import {
    Button,
    ButtonIcon as IconButton,
    InputNumber,
    Math,
    Popover,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Base } from "@computational-biology-aachen/mxlweb-core/mathml";
  import EqEditor from "./EqEditor.svelte";
  import {
    idToTex,
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type Variable,
    type VarView,
  } from "./modelView";
  import SliderEditor from "./SliderEditor.svelte";
  import TableSearch from "./TableSearch.svelte";
  import TexNameInput from "./TexNameInput.svelte";
  import { fuzzyMatch } from "./utils";

  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
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

  function onSaveSlider(idx: number, update: Variable) {
    variables[idx] = update;
    variables = variables.slice();
  }

  function onSaveInitialAssignment(idx: number, fn: Base) {
    variables[idx] = { ...variables[idx], value: fn };
    variables = variables.slice();
  }

  let texNames = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  let query = $state("");
  let filtered = $derived(
    variables
      .map((vari, idx) => ({ vari, idx }))
      .filter(({ vari }) =>
        fuzzyMatch(defaultValue(vari.displayName, vari.id), query),
      ),
  );
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    aria-label="Name"
    bind:value={
      () => defaultValue(variables[idx].displayName, variables[idx].id),
      (value) => {
        variables[idx].displayName = value;
        variables[idx].texName = defaultTexName(value);
        variables = variables.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <TexNameInput
    bind:value={
      () => variables[idx].texName,
      (value) => {
        variables[idx].texName = value;
        variables = variables.slice();
      }
    }
  />
{/snippet}

{#snippet valueInput(idx: number)}
  {#if variables[idx].value instanceof Base}
    <div class="row">
      <Math
        tex={variables[idx].value.toTex(texNames)}
        display={true}
        fontSize="0.75rem"
      />
      <IconButton
        icon="edit"
        popovertarget="var-ia-editor-{idx}"
        label="Edit initial assignment of {variables[idx].id}"
      />
    </div>
  {:else}
    <InputNumber
      id="var-{idx}"
      border="transparent"
      bind:value={
        () => variables[idx].value as number,
        (value) => {
          variables[idx].value = value;
          variables = variables.slice();
        }
      }
    />
  {/if}
{/snippet}

{#snippet actions(idx: number, vari: Variable)}
  <IconButton
    icon="edit"
    popovertarget="var-editor-{idx}"
    label="Edit variable {variables[idx].id}"
  />
  <IconButton
    icon="close"
    label="Remove {vari.id}"
    onclick={() => {
      variables = variables.filter((i) => {
        return i.id !== vari.id;
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
      {#each filtered as { vari, idx } (vari.id)}
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
            {@render actions(idx, vari)}
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
      variables = [
        ...variables,
        {
          id: `x${variables.length}`,
          value: 1.0,
          texName: `x${variables.length}`,
        },
      ];
    }}>add new item</Button
  >
</div>

{#each variables as vari, idx (vari.id)}
  <Popover
    size="sm"
    popovertarget={`var-editor-${idx}`}
    label="Variable {vari.id}"
  >
    <SliderEditor
      target={vari}
      onSave={(root) => onSaveSlider(idx, root)}
      popovertarget={`var-editor-${idx}`}
    />
  </Popover>
{/each}

{#each variables as vari, idx (vari.id)}
  {#if vari.value instanceof Base}
    <Popover
      size="md"
      popovertarget={`var-ia-editor-${idx}`}
      label="Initial assignment of {vari.id}"
    >
      <EqEditor
        root={vari.value}
        variables={variables}
        parameters={parameters}
        assignments={assignments}
        reactions={reactions}
        nnBlocks={nnBlocks}
        onSave={(fn) => onSaveInitialAssignment(idx, fn)}
        popovertarget={`var-ia-editor-${idx}`}
      />
    </Popover>
  {/if}
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

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
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

  tr {
    display: table-row;
    background-color: var(--color-surface);
  }

  th {
    display: table-cell;
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }

  td {
    display: table-cell;
    padding: 1rem 1.5rem;
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
