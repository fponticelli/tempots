/**
 * A function that maps a normalized time value `t` in [0, 1] to a progress
 * value, typically also in [0, 1] but may overshoot for back/elastic easings.
 *
 * @public
 */
export type EasingFn = (t: number) => number

// --- Constants ---

const PI = Math.PI
const HALF_PI = PI / 2
const BACK_S = 1.70158
const BACK_S_IO = BACK_S * 1.525
const BOUNCE_N1 = 7.5625
const BOUNCE_D1 = 2.75
const ELASTIC_C4 = (2 * PI) / 3
const ELASTIC_C5 = (2 * PI) / 4.5

// --- Standard Easings ---

/** Identity easing: `f(t) = t`. @public */
export const linear: EasingFn = t => t

/** Quadratic ease-in. @public */
export const easeInQuad: EasingFn = t => t * t

/** Quadratic ease-out. @public */
export const easeOutQuad: EasingFn = t => t * (2 - t)

/** Quadratic ease-in-out. @public */
export const easeInOutQuad: EasingFn = t =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

/** Cubic ease-in. @public */
export const easeInCubic: EasingFn = t => t * t * t

/** Cubic ease-out. @public */
export const easeOutCubic: EasingFn = t => {
  const t1 = t - 1
  return t1 * t1 * t1 + 1
}

/** Cubic ease-in-out. @public */
export const easeInOutCubic: EasingFn = t =>
  t < 0.5 ? 4 * t * t * t : 1 + (t - 1) * (2 * t - 2) * (2 * t - 2)

/** Quartic ease-in. @public */
export const easeInQuart: EasingFn = t => t * t * t * t

/** Quartic ease-out. @public */
export const easeOutQuart: EasingFn = t => {
  const t1 = t - 1
  return 1 - t1 * t1 * t1 * t1
}

/** Quartic ease-in-out. @public */
export const easeInOutQuart: EasingFn = t => {
  if (t < 0.5) return 8 * t * t * t * t
  const t1 = t - 1
  return 1 - 8 * t1 * t1 * t1 * t1
}

/** Sine ease-in. @public */
export const easeInSine: EasingFn = t => 1 - Math.cos(t * HALF_PI)

/** Sine ease-out. @public */
export const easeOutSine: EasingFn = t => Math.sin(t * HALF_PI)

/** Sine ease-in-out. @public */
export const easeInOutSine: EasingFn = t => -(Math.cos(PI * t) - 1) / 2

/** Exponential ease-in. @public */
export const easeInExpo: EasingFn = t =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10)

/** Exponential ease-out. @public */
export const easeOutExpo: EasingFn = t =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

/** Exponential ease-in-out. @public */
export const easeInOutExpo: EasingFn = t => {
  if (t === 0) return 0
  if (t === 1) return 1
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2
}

/** Back ease-in (overshoots at start, s = 1.70158). @public */
export const easeInBack: EasingFn = t =>
  (BACK_S + 1) * t * t * t - BACK_S * t * t

/** Back ease-out (overshoots at end). @public */
export const easeOutBack: EasingFn = t => {
  const t1 = t - 1
  return 1 + (BACK_S + 1) * t1 * t1 * t1 + BACK_S * t1 * t1
}

/** Back ease-in-out (overshoots both ends). @public */
export const easeInOutBack: EasingFn = t => {
  if (t < 0.5) {
    const s = 2 * t
    return (s * s * ((BACK_S_IO + 1) * s - BACK_S_IO)) / 2
  }
  const s = 2 * t - 2
  return (s * s * ((BACK_S_IO + 1) * s + BACK_S_IO) + 2) / 2
}

/** Bounce ease-out. @public */
export const easeOutBounce: EasingFn = t => {
  if (t < 1 / BOUNCE_D1) return BOUNCE_N1 * t * t
  if (t < 2 / BOUNCE_D1) {
    const t1 = t - 1.5 / BOUNCE_D1
    return BOUNCE_N1 * t1 * t1 + 0.75
  }
  if (t < 2.5 / BOUNCE_D1) {
    const t1 = t - 2.25 / BOUNCE_D1
    return BOUNCE_N1 * t1 * t1 + 0.9375
  }
  const t1 = t - 2.625 / BOUNCE_D1
  return BOUNCE_N1 * t1 * t1 + 0.984375
}

/** Bounce ease-in. @public */
export const easeInBounce: EasingFn = t => 1 - easeOutBounce(1 - t)

/** Bounce ease-in-out. @public */
export const easeInOutBounce: EasingFn = t =>
  t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2

/** Elastic ease-out. @public */
export const easeOutElastic: EasingFn = t => {
  if (t === 0) return 0
  if (t === 1) return 1
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ELASTIC_C4) + 1
}

/** Elastic ease-in. @public */
export const easeInElastic: EasingFn = t => {
  if (t === 0) return 0
  if (t === 1) return 1
  return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ELASTIC_C4)
}

/** Elastic ease-in-out. @public */
export const easeInOutElastic: EasingFn = t => {
  if (t === 0) return 0
  if (t === 1) return 1
  return t < 0.5
    ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) / 2
    : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) /
        2 +
        1
}

// --- Combinators ---

/**
 * Reverses an easing function: the result plays the easing curve backwards.
 * `reverseEasing(easeIn)` produces an ease-out curve.
 *
 * @param fn - The easing function to reverse.
 * @returns A new easing function.
 * @public
 */
export const reverseEasing =
  (fn: EasingFn): EasingFn =>
  t =>
    1 - fn(1 - t)

/**
 * Mirrors an easing function: the first half uses `fn`, the second half
 * plays it in reverse. Useful for creating symmetric in-out easings from
 * a single ease-in.
 *
 * @param fn - The easing function to mirror.
 * @returns A new easing function.
 * @public
 */
export const mirrorEasing =
  (fn: EasingFn): EasingFn =>
  t =>
    t < 0.5 ? fn(2 * t) / 2 : (2 - fn(2 * (1 - t))) / 2

/**
 * Chains two easing functions: `a` is used for the first half of the
 * animation, `b` for the second half.
 *
 * @param a - Easing for the first half.
 * @param b - Easing for the second half.
 * @returns A new easing function.
 * @public
 */
export const chainEasing =
  (a: EasingFn, b: EasingFn): EasingFn =>
  t =>
    t < 0.5 ? a(2 * t) / 2 : 0.5 + b(2 * t - 1) / 2
