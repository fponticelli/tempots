/**
 * Color distance functions using CIE76 and CIEDE2000 algorithms.
 *
 * @public
 */

import { type Color, type LABA, convertColor } from './color'

const deg2rad = (d: number): number => (d * Math.PI) / 180

/**
 * Computes the CIE76 color distance (Euclidean distance in
 * CIELAB space) between two colors.
 *
 * @param a - The first color.
 * @param b - The second color.
 * @returns The Euclidean distance in LAB space.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * colorDistanceSimple(
 *   rgb8a(255, 0, 0),
 *   rgb8a(0, 255, 0)
 * ) // ~170.56
 * ```
 */
export const colorDistanceSimple = (a: Color, b: Color): number => {
  const lab1 = convertColor(a, 'lab') as LABA
  const lab2 = convertColor(b, 'lab') as LABA
  const l1 = lab1.l * 100
  const l2 = lab2.l * 100
  const dL = l1 - l2
  const da = lab1.a - lab2.a
  const db = lab1.b - lab2.b
  return Math.sqrt(dL * dL + da * da + db * db)
}

/**
 * Computes the CIEDE2000 color distance between two colors.
 *
 * This is the most perceptually uniform color difference metric
 * standardized by the CIE. It accounts for lightness, chroma,
 * and hue weighting as well as interactive effects between
 * chroma and hue differences.
 *
 * @param a - The first color.
 * @param b - The second color.
 * @returns The CIEDE2000 deltaE value.
 * @public
 * @example
 * ```ts
 * import { rgb8a } from './color'
 * colorDistance(
 *   rgb8a(255, 0, 0),
 *   rgb8a(0, 255, 0)
 * ) // ~86.61
 * ```
 */
export const colorDistance = (a: Color, b: Color): number => {
  const lab1 = convertColor(a, 'lab') as LABA
  const lab2 = convertColor(b, 'lab') as LABA

  const L1 = lab1.l * 100
  const a1 = lab1.a
  const b1 = lab1.b
  const L2 = lab2.l * 100
  const a2 = lab2.a
  const b2 = lab2.b

  // Step 1: Calculate C'ab
  const C1 = Math.sqrt(a1 * a1 + b1 * b1)
  const C2 = Math.sqrt(a2 * a2 + b2 * b2)
  const Cab_mean = (C1 + C2) / 2
  const Cab_mean7 = Math.pow(Cab_mean, 7)
  const G = 0.5 * (1 - Math.sqrt(Cab_mean7 / (Cab_mean7 + Math.pow(25, 7))))
  const a1p = a1 * (1 + G)
  const a2p = a2 * (1 + G)
  const C1p = Math.sqrt(a1p * a1p + b1 * b1)
  const C2p = Math.sqrt(a2p * a2p + b2 * b2)

  // Step 2: Calculate h'
  let h1p = (Math.atan2(b1, a1p) * 180) / Math.PI
  if (h1p < 0) h1p += 360
  let h2p = (Math.atan2(b2, a2p) * 180) / Math.PI
  if (h2p < 0) h2p += 360

  // Step 3: Calculate deltaL', deltaC', deltaH'
  const dLp = L2 - L1
  const dCp = C2p - C1p

  let dhp: number
  if (C1p * C2p === 0) {
    dhp = 0
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360
  } else {
    dhp = h2p - h1p + 360
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(dhp / 2))

  // Step 4: Calculate CIEDE2000
  const Lp_mean = (L1 + L2) / 2
  const Cp_mean = (C1p + C2p) / 2

  let hp_mean: number
  if (C1p * C2p === 0) {
    hp_mean = h1p + h2p
  } else if (Math.abs(h1p - h2p) <= 180) {
    hp_mean = (h1p + h2p) / 2
  } else if (h1p + h2p < 360) {
    hp_mean = (h1p + h2p + 360) / 2
  } else {
    hp_mean = (h1p + h2p - 360) / 2
  }

  const T =
    1 -
    0.17 * Math.cos(deg2rad(hp_mean - 30)) +
    0.24 * Math.cos(deg2rad(2 * hp_mean)) +
    0.32 * Math.cos(deg2rad(3 * hp_mean + 6)) -
    0.2 * Math.cos(deg2rad(4 * hp_mean - 63))

  const Lp_mean_50 = Lp_mean - 50
  const SL =
    1 +
    (0.015 * Lp_mean_50 * Lp_mean_50) / Math.sqrt(20 + Lp_mean_50 * Lp_mean_50)
  const SC = 1 + 0.045 * Cp_mean
  const SH = 1 + 0.015 * Cp_mean * T

  const dTheta =
    30 * Math.exp(-(((hp_mean - 275) / 25) * ((hp_mean - 275) / 25)))
  const Cp_mean7 = Math.pow(Cp_mean, 7)
  const RC = 2 * Math.sqrt(Cp_mean7 / (Cp_mean7 + Math.pow(25, 7)))
  const RT = -Math.sin(deg2rad(2 * dTheta)) * RC

  const ratioL = dLp / SL
  const ratioC = dCp / SC
  const ratioH = dHp / SH

  return Math.sqrt(
    ratioL * ratioL + ratioC * ratioC + ratioH * ratioH + RT * ratioC * ratioH
  )
}
