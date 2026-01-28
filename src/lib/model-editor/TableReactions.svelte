<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Base, Minus, Mul, Name, Num } from "$lib/mathml";
  import EqEditorPopover from "$lib/model-editor/EqEditorPopover.svelte";
  import StoichEditorPopover from "./StoichEditorPopover.svelte";

  import { stoichsToTex, type Stoichs } from "./utils";

  let variables = ["x", "y", "x_{1}", "x_{total}", "k_{cat}", "e_{0}"];

  let derived: Array<{
    name: string;
    fn: Base;
    stoichs: Array<{ name: string; value: Num }>;
  }> = $state([
    {
      name: "x_{2}",
      fn: new Minus([new Name("x_{total}"), new Name("x_{1}")]),
      stoichs: [
        { name: "x", value: new Num(-1.0) },
        { name: "y", value: new Num(1.0) },
      ],
    },
    {
      name: "V_{max}",
      fn: new Mul([new Name("k_{cat}"), new Name("e_{0}")]),
      stoichs: [
        { name: "x", value: new Num(1.0) },
        { name: "y", value: new Num(-1.0) },
      ],
    },
  ]);

  function onSaveEq(idx: number, fn: Base) {
    derived[idx].fn = fn;
    derived = derived.slice();
  }
  function onSaveStoichs(idx: number, stoich: Stoichs) {
    derived[idx].stoichs = stoich;
    derived = derived.slice();
  }
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Rate law</th>
      <th>Stoichiometry</th>
    </tr>
  </thead>
  <tbody>
    {#each derived as { name, fn, stoichs }}
      <tr>
        <td>{name}</td>
        <td>
          <div class="row">
            <Math tex={fn.toTex()} display={true} />
            <button popovertarget="eq-editor-{name}">Edit</button>
          </div>
        </td>
        <td>
          <div class="row">
            <Math tex={stoichsToTex(stoichs)} display={true} />
            <button popovertarget="stoich-editor-{name}">Edit</button>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button>+ add new item</button>
  <button class="save">Save</button>
</div>

{#each derived as { name, fn, stoichs }, idx}
  <div popover id="eq-editor-{name}">
    <EqEditorPopover
      root={fn}
      {variables}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${name}`}
    />
  </div>
  <div popover id="stoich-editor-{name}">
    <StoichEditorPopover
      {stoichs}
      {variables}
      onSave={(stoichs) => onSaveStoichs(idx, stoichs)}
      popovertarget={`stoich-editor-${name}`}
    />
  </div>
{/each}

<style>
  table {
    font-size: 0.75rem;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
  button.save {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
</style>
