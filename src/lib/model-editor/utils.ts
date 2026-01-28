import { Add, Minus, Mul, Name, Num } from "$lib/mathml";

export type Stoich = { name: string; value: Num };
export type Stoichs = Array<Stoich>;

const One = new Num(1.0);
const NegOne = new Num(-1.0);

export function stoichsToTex(stoichs: Stoichs) {
  return stoichs
    .map(({ name, value }) => {
      const newName = new Name(name);

      if (value.value === 1.0) {
        return newName;
      }
      if (value.value === -1.0) {
        return new Minus([newName]);
      }
      return new Mul([value, newName]);
    })
    .reduce((previous, current) => {
      if (current.constructor.name === "Minus") {
        return new Minus([previous, ...(current as Minus).children]);
      }
      if (current.constructor.name === "Mul") {
        if ((current as Mul).children[0].constructor.name === "Minus") {
          return new Minus([previous, ...(current as Minus).children]);
        }
      }
      return new Add([previous, current]);
    })
    .toTex();
}
