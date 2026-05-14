import type { Base } from "./base";
import type { WatContext } from "./wat-context";

/**
 * buildModelWat — generate a complete WAT module for the ODE RHS.
 *
 * Exported function signature (matches fcn_dispatch in radau5_wrapper.c):
 *   void model_fn(int n, double t, double* y, double* dydt, double* pars)
 * Emscripten addFunction type string: "vidiii"
 *
 * @param equations     One entry per state variable: the AST for its d/dt expression.
 * @param varNames      State variable names in order (index matches y[] offset).
 * @param parNames      Parameter names in order (index matches pars[] offset).
 * @param timeVar       Optional name used as the time variable (default "t").
 * @param intermediates Reactions/assignments that become named WAT locals, in topological order.
 */
export function buildModelWat(
  equations: { varName: string; expr: Base }[],
  varNames: string[],
  parNames: string[],
  timeVar = "t",
  intermediates?: { name: string; expr: Base }[],
): string {
  const localNames = intermediates
    ? new Set(intermediates.map((l) => l.name))
    : undefined;

  const ctx: WatContext = {
    varIndex: new Map(varNames.map((n, i) => [n, i])),
    parIndex: new Map(parNames.map((n, i) => [n, i])),
    timeVar,
    localNames,
  };

  const localDecls = intermediates
    ? intermediates.map((l) => `    (local $${l.name} f64)`).join("\n") + "\n"
    : "";

  const localSets = intermediates
    ? intermediates
        .map((l) => `    (local.set $${l.name} ${l.expr.toWat(ctx)})`)
        .join("\n") + "\n"
    : "";

  const stores = equations
    .map((eq, i) => {
      const offset = i * 8;
      return `    (f64.store (i32.add (local.get 3) (i32.const ${offset})) ${eq.expr.toWat(ctx)})`;
    })
    .join("\n");

  return `(module
  ;; Shared memory from Emscripten runtime
  (import "env" "memory" (memory 1))

  ;; Single-argument math imports
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

  ;; Two-argument math imports
  (import "math" "pow" (func $math_pow (param f64 f64) (result f64)))
  (import "math" "max" (func $math_max (param f64 f64) (result f64)))
  (import "math" "min" (func $math_min (param f64 f64) (result f64)))
  (import "math" "rem" (func $math_rem (param f64 f64) (result f64)))

  ;; ODE RHS: void(i32 n, f64 t, i32 y_ptr, i32 f_ptr, i32 rpar_ptr)
  ;; Param locals: 0=n, 1=t, 2=y_ptr, 3=f_ptr, 4=rpar_ptr
  (func (export "fcn") (param i32) (param f64) (param i32) (param i32) (param i32)
${localDecls}${localSets}${stores}
  )
)`;
}

/**
 * mathImports — JS imports object for instantiating a model WASM module.
 * Provide as the "math" namespace in WebAssembly.instantiate imports.
 */
export function mathImports(): Record<string, (...args: number[]) => number> {
  return {
    exp: Math.exp,
    log: Math.log,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: Math.acosh,
    atanh: Math.atanh,
    factorial: (n: number) => {
      let r = 1;
      for (let i = 2; i <= Math.round(n); i++) r *= i;
      return r;
    },
    pow: Math.pow,
    max: Math.max,
    min: Math.min,
    rem: (a: number, b: number) => a % b,
  };
}
