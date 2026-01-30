export const modelPy1 = `
    def lotka_volterra(
        t: float,
        y: Iterable[float],
        alpha: float,
        beta: float,
        gamma: float,
        delta: float,
        K: float,
    ) -> Iterable[float]:
        prey, pred = y

        dxdt = alpha * prey - beta * prey * pred
        dydt = -gamma * pred + delta * prey * pred
        return dxdt, dydt

    lotka_volterra
    `;

export const modelPy2 = `
    def lotka_volterra(
        t: float,
        y: Iterable[float],
        alpha: float,
        beta: float,
        gamma: float,
        delta: float,
        K: float,
    ) -> Iterable[float]:
        prey, pred = y

        dxdt = alpha * prey * (1 - prey / K) - beta * prey * pred
        dydt = -gamma * pred + delta * prey * pred
        return dxdt, dydt

    lotka_volterra
    `;
