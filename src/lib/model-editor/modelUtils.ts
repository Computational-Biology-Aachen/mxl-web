import type { Base } from "$lib/mathml";
import { Minus, Num } from "$lib/mathml";
import type { Stoichiometry } from "./modelBuilder";

const LINE_LIMIT = 60;

export function renderTerms(
  terms: { tex: string; value: Base }[],
  texNames: Map<string, string>,
): string[] {
  if (terms.length === 0) return ["0"];

  type SignedTerm = { sign: "+" | "-"; tex: string };
  const signed: SignedTerm[] = terms.map(({ tex, value }) => {
    let sign: "+" | "-" = "+";
    let coeff: Base = value;

    if (value instanceof Num && value.value < 0) {
      sign = "-";
      coeff = new Num(-value.value);
    } else if (value instanceof Minus && value.children.length === 1) {
      sign = "-";
      coeff = value.children[0];
    }

    const isOne = coeff instanceof Num && coeff.value === 1;
    const rendered = isOne ? tex : `${coeff.toTex(texNames)} \\cdot ${tex}`;
    return { sign, tex: rendered };
  });

  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < signed.length; i++) {
    const { sign, tex } = signed[i];
    if (i === 0) {
      currentLine = sign === "-" ? `- ${tex}` : tex;
    } else {
      const addition = ` ${sign} ${tex}`;
      if (currentLine.length + addition.length > LINE_LIMIT) {
        lines.push(currentLine);
        currentLine = `${sign} ${tex}`;
      } else {
        currentLine += addition;
      }
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

export function stoichToTex(
  stoich: Stoichiometry,
  texNames: Map<string, string>,
): string {
  const filtered = stoich.filter(({ value }) =>
    value instanceof Num ? value.value !== 0 : true,
  );
  if (filtered.length === 0) return "0";

  const terms = filtered.map(({ name, value }: { name: string; value: Base }) => ({
    tex: texNames.get(name) || name,
    value,
  }));

  const lines = renderTerms(terms, texNames);
  if (lines.length === 1) return lines[0];
  return `\\begin{aligned}& ${lines.join(" \\\\ & ")}\\end{aligned}`;
}

export function defaultValue(a: string | undefined, b: string): string {
  if (a === undefined) return b;
  return a;
}

export function defaultTexName(name: string): string {
  return `\\text\{${name}\}`;
}
