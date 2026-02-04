export function modelJs(t: number, vars: number[], pars: number[]) {
  const [e, c] = vars;
  const [mu_e, mu_c, a_e, a_c, theta] = pars;

  // Rates
  const v0 = e * a_e * mu_e;

  const dEdt = v0;
  const dCdt = c * a_c * mu_c - c * theta * c;
  return [dEdt, dCdt];
}
