let idCounter = 0;

export abstract class Base {
  id: number;
  // Acts as a common ancestor for all expression node types
  abstract toJs(): string;
  abstract toPy(): string;
  abstract toTex(): string;
  abstract getSymbols(symbols: Set<string>): Set<string>;
  abstract default(): Base;
  abstract replace(id: number, next: Base): Base;

  constructor() {
    this.id = ++idCounter;
  }
}

export class Name extends Base {
  constructor(public name: string) {
    super();
  }

  default(): Name {
    return new Name("default");
  }
  update(name: string): Base {
    return new Name(name);
  }
  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing name with id ${id}`);
      return next;
    }
    return this;
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

export class Num extends Base {
  constructor(public value: number) {
    super();
  }

  default(): Num {
    return new Num(1.0);
  }
  update(value: number): Base {
    return new Num(value);
  }
  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing name with id ${id}`);
      return next;
    }
    return this;
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

// export class Abs extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }
//   toJs(): string {
//     return `Math.abs(${this.child.toJs()})`;
//   }
//   toPy(): string {
//     return `abs(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Ceiling extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }
//   toJs(): string {
//     return `Math.ceil(${this.child.toJs()})`;
//   }
//   toPy(): string {
//     return `ceil(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Exp extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }
//   toJs(): string {
//     return `Math.exp(${this.child.toJs()})`;
//   }
//   toPy(): string {
//     return `math.exp(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Factorial extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `factorial(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.factorial(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Floor extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.floor(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.floor(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Ln extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.log(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.log(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Log extends Base {
//   constructor(
//     public readonly base: Base,
//     public readonly child: Base,
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `(Math.log(${this.child.toJs()}) / Math.log(${this.base.toJs()}))`;
//   }

//   toPy(): string {
//     return `math.log(${this.child.toPy()}, ${this.base.toPy()})`;
//   }
//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Sqrt extends Base {
//   constructor(
//     public readonly base: Base,
//     public readonly child: Base,
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `Math.pow(${this.child.toJs()}, 1 / ${this.base.toJs()})`;
//   }

//   toPy(): string {
//     return `math.pow(${this.child.toPy()}, 1 / ${this.base.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     this.base.getSymbols(symbols);
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Sin extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.sin(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.sin(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Cos extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.cos(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.cos(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Tan extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.tan(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.tan(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Sec extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.cos(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.cos(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Csc extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.sin(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.sin(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Cot extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.tan(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.tan(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Asin extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.asin(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.asin(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Acos extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.acos(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.acos(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Atan extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.atan(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.atan(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Acot extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.atan(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.atan(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcSec extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.acos(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.acos(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcCsc extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.asin(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.asin(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Sinh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.sinh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.sinh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Cosh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.cosh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.cosh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Tanh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.tanh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.tanh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Sech extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.cosh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.cosh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Csch extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.sinh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.sinh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class Coth extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `1 / Math.tanh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `1 / math.tanh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcSinh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.asinh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.asinh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcCosh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.acosh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.acosh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcTanh extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.atanh(${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.atanh(${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcCsch extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.asinh(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.asinh(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcSech extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.acosh(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.acosh(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class ArcCoth extends Base {
//   constructor(public readonly child: Base) {
//     super();
//   }

//   toJs(): string {
//     return `Math.atanh(1 / ${this.child.toJs()})`;
//   }

//   toPy(): string {
//     return `math.atanh(1 / ${this.child.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.child.getSymbols(symbols);
//   }
// }

// export class RateOf extends Base {
//   constructor(public readonly target: Base) {
//     super();
//   }

//   toJs(): string {
//     return `rateOf(${this.target.toJs()})`;
//   }

//   toPy(): string {
//     return `rate_of(${this.target.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     return this.target.getSymbols(symbols);
//   }
// }

// ///////////////////////////////////////////////////////////////////////////////
// // Binary fns
// ///////////////////////////////////////////////////////////////////////////////

// export class Pow extends Base {
//   constructor(
//     public readonly left: Base,
//     public readonly right: Base,
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `(${this.left.toJs()}) ** (${this.right.toJs()})`;
//   }

//   toPy(): string {
//     return `(${this.left.toPy()}) ** (${this.right.toPy()})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     this.left.getSymbols(symbols);
//     return this.right.getSymbols(symbols);
//   }
// }

// export class Implies extends Base {
//   constructor(
//     public readonly left: Base,
//     public readonly right: Base,
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `(!(${this.left.toJs()}) || (${this.right.toJs()}))`;
//   }

//   toPy(): string {
//     return `((not ${this.left.toPy()}) or (${this.right.toPy()}))`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     this.left.getSymbols(symbols);
//     return this.right.getSymbols(symbols);
//   }
// }

// ///////////////////////////////////////////////////////////////////////////////
// // n-ary fns
// ///////////////////////////////////////////////////////////////////////////////

// export class FunctionCall extends Base {
//   constructor(
//     public readonly name: string,
//     public readonly children: Base[],
//   ) {
//     super();
//   }

//   toJs(): string {
//     return `${this.name}(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `${this.name}(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Max extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return `Math.max(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `max(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Min extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return `Math.min(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `min(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Piecewise extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return `piecewise(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `piecewise(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Rem extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "0";
//     return this.children
//       .map((c) => c.toJs())
//       .reduce((acc, cur) => `(${acc}) % (${cur})`);
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "0";
//     return this.children
//       .map((c) => c.toPy())
//       .reduce((acc, cur) => `(${acc}) % (${cur})`);
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class LambdaFn extends Base {
//   constructor(
//     public readonly fn: Base,
//     public readonly args: Base[],
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

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const arg of this.args) {
//       arg.getSymbols(symbols);
//     }
//     return this.fn.getSymbols(symbols);
//   }
// }

// export class And extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return this.children.map((c) => c.toJs()).join(" && ");
//   }

//   toPy(): string {
//     return this.children.map((c) => c.toPy()).join(" and ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Not extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "!false";
//     if (this.children.length === 1) return `!(${this.children[0].toJs()})`;
//     return `!(${this.children.map((c) => c.toJs()).join(" && ")})`;
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "not False";
//     if (this.children.length === 1) return `not (${this.children[0].toPy()})`;
//     return `not (${this.children.map((c) => c.toPy()).join(" and ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Or extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return this.children.map((c) => c.toJs()).join(" || ");
//   }

//   toPy(): string {
//     return this.children.map((c) => c.toPy()).join(" or ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Xor extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "0";
//     return this.children.map((c) => `(${c.toJs()})`).join(" ^ ");
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "0";
//     return this.children.map((c) => `(${c.toPy()})`).join(" ^ ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Eq extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "true";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) && (${this.children[idx].toJs()} === ${cur})`,
//         "true",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "True";
//     return this.children.map((c) => c.toPy()).join(" == ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class GreaterEqual extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "true";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) && (${this.children[idx].toJs()} >= ${cur})`,
//         "true",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "True";
//     return this.children.map((c) => c.toPy()).join(" >= ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class GreaterThan extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "true";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) && (${this.children[idx].toJs()} > ${cur})`,
//         "true",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "True";
//     return this.children.map((c) => c.toPy()).join(" > ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class LessEqual extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "true";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) && (${this.children[idx].toJs()} <= ${cur})`,
//         "true",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "True";
//     return this.children.map((c) => c.toPy()).join(" <= ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class LessThan extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "true";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) && (${this.children[idx].toJs()} < ${cur})`,
//         "true",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "True";
//     return this.children.map((c) => c.toPy()).join(" < ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class NotEqual extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "false";
//     return this.children
//       .map((c) => c.toJs())
//       .slice(1)
//       .reduce(
//         (acc, cur, idx) =>
//           `(${acc}) || (${this.children[idx].toJs()} !== ${cur})`,
//         "false",
//       );
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "False";
//     return this.children.map((c) => c.toPy()).join(" != ");
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

export class Add extends Base {
  constructor(public children: Base[]) {
    super();
  }
  default(): Add {
    return new Add([Name.prototype.default(), Name.prototype.default()]);
  }
  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing add with id ${id}`);
      return next;
    }
    let changed = false;
    const newChildren = this.children.map((child) => {
      const updated = child.replace(id, next);
      if (updated !== child) changed = true;
      return updated;
    });

    if (!changed) return this;

    const cloned = new Add(newChildren);
    cloned.id = this.id; // preserve node identity for selection
    return cloned;
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

  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }
}

export class Minus extends Base {
  constructor(public children: Base[]) {
    super();
  }

  default(): Minus {
    return new Minus([Name.prototype.default(), Name.prototype.default()]);
  }

  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing add with id ${id}`);
      return next;
    }
    let changed = false;
    const newChildren = this.children.map((child) => {
      const updated = child.replace(id, next);
      if (updated !== child) changed = true;
      return updated;
    });

    if (!changed) return this;

    const cloned = new Add(newChildren);
    cloned.id = this.id; // preserve node identity for selection
    return cloned;
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

  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }
}

export class Mul extends Base {
  constructor(public children: Base[]) {
    super();
  }
  default(): Mul {
    return new Mul([Name.prototype.default(), Name.prototype.default()]);
  }
  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing mul with id ${id}`);
      return next;
    }
    let changed = false;
    const newChildren = this.children.map((child) => {
      const updated = child.replace(id, next);
      if (updated !== child) changed = true;
      return updated;
    });

    if (!changed) return this;

    const cloned = new Mul(newChildren);
    cloned.id = this.id;
    return cloned;
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
  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }
}

export class Divide extends Base {
  constructor(public children: Base[]) {
    super();
  }

  default(): Divide {
    return new Divide([Name.prototype.default(), Name.prototype.default()]);
  }

  replace(id: number, next: Base): Base {
    if (this.id === id) {
      console.log(`Replacing div with id ${id}`);
      return next;
    }
    let changed = false;
    const newChildren = this.children.map((child) => {
      const updated = child.replace(id, next);
      if (updated !== child) changed = true;
      return updated;
    });

    if (!changed) return this;

    const cloned = new Divide(newChildren);
    cloned.id = this.id;
    return cloned;
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

  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }
}

// export class IntDivide extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     if (this.children.length === 0) return "0";
//     const expr = this.children
//       .map((c) => c.toJs())
//       .reduce((acc, cur) => `(${acc}) / (${cur})`);
//     return `Math.trunc(${expr})`;
//   }

//   toPy(): string {
//     if (this.children.length === 0) return "0";
//     return this.children
//       .map((c) => c.toPy())
//       .reduce((acc, cur) => `(${acc}) // (${cur})`);
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }

// export class Delay extends Base {
//   constructor(public readonly children: Base[]) {
//     super();
//   }

//   toJs(): string {
//     return `delay(${this.children.map((c) => c.toJs()).join(", ")})`;
//   }

//   toPy(): string {
//     return `delay(${this.children.map((c) => c.toPy()).join(", ")})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const child of this.children) {
//       child.getSymbols(symbols);
//     }
//     return symbols;
//   }
// }
