pub fn npq(
    _time: f64,
    variables: &[f64],
    parameters: &[f64],
) -> Vec<f64> {
    let [
        atp,
        plastoquinone_oxidised,
        plastocyanine_oxidised,
        ferredoxine_oxidised,
        protons_lumen,
        light_harvesting_complex,
        psb_s_de_protonated,
        violaxanthin,
    ] = *variables
    else {
        panic!("Expected exactly 8 parameters");
    };

    let [ppfd] = parameters else {
        panic!("Expected exactly 1 parameter");
    };

    let p_h: f64 = 7.9;
    let nadph: f64 = 0.6;
    let o2_dissolved_lumen: f64 = 8.0;
    let b_h: f64 = 100.0;
    let f: f64 = 96.485;
    let e0_pc: f64 = 0.38;
    let e0_p700: f64 = 0.48;
    let e0_fa: f64 = -0.55;
    let e0_fd: f64 = -0.43;
    let e0_nadp: f64 = -0.113;
    let nadp_: f64 = 0.8;
    let r: f64 = 0.0083;
    let t: f64 = 298.0;
    let a_p: f64 = 2.55;
    let carotenoids_tot: f64 = 1.0;
    let fd: f64 = 5.0;
    let pc_tot: f64 = 4.0;
    let psbs_tot: f64 = 1.0;
    let lhc_tot: f64 = 1.0;
    let gamma0: f64 = 0.1;
    let gamma1: f64 = 0.25;
    let gamma2: f64 = 0.6;
    let gamma3: f64 = 0.15;
    let k_zsat: f64 = 0.12;
    let e0_qa: f64 = -0.14;
    let e0_pq: f64 = 0.354;
    let pq_tot: f64 = 17.5;
    let static_ant_ii: f64 = 0.1;
    let static_ant_i: f64 = 0.37;
    let kf_atp_synthase: f64 = 20.0;
    let hpr: f64 = 4.666666666666667;
    let pi_mol: f64 = 0.01;
    let delta_g0_atp: f64 = 30.6;
    let kcat_b6f: f64 = 2.5;
    let kh_lhc_protonation: f64 = 3.0;
    let kf_lhc_protonation: f64 = 0.0096;
    let ksat_lhc_protonation: f64 = 5.8;
    let kf_lhc_deprotonation: f64 = 0.0096;
    let kf_cyclic_electron_flow: f64 = 1.0;
    let kf_violaxanthin_deepoxidase: f64 = 0.0024;
    let kh_violaxanthin_deepoxidase: f64 = 5.0;
    let ksat_violaxanthin_deepoxidase: f64 = 5.8;
    let kf_zeaxanthin_epoxidase: f64 = 0.00024;
    let e0_fnr: f64 = 3.0;
    let kcat_fnr: f64 = 500.0;
    let km_fnr_ferredoxine_reduced: f64 = 1.56;
    let km_fnr_nadp: f64 = 0.22;
    let kf_ndh: f64 = 0.002;
    let psii_total: f64 = 2.5;
    let psi_total: f64 = 2.5;
    let k_h0: f64 = 500000000.0;
    let k_pqred: f64 = 250.0;
    let k_pcox: f64 = 2500.0;
    let k_fdred: f64 = 250000.0;
    let k2: f64 = 5000000000.0;
    let k_h: f64 = 5000000000.0;
    let k_f: f64 = 625000000.0;
    let kf_proton_leak: f64 = 10.0;
    let k_ptox: f64 = 0.01;
    let k_stt7: f64 = 0.0035;
    let km_lhc_state_transition_12: f64 = 0.2;
    let n_st: f64 = 2.0;
    let k_pph1: f64 = 0.0013;
    let kf_ex_atp: f64 = 10.0;
    let nadp: f64 = -nadph + nadp_;
    let rt: f64 = r * t;
    let adp: f64 = -atp + a_p;
    let d_g_p_h: f64 = r * t * 10_f64.ln();
    let p_h_lumen: f64 =
        -(0.00025 * protons_lumen).ln() / 10_f64.ln();
    let zeaxanthin: f64 = carotenoids_tot - violaxanthin;
    let ferredoxine_reduced: f64 = fd - ferredoxine_oxidised;
    let plastocyanine_reduced: f64 =
        pc_tot - plastocyanine_oxidised;
    let psb_s_protonated: f64 = psbs_tot - psb_s_de_protonated;
    let light_harvesting_complex_protonated: f64 =
        lhc_tot - light_harvesting_complex;
    let q: f64 = psb_s_de_protonated * violaxanthin * gamma0
        + psb_s_de_protonated * zeaxanthin * gamma3
            / (zeaxanthin + k_zsat)
        + psb_s_protonated * violaxanthin * gamma1
        + psb_s_protonated * zeaxanthin * gamma2
            / (zeaxanthin + k_zsat);
    let keq_plastoquinone_reduced: f64 =
        ((2.0 * e0_pq * f - 2.0 * e0_qa * f - 2.0 * d_g_p_h * p_h)
            / rt)
            .exp();
    let plastoquinone_reduced: f64 =
        pq_tot - plastoquinone_oxidised;
    let psii_cross_section: f64 = light_harvesting_complex
        * (-static_ant_i - static_ant_ii + 1.0)
        + static_ant_ii;
    let keq_atp_synthase: f64 = pi_mol
        * ((-delta_g0_atp + hpr * d_g_p_h * (p_h - p_h_lumen))
            / rt)
            .exp();
    let keq_b6f: f64 = ((2.0 * e0_pc * f - 2.0 * e0_pq * f
        + 2.0 * d_g_p_h * p_h_lumen
        - 2.0 * d_g_p_h * (p_h - p_h_lumen))
        / rt)
        .exp();
    let keq_fnr: f64 = ((-2.0 * e0_fd * f + 2.0 * e0_nadp * f
        - d_g_p_h * p_h)
        / rt)
        .exp();
    let vmax_fnr: f64 = e0_fnr * kcat_fnr;
    let keq_pcp700: f64 = ((e0_p700 * f - e0_pc * f) / rt).exp();
    let keq_ferredoxin_reductase: f64 =
        ((-e0_fa * f + e0_fd * f) / rt).exp();
    let b1: f64 = ppfd
        * psii_cross_section
        * psii_total
        * plastoquinone_oxidised
        * k_pqred
        * keq_plastoquinone_reduced
        * (q * k_h + k_f + k_h0)
        / (ppfd
            * psii_cross_section
            * plastoquinone_oxidised
            * q
            * k_h
            * k_pqred
            * keq_plastoquinone_reduced
            + ppfd
                * psii_cross_section
                * plastoquinone_oxidised
                * k_f
                * k_pqred
                * keq_plastoquinone_reduced
            + ppfd
                * psii_cross_section
                * plastoquinone_oxidised
                * k_h0
                * k_pqred
                * keq_plastoquinone_reduced
            + ppfd
                * psii_cross_section
                * plastoquinone_reduced
                * q
                * k_h
                * k_pqred
            + ppfd
                * psii_cross_section
                * plastoquinone_reduced
                * k2
                * k_pqred
            + ppfd
                * psii_cross_section
                * plastoquinone_reduced
                * k_f
                * k_pqred
            + ppfd
                * psii_cross_section
                * plastoquinone_reduced
                * k_h0
                * k_pqred
            + ppfd
                * psii_cross_section
                * q
                * k2
                * k_h
                * keq_plastoquinone_reduced
            + ppfd
                * psii_cross_section
                * k2
                * k_f
                * keq_plastoquinone_reduced
            + ppfd
                * psii_cross_section
                * k2
                * k_h0
                * keq_plastoquinone_reduced
            + ppfd.powf(2.0)
                * psii_cross_section.powf(2.0)
                * k2
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * q
                * k2
                * k_h
                * k_pqred
                * keq_plastoquinone_reduced
            + 2.0
                * plastoquinone_oxidised
                * q
                * k_f
                * k_h
                * k_pqred
                * keq_plastoquinone_reduced
            + 2.0
                * plastoquinone_oxidised
                * q
                * k_h
                * k_h0
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * q.powf(2.0)
                * k_h.powf(2.0)
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * k2
                * k_f
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * k2
                * k_h0
                * k_pqred
                * keq_plastoquinone_reduced
            + 2.0
                * plastoquinone_oxidised
                * k_f
                * k_h0
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * k_f.powf(2.0)
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_oxidised
                * k_h0.powf(2.0)
                * k_pqred
                * keq_plastoquinone_reduced
            + plastoquinone_reduced * q * k2 * k_h * k_pqred
            + 2.0
                * plastoquinone_reduced
                * q
                * k_f
                * k_h
                * k_pqred
            + 2.0
                * plastoquinone_reduced
                * q
                * k_h
                * k_h0
                * k_pqred
            + plastoquinone_reduced
                * q.powf(2.0)
                * k_h.powf(2.0)
                * k_pqred
            + plastoquinone_reduced * k2 * k_f * k_pqred
            + plastoquinone_reduced * k2 * k_h0 * k_pqred
            + 2.0 * plastoquinone_reduced * k_f * k_h0 * k_pqred
            + plastoquinone_reduced * k_f.powf(2.0) * k_pqred
            + plastoquinone_reduced * k_h0.powf(2.0) * k_pqred);
    let a1: f64 = psi_total
        / ((ferredoxine_reduced
            / (ferredoxine_oxidised * keq_ferredoxin_reductase)
            + 1.0)
            * (ppfd * (-psii_cross_section + 1.0)
                / (plastocyanine_reduced * k_pcox)
                + plastocyanine_oxidised
                    / (plastocyanine_reduced * keq_pcp700))
            + ppfd * (-psii_cross_section + 1.0)
                / (ferredoxine_oxidised * k_fdred)
            + 1.0);
    let atp_synthase: f64 =
        kf_atp_synthase * (adp - atp / keq_atp_synthase);
    let b6f: f64 = if kcat_b6f
        <= -kcat_b6f
            * (plastocyanine_oxidised.powi(2)
                * plastoquinone_reduced
                - plastocyanine_reduced.powi(2)
                    * plastoquinone_oxidised
                    / keq_b6f)
    {
        -kcat_b6f
    } else {
        kcat_b6f
            * (plastocyanine_oxidised.powi(2)
                * plastoquinone_reduced
                - plastocyanine_reduced.powi(2)
                    * plastoquinone_oxidised
                    / keq_b6f)
    };
    let lhc_protonation: f64 = psb_s_de_protonated
        * kf_lhc_protonation
        * protons_lumen.powf(kh_lhc_protonation)
        / (protons_lumen.powf(kh_lhc_protonation)
            + (4000.0 * 10.0_f64.powf(-ksat_lhc_protonation))
                .powf(kh_lhc_protonation));
    let lhc_deprotonation: f64 =
        psb_s_protonated * kf_lhc_deprotonation;
    let cyclic_electron_flow: f64 = ferredoxine_reduced.powf(2.0)
        * plastoquinone_oxidised
        * kf_cyclic_electron_flow;
    let violaxanthin_deepoxidase: f64 = violaxanthin
        * kf_violaxanthin_deepoxidase
        * protons_lumen.powf(kh_violaxanthin_deepoxidase)
        / (protons_lumen.powf(kh_violaxanthin_deepoxidase)
            + (4000.0
                * 10.0_f64.powf(-ksat_violaxanthin_deepoxidase))
            .powf(kh_violaxanthin_deepoxidase));
    let zeaxanthin_epoxidase: f64 =
        zeaxanthin * kf_zeaxanthin_epoxidase;
    let fnr: f64 = vmax_fnr
        * (nadp
            * (ferredoxine_reduced / km_fnr_ferredoxine_reduced)
                .powf(2.0)
            / km_fnr_nadp
            - nadph
                * (ferredoxine_oxidised
                    / km_fnr_ferredoxine_reduced)
                    .powf(2.0)
                / (keq_fnr * km_fnr_nadp))
        / ((nadp / km_fnr_nadp + 1.0)
            * (ferredoxine_reduced / km_fnr_ferredoxine_reduced
                + 1.0
                + (ferredoxine_reduced
                    / km_fnr_ferredoxine_reduced)
                    .powf(2.0))
            + (nadph / km_fnr_nadp + 1.0)
                * (ferredoxine_oxidised
                    / km_fnr_ferredoxine_reduced
                    + 1.0
                    + (ferredoxine_oxidised
                        / km_fnr_ferredoxine_reduced)
                        .powf(2.0))
            - 1.0);
    let ndh: f64 = plastoquinone_oxidised * kf_ndh;
    let psii: f64 = 0.5 * b1 * k2;
    let psi: f64 = a1 * ppfd * (-psii_cross_section + 1.0);
    let proton_leak: f64 = kf_proton_leak
        * (protons_lumen - 4000.0 * 10.0_f64.powf(-p_h));
    let ptox: f64 =
        o2_dissolved_lumen * plastoquinone_reduced * k_ptox;
    let lhc_state_transition_12: f64 = 1.0
        * light_harvesting_complex
        * k_stt7
        * (1.0
            + (plastoquinone_oxidised
                / (pq_tot * km_lhc_state_transition_12))
                .powf(n_st))
        .recip();
    let lhc_state_transition_21: f64 =
        light_harvesting_complex_protonated * k_pph1;
    let ex_atp: f64 = atp * kf_ex_atp;
    let d_atpdt: f64 = atp_synthase - ex_atp;
    let dprotons_lumendt: f64 = -hpr * atp_synthase / b_h
        + 2.0 * psii * b_h.recip()
        + 4.0 * b6f * b_h.recip()
        - proton_leak / b_h;
    let d_plastocyanine_oxidiseddt: f64 = psi - 2.0 * b6f;
    let d_plastoquinone_oxidiseddt: f64 =
        -psii + ptox + b6f - cyclic_electron_flow - ndh;
    let d_psb_s_de_protonateddt: f64 =
        lhc_deprotonation - lhc_protonation;
    let d_ferredoxine_oxidiseddt: f64 =
        -psi + 2.0 * cyclic_electron_flow + 2.0 * fnr;
    let d_violaxanthindt: f64 =
        -violaxanthin_deepoxidase + zeaxanthin_epoxidase;
    let d_light_harvesting_complexdt: f64 =
        -lhc_state_transition_12 + lhc_state_transition_21;
    return vec![
        d_atpdt,
        d_plastoquinone_oxidiseddt,
        d_plastocyanine_oxidiseddt,
        d_ferredoxine_oxidiseddt,
        dprotons_lumendt,
        d_light_harvesting_complexdt,
        d_psb_s_de_protonateddt,
        d_violaxanthindt,
    ];
}
