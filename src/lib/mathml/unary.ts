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
  toPy(displayNames: Map<string, string>): string {
    return `abs(${this.child.toPy(displayNames)})`;
  }
  toTex(texNames: Map<string, string>): string {
    return `abs(${this.child.toTex(texNames)})`;
  }
  toSBML(): string {
    return `<apply><abs/>${this.child.toSBML()}</apply>`;
  }
}

export class Ceiling extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.ceil(${this.child.toJs()})`;
  }
  toPy(displayNames: Map<string, string>): string {
    return `ceil(${this.child.toPy(displayNames)})`;
  }
  toTex(texNames: Map<string, string>): string {
    return `\\lceil ${this.child.toTex(texNames)} \\rceil`;
  }
  toSBML(): string {
    return `<apply><ceiling/>${this.child.toSBML()}</apply>`;
  }
}

export class Exp extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.exp(${this.child.toJs()})`;
  }
  toPy(displayNames: Map<string, string>): string {
    return `np.exp(${this.child.toPy(displayNames)})`;
  }
  toTex(texNames: Map<string, string>): string {
    return `e^{${this.child.toTex(texNames)}}`;
  }
  toSBML(): string {
    return `<apply><exp/>${this.child.toSBML()}</apply>`;
  }
}

export class Factorial extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `factorial(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.factorial(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `${this.child.toTex(texNames)}!`;
  }

  toSBML(): string {
    return `<apply><factorial/>${this.child.toSBML()}</apply>`;
  }
}

export class Floor extends Unary {
  constructor(public child: Base) {
    super();
  }
  toJs(): string {
    return `Math.floor(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.floor(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\lfloor ${this.child.toTex(texNames)} \\rfloor`;
  }

  toSBML(): string {
    return `<apply><floor/>${this.child.toSBML()}</apply>`;
  }
}

export class Ln extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.log(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.log(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\ln(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><ln/>${this.child.toSBML()}</apply>`;
  }
}

export class Sin extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sin(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.sin(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\sin(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><sin/>${this.child.toSBML()}</apply>`;
  }
}

export class Cos extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cos(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.cos(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\cos(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><cos/>${this.child.toSBML()}</apply>`;
  }
}

export class Tan extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tan(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.tan(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\tan(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><tan/>${this.child.toSBML()}</apply>`;
  }
}

export class Sec extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cos(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.cos(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\sec(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><sec/>${this.child.toSBML()}</apply>`;
  }
}

export class Csc extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sin(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.sin(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\csc(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><csc/>${this.child.toSBML()}</apply>`;
  }
}

export class Cot extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tan(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.tan(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\cot(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><cot/>${this.child.toSBML()}</apply>`;
  }
}

export class Asin extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.asin(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\arcsin(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arcsin/>${this.child.toSBML()}</apply>`;
  }
}

export class Acos extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.acos(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\arccos(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccos/>${this.child.toSBML()}</apply>`;
  }
}

export class Atan extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.atan(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\arctan(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arctan/>${this.child.toSBML()}</apply>`;
  }
}

export class Acot extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atan(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.atan(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arccot}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccot/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcSec extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acos(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.acos(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arcsec}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arcsec/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcCsc extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asin(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.asin(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arccsc}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccsc/>${this.child.toSBML()}</apply>`;
  }
}

export class Sinh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.sinh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.sinh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\sinh(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><sinh/>${this.child.toSBML()}</apply>`;
  }
}

export class Cosh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.cosh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.cosh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\cosh(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><cosh/>${this.child.toSBML()}</apply>`;
  }
}

export class Tanh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.tanh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.tanh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\tanh(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><tanh/>${this.child.toSBML()}</apply>`;
  }
}

export class Sech extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.cosh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.cosh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{sech}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><sech/>${this.child.toSBML()}</apply>`;
  }
}

export class Csch extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.sinh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.sinh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{csch}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><csch/>${this.child.toSBML()}</apply>`;
  }
}

export class Coth extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `1 / Math.tanh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `1 / np.tanh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\coth(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><coth/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcSinh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.asinh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arcsinh}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arcsinh/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcCosh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.acosh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arccosh}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccosh/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcTanh extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.atanh(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arctanh}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arctanh/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcCsch extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.asinh(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.asinh(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arccsch}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccsch/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcSech extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.acosh(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.acosh(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arcsech}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arcsech/>${this.child.toSBML()}</apply>`;
  }
}

export class ArcCoth extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `Math.atanh(1 / ${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `np.atanh(1 / ${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\text{arccoth}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><arccoth/>${this.child.toSBML()}</apply>`;
  }
}

export class RateOf extends Unary {
  constructor(public child: Base) {
    super();
  }

  toJs(): string {
    return `rateOf(${this.child.toJs()})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `rate_of(${this.child.toPy(displayNames)})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\frac{d}{dt}(${this.child.toTex(texNames)})`;
  }

  toSBML(): string {
    return `<apply><csymbol definitionURL="http://www.sbml.org/sbml/symbols/rateOf">rateOf</csymbol>${this.child.toSBML()}</apply>`;
  }
}
