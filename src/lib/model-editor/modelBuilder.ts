import { Base, Num } from "$lib/mathml";
import { SvelteMap } from "svelte/reactivity";
import { defaultTexName, defaultValue } from "./modelUtils";
import { type SliderArgs } from "./modelView";

export type Stoich = {
  name: string;
  value: Num; //
};
export type Stoichiometry = Array<Stoich>;

export type Variable = {
  value: number;
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

  //
  clone(): ModelBuilder {
    let cl = new ModelBuilder();
    cl.parameters = this.parameters;
    cl.variables = this.variables;
    cl.assignments = this.assignments;
    cl.reactions = this.reactions;
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
      // console.log(k, args);
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

  // toView(): ModelView {
  //   return new ModelView(
  //     this.parameters
  //       .entries()
  //       .map(([name, value]) => {
  //         return { ...value, id: name };
  //       })
  //       .toArray(),
  //     this.variables
  //       .entries()
  //       .map(([name, value]) => {
  //         return { ...value, id: name };
  //       })
  //       .toArray(),
  //     this.assignments
  //       .entries()
  //       .map(([name, assign]) => {
  //         return { ...assign, id: name };
  //       })
  //       .toArray(),
  //     this.reactions
  //       .entries()
  //       .map(([name, rxn]) => {
  //         return { ...rxn, id: name };
  //       })
  //       .toArray(),
  //   );
  // }

  buildPython(userParameters: string[]): string {
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
          // Name in this.reaction
          const el = this.reactions.get(name)!.fn;
          return `${Name(name)} = ${el.toPy(displayNames)}`;
        }
      })
      .join("\n    ");

    // Build rhs
    let rhs: Record<string, string> = Object.fromEntries(
      this.variables.entries().map(([name, _]) => [name, ""]),
    );
    this.reactions.entries().forEach((element) => {
      const [rxnName, rxn] = element;

      rxn.stoichiometry.forEach(({ name: varName, value: num }) => {
        const prefix = num.value < 0 ? "-" : "+";
        if (num.value === -1 || num.value === 1) {
          rhs[varName] += `${prefix}${Name(rxnName)}`;
        } else {
          rhs[varName] += `${prefix}${Math.abs(num.value)}*${Name(rxnName)}`;
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

    const y0 = this.variables
      .entries()
      .map(([name, value]) => `"${Name(name)}": ${value.value}`)
      .toArray()
      .join(", ");

    return `def model(
    time: float,
    variables: float, ${extraArgs.length > 0 ? "\n      " + extraArgs : ""}
):
    ${variables} = variables
    ${parameters}
    ${fns}
    ${rhsString}
    return [${dxdt}]

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

    // Collect rhs
    let rhs: Record<string, string> = Object.fromEntries(
      this.variables.entries().map((entry) => [entry[0], ""]),
    );
    this.reactions.entries().forEach(([_, rxn]) => {
      rxn.stoichiometry.forEach(({ name: varName, value: num }) => {
        const prefix = num.value < 0 ? "-" : "+";
        const rxnTex = rxn.fn.toTex(texNames);

        if (num.value === -1 || num.value === 1) {
          rhs[varName] += `${prefix}${rxnTex}`;
        } else {
          rhs[varName] += `${prefix}${Math.abs(num.value)}*${rxnTex}`;
        }
      });
    });

    // Finalize rhs
    const rhsString = Object.entries(rhs)
      .map(([name, stoich]) => {
        let stoichFixed = stoich;
        if (stoich.startsWith("+")) stoichFixed = stoich.slice(1);
        return `\\frac{d ${texNames.get(name) || name}}{dt} &= ${stoich.length > 0 ? stoichFixed : "0"}`;
      })
      .join("\\\\ \n");

    return String.raw`\begin{align*}
      ${rhsString}
    \end{align*}`;
  }
}
