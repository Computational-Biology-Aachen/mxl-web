import { Add, Minus, Mul, Name, Num } from "$lib/mathml";
import type { Stoichiometry } from "./modelBuilder";

export function stoichToTex(
  stoich: Stoichiometry,
  texNames: Map<string, string>,
): string {
  const filtered = stoich.filter(({ value }) => value.value !== 0);

  if (filtered.length === 0) return "0";

  return filtered
    .map(({ name, value }: { name: string; value: Num }) => {
      return new Mul([value, new Name(name)]);
    })
    .reduce((previous, current) => {
      const [value, name] = current.children as [Num, Name];

      if (value.value < 0) {
        return new Minus([previous, new Mul([new Num(-value.value), name])]);
      }
      return new Add([previous, current]);
    })
    .toTex(texNames);
}
export function defaultValue(a: string | undefined, b: string): string {
  if (a === undefined) return b;
  return a;
}

export function defaultTexName(name: string): string {
  return `\\text\{${name}\}`;
}

// export function stoichToTex(
//   stoich: Stoichiometry,
//   texNames: Map<string, string>,
// ): string {
//   const filtered = stoich.filter(({ value }) => value.value !== 0);
//   console.log(filtered.length);
//   if (filtered.length === 0) return "0";
//   return filtered
//     .map(({ name, value }: { name: string; value: Num }) => {
//       const newName = new Name(name);
//       // Turn 1x and -1x into x and -x
//       if (value.value === 1.0) {
//         return newName;
//       }
//       if (value.value === -1.0) {
//         return new Minus([newName]);
//       }
//       return new Mul([value, newName]);
//     })
//     .reduce((previous, current) => {
//       // a + b
//       if (current instanceof Name) {
//         return new Add([previous, current]);
//       }
//       // a - b
//       if (current instanceof Minus) {
//         return new Minus([previous, ...(current as Minus).children]);
//       }
//       // in all other cases has to be Mul(Num, Name)
//       const mul = current as Mul;
//       const val = mul.children[0];
//       const value: number = (val as Num).value;
//       if (value < 0) {
//         return new Minus([
//           previous,
//           new Mul([new Num(-value), mul.children[1]]),
//         ]);
//       }
//       return new Add([previous, current]);
//     })
//     .toTex(texNames);
// }
