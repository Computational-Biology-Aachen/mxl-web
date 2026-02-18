export function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
  return arr.map((x) => x[n]);
}

export const widthSmall = "800px";
