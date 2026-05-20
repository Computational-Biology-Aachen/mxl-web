<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import schemeKea3 from "$lib/assets/kea3-tomato.png";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import scheme2016npq from "$lib/assets/matuszynska2016npq.png";
  import scheme2016phd from "$lib/assets/matuszynska2016phd.png";
  import schemeEnterobactin from "$lib/assets/mibinet-duo.png";
  import schemePopDyn from "$lib/assets/population-dynamics.png";
  import schemeSaadat from "$lib/assets/saadat2021.png";
  import schemeSir from "$lib/assets/sir.png";
  import schemeTripartite from "$lib/assets/tripartite.png";
  import schemeYokota from "$lib/assets/yokota.png";
  import {
    CardModel,
    GridGallery,
    Icon,
    SectionMain,
  } from "@computational-biology-aachen/design";
</script>

<SectionMain align="start">
  <div class="heading">
    <Icon color="primary">bolt</Icon>
    <h2>Select a pre-defined model</h2>
  </div>

  <GridGallery title="ODE models">
    <CardModel
      name="Lotka Volterra"
      href="{base}/lotka-volterra"
      image={schemeLotkaVolt}
    />
    <CardModel
      name="Population dynamics"
      href="{base}/population-dynamics"
      image={schemePopDyn}
    />
    <CardModel
      name="Tripartite dynamics"
      href="{base}/tripartite"
      image={schemeTripartite}
    />
    <CardModel
      name="Entrobactin"
      href="{base}/dynamic-entrobactin"
      image={schemeEnterobactin}
    />
    <CardModel
      name="Yokota 1985"
      href="{base}/yokota1985"
      image={schemeYokota}
    />
    <CardModel
      name="Poolman 2000"
      href="{base}/poolman2000"
      image={scheme2016phd}
    />
    <CardModel
      name="Matuszyńska 2016 (NPQ)"
      href="{base}/matuszynska2016_npq"
      image={scheme2016npq}
    />
    <CardModel
      name="Matuszyńska 2016 (PHD)"
      href="{base}/matuszynska2016_phd"
      image={scheme2016phd}
    />
    <CardModel
      name="Saadat 2021"
      href="{base}/saadat2021"
      image={schemeSaadat}
    />
    <CardModel
      name="Ebeling 2026"
      href="{base}/ebeling-2026"
      image={schemeEbeling}
    />
    <CardModel
      name="Tomato KEA3"
      href="{base}/kea3-tomato"
      image={schemeKea3}
    />
    <CardModel
      name="SIR"
      href="{base}/sir"
      image={schemeSir}
    />
  </GridGallery>

  <GridGallery title="Steady-state models">
    <CardModel
      name="FvCB"
      href="{base}/fvcb"
    />
  </GridGallery>
</SectionMain>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
