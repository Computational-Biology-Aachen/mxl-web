# type: ignore

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
    n: int,
    method: Literal["RK45", "LSODA", "BDF", "Radau"],
) -> tuple[np.ndarray, np.ndarray, str | None]:

    try:
        res = solve_ivp(
            model,
            y0=y0,
            args=pars,
            method=method,
            atol=1e-6,
            rtol=1e-6,
            **ts(t_end, n),
        )
        if res.success:
            return res.t, res.y.T, None
        return np.array([]), np.array([]), res.message
    except Exception as e:
        return np.array([]), np.array([]), str(e)


def integrate_protocol(
    model: Callable[[float, Iterable[float]], Iterable[float]],
    y0: Iterable[float],
    pars: Iterable[float],
    n: int,
    method: Literal["RK45", "LSODA", "BDF", "Radau"],
    protocol: list[dict[str, float]],  # (t_end, ppfd)
    # Return structure given by pyWorker.ts
) -> tuple[np.ndarray, np.ndarray, str | None]:
    ts_all = []
    ys_all = []

    t_start = 0
    for step in protocol:
        t_end = step["t_end"]
        ppfd = step["PFD"]
        try:
            res = solve_ivp(
                model,
                y0=y0,
                args=(ppfd, *pars),
                method=method,
                t_span=(t_start, t_end),
                t_eval=np.linspace(t_start, t_end, n),
                rtol=1e-8,  # manually set
                atol=1e-8,  # manually set
            )
        except Exception as e:
            return np.array([]), np.array([]), str(e)

        if not res.success:
            return np.array([]), np.array([]), res.message

        t_start = t_end
        t_sim = res.t
        y_sim = res.y.T
        y0 = y_sim[-1]

        if len(ts_all) > 0:
            ts_all.append(t_sim[1:])
            ys_all.append(y_sim[1:])
        else:
            ts_all.append(t_sim)
            ys_all.append(y_sim)

    return np.concat(ts_all), np.concat(ys_all), None


class FuncContainer:
    pass


py_funcs = FuncContainer()
py_funcs.integrate = integrate  # type: ignore
py_funcs.integrate_protocol = integrate_protocol  # type: ignore

# pyodide returns last statement as an object that is assessable from javascript
py_funcs  # type: ignore
