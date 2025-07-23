// Explicit methods for non-stiff problems
// | Method                    | Description                                | Used In                                  |
// | ------------------------- | ------------------------------------------ | ---------------------------------------- |
// | **Euler's method**        | Very simple, first-order, poor accuracy    | Educational use, bootstrapping           |
// | **Heun's method** (RK2)   | Improved Euler, 2nd-order                  | Basic control simulations                |
// | **RK4**                   | Classic Runge-Kutta, 4th-order, fixed step | Widely used for moderate-accuracy tasks  |
// | **RKF45 (Fehlberg)**      | 4th/5th-order with adaptive step size      | MATLAB `ode45`, SciPy `RK45`             |
// | **Dormand-Prince 5(4)**   | More efficient RK45 variant                | MATLAB `ode45`, Julia `Tsit5`, SciPy     |
// | **Bogacki–Shampine 3(2)** | Embedded pair used for adaptive control    | MATLAB `ode23`, SciPy                    |
// | **Tsitouras 5(4)**        | High-efficiency RK method                  | Julia `Tsit5` (DifferentialEquations.jl) |
// | **Cash–Karp 5(4)**        | Another RK adaptive pair                   | Boost ODEInt, embedded systems           |
// | **Runge–Kutta–Nyström**   | Specialized for second-order ODEs          | Astrodynamics, mechanical systems        |


