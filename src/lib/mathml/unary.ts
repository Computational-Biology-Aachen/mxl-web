import { Base, Unary } from "./base";

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
