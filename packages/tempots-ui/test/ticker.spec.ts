import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Ticker, ticker } from '../src/utils/ticker'

describe('ticker.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Ticker class', () => {
    it('should be a class that extends Prop', () => {
      const t = new Ticker(0, (a, b) => a === b)
      expect(t).toBeInstanceOf(Ticker)
      expect(typeof t.tick).toBe('function')
      expect(typeof t.value).toBe('number')
    })

    it('should initialize with default value of 0', () => {
      const t = new Ticker(0, (a, b) => a === b)
      expect(t.value).toBe(0)
    })

    it('should initialize with custom value', () => {
      const t = new Ticker(5, (a, b) => a === b)
      expect(t.value).toBe(5)
    })

    it('should increment value when tick is called', () => {
      const t = new Ticker(0, (a, b) => a === b)
      expect(t.value).toBe(0)

      t.tick()
      expect(t.value).toBe(1)

      t.tick()
      expect(t.value).toBe(2)

      t.tick()
      expect(t.value).toBe(3)
    })

    it('should increment from custom initial value', () => {
      const t = new Ticker(10, (a, b) => a === b)
      expect(t.value).toBe(10)

      t.tick()
      expect(t.value).toBe(11)

      t.tick()
      expect(t.value).toBe(12)
    })

    it('should work with negative initial values', () => {
      const t = new Ticker(-5, (a, b) => a === b)
      expect(t.value).toBe(-5)

      t.tick()
      expect(t.value).toBe(-4)

      t.tick()
      expect(t.value).toBe(-3)
    })

    it('should work with the tick method', () => {
      const t = new Ticker(0, (a, b) => a === b)

      // Test that tick method exists and works
      expect(typeof t.tick).toBe('function')

      t.tick()
      expect(t.value).toBe(1)

      t.tick()
      expect(t.value).toBe(2)
    })

    it('should be a proper Prop instance', () => {
      const t = new Ticker(0, (a, b) => a === b)

      // Test that it has Prop-like behavior
      expect(t.value).toBe(0)

      // Test that we can set values
      t.set(5)
      expect(t.value).toBe(5)

      // Test that tick increments from the set value
      t.tick()
      expect(t.value).toBe(6)
    })

    it('should handle rapid ticking', () => {
      const t = new Ticker(0, (a, b) => a === b)

      // Tick many times rapidly
      for (let i = 0; i < 100; i++) {
        t.tick()
      }

      expect(t.value).toBe(100)
    })

    it('should maintain equality comparison behavior', () => {
      const t = new Ticker(0, (a, b) => a === b)

      // Test that setting the same value doesn't change anything
      t.set(0)
      expect(t.value).toBe(0)

      // Test that tick increments properly
      t.tick()
      expect(t.value).toBe(1)
    })

    it('should be usable in multiple instances independently', () => {
      const t1 = new Ticker(0, (a, b) => a === b)
      const t2 = new Ticker(10, (a, b) => a === b)

      t1.tick()
      t1.tick()

      t2.tick()

      expect(t1.value).toBe(2)
      expect(t2.value).toBe(11)
    })
  })

  describe('ticker factory function', () => {
    it('should be a function', () => {
      expect(typeof ticker).toBe('function')
    })

    it('should create a Ticker with default value of 0', () => {
      const t = ticker()
      expect(t).toBeInstanceOf(Ticker)
      expect(t.value).toBe(0)
    })

    it('should create a Ticker with custom initial value', () => {
      const t = ticker(5)
      expect(t).toBeInstanceOf(Ticker)
      expect(t.value).toBe(5)
    })

    it('should create independent ticker instances', () => {
      const t1 = ticker(0)
      const t2 = ticker(10)

      t1.tick()
      t2.tick()
      t2.tick()

      expect(t1.value).toBe(1)
      expect(t2.value).toBe(12)
    })

    it('should work with negative initial values', () => {
      const t = ticker(-3)
      expect(t.value).toBe(-3)

      t.tick()
      expect(t.value).toBe(-2)
    })

    it('should work with floating point initial values', () => {
      const t = ticker(1.5)
      expect(t.value).toBe(1.5)

      t.tick()
      expect(t.value).toBe(2.5)

      t.tick()
      expect(t.value).toBe(3.5)
    })
  })

  describe('Use cases and patterns', () => {
    it('should work as a force update mechanism', () => {
      const forceUpdate = ticker()

      // Simulate forcing updates
      forceUpdate.tick() // Force update 1
      forceUpdate.tick() // Force update 2
      forceUpdate.tick() // Force update 3

      expect(forceUpdate.value).toBe(3)
    })

    it('should work as a counter signal', () => {
      const counter = ticker(0)

      // Increment counter multiple times
      counter.tick()
      counter.tick()
      counter.tick()

      expect(counter.value).toBe(3)
    })

    it('should work with conditional logic based on value', () => {
      const t = ticker(0)
      const evenValues: number[] = []

      // Tick multiple times and collect even values
      for (let i = 0; i < 10; i++) {
        t.tick()
        if (t.value % 2 === 0) {
          evenValues.push(t.value)
        }
      }

      expect(evenValues).toEqual([2, 4, 6, 8, 10])
    })

    it('should work with update method', () => {
      const t = ticker(0)

      // Test that update method works
      t.update(v => v + 5)
      expect(t.value).toBe(5)

      // Test that tick still works after update
      t.tick()
      expect(t.value).toBe(6)
    })

    it('should work with set and get operations', () => {
      const t = ticker(10)

      expect(t.value).toBe(10)

      t.set(20)
      expect(t.value).toBe(20)

      t.tick()
      expect(t.value).toBe(21)
    })
  })
})
