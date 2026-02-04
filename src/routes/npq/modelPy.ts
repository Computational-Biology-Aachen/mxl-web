export const modelPy = `
def npq(
    time: float,
    variables: Iterable[float],
    ppfd: float,
):
    (
        ATP,
        Plastoquinone_oxidised,
        Plastocyanine_oxidised,
        Ferredoxine_oxidised,
        protons_lumen,
        Light_harvesting_complex,
        PsbS_de_protonated,
        Violaxanthin,
    ) = variables

    pH: float = 7.9
    NADPH: float = 0.6
    O2_dissolved_lumen: float = 8.0
    bH: float = 100.0
    F: float = 96.485
    E0_PC: float = 0.38
    E0_P700: float = 0.48
    E0_FA: float = -0.55
    E0_Fd: float = -0.43
    E0_NADP: float = -0.113
    NADP_: float = 0.8
    R: float = 0.0083
    T: float = 298.0
    A_P: float = 2.55
    Carotenoids_tot: float = 1.0
    Fd_: float = 5.0
    PC_tot: float = 4.0
    PSBS_tot: float = 1.0
    LHC_tot: float = 1.0
    gamma0: float = 0.1
    gamma1: float = 0.25
    gamma2: float = 0.6
    gamma3: float = 0.15
    kZSat: float = 0.12
    E0_QA: float = -0.14
    E0_PQ: float = 0.354
    PQ_tot: float = 17.5
    staticAntII: float = 0.1
    staticAntI: float = 0.37
    kf_atp_synthase: float = 20.0
    HPR: float = 4.666666666666667
    Pi_mol: float = 0.01
    DeltaG0_ATP: float = 30.6
    kcat_b6f: float = 2.5
    kh_lhc_protonation: float = 3.0
    kf_lhc_protonation: float = 0.0096
    ksat_lhc_protonation: float = 5.8
    kf_lhc_deprotonation: float = 0.0096
    kf_cyclic_electron_flow: float = 1.0
    kf_violaxanthin_deepoxidase: float = 0.0024
    kh_violaxanthin_deepoxidase: float = 5.0
    ksat_violaxanthin_deepoxidase: float = 5.8
    kf_zeaxanthin_epoxidase: float = 0.00024
    E0_fnr: float = 3.0
    kcat_fnr: float = 500.0
    km_fnr_Ferredoxine_reduced: float = 1.56
    km_fnr_NADP: float = 0.22
    kf_ndh: float = 0.002
    PSII_total: float = 2.5
    PSI_total: float = 2.5
    kH0: float = 500000000.0
    kPQred: float = 250.0
    kPCox: float = 2500.0
    kFdred: float = 250000.0
    k2: float = 5000000000.0
    kH: float = 5000000000.0
    kF: float = 625000000.0
    kf_proton_leak: float = 10.0
    kPTOX: float = 0.01
    kStt7: float = 0.0035
    km_lhc_state_transition_12: float = 0.2
    n_ST: float = 2.0
    kPph1: float = 0.0013
    kf_ex_atp: float = 10.0
    NADP: float = -NADPH + NADP_
    RT: float = R * T
    ADP: float = -ATP + A_P
    dG_pH: float = R * T * math.log(10)
    pH_lumen: float = -math.log(0.00025 * protons_lumen) / math.log(10)
    Zeaxanthin: float = Carotenoids_tot - Violaxanthin
    Ferredoxine_reduced: float = Fd_ - Ferredoxine_oxidised
    Plastocyanine_reduced: float = PC_tot - Plastocyanine_oxidised
    PsbS_protonated: float = PSBS_tot - PsbS_de_protonated
    Light_harvesting_complex_protonated: float = LHC_tot - Light_harvesting_complex
    Q: float = (
        PsbS_de_protonated * Violaxanthin * gamma0
        + (PsbS_de_protonated * Zeaxanthin * gamma3) / (Zeaxanthin + kZSat)
        + PsbS_protonated * Violaxanthin * gamma1
        + (PsbS_protonated * Zeaxanthin * gamma2) / (Zeaxanthin + kZSat)
    )
    keq_Plastoquinone_reduced: float = math.exp(
        (2 * E0_PQ * F - 2 * E0_QA * F - 2 * dG_pH * pH) / RT,
    )
    Plastoquinone_reduced: float = PQ_tot - Plastoquinone_oxidised
    PSII_cross_section: float = (
        Light_harvesting_complex * (-staticAntI - staticAntII + 1.0) + staticAntII
    )
    keq_atp_synthase: float = Pi_mol * math.exp(
        (-DeltaG0_ATP + HPR * dG_pH * (pH - pH_lumen)) / RT
    )
    keq_b6f: float = math.exp(
        (
            2 * E0_PC * F
            - 2 * E0_PQ * F
            + 2 * dG_pH * pH_lumen
            - 2 * dG_pH * (pH - pH_lumen)
        )
        / RT,
    )
    keq_fnr: float = math.exp(
        (-2 * E0_Fd * F + 2 * E0_NADP * F - dG_pH * pH) / RT,
    )
    vmax_fnr: float = E0_fnr * kcat_fnr
    keq_PCP700: float = math.exp((E0_P700 * F - E0_PC * F) / RT)
    keq_ferredoxin_reductase: float = math.exp(
        (-E0_FA * F + E0_Fd * F) / RT,
    )
    B1: float = (
        ppfd
        * PSII_cross_section
        * PSII_total
        * Plastoquinone_oxidised
        * kPQred
        * keq_Plastoquinone_reduced
        * (Q * kH + kF + kH0)
    ) / (
        ppfd
        * PSII_cross_section
        * Plastoquinone_oxidised
        * Q
        * kH
        * kPQred
        * keq_Plastoquinone_reduced
        + ppfd
        * PSII_cross_section
        * Plastoquinone_oxidised
        * kF
        * kPQred
        * keq_Plastoquinone_reduced
        + ppfd
        * PSII_cross_section
        * Plastoquinone_oxidised
        * kH0
        * kPQred
        * keq_Plastoquinone_reduced
        + ppfd * PSII_cross_section * Plastoquinone_reduced * Q * kH * kPQred
        + ppfd * PSII_cross_section * Plastoquinone_reduced * k2 * kPQred
        + ppfd * PSII_cross_section * Plastoquinone_reduced * kF * kPQred
        + ppfd * PSII_cross_section * Plastoquinone_reduced * kH0 * kPQred
        + ppfd * PSII_cross_section * Q * k2 * kH * keq_Plastoquinone_reduced
        + ppfd * PSII_cross_section * k2 * kF * keq_Plastoquinone_reduced
        + ppfd * PSII_cross_section * k2 * kH0 * keq_Plastoquinone_reduced
        + math.pow(ppfd, 2.0)
        * math.pow(PSII_cross_section, 2.0)
        * k2
        * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised * Q * k2 * kH * kPQred * keq_Plastoquinone_reduced
        + 2.0
        * Plastoquinone_oxidised
        * Q
        * kF
        * kH
        * kPQred
        * keq_Plastoquinone_reduced
        + 2.0
        * Plastoquinone_oxidised
        * Q
        * kH
        * kH0
        * kPQred
        * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised
        * math.pow(Q, 2.0)
        * math.pow(kH, 2.0)
        * kPQred
        * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised * k2 * kF * kPQred * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised * k2 * kH0 * kPQred * keq_Plastoquinone_reduced
        + 2.0 * Plastoquinone_oxidised * kF * kH0 * kPQred * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised
        * math.pow(kF, 2.0)
        * kPQred
        * keq_Plastoquinone_reduced
        + Plastoquinone_oxidised
        * math.pow(kH0, 2.0)
        * kPQred
        * keq_Plastoquinone_reduced
        + Plastoquinone_reduced * Q * k2 * kH * kPQred
        + 2.0 * Plastoquinone_reduced * Q * kF * kH * kPQred
        + 2.0 * Plastoquinone_reduced * Q * kH * kH0 * kPQred
        + Plastoquinone_reduced * math.pow(Q, 2.0) * math.pow(kH, 2.0) * kPQred
        + Plastoquinone_reduced * k2 * kF * kPQred
        + Plastoquinone_reduced * k2 * kH0 * kPQred
        + 2.0 * Plastoquinone_reduced * kF * kH0 * kPQred
        + Plastoquinone_reduced * math.pow(kF, 2.0) * kPQred
        + Plastoquinone_reduced * math.pow(kH0, 2.0) * kPQred
    )
    A1: float = PSI_total / (
        (1.0 + Ferredoxine_reduced / (Ferredoxine_oxidised * keq_ferredoxin_reductase))
        * (
            (ppfd * (1.0 - PSII_cross_section)) / (Plastocyanine_reduced * kPCox)
            + Plastocyanine_oxidised / (Plastocyanine_reduced * keq_PCP700)
        )
        + 1.0
        + (ppfd * (1.0 - PSII_cross_section)) / (Ferredoxine_oxidised * kFdred)
    )
    atp_synthase: float = kf_atp_synthase * (ADP - ATP / keq_atp_synthase)
    b6f: float = max(
        -kcat_b6f,
        kcat_b6f
        * (
            math.pow(Plastocyanine_oxidised, 2) * Plastoquinone_reduced
            - (math.pow(Plastocyanine_reduced, 2) * Plastoquinone_oxidised) / keq_b6f
        ),
    )
    lhc_protonation: float = (
        PsbS_de_protonated
        * kf_lhc_protonation
        * math.pow(protons_lumen, kh_lhc_protonation)
    ) / (
        math.pow(protons_lumen, kh_lhc_protonation)
        + math.pow(
            4000.0 * math.pow(10.0, -ksat_lhc_protonation),
            kh_lhc_protonation,
        )
    )
    lhc_deprotonation: float = PsbS_protonated * kf_lhc_deprotonation
    cyclic_electron_flow: float = (
        math.pow(Ferredoxine_reduced, 2.0)
        * Plastoquinone_oxidised
        * kf_cyclic_electron_flow
    )
    violaxanthin_deepoxidase: float = (
        Violaxanthin
        * kf_violaxanthin_deepoxidase
        * math.pow(protons_lumen, kh_violaxanthin_deepoxidase)
    ) / (
        math.pow(protons_lumen, kh_violaxanthin_deepoxidase)
        + math.pow(
            4000.0 * math.pow(10.0, -ksat_violaxanthin_deepoxidase),
            kh_violaxanthin_deepoxidase,
        )
    )
    zeaxanthin_epoxidase: float = Zeaxanthin * kf_zeaxanthin_epoxidase
    fnr: float = (
        vmax_fnr
        * (
            (NADP * math.pow(Ferredoxine_reduced / km_fnr_Ferredoxine_reduced, 2.0))
            / km_fnr_NADP
            - (NADPH * math.pow(Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced, 2.0))
            / (keq_fnr * km_fnr_NADP)
        )
    ) / (
        (NADP / km_fnr_NADP + 1.0)
        * (
            Ferredoxine_reduced / km_fnr_Ferredoxine_reduced
            + math.pow(Ferredoxine_reduced / km_fnr_Ferredoxine_reduced, 2.0)
            + 1.0
        )
        + (NADPH / km_fnr_NADP + 1.0)
        * (
            Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced
            + math.pow(Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced, 2.0)
            + 1.0
        )
        - 1.0
    )
    ndh: float = Plastoquinone_oxidised * kf_ndh
    PSII: float = 0.5 * B1 * k2
    PSI: float = A1 * ppfd * (1.0 - PSII_cross_section)
    proton_leak: float = kf_proton_leak * (protons_lumen - 4000.0 * math.pow(10.0, -pH))
    PTOX: float = O2_dissolved_lumen * Plastoquinone_reduced * kPTOX
    lhc_state_transition_12: float = (1.0 * Light_harvesting_complex * kStt7) / (
        math.pow(
            Plastoquinone_oxidised / (PQ_tot * km_lhc_state_transition_12),
            n_ST,
        )
        + 1.0
    )
    lhc_state_transition_21: float = Light_harvesting_complex_protonated * kPph1
    ex_atp: float = ATP * kf_ex_atp
    dATPdt: float = atp_synthase - ex_atp
    dprotons_lumendt: float = (
        (-HPR * atp_synthase) / bH
        + (2.0 * PSII) / bH
        + (4.0 * b6f) / bH
        - proton_leak / bH
    )
    dPlastocyanine_oxidiseddt: float = PSI - 2 * b6f
    dPlastoquinone_oxidiseddt: float = -PSII + PTOX + b6f - cyclic_electron_flow - ndh
    dPsbS_de_protonateddt: float = lhc_deprotonation - lhc_protonation
    dFerredoxine_oxidiseddt: float = -PSI + 2 * cyclic_electron_flow + 2 * fnr
    dViolaxanthindt: float = -violaxanthin_deepoxidase + zeaxanthin_epoxidase
    dLight_harvesting_complexdt: float = (
        -lhc_state_transition_12 + lhc_state_transition_21
    )
    return [
        dATPdt,
        dPlastoquinone_oxidiseddt,
        dPlastocyanine_oxidiseddt,
        dFerredoxine_oxidiseddt,
        dprotons_lumendt,
        dLight_harvesting_complexdt,
        dPsbS_de_protonateddt,
        dViolaxanthindt,
    ]

npq
`;
