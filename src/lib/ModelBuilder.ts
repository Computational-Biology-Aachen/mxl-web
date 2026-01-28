import type { Base } from "./mathml";

export type Derived = {
  fn: Base;
  args: string[];
};

export type Reaction = {
  fn: Base;
  args: string[];
  stoichiometry: Record<string, number>;
};

export class ModelBuilder {
  parameters: Record<string, number> = {};
  variables: Record<string, number> = {};
  derived: Record<string, Derived> = {};
  reactions: Record<string, Reaction> = {};

  constructor() {}

  // Variables
  addVariable(key: string, value: number) {
    this.variables[key] = value;
    return this;
  }

  updateVariable(key: string, value: number) {
    this.variables[key] = value;
    return this;
  }

  removeVariable(key: string) {
    delete this.variables[key];
    return this;
  }

  // Parameters
  addParameter(key: string, value: number) {
    this.parameters[key] = value;
    return this;
  }

  updateParameter(key: string, value: number) {
    this.parameters[key] = value;
    return this;
  }

  removeParameter(key: string) {
    delete this.parameters[key];
    return this;
  }

  // Derived
  addDerived(key: string, derived: Derived) {
    this.derived[key] = derived;
    return this;
  }

  updateDerived(key: string, derived: Derived) {
    this.derived[key] = derived;
    return this;
  }

  removeDerived(key: string) {
    delete this.derived[key];
    return this;
  }

  // Reactions
  addReaction(key: string, reaction: Reaction) {
    this.reactions[key] = reaction;
    return this;
  }

  updateReaction(key: string, reaction: Reaction) {
    this.reactions[key] = reaction;
    return this;
  }

  removeReaction(key: string) {
    delete this.reactions[key];
    return this;
  }

  sortDependencies(): string[] {
    let order: string[] = [];
    let available: Set<string> = new Set([
      ...Object.keys(this.parameters),
      ...Object.keys(this.variables),
    ]);
    let toSort: Array<{ k: string; args: Set<string> }> = [
      ...Object.entries(this.derived).map((entry) => {
        const [key, val] = entry;
        return { k: key, args: new Set(val.args) };
      }),
      ...Object.entries(this.reactions).map((entry) => {
        const [key, val] = entry;
        return { k: key, args: new Set(val.args) };
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
        available = available.union(args);
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

  buildPython(userParameters: string[]): string {
    const order = this.sortDependencies();
    const remove = new Set(userParameters);
    const parameters = Object.entries(this.parameters)
      .filter((entry) => {
        return !remove.has(entry[0]);
      })
      .map((entry) => {
        let [name, value] = entry;
        return `${name} = ${value}`;
      })
      .join("\n        ");

    const variables = Object.entries(this.variables)
      .map((entry) => {
        return entry[0];
      })
      .join(", ");
    const dxdt = Object.entries(this.variables)
      .map((entry) => {
        return `d${entry[0]}dt`;
      })
      .join(", ");

    // Build derived and reactions
    const fns = order
      .map((name) => {
        if (name in this.derived) {
          const el = this.derived[name].fn;
          return `${name} = ${el.toPy()}`;
        } else {
          // Name in this.reaction
          const el = this.reactions[name].fn;
          return `${name} = ${el.toPy()}`;
        }
      })
      .join("\n        ");

    // Build rhs
    let rhs: Record<string, string> = Object.fromEntries(
      Object.entries(this.variables).map((entry) => [entry[0], ""]),
    );

    Object.entries(this.reactions).forEach((element) => {
      const [rxnName, rxn] = element;

      Object.entries(rxn.stoichiometry).forEach((el) => {
        const [varName, num] = el;
        const prefix = num < 0 ? "-" : "+";
        if (num === -1 || num === 1) {
          rhs[varName] += `${prefix}${rxnName}`;
        } else {
          rhs[varName] += `${prefix}${Math.abs(num)}*${rxnName}`;
        }
      });
    });

    const rhsString = Object.entries(rhs)
      .map((el) => {
        let [name, stoich] = el;
        return `d${name}dt = ${stoich}`;
      })
      .join("\n        ");

    return `def model(
      time: float,
      variables: float,
      ${userParameters.map((i) => `${i}: float`).join(",\n      ")}
    ):
        ${variables} = variables
        ${parameters}
        ${fns}
        ${rhsString}
        return [${dxdt}]
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
