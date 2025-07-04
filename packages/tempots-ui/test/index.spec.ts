import { describe, it, expect } from 'vitest'
import * as ui from '../src/index'

describe('index.ts exports', () => {
  it('should export main modules', () => {
    // DOM utilities
    expect(ui.handleAnchorClick).toBeDefined()

    // Main renderables that we've tested
    expect(ui.Anchor).toBeDefined()
    expect(ui.Appearance).toBeDefined()
    expect(ui.AsyncResultView).toBeDefined()
    expect(ui.ResultView).toBeDefined()

    // Router
    expect(ui.Location).toBeDefined()
    expect(ui.setLocationFromUrl).toBeDefined()

    // Utils
    expect(ui.relativeTime).toBeDefined()
    expect(ui.Resource).toBeDefined()
    expect(ui.ticker).toBeDefined()
  })

  it('should export types', () => {
    // Check that the module exports exist (functions/classes)
    expect(typeof ui.handleAnchorClick).toBe('function')
    expect(typeof ui.Anchor).toBe('function')
    expect(typeof ui.AsyncResultView).toBe('function')
    expect(typeof ui.ResultView).toBe('function')
  })
})
