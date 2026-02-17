import { Base, Binary, Name } from "./base";

///////////////////////////////////////////////////////////////////////////////
// Binary fns
///////////////////////////////////////////////////////////////////////////////

export class Pow extends Binary {
  constructor(
    public left: Base,
    public right: Base,
  ) {
    super();
  }
  default(): Pow {
    return new Pow(Name.prototype.default(), Name.prototype.default());
  }

  toJs(): string {
    return `(${this.left.toJs()}) ** (${this.right.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `(${this.left.toPy(displayNames)}) ** (${this.right.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `{${this.left.toTex(texNames)}}^{${this.right.toTex(texNames)}}`;
  }
}

export class Implies extends Binary {
  constructor(
    public left: Base,
    public right: Base,
  ) {
    super();
  }
  default(): Implies {
    return new Implies(Name.prototype.default(), Name.prototype.default());
  }

  toJs(): string {
    return `(!(${this.left.toJs()}) || (${this.right.toJs()}))`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `((not ${this.left.toPy(displayNames)}) or (${this.right.toPy(displayNames)}))`;
  }

  toTex(texNames: Map<string, string>): string {
    return `${this.left.toTex(texNames)} \\Rightarrow ${this.right.toTex(texNames)}`;
  }
}
