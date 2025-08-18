/// Lotka-Volterra predator-prey model
pub fn lotka_volterra(
    _time: f64,
    variables: &[f64],
    parameters: &[f64],
) -> Vec<f64> {
    let [prey, pred] = variables else {
        panic!("Expected exactly 2 variables");
    };
    let [alpha, beta, gamma, delta] = parameters else {
        panic!("Expected exactly 4 parameters");
    };

    let prey_interaction = pred * prey;
    let dprey_dt = alpha * prey - beta * prey_interaction;
    let dpred_dt = delta * prey_interaction - gamma * pred;

    vec![dprey_dt, dpred_dt]
}
