export const modelPy = `
    def tripartite(
        time: float,
        variables: Iterable[float],
        r_p: float,
        r_m: float,
        alpha: float,
        beta: float,
        eta: float,
        gamma: float,
        nu: float,
    ) -> Iterable[float]:
        P, C, M = variables

        # Eq.
        # dP/dt = r_p·P − α·P·C − β·P·M − η·P^2
        # dC/dt = α·P·C − ν·C^2
        # dM/dt = r_m·M − β·M·P − γ·M^2
        dPdt = r_p * P - alpha * P * C - beta * P * M - eta * P * P
        dCdt = alpha * P * C - nu * C * C
        dMdt = r_m * M - beta * M * P - gamma * M * M
        return dPdt, dCdt, dMdt

    tripartite
    `
