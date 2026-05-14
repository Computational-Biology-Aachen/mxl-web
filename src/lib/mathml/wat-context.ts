export interface WatContext {
  varIndex: Map<string, number>;
  parIndex: Map<string, number>;
  /** Name of the time variable in the model (maps to the $t f64 param) */
  timeVar?: string;
  /** Reaction/assignment names available as WAT named locals ($name) */
  localNames?: Set<string>;
}
