# type: ignore

import json
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


def time_points(t_end: float, n: int) -> dict[str, Any]:
    return {"t_span": (0, t_end), "t_eval": np.linspace(0, t_end, n)}


STIFF_METHODS = {"BDF", "LSODA", "Radau"}


def _make_error(message: str, method: str) -> str:
    hints: list[str] = []
    m = message.lower()

    is_stiff = any(
        k in m for k in ("step size", "too small", "required step", "stepsize")
    )
    is_overflow = any(
        k in m for k in ("overflow", "nan", "inf", "invalid value", "invalid float")
    )
    is_singular = any(k in m for k in ("singular", "lu decomposition"))
    is_convergence = any(
        k in m for k in ("convergence", "failed", "unsuccessful", "maximum number")
    )

    if is_stiff:
        if method not in STIFF_METHODS:
            hints.append(
                "Switch to a stiff solver: select BDF, LSODA, or Radau in the Method dropdown"
            )
        hints.append(
            "Tighten tolerances: try atol/rtol = 1e-8 (currently 1e-6) — but this slows the solver"
        )

    if is_singular:
        hints.append(
            "Try BDF or Radau — implicit solvers handle near-singular Jacobians better"
        )
        hints.append(
            "Check for division by zero or algebraic loops in your rate expressions"
        )

    if is_overflow:
        hints.append(
            "Check initial conditions for extreme values (very large or very small)"
        )
        hints.append(
            "Shorten the integration time span to find when the blow-up first occurs"
        )
        hints.append("Inspect parameters for sign errors or near-zero denominators")

    if is_convergence and not is_stiff:
        if method in STIFF_METHODS:
            hints.append(
                "Try loosening tolerances (e.g. 1e-4) — the system may be ill-conditioned"
            )
        else:
            hints.append(
                "Switch to a stiff solver: BDF, LSODA, or Radau handle stiff systems better"
            )
        hints.append(
            "Verify initial conditions satisfy any conservation laws in your model"
        )

    if not hints:
        hints.append(
            "Try a different integration method: BDF/LSODA/Radau for stiff systems, RK45 for non-stiff"
        )
        hints.append(
            "Adjust tolerances: tighten to 1e-8 for accuracy or loosen to 1e-4 if the solver is too slow"
        )
        hints.append(
            "Check that all initial conditions and parameter values are physically meaningful"
        )

    return json.dumps({"message": message, "hints": hints})


def integrate(
    model: Callable[[float, Iterable[float]], Iterable[float]],
    derived: Callable[[float, Iterable[float]], Iterable[float]],
    y0: Iterable[float],
    t_end: float,
    pars: Iterable[float],
    n: int,
    method: Literal["RK45", "LSODA", "BDF", "Radau"],
    calculate_derived: bool,
) -> tuple[np.ndarray, np.ndarray, str | None]:

    try:
        res = solve_ivp(
            model,
            y0=y0,
            args=pars,
            method=method,
            atol=1e-6,
            rtol=1e-6,
            **time_points(t_end, n),
        )
        if res.success:
            ts = res.t
            ys = res.y

            if calculate_derived:
                der = np.array(
                    [derived(t, y, *pars) for t, y in zip(ts, ys.T)],
                    dtype=float,
                ).T
                return ts, np.concat((ys, der)).T, None
            else:
                return ts, ys.T, None
        return np.array([]), np.array([]), _make_error(res.message, method)
    except Exception as e:
        return np.array([]), np.array([]), _make_error(str(e), method)


def integrate_protocol(
    model: Callable[[float, Iterable[float]], Iterable[float]],
    derived: Callable[[float, Iterable[float]], Iterable[float]],
    y0: Iterable[float],
    pars: Iterable[float],
    n: int,
    method: Literal["RK45", "LSODA", "BDF", "Radau"],
    protocol: list[dict[str, float]],  # (t_end, ppfd)
    calculate_derived: bool,
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
                rtol=1e-8,
                atol=1e-8,
            )
        except Exception as e:
            return np.array([]), np.array([]), _make_error(str(e), method)

        if not res.success:
            return np.array([]), np.array([]), _make_error(res.message, method)

        t_start = t_end
        t_sim = res.t
        y_sim = res.y.T
        y0 = y_sim[-1]

        if len(ts_all) > 0:
            t_sim = t_sim[1:]
            y_sim = y_sim[1:]

        ts_all.append(t_sim)

        if calculate_derived:
            der = np.array(
                [derived(t, y, ppfd, *pars) for t, y in zip(t_sim, y_sim)],
                dtype=float,
            )
            ys_all.append(np.concat((y_sim, der), axis=1))
        else:
            ys_all.append(y_sim)

    return np.concat(ts_all), np.concat(ys_all), None


class FuncContainer:
    pass


py_funcs = FuncContainer()
py_funcs.integrate = integrate  # type: ignore
py_funcs.integrate_protocol = integrate_protocol  # type: ignore

# pyodide returns last statement as an object that is assessable from javascript
py_funcs  # type: ignore
