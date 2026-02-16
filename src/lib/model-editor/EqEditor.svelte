<script lang="ts">
  import Math from "$lib/Math.svelte";
  import { Add, Divide, Minus, Mul, Name, Num, type Base } from "$lib/mathml";
  import EquationNode from "$lib/model-editor/EqNode.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import {
    getTexNames,
    type AssView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./model";

  let {
    root = $bindable(),
    variables,
    parameters,
    assignments,
    reactions,
    onSave,
    popovertarget,
  }: {
    root: Base;
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    popovertarget: string;
    onSave: (fn: Base) => void;
  } = $props();

  let argNames = $derived.by(() => {
    return [
      ...variables.map((el) => el[0]),
      ...parameters.map((el) => el[0]),
      ...assignments.map((el) => el[0]),
    ];
  });

  let texNames: Map<string, string> = $derived(
    getTexNames(variables, parameters, assignments, reactions),
  );

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
    return root.toTex(texNames);
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
  <RowApart>
    <hgroup>
      <h2>Eq Editor</h2>
      <p class="comment">
        Build an expression by selecting a node and replacing it with a MathML
        element, then adjust symbols to the allowed variable names.
      </p>
    </hgroup>
    <PopoverSaveButton onclick={() => onSave(root)} {popovertarget} />
  </RowApart>

  <div class="edit-row">
    <label for={`root`}>Template</label>
    <select id={`root`} value="---" onchange={handleTemplateChoice}>
      {#each templates as template, idx}
        <option selected={false} value={idx}>{template.name}</option>
      {/each}
    </select>
  </div>

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
        {#if currentNode instanceof Name}
          <div class="edit-row">
            <label for={`symbol-${currentNode.id}`}>Name</label>
            <select
              id={`symbol-${currentNode.id}`}
              value={(currentNode as Name).name}
              onchange={handleSymbolChange}
            >
              {#each argNames as variable}
                <option
                  value={variable}
                  selected={variable === (currentNode as Name).name}
                  >{variable}</option
                >
              {/each}
            </select>
          </div>
        {:else if currentNode instanceof Num}
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
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
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
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      border-color 120ms ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--border-radius);
    background: #f9fafb;
    padding: 0.75rem 0.9rem;
    text-align: left;
  }

  .palette-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }

  .palette-button .label {
    display: block;
    color: #111827;
    font-weight: 700;
  }

  .palette-button .hint {
    display: block;
    color: #4b5563;
    font-size: 0.9rem;
  }

  .editor-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .window {
    box-shadow: var(--shadow);
    border: var(--border);
    border-radius: var(--border-radius);
    background: #fff;
    overflow: hidden;
  }

  .window-header {
    background: linear-gradient(
      90deg,
      var(--primary),
      lch(from var(--primary) calc(l + 20) c h)
    );
    padding: 0.75rem 1rem;
    color: white;
    font-weight: 700;
  }

  .window-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
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
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.35rem 0.6rem;
    margin-top: 0.5rem;
  }

  label {
    color: #374151;
    font-size: 0.9rem;
  }

  select,
  input[type="number"] {
    border: var(--border);
    border-radius: var(--border-radius);
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.95rem;
  }
</style>
