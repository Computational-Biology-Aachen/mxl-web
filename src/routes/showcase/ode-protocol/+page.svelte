<script lang="ts">
  import { resolve } from "$app/paths";
  import { backends, type Analyses } from "#lib";
  import AnalysesDashboard from "#lib/AnalysesDashboard.svelte";
  import type { PamGroup } from "#lib/protocol.js";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "../../models/matuszynska2016_npq/model";
  import { data } from "./data";

  // Low, high, then low actinic light, each with a saturating pulse every
  // 10 s — the protocol the data below was measured under.
  const measurementProtocol: PamGroup[] = [100, 500, 100].map((pfd) => ({
    steps: [
      { pfd, duration: 9.2 },
      { pfd: 5000, duration: 0.8 },
    ],
    repetitions: 3,
  }));

  let analyses: Analyses = $state([
    {
      type: "pam" as const,
      id: 0,
      idx: 0,
      title: "PAM Fluorescence",
      span: 6,
      col: 1,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      pamProtocol: measurementProtocol,
      showDerived: true,
      selectedKeys: ["Fluo"],
      normalizedKeys: ["Fluo"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>ODE Fitting: Protocol Time Series - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Matuszyńska 2016"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
    fitPreset={{
      csv: data,
      dataKind: "protocol",
      fit: ["k_prot", "k_Cytb6f"],
      protocol: {
        label: "Measurement protocol",
        groups: measurementProtocol,
        ppfdKey: "PPFD",
      },
    }}
  >
    <h1>ODE fitting: protocol time series</h1>
    <p>
      Many experiments change their conditions while they run. A PAM
      fluorescence measurement switches the actinic light between intensities
      and fires a saturating pulse every few seconds; a fit has to replay that
      same protocol, segment by segment, to compare the model against the trace.
      This page uses the <a href={resolve("/models/matuszynska2016_npq")}
        >Matuszyńska 2016 NPQ model</a
      > and a fluorescence trace measured under low, high, then low light.
    </p>
    <p>
      Open "Fit": the trace is loaded, and the protocol editor below the data
      mapping already holds the measurement protocol, setting the light
      intensity <code>PPFD</code> in each segment. The PsbS protonation rate
      <code>k_prot</code> (starting at 0.0096, true value 0.0192) and the
      cytochrome b₆f rate <code>k_Cytb6f</code> (starting at 0.104, true value 0.166)
      are selected for fitting. All three fit backends support protocols — try the
      analytic-Jacobian Levenberg-Marquardt as well.
    </p>
  </AnalysesDashboard>
</Main>
