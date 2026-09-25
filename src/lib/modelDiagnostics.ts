import type { Base } from "@computational-biology-aachen/mxlweb-core/mathml";
import type {
  AssView,
  NNBlockView,
  OdeVarView,
  ParView,
  RxnView,
  VarView,
} from "./modelView";

export type ItemKind =
  "variable" | "parameter" | "assignment" | "reaction" | "readout" | "nnBlock";

export type ItemRef = { kind: ItemKind; id: string };

export type Severity = "error" | "warning";

export type FindingCode =
  | "empty-id"
  | "duplicate-id"
  | "duplicate-name"
  | "undefined-symbol"
  | "cycle"
  | "unknown-stoichiometry-target"
  | "unknown-nn-reference"
  | "unused";

export type Finding = {
  severity: Severity;
  ref: ItemRef;
  code: FindingCode;
  message: string;
};

export type ModelParts = {
  variables: VarView | OdeVarView;
  parameters: ParView;
  assignments: AssView;
  reactions?: RxnView;
  readouts?: AssView;
  nnBlocks?: NNBlockView;
  nnWeights?: Map<string, number>;
};

export type Diagnostics = {
  findings: Finding[];
  /** Items each item reads, keyed by {@link refKey}. */
  dependsOn: Map<string, ItemRef[]>;
  /** Items that read each item, keyed by {@link refKey}. */
  usedBy: Map<string, ItemRef[]>;
};

/** Reserved identifier every expression may reference without defining it. */
const TIME = "time";

export function refKey(ref: ItemRef): string {
  return `${ref.kind}:${ref.id}`;
}

export function findingsFor(
  findings: Finding[],
  kind: ItemKind,
  id: string,
): Finding[] {
  return findings.filter((f) => f.ref.kind === kind && f.ref.id === id);
}

export function countBySeverity(
  findings: Finding[],
  kinds: ItemKind[],
): Record<Severity, number> {
  const counts: Record<Severity, number> = { error: 0, warning: 0 };
  for (const f of findings) {
    if (kinds.includes(f.ref.kind)) counts[f.severity]++;
  }
  return counts;
}

/** First `${prefix}${n}` (n = 0, 1, …) not already taken across the model. */
export function nextFreeId(prefix: string, parts: ModelParts): string {
  const taken = new Set<string>();
  for (const list of [
    parts.variables,
    parts.parameters,
    parts.assignments,
    parts.reactions ?? [],
    parts.readouts ?? [],
    parts.nnBlocks ?? [],
  ]) {
    for (const item of list) taken.add(item.id);
  }
  let n = 0;
  while (taken.has(`${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

function symbolsOf(expr: Base): string[] {
  return [...expr.getSymbols(new Set<string>())];
}

/**
 * Builds the dependency index and runs the validator over one model. Pure:
 * reads only the view arrays, so it can sit in a `$derived`.
 *
 * Symbols in expressions are ids (not display names). `time` is reserved and
 * always defined; NN-block weights are `Name`-addressable through `nnWeights`
 * without being parameters.
 */
export function analyzeModel(parts: ModelParts): Diagnostics {
  const reactions = parts.reactions ?? [];
  const readouts = parts.readouts ?? [];
  const nnBlocks = parts.nnBlocks ?? [];
  const findings: Finding[] = [];

  // Symbol namespace: everything an expression may name.
  const kindById = new Map<string, ItemKind>();
  const groups: Array<[ItemKind, Array<{ id: string; displayName?: string }>]> =
    [
      ["variable", parts.variables],
      ["parameter", parts.parameters],
      ["assignment", parts.assignments],
      ["reaction", reactions],
      ["readout", readouts],
      ["nnBlock", nnBlocks],
    ];

  const seen = new Map<string, ItemRef>();
  for (const [kind, items] of groups) {
    for (const { id } of items) {
      const ref: ItemRef = { kind, id };
      if (id.trim() === "") {
        findings.push({
          severity: "error",
          ref,
          code: "empty-id",
          message: "Name is empty.",
        });
        continue;
      }
      const first = seen.get(id);
      if (first) {
        findings.push({
          severity: "error",
          ref,
          code: "duplicate-id",
          message: `"${id}" is already used by a ${first.kind}.`,
        });
      } else {
        seen.set(id, ref);
        kindById.set(id, kind);
      }
    }
  }

  // Display names end up as identifiers in the Python/SBML exports, so two
  // items sharing one is as ambiguous as sharing an id.
  const seenNames = new Map<string, ItemRef>();
  for (const [kind, items] of groups) {
    for (const { id, displayName } of items) {
      if (seen.get(id)?.kind !== kind || id.trim() === "") continue;
      const name = displayName || id;
      const first = seenNames.get(name);
      if (first && first.id !== id) {
        findings.push({
          severity: "error",
          ref: { kind, id },
          code: "duplicate-name",
          message: `Name "${name}" is already used by a ${first.kind}.`,
        });
      } else {
        seenNames.set(name, { kind, id });
      }
    }
  }

  const refOf = (id: string): ItemRef | undefined => {
    const kind = kindById.get(id);
    return kind ? { kind, id } : undefined;
  };
  const isKnown = (id: string) =>
    id === TIME || kindById.has(id) || (parts.nnWeights?.has(id) ?? false);

  // Dependency index.
  const dependsOn = new Map<string, ItemRef[]>();
  const usedBy = new Map<string, ItemRef[]>();
  const addEdge = (from: ItemRef, toId: string) => {
    const to = refOf(toId);
    if (!to || refKey(to) === refKey(from)) return;
    const deps = dependsOn.get(refKey(from)) ?? [];
    if (deps.some((d) => refKey(d) === refKey(to))) return;
    deps.push(to);
    dependsOn.set(refKey(from), deps);
    const users = usedBy.get(refKey(to)) ?? [];
    users.push(from);
    usedBy.set(refKey(to), users);
  };

  const derivedKinds = new Set<ItemKind>(["assignment", "reaction", "readout"]);
  const readExpr = (owner: ItemRef, expr: Base) => {
    for (const sym of symbolsOf(expr)) {
      if (!isKnown(sym)) {
        findings.push({
          severity: "error",
          ref: owner,
          code: "undefined-symbol",
          message: `"${sym}" is not defined.`,
        });
      }
      if (sym === owner.id && derivedKinds.has(owner.kind)) {
        findings.push({
          severity: "error",
          ref: owner,
          code: "cycle",
          message: `"${sym}" refers to itself.`,
        });
      }
      addEdge(owner, sym);
    }
  };

  for (const v of parts.variables) {
    const ref: ItemRef = { kind: "variable", id: v.id };
    if (typeof v.value !== "number") readExpr(ref, v.value);
    if ("differential" in v) readExpr(ref, v.differential);
  }
  for (const a of parts.assignments) {
    readExpr({ kind: "assignment", id: a.id }, a.fn);
  }
  for (const r of readouts) {
    readExpr({ kind: "readout", id: r.id }, r.fn);
  }
  for (const r of reactions) {
    const ref: ItemRef = { kind: "reaction", id: r.id };
    readExpr(ref, r.fn);
    for (const s of r.stoichiometry) {
      readExpr(ref, s.value);
      if (kindById.get(s.name) !== "variable") {
        findings.push({
          severity: "error",
          ref,
          code: "unknown-stoichiometry-target",
          message: `Stoichiometry names "${s.name}", which is not a variable.`,
        });
      } else {
        addEdge(ref, s.name);
      }
    }
  }
  for (const b of nnBlocks) {
    const ref: ItemRef = { kind: "nnBlock", id: b.id };
    for (const name of [...b.inputs, ...b.targets]) {
      if (!isKnown(name)) {
        findings.push({
          severity: "error",
          ref,
          code: "unknown-nn-reference",
          message: `"${name}" is not defined.`,
        });
      }
      addEdge(ref, name);
    }
  }

  // Cycles: a derived item that can reach itself through derived items.
  const reaches = (start: ItemRef): boolean => {
    const visited = new Set<string>();
    const stack = [...(dependsOn.get(refKey(start)) ?? [])];
    while (stack.length > 0) {
      const next = stack.pop()!;
      if (!derivedKinds.has(next.kind)) continue;
      if (refKey(next) === refKey(start)) return true;
      if (visited.has(refKey(next))) continue;
      visited.add(refKey(next));
      stack.push(...(dependsOn.get(refKey(next)) ?? []));
    }
    return false;
  };
  for (const a of parts.assignments) {
    const ref: ItemRef = { kind: "assignment", id: a.id };
    if (reaches(ref)) {
      findings.push({
        severity: "error",
        ref,
        code: "cycle",
        message: `"${a.id}" depends on itself through a circular definition.`,
      });
    }
  }
  for (const r of reactions) {
    const ref: ItemRef = { kind: "reaction", id: r.id };
    if (reaches(ref)) {
      findings.push({
        severity: "error",
        ref,
        code: "cycle",
        message: `"${r.id}" depends on itself through a circular definition.`,
      });
    }
  }

  // Unused parameters/assignments. Block-owned `${id}_scale` parameters are
  // hidden from the table, so they are never reported.
  const blockScales = new Set(nnBlocks.map((b) => `${b.id}_scale`));
  for (const p of parts.parameters) {
    if (blockScales.has(p.id)) continue;
    const ref: ItemRef = { kind: "parameter", id: p.id };
    if (!usedBy.has(refKey(ref))) {
      findings.push({
        severity: "warning",
        ref,
        code: "unused",
        message: "Not used by anything.",
      });
    }
  }
  for (const a of parts.assignments) {
    const ref: ItemRef = { kind: "assignment", id: a.id };
    if (!usedBy.has(refKey(ref))) {
      findings.push({
        severity: "warning",
        ref,
        code: "unused",
        message: "Not used by anything.",
      });
    }
  }

  return { findings, dependsOn, usedBy };
}
