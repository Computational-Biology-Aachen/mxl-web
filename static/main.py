from typing import Any, Literal

import numpy as np
from scipy.integrate import solve_ivp

###############################################################################
# integration stuff
###############################################################################


def ts(t_end: float, n: int) -> dict[str, Any]:
    return {"t_span": (0, t_end), "t_eval": np.linspace(0, t_end, n)}


def integrate(
    model,
    y0,
    t_end: float,
    pars,
    n: int = 500,
    method: Literal["RK45", "LSODA", "BDF"] = "LSODA",
):
    res = solve_ivp(
        model,
        y0=y0,
        args=pars,
        method=method,
        **ts(t_end, n),
    )

    return res.t, res.y.T


class FuncContainer:
    pass


py_funcs = FuncContainer()
py_funcs.integrate = integrate  # type: ignore

# pyodide returns last statement as an object that is assessable from javascript
py_funcs  # type: ignore
