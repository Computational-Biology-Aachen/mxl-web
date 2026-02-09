<script lang="ts">
  import {
    stoichToTex,
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
  } from "./model";

  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
  } = $props();

  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Base, Name, Num } from "$lib/mathml";
  import EqEditorPopover from "$lib/model-editor/EqEditorPopover.svelte";
  import StoichEditorPopover from "./StoichEditorPopover.svelte";

  function onSaveEq(idx: number, fn: Base) {
    reactions[idx][1].fn = fn;
    reactions = reactions.slice();
  }
  function onSaveStoichs(idx: number, stoichiometry: Stoichiometry) {
    reactions[idx][1].stoichiometry = stoichiometry;
    reactions = reactions.slice();
  }

  let varNames = $derived(variables.map((el) => el[0]));
  let argNames = $derived.by(() => {
    return [...variables.map((el) => el[0]), ...assignments.map((el) => el[0])];
  });
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Rate law</th>
      <th>Stoichiometry</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each reactions as [name], idx}
      <tr>
        <td> <input type="text" bind:value={reactions[idx][0]} /> </td>
        <td>
          <div class="row">
            <Math
              tex={reactions[idx][1].fn.toTex()}
              display={true}
              fontSize={"0.75rem"}
            />
            <button class="edit" popovertarget="eq-editor-{idx}">
              <Icon>edit</Icon>
            </button>
          </div>
        </td>
        <td>
          <div class="row">
            <Math
              tex={stoichToTex(reactions[idx][1].stoichiometry)}
              display={true}
              fontSize={"0.75rem"}
            />
            <button class="edit" popovertarget="stoich-editor-{idx}">
              <Icon>edit</Icon>
            </button>
          </div>
        </td>
        <td>
          <button
            class="close"
            onclick={() => {
              reactions = reactions.filter((i) => {
                return i[0] !== name;
              });
            }}><Icon>close</Icon></button
          >
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="padding">
  <button
    class="add"
    onclick={() => {
      reactions = [
        ...reactions,
        [
          `v${reactions.length}`,
          {
            fn: new Name("Default"),
            stoichiometry: [{ name: "Default", value: new Num(1.0) }],
          },
        ],
      ];
    }}
    >+ add new item
  </button>
</div>

{#each reactions as [name, { fn, stoichiometry }], idx}
  <div popover id="eq-editor-{idx}">
    <EqEditorPopover
      root={fn}
      variableNames={argNames}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
    />
  </div>
  <div popover id="stoich-editor-{idx}">
    <StoichEditorPopover
      {stoichiometry}
      variableNames={varNames}
      onSave={(stoichs) => onSaveStoichs(idx, stoichs)}
      popovertarget={`stoich-editor-${idx}`}
    />
  </div>
{/each}

<style>
  /* General */
  .padding {
    padding: 1rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }

  [popover] {
    position: absolute;
    inset: unset;
    top: 4rem;
    left: 4rem;
    width: calc(100% - 8rem);
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Table */
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
    background-color: var(--bg-l1);
  }
  tr:hover {
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: lch(from var(--bg-l1) calc(l - 5) c h);
  }
  table input {
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  table input:hover {
    border: 1px solid var(--primary);
  }

  /* Close button */
  button.close {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 5rem;
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    font-size: 0.75rem;
  }
  button.close:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
  }

  /* Add button */
  button.add {
    cursor: pointer;
    margin: 0rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    padding: 0 1rem;
    width: 10rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.add:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
  }

  /* Edit button */
  button.edit {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 5rem;
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    font-size: 0.75rem;
  }
  button.edit:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
  }
</style>
