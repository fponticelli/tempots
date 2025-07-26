import { describe, expect, test, vi } from 'vitest'
import { style, prop, render, html, Clear } from '../src'
const { div } = html

describe('Style', () => {
  test('should create static style renderable', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const styleRenderable = style.color('red')

    // Create a mock DOM context
    const mockContext = {
      getStyle: vi.fn().mockReturnValue(''),
      setStyle: vi.fn(),
    }

    const dispose = styleRenderable(mockContext as any)

    expect(mockContext.getStyle).toHaveBeenCalledWith('color')
    expect(mockContext.setStyle).toHaveBeenCalledWith('color', 'red')

    // Test disposal with removeTree = true
    dispose(true)
    expect(mockContext.setStyle).toHaveBeenCalledWith('color', '')

    document.body.removeChild(element)
  })

  test('should create signal style renderable', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const colorSignal = prop('blue')
    const styleRenderable = style.backgroundColor(colorSignal)

    // Create a mock DOM context
    const mockContext = {
      getStyle: vi.fn().mockReturnValue('white'),
      setStyle: vi.fn(),
    }

    const dispose = styleRenderable(mockContext as any)

    expect(mockContext.getStyle).toHaveBeenCalledWith('backgroundColor')

    // Signal should trigger style update
    colorSignal.set('green')
    expect(mockContext.setStyle).toHaveBeenCalledWith('backgroundColor', 'green')

    // Test disposal with removeTree = true
    dispose(true)
    expect(mockContext.setStyle).toHaveBeenCalledWith('backgroundColor', 'white')

    document.body.removeChild(element)
  })

  test('should handle disposal with removeTree = false for static style', () => {
    const mockContext = {
      getStyle: vi.fn().mockReturnValue('initial'),
      setStyle: vi.fn(),
    }

    const styleRenderable = style.fontSize('16px')
    const dispose = styleRenderable(mockContext as any)

    // Test disposal with removeTree = false
    dispose(false)

    // setStyle should not be called again for restoration
    expect(mockContext.setStyle).toHaveBeenCalledTimes(1) // Only the initial set
    expect(mockContext.setStyle).toHaveBeenCalledWith('fontSize', '16px')
  })

  test('should handle disposal with removeTree = false for signal style', () => {
    const colorSignal = prop('red')
    const mockContext = {
      getStyle: vi.fn().mockReturnValue('initial'),
      setStyle: vi.fn(),
    }

    const styleRenderable = style.color(colorSignal)
    const dispose = styleRenderable(mockContext as any)

    // Trigger signal update
    colorSignal.set('blue')

    // Test disposal with removeTree = false
    dispose(false)

    // setStyle should not be called for restoration
    const setStyleCalls = mockContext.setStyle.mock.calls
    expect(setStyleCalls).not.toContainEqual(['color', 'initial'])
  })

  test('should work with various CSS properties', () => {
    const mockContext = {
      getStyle: vi.fn().mockReturnValue(''),
      setStyle: vi.fn(),
    }

    // Test different CSS properties
    const marginStyle = style.margin('10px')
    const paddingStyle = style.padding('5px')
    const displayStyle = style.display('flex')

    marginStyle(mockContext as any)
    paddingStyle(mockContext as any)
    displayStyle(mockContext as any)

    expect(mockContext.setStyle).toHaveBeenCalledWith('margin', '10px')
    expect(mockContext.setStyle).toHaveBeenCalledWith('padding', '5px')
    expect(mockContext.setStyle).toHaveBeenCalledWith('display', 'flex')
  })

  test('should work in a real DOM context', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const colorSignal = prop('red')

    render(
      div(
        style.color('blue'),
        style.backgroundColor(colorSignal),
        'Test content'
      ),
      element
    )

    const divElement = element.querySelector('div')
    expect(divElement).toBeTruthy()
    expect(divElement!.style.color).toBe('blue')
    expect(divElement!.style.backgroundColor).toBe('red')

    // Update signal
    colorSignal.set('green')
    expect(divElement!.style.backgroundColor).toBe('green')

    document.body.removeChild(element)
  })

  test('should preserve original style values on disposal', () => {
    const element = document.createElement('div')
    element.style.color = 'original-color'
    document.body.appendChild(element)

    const mockContext = {
      getStyle: vi.fn().mockReturnValue('original-color'),
      setStyle: vi.fn(),
    }

    const styleRenderable = style.color('new-color')
    const dispose = styleRenderable(mockContext as any)

    expect(mockContext.getStyle).toHaveBeenCalledWith('color')
    expect(mockContext.setStyle).toHaveBeenCalledWith('color', 'new-color')

    // Dispose and restore original
    dispose(true)
    expect(mockContext.setStyle).toHaveBeenCalledWith('color', 'original-color')

    document.body.removeChild(element)
  })

  describe('Signal Style Memory Leak Tests', () => {
    test('should cleanup signal subscription on disposal (removeTree: true)', () => {
      const colorSignal = prop('red')
      const mockContext = {
        getStyle: vi.fn().mockReturnValue('initial'),
        setStyle: vi.fn(),
      }

      const styleRenderable = style.color(colorSignal)
      const dispose = styleRenderable(mockContext as any)

      // Initial setup should work
      expect(mockContext.setStyle).toHaveBeenCalledWith('color', 'red')
      mockContext.setStyle.mockClear()

      // Dispose the renderable
      dispose(true)

      // After disposal, changing the signal should NOT trigger style updates
      colorSignal.set('blue')

      // This test will FAIL with the current broken implementation
      // because the signal subscription is not cleaned up
      expect(mockContext.setStyle).not.toHaveBeenCalledWith('color', 'blue')
    })

    test('should cleanup signal subscription on disposal (removeTree: false)', () => {
      const colorSignal = prop('red')
      const mockContext = {
        getStyle: vi.fn().mockReturnValue('initial'),
        setStyle: vi.fn(),
      }

      const styleRenderable = style.color(colorSignal)
      const dispose = styleRenderable(mockContext as any)

      // Initial setup should work
      expect(mockContext.setStyle).toHaveBeenCalledWith('color', 'red')
      mockContext.setStyle.mockClear()

      // Dispose the renderable with removeTree: false
      dispose(false)

      // After disposal, changing the signal should NOT trigger style updates
      colorSignal.set('green')

      // This test will FAIL with the current broken implementation
      expect(mockContext.setStyle).not.toHaveBeenCalledWith('color', 'green')
    })

    test('should prevent memory leaks by cleaning up signal references', () => {
      const colorSignal = prop('initial')
      const mockContext = {
        getStyle: vi.fn().mockReturnValue(''),
        setStyle: vi.fn(),
      }

      // Create and dispose multiple style renderables
      const renderables = [] as Clear[]
      for (let i = 0; i < 5; i++) {
        const styleRenderable = style.color(colorSignal)
        const dispose = styleRenderable(mockContext as any)
        renderables.push(dispose)
      }

      // Dispose all renderables (this will trigger restoration calls)
      renderables.forEach(dispose => dispose(true))

      // Clear the mock AFTER disposal to focus on post-disposal behavior
      mockContext.setStyle.mockClear()

      // After all disposals, signal changes should not trigger any style updates
      colorSignal.set('leaked-color')

      // This test will FAIL with the current broken implementation
      // because all 5 signal subscriptions are still active
      expect(mockContext.setStyle).not.toHaveBeenCalled()
    })

    test('should handle rapid signal changes after disposal gracefully', () => {
      const colorSignal = prop('red')
      const mockContext = {
        getStyle: vi.fn().mockReturnValue('initial'),
        setStyle: vi.fn(),
      }

      const styleRenderable = style.color(colorSignal)
      const dispose = styleRenderable(mockContext as any)

      // Dispose immediately
      dispose(true)
      mockContext.setStyle.mockClear()

      // Rapid signal changes should not cause any style updates
      colorSignal.set('blue')
      colorSignal.set('green')
      colorSignal.set('yellow')
      colorSignal.set('purple')

      // This test will FAIL with the current broken implementation
      expect(mockContext.setStyle).not.toHaveBeenCalled()
    })

    test('should not interfere with other active signal styles when one is disposed', () => {
      const colorSignal = prop('red')
      const mockContext1 = {
        getStyle: vi.fn().mockReturnValue(''),
        setStyle: vi.fn(),
      }
      const mockContext2 = {
        getStyle: vi.fn().mockReturnValue(''),
        setStyle: vi.fn(),
      }

      // Create two style renderables with the same signal
      const styleRenderable1 = style.color(colorSignal)
      const dispose1 = styleRenderable1(mockContext1 as any)

      const styleRenderable2 = style.color(colorSignal)
      const dispose2 = styleRenderable2(mockContext2 as any)

      // Both should receive initial value
      expect(mockContext1.setStyle).toHaveBeenCalledWith('color', 'red')
      expect(mockContext2.setStyle).toHaveBeenCalledWith('color', 'red')

      // Clear mocks
      mockContext1.setStyle.mockClear()
      mockContext2.setStyle.mockClear()

      // Dispose only the first one
      dispose1(true)

      // Change signal - only the second context should be updated
      colorSignal.set('blue')

      // This test will PASS even with the broken implementation
      // but it's important to verify the fix doesn't break this behavior
      expect(mockContext1.setStyle).not.toHaveBeenCalledWith('color', 'blue')
      expect(mockContext2.setStyle).toHaveBeenCalledWith('color', 'blue')

      // Cleanup
      dispose2(true)
    })
  })
})
