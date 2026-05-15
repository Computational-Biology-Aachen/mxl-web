<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import ccls from "$lib/assets/logos/ccls.svg";
  import cpbl from "$lib/assets/logos/cpbl.svg";
  import mibinet from "$lib/assets/logos/mibinet.png";
  import rwth from "$lib/assets/logos/rwth.svg";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import schemeEnterobactin from "$lib/assets/mibinet-duo.png";
  import hero from "$lib/assets/mxlweb-hero.png";
  import schemeSir from "$lib/assets/sir.png";
  import Icon from "$lib/Icon.svelte";
  import PrimaryLinkButton from "$lib/links/PrimaryLinkButton.svelte";
  import SecondaryLinkButton from "$lib/links/SecondaryLinkButton.svelte";
  import ModelGallery from "$lib/ModelGallery.svelte";
  import ModelHighlight from "$lib/ModelHighlight.svelte";
  import Row from "$lib/Row.svelte";
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
    <div class="box c1">
      <Row>
        <Icon
          color="c1"
          style="font-size: 2rem">interactive_space</Icon
        >
        <h2
          class="box-header"
          style="color: #135bec"
        >
          Interactive by design
        </h2>
      </Row>
      <p>
        Explore models in real time with sliders, switches, and dynamic
        visualizations
      </p>
    </div>
    <div class="box c2">
      <Row>
        <Icon
          color="c2"
          style="font-size: 2rem">group</Icon
        >
        <h2
          class="box-header"
          style="color: #006466"
        >
          Built for collaboration
        </h2>
      </Row>
      <p>
        Share models with your lab or collaborators - no code, no installation,
        just a link.
      </p>
    </div>
    <div class="box c3">
      <Row>
        <Icon
          color="c3"
          style="font-size: 2rem">genetics</Icon
        >
        <h2
          class="box-header"
          style="color: #570066"
        >
          Mechanistic & explainable
        </h2>
      </Row>
      <p>
        Grounded in ODE-based modelling for interpretable biological insight.
      </p>
    </div>
    <div class="box c4">
      <Row>
        <Icon
          color="c4"
          style="font-size: 2rem">open_in_browser</Icon
        >
        <h2
          class="box-header"
          style="color: #ed1379"
        >
          Browser-native science
        </h2>
      </Row>
      <p>Runs instantly on any device. Your models, anywhere, anytime.</p>
    </div>
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
  <div class="logo-bar">
    <a href="https://www.rwth-aachen.de">
      <img
        class="logo"
        src={rwth}
        alt="rwth logo"
      />
    </a>
    <a href="https://www.cpbl.rwth-aachen.de/">
      <img
        class="logo"
        src={cpbl}
        style="height: 6rem"
        alt="cpbl logo"
      />
    </a>
    <a href="https://www.ccls.rwth-aachen.de">
      <img
        class="logo"
        src={ccls}
        style="height: 4rem"
        alt="ccls logo"
      />
    </a>
    <a href="https://www.sfb1535.hhu.de/en/mibinet">
      <img
        class="logo"
        src={mibinet}
        style="height: 5.5rem"
        alt="mibinet logo"
      />
    </a>
  </div>
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

  .box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition:
      border-color 0.5s ease,
      background 0.5s ease;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 1rem;
    height: 10rem;
  }

  .c1 {
    --color: #135bec;
    border: 1px solid rgba(from var(--color) r g b / 0.5);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.01),
      rgba(from var(--color) r g b / 0.05)
    );
  }
  .c1:hover {
    border-color: rgba(from var(--color) r g b / 0.8);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.04),
      rgba(from var(--color) r g b / 0.12)
    );
  }
  .c2 {
    --color: #006466;
    border: 1px solid rgba(from var(--color) r g b / 0.5);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.01),
      rgba(from var(--color) r g b / 0.05)
    );
  }
  .c2:hover {
    border-color: rgba(from var(--color) r g b / 0.8);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.04),
      rgba(from var(--color) r g b / 0.12)
    );
  }
  .c3 {
    --color: #570066;
    border: 1px solid rgba(from var(--color) r g b / 0.5);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.01),
      rgba(from var(--color) r g b / 0.05)
    );
  }
  .c3:hover {
    border-color: rgba(from var(--color) r g b / 0.8);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.04),
      rgba(from var(--color) r g b / 0.12)
    );
  }
  .c4 {
    --color: #ed1379;
    border: 1px solid rgba(from var(--color) r g b / 0.5);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.01),
      rgba(from var(--color) r g b / 0.05)
    );
  }
  .c4:hover {
    border-color: rgba(from var(--color) r g b / 0.8);
    background: linear-gradient(
      135deg,
      rgba(from var(--color) r g b / 0.04),
      rgba(from var(--color) r g b / 0.12)
    );
  }
  .box-header {
    font-size: 1rem;
  }

  .logo-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
    height: 6rem;
  }

  .logo {
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    height: 5rem;
  }
  .logo:hover {
    transform: translateY(-3px);
    color: var(--primary);
  }
</style>
