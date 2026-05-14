import { Base, Nary } from "./base";
import type { WatContext } from "./wat-context";

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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const -inf)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(call $math_max ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const inf)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(call $math_min ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    const otherwise =
      this.children.length % 2 === 1
        ? this.children[this.children.length - 1].toWat(ctx)
        : `(f64.const 0)`;
    let result = otherwise;
    const lastPair =
      this.children.length % 2 === 1
        ? this.children.length - 3
        : this.children.length - 2;
    for (let i = lastPair; i >= 0; i -= 2) {
      const val = this.children[i].toWat(ctx);
      const cond = this.children[i + 1].toWat(ctx);
      result = `(if (result f64) ${cond} (then ${val}) (else ${result}))`;
    }
    return result;
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 0)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(call $math_rem ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(i32.const 1)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(i32.const 1)`;
    const inner =
      this.children.length === 1
        ? this.children[0].toWat(ctx)
        : this.children
            .map((c) => c.toWat(ctx))
            .reduce((a, b) => `(i32.and ${a} ${b})`);
    return `(i32.eqz ${inner})`;
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(i32.const 0)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(i32.or ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(i32.const 0)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(i32.xor ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 1)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.eq ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 1)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.ge ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 1)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.gt ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 1)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.le ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 1)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.lt ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.and ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length < 2) return `(i32.const 0)`;
    const pairs: string[] = [];
    for (let i = 0; i + 1 < this.children.length; i++) {
      pairs.push(
        `(f64.ne ${this.children[i].toWat(ctx)} ${this.children[i + 1].toWat(ctx)})`,
      );
    }
    return pairs.reduce((a, b) => `(i32.or ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 0)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(f64.add ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 0)`;
    if (this.children.length === 1)
      return `(f64.neg ${this.children[0].toWat(ctx)})`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(f64.sub ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 1)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(f64.mul ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 0)`;
    return this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(f64.div ${a} ${b})`);
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
  toWat(ctx: WatContext): string {
    if (this.children.length === 0) return `(f64.const 0)`;
    const divided = this.children
      .map((c) => c.toWat(ctx))
      .reduce((a, b) => `(f64.div ${a} ${b})`);
    return `(f64.floor ${divided})`;
  }
}
