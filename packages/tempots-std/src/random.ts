/**
 * Utilities for generating random values.
 *
 * This module provides enhanced random number generation, choice selection,
 * and other randomization utilities that go beyond Math.random().
 * Sampling uses Math.random(). Bytes, hexadecimal strings, and UUIDs use Web Crypto.
 *
 * @public
 */

/**
 * Generates a random integer between min and max (inclusive).
 *
 * This function provides a more convenient API than manually scaling Math.random()
 * and handles the common case of generating integers within a specific range.
 *
 * @example
 * ```typescript
 * const dice = randomInt(1, 6) // 1, 2, 3, 4, 5, or 6
 * const index = randomInt(0, array.length - 1) // Valid array index
 * ```
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 * @public
 */
export const randomInt = (min: number, max: number): number => {
  if (min > max) {
    throw new Error('min must be less than or equal to max')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates a random floating-point number between min and max.
 *
 * This function provides a convenient way to generate random floats
 * within a specific range, with optional exclusion of the maximum value.
 *
 * @example
 * ```typescript
 * const temperature = randomFloat(-10.0, 35.0) // Random temperature
 * const percentage = randomFloat(0, 100) // Random percentage
 * ```
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive by default)
 * @param inclusive - Whether to include the maximum value (default: false)
 * @returns A random float between min and max
 * @public
 */
export const randomFloat = (
  min: number,
  max: number,
  inclusive = false
): number => {
  if (min > max) {
    throw new Error('min must be less than or equal to max')
  }
  const random = Math.random()
  const range = max - min
  return inclusive ? random * range + min : random * range + min
}

/**
 * Selects a random element from an array.
 *
 * This function provides a convenient way to pick a random item
 * from an array, handling the index calculation automatically.
 *
 * @example
 * ```typescript
 * const colors = ['red', 'green', 'blue', 'yellow']
 * const randomColor = randomChoice(colors) // One of the colors
 *
 * const users = [{ name: 'Alice' }, { name: 'Bob' }]
 * const randomUser = randomChoice(users) // One of the users
 * ```
 *
 * @param array - The array to choose from
 * @returns A random element from the array
 * @throws Error if the array is empty
 * @public
 */
export const randomChoice = <T>(array: readonly T[]): T => {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array')
  }
  const index = randomInt(0, array.length - 1)
  return array[index]
}

/**
 * Selects multiple random elements from an array without replacement.
 *
 * This function picks a specified number of unique elements from an array.
 * The order of selected elements is randomized.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const sample = randomChoices(numbers, 3) // e.g., [7, 2, 9]
 *
 * const team = randomChoices(allPlayers, 5) // Pick 5 random players
 * ```
 *
 * @param array - The array to choose from
 * @param count - The number of elements to select
 * @returns An array of randomly selected elements
 * @throws Error if count is greater than array length or if array is empty
 * @public
 */
export const randomChoices = <T>(array: readonly T[], count: number): T[] => {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array')
  }
  if (count > array.length) {
    throw new Error('Cannot select more elements than available in array')
  }
  if (count <= 0) {
    return []
  }

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

/**
 * Generates a UUID v4 string using Web Crypto.
 *
 * @example
 * ```typescript
 * const id = randomUuid() // e.g., "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 *
 * @returns A random UUID v4 string
 * @throws Error if Web Crypto is unavailable
 * @public
 */
export const randomUuid = (): string => {
  const bytes = randomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytesToHex(bytes)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const bytesToHex = (bytes: Uint8Array): string => {
  let hex = ''
  for (const byte of bytes) hex += byte.toString(16).padStart(2, '0')
  return hex
}

/**
 * Generates a random hexadecimal string using Web Crypto.
 *
 * Each hexadecimal digit supplies four bits of entropy. Choose the length
 * according to the required entropy for the token or identifier.
 *
 * @example
 * ```typescript
 * const token = randomHex(32) // 128 bits of entropy
 * const color = '#' + randomHex(6) // Random hex color
 * ```
 *
 * @param length - The length of the hex string to generate
 * @returns A random hexadecimal string
 * @throws Error if Web Crypto is unavailable and the requested length is positive
 * @public
 */
export const randomHex = (length: number): string => {
  const digits = Math.ceil(length)
  return bytesToHex(randomBytes(Math.ceil(digits / 2))).slice(0, digits)
}

/**
 * Generates cryptographically random bytes using Web Crypto.
 *
 * This function creates an array of random bytes, useful for
 * cryptographic operations or when you need raw random data.
 *
 * @example
 * ```typescript
 * const key = randomBytes(32) // 32 random bytes
 * const salt = randomBytes(16) // 16 random bytes for salt
 * ```
 *
 * @param length - The number of bytes to generate
 * @returns A Uint8Array containing random bytes
 * @throws Error if Web Crypto is unavailable and the requested length is positive
 * @public
 */
export const randomBytes = (length: number): Uint8Array => {
  if (length <= 0) {
    return new Uint8Array(0)
  }

  const crypto = globalThis.crypto
  if (typeof crypto?.getRandomValues !== 'function') {
    throw new Error('Web Crypto is required to generate secure random values')
  }

  const bytes = new Uint8Array(length)
  const maxChunkSize = 65_536
  for (let offset = 0; offset < bytes.length; offset += maxChunkSize) {
    crypto.getRandomValues(bytes.subarray(offset, offset + maxChunkSize))
  }
  return bytes
}

/**
 * Creates a seeded random number generator.
 *
 * This function returns a deterministic random number generator
 * that produces the same sequence of numbers for the same seed.
 * Useful for testing or when reproducible randomness is needed.
 *
 * @example
 * ```typescript
 * const rng = seedRandom('my-seed')
 * const num1 = rng() // Always the same for this seed
 * const num2 = rng() // Next number in sequence
 *
 * // Create another generator with same seed
 * const rng2 = seedRandom('my-seed')
 * const same1 = rng2() // Same as num1
 * ```
 *
 * @param seed - The seed string for the random number generator
 * @returns A function that generates seeded random numbers between 0 and 1
 * @public
 */
export const seedRandom = (seed: string): (() => number) => {
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Linear congruential generator
  let state = Math.abs(hash)

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * This function randomly reorders the elements of an array,
 * modifying the original array. Each permutation is equally likely.
 *
 * @example
 * ```typescript
 * const deck = ['A', 'K', 'Q', 'J', '10', '9', '8', '7']
 * shuffle(deck) // deck is now randomly ordered
 *
 * const playlist = [...songs]
 * shuffle(playlist) // Randomize playlist order
 * ```
 *
 * @param array - The array to shuffle (modified in place)
 * @returns The same array reference (for chaining)
 * @public
 */
export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Returns a shuffled copy of an array without modifying the original.
 *
 * This function creates a new array with the same elements as the input
 * but in random order, leaving the original array unchanged.
 *
 * @example
 * ```typescript
 * const original = [1, 2, 3, 4, 5]
 * const shuffled = shuffled(original) // e.g., [3, 1, 5, 2, 4]
 * // original is still [1, 2, 3, 4, 5]
 * ```
 *
 * @param array - The array to shuffle
 * @returns A new shuffled array
 * @public
 */
export const shuffled = <T>(array: readonly T[]): T[] => {
  return shuffle([...array])
}
