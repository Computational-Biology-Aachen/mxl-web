<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Add, Divide, Minus, Mul, Name, Num, type Base } from "$lib/mathml";
  import EquationNode from "$lib/model-editor/EquationNode.svelte";

  let {
    root,
    variables,
    onSave,
    popovertarget,
  }: {
    root: Base;
    variables: string[];
    onSave: (fn: Base) => void;
    popovertarget: string;
  } = $props();
  const templates = [
    {
      name: "Proportional",
      code: () => {
        return new Mul([Name.prototype.default(), Name.prototype.default()]);
      },
    },
    {
      name: "Mass-action",
      code: () => {
        return new Mul([
          Name.prototype.default(),
          new Mul([Name.prototype.default(), Name.prototype.default()]),
        ]);
      },
    },
    {
      name: "Michaelis-Menten",
      code: () => {
        return new Divide([
          new Mul([Name.prototype.default(), Name.prototype.default()]),
          new Add([Name.prototype.default(), Name.prototype.default()]),
        ]);
      },
    },
    {
      name: "Michaelis-Menten (e0)",
      code: () => {
        return new Divide([
          new Mul([
            Name.prototype.default(),
            new Mul([Name.prototype.default(), Name.prototype.default()]),
          ]),
          new Add([Name.prototype.default(), Name.prototype.default()]),
        ]);
      },
    },
  ];
  const palette: {
    label: string;
    default: () => Base;
    hint: string;
  }[] = [
    {
      label: "Symbol",
      default: Name.prototype.default,
      hint: "Variable placeholder",
    },
    {
      label: "Number",
      default: Num.prototype.default,
      hint: "Constant value",
    },
    {
      label: "Divide",
      default: () => {
        return new Divide([Name.prototype.default(), Name.prototype.default()]);
      },
      hint: "Two-part fraction",
    },
    {
      label: "Multiply",
      default: () => {
        return new Mul([Name.prototype.default(), Name.prototype.default()]);
      }, //
      hint: "Multiply",
    },
    {
      label: "Add",
      default: () => {
        return new Add([Name.prototype.default(), Name.prototype.default()]);
      }, //
      hint: "Add",
    },
    {
      label: "Sub",
      default: () => {
        return new Minus([Name.prototype.default(), Name.prototype.default()]);
      }, //
      hint: "Sub",
    },
  ];

  let currentNode: Base = $derived(root);
  let latex = $derived.by(() => {
    return root.toTex();
  });

  function insertNode(fn: () => Base) {
    const toInsert = fn();
    root = root.replace(currentNode.id, toInsert).node;
    currentNode = toInsert;
  }

  function selectNode(node: Base) {
    currentNode = node;
  }
  function handleTemplateChoice(event: Event) {
    const target = event.target as HTMLSelectElement;
    const template = templates.at(parseInt(target.value));
    if (template !== undefined) {
      root = template.code();
    }
  }

  function handleSymbolChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    let node = (currentNode as Name).update(target.value);
    insertNode(() => node);
  }

  function handleNumberChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    let node = (currentNode as Num).update(parseFloat(target.value));
    insertNode(() => node);
  }
</script>

<section class="page">
  <header class="header">
    <div>
      <h1>Eq Editor</h1>
      <p class="comment">
        Build an expression by selecting a node and replacing it with a MathML
        element, then adjust symbols to the allowed variable names.
      </p>
      <div class="edit-row">
        <label for={`root`}>Template</label>
        <select id={`root`} value="---" onchange={handleTemplateChoice}>
          {#each templates as template, idx}
            <option selected={false} value={idx}>{template.name}</option>
          {/each}
        </select>
      </div>
    </div>
  </header>

  <div class="palette">
    {#each palette as item}
      <button class="palette-button" onclick={() => insertNode(item.default)}>
        <span class="label">{item.label}</span>
        <span class="hint">{item.hint}</span>
      </button>
    {/each}
  </div>

  <div class="editor-grid">
    <div class="window">
      <div class="window-header">Equation builder</div>
      <div class="window-body">
        <EquationNode
          node={root}
          selectedId={currentNode.id}
          onSelect={selectNode}
        />
        <p class="hint-line">
          Tip: click any element to select it, then choose a MathML element
          above or adjust its value.
        </p>
        {#if currentNode.constructor.name === "Name"}
          <div class="edit-row">
            <label for={`symbol-${currentNode.id}`}>Name</label>
            <select
              id={`symbol-${currentNode.id}`}
              value={(currentNode as Name).name}
              onchange={handleSymbolChange}
            >
              {#each variables as variable}
                <option
                  value={variable}
                  selected={variable === (currentNode as Name).name}
                  >{variable}</option
                >
              {/each}
            </select>
          </div>
        {:else if currentNode.constructor.name === "Num"}
          <div class="edit-row">
            <label for={`number-${currentNode.id}`}>Value</label>
            <input
              id={`number-${currentNode.id}`}
              type="number"
              step="0.1"
              value={(currentNode as Num).value}
              oninput={handleNumberChange}
            />
          </div>
        {/if}
      </div>
    </div>

    <div class="window">
      <div class="window-header">Preview</div>
      <div class="window-body preview">
        <Math tex={latex} display={true} />
      </div>
    </div>
  </div>

  <button
    onclick={() => onSave(root)}
    popovertargetaction="hide"
    {popovertarget}>Save</button
  >
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

  .palette {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .palette-button {
    text-align: left;
    padding: 0.75rem 0.9rem;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    cursor: pointer;
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      border-color 120ms ease;
  }

  .palette-button:hover {
    transform: translateY(-2px);
    border-color: #0f766e;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .palette-button .label {
    display: block;
    font-weight: 700;
    color: #111827;
  }

  .palette-button .hint {
    display: block;
    font-size: 0.9rem;
    color: #4b5563;
  }

  .editor-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .hint-line {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .preview {
    gap: 1rem;
  }

  .edit-row {
    margin-top: 0.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.35rem 0.6rem;
    align-items: center;
  }

  label {
    font-size: 0.9rem;
    color: #374151;
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
