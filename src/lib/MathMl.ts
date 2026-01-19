export abstract class Base {
  // Acts as a common ancestor for all expression node types
  abstract toJs(): string;
  abstract toPy(): string;
}

export class Symbol extends Base {
  constructor(public readonly name: string) {
    super();
  }

  toJs(): string {
    return this.name;
  }

  toPy(): string {
    return this.name;
  }
}

export class Number extends Base {
  constructor(public readonly value: number) {
    super();
  }

  toJs(): string {
    return `${this.value}`;
  }
  toPy(): string {
    return `${this.value}`;
  }
}



///////////////////////////////////////////////////////////////////////////////
// Unary fns
///////////////////////////////////////////////////////////////////////////////

export class Abs extends Base {
  constructor(public readonly child: Base) {
    super();
  }
  toJs(): string {
    return `Math.abs(${this.child.toJs()})`;
  }
  toPy(): string {
    return `abs(${this.child.toPy()})`;
  }
}

export class Ceiling extends Base {
  constructor(public readonly child: Base) {
    super();
  }
  toJs(): string {
    return `Math.ceil(${this.child.toJs()})`;
  }
  toPy(): string {
    return `ceil(${this.child.toPy()})`;
  }
}

export class Exp extends Base {
  constructor(public readonly child: Base) {
    super();
  }
  toJs(): string {
    return `Math.exp(${this.child.toJs()})`;
  }
  toPy(): string {
    return `math.exp(${this.child.toPy()})`;
  }
}

export class Factorial extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `factorial(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.factorial(${this.child.toPy()})`;
  }
}

export class Floor extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.floor(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.floor(${this.child.toPy()})`;
  }
}

export class Ln extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.log(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.log(${this.child.toPy()})`;
  }
}

export class Log extends Base {
  constructor(public readonly base: Base, public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `(Math.log(${this.child.toJs()}) / Math.log(${this.base.toJs()}))`;
  }

  toPy(): string {
    return `math.log(${this.child.toPy()}, ${this.base.toPy()})`;
  }
}

export class Sqrt extends Base {
  constructor(public readonly base: Base, public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.pow(${this.child.toJs()}, 1 / ${this.base.toJs()})`;
  }

  toPy(): string {
    return `math.pow(${this.child.toPy()}, 1 / ${this.base.toPy()})`;
  }
}

export class Sin extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.sin(${this.child.toPy()})`;
  }
}

export class Cos extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.cos(${this.child.toPy()})`;
  }
}

export class Tan extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.tan(${this.child.toPy()})`;
  }
}

export class Sec extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.cos(${this.child.toPy()})`;
  }
}

export class Csc extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.sin(${this.child.toPy()})`;
  }
}

export class Cot extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.tan(${this.child.toPy()})`;
  }
}

export class Asin extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asin(${this.child.toPy()})`;
  }
}

export class Acos extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acos(${this.child.toPy()})`;
  }
}

export class Atan extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atan(${this.child.toPy()})`;
  }
}

export class Acot extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atan(1 / ${this.child.toPy()})`;
  }
}

export class ArcSec extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acos(1 / ${this.child.toPy()})`;
  }
}

export class ArcCsc extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asin(1 / ${this.child.toPy()})`;
  }
}

export class Sinh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.sinh(${this.child.toPy()})`;
  }
}

export class Cosh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.cosh(${this.child.toPy()})`;
  }
}

export class Tanh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.tanh(${this.child.toPy()})`;
  }
}

export class Sech extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.cosh(${this.child.toPy()})`;
  }
}

export class Csch extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.sinh(${this.child.toPy()})`;
  }
}

export class Coth extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `1 / math.tanh(${this.child.toPy()})`;
  }
}

export class ArcSinh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asinh(${this.child.toPy()})`;
  }
}

export class ArcCosh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acosh(${this.child.toPy()})`;
  }
}

export class ArcTanh extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atanh(${this.child.toPy()})`;
  }
}

export class ArcCsch extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.asinh(1 / ${this.child.toPy()})`;
  }
}

export class ArcSech extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.acosh(1 / ${this.child.toPy()})`;
  }
}

export class ArcCoth extends Base {
  constructor(public readonly child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(1 / ${this.child.toJs()})`;
  }

  toPy(): string {
    return `math.atanh(1 / ${this.child.toPy()})`;
  }
}

export class RateOf extends Base {
  constructor(public readonly target: Base) {
    super();
  }

  toJs(): string {
    return `rateOf(${this.target.toJs()})`;
  }

  toPy(): string {
    return `rate_of(${this.target.toPy()})`;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Binary fns
///////////////////////////////////////////////////////////////////////////////

export class Pow extends Base {
  constructor(public readonly left: Base, public readonly right: Base) {
    super();
  }

  toJs(): string {
    return `(${this.left.toJs()}) ** (${this.right.toJs()})`;
  }

  toPy(): string {
    return `(${this.left.toPy()}) ** (${this.right.toPy()})`;
  }
}

export class Implies extends Base {
  constructor(public readonly left: Base, public readonly right: Base) {
    super();
  }

  toJs(): string {
    return `(!(${this.left.toJs()}) || (${this.right.toJs()}))`;
  }

  toPy(): string {
    return `((not ${this.left.toPy()}) or (${this.right.toPy()}))`;
  }
}

///////////////////////////////////////////////////////////////////////////////
// n-ary fns
///////////////////////////////////////////////////////////////////////////////

export class FunctionCall extends Base {
  constructor(public readonly name: string, public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return `${this.name}(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `${this.name}(${this.children.map((c) => c.toPy()).join(", ")})`;
  }
}

export class Max extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return `Math.max(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `max(${this.children.map((c) => c.toPy()).join(", ")})`;
  }
}

export class Min extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return `Math.min(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `min(${this.children.map((c) => c.toPy()).join(", ")})`;
  }
}

export class Piecewise extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return `piecewise(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `piecewise(${this.children.map((c) => c.toPy()).join(", ")})`;
  }
}

export class Rem extends Base {
  constructor(public readonly children: Base[]) {
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
}

export class LambdaFn extends Base {
  constructor(public readonly fn: Base, public readonly args: Base[]) {
    super();
  }

  toJs(): string {
    const argList = this.args.map((a) => a.toJs()).join(", ");
    return `(${argList}) => (${this.fn.toJs()})`;
  }

  toPy(): string {
    const argList = this.args.map((a) => a.toPy()).join(", ");
    return `lambda ${argList}: (${this.fn.toPy()})`;
  }
}

export class And extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" && ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" and ");
  }
}

export class Not extends Base {
  constructor(public readonly children: Base[]) {
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
}

export class Or extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" || ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" or ");
  }
}

export class Xor extends Base {
  constructor(public readonly children: Base[]) {
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
}

export class Eq extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) && (${this.children[idx].toJs()} === ${cur})`, "true");
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" == ");
  }
}

export class GreaterEqual extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) && (${this.children[idx].toJs()} >= ${cur})`, "true");
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" >= ");
  }
}

export class GreaterThan extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) && (${this.children[idx].toJs()} > ${cur})`, "true");
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" > ");
  }
}

export class LessEqual extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) && (${this.children[idx].toJs()} <= ${cur})`, "true");
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" <= ");
  }
}

export class LessThan extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "true";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) && (${this.children[idx].toJs()} < ${cur})`, "true");
  }

  toPy(): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy()).join(" < ");
  }
}

export class NotEqual extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "false";
    return this.children
      .map((c) => c.toJs())
      .slice(1)
      .reduce((acc, cur, idx) => `(${acc}) || (${this.children[idx].toJs()} !== ${cur})`, "false");
  }

  toPy(): string {
    if (this.children.length === 0) return "False";
    return this.children.map((c) => c.toPy()).join(" != ");
  }
}

export class Add extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" + ");
  }

  toPy(): string {
    return this.children.map((c) => c.toPy()).join(" + ");
  }
}

export class Minus extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => c.toJs()).reduce((acc, cur) => `(${acc}) - (${cur})`);
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => c.toPy()).reduce((acc, cur) => `(${acc}) - (${cur})`);
  }
}

export class Mul extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((child) => child.toJs()).join(" * ");
  }

  toPy(): string {
    return this.children.map((child) => child.toPy()).join(" * ");
  }
}

export class Divide extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => c.toJs()).reduce((acc, cur) => `(${acc}) / (${cur})`);
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => c.toPy()).reduce((acc, cur) => `(${acc}) / (${cur})`);
  }
}

export class IntDivide extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 0) return "0";
    const expr = this.children.map((c) => c.toJs()).reduce((acc, cur) => `(${acc}) / (${cur})`);
    return `Math.trunc(${expr})`;
  }

  toPy(): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => c.toPy()).reduce((acc, cur) => `(${acc}) // (${cur})`);
  }
}

export class Delay extends Base {
  constructor(public readonly children: Base[]) {
    super();
  }

  toJs(): string {
    return `delay(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(): string {
    return `delay(${this.children.map((c) => c.toPy()).join(", ")})`;
  }
}
