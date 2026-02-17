import { Base, Nary } from "./base";

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

  toPy(displayNames: Map<string, string>): string {
    return `max(${this.children.map((c) => c.toPy(displayNames)).join(", ")})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\max(${this.children.map((c) => c.toTex(texNames)).join(", ")})`;
  }
}

export class Min extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return `Math.min(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `min(${this.children.map((c) => c.toPy(displayNames)).join(", ")})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\min(${this.children.map((c) => c.toTex(texNames)).join(", ")})`;
  }
}

export class Piecewise extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return `piecewise(${this.children.map((c) => c.toJs()).join(", ")})`;
  }

  toPy(displayNames: Map<string, string>): string {
    return `piecewise(${this.children.map((c) => c.toPy(displayNames)).join(", ")})`;
  }

  toTex(texNames: Map<string, string>): string {
    return `\\begin{cases}${this.children.map((c) => c.toTex(texNames)).join(" \\\\ ")}\\end{cases}`;
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy(displayNames))
      .reduce((acc, cur) => `(${acc}) % (${cur})`);
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex(texNames))
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

  toPy(displayNames: Map<string, string>): string {
    return this.children.map((c) => c.toPy(displayNames)).join(" and ");
  }

  toTex(texNames: Map<string, string>): string {
    return this.children.map((c) => c.toTex(texNames)).join(" \\land ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "not False";
    if (this.children.length === 1)
      return `not (${this.children[0].toPy(displayNames)})`;
    return `not (${this.children.map((c) => c.toPy(displayNames)).join(" and ")})`;
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\neg \\text{false}";
    if (this.children.length === 1)
      return `\\neg (${this.children[0].toTex(texNames)})`;
    return `\\neg (${this.children.map((c) => c.toTex(texNames)).join(" \\land ")})`;
  }
}

export class Or extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" || ");
  }

  toPy(displayNames: Map<string, string>): string {
    return this.children.map((c) => c.toPy(displayNames)).join(" or ");
  }

  toTex(texNames: Map<string, string>): string {
    return this.children.map((c) => c.toTex(texNames)).join(" \\lor ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => `(${c.toPy(displayNames)})`).join(" ^ ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children.map((c) => `(${c.toTex(texNames)})`).join(" \\oplus ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy(displayNames)).join(" == ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex(texNames)).join(" = ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy(displayNames)).join(" >= ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex(texNames)).join(" \\geq ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy(displayNames)).join(" > ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex(texNames)).join(" > ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy(displayNames)).join(" <= ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex(texNames)).join(" \\leq ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "True";
    return this.children.map((c) => c.toPy(displayNames)).join(" < ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{true}";
    return this.children.map((c) => c.toTex(texNames)).join(" < ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "False";
    return this.children.map((c) => c.toPy(displayNames)).join(" != ");
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "\\text{false}";
    return this.children.map((c) => c.toTex(texNames)).join(" \\neq ");
  }
}

export class Add extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    return this.children.map((c) => c.toJs()).join(" + ");
  }

  toPy(displayNames: Map<string, string>): string {
    return this.children.map((c) => c.toPy(displayNames)).join(" + ");
  }

  toTex(texNames: Map<string, string>): string {
    return this.children.map((c) => c.toTex(texNames)).join(" + ");
  }
}

export class Minus extends Nary {
  constructor(public children: Base[]) {
    super();
  }

  toJs(): string {
    if (this.children.length === 1) {
      return `- ${this.children[0].toJs()}`;
    }
    return this.children
      .map((c) => c.toJs())
      .reduce((acc, cur) => `(${acc}) - (${cur})`);
  }

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 1) {
      return `- ${this.children[0].toPy(displayNames)}`;
    }
    return this.children
      .map((c) => c.toPy(displayNames))
      .reduce((acc, cur) => `(${acc}) - (${cur})`);
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 1) {
      return `- ${this.children[0].toTex(texNames)}`;
    }
    return this.children.map((c) => c.toTex(texNames)).join(" - ");
  }
}

export class Mul extends Nary {
  public constructor(public children: Base[]) {
    super();
  }
  toJs(): string {
    return this.children.map((child) => child.toJs()).join(" * ");
  }
  toPy(displayNames: Map<string, string>): string {
    return this.children.map((child) => child.toPy(displayNames)).join(" * ");
  }
  toTex(texNames: Map<string, string>): string {
    return this.children.map((child) => child.toTex(texNames)).join(" \\cdot ");
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy(displayNames))
      .reduce((acc, cur) => `(${acc}) / (${cur})`);
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex(texNames))
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

  toPy(displayNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toPy(displayNames))
      .reduce((acc, cur) => `(${acc}) // (${cur})`);
  }

  toTex(texNames: Map<string, string>): string {
    if (this.children.length === 0) return "0";
    return this.children
      .map((c) => c.toTex(texNames))
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

//   toPy(displayNames: Map<string, string>): string {
//     return `delay(${this.children.map((c) => c.toPy(displayNames)).join(", ")})`;
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

//   toPy(displayNames: Map<string, string>): string {
//     return `${this.name}(${this.children.map((c) => c.toPy(displayNames)).join(", ")})`;
//   }

//   toTex(texNames: Map<string, string>): string {
//     return `\\text{${this.name}}(${this.children.map((c) => c.toTex(texNames)).join(", ")})`;
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

//   toPy(displayNames: Map<string, string>): string {
//     const argList = this.args.map((a) => a.toPy(displayNames)).join(", ");
//     return `lambda ${argList}: (${this.fn.toPy(displayNames)})`;
//   }

//   toTex(texNames: Map<string, string>): string {
//     const argList = this.args.map((a) => a.toTex(texNames)).join(", ");
//     return `\\lambda ${argList}. (${this.fn.toTex(texNames)})`;
//   }

//   getSymbols(symbols: Set<string>): Set<string> {
//     for (const arg of this.args) {
//       arg.getSymbols(symbols);
//     }
//     return this.fn.getSymbols(symbols);
//   }
// }
