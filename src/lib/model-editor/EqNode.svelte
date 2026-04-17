<script lang="ts">
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
    type Base,
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
  } from "$lib/mathml";
  import EquationNode from "$lib/model-editor/EqNode.svelte";
  import { defaultValue } from "./modelUtils";

  let {
    node,
    displayName,
    selectedId,
    onSelect,
  }: {
    node: Base;
    displayName?: string;
    selectedId: number;
    onSelect: (node: Base) => void;
  } = $props();

  const selectSelf = () => onSelect(node);

  function getNodeClassName(node: Base): string {
    if (node instanceof Divide) return "Divide";
    if (node instanceof Mul) return "Mul";
    if (node instanceof Add) return "Add";
    if (node instanceof Minus) return "Minus";
    if (node instanceof IntDivide) return "IntDivide";
    if (node instanceof Rem) return "Rem";
    if (node instanceof Pow) return "Pow";
    if (node instanceof Implies) return "Implies";
    if (node instanceof And) return "And";
    if (node instanceof Or) return "Or";
    if (node instanceof Xor) return "Xor";
    if (node instanceof Not) return "Not";
    if (node instanceof Eq) return "Eq";
    if (node instanceof NotEqual) return "NotEqual";
    if (node instanceof GreaterEqual) return "GreaterEqual";
    if (node instanceof GreaterThan) return "GreaterThan";
    if (node instanceof LessEqual) return "LessEqual";
    if (node instanceof LessThan) return "LessThan";
    if (node instanceof Max) return "Max";
    if (node instanceof Min) return "Min";
    if (node instanceof Piecewise) return "Piecewise";
    if (node instanceof Log) return "Log";
    if (node instanceof Sqrt) return "Sqrt";
    if (node instanceof Unary) return "Unary";
    if (node instanceof Name) return "Name";
    if (node instanceof Num) return "Num";
    return "";
  }

  function getNaryInfixOp(node: Base): string | null {
    if (node instanceof IntDivide) return "÷";
    if (node instanceof Rem) return "mod";
    if (node instanceof And) return "∧";
    if (node instanceof Or) return "∨";
    if (node instanceof Xor) return "⊕";
    if (node instanceof Eq) return "=";
    if (node instanceof NotEqual) return "≠";
    if (node instanceof GreaterEqual) return "≥";
    if (node instanceof GreaterThan) return ">";
    if (node instanceof LessEqual) return "≤";
    if (node instanceof LessThan) return "<";
    return null;
  }

  function getUnaryLabel(node: Base): string {
    if (node instanceof Abs) return "abs";
    if (node instanceof Ceiling) return "ceil";
    if (node instanceof Exp) return "exp";
    if (node instanceof Factorial) return "!";
    if (node instanceof Floor) return "floor";
    if (node instanceof Ln) return "ln";
    if (node instanceof Sin) return "sin";
    if (node instanceof Cos) return "cos";
    if (node instanceof Tan) return "tan";
    if (node instanceof Sec) return "sec";
    if (node instanceof Csc) return "csc";
    if (node instanceof Cot) return "cot";
    if (node instanceof Asin) return "arcsin";
    if (node instanceof Acos) return "arccos";
    if (node instanceof Atan) return "arctan";
    if (node instanceof Acot) return "arccot";
    if (node instanceof ArcSec) return "arcsec";
    if (node instanceof ArcCsc) return "arccsc";
    if (node instanceof Sinh) return "sinh";
    if (node instanceof Cosh) return "cosh";
    if (node instanceof Tanh) return "tanh";
    if (node instanceof Sech) return "sech";
    if (node instanceof Csch) return "csch";
    if (node instanceof Coth) return "coth";
    if (node instanceof ArcSinh) return "arcsinh";
    if (node instanceof ArcCosh) return "arccosh";
    if (node instanceof ArcTanh) return "arctanh";
    if (node instanceof ArcCsch) return "arccsch";
    if (node instanceof ArcSech) return "arcsech";
    if (node instanceof ArcCoth) return "arccoth";
    if (node instanceof RateOf) return "d/dt";
    return "fn";
  }

  $inspect(displayName);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={`node node-${getNodeClassName(node)}`}
  data-selected={selectedId === node.id}
  onclick={(e) => {
    e.stopPropagation();
    selectSelf();
  }}
>
  {#if node instanceof Divide}
    <div class="divide">
      <div class="child">
        <EquationNode
          node={(node as Divide).children[0]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select divide"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        /
      </button>
      <div class="child">
        <EquationNode
          node={(node as Divide).children[1]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
    </div>
  {:else if node instanceof Mul}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Mul).children[0]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select mul"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        x
      </button>
      <div class="child">
        <EquationNode
          node={(node as Mul).children[1]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
    </div>
  {:else if node instanceof Add}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Add).children[0]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select add"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        +
      </button>
      <div class="child">
        <EquationNode
          node={(node as Add).children[1]}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
    </div>
  {:else if node instanceof Minus}
    {#if (node as Minus).children.length === 1}
      <div class="mul">
        <button
          class="op"
          aria-label="Select minus"
          onclick={(e) => {
            e.stopPropagation();
            selectSelf();
          }}
        >
          -
        </button>
        <div class="child">
          <EquationNode
            node={(node as Minus).children[0]}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
      </div>
    {:else}
      <div class="mul">
        <div class="child">
          <EquationNode
            node={(node as Minus).children[0]}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
        <button
          class="op"
          aria-label="Select minus"
          onclick={(e) => {
            e.stopPropagation();
            selectSelf();
          }}
        >
          -
        </button>
        <div class="child">
          <EquationNode
            node={(node as Minus).children[1]}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
      </div>
    {/if}
  {:else if node instanceof Pow}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Pow).left}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select pow"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        ^
      </button>
      <div class="child">
        <EquationNode
          node={(node as Pow).right}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
    </div>
  {:else if node instanceof Implies}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Implies).left}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select implies"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        ⇒
      </button>
      <div class="child">
        <EquationNode
          node={(node as Implies).right}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
    </div>
  {:else if getNaryInfixOp(node) !== null}
    {@const op = getNaryInfixOp(node)!}
    {@const nary = node as Nary}
    <div class="mul">
      {#each nary.children as child, i}
        {#if i > 0}
          <button
            class="op"
            aria-label="Select operator"
            onclick={(e) => {
              e.stopPropagation();
              selectSelf();
            }}
          >
            {op}
          </button>
        {/if}
        <div class="child">
          <EquationNode
            node={child}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
      {/each}
    </div>
  {:else if node instanceof Not}
    <div class="mul">
      <button
        class="op"
        aria-label="Select not"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        ¬
      </button>
      {#each (node as Not).children as child}
        <div class="child">
          <EquationNode
            node={child}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
      {/each}
    </div>
  {:else if node instanceof Max || node instanceof Min}
    {@const label = node instanceof Max ? "max" : "min"}
    <div class="fn-call">
      <button
        class="op fn-label"
        aria-label="Select {label}"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        {label}
      </button>
      <span class="paren">(</span>
      {#each (node as Nary).children as child, i}
        {#if i > 0}<span class="comma">,</span>{/if}
        <div class="child">
          <EquationNode
            node={child}
            selectedId={selectedId}
            displayName={displayName}
            onSelect={onSelect}
          />
        </div>
      {/each}
      <span class="paren">)</span>
    </div>
  {:else if node instanceof Piecewise}
    {@const pw = node as Piecewise}
    <div class="piecewise">
      <button
        class="op fn-label"
        aria-label="Select piecewise"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        cases
      </button>
      <div class="pieces">
        {#each pw.children as child, i}
          {#if i % 2 === 0}
            <div class="piece">
              <div class="child">
                <EquationNode
                  node={child}
                  selectedId={selectedId}
                  displayName={displayName}
                  onSelect={onSelect}
                />
              </div>
              <span class="if-label">
                {i + 1 < pw.children.length ? "if" : "else"}
              </span>
              {#if i + 1 < pw.children.length}
                <div class="child">
                  <EquationNode
                    node={pw.children[i + 1]}
                    selectedId={selectedId}
                    displayName={displayName}
                    onSelect={onSelect}
                  />
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {:else if node instanceof Log}
    <div class="fn-call">
      <button
        class="op fn-label"
        aria-label="Select log"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        log
      </button>
      <div class="sub-node">
        <EquationNode
          node={(node as Log).base}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <span class="paren">(</span>
      <div class="child">
        <EquationNode
          node={(node as Log).child}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <span class="paren">)</span>
    </div>
  {:else if node instanceof Sqrt}
    <div class="fn-call">
      <button
        class="op fn-label"
        aria-label="Select sqrt"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        √
      </button>
      <div class="sub-node">
        <EquationNode
          node={(node as Sqrt).base}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <span class="paren">(</span>
      <div class="child">
        <EquationNode
          node={(node as Sqrt).child}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      <span class="paren">)</span>
    </div>
  {:else if node instanceof Unary}
    {@const label = getUnaryLabel(node)}
    {@const isPostfix = node instanceof Factorial}
    <div class="fn-call">
      {#if !isPostfix}
        <button
          class="op fn-label"
          aria-label="Select {label}"
          onclick={(e) => {
            e.stopPropagation();
            selectSelf();
          }}
        >
          {label}
        </button>
        <span class="paren">(</span>
      {/if}
      <div class="child">
        <EquationNode
          node={(node as Unary).child}
          selectedId={selectedId}
          displayName={displayName}
          onSelect={onSelect}
        />
      </div>
      {#if isPostfix}
        <button
          class="op fn-label"
          aria-label="Select factorial"
          onclick={(e) => {
            e.stopPropagation();
            selectSelf();
          }}
        >
          !
        </button>
      {:else}
        <span class="paren">)</span>
      {/if}
    </div>
  {:else if node instanceof Name}
    <div class="leaf">
      <span class="value">{defaultValue(displayName, node.name)}</span>
    </div>
  {:else if node instanceof Num}
    <div class="leaf">
      <span class="value">{node.value}</span>
    </div>
  {:else}
    <div class="leaf">
      <span class="value">Unknown node type {node}</span>
    </div>
  {/if}
</div>

<style>
  .node {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: var(--shadow);
    border: var(--border);
    border-radius: var(--border-radius);
    background: #fafafa;
    padding: 0.75rem;
  }

  .node[data-selected="true"] {
    box-shadow: var(--shadow);
    border-color: var(--primary);
    background: rgb(from var(--primary) r g b / 5%);
  }

  .divide {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .mul {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .fn-call {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .piecewise {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .pieces {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .piece {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .child {
    flex: 1;
  }

  .sub-node {
    align-self: flex-end;
    margin-bottom: 0.1rem;
    font-size: 0.7rem;
  }

  .op {
    display: grid;
    place-items: center;
    cursor: pointer;
    border: var(--border-primary);
    border-radius: var(--border-radius);
    background: var(--primary);
    padding: 0;
    width: 2.5rem;
    height: 2.5rem;
    color: #fff;
    font-weight: 700;
    line-height: 1;
  }

  .fn-label {
    padding: 0 0.6rem;
    width: auto;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
  }

  .paren {
    color: #6b7280;
    font-weight: 500;
    font-size: 1.1rem;
    line-height: 1;
    user-select: none;
  }

  .comma {
    color: #6b7280;
    font-weight: 500;
    user-select: none;
  }

  .if-label {
    color: #6b7280;
    font-style: italic;
    font-size: 0.8rem;
    user-select: none;
  }

  .leaf {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.35rem;
    border-radius: var(--round);
    background: #e2e8f0;
    padding: 0.35rem 0.55rem;
    color: #1f2937;
    font-weight: 600;
  }

  .badge {
    color: #4b5563;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .value {
    font-size: 1rem;
  }
</style>
