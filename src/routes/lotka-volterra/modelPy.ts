export const modelPy = `
    def lotka_volterra(
        t: float,
        y: Iterable[float],
        alpha: float,
        beta: float,
        gamma: float,
        delta: float,
    ) -> Iterable[float]:
        prey, pred = y

        dxdt = alpha * prey - beta * prey * pred
        dydt = -gamma * pred + delta * prey * pred
        return dxdt, dydt

    lotka_volterra
    `;
