/*
 * radau5_wrapper.c — Clean C API over f2c-generated ODE solvers
 *
 * Contains wrappers for RADAU5 (stiff), DOP853 (explicit RK8(5,3)) and
 * DOPRI5 (explicit RK4(5)). All three share a single output buffer and
 * model-function slot — only one solver runs at a time.
 *
 * Model function signature (WAT side must match):
 *   void model_fn(int n, double t, double* y, double* dydt, double* pars)
 * Emscripten addFunction type string: "vidiii"
 */

#include "f2c.h"
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

/* ------------------------------------------------------------------ */
/* Forward declaration of the f2c-generated RADAU5 entry point        */
/* ------------------------------------------------------------------ */
extern int radau5_(integer *n, U_fp fcn, doublereal *x, doublereal *y,
                   doublereal *xend, doublereal *h, doublereal *rtol,
                   doublereal *atol, integer *itol, U_fp jac, integer *ijac,
                   integer *mljac, integer *mujac, U_fp mas, integer *imas,
                   integer *mlmas, integer *mumas, U_fp solout, integer *iout,
                   doublereal *work, integer *lwork, integer *iwork,
                   integer *liwork, doublereal *rpar, integer *ipar,
                   integer *idid);

/* ------------------------------------------------------------------ */
/* Model function pointer                                              */
/* ------------------------------------------------------------------ */
/* Clean signature: void(int n, double t, double* y, double* dydt, double* pars)
   Emscripten table type string: "vidiii" */
typedef void (*ModelFn)(int, double, double *, double *, double *);
static ModelFn g_model_fn = NULL;

/* Called from JS before run_radau5 to register the model function */
void set_model_fn(int table_idx) {
    g_model_fn = (ModelFn)(intptr_t)table_idx;
}

/* ------------------------------------------------------------------ */
/* FCN dispatcher (registered with RADAU5 as the RHS callback)        */
/* ------------------------------------------------------------------ */
/* Fortran ABI: all args are pointers */
static int fcn_dispatch(integer *n, doublereal *x, doublereal *y,
                        doublereal *f, doublereal *rpar, integer *ipar) {
    (void)ipar;
    if (g_model_fn) {
        g_model_fn((int)*n, *x, y, f, rpar);
    }
    return 0;
}

/* ------------------------------------------------------------------ */
/* Dummy JAC / MAS (IJAC=0, IMAS=0 → never called)                   */
/* ------------------------------------------------------------------ */
static int dummy_jac(integer *n, doublereal *x, doublereal *y,
                     doublereal *dfy, integer *ldfy,
                     doublereal *rpar, integer *ipar) {
    (void)n; (void)x; (void)y; (void)dfy; (void)ldfy;
    (void)rpar; (void)ipar;
    return 0;
}

static int dummy_mas(integer *n, doublereal *am, integer *lmas,
                     doublereal *rpar, integer *ipar) {
    (void)n; (void)am; (void)lmas; (void)rpar; (void)ipar;
    return 0;
}

/* ------------------------------------------------------------------ */
/* Output buffer (written by SOLOUT, read by JS after integration)    */
/* ------------------------------------------------------------------ */
static double *out_t  = NULL;
static double *out_y  = NULL;
static int     out_n  = 0;   /* number of accepted steps stored */
static int     out_cap = 0;
static int     out_dim = 0;

void init_output(int capacity, int dim) {
    free(out_t);
    free(out_y);
    out_t   = (double *)malloc((size_t)capacity * sizeof(double));
    out_y   = (double *)malloc((size_t)capacity * (size_t)dim * sizeof(double));
    out_n   = 0;
    out_cap = capacity;
    out_dim = dim;
}

void free_output(void) {
    free(out_t); out_t = NULL;
    free(out_y); out_y = NULL;
    out_n = out_cap = out_dim = 0;
}

int    get_out_n(void)    { return out_n; }
double *get_out_t(void)   { return out_t; }
double *get_out_y(void)   { return out_y; }

/* ------------------------------------------------------------------ */
/* SOLOUT dispatcher                                                   */
/* ------------------------------------------------------------------ */
/* Fortran ABI: (nr, xold, x, y, cont, lrc, n, rpar, ipar, irtrn)    */
static int solout_dispatch(integer *nr, doublereal *xold, doublereal *x,
                           doublereal *y, doublereal *cont, integer *lrc,
                           integer *n, doublereal *rpar, integer *ipar,
                           integer *irtrn) {
    (void)nr; (void)xold; (void)cont; (void)lrc; (void)rpar; (void)ipar;
    if (out_n < out_cap) {
        out_t[out_n] = *x;
        memcpy(out_y + (size_t)out_n * (size_t)out_dim, y,
               (size_t)out_dim * sizeof(double));
        out_n++;
    }
    *irtrn = 1; /* continue */
    return 0;
}

/* ------------------------------------------------------------------ */
/* Main exported API                                                   */
/* ------------------------------------------------------------------ */
/*
 * run_radau5 — drive RADAU5 for a single segment
 *
 * Parameters (all passed by value from JS via ccall):
 *   n        number of state variables
 *   t_start  integration start time
 *   t_end    integration end time
 *   y        pointer into Emscripten heap (HEAPF64), length n
 *   rpar     pointer into heap (parameters), length npars
 *   rtol     relative tolerance (scalar)
 *   atol     absolute tolerance (scalar)
 *   h_init   initial step size guess (0 → RADAU5 default)
 *   nmax     max steps (0 → 100000)
 *
 * Caller must call init_output(capacity, n) before and free_output() after.
 *
 * Returns IDID:  1 = success,  2 = interrupted by SOLOUT,
 *               -1 = bad input, -2 = too many steps,
 *               -3 = step too small, -4 = singular matrix
 *
 * Before calling: set_model_fn(table_idx) and init_output(nout, n)
 * After calling:  read results via get_out_n / get_out_t / get_out_y
 */
int run_radau5(int n, double t_start, double t_end,
               double *y, double *rpar,
               double rtol, double atol,
               double h_init, int nmax) {

    integer N     = (integer)n;
    integer ITOL  = 0; /* scalar tolerances */
    integer IJAC  = 0; /* numerical Jacobian */
    integer MLJAC = N; /* full Jacobian */
    integer MUJAC = N;
    integer IMAS  = 0; /* identity mass matrix */
    integer MLMAS = N;
    integer MUMAS = N;
    integer IOUT  = 1; /* call SOLOUT after every accepted step */
    integer IDID  = 0;
    integer IPAR  = 0;

    integer NMAX = (nmax > 0) ? (integer)nmax : 100000;

    /* Work arrays: LWORK = 4*N*N + 12*N + 20 */
    integer LWORK  = 4 * N * N + 12 * N + 20;
    integer LIWORK = 3 * N + 20;
    doublereal *work  = (doublereal *)calloc((size_t)LWORK,  sizeof(doublereal));
    integer    *iwork = (integer    *)calloc((size_t)LIWORK, sizeof(integer));
    if (!work || !iwork) { free(work); free(iwork); return -1; }

    /* Allow up to NMAX steps — radau5_ does --iwork so IWORK(1) = iwork[0] */
    iwork[0] = NMAX;

    doublereal rtol_d   = (doublereal)rtol;
    doublereal atol_d   = (doublereal)atol;
    doublereal h        = (h_init != 0.0) ? (doublereal)h_init : 0.0;
    doublereal xend     = (doublereal)t_end;
    doublereal xstart   = (doublereal)t_start;

    /* radau5_ applies --y, --rpar, --work, --iwork internally (f2c param
       adjustments), so pass raw 0-based pointers directly. */
    radau5_(&N, (U_fp)fcn_dispatch, &xstart, y, &xend,
            &h, &rtol_d, &atol_d, &ITOL,
            (U_fp)dummy_jac, &IJAC, &MLJAC, &MUJAC,
            (U_fp)dummy_mas, &IMAS, &MLMAS, &MUMAS,
            (U_fp)solout_dispatch, &IOUT,
            work, &LWORK, iwork, &LIWORK,
            rpar, &IPAR, &IDID);

    free(work);
    free(iwork);
    return (int)IDID;
}

/* ================================================================== */
/* DOP853 — explicit Runge-Kutta 8(5,3) by Hairer & Wanner           */
/* ================================================================== */

extern int dop853_(integer *n, U_fp fcn, doublereal *x, doublereal *y,
                   doublereal *xend, doublereal *rtol, doublereal *atol,
                   integer *itol, U_fp solout, integer *iout,
                   doublereal *work, integer *lwork, integer *iwork,
                   integer *liwork, doublereal *rpar, integer *ipar,
                   integer *idid);

/* DOP853 SOLOUT: (nr,xold,x,y,n,con,icomp,nd,rpar,ipar,irtrn,xout) */
static int solout_dop853(integer *nr, doublereal *xold, doublereal *x,
                          doublereal *y, integer *n, doublereal *con,
                          integer *icomp, integer *nd,
                          doublereal *rpar, integer *ipar,
                          integer *irtrn, doublereal *xout) {
    (void)nr; (void)xold; (void)n; (void)con; (void)icomp; (void)nd;
    (void)rpar; (void)ipar; (void)xout;
    if (out_n < out_cap) {
        out_t[out_n] = *x;
        /* f2c passes &y[1]; copy out_dim doubles from that pointer */
        memcpy(out_y + (size_t)out_n * (size_t)out_dim, y,
               (size_t)out_dim * sizeof(double));
        out_n++;
    }
    *irtrn = 1;
    return 0;
}

int run_dop853(int n, double t_start, double t_end,
               double *y, double *rpar,
               double rtol, double atol,
               double h_init, int nmax) {

    integer N    = (integer)n;
    integer ITOL = 0;
    integer IOUT = 1;
    integer IDID = 0;
    integer IPAR = 0;

    /* LWORK = 11*N + 21  (NRDENS=0) */
    integer LWORK  = 11 * N + 21;
    integer LIWORK = 21;
    doublereal *work  = (doublereal *)calloc((size_t)LWORK,  sizeof(doublereal));
    integer    *iwork = (integer    *)calloc((size_t)LIWORK, sizeof(integer));
    if (!work || !iwork) { free(work); free(iwork); return -1; }

    iwork[0] = (nmax > 0) ? (integer)nmax : 100000; /* NMAX */
    iwork[3] = -1; /* suppress stiffness detection */

    doublereal rtol_d = (doublereal)rtol;
    doublereal atol_d = (doublereal)atol;
    doublereal h      = (doublereal)h_init;
    doublereal xend   = (doublereal)t_end;
    doublereal xstart = (doublereal)t_start;

    dop853_(&N, (U_fp)fcn_dispatch, &xstart, y, &xend,
            &rtol_d, &atol_d, &ITOL,
            (U_fp)solout_dop853, &IOUT,
            work, &LWORK, iwork, &LIWORK,
            rpar, &IPAR, &IDID);

    free(work);
    free(iwork);
    return (int)IDID;
}

/* ================================================================== */
/* DOPRI5 — explicit Runge-Kutta 4(5) (Dormand-Prince) by Hairer     */
/* ================================================================== */

extern int dopri5_(integer *n, U_fp fcn, doublereal *x, doublereal *y,
                   doublereal *xend, doublereal *rtol, doublereal *atol,
                   integer *itol, U_fp solout, integer *iout,
                   doublereal *work, integer *lwork, integer *iwork,
                   integer *liwork, doublereal *rpar, integer *ipar,
                   integer *idid);

/* DOPRI5 SOLOUT: (nr,xold,x,y,n,con,icomp,nd,rpar,ipar,irtrn) */
static int solout_dopri5(integer *nr, doublereal *xold, doublereal *x,
                          doublereal *y, integer *n, doublereal *con,
                          integer *icomp, integer *nd,
                          doublereal *rpar, integer *ipar,
                          integer *irtrn) {
    (void)nr; (void)xold; (void)n; (void)con; (void)icomp; (void)nd;
    (void)rpar; (void)ipar;
    if (out_n < out_cap) {
        out_t[out_n] = *x;
        memcpy(out_y + (size_t)out_n * (size_t)out_dim, y,
               (size_t)out_dim * sizeof(double));
        out_n++;
    }
    *irtrn = 1;
    return 0;
}

int run_dopri5(int n, double t_start, double t_end,
               double *y, double *rpar,
               double rtol, double atol,
               double h_init, int nmax) {

    integer N    = (integer)n;
    integer ITOL = 0;
    integer IOUT = 1;
    integer IDID = 0;
    integer IPAR = 0;

    /* LWORK = 8*N + 21  (NRDENS=0) */
    integer LWORK  = 8 * N + 21;
    integer LIWORK = 21;
    doublereal *work  = (doublereal *)calloc((size_t)LWORK,  sizeof(doublereal));
    integer    *iwork = (integer    *)calloc((size_t)LIWORK, sizeof(integer));
    if (!work || !iwork) { free(work); free(iwork); return -1; }

    iwork[0] = (nmax > 0) ? (integer)nmax : 100000; /* NMAX */
    iwork[3] = -1; /* suppress stiffness detection */

    doublereal rtol_d = (doublereal)rtol;
    doublereal atol_d = (doublereal)atol;
    doublereal h      = (doublereal)h_init;
    doublereal xend   = (doublereal)t_end;
    doublereal xstart = (doublereal)t_start;

    dopri5_(&N, (U_fp)fcn_dispatch, &xstart, y, &xend,
            &rtol_d, &atol_d, &ITOL,
            (U_fp)solout_dopri5, &IOUT,
            work, &LWORK, iwork, &LIWORK,
            rpar, &IPAR, &IDID);

    free(work);
    free(iwork);
    return (int)IDID;
}
