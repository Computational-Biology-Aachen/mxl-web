/**
 * Backward Euler implicit integrator for solving ordinary differential equations.
 *
 * The backward Euler method is a first-order implicit numerical scheme that approximates
 * the solution to the initial value problem:
 *   dy/dt = f(t, y), y(t₀) = y₀
 *
 * ## Algorithm
 *
 * The method uses the implicit formula:
 *   y_{n+1} = y_n + h * f(t_{n+1}, y_{n+1})
 *
 * where h is the step size. This creates a nonlinear equation that must be solved at each step:
 *   y_{n+1} - y_n - h * f(t_{n+1}, y_{n+1}) = 0
 *
 * The equation is solved using Newton-Raphson iteration:
 * 1. Start with an initial guess y_{n+1}^(0) = y_n
 * 2. Compute the residual: r = y_{n+1} - y_n - h * f(t_{n+1}, y_{n+1})
 * 3. Compute the Jacobian: J = I - h * ∂f/∂y
 * 4. Solve the linear system: J * Δy = -r
 * 5. Update: y_{n+1}^(k+1) = y_{n+1}^(k) + Δy
 * 6. Repeat until convergence (||r|| < tolerance)
 *
 * ## Properties
 *
 * - **Stability**: Unconditionally stable (A-stable), making it suitable for stiff ODEs
 * - **Order**: First-order accurate (local truncation error O(h²))
 * - **Implicit**: Requires solving a nonlinear system at each step
 * - **Damping**: Numerical damping helps with stability but may reduce accuracy
 *
 * ## Use Cases
 *
 * - Stiff differential equations where explicit methods become unstable
 * - Systems with widely separated time scales
 * - Chemical reaction networks with fast and slow reactions
 * - Electrical circuits with small time constants
 */

import type { BaseIntegratorKws, Integration, Model } from "..";
import { approxJacobian, maxNorm, solveLinear } from "./utils";

interface IntegratorKws extends BaseIntegratorKws {
    rtol?: number;
    atol?: number;
    stepSize?: number;
    maxIter?: number;
    maxSteps?: number;
}

/** Backward Euler implicit integrator */
export function backwardEuler(
    model: Model,
    {
        initialValues,
        tStart = 0,
        tEnd,
        pars = [],
        stepSize = 0.01,
        rtol = 1e-6,
        atol = 1e-8,
        maxSteps = 10000,
        maxIter = 10,
    }: IntegratorKws,
): Integration {
    const n = initialValues.length;
    let t = tStart;
    let y = initialValues.slice();

    let tOut = [t];
    let yOut = [y.slice()];

    for (let step = 0; step < maxSteps && t < tEnd; step++) {
        let h = stepSize;
        if (t + h > tEnd) h = tEnd - t;

        // Newton-Raphson iteration for backward Euler: y_{n+1} = y_n + h * f(t_{n+1}, y_{n+1})
        // Solve: y_{n+1} - y_n - h * f(t_{n+1}, y_{n+1}) = 0
        let yNext = y.slice(); // Initial guess

        for (let iter = 0; iter < maxIter; iter++) {
            const fEval = model(t + h, yNext, pars);

            // Residual: r = yNext - y - h * f(t + h, yNext)
            const residual = yNext.slice();
            for (let i = 0; i < n; i++) {
                residual[i] = yNext[i] - y[i] - h * fEval[i];
            }

            const resNorm = maxNorm(residual);
            if (resNorm < atol + rtol * maxNorm(yNext)) {
                break; // Converged
            }

            // Jacobian of residual: J = I - h * J_f
            const Jf = approxJacobian(model, t + h, yNext, pars);
            const J: number[][] = Array.from({ length: n }, (_, i) =>
                Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) - h * Jf[i][j])
            );

            // Solve J * dy = -residual
            const negResidual = residual.map(r => -r);
            const dy = solveLinear(J, negResidual);

            // Update yNext
            for (let i = 0; i < n; i++) {
                yNext[i] += dy[i];
            }

            if (iter === maxIter - 1) {
                console.warn("Backward Euler Newton-Raphson did not converge");
            }
        }

        t += h;
        y = yNext;
        tOut.push(t);
        yOut.push(y.slice());
    }

    return { time: tOut, values: yOut };
}
