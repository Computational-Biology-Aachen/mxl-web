// Implicit methods for stiff ODEs
// | Method                                  | Description                               | Used In                             |
// | --------------------------------------- | ----------------------------------------- | ----------------------------------- |
// | Backward Euler                          | First-order, unconditionally stable       | Stiff integrators, DAEs             |
// | Trapezoidal Rule                        | Second-order A-stable                     | Electrical circuits, DAEs           |
// | Implicit Midpoint                       | Symplectic, good for Hamiltonian systems  | Molecular dynamics                  |
// | Radau IIA (order 5, 9)                  | L-stable, accurate for very stiff ODEs    | MATLAB ode15s, SciPy Radau          |
// | Lobatto IIIC / IIIB                     | Symplectic implicit RK                    | Mechanics, conservative systems     |
// | BDF (Backward Differentiation Formulas) | Multi-step, variable order (1–6)          | CVODE, MATLAB ode15s, SciPy BDF     |
// | Kvaerno 4/5 IRK                         | Stiff IRK with adaptive control           | Advanced stiff solvers, less common |
// | SDIRK (Singly Diagonally Implicit RK)   | Implicit RK with efficient Jacobian reuse | DAE solvers, embedded systems       |

export { kvaerno45 } from "./kvaerno45";
