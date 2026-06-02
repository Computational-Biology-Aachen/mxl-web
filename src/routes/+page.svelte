<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import ccls from "$lib/assets/logos/ccls.svg";
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
    Icon,
    Imprint,
    LogoBar,
    SectionMain as Main,
    ModelGallery,
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
  ];
</script>

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
        <Button href="{base}/lotka-volterra">Launch live model</Button>
        <Button
          variant="secondary"
          href="{base}/models">Explore our models</Button
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
    <h2>Why MxlWeb?</h2>
  </div>

  <div class="row-main">
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
    <h2>Explore biological scenarios in real time</h2>
  </div>

  <ModelGallery>
    <CardImageHighlight
      name="Photosynthesis dynamics"
      desc="Light, CO₂ and feedback in a dynamic model."
      href="{base}/ebeling-2026"
      image={schemeEbeling}
    />
    <CardImageHighlight
      name="Race for iron"
      desc="What is the effect of a public good on a microbial community?"
      href="{base}/dynamic-entrobactin"
      image={schemeEnterobactin}
    />
    <CardImageHighlight
      name="Population dynamics"
      desc="Explore how predators and prey survive in a dynamic environment"
      href="{base}/lotka-volterra"
      image={schemeLotkaVolt}
    />
    <CardImageHighlight
      name="Host-Parasite interaction"
      desc="How infection, immune response and outcomes evolve?"
      href="{base}/sir"
      image={schemeSir}
    />
  </ModelGallery>

  <div class="heading">
    <Icon color="primary">handshake</Icon>
    <h2>Trusted by the scientific community</h2>
  </div>
  <LogoBar logos={logos} />
  <!-- End container -->
</Main>

<Imprint github="https://github.com/Computational-Biology-Aachen/mxl-web" />

<style>
  h1.banner {
    font-size: 3rem;
    line-height: 1.2;
    letter-spacing: -1px;
  }
  .top {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
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
    margin-top: 2rem;
  }

  .row-main {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;
    margin-right: auto;
    margin-left: auto;
    width: 100%;

    @media (min-width: 50rem) {
      flex-direction: row;
    }
  }
</style>
