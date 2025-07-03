import { describe, expect, test, vi } from 'vitest'
import { style, prop, render, html } from '../src'
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
})
