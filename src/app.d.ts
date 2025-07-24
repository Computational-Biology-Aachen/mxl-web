// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

// Type declaration for plotly.js-dist-min
declare module "plotly.js-dist-min" {
  import * as Plotly from "plotly.js";
  export = Plotly;
}

export {};
