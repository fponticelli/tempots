import { describe, it, expect } from 'vitest'
import type { RenderContext, HierarchicalContext, Renderable, Clear } from '../src/types'
import { makeProviderMark } from '../src/types'
import { createRenderable } from '../src/renderable'

describe('Core Types', () => {
  describe('makeProviderMark', () => {
    it('should create unique symbols', () => {
      const mark1 = makeProviderMark<string>('test')
      const mark2 = makeProviderMark<string>('test')
      
      expect(mark1).not.toBe(mark2)
      expect(typeof mark1).toBe('symbol')
      expect(typeof mark2).toBe('symbol')
    })

    it('should have correct description', () => {
      const mark = makeProviderMark<number>('MyProvider')
      expect(mark.description).toBe('MyProvider')
    })
  })

  describe('createRenderable', () => {
    it('should create a renderable object', () => {
      const TEST_TYPE = Symbol('TEST')
      const renderFn = (ctx: RenderContext): Clear => {
        return (removeTree: boolean) => {
          // Cleanup logic
        }
      }

      const renderable = createRenderable(TEST_TYPE, renderFn)

      expect(renderable.type).toBe(TEST_TYPE)
      expect(typeof renderable.render).toBe('function')
    })

    it('should call render function with context', () => {
      const TEST_TYPE = Symbol('TEST')
      let renderCalled = false
      let receivedCtx: RenderContext | null = null

      const renderFn = (ctx: RenderContext): Clear => {
        renderCalled = true
        receivedCtx = ctx
        return (removeTree: boolean) => {}
      }

      const renderable = createRenderable(TEST_TYPE, renderFn)
      
      const mockContext: RenderContext = {
        clear: (removeTree: boolean) => {}
      }

      const clear = renderable.render(mockContext)

      expect(renderCalled).toBe(true)
      expect(receivedCtx).toBe(mockContext)
      expect(typeof clear).toBe('function')
    })

    it('should return cleanup function', () => {
      const TEST_TYPE = Symbol('TEST')
      let cleanupCalled = false
      let removeTreeValue: boolean | null = null

      const renderFn = (ctx: RenderContext): Clear => {
        return (removeTree: boolean) => {
          cleanupCalled = true
          removeTreeValue = removeTree
        }
      }

      const renderable = createRenderable(TEST_TYPE, renderFn)
      
      const mockContext: RenderContext = {
        clear: (removeTree: boolean) => {}
      }

      const clear = renderable.render(mockContext)
      clear(true)

      expect(cleanupCalled).toBe(true)
      expect(removeTreeValue).toBe(true)
    })
  })

  describe('Type Guards', () => {
    it('should distinguish between different renderable types', () => {
      const DOM_TYPE = Symbol('DOM')
      const THREE_TYPE = Symbol('THREE')

      const domRenderable = createRenderable(DOM_TYPE, (ctx: RenderContext) => {
        return (removeTree: boolean) => {}
      })

      const threeRenderable = createRenderable(THREE_TYPE, (ctx: RenderContext) => {
        return (removeTree: boolean) => {}
      })

      expect(domRenderable.type).toBe(DOM_TYPE)
      expect(threeRenderable.type).toBe(THREE_TYPE)
      expect(domRenderable.type).not.toBe(threeRenderable.type)
    })
  })

  describe('HierarchicalContext', () => {
    it('should extend RenderContext', () => {
      const mockHierarchicalContext: HierarchicalContext = {
        clear: (removeTree: boolean) => {},
        makeRef: function() { return this }
      }

      expect(typeof mockHierarchicalContext.clear).toBe('function')
      expect(typeof mockHierarchicalContext.makeRef).toBe('function')
    })
  })
})

