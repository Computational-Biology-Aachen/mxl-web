<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Add, Mul, Name, Num } from "$lib/mathml";

  const variables = ["x", "y", "z"];
  let stoichs = $state([
    { name: "x", value: new Num(-1.0) },
    { name: "y", value: new Num(1.0) },
  ]);

  let latex = $derived.by(() => {
    return stoichs
      .map(({ name, value }) => {
        return new Mul([value, new Name(name)]);
      })
      .reduce((previous, current) => new Add([previous, current]))
      .toTex();
  });

  function firstVarNotInUse(): string {
    const inUse = new Set(stoichs.map(({ name }) => name));

    for (const val of variables) {
      if (!inUse.has(val)) {
        return val;
      }
    }

    return "default";
  }
</script>

<section class="page">
  <header class="header">
    <div>
      <h1>Stoich Editor</h1>
      <p class="comment">
        Build an expression by selecting a node and replacing it with a MathML
        element, then adjust symbols to the allowed variable names.
      </p>
    </div>
  </header>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Stoichiometry</th>
      </tr>
    </thead>
    <tbody>
      {#each stoichs as { name }, idx}
        <tr>
          <td>
            <select bind:value={stoichs[idx].name}>
              {#each variables as variable}
                <option selected={variable === name}>{variable}</option>
              {/each}
            </select>
          </td>
          <td>
            <input
              type="number"
              bind:value={stoichs[idx].value.value}
              step="1.0"
              onchange={(e) => {
                stoichs = stoichs.slice();
              }}
            />
          </td>
          <td>
            <button
              onclick={() => {
                stoichs = stoichs.filter((i) => {
                  return i.name !== name;
                });
              }}>x</button
            >
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="row">
    <button
      onclick={() => {
        stoichs.push({ name: firstVarNotInUse(), value: new Num(1.0) });
      }}>+ add new item</button
    >
    <button class="save">Save</button>
  </div>
  <div class="window">
    <div class="window-header">Preview</div>
    <div class="window-body preview">
      <Math tex={latex} display={true} />
    </div>
  </div>
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .header h1 {
    margin: 0 0 0.35rem;
  }

  .comment {
    margin: 0;
    color: #4b5563;
  }

  .window {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .window-header {
    background: linear-gradient(90deg, #0f766e, #14b8a6);
    color: white;
    padding: 0.75rem 1rem;
    font-weight: 700;
  }

  .window-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .preview {
    gap: 1rem;
  }

  select,
  input[type="number"] {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.95rem;
  }
</style>
