export const modelPy = `
    def population_dynamics(
        time: float,
        variables: Iterable[float],
        mu_e,
        mu_c,
        a_e,
        a_c,
        theta,
    ):
        e, c = variables

        # // Rates
        v0 = e * a_e * mu_e

        dEdt = v0
        dCdt = c * a_c * mu_c - c * theta * c
        return dEdt, dCdt

    population_dynamics
`
