/// <reference types="node" />

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadPyodide } from "pyodide";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import wat2wasm from "wat-compiler";
import {
  Abs,
  Acos,
  Acot,
  Add,
  And,
  ArcCosh,
  ArcCoth,
  ArcCsc,
  ArcCsch,
  ArcSec,
  ArcSech,
  ArcSinh,
  ArcTanh,
  Asin,
  Atan,
  Ceiling,
  Cos,
  Cosh,
  Cot,
  Coth,
  Csc,
  Csch,
  Divide,
  Eq,
  Exp,
  Factorial,
  Floor,
  GreaterEqual,
  GreaterThan,
  Implies,
  IntDivide,
  LessEqual,
  LessThan,
  Ln,
  Log,
  Max,
  Min,
  Minus,
  Mul,
  Name,
  Not,
  NotEqual,
  Num,
  Or,
  Piecewise,
  Pow,
  RateOf,
  Rem,
  Sec,
  Sech,
  Sin,
  Sinh,
  Sqrt,
  Tan,
  Tanh,
  Xor,
} from "../../src/lib/mathml";
import type { Base } from "../../src/lib/mathml/base";
import { mathImports } from "../../src/lib/mathml/wat-codegen";
import type { WatContext } from "../../src/lib/mathml/wat-context";

type ParityDepth = "fast" | "deep";
type BackendName = "js" | "py" | "wasm";
type ShapeName = "direct" | "composed";

type EvalOk = { kind: "ok"; value: number | boolean };
type EvalErr = { kind: "error"; message: string };
type EvalResult = EvalOk | EvalErr;

type Sample = {
  x: number;
  y: number;
  z: number;
  p: number;
  q: number;
  t: number;
  b: number;
  n: number;
};

type MismatchRecord = {
  node: string;
  shape: ShapeName;
  sample: Sample;
  jsCode: string;
  pyCode: string;
  watCode: string;
  js: EvalResult;
  py: EvalResult;
  wasm: EvalResult;
  reason: string;
};

type NodeProfile = {
  node: string;
  isBoolean: boolean;
  direct: () => Base;
  accept: (sample: Sample) => boolean;
};

const PARITY_DEPTH: ParityDepth =
  process.env.PARITY_DEPTH === "deep" ? "deep" : "fast";

const DISPLAY_NAMES = new Map<string, string>();
const PARAM_NAMES = ["x", "y", "z", "p", "q", "t", "b", "n"] as const;

const WAT_CTX: WatContext = {
  varIndex: new Map<string, number>(),
  parIndex: new Map<string, number>(),
  localNames: new Set(PARAM_NAMES),
};

const mismatchRecords: MismatchRecord[] = [];
const wasmEvalCache = new Map<string, (sample: Sample) => number>();

let pyodide: any;

const FAST_CANONICAL = [-3, -2, -1, -0.5, -1e-9, 1e-9, 0.5, 1, 2, 3];
const DEEP_EXTRA = [-10, -4, -0.9, -0.1, 0.1, 0.9, 4, 10];

function toSample(value: number, idx: number): Sample {
  const rawY = FAST_CANONICAL[(idx + 3) % FAST_CANONICAL.length] ?? 1;
  const y = Math.abs(rawY) < 1e-12 ? 0.75 : rawY;
  const z = FAST_CANONICAL[(idx + 6) % FAST_CANONICAL.length] ?? 2;
  return {
    x: value,
    y,
    z,
    p: value + 2,
    q: z - 1,
    t: idx * 0.2,
    b: 2 + (idx % 5),
    n: idx % 7,
  };
}

function buildSamples(depth: ParityDepth): Sample[] {
  const values =
    depth === "deep" ? [...FAST_CANONICAL, ...DEEP_EXTRA] : FAST_CANONICAL;
  return values.map((v, i) => toSample(v, i));
}

function normalizeEvalValue(value: number | boolean): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}

function compareNormalized(
  a: number,
  b: number,
): { equal: boolean; reason: string } {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return { equal: true, reason: "both-nan" };
  }

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    if (a === b) {
      return { equal: true, reason: "same-infinity" };
    }
    return { equal: false, reason: `infinity-mismatch(${a} vs ${b})` };
  }

  const absTol = 1e-10;
  const relTol = 1e-8;
  const scale = Math.max(Math.abs(a), Math.abs(b));
  const limit = absTol + relTol * scale;
  const diff = Math.abs(a - b);
  if (diff <= limit) {
    return { equal: true, reason: "within-tolerance" };
  }
  return {
    equal: false,
    reason: `finite-mismatch(diff=${diff},limit=${limit},a=${a},b=${b})`,
  };
}

function pythonize(sample: Sample): void {
  pyodide.globals.set("x", sample.x);
  pyodide.globals.set("y", sample.y);
  pyodide.globals.set("z", sample.z);
  pyodide.globals.set("p", sample.p);
  pyodide.globals.set("q", sample.q);
  pyodide.globals.set("t", sample.t);
  pyodide.globals.set("b", sample.b);
  pyodide.globals.set("n", sample.n);
}

function toJsNumber(value: any): number | boolean {
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value && typeof value.toJs === "function") {
    const converted = value.toJs();
    if (typeof value.destroy === "function") {
      value.destroy();
    }
    return converted as number | boolean;
  }

  return Number(value);
}

function evaluateJs(code: string, sample: Sample): EvalResult {
  try {
    const fn = new Function(
      "x",
      "y",
      "z",
      "p",
      "q",
      "t",
      "b",
      "n",
      `return (${code});`,
    ) as (...args: number[]) => number | boolean;
    const value = fn(
      sample.x,
      sample.y,
      sample.z,
      sample.p,
      sample.q,
      sample.t,
      sample.b,
      sample.n,
    );
    return { kind: "ok", value };
  } catch (error) {
    return { kind: "error", message: String(error) };
  }
}

function evaluatePy(code: string, sample: Sample): EvalResult {
  try {
    pythonize(sample);
    pyodide.globals.set("__expr_code", code);
    const value = pyodide.runPython("__parity_eval(__expr_code)");
    return { kind: "ok", value: toJsNumber(value) };
  } catch (error) {
    return { kind: "error", message: String(error) };
  }
}

function makeWatModule(expressionWat: string, isBoolean: boolean): string {
  const body = isBoolean
    ? `(f64.convert_i32_s ${expressionWat})`
    : expressionWat;

  return `(module
  (import "math" "exp"       (func $math_exp       (param f64) (result f64)))
  (import "math" "log"       (func $math_log       (param f64) (result f64)))
  (import "math" "sin"       (func $math_sin       (param f64) (result f64)))
  (import "math" "cos"       (func $math_cos       (param f64) (result f64)))
  (import "math" "tan"       (func $math_tan       (param f64) (result f64)))
  (import "math" "asin"      (func $math_asin      (param f64) (result f64)))
  (import "math" "acos"      (func $math_acos      (param f64) (result f64)))
  (import "math" "atan"      (func $math_atan      (param f64) (result f64)))
  (import "math" "sinh"      (func $math_sinh      (param f64) (result f64)))
  (import "math" "cosh"      (func $math_cosh      (param f64) (result f64)))
  (import "math" "tanh"      (func $math_tanh      (param f64) (result f64)))
  (import "math" "asinh"     (func $math_asinh     (param f64) (result f64)))
  (import "math" "acosh"     (func $math_acosh     (param f64) (result f64)))
  (import "math" "atanh"     (func $math_atanh     (param f64) (result f64)))
  (import "math" "factorial" (func $math_factorial (param f64) (result f64)))
  (import "math" "pow" (func $math_pow (param f64 f64) (result f64)))
  (import "math" "max" (func $math_max (param f64 f64) (result f64)))
  (import "math" "min" (func $math_min (param f64 f64) (result f64)))
  (import "math" "rem" (func $math_rem (param f64 f64) (result f64)))
  (func (export "eval")
    (param $x f64) (param $y f64) (param $z f64) (param $p f64)
    (param $q f64) (param $t f64) (param $b f64) (param $n f64)
    (result f64)
    ${body}
  )
)`;
}

async function getWasmEvalFn(
  expressionWat: string,
  isBoolean: boolean,
): Promise<(sample: Sample) => number> {
  const key = `${isBoolean ? "b" : "n"}::${expressionWat}`;
  const cached = wasmEvalCache.get(key);
  if (cached) return cached;

  const moduleText = makeWatModule(expressionWat, isBoolean);
  const bytes = wat2wasm(moduleText);
  const instantiated = (await WebAssembly.instantiate(bytes, {
    math: mathImports(),
  })) as unknown as WebAssembly.WebAssemblyInstantiatedSource;

  const fn = instantiated.instance.exports.eval as (
    x: number,
    y: number,
    z: number,
    p: number,
    q: number,
    t: number,
    b: number,
    n: number,
  ) => number;

  const evalFn = (sample: Sample) =>
    fn(
      sample.x,
      sample.y,
      sample.z,
      sample.p,
      sample.q,
      sample.t,
      sample.b,
      sample.n,
    );

  wasmEvalCache.set(key, evalFn);
  return evalFn;
}

async function evaluateWasm(
  expressionWat: string,
  isBoolean: boolean,
  sample: Sample,
): Promise<EvalResult> {
  try {
    const fn = await getWasmEvalFn(expressionWat, isBoolean);
    return { kind: "ok", value: fn(sample) };
  } catch (error) {
    return { kind: "error", message: String(error) };
  }
}

function composeExpression(expr: Base, isBoolean: boolean): Base {
  if (isBoolean) {
    return new Piecewise([new Num(1), expr, new Num(-1)]);
  }
  return new Add([expr, new Mul([new Num(0.5), new Name("x")])]);
}

function asProfileReason(record: MismatchRecord): string {
  return JSON.stringify(record, null, 2);
}

const gtZero = new GreaterThan([new Name("x"), new Num(0)]);
const ltZero = new LessThan([new Name("y"), new Num(0)]);

const PROFILES: NodeProfile[] = [
  {
    node: "Name",
    isBoolean: false,
    direct: () => new Name("x"),
    accept: () => true,
  },
  {
    node: "Num",
    isBoolean: false,
    direct: () => new Num(3.25),
    accept: () => true,
  },
  {
    node: "Pow",
    isBoolean: false,
    direct: () => new Pow(new Name("x"), new Name("y")),
    accept: (s) => s.x > 0.05 && s.y > -4 && s.y < 4,
  },
  {
    node: "Implies",
    isBoolean: true,
    direct: () => new Implies(gtZero, ltZero),
    accept: () => true,
  },
  {
    node: "Max",
    isBoolean: false,
    direct: () => new Max([new Name("x"), new Name("y"), new Name("z")]),
    accept: () => true,
  },
  {
    node: "Min",
    isBoolean: false,
    direct: () => new Min([new Name("x"), new Name("y"), new Name("z")]),
    accept: () => true,
  },
  {
    node: "Piecewise",
    isBoolean: false,
    direct: () =>
      new Piecewise([
        new Name("x"),
        new GreaterThan([new Name("x"), new Num(0)]),
        new Name("y"),
      ]),
    accept: () => true,
  },
  {
    node: "Rem",
    isBoolean: false,
    direct: () => new Rem([new Name("x"), new Name("y")]),
    accept: (s) => Math.abs(s.y) > 1e-9,
  },
  {
    node: "And",
    isBoolean: true,
    direct: () =>
      new And([
        new GreaterThan([new Name("x"), new Num(0)]),
        new LessThan([new Name("y"), new Num(2)]),
      ]),
    accept: () => true,
  },
  {
    node: "Not",
    isBoolean: true,
    direct: () => new Not([new GreaterThan([new Name("x"), new Num(0)])]),
    accept: () => true,
  },
  {
    node: "Or",
    isBoolean: true,
    direct: () =>
      new Or([
        new GreaterThan([new Name("x"), new Num(0)]),
        new LessThan([new Name("y"), new Num(0)]),
      ]),
    accept: () => true,
  },
  {
    node: "Xor",
    isBoolean: true,
    direct: () =>
      new Xor([
        new GreaterThan([new Name("x"), new Num(0)]),
        new LessThan([new Name("y"), new Num(0)]),
      ]),
    accept: () => true,
  },
  {
    node: "Eq",
    isBoolean: true,
    direct: () => new Eq([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "GreaterEqual",
    isBoolean: true,
    direct: () => new GreaterEqual([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "GreaterThan",
    isBoolean: true,
    direct: () => new GreaterThan([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "LessEqual",
    isBoolean: true,
    direct: () => new LessEqual([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "LessThan",
    isBoolean: true,
    direct: () => new LessThan([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "NotEqual",
    isBoolean: true,
    direct: () => new NotEqual([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "Add",
    isBoolean: false,
    direct: () => new Add([new Name("x"), new Name("y"), new Name("z")]),
    accept: () => true,
  },
  {
    node: "Minus",
    isBoolean: false,
    direct: () => new Minus([new Name("x"), new Name("y")]),
    accept: () => true,
  },
  {
    node: "Mul",
    isBoolean: false,
    direct: () => new Mul([new Name("x"), new Name("y"), new Name("z")]),
    accept: () => true,
  },
  {
    node: "Divide",
    isBoolean: false,
    direct: () => new Divide([new Name("x"), new Name("y")]),
    accept: (s) => Math.abs(s.y) > 1e-9,
  },
  {
    node: "IntDivide",
    isBoolean: false,
    direct: () => new IntDivide([new Name("x"), new Name("y")]),
    accept: (s) => Math.abs(s.y) > 1e-9,
  },
  {
    node: "Abs",
    isBoolean: false,
    direct: () => new Abs(new Name("x")),
    accept: () => true,
  },
  {
    node: "Ceiling",
    isBoolean: false,
    direct: () => new Ceiling(new Name("x")),
    accept: () => true,
  },
  {
    node: "Exp",
    isBoolean: false,
    direct: () => new Exp(new Name("x")),
    accept: () => true,
  },
  {
    node: "Factorial",
    isBoolean: false,
    direct: () => new Factorial(new Name("n")),
    accept: () => true,
  },
  {
    node: "Floor",
    isBoolean: false,
    direct: () => new Floor(new Name("x")),
    accept: () => true,
  },
  {
    node: "Ln",
    isBoolean: false,
    direct: () => new Ln(new Name("x")),
    accept: (s) => s.x > 1e-9,
  },
  {
    node: "Sin",
    isBoolean: false,
    direct: () => new Sin(new Name("x")),
    accept: () => true,
  },
  {
    node: "Cos",
    isBoolean: false,
    direct: () => new Cos(new Name("x")),
    accept: () => true,
  },
  {
    node: "Tan",
    isBoolean: false,
    direct: () => new Tan(new Name("x")),
    accept: (s) => Math.abs(Math.cos(s.x)) > 1e-4,
  },
  {
    node: "Sec",
    isBoolean: false,
    direct: () => new Sec(new Name("x")),
    accept: (s) => Math.abs(Math.cos(s.x)) > 1e-4,
  },
  {
    node: "Csc",
    isBoolean: false,
    direct: () => new Csc(new Name("x")),
    accept: (s) => Math.abs(Math.sin(s.x)) > 1e-4,
  },
  {
    node: "Cot",
    isBoolean: false,
    direct: () => new Cot(new Name("x")),
    accept: (s) => Math.abs(Math.tan(s.x)) > 1e-4,
  },
  {
    node: "Asin",
    isBoolean: false,
    direct: () => new Asin(new Name("x")),
    accept: (s) => s.x >= -1 && s.x <= 1,
  },
  {
    node: "Acos",
    isBoolean: false,
    direct: () => new Acos(new Name("x")),
    accept: (s) => s.x >= -1 && s.x <= 1,
  },
  {
    node: "Atan",
    isBoolean: false,
    direct: () => new Atan(new Name("x")),
    accept: () => true,
  },
  {
    node: "Acot",
    isBoolean: false,
    direct: () => new Acot(new Name("x")),
    accept: (s) => Math.abs(s.x) > 1e-9,
  },
  {
    node: "ArcSec",
    isBoolean: false,
    direct: () => new ArcSec(new Name("x")),
    accept: (s) => Math.abs(s.x) >= 1 + 1e-9,
  },
  {
    node: "ArcCsc",
    isBoolean: false,
    direct: () => new ArcCsc(new Name("x")),
    accept: (s) => Math.abs(s.x) >= 1 + 1e-9,
  },
  {
    node: "Sinh",
    isBoolean: false,
    direct: () => new Sinh(new Name("x")),
    accept: () => true,
  },
  {
    node: "Cosh",
    isBoolean: false,
    direct: () => new Cosh(new Name("x")),
    accept: () => true,
  },
  {
    node: "Tanh",
    isBoolean: false,
    direct: () => new Tanh(new Name("x")),
    accept: () => true,
  },
  {
    node: "Sech",
    isBoolean: false,
    direct: () => new Sech(new Name("x")),
    accept: () => true,
  },
  {
    node: "Csch",
    isBoolean: false,
    direct: () => new Csch(new Name("x")),
    accept: (s) => Math.abs(Math.sinh(s.x)) > 1e-8,
  },
  {
    node: "Coth",
    isBoolean: false,
    direct: () => new Coth(new Name("x")),
    accept: (s) => Math.abs(Math.tanh(s.x)) > 1e-8,
  },
  {
    node: "ArcSinh",
    isBoolean: false,
    direct: () => new ArcSinh(new Name("x")),
    accept: () => true,
  },
  {
    node: "ArcCosh",
    isBoolean: false,
    direct: () => new ArcCosh(new Name("x")),
    accept: (s) => s.x >= 1 + 1e-9,
  },
  {
    node: "ArcTanh",
    isBoolean: false,
    direct: () => new ArcTanh(new Name("x")),
    accept: (s) => Math.abs(s.x) < 1 - 1e-9,
  },
  {
    node: "ArcCsch",
    isBoolean: false,
    direct: () => new ArcCsch(new Name("x")),
    accept: (s) => Math.abs(s.x) > 1e-9,
  },
  {
    node: "ArcSech",
    isBoolean: false,
    direct: () => new ArcSech(new Name("x")),
    accept: (s) => s.x > 1e-9 && s.x <= 1,
  },
  {
    node: "ArcCoth",
    isBoolean: false,
    direct: () => new ArcCoth(new Name("x")),
    accept: (s) => Math.abs(s.x) > 1 + 1e-9,
  },
  {
    node: "RateOf",
    isBoolean: false,
    direct: () => new RateOf(new Name("x")),
    accept: () => true,
  },
  {
    node: "Log",
    isBoolean: false,
    direct: () => new Log(new Name("x"), new Name("b")),
    accept: (s) => s.x > 1e-9 && s.b > 0 && Math.abs(s.b - 1) > 1e-9,
  },
  {
    node: "Sqrt",
    isBoolean: false,
    direct: () => new Sqrt(new Name("x"), new Name("b")),
    accept: (s) => s.x > 1e-9 && s.b > 1e-9,
  },
];

const samples = buildSamples(PARITY_DEPTH);

describe("MathML codegen parity (js/py/wasm)", () => {
  beforeAll(async () => {
    pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy"]);
    pyodide.runPython(`
  import numpy as np
  import math

  def __parity_eval(expr):
    value = eval(expr, globals(), globals())
    if isinstance(value, (bool, np.bool_)):
      return bool(value)
    if isinstance(value, (int, float, np.integer, np.floating)):
      return float(value)
    return value
  `);
  }, 180000);

  afterAll(() => {
    const outPath = join(process.cwd(), "tmp", "parity-failures.json");
    mkdirSync(join(process.cwd(), "tmp"), { recursive: true });
    writeFileSync(
      outPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          depth: PARITY_DEPTH,
          mismatchCount: mismatchRecords.length,
          mismatches: mismatchRecords,
        },
        null,
        2,
      ),
      "utf8",
    );
  });

  it("covers the fixed node list", () => {
    expect(PROFILES).toHaveLength(56);
  });

  for (const profile of PROFILES) {
    for (const shape of ["direct", "composed"] as const) {
      it(`${profile.node} (${shape}) keeps parity`, async () => {
        const mismatches: MismatchRecord[] = [];

        const directExpr = profile.direct();
        const expr =
          shape === "direct"
            ? directExpr
            : composeExpression(directExpr, profile.isBoolean);

        const jsCode = expr.toJs();
        const pyCode = expr.toPy(DISPLAY_NAMES);
        const watCode = expr.toWat(WAT_CTX);
        const shapeBoolean = shape === "direct" ? profile.isBoolean : false;

        for (const sample of samples.filter(profile.accept)) {
          const js = evaluateJs(jsCode, sample);
          const py = evaluatePy(pyCode, sample);
          const wasm = await evaluateWasm(watCode, shapeBoolean, sample);

          if (js.kind !== "ok" || py.kind !== "ok" || wasm.kind !== "ok") {
            const reason = [js, py, wasm]
              .map((r, idx) => {
                const backend = ["js", "py", "wasm"][idx] as BackendName;
                return r.kind === "error"
                  ? `${backend}-error(${r.message})`
                  : `${backend}-ok`;
              })
              .join(" | ");

            const record: MismatchRecord = {
              node: profile.node,
              shape,
              sample,
              jsCode,
              pyCode,
              watCode,
              js,
              py,
              wasm,
              reason,
            };
            mismatches.push(record);
            mismatchRecords.push(record);
            continue;
          }

          const jsNorm = normalizeEvalValue(js.value);
          const pyNorm = normalizeEvalValue(py.value);
          const wasmNorm = normalizeEvalValue(wasm.value);

          const jsPy = compareNormalized(jsNorm, pyNorm);
          const jsWasm = compareNormalized(jsNorm, wasmNorm);
          const pyWasm = compareNormalized(pyNorm, wasmNorm);

          if (!jsPy.equal || !jsWasm.equal || !pyWasm.equal) {
            const record: MismatchRecord = {
              node: profile.node,
              shape,
              sample,
              jsCode,
              pyCode,
              watCode,
              js: { kind: "ok", value: jsNorm },
              py: { kind: "ok", value: pyNorm },
              wasm: { kind: "ok", value: wasmNorm },
              reason: `js-py=${jsPy.reason}; js-wasm=${jsWasm.reason}; py-wasm=${pyWasm.reason}`,
            };
            mismatches.push(record);
            mismatchRecords.push(record);
          }
        }

        expect(
          mismatches,
          mismatches.length > 0
            ? `parity mismatches:\n${mismatches.map((m) => asProfileReason(m)).join("\n")}`
            : "",
        ).toHaveLength(0);
      }, 120000);
    }
  }
});
