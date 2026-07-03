import { Num } from "@computational-biology-aachen/mxlweb-core/mathml";
import { tick } from "svelte";
import type { AssView } from "./modelView";

// A single stop in the guided editor tour. `target` is resolved lazily at the
// moment the step is shown, because the element it points at may only be
// mounted once an earlier step has switched tabs or opened the equation editor.
export type TutorialStep = {
  title: string;
  body: string;
  target?: () => HTMLElement | null;
  // Steps flagged here need the equation-editor popover open; the overlay
  // reconciles that state as the user moves in and out of these steps.
  requiresEqEditor?: boolean;
  onEnter?: () => void | Promise<void>;
};

// Everything the shared step list needs to drive an individual editor: which
// tabs exist, how to switch them, and read/write access to the assignments so
// the equation-editor demo always has a row to open.
export type TutorialContext = {
  hasVariables: boolean;
  hasReactions: boolean;
  selectTab: (name: string) => void;
  getAssignments: () => AssView;
  setAssignments: (assignments: AssView) => void;
};

const query = (selector: string) => (): HTMLElement | null =>
  document.querySelector<HTMLElement>(selector);

const DEMO_ID = "tutorial_demo";

export type EditorTutorialController = {
  steps: TutorialStep[];
  openEqEditor: () => Promise<void>;
  closeEqEditor: () => void;
};

export function buildEditorTutorial(
  ctx: TutorialContext,
): EditorTutorialController {
  // Remembers whether the demo assignment was injected for this run, so it can
  // be cleaned up again and the user's model is left untouched.
  let demoAdded = false;
  let eqIdx = 0;

  // Idempotent: safe to call on every equation-editor step. Clicking the tour
  // card light-dismisses the (auto) equation-editor popover, so each step must
  // re-open it rather than trust that a previous step left it open.
  async function openEqEditor(): Promise<void> {
    ctx.selectTab("Assignments");
    await tick();

    // Guarantee a row to open: inject a throwaway assignment when the model has
    // none, and remember to remove it again on close.
    if (ctx.getAssignments().length === 0 && !demoAdded) {
      ctx.setAssignments([
        ...ctx.getAssignments(),
        { id: DEMO_ID, fn: new Num(1), texName: "y" },
      ]);
      demoAdded = true;
      await tick();
    }

    const assignments = ctx.getAssignments();
    eqIdx = demoAdded
      ? assignments.findIndex((assign) => assign.id === DEMO_ID)
      : 0;

    await tick();
    const popover = document.getElementById(`eq-editor-${eqIdx}`);
    if (popover && !popover.matches(":popover-open")) popover.showPopover();
    await tick();
  }

  function closeEqEditor(): void {
    document.getElementById(`eq-editor-${eqIdx}`)?.hidePopover();
    if (demoAdded) {
      ctx.setAssignments(
        ctx.getAssignments().filter((assign) => assign.id !== DEMO_ID),
      );
      demoAdded = false;
    }
  }

  const primaryTab = ctx.hasVariables ? "Variables" : "Parameters";
  const tabNames = [
    ctx.hasVariables ? "variables" : null,
    "parameters",
    "assignments",
    ctx.hasReactions ? "reactions" : null,
  ].filter((name): name is string => name !== null);
  const tabList =
    tabNames.length === 2
      ? tabNames.join(" and ")
      : tabNames.slice(0, -1).join(", ") + ", and " + tabNames.at(-1);

  const steps: TutorialStep[] = [
    {
      title: "Welcome to the model editor",
      body: "This short tour shows you how to inspect and change the model. You can leave any time with Esc, the ✕, or by clicking outside this card.",
    },
    {
      title: "Navigate with the tabs",
      body: `Each tab holds one part of the model — ${tabList}. Click a tab to switch; the table below updates to match.`,
      target: query('[data-tour="tabs"]'),
    },
    {
      title: "Edit values in the table",
      body: "Every row is editable: rename it, change its value, or remove it with the ✕. The search box filters long lists.",
      target: query('[data-tour="table"]'),
      onEnter: () => ctx.selectTab(primaryTab),
    },
    {
      title: "Formulas open a visual editor",
      body: "Equations aren't typed as text. Click the pencil in any formula cell to open the equation editor — let's do that now.",
      target: query('[data-tour="table"]'),
      onEnter: () => ctx.selectTab("Assignments"),
    },
    {
      title: "Build from the palette",
      body: "Pick building blocks — arithmetic, functions, comparisons — to drop into the selected node. Templates give you common rate laws in a single click.",
      target: query('[data-tour="eq-palette"]'),
      requiresEqEditor: true,
    },
    {
      title: "Assemble and preview",
      body: "Click any element to select it, then insert from the palette or set its value. Drag elements to rearrange them, and undo with Ctrl+Z. The preview updates live.",
      target: query('[data-tour="eq-canvas"]'),
      requiresEqEditor: true,
    },
    {
      title: "Save your changes",
      body: "When everything looks right, Save applies your edits and re-runs the simulations. That's the whole editor — enjoy!",
      target: query('[data-tour="save"]'),
    },
  ];

  return { steps, openEqEditor, closeEqEditor };
}
