from dataclasses import dataclass
from typing import Any, Callable, Iterable, Literal

import numpy as np
from scipy.integrate import solve_ivp


@dataclass(slots=True)
class Result[T]:
    """Generic Result type."""

    value: T | Exception

    def unwrap_or_err(self) -> T:
        """Obtain value if Ok, else raise exception."""
        if isinstance(value := self.value, Exception):
            raise value
        return value

    def default(self, fn: Callable[[], T]) -> T:
        """Obtain value if Ok, else create default one."""
        if isinstance(value := self.value, Exception):
            return fn()
        return value


@dataclass
class Simulation:
    ts: np.ndarray
    ys: np.ndarray


def ts(t_end: float, n: int) -> dict[str, Any]:
    return {"t_span": (0, t_end), "t_eval": np.linspace(0, t_end, n)}


def integrate(
    model: Callable[[float, Iterable[float]], Iterable[float]],
    y0: Iterable[float],
    t_end: float,
    pars: Iterable[float],
    n: int = 500,
    method: Literal["RK45", "LSODA", "BDF"] = "LSODA",
) -> tuple[np.ndarray, np.ndarray, str | None]:
    try:
        res = solve_ivp(
            model,
            y0=y0,
            args=pars,
            method=method,
            **ts(t_end, n),
        )
        return res.t, res.y.T, None
    except Exception as e:
        return np.array([]), np.array([]), str(e)


class FuncContainer:
    pass


py_funcs = FuncContainer()
py_funcs.integrate = integrate  # type: ignore

# pyodide returns last statement as an object that is assessable from javascript
py_funcs  # type: ignore
