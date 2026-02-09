let idCounter = 0;

// Acts as a common ancestor for all expression node types
export abstract class Base {
  id: number;
  abstract toJs(): string;
  abstract toPy(): string;
  abstract toTex(texNames: Map<string, string>): string;
  abstract getSymbols(symbols: Set<string>): Set<string>;
  // abstract default(): Base;
  abstract replace(id: number, next: Base): { node: Base; changed: boolean };

  constructor() {
    this.id = ++idCounter;
  }
}

// Other base classes to reduce code churn
export abstract class Nullary extends Base {
  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }
    return { node: this, changed: false };
  }
}

export abstract class Unary extends Base {
  abstract child: Base;

  // default(): Base {
  //   const Constructor = this.constructor as new (child: Base) => this;
  //   return new Constructor(Name.prototype.default());
  // }

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node, changed } = this.child.replace(id, next);
    if (changed) {
      const Constructor = this.constructor as new (child: Base) => this;
      const cloned = new Constructor(node);
      cloned.id = this.id;
      return { node: cloned, changed: true };
    }
    return { node: this, changed: false };
  }

  getSymbols(symbols: Set<string>): Set<string> {
    return this.child.getSymbols(symbols);
  }
}

export abstract class Binary extends Base {
  abstract left: Base;
  abstract right: Base;

  // default(): Base {
  //   const Constructor = this.constructor as new (
  //     left: Base,
  //     right: Base,
  //   ) => this;
  //   return new Constructor(Name.prototype.default(), Name.prototype.default());
  // }

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    const { node: left, changed: changedLeft } = this.left.replace(id, next);
    if (changedLeft) {
      const Constructor = this.constructor as new (
        left: Base,
        right: Base,
      ) => this;
      const cloned = new Constructor(left, this.right);
      cloned.id = this.id;
      return { node: cloned, changed: true };
    }

    const { node: right, changed: changedRight } = this.right.replace(id, next);
    if (changedRight) {
      const Constructor = this.constructor as new (
        left: Base,
        right: Base,
      ) => this;
      const cloned = new Constructor(this.left, right);
      cloned.id = this.id;
      return { node: cloned, changed: true };
    }

    return { node: this, changed: false };
  }
  getSymbols(symbols: Set<string>): Set<string> {
    this.left.getSymbols(symbols);
    this.right.getSymbols(symbols);
    return symbols;
  }
}

export abstract class Nary extends Base {
  abstract children: Base[];

  // default(): Base {
  //   const Constructor = this.constructor as new (children: Base[]) => this;
  //   return new Constructor([
  //     Name.prototype.default(),
  //     Name.prototype.default(),
  //   ]);
  // }

  replace(id: number, next: Base): { node: Base; changed: boolean } {
    if (this.id === id) {
      return { node: next, changed: true };
    }

    // Check all children
    const children = this.children.map((child) => {
      return child.replace(id, next);
    });

    if (children.some(({ changed }) => changed)) {
      const Constructor = this.constructor as new (children: Base[]) => this;
      const cloned = new Constructor(children.map(({ node }) => node));
      cloned.id = this.id;
      return { node: cloned, changed: true };
    }
    return { node: this, changed: false };
  }

  getSymbols(symbols: Set<string>): Set<string> {
    for (const child of this.children) {
      child.getSymbols(symbols);
    }
    return symbols;
  }
}

///////////////////////////////////////////////////////////////////////////////
// Nullary fns
// Also didn't belive that is the term, but check it
// https://en.wikipedia.org/wiki/Arity
///////////////////////////////////////////////////////////////////////////////

export class Name extends Nullary {
  constructor(public name: string) {
    super();
  }

  default(): Name {
    return new Name("default");
  }
  update(name: string): Base {
    return new Name(name);
  }
  toJs(): string {
    return this.name;
  }
  toPy(): string {
    return this.name;
  }
  toTex(texNames: Map<string, string>): string {
    return texNames.get(this.name) || this.name;
  }
  getSymbols(symbols: Set<string>): Set<string> {
    symbols.add(this.name);
    return symbols;
  }
}

export class Num extends Nullary {
  constructor(public value: number) {
    super();
  }
  default(): Num {
    return new Num(1.0);
  }
  update(value: number): Base {
    return new Num(value);
  }
  toJs(): string {
    return `${this.value}`;
  }
  toPy(): string {
    return `${this.value}`;
  }
  toTex(texNames: Map<string, string>): string {
    return `${this.value}`;
  }

  getSymbols(symbols: Set<string>): Set<string> {
    return symbols;
  }
}
