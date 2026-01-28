import { Base, Name, Num } from "./base";

///////////////////////////////////////////////////////////////////////////////
// Special unary fns
///////////////////////////////////////////////////////////////////////////////

export class Log extends Base {
  constructor(
    public child: Base,
    public base: Base,
  ) {
    super();
  }
  default(): Log {
    return new Log(Name.prototype.default(), new Num(10));
  }
  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node: child, changed: changedChild } = this.child.replace(id, next);
    if (changedChild) {
      const cloned = new Log(child, this.base);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }

    const { node: base, changed: changedBase } = this.base.replace(id, next);
    if (changedBase) {
      const cloned = new Log(this.child, base);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }
    return { node: this, changed: false };
  }

  toJs(): string {
    return `(Math.log(${this.child.toJs()}) / Math.log(${this.base.toJs()}))`;
  }

  toPy(): string {
    return `math.log(${this.child.toPy()}, ${this.base.toPy()})`;
  }

  toTex(): string {
    return `\\log_{${this.base.toTex()}}(${this.child.toTex()})`;
  }

  getSymbols(symbols: Set<string>): Set<string> {
    this.child.getSymbols(symbols);
    this.base.getSymbols(symbols);
    return symbols;
  }
}

export class Sqrt extends Base {
  constructor(
    public child: Base,
    public base: Base,
  ) {
    super();
  }
  default(): Sqrt {
    return new Sqrt(Name.prototype.default(), new Num(2));
  }
  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node: child, changed: changedChild } = this.child.replace(id, next);
    if (changedChild) {
      const cloned = new Sqrt(child, this.base);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }

    const { node: base, changed: changedBase } = this.base.replace(id, next);
    if (changedBase) {
      const cloned = new Sqrt(this.child, base);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }
    return { node: this, changed: false };
  }

  toJs(): string {
    return `Math.pow(${this.child.toJs()}, 1 / ${this.base.toJs()})`;
  }

  toPy(): string {
    return `math.pow(${this.child.toPy()}, 1 / ${this.base.toPy()})`;
  }

  toTex(): string {
    return `\\sqrt[${this.base.toTex()}]{${this.child.toTex()}}`;
  }

  getSymbols(symbols: Set<string>): Set<string> {
    this.child.getSymbols(symbols);
    this.base.getSymbols(symbols);
    return symbols;
  }
}
