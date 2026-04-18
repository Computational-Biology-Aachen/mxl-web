# mxl-web

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

MxlWeb is an experimental toolbox to run ODE models in the browser.

All code execution is client-side which means no giant servers required ❤️.

## Tool family 🏠

`MxlWeb` is part of a larger family of tools that are designed with a similar set of abstractions. Check them out!

- [MxlPy](https://github.com/Computational-Biology-Aachen/MxlPy) is a Python package for mechanistic learning (Mxl)
- [MxlBricks](https://github.com/Computational-Biology-Aachen/mxl-bricks) is built on top of `MxlPy` to build mechanistic models composed of pre-defined reactions (bricks)
- [MxlModels](https://github.com/Computational-Biology-Aachen/mxl-models) supplies flat, single-file versions of MxlBricks models for easy inspection
- [pysbml](https://github.com/Computational-Biology-Aachen/pysbml) simplifies SBML models for import/export with MxlPy
- [Parameteriser](https://gitlab.com/marvin.vanaalst/parameteriser) looks up kinetic parameters from BRENDA and other databases

## Setup

```
npm install
npm run dev -- --open
```

## wasm build

```
wasm-pack build --release --out-dir src/lib/pkg && npm run dev -- --open
```
