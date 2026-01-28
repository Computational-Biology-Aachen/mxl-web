<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Base, Minus, Mul, Name } from "$lib/mathml";
  import EqEditor from "$lib/model-editor/EqEditor.svelte";

  let variables = ["x_{1}", "x_{total}", "k_{cat}", "e_{0}"];

  let derived: Array<{ name: string; fn: Base }> = $state([
    {
      name: "x_{2}",
      fn: new Minus([new Name("x_{total}"), new Name("x_{1}")]),
    },
    { name: "V_{max}", fn: new Mul([new Name("k_{cat}"), new Name("e_{0}")]) },
  ]);

  function onSaveEq(idx: number, fn: Base) {
    derived[idx].fn = fn;
    derived = derived.slice();
  }
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Function</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each derived as { name, fn }}
      <tr>
        <td>{name}</td>
        <td><Math tex={fn.toTex()} display={true} /> </td>
        <td>
          <button popovertarget="eq-editor-{name}">Edit</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button>+ add new item</button>
  <button class="save">Save</button>
</div>

{#each derived as { name, fn }, idx}
  <div popover id="eq-editor-{name}">
    <EqEditor
      root={fn}
      {variables}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${name}`}
    />
  </div>
{/each}

<style>
  table {
    font-size: 0.75rem;
  }
  td:nth-child(2) {
    width: 80%;
  }
  td:nth-last-child(1) {
    text-align: right;
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
