export function modelJs(t: number, vars: number[], pars: number[]) {
  const [P, C, M] = vars;
  const [r_p, r_m, alpha, beta, eta, gamma, nu] = pars;

  // Eq.
  // dP/dt = r_p·P − α·P·C − β·P·M − η·P^2
  // dC/dt = α·P·C − ν·C^2
  // dM/dt = r_m·M − β·M·P − γ·M^2
  const dPdt = r_p * P - alpha * P * C - beta * P * M - eta * P * P;
  const dCdt = alpha * P * C - nu * C * C;
  const dMdt = r_m * M - beta * M * P - gamma * M * M;

  return [dPdt, dCdt, dMdt];
}
