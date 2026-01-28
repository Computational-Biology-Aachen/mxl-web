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

  toPy(): string {
    return `(${this.left.toPy()}) ** (${this.right.toPy()})`;
  }

  toTex(): string {
    return `{${this.left.toTex()}}^{${this.right.toTex()}}`;
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

  toPy(): string {
    return `((not ${this.left.toPy()}) or (${this.right.toPy()}))`;
  }

  toTex(): string {
    return `${this.left.toTex()} \\Rightarrow ${this.right.toTex()}`;
  }
}
