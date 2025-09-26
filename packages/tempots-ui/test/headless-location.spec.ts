import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  makeHeadlessLocationSource,
  isAbsoluteURL,
} from '../src/renderables/router/headless-location'
import type { HeadlessContext } from '@tempots/dom'
import type { LocationData } from '../src/renderables/router/location-data'

describe('headless-location.ts', () => {
  let context: HeadlessContext
  let mockCurrentUrl: any

  beforeEach(() => {
    mockCurrentUrl = {
      value: 'http://example.com/start',
      iso: vi.fn((from: (value: string) => LocationData, to: (data: LocationData) => string) => {
        let current = from('http://example.com/start')
        return {
          get value() {
            return current
          },
          dispose: vi.fn(),
          set: vi.fn((data: LocationData) => {
            current = data
          }),
        }
      }),
    }

    context = {
      element: undefined as any,
      reference: undefined as any,
      container: {
        currentURL: mockCurrentUrl,
      },
      providers: {} as any,
      appendOrInsert: vi.fn(),
      makeChildElement: vi.fn(),
      makeChildText: vi.fn(),
      setText: vi.fn(),
      getText: vi.fn(),
      makeRef: vi.fn(),
      makePortal: vi.fn(),
      setProvider: vi.fn(),
    } as unknown as HeadlessContext
  })

  it('should identify absolute URLs', () => {
    expect(isAbsoluteURL('http://example.com')).toBe(true)
    expect(isAbsoluteURL('https://example.com')).toBe(true)
    expect(isAbsoluteURL('//cdn.example.com')).toBe(true)
    expect(isAbsoluteURL('/relative')).toBe(false)
  })

  it('should expose location source API', () => {
    const source = makeHeadlessLocationSource(context)

    expect(source.location).toBeDefined()
    expect(typeof source.commit).toBe('function')
    expect(typeof source.go).toBe('function')
    expect(typeof source.back).toBe('function')
    expect(typeof source.forward).toBe('function')

    source.dispose()
    expect(source.location.dispose).toHaveBeenCalled()
  })

  it('should commit updates through iso prop', () => {
    const source = makeHeadlessLocationSource(context)
    const next: LocationData = {
      pathname: '/headless',
      search: { q: '42' },
      hash: 'hash',
    }

    source.commit(next, undefined, 'pushState')

    expect(source.location.set).toHaveBeenCalledWith(next)
    source.dispose()
  })
})
