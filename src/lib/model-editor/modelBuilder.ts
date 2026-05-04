import { Base, Num } from "$lib/mathml";
import { SvelteMap } from "svelte/reactivity";
import { defaultTexName, defaultValue, renderTerms } from "./modelUtils";
import { type SliderArgs } from "./modelView";

function evalInitialAssignment(
  expr: Base,
  params: Map<string, number>,
): number {
  const names = [...params.keys()];
  const values = [...params.values()];
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...names, `return ${expr.toJs()}`);
    return fn(...values) as number;
  } catch {
    return 0;
  }
}

export type Stoich = {
  name: string;
  value: Base;
};
export type Stoichiometry = Array<Stoich>;

export type Variable = {
  value: number | Base;
  displayName?: string;
  texName?: string;
  slider?: SliderArgs;
};
export type Parameter = {
  value: number;
  displayName?: string;
  texName?: string;
  slider?: SliderArgs;
};

export type Assign = {
  fn: Base;
  displayName?: string;
  texName?: string;
};

export type Reaction = {
  fn: Base;
  stoichiometry: Stoichiometry;
  displayName?: string;
  texName?: string;
};

export function getTexNames(
  variables: Iterable<[string, Variable]>,
  parameters: Iterable<[string, Parameter]>,
  assignments: Iterable<[string, Assign]>,
  reactions: Iterable<[string, Reaction]>,
): Map<string, string> {
  // Get all tex names
  const texNames: Map<string, string> = new Map();

  for (const [name, variable] of variables) {
    if (variable.texName) {
      texNames.set(name, variable.texName || defaultTexName(name));
    }
  }
  for (const [name, parameter] of parameters) {
    if (parameter.texName) {
      texNames.set(name, parameter.texName || defaultTexName(name));
    }
  }
  for (const [name, ass] of assignments) {
    if (ass.texName) {
      texNames.set(name, ass.texName || defaultTexName(name));
    }
  }
  for (const [name, rxn] of reactions) {
    if (rxn.texName) {
      texNames.set(name, rxn.texName || defaultTexName(name));
    }
  }
  return texNames;
}

export class ModelBuilder {
  parameters: SvelteMap<string, Parameter> = new SvelteMap();
  variables: SvelteMap<string, Variable> = new SvelteMap();
  assignments: SvelteMap<string, Assign> = new SvelteMap();
  reactions: SvelteMap<string, Reaction> = new SvelteMap();

  constructor() {}

  resolveInitialValues(): number[] {
    const paramMap = new Map(
      [...this.parameters.entries()].map(([k, v]) => [k, v.value]),
    );
    return [...this.variables.values()].map((v) => {
      if (v.value instanceof Base) {
        return evalInitialAssignment(v.value, paramMap);
      }
      return v.value;
    });
  }

  //
  clone(): ModelBuilder {
    let cl = new ModelBuilder();
    cl.parameters = new SvelteMap(this.parameters);
    cl.variables = new SvelteMap(this.variables);
    cl.assignments = new SvelteMap(this.assignments);
    cl.reactions = new SvelteMap(this.reactions);
    return cl;
  }

  // Variables
  addVariable(key: string, value: Variable) {
    this.variables.set(key, value);
    return this;
  }

  updateVariable(key: string, value: Variable) {
    this.variables.set(key, value);
    return this;
  }

  removeVariable(key: string) {
    this.variables.delete(key);
    return this;
  }

  // Parameters
  addParameter(key: string, value: Parameter) {
    this.parameters.set(key, value);
    return this;
  }

  updateParameter(key: string, value: Parameter) {
    this.parameters.set(key, value);
    return this;
  }

  removeParameter(key: string) {
    this.parameters.delete(key);
    return this;
  }

  // Assignments
  addAssignment(key: string, assignment: Assign) {
    this.assignments.set(key, assignment);
    return this;
  }

  updateAssignment(key: string, assignment: Assign) {
    this.assignments.set(key, assignment);
    return this;
  }

  removeAssignment(key: string) {
    this.assignments.delete(key);
    return this;
  }

  // Reactions
  addReaction(key: string, reaction: Reaction) {
    this.reactions.set(key, reaction);
    return this;
  }

  updateReaction(key: string, reaction: Reaction) {
    this.reactions.set(key, reaction);
    return this;
  }

  removeReaction(key: string) {
    this.reactions.delete(key);
    return this;
  }

  sortDependencies(): string[] {
    let order: string[] = [];
    let available: Set<string> = new Set([
      ...this.parameters.keys(),
      ...this.variables.keys(),
    ]);
    let toSort: Array<{ k: string; args: Set<string> }> = [
      ...this.assignments.entries().map(([key, val]) => {
        return { k: key, args: val.fn.getSymbols(new Set()) };
      }),
      ...this.reactions.entries().map(([key, val]) => {
        return { k: key, args: val.fn.getSymbols(new Set()) };
      }),
    ];

    const maxIters = toSort.length * toSort.length;

    let lastName = "";
    for (let i = 0; i < maxIters; i++) {
      const el = toSort.shift();

      if (el === undefined) {
        break;
      }
      const { k, args } = el;
      if (args.isSubsetOf(available)) {
        available = available.add(k);
        order.push(k);
      } else {
        if (lastName === k) {
          order.push(lastName);
          break;
        }
        toSort.push(el);
        lastName = k;
      }
    }
    return order;
  }

  getNames(): Array<string> {
    return this.variables
      .entries()
      .map(([name, _]) => {
        return name;
      })
      .toArray();
  }

  getDisplayNames(): Map<string, string> {
    const names: Map<string, string> = new Map();

    for (const [id, variable] of this.variables) {
      names.set(id, variable.displayName || id);
    }

    for (const [id, parameter] of this.parameters) {
      names.set(id, parameter.displayName || id);
    }

    for (const [id, ass] of this.assignments) {
      names.set(id, ass.displayName || id);
    }

    for (const [id, rxn] of this.reactions) {
      names.set(id, rxn.displayName || id);
    }

    return names;
  }

  private transitiveDerivedDeps(
    selectedKeys: string[],
    order: string[],
  ): Set<string> {
    const orderSet = new Set(order);
    const needed = new Set<string>();
    const visit = (key: string) => {
      if (needed.has(key) || !orderSet.has(key)) return;
      needed.add(key);
      const entity = this.assignments.get(key) ?? this.reactions.get(key);
      if (entity) {
        for (const sym of entity.fn.getSymbols(new Set())) visit(sym);
      }
    };
    for (const key of selectedKeys) visit(key);
    return needed;
  }

  buildPython(userParameters: string[], selectedDerived?: string[]): string {
    const order = this.sortDependencies();
    const displayNames = this.getDisplayNames();
    const Name = (x: string) => defaultValue(displayNames.get(x), x);

    const remove = new Set(userParameters);
    const parameters = this.parameters
      .entries()
      .filter(([name, _]) => {
        return !remove.has(name);
      })
      .map(([name, value]) => {
        return `${Name(name)} = ${value.value}`;
      })
      .toArray()
      .join("\n    ");

    const variables = this.variables
      .entries()
      .map(([name, _]) => {
        return Name(name);
      })
      .toArray()
      .join(", ");

    const dxdt = this.variables
      .entries()
      .map(([name, _]) => {
        return `d${Name(name)}dt`;
      })
      .toArray()
      .join(", ");

    // Build assignments and reactions
    const fns = order
      .map((name) => {
        if (this.assignments.has(name)) {
          const el = this.assignments.get(name)!.fn;
          return `${Name(name)} = ${el.toPy(displayNames)}`;
        } else {
          const el = this.reactions.get(name)!.fn;
          return `${Name(name)} = ${el.toPy(displayNames)}`;
        }
      })
      .join("\n    ");

    const selectedFns = selectedDerived
      ? (() => {
          const needed = this.transitiveDerivedDeps(selectedDerived, order);
          return order
            .filter((name) => needed.has(name))
            .map((name) => {
              if (this.assignments.has(name)) {
                const el = this.assignments.get(name)!.fn;
                return `${Name(name)} = ${el.toPy(displayNames)}`;
              } else {
                const el = this.reactions.get(name)!.fn;
                return `${Name(name)} = ${el.toPy(displayNames)}`;
              }
            })
            .join("\n    ");
        })()
      : null;

    const selectedDerivedSet = selectedDerived
      ? new Set(selectedDerived)
      : null;
    const selectedReturn = selectedDerived
      ? order
          .filter((name) => selectedDerivedSet!.has(name))
          .map(Name)
          .join(", ")
      : null;

    // Build rhs
    let rhs: Record<string, string> = Object.fromEntries(
      this.variables.entries().map(([name, _]) => [name, ""]),
    );
    this.reactions.entries().forEach((element) => {
      const [rxnName, rxn] = element;

      rxn.stoichiometry.forEach(({ name: varName, value: stoich }) => {
        if (stoich instanceof Num) {
          const prefix = stoich.value < 0 ? "-" : "+";
          if (stoich.value === -1 || stoich.value === 1) {
            rhs[varName] += `${prefix}${Name(rxnName)}`;
          } else {
            rhs[varName] +=
              `${prefix}${Math.abs(stoich.value)}*${Name(rxnName)}`;
          }
        } else {
          rhs[varName] += `+(${stoich.toPy(displayNames)})*${Name(rxnName)}`;
        }
      });
    });

    const rhsString = Object.entries(rhs)
      .map((el) => {
        let [name, stoich] = el;
        return `d${Name(name)}dt = ${stoich.length > 0 ? stoich : "0"}`;
      })
      .join("\n    ");

    const extraArgs = `${userParameters.map((i) => `${i}: float`).join(",\n    ")}`;

    const paramMap = new Map(
      [...this.parameters.entries()].map(([k, v]) => [k, v.value]),
    );
    const y0 = this.variables
      .entries()
      .map(([name, value]) => {
        if (value.value instanceof Base) {
          const numVal = evalInitialAssignment(value.value, paramMap);
          return `"${Name(name)}": ${numVal}`;
        }
        return `"${Name(name)}": ${value.value}`;
      })
      .toArray()
      .join(", ");

    const args = extraArgs.length > 0 ? "\n      " + extraArgs : "";
    const selectedDerivedBlock =
      selectedFns !== null
        ? `
def selected_derived(
    time: float,
    variables: list[float], ${args}
):
    ${variables} = variables
    ${parameters}
    ${selectedFns}
    return [${selectedReturn}]

derived = selected_derived`
        : `
derived = all_derived`;

    return `import numpy as np

def model(
    time: float,
    variables: list[float], ${args}
):
    ${variables} = variables
    ${parameters}
    ${fns}
    ${rhsString}
    return [${dxdt}]

def all_derived(
    time: float,
    variables: list[float], ${args}
):
    ${variables} = variables
    ${parameters}
    ${fns}
    return [${order.map(Name).join(", ")}]
${selectedDerivedBlock}
y0 = {${y0}}
    `;
  }
  buildJs(): string {
    return `
        function model(
          time: number,
          variables: number[],
          parameters: number[],
        ) {
            const [] = variables;


        }`;
  }

  buildTex(): string {
    // Get all tex names
    const texNames: Map<string, string> = getTexNames(
      this.variables.entries(),
      this.parameters.entries(),
      this.assignments.entries(),
      this.reactions.entries(),
    );

    // Collect rhs terms per variable
    const rhs: Record<string, { tex: string; value: Base }[]> =
      Object.fromEntries(
        this.variables.entries().map((entry) => [entry[0], []]),
      );
    this.reactions.entries().forEach(([_, rxn]) => {
      const rxnTex = rxn.fn.toTex(texNames);
      rxn.stoichiometry.forEach(({ name: varName, value: stoich }) => {
        rhs[varName].push({ tex: rxnTex, value: stoich });
      });
    });

    // Finalize rhs
    const rhsString = Object.entries(rhs)
      .map(([name, terms]) => {
        const lines = renderTerms(terms, texNames);
        const rhs = lines.join(" \\\\\n  & ");
        return `\\frac{d ${texNames.get(name) || name}}{dt} &= ${rhs}`;
      })
      .join("\\\\ \n");

    return String.raw`\begin{align*}
      ${rhsString}
    \end{align*}`;
  }
}
