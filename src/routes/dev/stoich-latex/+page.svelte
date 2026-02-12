<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Num } from "$lib/mathml";
  import { stoichToTex, type Stoichiometry } from "$lib/model-editor/model";

  const stoichs: Array<Stoichiometry> = [
    [{ name: "a", value: new Num(0.0) }],
    [
      { name: "a", value: new Num(1.0) },
      { name: "b", value: new Num(0.0) },
    ],
    [
      { name: "a", value: new Num(0.0) },
      { name: "b", value: new Num(1.0) },
    ],
    [
      { name: "a", value: new Num(1.0) },
      { name: "b", value: new Num(1.0) },
    ],
    [
      { name: "a", value: new Num(-1.0) },
      { name: "b", value: new Num(-1.0) },
    ],
    [
      { name: "a", value: new Num(-1.0) },
      { name: "b", value: new Num(1.0) },
    ],
    [
      { name: "a", value: new Num(1.0) },
      { name: "b", value: new Num(-1.0) },
    ],
    [
      { name: "a", value: new Num(-2.0) },
      { name: "b", value: new Num(-2.0) },
    ],
    [
      { name: "a", value: new Num(-2.0) },
      { name: "b", value: new Num(2.0) },
    ],
    [
      { name: "a", value: new Num(2.0) },
      { name: "b", value: new Num(-2.0) },
    ],
  ];

  const texNames = new Map();

  function str(stoich: Stoichiometry): string {
    return stoich
      .map(({ name, value }) => {
        return `${value.value}*${name}`;
      })
      .reduce((previous, next) => {
        return `${previous} + ${next}`;
      });
  }
</script>

<table>
  <thead>
    <tr>
      <td>Inp</td>
      <td>Out</td>
    </tr>
  </thead>
  <tbody>
    {#each stoichs as stoich}
      <tr>
        <td>{str(stoich)}</td>
        <td><Math tex={stoichToTex(stoich, texNames)} display /></td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    display: table;

    tbody {
      display: flex;
      flex-direction: column;
    }

    tr {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 300px;
    }

    td {
      display: inline;
    }
  }
</style>
