import { describe, expect, it } from "vitest";
import { Name, Num } from "../../src/lib/mathml/base";
import { Pow, Implies } from "../../src/lib/mathml/binary";
import { Add, Divide, Minus, Mul, Piecewise, LessThan, GreaterThan } from "../../src/lib/mathml/nary";
import {
  Abs,
  Exp,
  Factorial,
  Floor,
  Ln,
  Sin,
  Cos,
  Tan,
} from "../../src/lib/mathml/unary";
import { Log, Sqrt } from "../../src/lib/mathml/unary-special";

const NO_NAMES = new Map<string, string>();

// Helper: build a Name node with a display name override
function nameWithDisplay(id: string, display: string) {
  return { node: new Name(id), map: new Map([[id, display]]) };
}

describe("Num", () => {
  it("toJs", () => expect(new Num(3.14).toJs()).toBe("3.14"));
  it("toPy", () => expect(new Num(2).toPy(NO_NAMES)).toBe("2"));
  it("toTex", () => expect(new Num(0).toTex(NO_NAMES)).toBe("0"));
  it("toSBML", () => expect(new Num(5).toSBML()).toBe("<cn>5</cn>"));
  it("getSymbols returns empty set", () => {
    expect(new Num(1).getSymbols(new Set())).toEqual(new Set());
  });
});

describe("Name", () => {
  it("toJs uses raw name", () => expect(new Name("x").toJs()).toBe("x"));
  it("toPy uses displayName when present", () => {
    const { node, map } = nameWithDisplay("x", "x_var");
    expect(node.toPy(map)).toBe("x_var");
  });
  it("toPy falls back to raw name", () => expect(new Name("x").toPy(NO_NAMES)).toBe("x"));
  it("toTex uses texName when present", () => {
    const m = new Map([["x", "\\alpha"]]);
    expect(new Name("x").toTex(m)).toBe("\\alpha");
  });
  it("toSBML", () => expect(new Name("x").toSBML()).toBe("<ci>x</ci>"));
  it("getSymbols collects name", () => {
    const s = new Name("alpha").getSymbols(new Set());
    expect(s).toContain("alpha");
  });
});

describe("Add", () => {
  const x = new Name("x");
  const y = new Name("y");

  it("toJs joins with +", () => {
    expect(new Add([x, y]).toJs()).toBe("x + y");
  });

  it("toPy joins with +", () => {
    expect(new Add([x, y]).toPy(NO_NAMES)).toBe("x + y");
  });

  it("toTex strips double sign when child is unary Minus", () => {
    // Add([x, Minus([y])]) should render as "x - y" not "x + - y"
    const neg = new Minus([y]);
    expect(new Add([x, neg]).toTex(NO_NAMES)).toBe("x - y");
  });

  it("toSBML wraps in plus", () => {
    expect(new Add([x, y]).toSBML()).toBe(
      "<apply><plus/><ci>x</ci><ci>y</ci></apply>",
    );
  });
});

describe("Minus", () => {
  const x = new Name("x");
  const y = new Name("y");

  it("unary negation", () => {
    expect(new Minus([x]).toJs()).toBe("- x");
    expect(new Minus([x]).toPy(NO_NAMES)).toBe("- x");
    expect(new Minus([x]).toTex(NO_NAMES)).toBe("- x");
  });

  it("binary subtraction", () => {
    expect(new Minus([x, y]).toJs()).toBe("(x) - (y)");
  });
});

describe("Mul", () => {
  const x = new Name("x");
  const y = new Name("y");
  const sum = new Add([x, y]);

  it("toJs wraps Add children in parens", () => {
    expect(new Mul([x, sum]).toJs()).toBe("x * (x + y)");
  });

  it("toTex uses cdot", () => {
    expect(new Mul([x, y]).toTex(NO_NAMES)).toBe("x \\cdot y");
  });
});

describe("Divide", () => {
  const x = new Name("x");
  const y = new Name("y");

  it("toJs", () => expect(new Divide([x, y]).toJs()).toBe("(x) / (y)"));
  it("toPy", () => expect(new Divide([x, y]).toPy(NO_NAMES)).toBe("(x) / (y)"));
  it("toTex uses frac", () => expect(new Divide([x, y]).toTex(NO_NAMES)).toBe("\\frac{x}{y}"));
  it("empty children returns 0", () => expect(new Divide([]).toJs()).toBe("0"));
});

describe("Pow", () => {
  const x = new Name("x");
  const n = new Num(2);

  it("toJs", () => expect(new Pow(x, n).toJs()).toBe("(x) ** (2)"));
  it("toPy", () => expect(new Pow(x, n).toPy(NO_NAMES)).toBe("(x) ** (2)"));
  it("toTex", () => expect(new Pow(x, n).toTex(NO_NAMES)).toBe("{x}^{2}"));
  it("toSBML", () => expect(new Pow(x, n).toSBML()).toBe("<apply><power/><ci>x</ci><cn>2</cn></apply>"));
});

describe("Sin/Cos/Tan", () => {
  const x = new Name("x");

  it("Sin toJs", () => expect(new Sin(x).toJs()).toBe("Math.sin(x)"));
  it("Sin toPy", () => expect(new Sin(x).toPy(NO_NAMES)).toBe("np.sin(x)"));
  it("Sin toTex", () => expect(new Sin(x).toTex(NO_NAMES)).toBe("\\sin(x)"));
  it("Cos toJs", () => expect(new Cos(x).toJs()).toBe("Math.cos(x)"));
  it("Tan toJs", () => expect(new Tan(x).toJs()).toBe("Math.tan(x)"));
});

describe("Exp", () => {
  const x = new Name("x");
  it("toJs", () => expect(new Exp(x).toJs()).toBe("Math.exp(x)"));
  it("toPy", () => expect(new Exp(x).toPy(NO_NAMES)).toBe("np.exp(x)"));
  it("toTex", () => expect(new Exp(x).toTex(NO_NAMES)).toBe("e^{x}"));
});

describe("Ln", () => {
  const x = new Name("x");
  it("toJs", () => expect(new Ln(x).toJs()).toBe("Math.log(x)"));
  it("toPy", () => expect(new Ln(x).toPy(NO_NAMES)).toBe("np.log(x)"));
  it("toTex", () => expect(new Ln(x).toTex(NO_NAMES)).toBe("\\ln(x)"));
  it("toSBML", () => expect(new Ln(x).toSBML()).toBe("<apply><ln/><ci>x</ci></apply>"));
});

describe("Abs", () => {
  const x = new Name("x");
  it("toJs", () => expect(new Abs(x).toJs()).toBe("Math.abs(x)"));
  it("toPy", () => expect(new Abs(x).toPy(NO_NAMES)).toBe("abs(x)"));
});

describe("Floor", () => {
  const x = new Name("x");
  it("toJs", () => expect(new Floor(x).toJs()).toBe("Math.floor(x)"));
  it("toPy", () => expect(new Floor(x).toPy(NO_NAMES)).toBe("np.floor(x)"));
});

describe("Factorial", () => {
  const n = new Name("n");

  it("toJs", () => expect(new Factorial(n).toJs()).toBe("factorial(n)"));
  it("toTex", () => expect(new Factorial(n).toTex(NO_NAMES)).toBe("n!"));
  it("toSBML", () => expect(new Factorial(n).toSBML()).toBe("<apply><factorial/><ci>n</ci></apply>"));

  // BUG: np.factorial does not exist in NumPy; should be math.factorial(n) or scipy.special.factorial(n)
  it("toPy uses valid Python — BUG: uses nonexistent np.factorial", () => {
    const py = new Factorial(n).toPy(NO_NAMES);
    expect(py).not.toContain("np.factorial");
    expect(py).toMatch(/math\.factorial|scipy\.special\.factorial/);
  });
});

describe("Log (with base)", () => {
  const x = new Name("x");
  const base = new Num(10);
  const log10 = new Log(x, base);

  it("toJs uses change-of-base correctly", () => {
    expect(log10.toJs()).toBe("(Math.log(x) / Math.log(10))");
  });

  it("toTex", () => {
    expect(log10.toTex(NO_NAMES)).toBe("\\log_{10}(x)");
  });

  it("toSBML", () => {
    expect(log10.toSBML()).toBe("<apply><log/><logbase><cn>10</cn></logbase><ci>x</ci></apply>");
  });

  // BUG: np.log(x, base) is wrong; numpy log does not accept a base argument
  // Correct: np.log(x) / np.log(base)
  it("toPy uses valid NumPy — BUG: passes base as second arg to np.log", () => {
    const py = log10.toPy(NO_NAMES);
    expect(py).not.toBe("np.log(x, 10)");
    expect(py).toMatch(/np\.log\(x\)\s*\/\s*np\.log\(10\)/);
  });

  it("replace on child returns changed: true", () => {
    const newNode = new Num(42);
    const { changed } = log10.replace(x.id, newNode);
    // BUG: replace returns changed: false even when child was replaced
    expect(changed).toBe(true);
  });

  it("replace on base returns changed: true", () => {
    const newNode = new Num(2);
    const { changed } = log10.replace(base.id, newNode);
    // BUG: same — returns changed: false
    expect(changed).toBe(true);
  });

  it("getSymbols collects child and base symbols", () => {
    const logXY = new Log(new Name("x"), new Name("b"));
    const syms = logXY.getSymbols(new Set());
    expect(syms).toContain("x");
    expect(syms).toContain("b");
  });
});

describe("Sqrt (n-th root)", () => {
  const x = new Name("x");
  const degree = new Num(2);
  const sqrtX = new Sqrt(x, degree);

  it("toJs", () => {
    expect(sqrtX.toJs()).toBe("Math.pow(x, 1 / 2)");
  });

  it("toTex", () => {
    expect(sqrtX.toTex(NO_NAMES)).toBe("\\sqrt[2]{x}");
  });

  it("toSBML", () => {
    expect(sqrtX.toSBML()).toBe("<apply><root/><degree><cn>2</cn></degree><ci>x</ci></apply>");
  });

  it("replace on child returns changed: true", () => {
    const { changed } = sqrtX.replace(x.id, new Num(9));
    // BUG: returns changed: false
    expect(changed).toBe(true);
  });
});

describe("Piecewise", () => {
  const x = new Name("x");
  const zero = new Num(0);
  const one = new Num(1);
  const cond = new LessThan([x, zero]);

  it("toPy with otherwise clause", () => {
    // piecewise(1 if x<0, 0) → "1 if x < 0 else 0"
    const pw = new Piecewise([one, cond, zero]);
    const py = pw.toPy(NO_NAMES);
    expect(py).toBe("1 if x < 0 else 0");
  });

  it("toPy defaults to nan when no otherwise", () => {
    // piecewise(1 if x<0) with no otherwise → "1 if x < 0 else float('nan')"
    const pw = new Piecewise([one, cond]);
    expect(pw.toPy(NO_NAMES)).toBe("1 if x < 0 else float('nan')");
  });

  it("toTex produces cases environment", () => {
    const pw = new Piecewise([one, cond, zero]);
    expect(pw.toTex(NO_NAMES)).toContain("\\begin{cases}");
    expect(pw.toTex(NO_NAMES)).toContain("\\end{cases}");
  });

  it("toSBML with otherwise", () => {
    const pw = new Piecewise([one, cond, zero]);
    const sbml = pw.toSBML();
    expect(sbml).toContain("<piece>");
    expect(sbml).toContain("<otherwise>");
  });
});

describe("Implies", () => {
  const p = new Name("p");
  const q = new Name("q");

  it("toJs is material implication (!p || q)", () => {
    expect(new Implies(p, q).toJs()).toBe("(!(p) || (q))");
  });

  it("toPy", () => {
    expect(new Implies(p, q).toPy(NO_NAMES)).toBe("((not p) or (q))");
  });

  it("toTex", () => {
    expect(new Implies(p, q).toTex(NO_NAMES)).toBe("p \\Rightarrow q");
  });
});

describe("getSymbols — nested expressions", () => {
  it("collects all symbols in deep tree", () => {
    // (a + b) * (c - d)
    const expr = new Mul([
      new Add([new Name("a"), new Name("b")]),
      new Minus([new Name("c"), new Name("d")]),
    ]);
    const syms = expr.getSymbols(new Set());
    expect(syms).toEqual(new Set(["a", "b", "c", "d"]));
  });

  it("does not collect numeric literals", () => {
    const expr = new Add([new Name("x"), new Num(5)]);
    const syms = expr.getSymbols(new Set());
    expect(syms).toEqual(new Set(["x"]));
  });
});

describe("replace — correct tree structure preserved", () => {
  it("Num replace: replaces self when id matches", () => {
    const n = new Num(1);
    const replacement = new Num(99);
    const { node, changed } = n.replace(n.id, replacement);
    expect(changed).toBe(true);
    expect((node as Num).value).toBe(99);
  });

  it("Unary replace: replaces child when id matches", () => {
    const inner = new Name("x");
    const sin = new Sin(inner);
    const replacement = new Name("y");
    const { node, changed } = sin.replace(inner.id, replacement);
    expect(changed).toBe(true);
    expect((node as Sin).child).toBe(replacement);
    // original sin node should be unchanged (new node created)
    expect(sin.child).toBe(inner);
  });

  it("Unary replace: no-op when id not in tree", () => {
    const sin = new Sin(new Name("x"));
    const { node, changed } = sin.replace(-999, new Num(0));
    expect(changed).toBe(false);
    expect(node).toBe(sin);
  });

  it("Binary replace: replaces left child", () => {
    const left = new Name("a");
    const right = new Name("b");
    const pow = new Pow(left, right);
    const { node, changed } = pow.replace(left.id, new Num(2));
    expect(changed).toBe(true);
    expect(((node as Pow).left as Num).value).toBe(2);
  });

  it("Nary replace: replaces one child among many", () => {
    const a = new Name("a");
    const b = new Name("b");
    const c = new Name("c");
    const sum = new Add([a, b, c]);
    const replacement = new Num(0);
    const { node, changed } = sum.replace(b.id, replacement);
    expect(changed).toBe(true);
    const newSum = node as Add;
    expect(newSum.children[0]).toBe(a);
    expect((newSum.children[1] as Num).value).toBe(0);
    expect(newSum.children[2]).toBe(c);
  });
});
