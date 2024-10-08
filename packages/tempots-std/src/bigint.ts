import { ArgumentError } from './error'

/**
 * Calculates the ceiling division of two BigInt numbers.
 *
 * @param x - The dividend.
 * @param y - The divisor.
 * @returns The result of dividing `x` by `y`, rounded up to the nearest whole number.
 * @public
 */
export const biCeilDiv = (x: bigint, y: bigint): bigint => {
  if (y < 0n) {
    x = -x
    y = -y
  }
  return x <= 0n ? x / y : (x - 1n) / y + 1n
}

/**
 * Divides two BigInt numbers and returns the largest integer less than or equal to the quotient.
 *
 * @param x - The dividend.
 * @param y - The divisor.
 * @returns The largest integer less than or equal to the quotient of `x` divided by `y`.
 * @public
 */
export const biFloorDiv = (x: bigint, y: bigint): bigint => {
  if (y < 0n) {
    x = -x
    y = -y
  }
  return x >= 0n ? x / y : (x + 1n) / y - 1n
}

/**
 * Compares two BigInt values and returns a number indicating their relative order.
 * @param x - The first BigInt value to compare.
 * @param y - The second BigInt value to compare.
 * @returns A negative number if `x` is less than `y`, a positive number if `x` is greater than `y`,
 * @public
 *          or zero if `x` is equal to `y`.
 */
export const biCompare = (x: bigint, y: bigint): number =>
  x < y ? -1 : x > y ? 1 : 0

/**
 * Returns the absolute value of a bigint.
 *
 * @param x - The bigint to compute the absolute value of.
 * @returns The absolute value of `x`.
 * @public
 */
export const biAbs = (x: bigint): bigint => (x < 0n ? -x : x)

/**
 * Returns the minimum of two BigInt values.
 *
 * @param x - The first BigInt value.
 * @param y - The second BigInt value.
 * @returns The smaller of the two BigInt values.
 * @public
 */
export const biMin = (x: bigint, y: bigint): bigint => (x < y ? x : y)

/**
 * Returns the maximum of two BigInt values.
 *
 * @param x - The first BigInt value.
 * @param y - The second BigInt value.
 * @returns The maximum of the two BigInt values.
 * @public
 */
export const biMax = (x: bigint, y: bigint): bigint => (x > y ? x : y)

/**
 * Calculates the power of a bigint number.
 *
 * @param x - The base number.
 * @param y - The exponent.
 * @returns The result of raising `x` to the power of `y`.
 * @public
 * @throws Throws `ArgumentError` if the exponent `y` is negative.
 */
export const biPow = (x: bigint, y: bigint): bigint => {
  if (y < 0n)
    throw new ArgumentError('negative exponent for parameter y of biPow')
  let result = 1n
  while (y > 0n) {
    if ((y & 1n) !== 0n) result *= x
    y >>= 1n
    x *= x
  }
  return result
}

/**
 * Calculates the greatest common divisor (GCD) of two BigInt numbers.
 *
 * @param x - The first BigInt number.
 * @param y - The second BigInt number.
 * @returns The GCD of `x` and `y`.
 * @public
 */
export const biGcd = (x: bigint, y: bigint): bigint => {
  x = biAbs(x)
  y = biAbs(y)
  while (y > 0n) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

/**
 * Calculates the least common multiple (LCM) of two BigInt numbers.
 *
 * @param x - The first BigInt number.
 * @param y - The second BigInt number.
 * @returns The least common multiple of `x` and `y`.
 * @public
 */
export const biLcm = (x: bigint, y: bigint): bigint =>
  biAbs(x * y) / biGcd(x, y)

/**
 * Checks if a given number is prime.
 *
 * @param x - The number to check for primality.
 * @returns `true` if the number is prime, `false` otherwise.
 * @public
 */
export const biIsPrime = (x: bigint): boolean => {
  if (x < 2n) return false
  if (x === 2n || x === 3n) return true
  if (x % 2n === 0n || x % 3n === 0n) return false
  let i = 5n
  while (i * i <= x) {
    if (x % i === 0n || x % (i + 2n) === 0n) return false
    i += 6n
  }
  return true
}

/**
 * Finds the next prime number greater than the given number.
 *
 * @param x - The starting number.
 * @returns The next prime number greater than `x`.
 * @public
 */
export const biNextPrime = (x: bigint): bigint => {
  if (x < 2n) return 2n
  if (x === 2n) return 3n
  if (x % 2n === 0n) x++
  else x += 2n
  while (!biIsPrime(x)) x += 2n
  return x
}

/**
 * Returns the previous prime number less than the given number.
 * Throws an error if there is no previous prime.
 *
 * @param x - The number to find the previous prime for.
 * @returns The previous prime number less than `x`.
 * @public
 * @throws Throws `ArgumentError` if there is no previous prime.
 */
export const biPrevPrime = (x: bigint): bigint => {
  if (x <= 2n) throw new ArgumentError(`no previous prime ${x} for biPrevPrime`)
  if (x === 3n) return 2n
  if (x % 2n === 0n) x--
  else x -= 2n
  while (!biIsPrime(x)) x -= 2n
  return x
}

/**
 * Checks if a given bigint is even.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is even, `false` otherwise.
 * @public
 */
export const biIsEven = (x: bigint): boolean => x % 2n === 0n

/**
 * Checks if a given bigint is odd.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is odd, `false` otherwise.
 * @public
 */
export const biIsOdd = (x: bigint): boolean => x % 2n !== 0n

/**
 * Checks if a given bigint is zero.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is zero, `false` otherwise.
 * @public
 */
export const biIsZero = (x: bigint): boolean => x === 0n

/**
 * Checks if a given bigint is equal to 1n.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is equal to 1n, `false` otherwise.
 * @public
 */
export const biIsOne = (x: bigint): boolean => x === 1n

/**
 * Checks if a given bigint is negative.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is negative, `false` otherwise.
 * @public
 */
export const biIsNegative = (x: bigint): boolean => x < 0n

/**
 * Checks if a bigint is positive.
 *
 * @param x - The bigint to check.
 * @returns `true` if the bigint is positive, `false` otherwise.
 * @public
 */
export const biIsPositive = (x: bigint): boolean => x > 0n
