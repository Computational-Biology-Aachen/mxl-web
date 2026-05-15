<!-- Few ideas. The front page should include some central eye catcher quotes, like:
Living models for collaborative science.
or
What if every biological model could become an interactive scientific instrument?

Then smaller emotional text

I would make a short mission statement. And add a tab on the top: how it works + how to cite

-->

<script lang="ts">
  import { base } from "$app/paths";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import hero from "$lib/assets/mxlweb-hero.png";
  import schemePopDyn from "$lib/assets/population-dynamics.png";
  import schemeTripartite from "$lib/assets/tripartite.png";
  import Icon from "$lib/Icon.svelte";
  import PrimaryLinkButton from "$lib/links/PrimaryLinkButton.svelte";
  import SecondaryLinkButton from "$lib/links/SecondaryLinkButton.svelte";
  import ModelCard from "$lib/ModelCard.svelte";
  import ModelGallery from "$lib/ModelGallery.svelte";
  import Row from "$lib/Row.svelte";
</script>

<div class="container">
  <div class="top">
    <div class="top-left">
      <h1>
        Living models for <br />
        <span style="color: var(--primary);">collaborative science.</span>
      </h1>
      <p>
        Stop sending static plots. Share living biological models your
        collaborators can manipulate, mutate, perturb, and understand instantly.
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
    <Icon color="primary">bolt</Icon>
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
    <Icon
      color="primary"
      style="font-size: 2rem">bolt</Icon
    >
    <h2>Explore biological scenarios in real time</h2>
  </div>

  <ModelGallery title="ODE models">
    <ModelCard
      name="Lotka Volterra"
      href="{base}/lotka-volterra"
      image={schemeLotkaVolt}
    />
    <ModelCard
      name="Population dynamics"
      href="{base}/population-dynamics"
      image={schemePopDyn}
    />
    <ModelCard
      name="Tripartite dynamics"
      href="{base}/tripartite"
      image={schemeTripartite}
    />
  </ModelGallery>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-right: auto;
    margin-left: auto;
    padding: 2rem 5rem;
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
</style>
