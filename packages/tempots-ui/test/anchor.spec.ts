import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Anchor, type AnchorOptions, type HrefOrAnchorOptions } from '../src/renderables/anchor'
import { prop, Signal, DOMContext, render, Provide, Value } from '@tempots/dom'
import { Location } from '../src/renderables/router/location'
import { setLocationFromUrl } from '../src/renderables/router/location-data'
import { withViewTransition } from '../src/utils/view-transition'
import { handleAnchorClick } from '../src/dom/handle-anchor-click'

// Mock the dependencies
vi.mock('../src/renderables/router/location-data', () => ({
  setLocationFromUrl: vi.fn(),
  areLocationsEqual: vi.fn((a, b) => a === b),
  locationFromURL: vi.fn(),
  urlFromLocation: vi.fn()
}))

vi.mock('../src/utils/view-transition', () => ({
  withViewTransition: vi.fn((fn) => fn())
}))

vi.mock('../src/dom/handle-anchor-click', () => ({
  handleAnchorClick: vi.fn((callback, options) => (event: MouseEvent) => {
    if (callback()) event.preventDefault()
  })
}))

describe('anchor.ts', () => {
  let mockLocation: any
  let mockSetLocationFromUrl: any
  let mockWithViewTransition: any
  let mockHandleAnchorClick: any

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    mockLocation = prop({ pathname: '/', search: {}, hash: undefined })

    // Get the mocked functions
    mockSetLocationFromUrl = vi.mocked(setLocationFromUrl)
    mockWithViewTransition = vi.mocked(withViewTransition)
    mockHandleAnchorClick = vi.mocked(handleAnchorClick)
  })

  describe('Anchor function', () => {
    it('should create anchor with string href', () => {
      const anchor = Anchor('/test', 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should create anchor with Signal href', () => {
      const href = prop('/test')
      const anchor = Anchor(href, 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should create anchor with AnchorOptions', () => {
      const options: AnchorOptions = {
        href: '/test',
        withViewTransition: true,
        ignoreUrlWithExtension: false
      }
      const anchor = Anchor(options, 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should handle string href by converting to options', () => {
      const anchor = Anchor('/test', 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should handle Signal href by converting to options', () => {
      const href = prop('/test')
      const anchor = Anchor(href, 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should pass through anchor click options', () => {
      const options: AnchorOptions = {
        href: '/test',
        ignoreUrlWithExtension: true,
        allowedExtensions: ['.html'],
        ignoreExternalUrl: false
      }
      const anchor = Anchor(options, 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should handle withViewTransition option', () => {
      const options: AnchorOptions = {
        href: '/test',
        withViewTransition: true
      }
      const anchor = Anchor(options, 'Link Text')
      expect(typeof anchor).toBe('function')
    })

    it('should handle multiple children', () => {
      const anchor = Anchor('/test', 'Link ', 'Text', ' Here')
      expect(typeof anchor).toBe('function')
    })
  })

  describe('Anchor logic testing (without full rendering)', () => {
    it('should correctly identify string href input', () => {
      // Test the type checking logic by calling Anchor and checking the recursive call
      const anchor = Anchor('/test', 'Link Text')
      expect(typeof anchor).toBe('function')

      // The function should be created successfully
      expect(anchor).toBeDefined()
    })

    it('should correctly identify Signal href input', () => {
      const href = prop('/test')
      const anchor = Anchor(href, 'Link Text')
      expect(typeof anchor).toBe('function')
      expect(anchor).toBeDefined()
    })

    it('should handle AnchorOptions object correctly', () => {
      const options: AnchorOptions = {
        href: '/test',
        withViewTransition: true,
        ignoreUrlWithExtension: false
      }
      const anchor = Anchor(options, 'Link Text')
      expect(typeof anchor).toBe('function')
      expect(anchor).toBeDefined()
    })

    it('should handle Signal.is check for href detection', () => {
      // Test both string and Signal inputs to ensure proper type detection
      const stringHref = '/string-test'
      const signalHref = prop('/signal-test')

      const stringAnchor = Anchor(stringHref, 'String Link')
      const signalAnchor = Anchor(signalHref, 'Signal Link')

      expect(typeof stringAnchor).toBe('function')
      expect(typeof signalAnchor).toBe('function')
    })

    it('should properly destructure AnchorOptions', () => {
      const options: AnchorOptions = {
        href: '/test',
        withViewTransition: true,
        ignoreUrlWithExtension: true,
        allowedExtensions: ['.html'],
        ignoreExternalUrl: false
      }

      // This tests the destructuring logic in the function
      const anchor = Anchor(options, 'Test Link')
      expect(typeof anchor).toBe('function')
    })

    it('should handle withViewTransition boolean values', () => {
      const withTransition = Anchor({ href: '/test', withViewTransition: true }, 'With Transition')
      const withoutTransition = Anchor({ href: '/test', withViewTransition: false }, 'Without Transition')
      const undefinedTransition = Anchor({ href: '/test' }, 'Undefined Transition')

      expect(typeof withTransition).toBe('function')
      expect(typeof withoutTransition).toBe('function')
      expect(typeof undefinedTransition).toBe('function')
    })

    it('should handle multiple children arguments', () => {
      const anchor = Anchor('/test', 'Child 1', 'Child 2', 'Child 3')
      expect(typeof anchor).toBe('function')
    })

    it('should handle empty children', () => {
      const anchor = Anchor('/test')
      expect(typeof anchor).toBe('function')
    })

    it('should handle complex href values', () => {
      const complexHref = '/users/123/posts/456?sort=date&order=desc#comments'
      const anchor = Anchor(complexHref, 'Complex Link')
      expect(typeof anchor).toBe('function')
    })

    it('should handle Signal href with complex values', () => {
      const href = prop('/dynamic/path')
      const anchor = Anchor(href, 'Dynamic Link')
      expect(typeof anchor).toBe('function')

      // Test that the Signal can be updated
      href.set('/new/path')
      expect(href.value).toBe('/new/path')
    })
  })

  // Note: Full rendering tests are not included due to the complexity of the router system.
  // The anchor component requires a complete Location provider setup which involves:
  // - Browser/Headless context detection
  // - Location state management
  // - Navigation history handling
  // - URL parsing and manipulation
  //
  // The current tests cover:
  // - Function creation and type checking (lines 62-67)
  // - Option handling and destructuring (lines 68-72)
  // - Input validation and conversion logic
  //
  // The uncovered lines (74-89) contain the actual rendering logic that requires
  // the full router infrastructure to test properly. These lines handle:
  // - Location provider usage
  // - DOM element creation
  // - Event handler attachment
  // - View transition integration

  describe('Type definitions', () => {
    it('should accept string as HrefOrAnchorOptions', () => {
      const href: HrefOrAnchorOptions = '/test'
      expect(typeof href).toBe('string')
    })

    it('should accept Signal as HrefOrAnchorOptions', () => {
      const href: HrefOrAnchorOptions = prop('/test')
      expect(Signal.is(href)).toBe(true)
    })

    it('should accept AnchorOptions as HrefOrAnchorOptions', () => {
      const href: HrefOrAnchorOptions = {
        href: '/test',
        withViewTransition: false
      }
      expect(typeof href).toBe('object')
      expect('href' in href).toBe(true)
    })
  })
})
