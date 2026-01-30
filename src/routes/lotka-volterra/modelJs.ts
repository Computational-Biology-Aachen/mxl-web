export function modelJs(t: number, vars: number[], pars: number[]) {
  let [prey, pred] = vars;
  let [alpha, beta, gamma, delta] = pars;
  let dxdt = alpha * prey - beta * prey * pred;
  let dydt = -gamma * pred + delta * prey * pred;
  return [dxdt, dydt];
}
