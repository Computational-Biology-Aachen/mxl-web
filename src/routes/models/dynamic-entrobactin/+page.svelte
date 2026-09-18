<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import mibinetLogo from "$lib/assets/logos/mibinet.png";
  import scheme from "$lib/assets/mibinet-duo.png";
  import { SectionMain as Main } from "@computational-biology-aachen/design";

  import PublicationBadge from "$lib/PublicationBadge.svelte";
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
      tEnd: 20,
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
      type: "parameterScan" as const,
      id: 1,
      idx: 1,
      title: "Inoculation ratio scan",
      span: 3,
      parameter: "inoculation_ratio",
      min: 0.1,
      max: 0.9,
      steps: 21,
      tEnd: 20,
      tolerance: 1e-4,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
      backend: backends.wasmRadau5,
      selectedKeys: ["e_coli", "c_glutamicum"],
      lineDisplay: "current" as const,
    },
  ]);
</script>

<svelte:head>
  <title>Dynamic Enterobactin - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Dynamic Enterobactin"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <Row
      stack
      justify="between"
      align="center"
    >
      <h1>Dynamic Enterobactin model</h1>
      <PublicationBadge
        logo={mibinetLogo}
        href="https://doi.org/10.64898/2026.05.27.728356"
        text="Read the paper: Krüger, Paik, Bund et al. (2026), bioRxiv."
      />
    </Row>

    <p>
      Iron is essential to almost every organism, yet under aerobic conditions
      it is mostly locked up as poorly soluble ferric iron. Many microbes
      overcome this by secreting siderophores, small, high-affinity metabolites
      that chelate ferric iron and deliver it back through dedicated uptake
      receptors. Because siderophore synthesis is metabolically costly, whether
      a given siderophore acts as a shared public good, a privatized resource or
      a competitive weapon depends on who else in the community can access it.
      This model, developed within the SFB MibiNet community, focuses on <i
        >enterobactin</i
      >, the catecholate siderophore with the highest known iron affinity,
      secreted by <i>E. coli</i> under iron limitation.
    </p>
    <p>
      <i>C. glutamicum</i> does not produce any siderophores of its own, but
      carries a broad repertoire of receptors that let it scavenge
      xenosiderophores made by other organisms, including enterobactin. In this
      synthetic pairwise community, <i>E. coli</i> is the enterobactin producer
      and
      <i>C. glutamicum</i> the exploiter: it accesses the iron
      <i>E. coli</i> has captured without paying the biosynthetic cost, making
      enterobactin a public good. Experiments (dose-response assays, single-cell
      microfluidics, and an enterobactin-receptor affinity biosensor) showed
      that this exploitation is constrained rather than runaway, co-cultures
      reproducibly converge to a stable composition instead of collapsing,
      consistent with <i>E. coli</i> retaining privileged access to the siderophore
      it produces via its dedicated FepA receptor.
    </p>
    <p>
      The model tracks four state variables: the two organisms' biomasses, a
      shared glucose substrate and extracellular enterobactin with double-Monod
      growth kinetics that require both substrate and siderophore
      simultaneously. Enterobactin is produced only by
      <i>E. coli</i>, while both organisms take it up at a growth-coupled rate;
      the balance between production and consumption sets how much enterobactin
      remains available to be shared.
    </p>
    <div class="centered">
      <img
        src={scheme}
        alt="Diagram of enterobactin-mediated iron exchange: E. coli secretes enterobactin, which scavenges iron from a shared pool and is taken up by C. glutamicum"
      />
    </div>
  </AnalysesDashboard>
</Main>

<style>
  img {
    max-width: 90rem;
    max-height: 20rem;
  }

  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
