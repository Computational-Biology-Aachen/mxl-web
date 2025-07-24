export function model(time: number, variables: number[], pars: number[]) {
  let [
    ATP,
    Plastoquinone_oxidised,
    Plastocyanine_oxidised,
    Ferredoxine_oxidised,
    protons_lumen,
    Light_harvesting_complex,
    PsbS_de_protonated,
    Violaxanthin,
  ] = variables;

  let [PPFD] = pars;

  let pH: number = 7.9;
  let NADPH: number = 0.6;
  let O2_dissolved_lumen: number = 8.0;
  let bH: number = 100.0;
  let F: number = 96.485;
  let E0_PC: number = 0.38;
  let E0_P700: number = 0.48;
  let E0_FA: number = -0.55;
  let E0_Fd: number = -0.43;
  let E0_NADP: number = -0.113;
  let NADP_: number = 0.8;
  let R: number = 0.0083;
  let T: number = 298.0;
  let A_P: number = 2.55;
  let Carotenoids_tot: number = 1.0;
  let Fd_: number = 5.0;
  let PC_tot: number = 4.0;
  let PSBS_tot: number = 1.0;
  let LHC_tot: number = 1.0;
  let gamma0: number = 0.1;
  let gamma1: number = 0.25;
  let gamma2: number = 0.6;
  let gamma3: number = 0.15;
  let kZSat: number = 0.12;
  let E0_QA: number = -0.14;
  let E0_PQ: number = 0.354;
  let PQ_tot: number = 17.5;
  let staticAntII: number = 0.1;
  let staticAntI: number = 0.37;
  let kf_atp_synthase: number = 20.0;
  let HPR: number = 4.666666666666667;
  let Pi_mol: number = 0.01;
  let DeltaG0_ATP: number = 30.6;
  let kcat_b6f: number = 2.5;
  let kh_lhc_protonation: number = 3.0;
  let kf_lhc_protonation: number = 0.0096;
  let ksat_lhc_protonation: number = 5.8;
  let kf_lhc_deprotonation: number = 0.0096;
  let kf_cyclic_electron_flow: number = 1.0;
  let kf_violaxanthin_deepoxidase: number = 0.0024;
  let kh_violaxanthin_deepoxidase: number = 5.0;
  let ksat_violaxanthin_deepoxidase: number = 5.8;
  let kf_zeaxanthin_epoxidase: number = 0.00024;
  let E0_fnr: number = 3.0;
  let kcat_fnr: number = 500.0;
  let km_fnr_Ferredoxine_reduced: number = 1.56;
  let km_fnr_NADP: number = 0.22;
  let kf_ndh: number = 0.002;
  let PSII_total: number = 2.5;
  let PSI_total: number = 2.5;
  let kH0: number = 500000000.0;
  let kPQred: number = 250.0;
  let kPCox: number = 2500.0;
  let kFdred: number = 250000.0;
  let k2: number = 5000000000.0;
  let kH: number = 5000000000.0;
  let kF: number = 625000000.0;
  let kf_proton_leak: number = 10.0;
  let kPTOX: number = 0.01;
  let kStt7: number = 0.0035;
  let km_lhc_state_transition_12: number = 0.2;
  let n_ST: number = 2.0;
  let kPph1: number = 0.0013;
  let kf_ex_atp: number = 10.0;
  let NADP: number = -NADPH + NADP_;
  let RT: number = R * T;
  let ADP: number = -ATP + A_P;
  let dG_pH: number = R * T * Math.log(10);
  let pH_lumen: number = -Math.log(0.00025 * protons_lumen) / Math.log(10);
  let Zeaxanthin: number = Carotenoids_tot - Violaxanthin;
  let Ferredoxine_reduced: number = Fd_ - Ferredoxine_oxidised;
  let Plastocyanine_reduced: number = PC_tot - Plastocyanine_oxidised;
  let PsbS_protonated: number = PSBS_tot - PsbS_de_protonated;
  let Light_harvesting_complex_protonated: number =
    LHC_tot - Light_harvesting_complex;
  let Q: number =
    PsbS_de_protonated * Violaxanthin * gamma0 +
    (PsbS_de_protonated * Zeaxanthin * gamma3) / (Zeaxanthin + kZSat) +
    PsbS_protonated * Violaxanthin * gamma1 +
    (PsbS_protonated * Zeaxanthin * gamma2) / (Zeaxanthin + kZSat);
  let keq_Plastoquinone_reduced: number = Math.exp(
    (2 * E0_PQ * F - 2 * E0_QA * F - 2 * dG_pH * pH) / RT,
  );
  let Plastoquinone_reduced: number = PQ_tot - Plastoquinone_oxidised;
  let PSII_cross_section: number =
    Light_harvesting_complex * (-staticAntI - staticAntII + 1.0) + staticAntII;
  let keq_atp_synthase: number =
    Pi_mol * Math.exp((-DeltaG0_ATP + HPR * dG_pH * (pH - pH_lumen)) / RT);
  let keq_b6f: number = Math.exp(
    (2 * E0_PC * F -
      2 * E0_PQ * F +
      2 * dG_pH * pH_lumen -
      2 * dG_pH * (pH - pH_lumen)) /
      RT,
  );
  let keq_fnr: number = Math.exp(
    (-2 * E0_Fd * F + 2 * E0_NADP * F - dG_pH * pH) / RT,
  );
  let vmax_fnr: number = E0_fnr * kcat_fnr;
  let keq_PCP700: number = Math.exp((E0_P700 * F - E0_PC * F) / RT);
  let keq_ferredoxin_reductase: number = Math.exp(
    (-E0_FA * F + E0_Fd * F) / RT,
  );
  let B1: number =
    (PPFD *
      PSII_cross_section *
      PSII_total *
      Plastoquinone_oxidised *
      kPQred *
      keq_Plastoquinone_reduced *
      (Q * kH + kF + kH0)) /
    (PPFD *
      PSII_cross_section *
      Plastoquinone_oxidised *
      Q *
      kH *
      kPQred *
      keq_Plastoquinone_reduced +
      PPFD *
        PSII_cross_section *
        Plastoquinone_oxidised *
        kF *
        kPQred *
        keq_Plastoquinone_reduced +
      PPFD *
        PSII_cross_section *
        Plastoquinone_oxidised *
        kH0 *
        kPQred *
        keq_Plastoquinone_reduced +
      PPFD * PSII_cross_section * Plastoquinone_reduced * Q * kH * kPQred +
      PPFD * PSII_cross_section * Plastoquinone_reduced * k2 * kPQred +
      PPFD * PSII_cross_section * Plastoquinone_reduced * kF * kPQred +
      PPFD * PSII_cross_section * Plastoquinone_reduced * kH0 * kPQred +
      PPFD * PSII_cross_section * Q * k2 * kH * keq_Plastoquinone_reduced +
      PPFD * PSII_cross_section * k2 * kF * keq_Plastoquinone_reduced +
      PPFD * PSII_cross_section * k2 * kH0 * keq_Plastoquinone_reduced +
      Math.pow(PPFD, 2.0) *
        Math.pow(PSII_cross_section, 2.0) *
        k2 *
        keq_Plastoquinone_reduced +
      Plastoquinone_oxidised *
        Q *
        k2 *
        kH *
        kPQred *
        keq_Plastoquinone_reduced +
      2.0 *
        Plastoquinone_oxidised *
        Q *
        kF *
        kH *
        kPQred *
        keq_Plastoquinone_reduced +
      2.0 *
        Plastoquinone_oxidised *
        Q *
        kH *
        kH0 *
        kPQred *
        keq_Plastoquinone_reduced +
      Plastoquinone_oxidised *
        Math.pow(Q, 2.0) *
        Math.pow(kH, 2.0) *
        kPQred *
        keq_Plastoquinone_reduced +
      Plastoquinone_oxidised * k2 * kF * kPQred * keq_Plastoquinone_reduced +
      Plastoquinone_oxidised * k2 * kH0 * kPQred * keq_Plastoquinone_reduced +
      2.0 *
        Plastoquinone_oxidised *
        kF *
        kH0 *
        kPQred *
        keq_Plastoquinone_reduced +
      Plastoquinone_oxidised *
        Math.pow(kF, 2.0) *
        kPQred *
        keq_Plastoquinone_reduced +
      Plastoquinone_oxidised *
        Math.pow(kH0, 2.0) *
        kPQred *
        keq_Plastoquinone_reduced +
      Plastoquinone_reduced * Q * k2 * kH * kPQred +
      2.0 * Plastoquinone_reduced * Q * kF * kH * kPQred +
      2.0 * Plastoquinone_reduced * Q * kH * kH0 * kPQred +
      Plastoquinone_reduced * Math.pow(Q, 2.0) * Math.pow(kH, 2.0) * kPQred +
      Plastoquinone_reduced * k2 * kF * kPQred +
      Plastoquinone_reduced * k2 * kH0 * kPQred +
      2.0 * Plastoquinone_reduced * kF * kH0 * kPQred +
      Plastoquinone_reduced * Math.pow(kF, 2.0) * kPQred +
      Plastoquinone_reduced * Math.pow(kH0, 2.0) * kPQred);
  let A1: number =
    PSI_total /
    ((1.0 +
      Ferredoxine_reduced / (Ferredoxine_oxidised * keq_ferredoxin_reductase)) *
      ((PPFD * (1.0 - PSII_cross_section)) / (Plastocyanine_reduced * kPCox) +
        Plastocyanine_oxidised / (Plastocyanine_reduced * keq_PCP700)) +
      1.0 +
      (PPFD * (1.0 - PSII_cross_section)) / (Ferredoxine_oxidised * kFdred));
  let atp_synthase: number = kf_atp_synthase * (ADP - ATP / keq_atp_synthase);
  let b6f: number = Math.max(
    -kcat_b6f,
    kcat_b6f *
      (Math.pow(Plastocyanine_oxidised, 2) * Plastoquinone_reduced -
        (Math.pow(Plastocyanine_reduced, 2) * Plastoquinone_oxidised) /
          keq_b6f),
  );
  let lhc_protonation: number =
    (PsbS_de_protonated *
      kf_lhc_protonation *
      Math.pow(protons_lumen, kh_lhc_protonation)) /
    (Math.pow(protons_lumen, kh_lhc_protonation) +
      Math.pow(
        4000.0 * Math.pow(10.0, -ksat_lhc_protonation),
        kh_lhc_protonation,
      ));
  let lhc_deprotonation: number = PsbS_protonated * kf_lhc_deprotonation;
  let cyclic_electron_flow: number =
    Math.pow(Ferredoxine_reduced, 2.0) *
    Plastoquinone_oxidised *
    kf_cyclic_electron_flow;
  let violaxanthin_deepoxidase: number =
    (Violaxanthin *
      kf_violaxanthin_deepoxidase *
      Math.pow(protons_lumen, kh_violaxanthin_deepoxidase)) /
    (Math.pow(protons_lumen, kh_violaxanthin_deepoxidase) +
      Math.pow(
        4000.0 * Math.pow(10.0, -ksat_violaxanthin_deepoxidase),
        kh_violaxanthin_deepoxidase,
      ));
  let zeaxanthin_epoxidase: number = Zeaxanthin * kf_zeaxanthin_epoxidase;
  let fnr: number =
    (vmax_fnr *
      ((NADP *
        Math.pow(Ferredoxine_reduced / km_fnr_Ferredoxine_reduced, 2.0)) /
        km_fnr_NADP -
        (NADPH *
          Math.pow(Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced, 2.0)) /
          (keq_fnr * km_fnr_NADP))) /
    ((NADP / km_fnr_NADP + 1.0) *
      (Ferredoxine_reduced / km_fnr_Ferredoxine_reduced +
        Math.pow(Ferredoxine_reduced / km_fnr_Ferredoxine_reduced, 2.0) +
        1.0) +
      (NADPH / km_fnr_NADP + 1.0) *
        (Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced +
          Math.pow(Ferredoxine_oxidised / km_fnr_Ferredoxine_reduced, 2.0) +
          1.0) -
      1.0);
  let ndh: number = Plastoquinone_oxidised * kf_ndh;
  let PSII: number = 0.5 * B1 * k2;
  let PSI: number = A1 * PPFD * (1.0 - PSII_cross_section);
  let proton_leak: number =
    kf_proton_leak * (protons_lumen - 4000.0 * Math.pow(10.0, -pH));
  let PTOX: number = O2_dissolved_lumen * Plastoquinone_reduced * kPTOX;
  let lhc_state_transition_12: number =
    (1.0 * Light_harvesting_complex * kStt7) /
    (Math.pow(
      Plastoquinone_oxidised / (PQ_tot * km_lhc_state_transition_12),
      n_ST,
    ) +
      1.0);
  let lhc_state_transition_21: number =
    Light_harvesting_complex_protonated * kPph1;
  let ex_atp: number = ATP * kf_ex_atp;
  let dATPdt: number = atp_synthase - ex_atp;
  let dprotons_lumendt: number =
    (-HPR * atp_synthase) / bH +
    (2.0 * PSII) / bH +
    (4.0 * b6f) / bH -
    proton_leak / bH;
  let dPlastocyanine_oxidiseddt: number = PSI - 2 * b6f;
  let dPlastoquinone_oxidiseddt: number =
    -PSII + PTOX + b6f - cyclic_electron_flow - ndh;
  let dPsbS_de_protonateddt: number = lhc_deprotonation - lhc_protonation;
  let dFerredoxine_oxidiseddt: number =
    -PSI + 2 * cyclic_electron_flow + 2 * fnr;
  let dViolaxanthindt: number =
    -violaxanthin_deepoxidase + zeaxanthin_epoxidase;
  let dLight_harvesting_complexdt: number =
    -lhc_state_transition_12 + lhc_state_transition_21;
  return [
    dATPdt,
    dPlastoquinone_oxidiseddt,
    dPlastocyanine_oxidiseddt,
    dFerredoxine_oxidiseddt,
    dprotons_lumendt,
    dLight_harvesting_complexdt,
    dPsbS_de_protonateddt,
    dViolaxanthindt,
  ];
}
