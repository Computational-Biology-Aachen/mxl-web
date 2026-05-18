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
  import Icon from "$lib/Icon.svelte";
  import PrimaryLinkButton from "$lib/links/PrimaryLinkButton.svelte";
  import SecondaryLinkButton from "$lib/links/SecondaryLinkButton.svelte";
  import FeatureBox from "./FeatureBox.svelte";
  import LogoBar from "$lib/LogoBar.svelte";
  import ModelGallery from "$lib/ModelGallery.svelte";
  import ModelHighlight from "$lib/ModelHighlight.svelte";
  import Row from "$lib/Row.svelte";

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

<div class="container">
  <div class="top">
    <div class="top-left">
      <h1 class="banner">
        <strong>Living</strong> models for <br />
        <span style="color: var(--primary);">collaborative science.</span>
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
      <Row>
        <PrimaryLinkButton href="{base}/lotka-volterra"
          >Launch live model</PrimaryLinkButton
        >
        <SecondaryLinkButton href="{base}/models"
          >Explore our models</SecondaryLinkButton
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
    <FeatureBox
      color="#135bec"
      icon="interactive_space"
      header="Interactive by design"
      body="Explore models in real time with sliders, switches, and dynamic visualizations"
    />
    <FeatureBox
      color="#006466"
      icon="group"
      header="Built for collaboration"
      body="Share models with your lab or collaborators - no code, no installation, just a link."
    />
    <FeatureBox
      color="#570066"
      icon="genetics"
      header="Mechanistic & explainable"
      body="Grounded in ODE-based modelling for interpretable biological insight."
    />
    <FeatureBox
      color="#ed1379"
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
    <ModelHighlight
      name="Photosynthesis dynamics"
      desc="Light, CO₂ and feedback in a dynamic model."
      href="{base}/ebeling-2026"
      image={schemeEbeling}
    />
    <ModelHighlight
      name="Race for iron"
      desc="What is the effect of a public good on a microbial community?"
      href="{base}/dynamic-entrobactin"
      image={schemeEnterobactin}
    />
    <ModelHighlight
      name="Population dynamics"
      desc="Explore how predators and prey survive in a dynamic environment"
      href="{base}/lotka-volterra"
      image={schemeLotkaVolt}
    />
    <ModelHighlight
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
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-right: auto;
    margin-left: auto;
    padding: 2rem 5rem 10rem;
    width: 100%;
    max-width: 100rem;
  }

  .top {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 30rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .top-left {
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 2rem;
    width: 50%;
    max-width: 40rem;
    height: 100%;
  }

  .banner {
    font-size: 3rem;
    letter-spacing: -1px;
  }

  .top-img {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 1rem;

    max-width: 100%;
    max-height: 100%;
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
    gap: 1rem;
    margin-right: auto;
    margin-left: auto;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
