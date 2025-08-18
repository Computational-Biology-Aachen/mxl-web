use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

type Model = fn(time: f64, values: &[f64], pars: &[f64]) -> Vec<f64>;

/// Lotka-Volterra predator-prey model
fn model(_time: f64, variables: &[f64], parameters: &[f64]) -> Vec<f64> {
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

#[derive(Serialize, Deserialize)]
pub struct Integration {
    time: Vec<f64>,
    values: Vec<Vec<f64>>,
}

/// Euler integration method
fn euler(rhs: Model, y0: Vec<f64>, pars: Vec<f64>, step_size: f64, t_end: f64) -> Integration {
    let t_start = 0.0;
    let n_steps = ((t_end - t_start) / step_size).ceil() as usize;

    let mut time = Vec::with_capacity(n_steps + 1);
    let mut values = Vec::with_capacity(n_steps + 1);

    time.push(t_start);
    values.push(y0);

    for i in 0..n_steps {
        let current_time = time[i];
        let current_values = &values[i];

        let derivatives = rhs(current_time, current_values, &pars);
        let next_values: Vec<f64> = current_values
            .iter()
            .zip(derivatives.iter())
            .map(|(y, dydt)| y + dydt * step_size)
            .collect();

        let next_time = current_time + step_size;
        time.push(next_time);
        values.push(next_values);
    }

    Integration { time, values }
}

#[wasm_bindgen]
pub fn test(y0: Vec<f64>, pars: Vec<f64>) -> Result<JsValue, JsValue> {
    let integration = euler(model, y0, pars, 0.01, 100.0);

    serde_wasm_bindgen::to_value(&integration)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}
