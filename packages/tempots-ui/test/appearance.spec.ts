import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Appearance, useAppearance, type AppearanceType } from '../src/renderables/appearance'
import { Signal } from '@tempots/dom'

describe('appearance.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AppearanceType', () => {
    it('should accept light as valid type', () => {
      const type: AppearanceType = 'light'
      expect(type).toBe('light')
    })

    it('should accept dark as valid type', () => {
      const type: AppearanceType = 'dark'
      expect(type).toBe('dark')
    })
  })

  describe('useAppearance', () => {
    it('should return a signal', () => {
      const appearance = useAppearance()
      expect(Signal.is(appearance)).toBe(true)
    })

    it('should return either light or dark theme', () => {
      const appearance = useAppearance()
      const value = appearance.get()
      expect(['light', 'dark']).toContain(value)
    })

    it('should be disposable', () => {
      const appearance = useAppearance()
      expect(typeof appearance.dispose).toBe('function')

      // Should not throw when disposed
      expect(() => appearance.dispose()).not.toThrow()
    })
  })

  describe('Appearance Provider', () => {
    it('should have correct provider mark', () => {
      expect(Appearance.mark).toBeDefined()
      expect(typeof Appearance.mark).toBe('symbol')
    })

    it('should create provider with useAppearance value', () => {
      const provider = Appearance.create()

      expect(Signal.is(provider.value)).toBe(true)
      expect(['light', 'dark']).toContain(provider.value.get())
      expect(typeof provider.dispose).toBe('function')
    })

    it('should dispose provider correctly', () => {
      const provider = Appearance.create()

      // Should not throw when disposed
      expect(() => provider.dispose()).not.toThrow()
    })
  })
})
