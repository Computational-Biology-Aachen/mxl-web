<script lang="ts">
  import { Divide, Minus, Name, Num } from "$lib/mathml";
  import { stoichToTex } from "$lib/model-editor/modelUtils";
  import { type Stoichiometry } from "$lib/model-editor/modelView";
  import { Math } from "@computational-biology-aachen/design";

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
    [
      { name: "a", value: new Num(2.0) },
      {
        name: "b",
        value: new Minus([new Divide([new Num(1.0), new Name("a")])]),
      },
    ],
    [{ name: "a", value: new Name("a") }],
    [{ name: "a", value: new Name("b") }],
    [
      { name: "a", value: new Name("a") },
      { name: "b", value: new Name("b") },
    ],
  ];

  const texNames = new Map();

  function str(stoich: Stoichiometry): string {
    return stoich
      .map(({ name, value }) => {
        if (value instanceof Num) {
          return `${value.toTex(texNames)}*${name}`;
        } else {
          return value.toTex(texNames);
        }
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
        <td
          ><Math
            tex={stoichToTex(stoich, texNames)}
            display
          /></td
        >
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
