<script lang="ts">
  import type { EditorNode, NodeKind } from "$lib/editorTypes";
  import EquationNode from "$lib/EquationNode.svelte";
  import Math from "$lib/Math.svelte";

  const variables = ["a", "b", "c"];
  const palette: { label: string; type: NodeKind; hint: string }[] = [
    { label: "Symbol", type: "symbol", hint: "Variable placeholder" },
    { label: "Number", type: "number", hint: "Constant value" },
    { label: "Divide", type: "divide", hint: "Two-part fraction" },
    { label: "Multiply", type: "mul", hint: "Multiply" },
  ];

  let idCounter = 0;
  const makeId = () => `n-${++idCounter}`;

  let makeSymbol = (name = variables[0]): EditorNode => ({
    type: "symbol",
    id: makeId(),
    name,
  });
  let makeNumber = (value = 1): EditorNode => ({
    type: "number",
    id: makeId(),
    value,
  });
  let makeMul = (): EditorNode => ({
    type: "mul",
    id: makeId(),
    children: [makeSymbol(), makeNumber()],
  });
  let makeAdd = (): EditorNode => ({
    type: "add",
    id: makeId(),
    children: [makeSymbol(), makeNumber()],
  });
  let makeDivide = (): EditorNode => ({
    type: "divide",
    id: makeId(),
    children: [makeSymbol(), makeNumber()],
  });

  function initEq(): EditorNode {
    return {
      type: "mul",
      id: makeId(),
      children: [
        {
          type: "mul",
          id: makeId(),
          children: [makeSymbol("k_{cat}"), makeSymbol("e_0")],
        },
        {
          type: "divide",
          id: makeId(),
          children: [
            makeSymbol("S"),
            {
              type: "add",
              id: makeId(),
              children: [makeSymbol("K_m"), makeSymbol("S")],
            },
          ],
        },
      ],
    };
  }

  let root: EditorNode = $state(initEq());
  let selectedId = $derived.by(() => {
    return root.id;
  });
  let latex = $derived.by(() => {
    return nodeToLatex(root);
  });
  // $inspect(root);
  // $inspect(latex);

  function replaceNode(
    tree: EditorNode,
    targetId: string,
    next: EditorNode,
  ): EditorNode {
    // Check if current id is target
    if (tree.id === targetId) return next;

    // Recurse through children
    if (tree.type === "divide" || tree.type === "mul" || tree.type === "add") {
      return {
        ...tree,
        children: tree.children.map((child) =>
          replaceNode(child, targetId, next),
        ) as [EditorNode, EditorNode],
      };
    }

    // Otherwise exit
    return tree;
  }

  function updateNode(
    tree: EditorNode,
    targetId: string,
    update: (node: EditorNode) => EditorNode,
  ): EditorNode {
    if (tree.id === targetId) return update(tree);
    if (tree.type === "divide" || tree.type === "mul" || tree.type === "add") {
      return {
        ...tree,
        children: tree.children.map((child) =>
          updateNode(child, targetId, update),
        ) as [EditorNode, EditorNode],
      };
    }
    return tree;
  }

  function createNode(type: NodeKind): EditorNode {
    if (type === "symbol") return makeSymbol();
    if (type === "number") return makeNumber();
    if (type === "mul") return makeMul();
    if (type === "add") return makeAdd();
    return makeDivide();
  }

  function insertNode(type: NodeKind) {
    const next = createNode(type);
    root = replaceNode(root, selectedId, next);
    selectedId = next.id;
  }

  function selectNode(id: string) {
    selectedId = id;
  }

  function updateSymbol(id: string, name: string) {
    root = updateNode(root, id, (node) =>
      node.type === "symbol" ? { ...node, name } : node,
    );
  }

  function updateNumber(id: string, value: number) {
    root = updateNode(root, id, (node) =>
      node.type === "number" ? { ...node, value } : node,
    );
  }

  function nodeToLatex(node: EditorNode): string {
    if (node.type === "symbol") return node.name;
    if (node.type === "number") return `${node.value}`;
    if (node.type === "mul") {
      const [left, right] = node.children;
      return `${nodeToLatex(left)} \\cdot ${nodeToLatex(right)}`;
    }
    if (node.type === "add") {
      const [left, right] = node.children;
      return `${nodeToLatex(left)} + ${nodeToLatex(right)}`;
    }
    if (node.type === "divide") {
      const [left, right] = node.children;
      return `\\frac{${nodeToLatex(left)}}{${nodeToLatex(right)}}`;
    }

    return "error";
  }
</script>

<section class="page">
  <header class="header">
    <div>
      <h1>Rate Editor</h1>
      <p class="comment">
        Build an expression by selecting a node and replacing it with a MathML
        element, then adjust symbols to the allowed variable names.
      </p>
    </div>
  </header>

  <div class="palette">
    {#each palette as item}
      <button class="palette-button" onclick={() => insertNode(item.type)}>
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
          {variables}
          {selectedId}
          onSelect={selectNode}
          onUpdateSymbol={updateSymbol}
          onUpdateNumber={updateNumber}
        />
        <p class="hint-line">
          Tip: click any element to select it, then choose a MathML element
          above or adjust its value.
        </p>
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
</style>
