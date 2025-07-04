import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InViewport, WhenInViewport, type InViewportMode } from '../src/renderables/inviewport'
import { html, render, Signal } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('inviewport.ts', () => {
  let originalIntersectionObserver: typeof IntersectionObserver

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()

    // Store original IntersectionObserver
    originalIntersectionObserver = global.IntersectionObserver
  })

  afterEach(() => {
    // Restore original IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver
  })

  describe('InViewport', () => {
    it('should be a function', () => {
      expect(typeof InViewport).toBe('function')
    })

    it('should render content based on visibility signal', async () => {
      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => visible ? 'Visible' : 'Not visible')
      )

      const clear = render(view, document.body)
      await sleep(10)

      // Initially should not be visible
      expect(document.body.textContent).toBe('Not visible')

      clear()
    })

    it('should create IntersectionObserver when available', async () => {
      const observeSpy = vi.fn()
      const disconnectSpy = vi.fn()

      global.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: observeSpy,
        unobserve: vi.fn(),
        disconnect: disconnectSpy
      })) as any

      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Status: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(global.IntersectionObserver).toHaveBeenCalled()
      expect(observeSpy).toHaveBeenCalled()

      clear()
    })

    it('should work with partial mode (default)', async () => {
      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Partial: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Partial: false')

      clear()
    })

    it('should work with full mode', async () => {
      const view = InViewport(
        { mode: 'full' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Full: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Full: false')

      clear()
    })

    it('should handle once option', async () => {
      const view = InViewport(
        { mode: 'partial', once: true },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Once: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Once: false')

      clear()
    })

    it('should handle multiple InViewport components', async () => {
      const container = html.div(
        InViewport(
          { mode: 'partial' },
          (isVisible: Signal<boolean>) =>
            html.div(isVisible.map(visible => `First: ${visible}`))
        ),
        InViewport(
          { mode: 'full' },
          (isVisible: Signal<boolean>) =>
            html.div(isVisible.map(visible => `Second: ${visible}`))
        )
      )

      const clear = render(container, document.body)
      await sleep(10)

      const divs = document.querySelectorAll('div')
      expect(divs.length).toBeGreaterThanOrEqual(2)

      clear()
    })

    it('should clean up observers on dispose', async () => {
      const disconnectSpy = vi.fn()

      global.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: disconnectSpy
      })) as any

      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Cleanup: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      clear()

      // Should clean up when disposed
      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should handle environment without IntersectionObserver', async () => {
      // Temporarily remove IntersectionObserver
      const originalIO = global.IntersectionObserver
      delete (global as any).IntersectionObserver

      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `No IO: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('No IO: false')

      clear()

      // Restore IntersectionObserver
      global.IntersectionObserver = originalIO
    })
  })

  describe('WhenInViewport', () => {
    it('should be a function', () => {
      expect(typeof WhenInViewport).toBe('function')
    })

    it('should render otherwise content initially', async () => {
      const view = WhenInViewport(
        { mode: 'partial' },
        () => 'In viewport content',
        () => 'Out of viewport content'
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Out of viewport content')

      clear()
    })

    it('should render nothing when out of viewport and no otherwise provided', async () => {
      const view = WhenInViewport(
        { mode: 'partial' },
        () => 'In viewport content'
        // No otherwise function provided
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('')

      clear()
    })

    it('should work with once option', async () => {
      const view = WhenInViewport(
        { mode: 'partial', once: true },
        () => 'Loaded once',
        () => 'Loading...'
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Loading...')

      clear()
    })

    it('should work with full mode', async () => {
      const view = WhenInViewport(
        { mode: 'full' },
        () => 'Fully visible',
        () => 'Not fully visible'
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Not fully visible')

      clear()
    })
  })

  describe('Edge cases', () => {
    it('should handle complex content rendering', async () => {
      const view = InViewport(
        { mode: 'partial' },
        (isVisible: Signal<boolean>) =>
          html.div(
            html.h1('Title'),
            html.p(isVisible.map(visible =>
              visible ? 'Complex content is visible' : 'Complex content is hidden'
            )),
            html.button('Action')
          )
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.querySelector('h1')?.textContent).toBe('Title')
      expect(document.querySelector('p')?.textContent).toBe('Complex content is hidden')
      expect(document.querySelector('button')?.textContent).toBe('Action')

      clear()
    })

    it('should handle different threshold values', async () => {
      const view = InViewport(
        { mode: 'partial', threshold: 0.5 },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Threshold: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Threshold: false')

      clear()
    })

    it('should handle root margin option', async () => {
      const view = InViewport(
        { mode: 'partial', rootMargin: '10px' },
        (isVisible: Signal<boolean>) =>
          isVisible.map(visible => `Margin: ${visible}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Margin: false')

      clear()
    })
  })
})
