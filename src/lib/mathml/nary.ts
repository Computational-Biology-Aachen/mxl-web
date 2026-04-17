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

  toSBML(): string {
    return `<apply><max/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><min/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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
    const parts: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i += 2) {
      parts.push(
        `${this.children[i].toPy(displayNames)} if ${this.children[i + 1].toPy(displayNames)}`,
      );
    }
    const otherwise =
      this.children.length % 2 === 1
        ? this.children[this.children.length - 1].toPy(displayNames)
        : "float('nan')";
    return (
      parts.join(" else ") +
      (parts.length > 0 ? ` else ${otherwise}` : otherwise)
    );
  }

  toTex(texNames: Map<string, string>): string {
    const parts: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i += 2) {
      parts.push(
        `${this.children[i].toTex(texNames)} & ${this.children[i + 1].toTex(texNames)}`,
      );
    }
    if (this.children.length % 2 === 1) {
      parts.push(
        `${this.children[this.children.length - 1].toTex(texNames)} & \\text{else}`,
      );
    }
    return `\\begin{cases}${parts.join(" \\\\ ")}\\end{cases}`;
  }

  toSBML(): string {
    const parts: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i += 2) {
      parts.push(
        `<piece>${this.children[i].toSBML()}${this.children[i + 1].toSBML()}</piece>`,
      );
    }
    if (this.children.length % 2 === 1) {
      parts.push(
        `<otherwise>${this.children[this.children.length - 1].toSBML()}</otherwise>`,
      );
    }
    return `<piecewise>${parts.join("")}</piecewise>`;
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

  toSBML(): string {
    return `<apply><rem/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><and/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><not/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><or/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><xor/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><eq/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><geq/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><gt/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><leq/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><lt/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><neq/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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
    return this.children
      .map((c, i) => {
        if (i === 0) return c.toTex(texNames);
        if (c instanceof Minus && c.children.length === 1)
          return `- ${c.children[0].toTex(texNames)}`;
        return `+ ${c.toTex(texNames)}`;
      })
      .join(" ");
  }

  toSBML(): string {
    return `<apply><plus/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    return `<apply><minus/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
  }
}

export class Mul extends Nary {
  public constructor(public children: Base[]) {
    super();
  }
  toJs(): string {
    return this.children
      .map((c) => {
        const s = c.toJs();
        return c instanceof Add || c instanceof Minus ? `(${s})` : s;
      })
      .join(" * ");
  }
  toPy(displayNames: Map<string, string>): string {
    return this.children
      .map((c) => {
        const s = c.toPy(displayNames);
        return c instanceof Add || c instanceof Minus ? `(${s})` : s;
      })
      .join(" * ");
  }
  toTex(texNames: Map<string, string>): string {
    return this.children
      .map((c) => {
        const s = c.toTex(texNames);
        return c instanceof Add || c instanceof Minus ? `(${s})` : s;
      })
      .join(" \\cdot ");
  }
  toSBML(): string {
    return `<apply><times/>${this.children.map((c) => c.toSBML()).join("")}</apply>`;
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

  toSBML(): string {
    if (this.children.length === 0) return "<cn>0</cn>";
    return this.children
      .map((c) => c.toSBML())
      .reduce((acc, cur) => `<apply><divide/>${acc}${cur}</apply>`);
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

  toSBML(): string {
    if (this.children.length === 0) return "<cn>0</cn>";
    const divided = this.children
      .map((c) => c.toSBML())
      .reduce((acc, cur) => `<apply><divide/>${acc}${cur}</apply>`);
    return `<apply><floor/>${divided}</apply>`;
  }
}
