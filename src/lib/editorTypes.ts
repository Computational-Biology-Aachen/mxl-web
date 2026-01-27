export type NodeKind = "symbol" | "number" | "divide" | "mul" | "add";

export type SymbolNode = {
  type: "symbol";
  id: string;
  name: string;
};

export type NumberNode = {
  type: "number";
  id: string;
  value: number;
};

export type DivideNode = {
  type: "divide";
  id: string;
  children: [EditorNode, EditorNode];
};

export type MulNode = {
  type: "mul";
  id: string;
  children: [EditorNode, EditorNode];
};
export type AddNode = {
  type: "add";
  id: string;
  children: [EditorNode, EditorNode];
};
export type EditorNode =
  | SymbolNode
  | NumberNode
  | DivideNode
  | MulNode
  | AddNode;
