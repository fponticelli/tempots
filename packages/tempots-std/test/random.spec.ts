import { describe, test, expect, vi } from 'vitest'
import {
  randomInt,
  randomFloat,
  randomChoice,
  randomChoices,
  randomUuid,
  randomHex,
  randomBytes,
  seedRandom,
  shuffle,
  shuffled
} from '../src/random'

describe('Random utilities', () => {
  describe('randomInt', () => {
    test('generates integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 6)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    test('handles single value range', () => {
      const result = randomInt(5, 5)
      expect(result).toBe(5)
    })

    test('throws error for invalid range', () => {
      expect(() => randomInt(10, 5)).toThrow('min must be less than or equal to max')
    })

    test('handles negative numbers', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-10, -5)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-5)
      }
    })
  })

  describe('randomFloat', () => {
    test('generates floats within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 1)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThan(1)
      }
    })

    test('generates floats within range (inclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 1, true)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)
      }
    })

    test('throws error for invalid range', () => {
      expect(() => randomFloat(10, 5)).toThrow('min must be less than or equal to max')
    })

    test('handles negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomFloat(-5, -1)
        expect(result).toBeGreaterThanOrEqual(-5)
        expect(result).toBeLessThan(-1)
      }
    })
  })

  describe('randomChoice', () => {
    test('selects element from array', () => {
      const array = ['a', 'b', 'c', 'd']
      
      for (let i = 0; i < 50; i++) {
        const result = randomChoice(array)
        expect(array).toContain(result)
      }
    })

    test('returns single element for single-element array', () => {
      const array = ['only']
      const result = randomChoice(array)
      expect(result).toBe('only')
    })

    test('throws error for empty array', () => {
      expect(() => randomChoice([])).toThrow('Cannot choose from empty array')
    })

    test('works with different types', () => {
      const numbers = [1, 2, 3, 4, 5]
      const result = randomChoice(numbers)
      expect(typeof result).toBe('number')
      expect(numbers).toContain(result)
    })
  })

  describe('randomChoices', () => {
    test('selects multiple unique elements', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = randomChoices(array, 3)
      
      expect(result).toHaveLength(3)
      expect(new Set(result).size).toBe(3) // All unique
      result.forEach(item => expect(array).toContain(item))
    })

    test('returns empty array for count 0', () => {
      const array = [1, 2, 3]
      const result = randomChoices(array, 0)
      expect(result).toEqual([])
    })

    test('returns empty array for negative count', () => {
      const array = [1, 2, 3]
      const result = randomChoices(array, -1)
      expect(result).toEqual([])
    })

    test('throws error for count greater than array length', () => {
      const array = [1, 2, 3]
      expect(() => randomChoices(array, 5)).toThrow('Cannot select more elements than available in array')
    })

    test('throws error for empty array', () => {
      expect(() => randomChoices([], 1)).toThrow('Cannot choose from empty array')
    })

    test('can select all elements', () => {
      const array = [1, 2, 3]
      const result = randomChoices(array, 3)
      
      expect(result).toHaveLength(3)
      expect(new Set(result).size).toBe(3)
      array.forEach(item => expect(result).toContain(item))
    })
  })

  describe('randomUuid', () => {
    test('generates valid UUID format', () => {
      const uuid = randomUuid()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      
      expect(uuid).toMatch(uuidRegex)
    })

    test('generates unique UUIDs', () => {
      const uuids = new Set()
      for (let i = 0; i < 100; i++) {
        uuids.add(randomUuid())
      }
      
      expect(uuids.size).toBe(100) // All should be unique
    })

    test('has correct length', () => {
      const uuid = randomUuid()
      expect(uuid).toHaveLength(36) // 32 hex chars + 4 hyphens
    })
  })

  describe('randomHex', () => {
    test('generates hex string of correct length', () => {
      const hex = randomHex(16)
      expect(hex).toHaveLength(16)
      expect(hex).toMatch(/^[0-9a-f]+$/)
    })

    test('returns empty string for length 0', () => {
      const hex = randomHex(0)
      expect(hex).toBe('')
    })

    test('returns empty string for negative length', () => {
      const hex = randomHex(-5)
      expect(hex).toBe('')
    })

    test('generates different strings', () => {
      const hex1 = randomHex(10)
      const hex2 = randomHex(10)
      
      // Very unlikely to be the same
      expect(hex1).not.toBe(hex2)
    })
  })

  describe('randomBytes', () => {
    test('generates correct number of bytes', () => {
      const bytes = randomBytes(32)
      expect(bytes).toBeInstanceOf(Uint8Array)
      expect(bytes.length).toBe(32)
    })

    test('returns empty array for length 0', () => {
      const bytes = randomBytes(0)
      expect(bytes).toBeInstanceOf(Uint8Array)
      expect(bytes.length).toBe(0)
    })

    test('returns empty array for negative length', () => {
      const bytes = randomBytes(-5)
      expect(bytes).toBeInstanceOf(Uint8Array)
      expect(bytes.length).toBe(0)
    })

    test('generates bytes in valid range', () => {
      const bytes = randomBytes(100)
      for (const byte of bytes) {
        expect(byte).toBeGreaterThanOrEqual(0)
        expect(byte).toBeLessThanOrEqual(255)
      }
    })
  })

  describe('seedRandom', () => {
    test('generates deterministic sequence', () => {
      const rng1 = seedRandom('test-seed')
      const rng2 = seedRandom('test-seed')
      
      const sequence1 = [rng1(), rng1(), rng1()]
      const sequence2 = [rng2(), rng2(), rng2()]
      
      expect(sequence1).toEqual(sequence2)
    })

    test('different seeds generate different sequences', () => {
      const rng1 = seedRandom('seed1')
      const rng2 = seedRandom('seed2')
      
      const sequence1 = [rng1(), rng1(), rng1()]
      const sequence2 = [rng2(), rng2(), rng2()]
      
      expect(sequence1).not.toEqual(sequence2)
    })

    test('generates numbers between 0 and 1', () => {
      const rng = seedRandom('test')
      
      for (let i = 0; i < 100; i++) {
        const num = rng()
        expect(num).toBeGreaterThanOrEqual(0)
        expect(num).toBeLessThan(1)
      }
    })
  })

  describe('shuffle', () => {
    test('modifies array in place', () => {
      const original = [1, 2, 3, 4, 5]
      const result = shuffle(original)
      
      expect(result).toBe(original) // Same reference
      expect(result).toHaveLength(5)
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]) // Same elements
    })

    test('handles empty array', () => {
      const array: number[] = []
      const result = shuffle(array)
      
      expect(result).toBe(array)
      expect(result).toHaveLength(0)
    })

    test('handles single element array', () => {
      const array = [42]
      const result = shuffle(array)
      
      expect(result).toBe(array)
      expect(result).toEqual([42])
    })

    test('actually shuffles elements', () => {
      // This test might occasionally fail due to randomness, but very unlikely
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const copy = [...original]
      shuffle(copy)
      
      // Very unlikely to be in the same order
      let sameOrder = true
      for (let i = 0; i < original.length; i++) {
        if (original[i] !== copy[i]) {
          sameOrder = false
          break
        }
      }
      
      // This assertion might rarely fail due to randomness
      // but the probability is extremely low for a 10-element array
      expect(sameOrder).toBe(false)
    })
  })

  describe('shuffled', () => {
    test('returns new shuffled array', () => {
      const original = [1, 2, 3, 4, 5]
      const result = shuffled(original)
      
      expect(result).not.toBe(original) // Different reference
      expect(original).toEqual([1, 2, 3, 4, 5]) // Original unchanged
      expect(result).toHaveLength(5)
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]) // Same elements
    })

    test('handles empty array', () => {
      const array: number[] = []
      const result = shuffled(array)
      
      expect(result).not.toBe(array)
      expect(result).toEqual([])
    })

    test('handles single element array', () => {
      const array = [42]
      const result = shuffled(array)
      
      expect(result).not.toBe(array)
      expect(result).toEqual([42])
    })
  })
})
