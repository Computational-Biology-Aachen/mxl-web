import {
  buildNNBlock,
  isNNBlockOwnedWeightName,
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

/**
 * `nnWeights`'s entries owned by `blockId`, per `ModelBuilderBase`'s own
 * naming convention (`isNNBlockOwnedWeightName`) — the subset `toBuilder()`
 * passes as `addNNBlock`'s `trainedWeights` argument so a rebuild preserves
 * fitted values instead of Glorot-reinitializing them. `undefined` (not an
 * empty `Map`) when the block owns no entries yet, matching `addNNBlock`'s
 * own "no override, generate fresh" contract — relevant for a block that
 * was just added this session and has never been through a Save yet.
 *
 * Also returns `undefined` when the *architecture* has since diverged from
 * these weights — resizing depth/width, changing `inputs`, or switching
 * `targetKind` (which resizes the output layer to the new target count) all
 * change which weight names the config now expects, before the next Save
 * ever runs. `addNNBlock`'s `trainedWeights` contract requires an *exact*
 * key-set match and throws otherwise (by design, for a genuine data-loading
 * mismatch) — but every reactive rebuild here (`ModelEditor.svelte`'s
 * `modelView.toBuilder()`, not just an explicit Save) must never throw just
 * because the user is mid-edit. Falling back to a fresh Glorot re-init on
 * mismatch matches `ModelBuilderBase.updateNNBlock`'s own established
 * behavior for exactly this case ("a changed layer stack/input count
 * generally changes which weight even corresponds to which, so there's
 * nothing meaningful to carry over").
 */
function trainedWeightsFor(
  config: NNBlockConfig,
  blockId: string,
  nnWeights: Map<string, number>,
): Map<string, number> | undefined {
  const owned = new Map<string, number>();
  for (const [name, value] of nnWeights) {
    if (isNNBlockOwnedWeightName(name, blockId)) owned.set(name, value);
  }
  if (owned.size === 0) return undefined;

  const { weights: expected } = buildNNBlock({
    name: blockId,
    inputs: config.inputs,
    layers: config.layers,
    seed: config.seed,
    scale: config.scale,
  });
  const matchesArchitecture =
    expected.size === owned.size &&
    [...expected.keys()].every((name) => owned.has(name));
  return matchesArchitecture ? owned : undefined;
}

// Model View
export class ModelView {
  parameters: ParView = [];
  variables: VarView = [];
  assignments: AssView = [];
  reactions: RxnView = [];
  nnBlocks: NNBlockView = [];
  nnWeights: Map<string, number> = new Map();
  readouts: AssView = [];

  constructor(
    parameters: ParView = [],
    variables: VarView = [],
    assignments: AssView = [],
    reactions: RxnView = [],
    nnBlocks: NNBlockView = [],
    nnWeights: Map<string, number> = new Map(),
    readouts: AssView = [],
  ) {
    this.parameters = parameters;
    this.variables = variables;
    this.assignments = assignments;
    this.reactions = reactions;
    this.nnBlocks = nnBlocks;
    this.nnWeights = nnWeights;
    this.readouts = readouts;
  }

  toBuilder(): KineticModelBuilder {
    const builder = new KineticModelBuilder();
    // NN blocks first, deliberately: without an explicit trainedWeights
    // override, addNNBlock Glorot-reinitializes its weights fresh from
    // `seed`, so it would clobber any fitting-updated values already
    // sitting in `this.parameters`/`this.nnWeights` if it ran after the
    // parameter loop below (see ModelBuilderBase.buildMxlweb's identical
    // ordering and doc comment for the same hazard). Passing
    // trainedWeightsFor(...) directly means weights never depend on that
    // ordering trick at all — only `scale` (an ordinary Parameter) still
    // does.
    this.nnBlocks.forEach((el) =>
      builder.addNNBlock(
        el.id,
        {
          inputs: el.inputs,
          layers: el.layers,
          seed: el.seed,
          targetKind: el.targetKind,
          targets: el.targets,
          trained: el.trained,
          scale: el.scale,
          mechanism: el.mechanism,
        },
        trainedWeightsFor(el, el.id, this.nnWeights),
      ),
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
    this.readouts.forEach((el) =>
      builder.addReadout(el.id, {
        fn: el.fn,
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
  nnWeights: Map<string, number> = new Map();
  readouts: AssView = [];

  constructor(
    parameters: ParView = [],
    variables: OdeVarView = [],
    assignments: AssView = [],
    nnBlocks: NNBlockView = [],
    nnWeights: Map<string, number> = new Map(),
    readouts: AssView = [],
  ) {
    this.parameters = parameters;
    this.variables = variables;
    this.assignments = assignments;
    this.nnBlocks = nnBlocks;
    this.nnWeights = nnWeights;
    this.readouts = readouts;
  }

  toBuilder(): OdeModelBuilder {
    const builder = new OdeModelBuilder();
    // NN blocks first, deliberately — see ModelView.toBuilder's identical
    // ordering and doc comment: without an explicit trainedWeights
    // override, addNNBlock Glorot-reinitializes its weights fresh from
    // `seed`, which would clobber fitting-updated values already sitting in
    // `this.parameters`/`this.nnWeights` if it ran after that loop.
    this.nnBlocks.forEach((el) =>
      builder.addNNBlock(
        el.id,
        {
          inputs: el.inputs,
          layers: el.layers,
          seed: el.seed,
          targetKind: el.targetKind,
          targets: el.targets,
          trained: el.trained,
          scale: el.scale,
          mechanism: el.mechanism,
        },
        trainedWeightsFor(el, el.id, this.nnWeights),
      ),
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
    this.readouts.forEach((el) =>
      builder.addReadout(el.id, {
        fn: el.fn,
        displayName: el.displayName,
        texName: el.texName,
      }),
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
