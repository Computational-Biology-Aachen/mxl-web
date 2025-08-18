# mxl-web

MxlWeb is an experimental toolbox to run ODE models in the browser.

All code execution is client-side which means no giant servers required ❤️.


## Tool family 🏠

`MxlWeb` is part of a larger family of tools that are designed with a similar set of abstractions. Check them out!

- [MxlPy](https://github.com/Computational-Biology-Aachen/MxlPy) is a Python package for mechanistic learning (Mxl)
- [MxlBricks](https://github.com/Computational-Biology-Aachen/mxl-bricks) is built on top of `MxlPy` to build mechanistic models composed of pre-defined reactions (bricks)


## Setup

```
npm install
npm run dev -- --open
```

## wasm build

```
wasm-pack build --out-dir src/lib/pkg && npm run dev -- --open
```


