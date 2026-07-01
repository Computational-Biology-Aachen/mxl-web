<script lang="ts">
  import EqNode from "$lib/EqNode.svelte";
  import { Button, Math, Row } from "@computational-biology-aachen/design";
  import { defaultValue } from "@computational-biology-aachen/mxlweb-core";
  import {
    Abs,
    Acos,
    Acot,
    Add,
    And,
    ArcCosh,
    ArcCoth,
    ArcCsc,
    ArcCsch,
    ArcSec,
    ArcSech,
    ArcSinh,
    ArcTanh,
    Asin,
    Atan,
    Ceiling,
    Cos,
    Cosh,
    Cot,
    Coth,
    Csc,
    Csch,
    Divide,
    Eq,
    Exp,
    Factorial,
    Floor,
    GreaterEqual,
    GreaterThan,
    Implies,
    IntDivide,
    LessEqual,
    LessThan,
    Ln,
    Log,
    Max,
    Min,
    Minus,
    Mul,
    Name,
    Nary,
    Not,
    NotEqual,
    Num,
    Or,
    Piecewise,
    Pow,
    RateOf,
    Rem,
    Sec,
    Sech,
    Sin,
    Sinh,
    Sqrt,
    Tan,
    Tanh,
    Unary,
    Xor,
    type Base,
  } from "@computational-biology-aachen/mxlweb-core/mathml";

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

  let argNames: string[][] = $derived.by(() => {
    return [
      ["time", "time"],
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

  // When true, the next palette insert wraps the whole tree instead of
  // replacing the selected node. Entered by clicking the builder-canvas.
  let wrapRoot = $state(false);

  // Undo/redo history behind every `root` mutation.
  let history: Base[] = $state([]);
  let future: Base[] = $state([]);

  function pushHistory(): void {
    history = [...history, root];
    future = [];
  }

  function undo(): void {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    history = history.slice(0, -1);
    future = [root, ...future];
    root = previous;
    currentNode = previous;
    wrapRoot = false;
  }

  function redo(): void {
    if (future.length === 0) return;
    const next = future[0];
    future = future.slice(1);
    history = [...history, root];
    root = next;
    currentNode = next;
    wrapRoot = false;
  }

  // The node currently picked up by a drag, if any.
  let draggedNode: Base | null = $state(null);

  // Every id in the dragged subtree — invalid drop targets, since dropping a
  // node onto itself or a descendant would create a cycle.
  let invalidDropIds: Set<number> = $derived(
    draggedNode === null ? new Set() : collectIds(draggedNode, new Set()),
  );

  function collectIds(node: Base, ids: Set<number>): Set<number> {
    ids.add(node.id);
    if (node instanceof Log || node instanceof Sqrt) {
      collectIds(node.child, ids);
      collectIds(node.base, ids);
    } else if (node instanceof Pow || node instanceof Implies) {
      collectIds(node.left, ids);
      collectIds(node.right, ids);
    } else if (node instanceof Unary) {
      collectIds(node.child, ids);
    } else if (node instanceof Nary) {
      for (const child of node.children) collectIds(child, ids);
    }
    return ids;
  }

  function handleDragStart(node: Base): void {
    draggedNode = node;
    wrapRoot = false;
  }

  function handleDragEnd(): void {
    draggedNode = null;
  }

  function handleDrop(targetId: number): void {
    const dragged = draggedNode;
    if (dragged === null || invalidDropIds.has(targetId)) {
      draggedNode = null;
      return;
    }
    draggedNode = null;
    pushHistory();
    const backfilled = root.replace(dragged.id, Name.prototype.default()).node;
    root = backfilled.replace(targetId, dragged).node;
    currentNode = dragged;
  }

  // Several EqEditor instances can be mounted at once (e.g. one per table
  // row, inside a closed Popover each). Gate the undo/redo shortcut on this
  // instance's own popover actually being open, so Ctrl+Z doesn't also
  // rewrite hidden editors elsewhere on the page.
  let sectionEl: HTMLElement | undefined = $state();
  let popoverOpen = $state(false);

  $effect(() => {
    const popoverEl = sectionEl?.closest("[popover]");
    if (!popoverEl) {
      // Not inside a Popover (e.g. the dev playground route) — always active.
      popoverOpen = true;
      return;
    }
    const update = () => {
      popoverOpen = popoverEl.matches(":popover-open");
    };
    update();
    popoverEl.addEventListener("toggle", update);
    return () => popoverEl.removeEventListener("toggle", update);
  });

  $effect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (!popoverOpen) return;
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() !== "z") return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "SELECT") return;
      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  });

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
    defaultOpen: boolean;
    items: {
      label: string;
      default: () => Base;
      hint: string;
      leaf?: boolean;
    }[];
  }[] = [
    {
      name: "Arithmetic",
      defaultOpen: true,
      items: [
        {
          label: "Symbol",
          default: Name.prototype.default,
          hint: "Variable placeholder",
          leaf: true,
        },
        {
          label: "Number",
          default: Num.prototype.default,
          hint: "Constant value",
          leaf: true,
        },
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
      defaultOpen: false,
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
      defaultOpen: false,
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
      defaultOpen: false,
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
      defaultOpen: false,
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
      defaultOpen: false,
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
    pushHistory();
    root = root.replace(currentNode.id, toInsert).node;
    currentNode = toInsert;
  }

  // The first immediate child slot of a freshly-built node, used as the
  // landing spot when wrapping the current tree. Nullary nodes (Symbol,
  // Number) have no slot and return null.
  function firstSlotId(node: Base): number | null {
    if (node instanceof Log || node instanceof Sqrt) return node.child.id;
    if (node instanceof Pow || node instanceof Implies) return node.left.id;
    if (node instanceof Unary) return node.child.id;
    if (node instanceof Nary)
      return node.children.length > 0 ? node.children[0].id : null;
    return null;
  }

  // Nest the whole current tree into a new node's first child slot, e.g.
  // root → -(root) or exp(root). No-op for slotless (nullary) nodes.
  function wrapRootIn(fn: () => Base) {
    const wrapper = fn();
    const slotId = firstSlotId(wrapper);
    if (slotId === null) return;
    pushHistory();
    root = wrapper.replace(slotId, root).node;
    currentNode = wrapper;
    wrapRoot = false;
  }

  function selectNode(node: Base) {
    wrapRoot = false;
    currentNode = node;
  }
  function handleTemplateChoice(event: Event) {
    const target = event.target as HTMLSelectElement;
    const template = templates.at(parseInt(target.value));
    if (template !== undefined) {
      pushHistory();
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

<section bind:this={sectionEl}>
  <Row
    stack
    justify="between"
    gap="0.5rem"
  >
    <hgroup>
      <h2>Eq Editor</h2>
      <p class="comment">
        Build an expression by selecting a node and replacing it with a MathML
        element, then adjust symbols to the allowed variable names.
      </p>
    </hgroup>
    <Button
      onclick={() => onSave(root)}
      popovertarget={popovertarget}
      popovertargetaction="hide">Save</Button
    >
  </Row>

  <div class="edit-row">
    <label for="root">Template</label>
    <select
      id="root"
      value="---"
      onchange={handleTemplateChoice}
    >
      {#each templates as template, idx (template.name)}
        <option
          selected={false}
          value={idx}>{template.name}</option
        >
      {/each}
    </select>
  </div>

  <div class="palette-groups">
    {#each paletteGroups as group (group.name)}
      <details
        class="palette-group"
        open={group.defaultOpen}
      >
        <summary class="group-label">{group.name}</summary>
        <div class="palette">
          {#each group.items as item (item.label)}
            <button
              class="palette-button"
              disabled={wrapRoot && item.leaf}
              onclick={() =>
                wrapRoot ? wrapRootIn(item.default) : insertNode(item.default)}
            >
              <span class="label">{item.label}</span>
              <span class="hint">{item.hint}</span>
            </button>
          {/each}
        </div>
      </details>
    {/each}
  </div>

  <div class="editor-grid">
    <div class="window">
      <div class="window-header">Equation builder</div>
      <div class="window-body">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="builder-canvas"
          data-wrap-active={wrapRoot}
          onclick={() => (wrapRoot = true)}
        >
          {#if currentNode instanceof Name}
            <EqNode
              node={root}
              displayName={displayNames.get(currentNode.name)}
              selectedId={wrapRoot ? -1 : currentNode.id}
              onSelect={selectNode}
              draggedId={draggedNode?.id ?? null}
              invalidDropIds={invalidDropIds}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          {:else}
            <EqNode
              node={root}
              selectedId={wrapRoot ? -1 : currentNode.id}
              onSelect={selectNode}
              draggedId={draggedNode?.id ?? null}
              invalidDropIds={invalidDropIds}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          {/if}
        </div>
        <p class="hint-line">
          Tip: click any element to select it, then choose a MathML element
          above or adjust its value. Click the surrounding canvas to wrap the
          whole expression in a new element. Drag any element onto another to
          move it there; Ctrl+Z / Ctrl+Shift+Z undo and redo.
        </p>

        <!-- Edit rows -->
        {#if wrapRoot}
          <!-- no node selected while wrapping the whole expression -->
        {:else if currentNode instanceof Name}
          <div class="edit-row">
            <label for={`symbol-${currentNode.id}`}>Name</label>
            <select
              id={`symbol-${currentNode.id}`}
              value={(currentNode as Name).name}
              onchange={handleSymbolChange}
            >
              {#each argNames as [id, name] (id)}
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
  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
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

  .group-label {
    cursor: pointer;
    color: #6b7280;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .group-label:hover {
    color: #374151;
  }

  .palette {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-top: 0.35rem;
  }

  .palette-button {
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      border-color 120ms ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--radius-lg);
    background: #f9fafb;
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  .palette-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: var(--color-surface);
  }

  .palette-button:disabled {
    transform: none;
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
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
    border-radius: var(--radius-lg);
    background: #fff;
    min-width: 0;
    overflow: hidden;
  }

  .window-header {
    background: linear-gradient(
      90deg,
      var(--color-surface),
      lch(from var(--color-surface) calc(l + 20) c h)
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
    min-width: 0;
  }

  /* Keep wide equations inside the card instead of pushing the page width;
     swipe to pan on small screens. */
  .builder-canvas {
    display: flex;
    transition:
      border-color 120ms ease,
      background 120ms ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--radius-lg);
    padding: 0.75rem;
    min-width: 0;
    overflow-x: auto;
  }

  /* Active wrap mode: reuse the selected-node visual language. */
  .builder-canvas[data-wrap-active="true"] {
    border-style: solid;
    border-color: var(--color-primary);
    background: rgb(from var(--color-primary) r g b / 8%);
  }

  /* On narrow screens EqNode renders the root as a full-width indented
     outline, so revert to block flow and let it stretch again. */
  @media (max-width: 640px) {
    .builder-canvas {
      display: block;
    }
  }

  .hint-line {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .preview {
    gap: 1rem;
    min-width: 0;
    overflow-x: auto;
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
    border-radius: var(--radius-lg);
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.95rem;
  }
</style>
