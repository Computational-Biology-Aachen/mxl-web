import { Base, Binary, Name } from "./base";
import type { WatContext } from "./wat-context";

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

  toSBML(): string {
    return `<apply><power/>${this.left.toSBML()}${this.right.toSBML()}</apply>`;
  }
  toWat(ctx: WatContext): string {
    return `(call $math_pow ${this.left.toWat(ctx)} ${this.right.toWat(ctx)})`;
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

  toSBML(): string {
    return `<apply><implies/>${this.left.toSBML()}${this.right.toSBML()}</apply>`;
  }
  toWat(ctx: WatContext): string {
    return `(i32.or (i32.eqz ${this.left.toWat(ctx)}) ${this.right.toWat(ctx)})`;
  }
}
