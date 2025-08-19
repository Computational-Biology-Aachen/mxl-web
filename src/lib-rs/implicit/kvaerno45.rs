use super::utils::{scale_vec, solve_stages, sub_vec};
use crate::{Integration, Model};

pub struct Kvaerno45Options {
    pub rtol: f64,
    pub atol: f64,
    pub h_min: f64,
    pub h_max: f64,
    pub h_init: f64,
    pub max_steps: i64,
    pub max_iter: i64,
}

impl Default for Kvaerno45Options {
    fn default() -> Self {
        Kvaerno45Options {
            rtol: 1e-6,
            atol: 1e-8,
            h_min: 1e-8,
            h_max: 1.0,
            h_init: 0.1,
            max_steps: 10_000,
            max_iter: 10,
        }
    }
}

pub fn kvaerno45(
    rhs: Model,
    y0: Vec<f64>,
    pars: Vec<f64>,
    t_end: f64,
    options: Kvaerno45Options,
) -> Integration {
    let a = vec![
        vec![0.24169426078821, 0.0, 0.0, 0.0, 0.0, 0.0],
        vec![
            0.04134189679059,
            0.25865810320941,
            0.0,
            0.0,
            0.0,
            0.0,
        ],
        vec![
            0.02225576477115,
            0.15955645028519,
            0.26818778494366,
            0.0,
            0.0,
            0.0,
        ],
        vec![
            0.03637608874327,
            -0.027,
            0.24,
            0.25062391125673,
            0.0,
            0.0,
        ],
        vec![0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
        vec![0.04606, -0.044, 0.122, -0.101, 0.239, 0.23794],
    ];
    let b = a[5].clone();
    let b_hat = vec![0.04, -0.06, 0.13, -0.09, 0.31, 0.25];
    let c: Vec<f64> =
        a.iter().map(|row| row.iter().sum()).collect();

    let s = a.len();
    let n = y0.len();
    let mut t = 0.0;
    let mut y = y0.clone();

    let mut t_out = vec![t];
    let mut y_out = vec![y.clone()];

    let mut h = options.h_init;
    let max_steps = options.max_steps;
    let rtol = options.rtol;
    let atol = options.atol;
    let h_min = options.h_min;
    let h_max = options.h_max;
    let max_iter = options.max_iter;

    for _step in 0..max_steps {
        if t >= t_end {
            break;
        }
        if t + h > t_end {
            h = t_end - t;
        }

        let k = solve_stages(
            &rhs, &y, t, &pars, h, &a, &c, s, rtol, max_iter,
        );

        let mut y5 = y.clone();
        let mut y4 = y.clone();
        for i in 0..s {
            let scaled_k = scale_vec(&k[i], h);
            for j in 0..n {
                y5[j] += b[i] * scaled_k[j];
                y4[j] += b_hat[i] * scaled_k[j];
            }
        }

        let err_vec = sub_vec(&y5, &y4);
        let err = (0..n)
            .map(|i| {
                let sc =
                    atol + rtol * f64::max(y[i].abs(), y5[i].abs());
                (err_vec[i] / sc).powi(2)
            })
            .sum::<f64>();
        let err = (err / n as f64).sqrt();

        if err <= 1.0 {
            t += h;
            y = y5.clone();
            t_out.push(t);
            y_out.push(y.clone());
        }

        let fac = 0.9 * (1.0 / (err + 1e-10)).powf(1.0 / 5.0);
        h *= f64::min(5.0, f64::max(0.2, fac));
        h = f64::max(h_min, f64::min(h, h_max));
    }

    Integration {
        time: t_out,
        values: y_out,
    }
}
