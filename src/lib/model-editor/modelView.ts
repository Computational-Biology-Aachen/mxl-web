import type { Base, Num } from "$lib/mathml";
import { ModelBuilder } from "./modelBuilder";

export type SliderArgs = {
  min: string;
  max: string;
  step: string;
  desc?: string;
};

export type Stoich = {
  name: string;
  value: Num; //
};
export type Stoichiometry = Array<Stoich>;

export type Variable = {
  id: string;
  value: number;
  displayName?: string;
  texName?: string;
  slider?: SliderArgs;
};
export type Parameter = {
  id: string;
  value: number;
  displayName?: string;
  texName?: string;
  slider?: SliderArgs;
};

export type Assign = {
  id: string;
  fn: Base;
  displayName?: string;
  texName?: string;
};

export type Reaction = {
  id: string;
  fn: Base;
  stoichiometry: Stoichiometry;
  displayName?: string;
  texName?: string;
};

// Views

export type VarView = Array<Variable>;
export type ParView = Array<Parameter>;
export type AssView = Array<Assign>;
export type RxnView = Array<Reaction>;

export function idToTex(
  variables: Iterable<Variable>,
  parameters: Iterable<Parameter>,
  assignments: Iterable<Assign>,
  reactions: Iterable<Reaction>,
): Map<string, string> {
  const texNames: Map<string, string> = new Map();

  for (const variable of variables) {
    if (variable.texName) {
      texNames.set(variable.id, variable.texName);
    }
  }
  for (const parameter of parameters) {
    if (parameter.texName) {
      texNames.set(parameter.id, parameter.texName);
    }
  }
  for (const ass of assignments) {
    if (ass.texName) {
      texNames.set(ass.id, ass.texName);
    }
  }
  for (const rxn of reactions) {
    if (rxn.texName) {
      texNames.set(rxn.id, rxn.texName);
    }
  }
  return texNames;
}

export function idToDisplay(
  variables: Iterable<Variable>,
  parameters: Iterable<Parameter>,
  assignments: Iterable<Assign>,
  reactions: Iterable<Reaction>,
): Map<string, string> {
  const displayNames: Map<string, string> = new Map();
  for (const variable of variables) {
    if (variable.displayName) {
      displayNames.set(variable.id, variable.displayName);
    }
  }
  for (const parameter of parameters) {
    if (parameter.displayName) {
      displayNames.set(parameter.id, parameter.displayName);
    }
  }
  for (const ass of assignments) {
    if (ass.displayName) {
      displayNames.set(ass.id, ass.displayName);
    }
  }
  for (const rxn of reactions) {
    if (rxn.displayName) {
      displayNames.set(rxn.id, rxn.displayName);
    }
  }
  return displayNames;
}

// Model View
export class ModelView {
  parameters: VarView = [];
  variables: ParView = [];
  assignments: AssView = [];
  reactions: RxnView = [];

  constructor(
    parameters: VarView = [],
    variables: ParView = [],
    assignments: AssView = [],
    reactions: RxnView = [],
  ) {
    this.parameters = parameters;
    this.variables = variables;
    this.assignments = assignments;
    this.reactions = reactions;
  }

  toBuilder(): ModelBuilder {
    let builder = new ModelBuilder();
    this.parameters.forEach((el) =>
      builder.addParameter(el.id, {
        value: el.value,
        displayName: el.displayName,
        texName: el.texName,
        slider: el.slider,
      }),
    );
    this.variables.forEach((el) =>
      builder.addVariable(el.id, {
        value: el.value,
        displayName: el.displayName,
        texName: el.texName,
        slider: el.slider,
      }),
    );
    this.assignments.forEach((el) =>
      builder.addAssignment(el.id, {
        fn: el.fn,
        displayName: el.displayName,
        texName: el.texName,
      }),
    );
    this.reactions.forEach((el) =>
      builder.addReaction(el.id, {
        fn: el.fn,
        stoichiometry: el.stoichiometry,
        displayName: el.displayName,
        texName: el.texName,
      }),
    );
    return builder;
  }
}
