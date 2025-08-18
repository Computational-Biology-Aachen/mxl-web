use crate::{Integration, Model};

/// Euler integration method
pub fn euler(
    rhs: Model,
    y0: Vec<f64>,
    pars: Vec<f64>,
    step_size: f64,
    t_end: f64,
) -> Integration {
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
