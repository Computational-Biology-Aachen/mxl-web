let idCounter = 0;

// Acts as a common ancestor for all expression node types
export abstract class Base {
  id: number;
  abstract toJs(): string;
  abstract toPy(): string;
  abstract toTex(): string;
  abstract getSymbols(symbols: Set<string>): Set<string>;
  abstract default(): Base;
  abstract replace(id: number, next: Base): { node: Base; changed: boolean };

  constructor() {
    this.id = ++idCounter;
  }
}

// Other base classes to reduce code churn
abstract class Nullary extends Base {
  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }
    return { node: this, changed: false };
  }
}

abstract class Unary extends Base {
  abstract child: Base;

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node, changed } = this.child.replace(id, next);
    if (changed) {
      const Constructor = this.constructor as new (child: Base) => this;
      const cloned = new Constructor(node);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }
    return { node: this, changed: false };
  }

  default(): Base {
    const Constructor = this.constructor as new (child: Base) => this;
    return new Constructor(Name.prototype.default());
  }

  getSymbols(symbols: Set<string>): Set<string> {
    return this.child.getSymbols(symbols);
  }
}

abstract class Binary extends Base {
  abstract left: Base;
  abstract right: Base;

  default(): Base {
    const Constructor = this.constructor as new (
      left: Base,
      right: Base,
    ) => this;
    return new Constructor(Name.prototype.default(), Name.prototype.default());
  }

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node: left, changed: changedLeft } = this.left.replace(id, next);
    if (changedLeft) {
      const Constructor = this.constructor as new (
        left: Base,
        right: Base,
      ) => this;
      const cloned = new Constructor(left, this.right);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }

    const { node: right, changed: changedRight } = this.right.replace(id, next);
    if (changedRight) {
      const Constructor = this.constructor as new (
        left: Base,
        right: Base,
      ) => this;
      const cloned = new Constructor(this.left, right);
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }

    return { node: this, changed: false };
  }
  getSymbols(symbols: Set<string>): Set<string> {
    this.left.getSymbols(symbols);
    this.right.getSymbols(symbols);
    return symbols;
  }
}

abstract class Nary extends Base {
  abstract children: Base[];

  default(): Base {
    const Constructor = this.constructor as new (children: Base[]) => this;
    return new Constructor([
      Name.prototype.default(),
      Name.prototype.default(),
    ]);
  }

  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    // Check all children
    const children = this.children.map((child) => {
      return child.replace(id, next);
    });

    if (children.some(({ changed }) => changed)) {
      const Constructor = this.constructor as new (children: Base[]) => this;
      const cloned = new Constructor(children.map(({ node }) => node));
      cloned.id = this.id;
      return { node: cloned, changed: false };
    }
    return { node: this, changed: false };
  }
}

///////////////////////////////////////////////////////////////////////////////
// Nullary fns
// Also didn't belive that is the term, but check it
// https://en.wikipedia.org/wiki/Arity
///////////////////////////////////////////////////////////////////////////////

export class Name extends Nullary {
  constructor(public name: string) {
    super();
  }

  default(): Name {
    return new Name("default");
  }
  update(name: string): Base {
    return new Name(name);
  }
  toJs(): string {
    return this.name;
  }
  toPy(): string {
    return this.name;
  }
  toTex(): string {
    return this.name;
  }
  getSymbols(symbols: Set<string>): Set<string> {
    symbols.add(this.name);
    return symbols;
  }
}

export class Num extends Nullary {
  constructor(public value: number) {
    super();
  }
  default(): Num {
    return new Num(1.0);
  }
  update(value: number): Base {
    return new Num(value);
  }
  toJs(): string {
    return `${this.value}`;
  }
  toPy(): string {
    return `${this.value}`;
  }
  toTex(): string {
    return `${this.value}`;
  }

  getSymbols(symbols: Set<string>): Set<string> {
    return symbols;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Unary fns
///////////////////////////////////////////////////////////////////////////////

export class Abs extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.abs(${this.child.toJs()})`;
  }
  toPy(): string {
    return `abs(${this.child.toPy()})`;
  }
  toTex(): string {
    return `abs(${this.child.toPy()})`;
  }
}

export class Ceiling extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.ceil(${this.child.toJs()})`;
  }
  toPy(): string {
    return `ceil(${this.child.toPy()})`;
  }
  toTex(): string {
    return `\\lceil ${this.child.toTex()} \\rceil`;
  }
}

export class Exp extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.exp(${this.child.toJs()})`;
  }
  toPy(): string {
    return `math.exp(${this.child.toPy()})`;
  }
  toTex(): string {
    return `e^{${this.child.toTex()}}`;
  }
}

export class Factorial extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `factorial(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.factorial(${this.child.toPy()})`;
  }

  toTex(): string {
    return `${this.child.toTex()}!`;
  }
}

export class Floor extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.floor(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.floor(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\lfloor ${this.child.toTex()} \\rfloor`;
  }
}

export class Ln extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.log(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.log(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\ln(${this.child.toTex()})`;
  }
}

export class Sin extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.sin(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\sin(${this.child.toTex()})`;
  }
}

export class Cos extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.cos(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\cos(${this.child.toTex()})`;
  }
}

export class Tan extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.tan(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\tan(${this.child.toTex()})`;
  }
}

export class Sec extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.cos(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\sec(${this.child.toTex()})`;
  }
}

export class Csc extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.sin(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\csc(${this.child.toTex()})`;
  }
}

export class Cot extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.tan(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\cot(${this.child.toTex()})`;
  }
}

export class Asin extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asin(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\arcsin(${this.child.toTex()})`;
  }
}

export class Acos extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acos(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\arccos(${this.child.toTex()})`;
  }
}

export class Atan extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atan(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\arctan(${this.child.toTex()})`;
  }
}

export class Acot extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atan(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arccot}(${this.child.toTex()})`;
  }
}

export class ArcSec extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acos(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arcsec}(${this.child.toTex()})`;
  }
}

export class ArcCsc extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asin(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arccsc}(${this.child.toTex()})`;
  }
}

export class Sinh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.sinh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\sinh(${this.child.toTex()})`;
  }
}

export class Cosh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.cosh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\cosh(${this.child.toTex()})`;
  }
}

export class Tanh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.tanh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\tanh(${this.child.toTex()})`;
  }
}

export class Sech extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.cosh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{sech}(${this.child.toTex()})`;
  }
}

export class Csch extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.sinh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{csch}(${this.child.toTex()})`;
  }
}

export class Coth extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.tanh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\coth(${this.child.toTex()})`;
  }
}

export class ArcSinh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asinh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arcsinh}(${this.child.toTex()})`;
  }
}

export class ArcCosh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acosh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arccosh}(${this.child.toTex()})`;
  }
}

export class ArcTanh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atanh(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arctanh}(${this.child.toTex()})`;
  }
}

export class ArcCsch extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asinh(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arccsch}(${this.child.toTex()})`;
  }
}

export class ArcSech extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acosh(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arcsech}(${this.child.toTex()})`;
  }
}

export class ArcCoth extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atanh(1 / ${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\text{arccoth}(${this.child.toTex()})`;
  }
}

export class RateOf extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `rateOf(${this.child.toJs()})`;
  }

  toPy(): string {
    return `rate_of(${this.child.toPy()})`;
  }

  toTex(): string {
    return `\\frac{d}{dt}(${this.child.toTex()})`;
  }
}

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

///////////////////////////////////////////////////////////////////////////////
// n-ary fns
///////////////////////////////////////////////////////////////////////////////

export class Max extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return `Math.max(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `max(${this.children.map((c) => c.toPy()).join(", ")})`;
  }

  toTex(): string {
    return `\\max(${this.children.map((c) => c.toTex()).join(", ")})`;
  }
}

export class Min extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return `Math.min(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `min(${this.children.map((c) => c.toPy()).join(", ")})`;
  }

  toTex(): string {
    return `\\min(${this.children.map((c) => c.toTex()).join(", ")})`;
  }
}

export class Piecewise extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return `piecewise(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `piecewise(${this.children.map((c) => c.toPy()).join(", ")})`;
  }

  toTex(): string {
    return `\\begin{cases}${this.children.map((c) => c.toTex()).join(" \\\\ ")}\\end{cases}`;
  }
}

export class Rem extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toJs())
      .reduce((acc, cur) => `(${acc}) % (${cur})`);
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy())
      .reduce((acc, cur) => `(${acc}) % (${cur})`);
  }

  toTex(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex())
      .reduce((acc, cur) => `(${acc}) \\bmod (${cur})`);
  }
}

export class And extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" && ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" and ");
  }

  toTex(): string {
    return this.children.map((c) => c.toTex()).join(" \\land ");
  }
}

export class Not extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "!false";
    if (this.children.length === 1) return `!(${this.children[0].toJs()})`;
    return `!(${this.children.map((c) => c.toJs()).join(" && ")})`;
  }

  toPy(): string {
    if (this.children.length === 0) return "not False";
    if (this.children.length === 1) return `not (${this.children[0].toPy()})`;
    return `not (${this.children.map((c) => c.toPy()).join(" and ")})`;
  }

  toTex(): string {
    if (this.children.length === 0) return "\\neg \\text{false}";
    if (this.children.length === 1)
      return `\\neg (${this.children[0].toTex()})`;
    return `\\neg (${this.children.map((c) => c.toTex()).join(" \\land ")})`;
  }
}

export class Or extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" || ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" or ");
  }

  toTex(): string {
    return this.children.map((c) => c.toTex()).join(" \\lor ");
  }
}

export class Xor extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => `(${c.toJs()})`).join(" ^ ");
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => `(${c.toPy()})`).join(" ^ ");
  }

  toTex(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => `(${c.toTex()})`).join(" \\oplus ");
  }
}

export class Eq extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) && (${this.children[idx].toJs()} === ${cur})`,
        "true",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" == ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex()).join(" = ");
  }
}

export class GreaterEqual extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) && (${this.children[idx].toJs()} >= ${cur})`,
        "true",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" >= ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex()).join(" \\geq ");
  }
}

export class GreaterThan extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) && (${this.children[idx].toJs()} > ${cur})`,
        "true",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" > ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex()).join(" > ");
  }
}

export class LessEqual extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) && (${this.children[idx].toJs()} <= ${cur})`,
        "true",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" <= ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex()).join(" \\leq ");
  }
}

export class LessThan extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) && (${this.children[idx].toJs()} < ${cur})`,
        "true",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" < ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex()).join(" < ");
  }
}

export class NotEqual extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "false";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce(
        (acc, cur, idx) =>
          `(${acc}) || (${this.children[idx].toJs()} !== ${cur})`,
        "false",
      );
  }

  toPy(): string {
    if (this.children.length === 0) return "False";
    return this.children.map((c) => c.toPy()).join(" != ");
  }

  toTex(): string {
    if (this.children.length === 0) return "\\text{false}";
    return this.children.map((c) => c.toTex()).join(" \\neq ");
  }
}

export class Add extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" + ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" + ");
  }

  toTex(): string {
    return this.children.map((c) => c.toTex()).join(" + ");
  }
}

export class Minus extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toJs())
      .reduce((acc, cur) => `(${acc}) - (${cur})`);
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy())
      .reduce((acc, cur) => `(${acc}) - (${cur})`);
  }

  toTex(): string {
    return this.children.map((c) => c.toTex()).join(" - ");
  }
}

export class Mul extends Nary {
  constructor(public children: Base[]) {
    super();
  }
  toJs(): string {
    return this.children.map((child) => child.toJs()).join(" * ");
  }
  toPy(): string {
    return this.children.map((child) => child.toPy()).join(" * ");
  }
  toTex(): string {
    return this.children.map((child) => child.toTex()).join(" \\cdot ");
  }
}

export class Divide extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toJs())
      .reduce((acc, cur) => `(${acc}) / (${cur})`);
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy())
      .reduce((acc, cur) => `(${acc}) / (${cur})`);
  }

  toTex(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex())
      .reduce((acc, cur) => `\\frac{${acc}}{${cur}}`);
  }
}

export class IntDivide extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    const expr = this.children
      .map((c) => c.toJs())
      .reduce((acc, cur) => `(${acc}) / (${cur})`);
    return `Math.trunc(${expr})`;
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy())
      .reduce((acc, cur) => `(${acc}) // (${cur})`);
  }

  toTex(): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex())
      .reduce(
        (acc, cur) => `\\left\\lfloor\\frac{${acc}}{${cur}}\\right\\rfloor`,
      );
  }
}

// export class Delay extends Nary {
//   constructor(public children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return `delay(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `delay(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }
// }

///////////////////////////////////////////////////////////////////////////////
// Special n-ary fns
///////////////////////////////////////////////////////////////////////////////

// export class FunctionCall extends Nary {
//   constructor(
//     public name: string,
//     public children: Base[],
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `${this.name}(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `${this.name}(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   toTex(): string {
//     return `\\text{${this.name}}(${this.children.map((c) => c.toTex()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class LambdaFn extends Nary {
//   constructor(
//     public children: Base[],
//     public fn: Base,
//   ) {
//     super();
//   }

//   toJs(): string {
//     const argList = this.args.map((a) => a.toJs()).join(", ");
//     return `(${argList}) => (${this.fn.toJs()})`;
//   }

//   toPy(): string {
//     const argList = this.args.map((a) => a.toPy()).join(", ");
//     return `lambda ${argList}: (${this.fn.toPy()})`;
//   }

//   toTex(): string {
//     const argList = this.args.map((a) => a.toTex()).join(", ");
//     return `\\lambda ${argList}. (${this.fn.toTex()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const arg of this.args) {
//       arg.getSymbols(symbols);
//     }
//     return this.fn.getSymbols(symbols);
//   }
// }
