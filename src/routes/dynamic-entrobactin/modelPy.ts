export const modelPy = `
    def enterobactin(
        time: float,
        variables: Iterable[float],
        mu_e,
        mu_c,
        a_e,
        a_c,
        K_e,
        K_c,
        theta,
        r_prod,
        r_cons_e,
        r_cons_c,
    ):
        (E, C, B) = variables

        # // Monod terms for growth
        uptake_E_growth = (a_e * B) / (K_e + B)
        uptake_C_growth = (a_c * B) / (K_c + B)

        # // Consumption terms in dB/dt (as specified: K + a*B)
        cons_term_E = mu_e * ((a_e * B) / (K_e + a_e * B)) * E
        cons_term_C = mu_c * ((a_c * B) / (K_c + a_c * B)) * C

        dEdt = mu_e * uptake_E_growth * E
        dCdt = mu_c * uptake_C_growth * C - theta * C * C
        dBdt = r_prod * E - r_cons_e * cons_term_E - r_cons_c * cons_term_C

        return [dEdt, dCdt, dBdt]

    enterobactin
    `;
