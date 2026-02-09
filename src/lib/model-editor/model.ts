import { Add, Minus, Mul, Name, Num } from "$lib/mathml";
import { SvelteMap } from "svelte/reactivity";
import type { Base } from "../mathml";

type Args = string[];

export type SliderArgs = { min: string; max: string; step: string };
export type Variable = { value: number; slider?: SliderArgs };

export type Stoich = { name: string; value: Num };
export type Stoichiometry = Array<Stoich>;

export type Assign = {
  fn: Base;
};

export type Reaction = {
  fn: Base;
  stoichiometry: Stoichiometry;
};

// Views
export type VarView = Array<[string, number]>;
export type ParView = Array<[string, number]>;
export type AssView = Array<[string, Assign]>;
export type RxnView = Array<[string, Reaction]>;
export class ModelView {
  parameters: Array<[string, number]> = [];
  variables: Array<[string, number]> = [];
  assignments: Array<[string, Assign]> = [];
  reactions: Array<[string, Reaction]> = [];
  constructor() {}

  toBuilder(): ModelBuilder {
    let builder = new ModelBuilder();
    this.parameters.forEach(([name, val]) => builder.addParameter(name, val));
    this.variables.forEach(([name, val]) => builder.addVariable(name, val));
    this.assignments.forEach(([name, val]) => builder.addAssignment(name, val));
    this.reactions.forEach(([name, val]) => builder.addReaction(name, val));
    return builder;
  }
}

export function stoichToJs(stoich: Stoichiometry): string {
  return "";
}
export function stoichToPy(stoich: Stoichiometry): string {
  return "";
}
export function stoichToTex(stoich: Stoichiometry): string {
  return stoich
    .map(({ name, value }) => {
      const newName = new Name(name);

      if (value.value === 1.0) {
        return newName;
      }
      if (value.value === -1.0) {
        return new Minus([newName]);
      }
      return new Mul([value, newName]);
    })
    .reduce((previous, current) => {
      if (current.constructor.name === "Minus") {
        return new Minus([previous, ...(current as Minus).children]);
      }
      if (current.constructor.name === "Mul") {
        if ((current as Mul).children[0].constructor.name === "Minus") {
          return new Minus([previous, ...(current as Minus).children]);
        }
      }
      return new Add([previous, current]);
    })
    .toTex();
}

export class ModelBuilder {
  parameters: SvelteMap<string, number> = new SvelteMap();
  variables: SvelteMap<string, number> = new SvelteMap();
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
  addVariable(key: string, value: number) {
    this.variables.set(key, value);
    return this;
  }

  updateVariable(key: string, value: number) {
    this.variables.set(key, value);
    return this;
  }

  removeVariable(key: string) {
    this.variables.delete(key);
    return this;
  }
  renameVariable(key: string, newKey: string) {
    this.variables.set(newKey, this.variables.get(key) || 0.0);
    this.removeVariable(key);
  }

  // Parameters
  addParameter(key: string, value: number) {
    this.parameters.set(key, value);
    return this;
  }

  updateParameter(key: string, value: number) {
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

    console.log("toSort", toSort);

    const maxIters = toSort.length * toSort.length;

    let lastName = "";
    for (let i = 0; i < maxIters; i++) {
      const el = toSort.shift();

      if (el === undefined) {
        break;
      }
      const { k, args } = el;
      console.log(k, args);
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
    console.log("toSort", toSort);
    return order;
  }

  buildPython(userParameters: string[]): string {
    const order = this.sortDependencies();
    console.log("Order", order);

    const remove = new Set(userParameters);
    const parameters = this.parameters
      .entries()
      .filter((entry) => {
        return !remove.has(entry[0]);
      })
      .map((entry) => {
        let [name, value] = entry;
        return `${name} = ${value}`;
      })
      .toArray()
      .join("\n    ");

    const variables = this.variables
      .entries()
      .map((entry) => {
        return entry[0];
      })
      .toArray()
      .join(", ");

    const dxdt = this.variables
      .entries()
      .map((entry) => {
        return `d${entry[0]}dt`;
      })
      .toArray()
      .join(", ");

    // Build assignments and reactions
    const fns = order
      .map((name) => {
        if (this.assignments.has(name)) {
          const el = this.assignments.get(name)!.fn;
          return `${name} = ${el.toPy()}`;
        } else {
          // Name in this.reaction
          const el = this.reactions.get(name)!.fn;
          return `${name} = ${el.toPy()}`;
        }
      })
      .join("\n    ");

    // Build rhs
    let rhs: Record<string, string> = Object.fromEntries(
      this.variables.entries().map((entry) => [entry[0], ""]),
    );

    this.reactions.entries().forEach((element) => {
      const [rxnName, rxn] = element;

      rxn.stoichiometry.forEach(({ name: varName, value: num }) => {
        const prefix = num.value < 0 ? "-" : "+";
        if (num.value === -1 || num.value === 1) {
          rhs[varName] += `${prefix}${rxnName}`;
        } else {
          rhs[varName] += `${prefix}${Math.abs(num.value)}*${rxnName}`;
        }
      });
    });

    const rhsString = Object.entries(rhs)
      .map((el) => {
        let [name, stoich] = el;
        return `d${name}dt = ${stoich.length > 0 ? stoich : "0"}`;
      })
      .join("\n    ");

    const extraArgs = `${userParameters.map((i) => `${i}: float`).join(",\n    ")}`;

    const y0 = this.variables
      .entries()
      .map(([name, value]) => `"${name}": ${value}`)
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
}
