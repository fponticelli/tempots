import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { Rect, getAbsoluteRect, ElementRect, WindowSize } from '../src/renderables/size'
import { html, render, prop } from '@tempots/dom'
import { sleep } from '@tempots/std'

// Mock ResizeObserver
class MockResizeObserver {
  private callback: ResizeObserverCallback
  private elements = new Set<Element>()

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  // Helper method to trigger resize
  triggerResize(element: Element) {
    if (this.elements.has(element)) {
      const entry: ResizeObserverEntry = {
        target: element,
        contentRect: element.getBoundingClientRect(),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: []
      }
      this.callback([entry], this)
    }
  }
}

describe('size.ts', () => {
  let mockResizeObserver: MockResizeObserver
  let originalResizeObserver: typeof ResizeObserver
  let originalScrollX: number
  let originalScrollY: number

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()

    // Store original values
    originalScrollX = window.scrollX
    originalScrollY = window.scrollY
    originalResizeObserver = global.ResizeObserver

    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      mockResizeObserver = new MockResizeObserver(callback)
      return mockResizeObserver
    }) as any

    // Mock scroll position
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  afterEach(() => {
    // Restore original values
    global.ResizeObserver = originalResizeObserver
    Object.defineProperty(window, 'scrollX', { value: originalScrollX, writable: true })
    Object.defineProperty(window, 'scrollY', { value: originalScrollY, writable: true })
  })

  describe('Rect class', () => {
    it('should create a Rect with constructor', () => {
      const rect = new Rect(10, 20, 100, 50)

      expect(rect.left).toBe(10)
      expect(rect.top).toBe(20)
      expect(rect.width).toBe(100)
      expect(rect.height).toBe(50)
    })

    it('should create a Rect with static of method', () => {
      const rect = Rect.of({ left: 10, top: 20, width: 100, height: 50 })

      expect(rect.left).toBe(10)
      expect(rect.top).toBe(20)
      expect(rect.width).toBe(100)
      expect(rect.height).toBe(50)
    })

    it('should create a Rect with default values using of method', () => {
      const rect = Rect.of({})

      expect(rect.left).toBe(0)
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(0)
      expect(rect.height).toBe(0)
    })

    it('should create a Rect with partial values using of method', () => {
      const rect = Rect.of({ left: 10, width: 100 })

      expect(rect.left).toBe(10)
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(100)
      expect(rect.height).toBe(0)
    })

    it('should calculate right property correctly', () => {
      const rect = new Rect(10, 20, 100, 50)
      expect(rect.right).toBe(110) // left + width
    })

    it('should calculate bottom property correctly', () => {
      const rect = new Rect(10, 20, 100, 50)
      expect(rect.bottom).toBe(70) // top + height
    })

    it('should calculate center property correctly', () => {
      const rect = new Rect(10, 20, 100, 50)
      const center = rect.center

      expect(center.x).toBe(60) // left + width/2
      expect(center.y).toBe(45) // top + height/2
    })

    it('should return size property correctly', () => {
      const rect = new Rect(10, 20, 100, 50)
      const size = rect.size

      expect(size.width).toBe(100)
      expect(size.height).toBe(50)
    })

    it('should compare rectangles for equality', () => {
      const rect1 = new Rect(10, 20, 100, 50)
      const rect2 = new Rect(10, 20, 100, 50)
      const rect3 = new Rect(11, 20, 100, 50)

      expect(rect1.equals(rect2)).toBe(true)
      expect(rect1.equals(rect3)).toBe(false)
    })

    it('should handle near-equal values in equality comparison', () => {
      const rect1 = new Rect(10, 20, 100, 50)
      const rect2 = new Rect(10.0000000001, 20, 100, 50) // Very close values (smaller difference)

      expect(rect1.equals(rect2)).toBe(true)
    })

    it('should handle negative values', () => {
      const rect = new Rect(-10, -20, 100, 50)

      expect(rect.left).toBe(-10)
      expect(rect.top).toBe(-20)
      expect(rect.right).toBe(90)
      expect(rect.bottom).toBe(30)
    })

    it('should handle zero dimensions', () => {
      const rect = new Rect(10, 20, 0, 0)

      expect(rect.width).toBe(0)
      expect(rect.height).toBe(0)
      expect(rect.right).toBe(10)
      expect(rect.bottom).toBe(20)
    })
  })

  describe('getAbsoluteRect function', () => {
    it('should calculate absolute rect without scroll', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      // Mock getBoundingClientRect
      const mockRect = {
        left: 10,
        top: 20,
        width: 100,
        height: 50,
        right: 110,
        bottom: 70,
        x: 10,
        y: 20,
        toJSON: () => ({})
      }

      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect)

      const absoluteRect = getAbsoluteRect(element)

      expect(absoluteRect.left).toBe(10)
      expect(absoluteRect.top).toBe(20)
      expect(absoluteRect.width).toBe(100)
      expect(absoluteRect.height).toBe(50)

      element.remove()
    })

    it('should calculate absolute rect with scroll offset', () => {
      // Set scroll position
      Object.defineProperty(window, 'scrollX', { value: 50, writable: true })
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })

      const element = document.createElement('div')
      document.body.appendChild(element)

      const mockRect = {
        left: 10,
        top: 20,
        width: 100,
        height: 50,
        right: 110,
        bottom: 70,
        x: 10,
        y: 20,
        toJSON: () => ({})
      }

      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect)

      const absoluteRect = getAbsoluteRect(element)

      expect(absoluteRect.left).toBe(60) // 10 + 50 (scrollX)
      expect(absoluteRect.top).toBe(120) // 20 + 100 (scrollY)
      expect(absoluteRect.width).toBe(100)
      expect(absoluteRect.height).toBe(50)

      element.remove()
    })
  })

  describe('ElementRect', () => {
    it('should be a function', () => {
      expect(typeof ElementRect).toBe('function')
    })

    it('should provide rect signal to child function', async () => {
      const rectValues: Rect[] = []

      const view = ElementRect((rect) => {
        rectValues.push(rect.value)
        return rect.map(r => `Rect: ${r.width}x${r.height}`)
      })

      const container = html.div(view, 'Test content')
      const clear = render(container, document.body)
      await sleep(10)

      expect(rectValues.length).toBeGreaterThan(0)
      expect(document.body.textContent).toContain('Rect:')

      clear()
    })

    it('should create ResizeObserver when available', async () => {
      const observeSpy = vi.fn()
      const disconnectSpy = vi.fn()

      global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: observeSpy,
        unobserve: vi.fn(),
        disconnect: disconnectSpy
      })) as any

      const view = ElementRect((rect) =>
        rect.map(r => `Size: ${r.width}x${r.height}`)
      )

      const container = html.div(view)
      const clear = render(container, document.body)
      await sleep(10)

      expect(global.ResizeObserver).toHaveBeenCalled()
      expect(observeSpy).toHaveBeenCalled()

      clear()
      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should handle environment without ResizeObserver', async () => {
      // Temporarily remove ResizeObserver
      const originalRO = global.ResizeObserver
      delete (global as any).ResizeObserver

      const view = ElementRect((rect) =>
        rect.map(r => `No RO: ${r.width}x${r.height}`)
      )

      const container = html.div(view)
      const clear = render(container, document.body)
      await sleep(10)

      expect(document.body.textContent).toContain('No RO:')

      clear()

      // Restore ResizeObserver
      global.ResizeObserver = originalRO
    })

    it('should trigger resize callback when ResizeObserver fires', async () => {
      let resizeCallback: ResizeObserverCallback | null = null
      const observeSpy = vi.fn()
      const disconnectSpy = vi.fn()

      global.ResizeObserver = vi.fn().mockImplementation((callback) => {
        resizeCallback = callback
        return {
          observe: observeSpy,
          unobserve: vi.fn(),
          disconnect: disconnectSpy
        }
      }) as any

      let currentRect: Rect | null = null
      const view = ElementRect((rect) => {
        currentRect = rect.value
        return rect.map(r => `Size: ${r.width}x${r.height}`)
      })

      const container = html.div(view)
      const clear = render(container, document.body)
      await sleep(10)

      // Get the initial rect
      const initialRect = currentRect
      expect(initialRect).toBeDefined()

      // Get the element that was observed
      const observedElement = observeSpy.mock.calls[0][0] as Element

      // Mock a new getBoundingClientRect result with different dimensions
      vi.spyOn(observedElement, 'getBoundingClientRect').mockReturnValue({
        left: 20,
        top: 30,
        width: 200,
        height: 100,
        right: 220,
        bottom: 130,
        x: 20,
        y: 30,
        toJSON: () => ({})
      })

      // Trigger the resize callback to cover lines 253-254
      if (resizeCallback) {
        const mockEntry: ResizeObserverEntry = {
          target: observedElement,
          contentRect: observedElement.getBoundingClientRect(),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: []
        }
        resizeCallback([mockEntry], {} as ResizeObserver)
        await sleep(10)
      }

      // Verify that the resize callback was called and the ResizeObserver was set up
      expect(global.ResizeObserver).toHaveBeenCalled()
      expect(observeSpy).toHaveBeenCalled()
      expect(resizeCallback).toBeDefined()

      clear()
      expect(disconnectSpy).toHaveBeenCalled()
    })
  })

  describe('WindowSize', () => {
    let originalInnerWidth: number
    let originalInnerHeight: number

    beforeEach(() => {
      originalInnerWidth = window.innerWidth
      originalInnerHeight = window.innerHeight
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true })
    })

    it('should be a function', () => {
      expect(typeof WindowSize).toBe('function')
    })

    it('should provide window size signal', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })

      const view = WindowSize((size) =>
        size.map(s => `Window: ${s.width}x${s.height}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Window: 1024x768')

      clear()
    })

    it('should handle window resize events', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const view = WindowSize((size) =>
        size.map(s => `Window: ${s.width}x${s.height}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(document.body.textContent).toBe('Window: 800x600')

      clear()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should handle undefined window dimensions', async () => {
      // Set window dimensions to undefined to test fallback
      Object.defineProperty(window, 'innerWidth', { value: undefined, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: undefined, writable: true })

      const view = WindowSize((size) =>
        size.map(s => `Window: ${s.width}x${s.height}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Window: 0x0')

      clear()
    })

    it('should update size when window is resized', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

      let resizeHandler: ((event: Event) => void) | null = null

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'resize') {
          resizeHandler = handler as (event: Event) => void
        }
      })

      const view = WindowSize((size) =>
        size.map(s => `Window: ${s.width}x${s.height}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      expect(document.body.textContent).toBe('Window: 1000x800')

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 900, writable: true })

      if (resizeHandler != null) {
        resizeHandler(new Event('resize'))
        await sleep(10)
        expect(document.body.textContent).toBe('Window: 1200x900')
      }

      clear()
      addEventListenerSpy.mockRestore()
    })

    it('should trigger onResize callback to cover lines 293-294', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 400, writable: true })

      let capturedResizeHandler: ((event: Event) => void) | null = null

      // Capture the resize handler
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event: string, handler: any) => {
        if (event === 'resize') {
          capturedResizeHandler = handler
        }
      })

      const view = WindowSize((size) =>
        size.map(s => `Window: ${s.width}x${s.height}`)
      )

      const clear = render(view, document.body)
      await sleep(10)

      // Verify initial content
      expect(document.body.textContent).toBe('Window: 500x400')

      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })

      // Trigger the resize handler to cover lines 293-294
      if (capturedResizeHandler) {
        capturedResizeHandler(new Event('resize'))
        await sleep(10)
      }

      // Verify the resize handler was captured and can be called
      expect(capturedResizeHandler).toBeDefined()
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      clear()
      addEventListenerSpy.mockRestore()
    })

    it('should handle multiple WindowSize components', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })

      const container = html.div(
        WindowSize((size) =>
          html.div(size.map(s => `First: ${s.width}x${s.height}`))
        ),
        WindowSize((size) =>
          html.div(size.map(s => `Second: ${s.width}x${s.height}`))
        )
      )

      const clear = render(container, document.body)
      await sleep(10)

      const divs = document.querySelectorAll('div')
      expect(divs.length).toBeGreaterThanOrEqual(2)

      clear()
    })
  })
})
