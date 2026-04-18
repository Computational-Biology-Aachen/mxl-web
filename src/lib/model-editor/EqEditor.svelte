<script lang="ts">
  import Math from "$lib/Math.svelte";
  import {
    type Base,
    Add,
    Divide,
    Minus,
    Mul,
    Name,
    Num,
    Pow,
    Implies,
    IntDivide,
    Rem,
    And,
    Or,
    Xor,
    Not,
    Eq,
    NotEqual,
    GreaterEqual,
    GreaterThan,
    LessEqual,
    LessThan,
    Max,
    Min,
    Piecewise,
    Abs,
    Ceiling,
    Exp,
    Factorial,
    Floor,
    Ln,
    Sin,
    Cos,
    Tan,
    Sec,
    Csc,
    Cot,
    Asin,
    Acos,
    Atan,
    Acot,
    ArcSec,
    ArcCsc,
    Sinh,
    Cosh,
    Tanh,
    Sech,
    Csch,
    Coth,
    ArcSinh,
    ArcCosh,
    ArcTanh,
    ArcCsch,
    ArcSech,
    ArcCoth,
    RateOf,
    Log,
    Sqrt,
  } from "$lib/mathml";
  import EqNode from "$lib/model-editor/EqNode.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import { defaultValue } from "./modelUtils";

  import {
    idToDisplay,
    idToTex,
    type AssView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";

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
      ...variables.map((el) => [el.id, defaultValue(el.displayName, el.id)]),
      ...parameters.map((el) => [el.id, defaultValue(el.displayName, el.id)]),
      ...assignments.map((el) => [el.id, defaultValue(el.displayName, el.id)]),
    ];
  });

  let displayNames = $derived(
    idToDisplay(variables, parameters, assignments, reactions),
  );

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  let latex = $derived.by(() => {
    return root.toTex(texNames);
  });

  let currentNode: Base = $derived(root);

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

  const paletteGroups: {
    name: string;
    items: { label: string; default: () => Base; hint: string }[];
  }[] = [
    {
      name: "Leaves",
      items: [
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
      ],
    },
    {
      name: "Arithmetic",
      items: [
        {
          label: "Add",
          default: () =>
            new Add([Name.prototype.default(), Name.prototype.default()]),
          hint: "a + b",
        },
        {
          label: "Sub",
          default: () =>
            new Minus([Name.prototype.default(), Name.prototype.default()]),
          hint: "a − b",
        },
        {
          label: "Multiply",
          default: () =>
            new Mul([Name.prototype.default(), Name.prototype.default()]),
          hint: "a × b",
        },
        {
          label: "Divide",
          default: () =>
            new Divide([Name.prototype.default(), Name.prototype.default()]),
          hint: "a / b",
        },
        {
          label: "Power",
          default: () => new Pow(Name.prototype.default(), new Num(2)),
          hint: "aⁿ",
        },
        {
          label: "Int Divide",
          default: () =>
            new IntDivide([Name.prototype.default(), Name.prototype.default()]),
          hint: "⌊a/b⌋",
        },
        {
          label: "Remainder",
          default: () =>
            new Rem([Name.prototype.default(), Name.prototype.default()]),
          hint: "a mod b",
        },
      ],
    },
    {
      name: "Functions",
      items: [
        {
          label: "Exp",
          default: () => new Exp(Name.prototype.default()),
          hint: "eˣ",
        },
        {
          label: "Ln",
          default: () => new Ln(Name.prototype.default()),
          hint: "Natural log",
        },
        {
          label: "Log",
          default: () => new Log(Name.prototype.default(), new Num(10)),
          hint: "Log base b",
        },
        {
          label: "Sqrt",
          default: () => new Sqrt(Name.prototype.default(), new Num(2)),
          hint: "nth root",
        },
        {
          label: "Abs",
          default: () => new Abs(Name.prototype.default()),
          hint: "|x|",
        },
        {
          label: "Floor",
          default: () => new Floor(Name.prototype.default()),
          hint: "⌊x⌋",
        },
        {
          label: "Ceil",
          default: () => new Ceiling(Name.prototype.default()),
          hint: "⌈x⌉",
        },
        {
          label: "Factorial",
          default: () => new Factorial(Name.prototype.default()),
          hint: "n!",
        },
        {
          label: "d/dt",
          default: () => new RateOf(Name.prototype.default()),
          hint: "Rate of change",
        },
        {
          label: "Max",
          default: () =>
            new Max([Name.prototype.default(), Name.prototype.default()]),
          hint: "Maximum",
        },
        {
          label: "Min",
          default: () =>
            new Min([Name.prototype.default(), Name.prototype.default()]),
          hint: "Minimum",
        },
        {
          label: "Piecewise",
          default: () =>
            new Piecewise([Name.prototype.default(), Name.prototype.default()]),
          hint: "Piecewise",
        },
      ],
    },
    {
      name: "Trigonometry",
      items: [
        {
          label: "Sin",
          default: () => new Sin(Name.prototype.default()),
          hint: "sin(x)",
        },
        {
          label: "Cos",
          default: () => new Cos(Name.prototype.default()),
          hint: "cos(x)",
        },
        {
          label: "Tan",
          default: () => new Tan(Name.prototype.default()),
          hint: "tan(x)",
        },
        {
          label: "Sec",
          default: () => new Sec(Name.prototype.default()),
          hint: "sec(x)",
        },
        {
          label: "Csc",
          default: () => new Csc(Name.prototype.default()),
          hint: "csc(x)",
        },
        {
          label: "Cot",
          default: () => new Cot(Name.prototype.default()),
          hint: "cot(x)",
        },
        {
          label: "Arcsin",
          default: () => new Asin(Name.prototype.default()),
          hint: "arcsin(x)",
        },
        {
          label: "Arccos",
          default: () => new Acos(Name.prototype.default()),
          hint: "arccos(x)",
        },
        {
          label: "Arctan",
          default: () => new Atan(Name.prototype.default()),
          hint: "arctan(x)",
        },
        {
          label: "Arccot",
          default: () => new Acot(Name.prototype.default()),
          hint: "arccot(x)",
        },
        {
          label: "Arcsec",
          default: () => new ArcSec(Name.prototype.default()),
          hint: "arcsec(x)",
        },
        {
          label: "Arccsc",
          default: () => new ArcCsc(Name.prototype.default()),
          hint: "arccsc(x)",
        },
      ],
    },
    {
      name: "Hyperbolic",
      items: [
        {
          label: "Sinh",
          default: () => new Sinh(Name.prototype.default()),
          hint: "sinh(x)",
        },
        {
          label: "Cosh",
          default: () => new Cosh(Name.prototype.default()),
          hint: "cosh(x)",
        },
        {
          label: "Tanh",
          default: () => new Tanh(Name.prototype.default()),
          hint: "tanh(x)",
        },
        {
          label: "Sech",
          default: () => new Sech(Name.prototype.default()),
          hint: "sech(x)",
        },
        {
          label: "Csch",
          default: () => new Csch(Name.prototype.default()),
          hint: "csch(x)",
        },
        {
          label: "Coth",
          default: () => new Coth(Name.prototype.default()),
          hint: "coth(x)",
        },
        {
          label: "Arcsinh",
          default: () => new ArcSinh(Name.prototype.default()),
          hint: "arcsinh(x)",
        },
        {
          label: "Arccosh",
          default: () => new ArcCosh(Name.prototype.default()),
          hint: "arccosh(x)",
        },
        {
          label: "Arctanh",
          default: () => new ArcTanh(Name.prototype.default()),
          hint: "arctanh(x)",
        },
        {
          label: "Arccsch",
          default: () => new ArcCsch(Name.prototype.default()),
          hint: "arccsch(x)",
        },
        {
          label: "Arcsech",
          default: () => new ArcSech(Name.prototype.default()),
          hint: "arcsech(x)",
        },
        {
          label: "Arccoth",
          default: () => new ArcCoth(Name.prototype.default()),
          hint: "arccoth(x)",
        },
      ],
    },
    {
      name: "Comparison",
      items: [
        {
          label: "Equal",
          default: () =>
            new Eq([Name.prototype.default(), Name.prototype.default()]),
          hint: "a = b",
        },
        {
          label: "Not Equal",
          default: () =>
            new NotEqual([Name.prototype.default(), Name.prototype.default()]),
          hint: "a ≠ b",
        },
        {
          label: "Greater",
          default: () =>
            new GreaterThan([
              Name.prototype.default(),
              Name.prototype.default(),
            ]),
          hint: "a > b",
        },
        {
          label: "Geq",
          default: () =>
            new GreaterEqual([
              Name.prototype.default(),
              Name.prototype.default(),
            ]),
          hint: "a ≥ b",
        },
        {
          label: "Less",
          default: () =>
            new LessThan([Name.prototype.default(), Name.prototype.default()]),
          hint: "a < b",
        },
        {
          label: "Leq",
          default: () =>
            new LessEqual([Name.prototype.default(), Name.prototype.default()]),
          hint: "a ≤ b",
        },
      ],
    },
    {
      name: "Logic",
      items: [
        {
          label: "And",
          default: () =>
            new And([Name.prototype.default(), Name.prototype.default()]),
          hint: "a ∧ b",
        },
        {
          label: "Or",
          default: () =>
            new Or([Name.prototype.default(), Name.prototype.default()]),
          hint: "a ∨ b",
        },
        {
          label: "Xor",
          default: () =>
            new Xor([Name.prototype.default(), Name.prototype.default()]),
          hint: "a ⊕ b",
        },
        {
          label: "Not",
          default: () => new Not([Name.prototype.default()]),
          hint: "¬a",
        },
        {
          label: "Implies",
          default: () =>
            new Implies(Name.prototype.default(), Name.prototype.default()),
          hint: "a ⇒ b",
        },
      ],
    },
  ];

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
    <PopoverSaveButton
      onclick={() => onSave(root)}
      popovertarget={popovertarget}
    />
  </RowApart>

  <div class="edit-row">
    <label for={`root`}>Template</label>
    <select
      id={`root`}
      value="---"
      onchange={handleTemplateChoice}
    >
      {#each templates as template, idx}
        <option
          selected={false}
          value={idx}>{template.name}</option
        >
      {/each}
    </select>
  </div>

  <div class="palette-groups">
    {#each paletteGroups as group}
      <div class="palette-group">
        <span class="group-label">{group.name}</span>
        <div class="palette">
          {#each group.items as item}
            <button
              class="palette-button"
              onclick={() => insertNode(item.default)}
            >
              <span class="label">{item.label}</span>
              <span class="hint">{item.hint}</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="editor-grid">
    <div class="window">
      <div class="window-header">Equation builder</div>
      <div class="window-body">
        {#if currentNode instanceof Name}
          <EqNode
            node={root}
            displayName={displayNames.get(currentNode.name)}
            selectedId={currentNode.id}
            onSelect={selectNode}
          />
        {:else}
          <EqNode
            node={root}
            selectedId={currentNode.id}
            onSelect={selectNode}
          />
        {/if}
        <p class="hint-line">
          Tip: click any element to select it, then choose a MathML element
          above or adjust its value.
        </p>

        <!-- Edit rows -->
        {#if currentNode instanceof Name}
          <div class="edit-row">
            <label for={`symbol-${currentNode.id}`}>Name</label>
            <select
              id={`symbol-${currentNode.id}`}
              value={(currentNode as Name).name}
              onchange={handleSymbolChange}
            >
              {#each argNames as [id, name]}
                <option
                  value={id}
                  selected={id === (currentNode as Name).name}>{name}</option
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
        <Math
          tex={latex}
          display={true}
        />
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

  .palette-groups {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .palette-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .group-label {
    color: #6b7280;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .palette {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
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
    padding: 0.5rem 0.75rem;
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
    font-size: 0.85rem;
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
