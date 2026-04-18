<script lang="ts">
  import type { Analyses } from "$lib";
  import {
    Add,
    Divide,
    Exp,
    Ln,
    Max,
    Minus,
    Mul,
    Name,
    Num,
    Pow,
  } from "$lib/mathml";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import type { PamPhase } from "$lib/simulations/protocol";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addParameter("pH", { value: 7.9, texName: "pH" })
      .addParameter("PPFD", {
        value: 100.0,
        texName: "PPFD",
        slider: {
          min: "50",
          max: "500",
          step: "10",
        },
      })
      .addParameter("nadph", { value: 0.6, texName: "nadph" })
      .addParameter("O2_lumen", { value: 8.0, texName: "O2\\_lumen" })
      .addParameter("bH", { value: 100.0, texName: "bH" })
      .addParameter("F", { value: 96.485, texName: "F" })
      .addParameter("E_0_PC", { value: 0.38, texName: "E^0\\_PC" })
      .addParameter("E_0_P700", { value: 0.48, texName: "E^0\\_P700" })
      .addParameter("E_0_FA", { value: -0.55, texName: "E^0\\_FA" })
      .addParameter("E_0_Fd", { value: -0.43, texName: "E^0\\_Fd" })
      .addParameter("E_0_NADP", { value: -0.113, texName: "E^0\\_NADP" })
      .addParameter("NADP_", { value: 0.8, texName: "NADP*" })
      .addParameter("R", { value: 0.0083, texName: "R" })
      .addParameter("T", { value: 298.0, texName: "T" })
      .addParameter("A_P", { value: 2.55, texName: "A*P" })
      .addParameter("Carotenoids_tot", {
        value: 1.0,
        texName: "Carotenoids\\_tot",
      })
      .addParameter("Fd_", { value: 5.0, texName: "Fd*" })
      .addParameter("PC_tot", { value: 4.0, texName: "PC\\_tot" })
      .addParameter("PSBS_tot", { value: 1.0, texName: "PSBS\\_tot" })
      .addParameter("LHC_tot", { value: 1.0, texName: "LHC\\_tot" })
      .addParameter("gamma0", { value: 0.1, texName: "gamma0" })
      .addParameter("gamma1", { value: 0.25, texName: "gamma1" })
      .addParameter("gamma2", { value: 0.6, texName: "gamma2" })
      .addParameter("gamma3", { value: 0.15, texName: "gamma3" })
      .addParameter("kZSat", { value: 0.12, texName: "kZSat" })
      .addParameter("E_0_QA", { value: -0.14, texName: "E^0\\_QA" })
      .addParameter("E_0_PQ", { value: 0.354, texName: "E^0\\_PQ" })
      .addParameter("PQ_tot", { value: 17.5, texName: "PQ\\_tot" })
      .addParameter("staticAntII", { value: 0.1, texName: "staticAntII" })
      .addParameter("staticAntI", { value: 0.37, texName: "staticAntI" })
      .addParameter("kf_atp_synthase", {
        value: 20.0,
        texName: "kf\\_atp\\_synthase",
      })
      .addParameter("HPR", { value: 4.666666666666667, texName: "HPR" })
      .addParameter("Pi_mol", { value: 0.01, texName: "Pi\\_mol" })
      .addParameter("DeltaG0_ATP", { value: 30.6, texName: "DeltaG0\\_ATP" })
      .addParameter("kcat_b6f", { value: 2.5, texName: "kcat\\_b6f" })
      .addParameter("kh_lhc_protonation", {
        value: 3.0,
        texName: "kh\\_lhc\\_protonation",
      })
      .addParameter("kf_lhc_protonation", {
        value: 0.0096,
        texName: "kf\\_lhc\\_protonation",
      })
      .addParameter("ksat_lhc_protonation", {
        value: 5.8,
        texName: "ksat\\_lhc\\_protonation",
      })
      .addParameter("kf_lhc_deprotonation", {
        value: 0.0096,
        texName: "kf\\_lhc\\_deprotonation",
      })
      .addParameter("kf_cyclic_electron_flow", {
        value: 1.0,
        texName: "kf\\_cyclic\\_electron\\_flow",
      })
      .addParameter("kf_violaxanthin_deepoxidase", {
        value: 0.0024,
        texName: "kf\\_violaxanthin\\_deepoxidase",
      })
      .addParameter("kh_violaxanthin_deepoxidase", {
        value: 5.0,
        texName: "kh\\_violaxanthin\\_deepoxidase",
      })
      .addParameter("ksat_violaxanthin_deepoxidase", {
        value: 5.8,
        texName: "ksat\\_violaxanthin\\_deepoxidase",
      })
      .addParameter("kf_zeaxanthin_epoxidase", {
        value: 0.00024,
        texName: "kf\\_zeaxanthin\\_epoxidase",
      })
      .addParameter("E0_fnr", { value: 3.0, texName: "E0\\_fnr" })
      .addParameter("kcat_fnr", { value: 500.0, texName: "kcat\\_fnr" })
      .addParameter("km_fnr_fd_red", {
        value: 1.56,
        texName: "km\\_fnr\\_fd\\_red",
      })
      .addParameter("km_fnr_nadp", { value: 0.22, texName: "km\\_fnr\\_nadp" })
      .addParameter("kf_ndh", { value: 0.002, texName: "kf\\_ndh" })
      .addParameter("PSII_total", { value: 2.5, texName: "PSII\\_total" })
      .addParameter("PSI_total", { value: 2.5, texName: "PSI\\_total" })
      .addParameter("kH0", { value: 500000000.0, texName: "kH0" })
      .addParameter("kPQred", { value: 250.0, texName: "kPQred" })
      .addParameter("kPCox", { value: 2500.0, texName: "kPCox" })
      .addParameter("kFdred", { value: 250000.0, texName: "kFdred" })
      .addParameter("k2", { value: 5000000000.0, texName: "k2" })
      .addParameter("kH", { value: 5000000000.0, texName: "kH" })
      .addParameter("kF", { value: 625000000.0, texName: "kF" })
      .addParameter("convf", { value: 0.032, texName: "convf" })
      .addParameter("kf_proton_leak", {
        value: 10.0,
        texName: "kf\\_proton\\_leak",
      })
      .addParameter("kPTOX", { value: 0.01, texName: "kPTOX" })
      .addParameter("kStt7", { value: 0.0035, texName: "kStt7" })
      .addParameter("km_lhc_state_transition_12", {
        value: 0.2,
        texName: "km\\_lhc\\_state\\_transition\\_12",
      })
      .addParameter("n_ST", { value: 2.0, texName: "n\\_ST" })
      .addParameter("kPph1", { value: 0.0013, texName: "kPph1" })
      .addParameter("kf_ex_atp", { value: 10.0, texName: "kf\\_ex\\_atp" })
      .addVariable("atp", { value: 1.6999999999999997, texName: "atp" })
      .addVariable("pq_ox", { value: 4.706348349506148, texName: "pq\\_ox" })
      .addVariable("pc_ox", { value: 3.9414515288091567, texName: "pc\\_ox" })
      .addVariable("fd_ox", { value: 3.7761613271207324, texName: "fd\\_ox" })
      .addVariable("protons_lumen", {
        value: 7.737821100836988,
        texName: "protons\\_lumen",
      })
      .addVariable("lhc", { value: 0.5105293511676007, texName: "lhc" })
      .addVariable("psbs_de", {
        value: 0.5000000001374878,
        texName: "psbs\\_de",
      })
      .addVariable("vx", { value: 0.09090909090907397, texName: "vx" })
      .addAssignment("nadp", {
        fn: new Add([new Name("NADP_"), new Minus([new Name("nadph")])]),
        texName: "nadp",
      })
      .addAssignment("RT", {
        fn: new Mul([new Name("R"), new Name("T")]),
        texName: "RT",
      })
      .addAssignment("adp", {
        fn: new Add([new Name("A_P"), new Minus([new Name("atp")])]),
        texName: "adp",
      })
      .addAssignment("dG_pH", {
        fn: new Mul([new Num(2.302585092994046), new Name("R"), new Name("T")]),
        texName: "dG\\_pH",
      })
      .addAssignment("pH_lumen", {
        fn: new Minus([
          new Divide([
            new Ln(new Mul([new Num(0.00025), new Name("protons_lumen")])),
            new Ln(new Num(10.0)),
          ]),
        ]),
        texName: "pH\\_lumen",
      })
      .addAssignment("zx", {
        fn: new Add([new Name("Carotenoids_tot"), new Minus([new Name("vx")])]),
        texName: "zx",
      })
      .addAssignment("fd_red", {
        fn: new Add([new Name("Fd_"), new Minus([new Name("fd_ox")])]),
        texName: "fd\\_red",
      })
      .addAssignment("pc_red", {
        fn: new Add([new Name("PC_tot"), new Minus([new Name("pc_ox")])]),
        texName: "pc\\_red",
      })
      .addAssignment("psbs_pr", {
        fn: new Add([new Name("PSBS_tot"), new Minus([new Name("psbs_de")])]),
        texName: "psbs\\_pr",
      })
      .addAssignment("lhc_prot", {
        fn: new Add([new Name("LHC_tot"), new Minus([new Name("lhc")])]),
        texName: "lhc\\_prot",
      })
      .addAssignment("Q", {
        fn: new Add([
          new Mul([new Name("gamma0"), new Name("psbs_de"), new Name("vx")]),
          new Mul([new Name("gamma1"), new Name("psbs_pr"), new Name("vx")]),
          new Divide([
            new Mul([new Name("gamma2"), new Name("psbs_pr"), new Name("zx")]),
            new Add([new Name("kZSat"), new Name("zx")]),
          ]),
          new Divide([
            new Mul([new Name("gamma3"), new Name("psbs_de"), new Name("zx")]),
            new Add([new Name("kZSat"), new Name("zx")]),
          ]),
        ]),
        texName: "Q",
      })
      .addAssignment("keq_pq_red", {
        fn: new Exp(
          new Divide([
            new Add([
              new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
              new Minus([
                new Mul([new Num(2.0), new Name("E_0_QA"), new Name("F")]),
              ]),
              new Minus([
                new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH")]),
              ]),
            ]),
            new Name("RT"),
          ]),
        ),
        texName: "keq\\_pq\\_red",
      })
      .addAssignment("pq_red", {
        fn: new Add([new Name("PQ_tot"), new Minus([new Name("pq_ox")])]),
        texName: "pq\\_red",
      })
      .addAssignment("PSII_cross_section", {
        fn: new Add([
          new Name("staticAntII"),
          new Mul([
            new Name("lhc"),
            new Add([
              new Num(1.0),
              new Minus([new Name("staticAntI")]),
              new Minus([new Name("staticAntII")]),
            ]),
          ]),
        ]),
        texName: "PSII\\_cross\\_section",
      })
      .addAssignment("keq_atp_synthase", {
        fn: new Mul([
          new Name("Pi_mol"),
          new Exp(
            new Divide([
              new Add([
                new Minus([new Name("DeltaG0_ATP")]),
                new Mul([
                  new Name("HPR"),
                  new Name("dG_pH"),
                  new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
                ]),
              ]),
              new Name("RT"),
            ]),
          ),
        ]),
        texName: "keq\\_atp\\_synthase",
      })
      .addAssignment("keq_b6f", {
        fn: new Exp(
          new Divide([
            new Add([
              new Mul([new Num(2.0), new Name("E_0_PC"), new Name("F")]),
              new Mul([new Num(2.0), new Name("dG_pH"), new Name("pH_lumen")]),
              new Minus([
                new Mul([new Num(2.0), new Name("E_0_PQ"), new Name("F")]),
              ]),
              new Minus([
                new Mul([
                  new Num(2.0),
                  new Name("dG_pH"),
                  new Add([new Name("pH"), new Minus([new Name("pH_lumen")])]),
                ]),
              ]),
            ]),
            new Name("RT"),
          ]),
        ),
        texName: "keq\\_b6f",
      })
      .addAssignment("keq_fnr", {
        fn: new Exp(
          new Divide([
            new Add([
              new Minus([new Mul([new Name("dG_pH"), new Name("pH")])]),
              new Mul([new Num(2.0), new Name("E_0_NADP"), new Name("F")]),
              new Minus([
                new Mul([new Num(2.0), new Name("E_0_Fd"), new Name("F")]),
              ]),
            ]),
            new Name("RT"),
          ]),
        ),
        texName: "keq\\_fnr",
      })
      .addAssignment("vmax_fnr", {
        fn: new Mul([new Name("E0_fnr"), new Name("kcat_fnr")]),
        texName: "vmax\\_fnr",
      })
      .addAssignment("keq_PCP700", {
        fn: new Exp(
          new Divide([
            new Add([
              new Mul([new Name("E_0_P700"), new Name("F")]),
              new Minus([new Mul([new Name("E_0_PC"), new Name("F")])]),
            ]),
            new Name("RT"),
          ]),
        ),
        texName: "keq\\_PCP700",
      })
      .addAssignment("keq_ferredoxin_reductase", {
        fn: new Exp(
          new Divide([
            new Add([
              new Mul([new Name("E_0_Fd"), new Name("F")]),
              new Minus([new Mul([new Name("E_0_FA"), new Name("F")])]),
            ]),
            new Name("RT"),
          ]),
        ),
        texName: "keq\\_ferredoxin\\_reductase",
      })
      .addAssignment("A1", {
        fn: new Divide([
          new Name("PSI_total"),
          new Add([
            new Num(1.0),
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([
                  new Name("fd_red"),
                  new Mul([
                    new Name("fd_ox"),
                    new Name("keq_ferredoxin_reductase"),
                  ]),
                ]),
              ]),
              new Add([
                new Divide([
                  new Name("pc_ox"),
                  new Mul([new Name("keq_PCP700"), new Name("pc_red")]),
                ]),
                new Divide([
                  new Mul([
                    new Name("PPFD"),
                    new Add([
                      new Num(1.0),
                      new Minus([new Name("PSII_cross_section")]),
                    ]),
                  ]),
                  new Mul([new Name("kPCox"), new Name("pc_red")]),
                ]),
              ]),
            ]),
            new Divide([
              new Mul([
                new Name("PPFD"),
                new Add([
                  new Num(1.0),
                  new Minus([new Name("PSII_cross_section")]),
                ]),
              ]),
              new Mul([new Name("fd_ox"), new Name("kFdred")]),
            ]),
          ]),
        ]),
        texName: "A1",
      })
      .addAssignment("B0", {
        fn: new Divide([
          new Mul([
            new Name("PSII_total"),
            new Name("kPQred"),
            new Name("keq_pq_red"),
            new Name("pq_ox"),
            new Add([
              new Pow(new Name("kF"), new Num(2.0)),
              new Pow(new Name("kH0"), new Num(2.0)),
              new Mul([new Name("k2"), new Name("kF")]),
              new Mul([new Name("k2"), new Name("kH0")]),
              new Mul([
                new Pow(new Name("Q"), new Num(2.0)),
                new Pow(new Name("kH"), new Num(2.0)),
              ]),
              new Mul([new Num(2.0), new Name("kF"), new Name("kH0")]),
              new Mul([new Name("Q"), new Name("k2"), new Name("kH")]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kF"),
                new Name("kH"),
              ]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kH"),
                new Name("kH0"),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B1", {
        fn: new Divide([
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("PSII_total"),
            new Name("kPQred"),
            new Name("keq_pq_red"),
            new Name("pq_ox"),
            new Add([
              new Name("kF"),
              new Name("kH0"),
              new Mul([new Name("Q"), new Name("kH")]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B2", {
        fn: new Divide([
          new Mul([
            new Name("PSII_total"),
            new Add([
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("kF"), new Num(2.0)),
              ]),
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("kH0"), new Num(2.0)),
              ]),
              new Mul([
                new Name("k2"),
                new Name("kF"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("k2"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("kPQred"),
                new Name("pq_red"),
                new Pow(new Name("Q"), new Num(2.0)),
                new Pow(new Name("kH"), new Num(2.0)),
              ]),
              new Mul([
                new Num(2.0),
                new Name("kF"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("kF"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("kH0"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("Q"),
                new Name("k2"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kF"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Num(2.0),
                new Name("Q"),
                new Name("kH"),
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("Q"),
                new Name("k2"),
                new Name("kH"),
                new Name("keq_pq_red"),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addAssignment("B3", {
        fn: new Divide([
          new Mul([
            new Name("PPFD"),
            new Name("PSII_cross_section"),
            new Name("PSII_total"),
            new Add([
              new Mul([new Name("k2"), new Name("kPQred"), new Name("pq_red")]),
              new Mul([new Name("kF"), new Name("kPQred"), new Name("pq_red")]),
              new Mul([
                new Name("kH0"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
              new Mul([
                new Name("PPFD"),
                new Name("PSII_cross_section"),
                new Name("k2"),
                new Name("keq_pq_red"),
              ]),
              new Mul([
                new Name("Q"),
                new Name("kH"),
                new Name("kPQred"),
                new Name("pq_red"),
              ]),
            ]),
          ]),
          new Add([
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("keq_pq_red"),
              new Pow(new Name("PPFD"), new Num(2.0)),
              new Pow(new Name("PSII_cross_section"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kF"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("kH0"), new Num(2.0)),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("pq_red"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kF"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kH0"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("k2"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("k2"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
              new Pow(new Name("Q"), new Num(2.0)),
              new Pow(new Name("kH"), new Num(2.0)),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("kF"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("keq_pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("pq_red"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kF"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("Q"),
              new Name("k2"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kF"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Num(2.0),
              new Name("Q"),
              new Name("kH"),
              new Name("kH0"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
            new Mul([
              new Name("PPFD"),
              new Name("PSII_cross_section"),
              new Name("Q"),
              new Name("kH"),
              new Name("kPQred"),
              new Name("keq_pq_red"),
              new Name("pq_ox"),
            ]),
          ]),
        ]),
        texName: "ps2states",
      })
      .addReaction("atp_synthase", {
        fn: new Mul([
          new Name("kf_atp_synthase"),
          new Add([
            new Name("adp"),
            new Minus([
              new Divide([new Name("atp"), new Name("keq_atp_synthase")]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "atp", value: new Num(1.0) },
          {
            name: "protons_lumen",
            value: new Minus([new Divide([new Name("HPR"), new Name("bH")])]),
          },
        ],
        texName: "atp\\_synthase",
      })
      .addReaction("b6f", {
        fn: new Max([
          new Minus([new Name("kcat_b6f")]),
          new Mul([
            new Name("kcat_b6f"),
            new Add([
              new Mul([
                new Name("pq_red"),
                new Pow(new Name("pc_ox"), new Num(2.0)),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("pq_ox"),
                    new Pow(new Name("pc_red"), new Num(2.0)),
                  ]),
                  new Name("keq_b6f"),
                ]),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          { name: "pc_ox", value: new Num(-2.0) },
          { name: "pq_ox", value: new Num(1.0) },
          {
            name: "protons_lumen",
            value: new Divide([new Num(4.0), new Name("bH")]),
          },
        ],
        texName: "b6f",
      })
      .addReaction("lhc_protonation", {
        fn: new Divide([
          new Mul([
            new Name("kf_lhc_protonation"),
            new Name("psbs_de"),
            new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
          ]),
          new Add([
            new Pow(new Name("protons_lumen"), new Name("kh_lhc_protonation")),
            new Pow(
              new Mul([
                new Num(4000.0),
                new Pow(
                  new Num(10.0),
                  new Minus([new Name("ksat_lhc_protonation")]),
                ),
              ]),
              new Name("kh_lhc_protonation"),
            ),
          ]),
        ]),
        stoichiometry: [{ name: "psbs_de", value: new Num(-1.0) }],
        texName: "lhc\\_protonation",
      })
      .addReaction("lhc_deprotonation", {
        fn: new Mul([new Name("kf_lhc_deprotonation"), new Name("psbs_pr")]),
        stoichiometry: [{ name: "psbs_de", value: new Num(1.0) }],
        texName: "lhc\\_deprotonation",
      })
      .addReaction("cyclic_electron_flow", {
        fn: new Mul([
          new Name("kf_cyclic_electron_flow"),
          new Name("pq_ox"),
          new Pow(new Name("fd_red"), new Num(2.0)),
        ]),
        stoichiometry: [
          { name: "pq_ox", value: new Num(-1.0) },
          { name: "fd_ox", value: new Num(2.0) },
        ],
        texName: "cyclic\\_electron\\_flow",
      })
      .addReaction("violaxanthin_deepoxidase", {
        fn: new Divide([
          new Mul([
            new Name("kf_violaxanthin_deepoxidase"),
            new Name("vx"),
            new Pow(
              new Name("protons_lumen"),
              new Name("kh_violaxanthin_deepoxidase"),
            ),
          ]),
          new Add([
            new Pow(
              new Name("protons_lumen"),
              new Name("kh_violaxanthin_deepoxidase"),
            ),
            new Pow(
              new Mul([
                new Num(4000.0),
                new Pow(
                  new Num(10.0),
                  new Minus([new Name("ksat_violaxanthin_deepoxidase")]),
                ),
              ]),
              new Name("kh_violaxanthin_deepoxidase"),
            ),
          ]),
        ]),
        stoichiometry: [{ name: "vx", value: new Num(-1.0) }],
        texName: "violaxanthin\\_deepoxidase",
      })
      .addReaction("zeaxanthin_epoxidase", {
        fn: new Mul([new Name("kf_zeaxanthin_epoxidase"), new Name("zx")]),
        stoichiometry: [{ name: "vx", value: new Num(1.0) }],
        texName: "zeaxanthin\\_epoxidase",
      })
      .addReaction("fnr", {
        fn: new Divide([
          new Mul([
            new Name("vmax_fnr"),
            new Add([
              new Divide([
                new Mul([
                  new Name("nadp"),
                  new Pow(
                    new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
                    new Num(2.0),
                  ),
                ]),
                new Name("km_fnr_nadp"),
              ]),
              new Minus([
                new Divide([
                  new Mul([
                    new Name("nadph"),
                    new Pow(
                      new Divide([
                        new Name("fd_ox"),
                        new Name("km_fnr_fd_red"),
                      ]),
                      new Num(2.0),
                    ),
                  ]),
                  new Mul([new Name("keq_fnr"), new Name("km_fnr_nadp")]),
                ]),
              ]),
            ]),
          ]),
          new Add([
            new Num(-1.0),
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([new Name("nadp"), new Name("km_fnr_nadp")]),
              ]),
              new Add([
                new Num(1.0),
                new Pow(
                  new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
                  new Num(2.0),
                ),
                new Divide([new Name("fd_red"), new Name("km_fnr_fd_red")]),
              ]),
            ]),
            new Mul([
              new Add([
                new Num(1.0),
                new Divide([new Name("nadph"), new Name("km_fnr_nadp")]),
              ]),
              new Add([
                new Num(1.0),
                new Pow(
                  new Divide([new Name("fd_ox"), new Name("km_fnr_fd_red")]),
                  new Num(2.0),
                ),
                new Divide([new Name("fd_ox"), new Name("km_fnr_fd_red")]),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [{ name: "fd_ox", value: new Num(2.0) }],
        texName: "fnr",
      })
      .addReaction("ndh", {
        fn: new Mul([new Name("kf_ndh"), new Name("pq_ox")]),
        stoichiometry: [{ name: "pq_ox", value: new Num(-1.0) }],
        texName: "ndh",
      })
      .addReaction("PSII", {
        fn: new Mul([new Num(0.5), new Name("B1"), new Name("k2")]),
        stoichiometry: [
          { name: "pq_ox", value: new Num(-1.0) },
          {
            name: "protons_lumen",
            value: new Divide([new Num(2.0), new Name("bH")]),
          },
        ],
        texName: "PSII",
      })
      .addReaction("PSI", {
        fn: new Mul([
          new Name("A1"),
          new Name("PPFD"),
          new Add([new Num(1.0), new Minus([new Name("PSII_cross_section")])]),
        ]),
        stoichiometry: [
          { name: "fd_ox", value: new Num(-1.0) },
          { name: "pc_ox", value: new Num(1.0) },
        ],
        texName: "PSI",
      })
      .addReaction("proton_leak", {
        fn: new Mul([
          new Name("kf_proton_leak"),
          new Add([
            new Name("protons_lumen"),
            new Minus([
              new Mul([
                new Num(4000.0),
                new Pow(new Num(10.0), new Minus([new Name("pH")])),
              ]),
            ]),
          ]),
        ]),
        stoichiometry: [
          {
            name: "protons_lumen",
            value: new Minus([new Divide([new Num(1.0), new Name("bH")])]),
          },
        ],
        texName: "proton\\_leak",
      })
      .addReaction("PTOX", {
        fn: new Mul([
          new Name("O2_lumen"),
          new Name("kPTOX"),
          new Name("pq_red"),
        ]),
        stoichiometry: [{ name: "pq_ox", value: new Num(1.0) }],
        texName: "PTOX",
      })
      .addReaction("lhc_state_transition_12", {
        fn: new Divide([
          new Mul([new Num(1.0), new Name("kStt7"), new Name("lhc")]),
          new Add([
            new Num(1.0),
            new Pow(
              new Divide([
                new Name("pq_ox"),
                new Mul([
                  new Name("PQ_tot"),
                  new Name("km_lhc_state_transition_12"),
                ]),
              ]),
              new Name("n_ST"),
            ),
          ]),
        ]),
        stoichiometry: [{ name: "lhc", value: new Num(-1.0) }],
        texName: "lhc\\_state\\_transition\\_12",
      })
      .addReaction("lhc_state_transition_21", {
        fn: new Mul([new Name("kPph1"), new Name("lhc_prot")]),
        stoichiometry: [{ name: "lhc", value: new Num(1.0) }],
        texName: "lhc\\_state\\_transition\\_21",
      })
      .addReaction("ex_atp", {
        fn: new Mul([new Name("atp"), new Name("kf_ex_atp")]),
        stoichiometry: [{ name: "atp", value: new Num(-1.0) }],
        texName: "ex\\_atp",
      })
      .addParameter("k_H", { value: 5000000000.0, texName: "k\\_H" })
      .addParameter("k_F", { value: 625000000.0, texName: "k\\_F" })
      .addParameter("k_P", { value: 5000000000.0, texName: "k\\_P" })
      .addAssignment("Fluo", {
        fn: new Add([
          new Divide([
            new Mul([new Name("B0"), new Name("k_F")]),
            new Add([
              new Name("k_F"),
              new Name("k_P"),
              new Mul([new Name("Q"), new Name("k_H")]),
            ]),
          ]),
          new Divide([
            new Mul([new Name("B2"), new Name("k_F")]),
            new Add([
              new Name("k_F"),
              new Mul([new Name("Q"), new Name("k_H")]),
            ]),
          ]),
        ]),
        texName: "Fluo",
      });
  }

  const defaultPamProtocol: PamPhase[] = [
    {
      backgroundPFD: 100,
      backgroundLength: 9.2,
      pulsePFD: 5000,
      pulseLength: 0.8,
      repetitions: 3,
    },
    {
      backgroundPFD: 500,
      backgroundLength: 9.2,
      pulsePFD: 5000,
      pulseLength: 0.8,
      repetitions: 3,
    },
    {
      backgroundPFD: 100,
      backgroundLength: 9.2,
      pulsePFD: 5000,
      pulseLength: 0.8,
      repetitions: 3,
    },
  ];

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Simulation",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      method: "Radau",
      showDerived: false,
    },
    {
      type: "pam" as const,
      id: 1,
      idx: 1,
      title: "PAM Fluorescence",
      col: 4,
      span: 3,
      yMax: undefined,
      timeoutInSeconds: 120,
      method: "Radau",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["Fluo"],
    },
  ]);
</script>

<AnalysesDashboard
  name={"Model"}
  initModel={initModel}
  bind:analyses={analyses}
></AnalysesDashboard>
