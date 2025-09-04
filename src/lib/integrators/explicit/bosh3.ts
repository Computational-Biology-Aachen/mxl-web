/**  Bogacki--Shampine's 3/2 method.
 *
 * 3rd order explicit Runge--Kutta method.
 * Has an embedded 2nd order method for adaptive step sizing
 * Uses 4 stages with FSAL. Uses 3rd order Hermite interpolation for dense/ts output.
 *
 * Also sometimes known as "Ralston's third order method".
 *
 */

type ExplicitButcherTableau = {
    aLower: number[][],
    bSol: number[],
    bErr: number[],
    c: number[],
}


const Tableau: ExplicitButcherTableau = {
    aLower: [[1 / 2], [0.0, 3 / 4], [2 / 9, 1 / 3, 4 / 9]],
    bSol: [2 / 9, 1 / 3, 4 / 9, 0.0],
    bErr: [2 / 9 - 7 / 24, 1 / 3 - 1 / 4, 4 / 9 - 1 / 3, -1 / 8],
    c: [1 / 2, 3 / 4, 1.0],
}
