# mxl-web

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

Browser-side ODE model explorer. All compute is client-side — no server required. SvelteKit 5, adapter-static. Deployed at `/mxl-web`.

Three compute backends run in web workers: pure JS integrators, Pyodide (Python/WASM), and a custom WASM build from C via Emscripten. Integrators include explicit (Euler, RK2, RK45, BOSH3, Tsit5) and implicit (backward Euler, Kvaerno45) solvers.

The model builders, IR, MathML → WAT pipeline, and the three backends live in the shared [`@computational-biology-aachen/mxlweb-core`](https://github.com/Computational-Biology-Aachen/mxlweb-core) package, which this site also drives the development of.

## Dev

```bash
npm install
npm run dev          # dev server on :5173
npm run build        # static build → build/
npm run check        # TypeScript + Svelte type checking
npm run lint         # Prettier + ESLint check
npm run format       # auto-format with Prettier
npm run test         # vitest
```

## Tool family 🏠

`MxlWeb` is part of a larger ecosystem:

- [mxlweb-core](https://github.com/Computational-Biology-Aachen/mxlweb-core) — shared model-building and compute engine behind this site
- [design](https://github.com/Computational-Biology-Aachen/design) — shared CPBL design system: tokens + Svelte components
- [MxlPy](https://github.com/Computational-Biology-Aachen/MxlPy) — Python package for mechanistic learning
- [MxlBricks](https://github.com/Computational-Biology-Aachen/mxl-bricks) — pre-defined reaction bricks on top of MxlPy
- [MxlModels](https://github.com/Computational-Biology-Aachen/mxl-models) — flat single-file model versions for easy inspection
- [pysbml](https://github.com/Computational-Biology-Aachen/pysbml) — SBML import/export for MxlPy
- [Parameteriser](https://gitlab.com/marvin.vanaalst/parameteriser) — kinetic parameter lookup from BRENDA and other databases
