<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import ccls from "$lib/assets/logos/ccls.svg";
  import ceplasImg from "$lib/assets/logos/ceplas.jpg";
  import cpbl from "$lib/assets/logos/cpbl.svg";
  import gopmf from "$lib/assets/logos/gopmf.png";
  import mibinet from "$lib/assets/logos/mibinet.png";
  import rwth from "$lib/assets/logos/rwth.svg";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import schemeEnterobactin from "$lib/assets/mibinet-duo.png";
  import hero from "$lib/assets/mxlweb-hero.png";
  import schemeSir from "$lib/assets/sir.png";
  import {
    Button,
    CardFeature,
    CardImageHighlight,
    H2,
    Icon,
    LogoBar,
    SectionMain as Main,
    Row,
  } from "@computational-biology-aachen/design";

  const logos = [
    { src: rwth, href: "https://www.rwth-aachen.de", alt: "rwth logo" },
    {
      src: cpbl,
      href: "https://www.cpbl.rwth-aachen.de/",
      alt: "cpbl logo",
      height: "6rem",
    },
    {
      src: ccls,
      href: "https://www.ccls.rwth-aachen.de",
      alt: "ccls logo",
      height: "4rem",
    },
    {
      src: mibinet,
      href: "https://www.sfb1535.hhu.de/en/mibinet",
      alt: "mibinet logo",
      height: "5.5rem",
    },
    {
      src: gopmf,
      href: "https://www.uni-muenster.de/GoPMF/en/index.html",
      alt: "gopmf logo",
      height: "5.5rem",
    },
    {
      src: ceplasImg,
      href: "https://www.ceplas.eu/en/home",
      alt: "ceplas logo",
      height: "4rem",
    },
  ];
</script>

<svelte:head>
  <title>mxlweb</title>
</svelte:head>

<Main>
  <div class="top">
    <div class="top-left">
      <h1 class="banner">
        Living models for <br />
        <span style="color: var(--color-primary);">collaborative science.</span>
      </h1>
      <p>
        Stop sending static plots.
        <br />
        <br />
        MxlWeb transformes ordinary ODE models into interactive web applications that
        let you explore biological systems - right in your browser.
        <br />
        <br />
        Share living biological models your collaborators can manipulate, mutate,
        perturb, and understand instantly.
      </p>
      <Row
        stack
        gap="0.5rem"
      >
        <Button href="{base}/models/lotka-volterra">Launch live model</Button>
        <Button
          variant="secondary"
          href="{base}/models">Explore our models</Button
        >
        <Button
          variant="secondary"
          popovertarget="build-chooser">Build your own</Button
        >
      </Row>
    </div>
    <img
      src={hero}
      alt="hero banner"
      class="top-img"
    />
  </div>

  <div class="heading">
    <Icon color="primary">info</Icon>
    <H2>Why MxlWeb?</H2>
  </div>

  <div class="model-gallery">
    <CardFeature
      color="c1"
      icon="interactive_space"
      header="Interactive by design"
      body="Explore models in real time with sliders, switches, and dynamic visualizations"
    />
    <CardFeature
      color="c2"
      icon="group"
      header="Built for collaboration"
      body="Share models with your lab or collaborators - no code, no installation, just a link."
    />
    <CardFeature
      color="c3"
      icon="genetics"
      header="Mechanistic & explainable"
      body="Grounded in ODE-based modelling for interpretable biological insight."
    />
    <CardFeature
      color="c4"
      icon="open_in_browser"
      header="Browser-native science"
      body="Runs instantly on any device. Your models, anywhere, anytime."
    />
  </div>

  <div class="heading">
    <Icon color="primary">bolt</Icon>
    <H2>Explore biological scenarios in real time</H2>
  </div>

  <!-- <ModelGallery> -->
  <div class="model-gallery">
    <CardImageHighlight
      name="Photosynthesis dynamics"
      desc="Light, CO₂ and feedback in a dynamic model."
      href="{base}/models/ebeling-2026"
      image={schemeEbeling}
    />
    <CardImageHighlight
      name="Race for iron"
      desc="What is the effect of a public good on a microbial community?"
      href="{base}/models/dynamic-entrobactin"
      image={schemeEnterobactin}
    />
    <CardImageHighlight
      name="Population dynamics"
      desc="Explore how predators and prey survive in a dynamic environment"
      href="{base}/models/lotka-volterra"
      image={schemeLotkaVolt}
    />
    <CardImageHighlight
      name="Host-Parasite interaction"
      desc="How infection, immune response and outcomes evolve?"
      href="{base}/models/sir"
      image={schemeSir}
    />
  </div>
  <!-- </ModelGallery> -->

  <div class="heading">
    <Icon color="primary">handshake</Icon>
    <h2>Trusted by the scientific community</h2>
  </div>
  <LogoBar logos={logos} />
  <!-- End container -->
</Main>

<style>
  .model-gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap);
    width: 100%;

    @media (min-width: 42rem) {
      grid-template-columns: 1fr 1fr;
    }
    /* @media (min-width: 60rem) {
      grid-template-columns: 1fr 1fr 1fr;
    } */
    @media (min-width: 80rem) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }

  h1.banner {
    font-size: 3rem;
    line-height: 1.2;
    letter-spacing: -1px;
  }
  .top {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap);
    width: 100%;

    @media (min-width: 50rem) {
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      height: auto;
    }
    @media (min-width: 75rem) {
      height: 30rem;
    }

    .top-left {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
      width: 100%;
      height: 100%;

      h1 {
        margin: 2rem 0 0 0;
      }

      @media (min-width: 75rem) {
        justify-content: space-between;
      }
    }
    .top-img {
      display: none;

      @media (min-width: 50rem) {
        display: block;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        padding: 1rem;
        width: 100%;
      }

      @media (min-width: 75rem) {
      }
    }
  }

  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2.5rem;
    margin-bottom: 0.5rem;
  }
</style>
