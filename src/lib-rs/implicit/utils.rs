use crate::Model;
use ordered_float::NotNan;

pub fn scale_vec(v: &Vec<f64>, h: f64) -> Vec<f64> {
    v.iter().map(|&x| x * h).collect()
}

pub fn sub_vec(a: &Vec<f64>, b: &Vec<f64>) -> Vec<f64> {
    a.iter().zip(b.iter()).map(|(&x, &y)| x - y).collect()
}

pub fn max_norm(v: &Vec<f64>) -> f64 {
    *v.iter()
        .max_by_key(|x| NotNan::new(x.abs()).unwrap())
        .unwrap()
}

// Solve Ax = b using naive Gauss elimination
pub fn solve_linear(a: &Vec<Vec<f64>>, b: &Vec<f64>) -> Vec<f64> {
    let n = b.len();
    let mut m: Vec<Vec<f64>> = a
        .iter()
        .enumerate()
        .map(|(i, row)| {
            let mut r = row.clone();
            r.push(b[i]);
            r
        })
        .collect();

    for i in 0..n {
        // Find max row for pivot
        let mut max_row = i;
        for k in (i + 1)..n {
            if m[k][i].abs() > m[max_row][i].abs() {
                max_row = k;
            }
        }
        m.swap(i, max_row);

        let pivot = m[i][i];
        if pivot.abs() < 1e-12 {
            panic!("Singular matrix");
        }

        for j in i..=n {
            m[i][j] /= pivot;
        }

        for k in 0..n {
            if k == i {
                continue;
            }
            let factor = m[k][i];
            for j in i..=n {
                m[k][j] -= factor * m[i][j];
            }
        }
    }

    m.iter().map(|row| row[n]).collect()
}

// Jacobian approximation
pub fn approx_jacobian(
    model: &Model,
    t: f64,
    y: &Vec<f64>,
    pars: &Vec<f64>,
    eps: f64,
) -> Vec<Vec<f64>> {
    let n = y.len();
    let f0 = model(t, y, pars);
    let mut jac = vec![vec![0.0; n]; n];
    let mut y_perturbed = y.clone();

    for j in 0..n {
        let yj = y[j];
        let h = eps * yj.abs().max(1.0);
        y_perturbed[j] += h;
        let f1 = model(t, &y_perturbed, pars);

        for i in 0..n {
            jac[i][j] = (f1[i] - f0[i]) / h;
        }
    }

    jac
}

// Newton-Raphson solver for IRK stages
pub fn solve_stages(
    model: &Model,
    y: &Vec<f64>,
    t: f64,
    pars: &Vec<f64>,
    h: f64,
    a: &Vec<Vec<f64>>,
    c: &Vec<f64>,
    s: usize,
    rtol: f64,
    max_iter: i64,
) -> Vec<Vec<f64>> {
    let n = y.len();
    let mut k = vec![vec![0.0; n]; s];

    for iter in 0..max_iter {
        let mut max_err: f64 = 0.0;

        for i in 0..s {
            let ti = t + c[i] * h;
            let mut yi = y.clone();
            for j in 0..s {
                let scaled = scale_vec(&k[j], a[i][j] * h);
                for l in 0..n {
                    yi[l] += scaled[l];
                }
            }

            let f_eval = model(ti, &yi, pars);
            let res = sub_vec(&k[i], &f_eval);
            max_err = max_err.max(max_norm(&res));

            let mut jac =
                approx_jacobian(model, ti, &yi, pars, 1e-8);
            let aii = a[i][i];
            for r in 0..n {
                for c2 in 0..n {
                    jac[r][c2] *= -h * aii;
                }
                jac[r][r] += 1.0;
            }

            let dk = solve_linear(&jac, &res);
            for l in 0..n {
                k[i][l] -= dk[l];
            }
        }

        if max_err < rtol {
            break;
        }
        if iter == max_iter - 1 {
            eprintln!("Newton-Raphson did not converge");
        }
    }

    k
}
