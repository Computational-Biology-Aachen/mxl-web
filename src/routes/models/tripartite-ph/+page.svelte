<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import mibinetLogo from "$lib/assets/logos/mibinet.png";
  import PublicationBadge from "$lib/PublicationBadge.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import Row from "@computational-biology-aachen/design/Row.svelte";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 3,
      tEnd: 500,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 500,
      lineDisplay: "first",
    },
    {
      type: "outcomeHeatmap" as const,
      id: 1,
      idx: 1,
      title: "Ecological outcome",
      span: 3,
      xParameter: "mu_PS_max",
      xMin: 0.1,
      xMax: 0.8,
      xSteps: 31,
      yParameter: "pH",
      yMin: 4.5,
      yMax: 7.5,
      ySteps: 31,
      tEnd: 50,
    },
  ] as Analyses);
</script>

<svelte:head>
  <title>Tripartite (pH & resource) - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Tripartite dynamics (pH & resource)"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <Row
      stack
      justify="between"
      align="center"
    >
      <h1>Tripartite population model with pH and resource dynamics</h1>
      <PublicationBadge
        logo={mibinetLogo}
        text="Unpublished work done in MibiNet consortium"
      />
    </Row>
    <p>
      This model is an unpublished extension of the <a href="../tripartite"
        >tripartite Public/Cheater/Private community model</a
      >. Instead of constant growth rates, each strategy's growth now follows
      Monod kinetics on an explicit resource: the public metabolizer and private
      metabolizer grow on sucrose (S), while the cheater grows on extracellular
      glucose (G) that the public metabolizer releases as a byproduct of sucrose
      processing.
    </p>
    <p>
      Every growth rate is additionally scaled by a per-species Gaussian
      response to environmental pH, <code
        >f<sub>i,H</sub>(H) = exp(-(H - H<sub>opt,i</sub>)&sup2; / (2&sigma;<sub
          >H,i</sub
        >&sup2;))</code
      >, so each strategy has its own pH optimum and tolerance width. Dragging
      the <b>pH</b> slider away from a strategy's optimum suppresses its growth relative
      to the other two, shifting which strategy dominates the community.
    </p>
  </AnalysesDashboard>
</Main>
