import {
  Abs,
  Acos,
  Acot,
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
  type Base,
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
  Add,
  Name,
  NotEqual,
  Not,
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
  And,
  Xor,
} from "$lib/mathml";
import { ModelBuilder } from "./modelBuilder";
import type { Stoichiometry } from "./modelBuilder";

const SBML_NS = "http://www.sbml.org/sbml/level3/version2/core";
const MATHML_NS = "http://www.w3.org/1998/Math/MathML";

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mathBlock(inner: string): string {
  return `<math xmlns="${MATHML_NS}">${inner}</math>`;
}

function apply(op: string, args: string[]): string {
  return `<apply><${op}/>${args.join("")}</apply>`;
}

function parseFloatAttr(el: Element, attr: string): number {
  const val = el.getAttribute(attr);
  if (val === null) return NaN;
  const n = parseFloat(val);
  return isNaN(n) ? NaN : n;
}

// ─── AST → MathML ───────────────────────────────────────────────────────────

export function astToMathML(node: Base): string {
  if (node instanceof Name) {
    return `<ci>${escapeXml(node.name)}</ci>`;
  }
  if (node instanceof Num) {
    return `<cn>${node.value}</cn>`;
  }
  if (node instanceof Add) {
    return apply("plus", node.children.map(astToMathML));
  }
  if (node instanceof Minus) {
    return apply("minus", node.children.map(astToMathML));
  }
  if (node instanceof Mul) {
    return apply("times", node.children.map(astToMathML));
  }
  if (node instanceof Divide) {
    if (node.children.length === 0) return "<cn>0</cn>";
    return node.children
      .map(astToMathML)
      .reduce((acc, cur) => `<apply><divide/>${acc}${cur}</apply>`);
  }
  if (node instanceof IntDivide) {
    if (node.children.length === 0) return "<cn>0</cn>";
    const divided = node.children
      .map(astToMathML)
      .reduce((acc, cur) => `<apply><divide/>${acc}${cur}</apply>`);
    return `<apply><floor/>${divided}</apply>`;
  }
  if (node instanceof Pow) {
    return `<apply><power/>${astToMathML(node.left)}${astToMathML(node.right)}</apply>`;
  }
  if (node instanceof Implies) {
    return `<apply><implies/>${astToMathML(node.left)}${astToMathML(node.right)}</apply>`;
  }
  if (node instanceof Log) {
    return `<apply><log/><logbase>${astToMathML(node.base)}</logbase>${astToMathML(node.child)}</apply>`;
  }
  if (node instanceof Sqrt) {
    return `<apply><root/><degree>${astToMathML(node.base)}</degree>${astToMathML(node.child)}</apply>`;
  }
  if (node instanceof RateOf) {
    return `<apply><csymbol definitionURL="http://www.sbml.org/sbml/symbols/rateOf">rateOf</csymbol>${astToMathML(node.child)}</apply>`;
  }
  if (node instanceof Abs) return apply("abs", [astToMathML(node.child)]);
  if (node instanceof Ceiling) return apply("ceiling", [astToMathML(node.child)]);
  if (node instanceof Floor) return apply("floor", [astToMathML(node.child)]);
  if (node instanceof Exp) return apply("exp", [astToMathML(node.child)]);
  if (node instanceof Ln) return apply("ln", [astToMathML(node.child)]);
  if (node instanceof Factorial) return apply("factorial", [astToMathML(node.child)]);
  if (node instanceof Sin) return apply("sin", [astToMathML(node.child)]);
  if (node instanceof Cos) return apply("cos", [astToMathML(node.child)]);
  if (node instanceof Tan) return apply("tan", [astToMathML(node.child)]);
  if (node instanceof Sec) return apply("sec", [astToMathML(node.child)]);
  if (node instanceof Csc) return apply("csc", [astToMathML(node.child)]);
  if (node instanceof Cot) return apply("cot", [astToMathML(node.child)]);
  if (node instanceof Asin) return apply("arcsin", [astToMathML(node.child)]);
  if (node instanceof Acos) return apply("arccos", [astToMathML(node.child)]);
  if (node instanceof Atan) return apply("arctan", [astToMathML(node.child)]);
  if (node instanceof Acot) return apply("arccot", [astToMathML(node.child)]);
  if (node instanceof ArcSec) return apply("arcsec", [astToMathML(node.child)]);
  if (node instanceof ArcCsc) return apply("arccsc", [astToMathML(node.child)]);
  if (node instanceof Sinh) return apply("sinh", [astToMathML(node.child)]);
  if (node instanceof Cosh) return apply("cosh", [astToMathML(node.child)]);
  if (node instanceof Tanh) return apply("tanh", [astToMathML(node.child)]);
  if (node instanceof Sech) return apply("sech", [astToMathML(node.child)]);
  if (node instanceof Csch) return apply("csch", [astToMathML(node.child)]);
  if (node instanceof Coth) return apply("coth", [astToMathML(node.child)]);
  if (node instanceof ArcSinh) return apply("arcsinh", [astToMathML(node.child)]);
  if (node instanceof ArcCosh) return apply("arccosh", [astToMathML(node.child)]);
  if (node instanceof ArcTanh) return apply("arctanh", [astToMathML(node.child)]);
  if (node instanceof ArcCsch) return apply("arccsch", [astToMathML(node.child)]);
  if (node instanceof ArcSech) return apply("arcsech", [astToMathML(node.child)]);
  if (node instanceof ArcCoth) return apply("arccoth", [astToMathML(node.child)]);
  if (node instanceof Max) return apply("max", node.children.map(astToMathML));
  if (node instanceof Min) return apply("min", node.children.map(astToMathML));
  if (node instanceof Rem) return apply("rem", node.children.map(astToMathML));
  if (node instanceof And) return apply("and", node.children.map(astToMathML));
  if (node instanceof Or) return apply("or", node.children.map(astToMathML));
  if (node instanceof Xor) return apply("xor", node.children.map(astToMathML));
  if (node instanceof Not) return apply("not", node.children.map(astToMathML));
  if (node instanceof Eq) return apply("eq", node.children.map(astToMathML));
  if (node instanceof GreaterEqual) return apply("geq", node.children.map(astToMathML));
  if (node instanceof GreaterThan) return apply("gt", node.children.map(astToMathML));
  if (node instanceof LessEqual) return apply("leq", node.children.map(astToMathML));
  if (node instanceof LessThan) return apply("lt", node.children.map(astToMathML));
  if (node instanceof NotEqual) return apply("neq", node.children.map(astToMathML));
  if (node instanceof Piecewise) {
    const parts: string[] = [];
    for (let i = 0; i + 1 < node.children.length; i += 2) {
      parts.push(
        `<piece>${astToMathML(node.children[i])}${astToMathML(node.children[i + 1])}</piece>`,
      );
    }
    if (node.children.length % 2 === 1) {
      parts.push(
        `<otherwise>${astToMathML(node.children[node.children.length - 1])}</otherwise>`,
      );
    }
    return `<piecewise>${parts.join("")}</piecewise>`;
  }
  throw new Error(`Cannot serialize AST node type: ${node.constructor.name}`);
}

// ─── MathML → AST ───────────────────────────────────────────────────────────

export function mathMLToAst(el: Element): Base {
  const tag = el.localName;

  if (tag === "ci") return new Name(el.textContent!.trim());
  if (tag === "cn") return new Num(parseFloat(el.textContent!.trim()));
  if (tag === "true") return new Num(1);
  if (tag === "false") return new Num(0);
  if (tag === "pi") return new Name("pi");
  if (tag === "exponentiale") return new Name("e");
  if (tag === "notanumber") return new Num(NaN);
  if (tag === "infinity") return new Num(Infinity);

  // Stand-alone csymbol (e.g., time, avogadro)
  if (tag === "csymbol") {
    const defUrl = el.getAttribute("definitionURL") ?? "";
    if (defUrl.endsWith("time")) return new Name("t");
    if (defUrl.endsWith("avogadro")) return new Num(6.02214076e23);
    return new Name(el.textContent!.trim());
  }

  if (tag === "apply") {
    const children = Array.from(el.children);
    if (children.length === 0) throw new Error("Empty <apply>");
    const op = children[0];
    const opName = op.localName;
    const args = children.slice(1);

    switch (opName) {
      case "plus":
        return new Add(args.map(mathMLToAst));
      case "minus":
        return new Minus(args.map(mathMLToAst));
      case "times":
        return new Mul(args.map(mathMLToAst));
      case "divide":
        return new Divide(args.map(mathMLToAst));
      case "power":
        return new Pow(mathMLToAst(args[0]), mathMLToAst(args[1]));
      case "root": {
        if (args[0]?.localName === "degree") {
          return new Sqrt(mathMLToAst(args[1]), mathMLToAst(args[0].children[0]));
        }
        return new Sqrt(mathMLToAst(args[0]), new Num(2));
      }
      case "log": {
        if (args[0]?.localName === "logbase") {
          return new Log(mathMLToAst(args[1]), mathMLToAst(args[0].children[0]));
        }
        return new Log(mathMLToAst(args[0]), new Num(10));
      }
      case "floor": {
        // Detect encoded IntDivide: floor(divide(a, b))
        if (
          args[0]?.localName === "apply" &&
          args[0].children[0]?.localName === "divide"
        ) {
          return new IntDivide(Array.from(args[0].children).slice(1).map(mathMLToAst));
        }
        return new Floor(mathMLToAst(args[0]));
      }
      case "implies":
        return new Implies(mathMLToAst(args[0]), mathMLToAst(args[1]));
      case "abs":
        return new Abs(mathMLToAst(args[0]));
      case "ceiling":
        return new Ceiling(mathMLToAst(args[0]));
      case "exp":
        return new Exp(mathMLToAst(args[0]));
      case "ln":
        return new Ln(mathMLToAst(args[0]));
      case "factorial":
        return new Factorial(mathMLToAst(args[0]));
      case "sin":
        return new Sin(mathMLToAst(args[0]));
      case "cos":
        return new Cos(mathMLToAst(args[0]));
      case "tan":
        return new Tan(mathMLToAst(args[0]));
      case "sec":
        return new Sec(mathMLToAst(args[0]));
      case "csc":
        return new Csc(mathMLToAst(args[0]));
      case "cot":
        return new Cot(mathMLToAst(args[0]));
      case "arcsin":
        return new Asin(mathMLToAst(args[0]));
      case "arccos":
        return new Acos(mathMLToAst(args[0]));
      case "arctan":
        return new Atan(mathMLToAst(args[0]));
      case "arccot":
        return new Acot(mathMLToAst(args[0]));
      case "arcsec":
        return new ArcSec(mathMLToAst(args[0]));
      case "arccsc":
        return new ArcCsc(mathMLToAst(args[0]));
      case "sinh":
        return new Sinh(mathMLToAst(args[0]));
      case "cosh":
        return new Cosh(mathMLToAst(args[0]));
      case "tanh":
        return new Tanh(mathMLToAst(args[0]));
      case "sech":
        return new Sech(mathMLToAst(args[0]));
      case "csch":
        return new Csch(mathMLToAst(args[0]));
      case "coth":
        return new Coth(mathMLToAst(args[0]));
      case "arcsinh":
        return new ArcSinh(mathMLToAst(args[0]));
      case "arccosh":
        return new ArcCosh(mathMLToAst(args[0]));
      case "arctanh":
        return new ArcTanh(mathMLToAst(args[0]));
      case "arccsch":
        return new ArcCsch(mathMLToAst(args[0]));
      case "arcsech":
        return new ArcSech(mathMLToAst(args[0]));
      case "arccoth":
        return new ArcCoth(mathMLToAst(args[0]));
      case "max":
        return new Max(args.map(mathMLToAst));
      case "min":
        return new Min(args.map(mathMLToAst));
      case "rem":
        return new Rem(args.map(mathMLToAst));
      case "and":
        return new And(args.map(mathMLToAst));
      case "or":
        return new Or(args.map(mathMLToAst));
      case "xor":
        return new Xor(args.map(mathMLToAst));
      case "not":
        return new Not(args.map(mathMLToAst));
      case "eq":
        return new Eq(args.map(mathMLToAst));
      case "geq":
        return new GreaterEqual(args.map(mathMLToAst));
      case "gt":
        return new GreaterThan(args.map(mathMLToAst));
      case "leq":
        return new LessEqual(args.map(mathMLToAst));
      case "lt":
        return new LessThan(args.map(mathMLToAst));
      case "neq":
        return new NotEqual(args.map(mathMLToAst));
      case "csymbol": {
        const defUrl = op.getAttribute("definitionURL") ?? "";
        const sym = op.textContent!.trim();
        if (defUrl.endsWith("rateOf")) return new RateOf(mathMLToAst(args[0]));
        if (defUrl.endsWith("time")) return new Name("t");
        if (defUrl.endsWith("avogadro")) return new Num(6.02214076e23);
        return new Name(sym);
      }
      default:
        throw new Error(`Unknown MathML operator: ${opName}`);
    }
  }

  if (tag === "piecewise") {
    const children: Base[] = [];
    for (const child of el.children) {
      if (child.localName === "piece") {
        const grandchildren = Array.from(child.children);
        if (grandchildren.length >= 2) {
          children.push(mathMLToAst(grandchildren[0]));
          children.push(mathMLToAst(grandchildren[1]));
        }
      } else if (child.localName === "otherwise") {
        if (child.children.length > 0) {
          children.push(mathMLToAst(child.children[0]));
        }
      }
    }
    return new Piecewise(children);
  }

  throw new Error(`Unknown MathML element: ${tag}`);
}

// ─── ModelBuilder → SBML ────────────────────────────────────────────────────

export function modelToSbml(model: ModelBuilder, name: string): string {
  const modelId = name.replace(/[^A-Za-z0-9_]/g, "_") || "model";

  const compartmentXml = `<listOfCompartments>
      <compartment id="default" size="1" constant="true"/>
    </listOfCompartments>`;

  let speciesXml = "";
  if (model.variables.size > 0) {
    const items = [...model.variables.entries()]
      .map(([id, v]) => {
        const displayName = v.displayName ?? id;
        return `<species id="${escapeXml(id)}" name="${escapeXml(displayName)}" compartment="default" initialAmount="${v.value}" hasOnlySubstanceUnits="false" boundaryCondition="false" constant="false"/>`;
      })
      .join("\n      ");
    speciesXml = `<listOfSpecies>\n      ${items}\n    </listOfSpecies>`;
  }

  let parametersXml = "";
  if (model.parameters.size > 0) {
    const items = [...model.parameters.entries()]
      .map(([id, p]) => {
        const displayName = p.displayName ?? id;
        return `<parameter id="${escapeXml(id)}" name="${escapeXml(displayName)}" value="${p.value}" constant="true"/>`;
      })
      .join("\n      ");
    parametersXml = `<listOfParameters>\n      ${items}\n    </listOfParameters>`;
  }

  let rulesXml = "";
  if (model.assignments.size > 0) {
    const items = [...model.assignments.entries()]
      .map(([id, a]) => {
        return `<assignmentRule variable="${escapeXml(id)}">
        ${mathBlock(astToMathML(a.fn))}
      </assignmentRule>`;
      })
      .join("\n      ");
    rulesXml = `<listOfRules>\n      ${items}\n    </listOfRules>`;
  }

  let reactionsXml = "";
  if (model.reactions.size > 0) {
    const items = [...model.reactions.entries()]
      .map(([id, r]) => {
        const displayName = r.displayName ?? id;

        const reactants = r.stoichiometry.filter((s) => s.value.value < 0);
        const products = r.stoichiometry.filter((s) => s.value.value > 0);

        const reactantsXml =
          reactants.length > 0
            ? `\n        <listOfReactants>\n          ${reactants
                .map(
                  (s) =>
                    `<speciesReference species="${escapeXml(s.name)}" stoichiometry="${Math.abs(s.value.value)}" constant="true"/>`,
                )
                .join("\n          ")}\n        </listOfReactants>`
            : "";

        const productsXml =
          products.length > 0
            ? `\n        <listOfProducts>\n          ${products
                .map(
                  (s) =>
                    `<speciesReference species="${escapeXml(s.name)}" stoichiometry="${s.value.value}" constant="true"/>`,
                )
                .join("\n          ")}\n        </listOfProducts>`
            : "";

        return `<reaction id="${escapeXml(id)}" name="${escapeXml(displayName)}" reversible="false">${reactantsXml}${productsXml}
        <kineticLaw>
          ${mathBlock(astToMathML(r.fn))}
        </kineticLaw>
      </reaction>`;
      })
      .join("\n      ");
    reactionsXml = `<listOfReactions>\n      ${items}\n    </listOfReactions>`;
  }

  const sections = [compartmentXml, speciesXml, parametersXml, rulesXml, reactionsXml]
    .filter(Boolean)
    .join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sbml xmlns="${SBML_NS}" level="3" version="2">
  <model id="${escapeXml(modelId)}" name="${escapeXml(name)}">
    ${sections}
  </model>
</sbml>`;
}

// ─── SBML → ModelBuilder ────────────────────────────────────────────────────

export function sbmlToModel(xmlString: string): ModelBuilder {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(`XML parse error: ${parseError.textContent}`);
  }

  if (!doc.querySelector("model")) {
    throw new Error("No <model> element found in SBML");
  }

  const builder = new ModelBuilder();

  // 1. Compartments — collect sizes for concentration → amount conversion
  const compartmentSizes = new Map<string, number>();
  for (const comp of doc.querySelectorAll("listOfCompartments > compartment")) {
    const id = comp.getAttribute("id");
    const size = parseFloatAttr(comp, "size");
    if (id && !isNaN(size)) compartmentSizes.set(id, size);
  }

  // Helper: which species have boundaryCondition=true
  const boundarySpecies = new Set<string>();
  for (const sp of doc.querySelectorAll("listOfSpecies > species")) {
    if (sp.getAttribute("boundaryCondition") === "true") {
      const id = sp.getAttribute("id");
      if (id) boundarySpecies.add(id);
    }
  }

  // 2. Species → variables (or parameters if boundary)
  for (const species of doc.querySelectorAll("listOfSpecies > species")) {
    const id = species.getAttribute("id");
    if (!id) continue;

    const compartmentId = species.getAttribute("compartment") ?? "default";
    const compartmentSize = compartmentSizes.get(compartmentId) ?? 1;

    const initAmount = parseFloatAttr(species, "initialAmount");
    const initConc = parseFloatAttr(species, "initialConcentration");

    let value: number;
    if (!isNaN(initAmount)) {
      value = initAmount;
    } else if (!isNaN(initConc)) {
      value = initConc * compartmentSize;
    } else {
      value = 0;
    }

    const displayName = species.getAttribute("name");
    const meta = {
      value,
      displayName: displayName && displayName !== id ? displayName : undefined,
    };

    if (boundarySpecies.has(id)) {
      builder.addParameter(id, meta);
    } else {
      builder.addVariable(id, meta);
    }
  }

  // 3. Global parameters
  for (const param of doc.querySelectorAll("listOfParameters > parameter")) {
    const id = param.getAttribute("id");
    if (!id) continue;
    const value = parseFloatAttr(param, "value");
    const displayName = param.getAttribute("name");
    builder.addParameter(id, {
      value: isNaN(value) ? 0 : value,
      displayName: displayName && displayName !== id ? displayName : undefined,
    });
  }

  // 4. Initial assignments — override initial values or add as assignment rules
  for (const ia of doc.querySelectorAll(
    "listOfInitialAssignments > initialAssignment",
  )) {
    const symbol = ia.getAttribute("symbol");
    if (!symbol) continue;
    const mathEl = ia.querySelector("math");
    if (!mathEl || mathEl.children.length === 0) continue;
    const firstChild = mathEl.children[0];

    if (firstChild.localName === "cn") {
      // Simple numeric override
      const val = parseFloat(firstChild.textContent!.trim());
      if (!isNaN(val)) {
        if (builder.variables.has(symbol)) {
          builder.updateVariable(symbol, { ...builder.variables.get(symbol)!, value: val });
        } else if (builder.parameters.has(symbol)) {
          builder.updateParameter(symbol, { ...builder.parameters.get(symbol)!, value: val });
        }
      }
    } else {
      try {
        builder.addAssignment(symbol, { fn: mathMLToAst(firstChild) });
      } catch (e) {
        console.warn(`Failed to parse initial assignment for ${symbol}:`, e);
      }
    }
  }

  // 5. Assignment rules
  for (const rule of doc.querySelectorAll("listOfRules > assignmentRule")) {
    const variable = rule.getAttribute("variable");
    if (!variable) continue;
    const mathEl = rule.querySelector("math");
    if (!mathEl || mathEl.children.length === 0) continue;
    try {
      builder.addAssignment(variable, { fn: mathMLToAst(mathEl.children[0]) });
    } catch (e) {
      console.warn(`Failed to parse assignment rule for ${variable}:`, e);
    }
  }

  // 6. Rate rules (dX/dt = expr) → reaction with stoichiometry 1
  for (const rule of doc.querySelectorAll("listOfRules > rateRule")) {
    const variable = rule.getAttribute("variable");
    if (!variable) continue;
    const mathEl = rule.querySelector("math");
    if (!mathEl || mathEl.children.length === 0) continue;
    try {
      builder.addReaction(`rateRule_${variable}`, {
        fn: mathMLToAst(mathEl.children[0]),
        stoichiometry: [{ name: variable, value: new Num(1) }],
      });
    } catch (e) {
      console.warn(`Failed to parse rate rule for ${variable}:`, e);
    }
  }

  // 7. Reactions
  for (const reaction of doc.querySelectorAll("listOfReactions > reaction")) {
    const id = reaction.getAttribute("id");
    if (!id) continue;

    // Local parameters from kinetic law (may shadow global params)
    for (const kl of reaction.querySelectorAll("kineticLaw")) {
      for (const lp of kl.querySelectorAll(
        "listOfLocalParameters > localParameter, listOfParameters > parameter",
      )) {
        const lpId = lp.getAttribute("id");
        const lpVal = parseFloatAttr(lp, "value");
        if (lpId && !isNaN(lpVal) && !builder.parameters.has(lpId) && !builder.variables.has(lpId)) {
          builder.addParameter(lpId, { value: lpVal });
        }
      }
    }

    // Build net stoichiometry (combine reactants + products, skip boundary species)
    const stoichMap = new Map<string, number>();

    for (const ref of reaction.querySelectorAll("listOfReactants > speciesReference")) {
      const species = ref.getAttribute("species");
      if (!species || boundarySpecies.has(species)) continue;
      const refId = ref.getAttribute("id");
      let stoichVal =
        refId && builder.parameters.has(refId)
          ? builder.parameters.get(refId)!.value
          : parseFloatAttr(ref, "stoichiometry");
      if (isNaN(stoichVal)) stoichVal = 1;
      stoichMap.set(species, (stoichMap.get(species) ?? 0) - Math.abs(stoichVal));
    }

    for (const ref of reaction.querySelectorAll("listOfProducts > speciesReference")) {
      const species = ref.getAttribute("species");
      if (!species || boundarySpecies.has(species)) continue;
      const refId = ref.getAttribute("id");
      let stoichVal =
        refId && builder.parameters.has(refId)
          ? builder.parameters.get(refId)!.value
          : parseFloatAttr(ref, "stoichiometry");
      if (isNaN(stoichVal)) stoichVal = 1;
      stoichMap.set(species, (stoichMap.get(species) ?? 0) + Math.abs(stoichVal));
    }

    const stoichiometry: Stoichiometry = [...stoichMap.entries()]
      .filter(([, val]) => val !== 0)
      .map(([name, val]) => ({ name, value: new Num(val) }));

    const mathEl = reaction.querySelector("kineticLaw > math");
    if (!mathEl || mathEl.children.length === 0) continue;

    try {
      const displayName = reaction.getAttribute("name");
      builder.addReaction(id, {
        fn: mathMLToAst(mathEl.children[0]),
        stoichiometry,
        displayName: displayName && displayName !== id ? displayName : undefined,
      });
    } catch (e) {
      console.warn(`Failed to parse reaction ${id}:`, e);
    }
  }

  return builder;
}
