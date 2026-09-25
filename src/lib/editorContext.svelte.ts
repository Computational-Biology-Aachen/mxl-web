import { getContext, setContext } from "svelte";
import {
  analyzeModel,
  type Diagnostics,
  type ItemRef,
  type ModelParts,
} from "./modelDiagnostics";

const KEY = Symbol("model-editor");

/**
 * State shared between a model editor and the tables inside it: the live
 * diagnostics, which row is expanded, and how to jump to another item
 * (possibly on another tab). Provided through context so the tables need no
 * extra props.
 */
export class EditorContext {
  expanded = $state<ItemRef | null>(null);
  #selectTabFor: (ref: ItemRef) => void;
  diagnostics: Diagnostics;
  hasErrors: boolean;
  errorCount: number;

  constructor(
    getParts: () => ModelParts,
    selectTabFor: (ref: ItemRef) => void,
  ) {
    this.#selectTabFor = selectTabFor;
    this.diagnostics = $derived(analyzeModel(getParts()));
    this.hasErrors = $derived(
      this.diagnostics.findings.some((f) => f.severity === "error"),
    );
    this.errorCount = $derived(
      this.diagnostics.findings.filter((f) => f.severity === "error").length,
    );
  }

  navigate(ref: ItemRef) {
    this.#selectTabFor(ref);
    this.expanded = ref;
  }

  isExpanded(ref: ItemRef): boolean {
    return this.expanded?.kind === ref.kind && this.expanded.id === ref.id;
  }

  toggle(ref: ItemRef) {
    this.expanded = this.isExpanded(ref) ? null : ref;
  }
}

export function provideEditorContext(ctx: EditorContext): EditorContext {
  return setContext(KEY, ctx);
}

export function useEditorContext(): EditorContext {
  const ctx = getContext<EditorContext | undefined>(KEY);
  if (!ctx) throw new Error("DataTable used outside a model editor");
  return ctx;
}
