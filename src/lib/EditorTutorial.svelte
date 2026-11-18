<!--
  @component

  Guided, step-by-step overlay for the model editors. A `<dialog popover="manual">`
  so it sits in the top layer above the (modal) editor and — after re-raising
  itself — above the nested equation-editor popover it drives the user into. A
  modal dialog can't be used: showModal() closes every open auto popover,
  including that equation editor. Focus moves into the card and returns to the
  trigger on exit; ←/→/Esc are handled on the dialog itself. The spotlight and
  card are tethered to the step's target with CSS anchor positioning, falling
  back to measured coordinates where that is unsupported.

  Start it imperatively:

  ```svelte
  <EditorTutorial bind:this={tour} steps={steps} openEqEditor={...} closeEqEditor={...} />
  <Button onclick={() => tour.start()}>Tutorial</Button>
  ```
-->
<script lang="ts">
  import { tick } from "svelte";
  import type { TutorialStep } from "./tutorial";

  let {
    steps,
    openEqEditor,
    closeEqEditor,
  }: {
    steps: TutorialStep[];
    openEqEditor: () => Promise<void> | void;
    closeEqEditor: () => void;
  } = $props();

  const uid = $props.id();
  const ANCHOR = "--tour-target";
  const supportsAnchor =
    typeof CSS !== "undefined" && CSS.supports("top", "anchor(top)");

  let el = $state<HTMLDialogElement>();
  let nextButton = $state<HTMLButtonElement>();
  let open = $state(false);
  let index = $state(0);
  let rect = $state<DOMRect | null>(null);
  let hasTarget = $state(false);
  // Whether the equation-editor popover is currently open on our behalf.
  let eqOpen = false;
  let anchored: HTMLElement | null = null;
  let returnFocus: HTMLElement | null = null;

  export async function start(): Promise<void> {
    returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    open = true;
    index = 0;
    eqOpen = false;
    rect = null;
    await tick();
    await goto(0);
  }

  // Move the overlay to the front of the top layer. Popovers stack in the order
  // they entered it, so after opening the equation editor we must re-enter to
  // stay on top. Hiding + showing in one task avoids a visible flash.
  function raise(): void {
    if (!el) return;
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }

  function setAnchor(target: HTMLElement | null): void {
    anchored?.style.removeProperty("anchor-name");
    anchored = target;
    target?.style.setProperty("anchor-name", ANCHOR);
  }

  // Bring the step's target into view (only when the step changes, so the
  // user can still scroll away) and tether the spotlight to it.
  async function focusTarget(): Promise<void> {
    await tick();
    const target = steps[index]?.target?.() ?? null;
    hasTarget = target !== null;
    setAnchor(target);
    target?.scrollIntoView({ block: "center", inline: "center" });
    measure();
  }

  // Fallback positioning only: anchor positioning follows the target itself.
  function measure(): void {
    if (supportsAnchor) return;
    rect = anchored?.getBoundingClientRect() ?? null;
  }

  async function goto(next: number): Promise<void> {
    const step = steps[next];
    if (!step) return;

    // Reconcile the equation editor with what this step needs. Equation steps
    // re-open it every time, because advancing the tour light-dismisses the
    // popover (the card sits outside it).
    if (step.requiresEqEditor) {
      await openEqEditor();
      eqOpen = true;
    } else if (eqOpen) {
      closeEqEditor();
      eqOpen = false;
    }

    index = next;
    await step.onEnter?.();
    raise();
    await focusTarget();
    nextButton?.focus();
  }

  function nextStep(): void {
    if (index >= steps.length - 1) {
      finish();
    } else {
      goto(index + 1);
    }
  }

  function prevStep(): void {
    if (index > 0) goto(index - 1);
  }

  function finish(): void {
    if (eqOpen) {
      closeEqEditor();
      eqOpen = false;
    }
    if (el?.matches(":popover-open")) el.hidePopover();
    setAnchor(null);
    open = false;
    rect = null;
    hasTarget = false;
    returnFocus?.focus();
    returnFocus = null;
  }

  // Keys only while focus is in the tour, so typing in an editor field never
  // advances it. preventDefault on Esc also keeps the modal editor underneath
  // from treating it as its own close request.
  function onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      finish();
    } else if (event.key === "ArrowRight") {
      nextStep();
    } else if (event.key === "ArrowLeft") {
      prevStep();
    }
  }

  $effect(() => {
    if (!open || supportsAnchor) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  });

  let cardStyle = $derived.by(() => {
    if (supportsAnchor || typeof window === "undefined") return "";
    const width = Math.min(360, window.innerWidth - 32);
    if (!rect) {
      return `width:${width}px; top:50%; left:50%; transform:translate(-50%,-50%);`;
    }
    const margin = 16;
    const left = Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - width - margin),
    );
    const estHeight = 220;
    const top =
      window.innerHeight - rect.bottom > estHeight + margin
        ? rect.bottom + margin
        : Math.max(margin, rect.top - margin - estHeight);
    return `width:${width}px; top:${top}px; left:${left}px;`;
  });

  let spotlightStyle = $derived(
    !supportsAnchor && rect
      ? `top:${rect.top - 6}px; left:${rect.left - 6}px; width:${rect.width + 12}px; height:${rect.height + 12}px;`
      : "",
  );
</script>

{#if open}
  {@const step = steps[index]}
  <!-- Clicking the dimmed backdrop (not the card) quits the tour. -->
  <dialog
    popover="manual"
    bind:this={el}
    class="tour"
    aria-labelledby="{uid}-title"
    onclick={(event) => {
      if (event.target === event.currentTarget) finish();
    }}
    onkeydown={onKeydown}
  >
    {#if hasTarget}
      <div
        class="spotlight"
        style={spotlightStyle}
      ></div>
    {:else}
      <div class="dim"></div>
    {/if}

    <div
      class="card"
      class:anchored={hasTarget}
      style={cardStyle}
    >
      <div class="card-head">
        <span class="count">{index + 1} / {steps.length}</span>
        <button
          type="button"
          class="quit"
          aria-label="Quit tutorial"
          onclick={finish}>✕</button
        >
      </div>
      <h3 id="{uid}-title">{step.title}</h3>
      <p>{step.body}</p>
      <div class="card-actions">
        <button
          type="button"
          class="ghost"
          disabled={index === 0}
          onclick={prevStep}>Back</button
        >
        <button
          type="button"
          class="primary"
          bind:this={nextButton}
          onclick={nextStep}
          >{index === steps.length - 1 ? "Done" : "Next"}</button
        >
      </div>
    </div>
  </dialog>
{/if}

<style>
  .tour {
    position: fixed;
    margin: 0;
    inset: 0;
    border: none;
    background: transparent;
    padding: 0;
    width: auto;
    max-width: none;
    height: auto;
    max-height: none;
    overflow: visible;
    color: inherit;
  }

  .dim {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
  }

  .spotlight {
    position: fixed;
    transition:
      top 0.2s ease,
      left 0.2s ease,
      width 0.2s ease,
      height 0.2s ease;
    box-shadow:
      0 0 0 9999px rgba(15, 23, 42, 0.55),
      0 0 0 3px var(--color-accent);
    border-radius: var(--radius-md);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .spotlight {
      transition: none;
    }
  }

  @position-try --tour-card-over {
    position-area: center;
    margin: 0;
  }

  /* Tethered to the step target (anchor-name set from script); the inline
     coordinates above are only used where this is unsupported. */
  @supports (top: anchor(top)) {
    .spotlight {
      position-anchor: --tour-target;
      top: calc(anchor(top) - 6px);
      left: calc(anchor(left) - 6px);
      width: calc(anchor-size(width) + 12px);
      height: calc(anchor-size(height) + 12px);
    }

    .card {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(360px, 100dvw - 32px);
    }

    .card.anchored {
      position-anchor: --tour-target;
      position-area: block-end span-inline-end;
      /* Last resort for targets taller than the viewport (whole tables):
         sit on top of the target, which scrollIntoView centred. */
      position-try-fallbacks:
        flip-block,
        flip-inline,
        flip-block flip-inline,
        --tour-card-over;
      transform: none;
      margin: 16px;
      inset: auto;
    }
  }

  .card {
    display: flex;
    position: fixed;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    padding: 1.25rem;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .count {
    color: var(--slate-500);
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
  }

  .quit {
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0.25rem;
    color: var(--slate-500);
    font-size: 1rem;
    line-height: 1;
  }

  .quit:hover {
    color: var(--color-primary);
  }

  h3 {
    margin: 0;
    color: var(--color-primary);
    font-size: 1.05rem;
  }

  p {
    margin: 0;
    color: var(--slate-600);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .card-actions button {
    cursor: pointer;
    border-radius: var(--radius-md);
    padding: 0.4rem 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    font-family: var(--font-sans);
  }

  .ghost {
    border: 1px solid var(--slate-300);
    background: transparent;
    color: var(--slate-600);
  }

  .ghost:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .primary {
    border: none;
    background: var(--color-primary);
    color: var(--color-text-inverse);
  }
</style>
