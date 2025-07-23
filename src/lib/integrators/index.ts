export type rHS = (t: number, y: Array<number>, pars: Array<number>) => Array<number>;

export interface Integration {
    time: number[];
    values: number[][];
    err?: string;
}
