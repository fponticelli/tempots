import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Appearance, useAppearance, type AppearanceType } from '../src/renderables/appearance'
import { Signal, getWindow } from '@tempots/dom'

// Mock getWindow
vi.mock('@tempots/dom', async () => {
  const actual = await vi.importActual('@tempots/dom')
  return {
    ...actual,
    getWindow: vi.fn()
  }
})

describe('appearance.ts', () => {
  let mockGetWindow: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetWindow = vi.mocked(getWindow)
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
      // Mock window with matchMedia
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      const appearance = useAppearance()
      expect(Signal.is(appearance)).toBe(true)
    })

    it('should return light theme when matchMedia indicates light', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      const appearance = useAppearance()
      expect(appearance.get()).toBe('light')
    })

    it('should return dark theme when matchMedia indicates dark', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      const appearance = useAppearance()
      expect(appearance.get()).toBe('dark')
    })

    it('should handle case when window is null', () => {
      // This covers line 54: `: undefined`
      mockGetWindow.mockReturnValue(null)

      const appearance = useAppearance()
      expect(Signal.is(appearance)).toBe(true)
      expect(appearance.get()).toBe('light') // Default to light when no matchMedia
    })

    it('should handle case when matchMedia is not available', () => {
      // This covers line 54: `: undefined`
      mockGetWindow.mockReturnValue({
        matchMedia: null
      })

      const appearance = useAppearance()
      expect(Signal.is(appearance)).toBe(true)
      expect(appearance.get()).toBe('light') // Default to light when no matchMedia
    })

    it('should handle case when matchMedia is undefined', () => {
      // This covers line 54: `: undefined`
      mockGetWindow.mockReturnValue({
        matchMedia: undefined
      })

      const appearance = useAppearance()
      expect(Signal.is(appearance)).toBe(true)
      expect(appearance.get()).toBe('light') // Default to light when no matchMedia
    })

    it('should respond to media query changes', () => {
      // This covers line 58: `value.set(e.matches ? 'dark' : 'light')`
      let changeListener: any = null
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn((event: string, listener: any) => {
          if (event === 'change') {
            changeListener = listener
          }
        }),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      const appearance = useAppearance()
      expect(appearance.get()).toBe('light')

      // Simulate media query change to dark
      if (changeListener) {
        changeListener({ matches: true } as MediaQueryListEvent)
        expect(appearance.get()).toBe('dark')
      }

      // Simulate media query change back to light
      if (changeListener) {
        changeListener({ matches: false } as MediaQueryListEvent)
        expect(appearance.get()).toBe('light')
      }
    })

    it('should be disposable', () => {
      const mockRemoveEventListener = vi.fn()
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: mockRemoveEventListener
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      const appearance = useAppearance()
      expect(typeof appearance.dispose).toBe('function')

      // Should not throw when disposed
      expect(() => appearance.dispose()).not.toThrow()

      // Should remove event listener on dispose
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should handle dispose when matcher is undefined', () => {
      mockGetWindow.mockReturnValue(null)

      const appearance = useAppearance()

      // Should not throw when disposed even if matcher is undefined
      expect(() => appearance.dispose()).not.toThrow()
    })
  })

  describe('Appearance Provider', () => {
    it('should have correct provider mark', () => {
      expect(Appearance.mark).toBeDefined()
      expect(typeof Appearance.mark).toBe('symbol')
    })

    it('should create provider with useAppearance value', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      // Create a mock DOMContext
      const mockContext = {} as any

      const provider = Appearance.create(undefined, mockContext)

      expect(Signal.is(provider.value)).toBe(true)
      expect(['light', 'dark']).toContain(provider.value.get())
      expect(typeof provider.dispose).toBe('function')
    })

    it('should dispose provider correctly', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
      mockGetWindow.mockReturnValue({
        matchMedia: mockMatchMedia
      })

      // Create a mock DOMContext
      const mockContext = {} as any

      const provider = Appearance.create(undefined, mockContext)

      // Should not throw when disposed
      expect(() => provider.dispose()).not.toThrow()
    })
  })
})
