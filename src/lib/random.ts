// Seeded RNG + distribution sampling for ensemble fitting (Fit.svelte). A
// small deterministic PRNG (not Math.random()) so a fixed seed reproduces
// the same ensemble starting points across runs — see ADR 0006 §2.2.

/** mulberry32: fast, small, decent-quality 32-bit PRNG — plenty for sampling
 * ensemble starting points (this is not cryptographic or scientific-grade
 * Monte Carlo, just "spread N fits around a distribution"). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller needs u1 in (0, 1] excluding 0 (log(0) = -Infinity) — rng()
// already returns [0, 1), so only the low end needs nudging.
function uniformOpen(rng: () => number): number {
  const u = rng();
  return u <= 0 ? 1e-12 : u;
}

export function drawNormal(
  rng: () => number,
  mean: number,
  std: number,
): number {
  const u1 = uniformOpen(rng);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

export function drawUniform(
  rng: () => number,
  min: number,
  max: number,
): number {
  return min + (max - min) * rng();
}

export function drawLogUniform(
  rng: () => number,
  min: number,
  max: number,
): number {
  const lo = Math.log(Math.max(min, 1e-300));
  const hi = Math.log(Math.max(max, 1e-300));
  return Math.exp(lo + (hi - lo) * rng());
}

// `mean` is the distribution's median, not a bias-corrected arithmetic mean —
// muLog = ln(mean) keeps the typed value exactly the 50th percentile rather
// than requiring a -sigma^2/2 correction term. `std` is in the same units as
// mean; its ratio std/mean becomes the (dimensionless) log-space sigma, so
// the %-based UI editing std/mean means the same thing as it does for a
// plain Normal. The Math.max(..., 1e-300) floor is a defensive, sample-time
// guard mirroring drawLogUniform's own floor above — Fit.svelte's `mean`
// input is not itself guarded against 0/negative values.
export function drawLogNormal(
  rng: () => number,
  mean: number,
  std: number,
): number {
  const magnitude = Math.max(Math.abs(mean), 1e-300);
  const muLog = Math.log(magnitude);
  const sigmaLog = std / magnitude;
  const z = drawNormal(rng, 0, 1);
  return Math.exp(muLog + sigmaLog * z);
}

export type FitDistributionFamily =
  "normal" | "logNormal" | "uniform" | "logUniform";

/** One ensemble member's starting-point distribution for a single fitted
 * parameter (ADR 0006 §2.1) — always draws a plain linear-space scalar,
 * independent of that parameter's own "fit in log-space" optimizer setting
 * (ADR 0006 §2.3). */
export type FitDistribution =
  | { family: "normal"; mean: number; std: number }
  | { family: "logNormal"; mean: number; std: number }
  | { family: "uniform"; min: number; max: number }
  | { family: "logUniform"; min: number; max: number };

export function sampleDistribution(
  dist: FitDistribution,
  rng: () => number,
): number {
  switch (dist.family) {
    case "normal":
      return drawNormal(rng, dist.mean, dist.std);
    case "logNormal":
      return drawLogNormal(rng, dist.mean, dist.std);
    case "uniform":
      return drawUniform(rng, dist.min, dist.max);
    case "logUniform":
      return drawLogUniform(rng, dist.min, dist.max);
  }
}
