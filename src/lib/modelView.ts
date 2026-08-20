import {
  KineticModelBuilder,
  type NNBlockConfig,
  OdeModelBuilder,
  SteadyStateModelBuilder,
} from "@computational-biology-aachen/mxlweb-core";
import type { Base } from "@computational-biology-aachen/mxlweb-core/mathml";

export type SliderArgs = {
  min: string;
  max: string;
  step: string;
  desc?: string;
};

export type Stoich = {
  name: string;
  value: Base;
};
export type Stoichiometry = Array<Stoich>;

export type Variable = {
  id: string;
  value: number | Base;
  displayName?: string;
  texName: string;
  slider?: SliderArgs;
};
export type Parameter = {
  id: string;
  value: number;
  displayName?: string;
  texName: string;
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

// A UDE/NODE correction term (ADR 0005 in the mxlweb repo, §2.1/§2.1.3) —
// `id` alongside NNBlockConfig's fields, matching every other *View type's
// own "list entry needs its own id, the builder-side type doesn't" shape.
export type NNBlock = NNBlockConfig & { id: string };

// A variable in a direct-ODE model carries its own dx/dt expression.
export type OdeVariable = Variable & {
  differential: Base;
};

// Views

export type VarView = Array<Variable>;
export type ParView = Array<Parameter>;
export type AssView = Array<Assign>;
export type RxnView = Array<Reaction>;
export type OdeVarView = Array<OdeVariable>;
export type NNBlockView = Array<NNBlock>;

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
  parameters: ParView = [];
  variables: VarView = [];
  assignments: AssView = [];
  reactions: RxnView = [];
  nnBlocks: NNBlockView = [];

  constructor(
    parameters: ParView = [],
    variables: VarView = [],
    assignments: AssView = [],
    reactions: RxnView = [],
    nnBlocks: NNBlockView = [],
  ) {
    this.parameters = parameters;
    this.variables = variables;
    this.assignments = assignments;
    this.reactions = reactions;
    this.nnBlocks = nnBlocks;
  }

  toBuilder(): KineticModelBuilder {
    const builder = new KineticModelBuilder();
    // NN blocks first, deliberately: addNNBlock always Glorot-reinitializes
    // its weights fresh from `seed`, so it would clobber any fitting-updated
    // values already sitting in `this.parameters` if it ran after the
    // parameter loop below (see ModelBuilderBase.buildMxlweb's identical
    // ordering and doc comment for the same hazard).
    this.nnBlocks.forEach((el) =>
      builder.addNNBlock(el.id, {
        inputs: el.inputs,
        depth: el.depth,
        width: el.width,
        seed: el.seed,
        targets: el.targets,
        trained: el.trained,
        scale: el.scale,
        mechanism: el.mechanism,
      }),
    );
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

// Direct-ODE model view: each variable owns its dx/dt; no reactions.
export class OdeModelView {
  parameters: ParView = [];
  variables: OdeVarView = [];
  assignments: AssView = [];
  nnBlocks: NNBlockView = [];

  constructor(
    parameters: ParView = [],
    variables: OdeVarView = [],
    assignments: AssView = [],
    nnBlocks: NNBlockView = [],
  ) {
    this.parameters = parameters;
    this.variables = variables;
    this.assignments = assignments;
    this.nnBlocks = nnBlocks;
  }

  toBuilder(): OdeModelBuilder {
    const builder = new OdeModelBuilder();
    // NN blocks first, deliberately — see ModelView.toBuilder's identical
    // ordering and doc comment: addNNBlock always Glorot-reinitializes its
    // weights fresh from `seed`, which would clobber fitting-updated values
    // already sitting in `this.parameters` if it ran after that loop.
    this.nnBlocks.forEach((el) =>
      builder.addNNBlock(el.id, {
        inputs: el.inputs,
        depth: el.depth,
        width: el.width,
        seed: el.seed,
        targets: el.targets,
        trained: el.trained,
        scale: el.scale,
        mechanism: el.mechanism,
      }),
    );
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
    this.variables.forEach((el) =>
      builder.setDifferential(el.id, el.differential),
    );
    return builder;
  }
}

// Steady-state model view: parameters and algebraic assignments only; no state
// variables and no reactions.
export class SteadyStateModelView {
  parameters: ParView = [];
  assignments: AssView = [];

  constructor(parameters: ParView = [], assignments: AssView = []) {
    this.parameters = parameters;
    this.assignments = assignments;
  }

  toBuilder(): SteadyStateModelBuilder {
    const builder = new SteadyStateModelBuilder();
    this.parameters.forEach((el) =>
      builder.addParameter(el.id, {
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
    return builder;
  }
}
