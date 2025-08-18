pub mod explicit;
pub mod implicit;
pub mod models;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

type Model =
    fn(time: f64, values: &[f64], pars: &[f64]) -> Vec<f64>;

#[derive(Serialize, Deserialize)]
pub struct Integration {
    time: Vec<f64>,
    values: Vec<Vec<f64>>,
}

#[wasm_bindgen]
pub fn test(
    y0: Vec<f64>,
    pars: Vec<f64>,
) -> Result<JsValue, JsValue> {
    let integration = explicit::euler(
        models::lotka_volterra,
        y0,
        pars,
        0.01,
        100.0,
    );

    serde_wasm_bindgen::to_value(&integration).map_err(|e| {
        JsValue::from_str(&format!("Serialization error: {}", e))
    })
}
