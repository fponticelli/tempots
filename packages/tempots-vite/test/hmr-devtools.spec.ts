import { describe, it, expect, beforeEach } from 'vitest'
import {
  devtoolsRegister,
  devtoolsSignalUpdate,
  devtoolsRecordRender,
  devtoolsRecordHmr,
  devtoolsGetSignals,
  devtoolsGetRenderStats,
  devtoolsGetSignalUpdates,
  devtoolsGetHmrLog,
  devtoolsClear,
} from '../src/hmr/runtime'

describe('devtools data collection', () => {
  beforeEach(() => {
    devtoolsClear()
  })

  describe('devtoolsRegister', () => {
    it('should register a signal', () => {
      const prop = { value: 42, __hmr_label: 'count' }
      devtoolsRegister(prop as any, 'count', 'src/app.ts')

      const signals = devtoolsGetSignals()
      expect(signals).toHaveLength(1)
      expect(signals[0].label).toBe('count')
      expect(signals[0].moduleId).toBe('src/app.ts')
      expect(signals[0].prop.value).toBe(42)
    })

    it('should register multiple signals', () => {
      devtoolsRegister({ value: 1 } as any, 'a', 'mod1')
      devtoolsRegister({ value: 2 } as any, 'b', 'mod1')
      devtoolsRegister({ value: 3 } as any, 'c', 'mod2')

      const signals = devtoolsGetSignals()
      expect(signals).toHaveLength(3)
    })
  })

  describe('devtoolsSignalUpdate', () => {
    it('should record an update', () => {
      devtoolsSignalUpdate('src/app.ts:count')

      const updates = devtoolsGetSignalUpdates()
      expect(updates.get('src/app.ts:count')).toBe(1)
    })

    it('should increment on repeated updates', () => {
      devtoolsSignalUpdate('src/app.ts:count')
      devtoolsSignalUpdate('src/app.ts:count')
      devtoolsSignalUpdate('src/app.ts:count')

      const updates = devtoolsGetSignalUpdates()
      expect(updates.get('src/app.ts:count')).toBe(3)
    })
  })

  describe('devtoolsRecordRender', () => {
    it('should record a component render', () => {
      devtoolsRecordRender('./item-link', 'ItemLink', 2.5)

      const stats = devtoolsGetRenderStats()
      const key = './item-link:ItemLink'
      expect(stats.has(key)).toBe(true)
      expect(stats.get(key)!.renderCount).toBe(1)
      expect(stats.get(key)!.totalTime).toBeCloseTo(2.5)
      expect(stats.get(key)!.avgTime).toBeCloseTo(2.5)
    })

    it('should accumulate stats across renders', () => {
      devtoolsRecordRender('./comp', 'Comp', 1.0)
      devtoolsRecordRender('./comp', 'Comp', 3.0)

      const stats = devtoolsGetRenderStats()
      const s = stats.get('./comp:Comp')!
      expect(s.renderCount).toBe(2)
      expect(s.totalTime).toBeCloseTo(4.0)
      expect(s.avgTime).toBeCloseTo(2.0)
      expect(s.maxTime).toBeCloseTo(3.0)
    })
  })

  describe('devtoolsRecordHmr', () => {
    it('should record an HMR event', () => {
      devtoolsRecordHmr('item-link.ts', 30, 0.8)

      const log = devtoolsGetHmrLog()
      expect(log).toHaveLength(1)
      expect(log[0].moduleId).toBe('item-link.ts')
      expect(log[0].boundaryCount).toBe(30)
      expect(log[0].duration).toBeCloseTo(0.8)
    })

    it('should keep last 20 entries', () => {
      for (let i = 0; i < 25; i++) {
        devtoolsRecordHmr(`mod-${i}.ts`, i, i * 0.1)
      }

      const log = devtoolsGetHmrLog()
      expect(log).toHaveLength(20)
      expect(log[0].moduleId).toBe('mod-24.ts')
    })
  })

  describe('devtoolsClear', () => {
    it('should clear all data', () => {
      devtoolsRegister({ value: 1 } as any, 'a', 'mod')
      devtoolsSignalUpdate('mod:a')
      devtoolsRecordRender('./c', 'C', 1.0)
      devtoolsRecordHmr('mod.ts', 1, 0.5)

      devtoolsClear()

      expect(devtoolsGetSignals()).toHaveLength(0)
      expect(devtoolsGetSignalUpdates().size).toBe(0)
      expect(devtoolsGetRenderStats().size).toBe(0)
      expect(devtoolsGetHmrLog()).toHaveLength(0)
    })
  })
})
