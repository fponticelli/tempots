import { describe, expect, test } from 'vitest'
import { ProviderNotFoundError } from '../src/dom/errors'
import { ProviderMark } from '../src/types/domain'
import { makeProviderMark } from '../src';

describe('Errors', () => {
  describe('ProviderNotFoundError', () => {
    test('should create error with provider mark description', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('TestProvider')

      const error = new ProviderNotFoundError(mark)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ProviderNotFoundError)
      expect(error.message).toBe('Provider not found: TestProvider')
    })

    test('should handle provider mark with complex description', () => {
      const mark: ProviderMark<{ config: string }> = makeProviderMark<{ config: string }>('ConfigProvider<DatabaseConfig>')

      const error = new ProviderNotFoundError(mark)

      expect(error.message).toBe('Provider not found: ConfigProvider<DatabaseConfig>')
    })

    test('should handle provider mark with empty description', () => {
      const mark: ProviderMark<unknown> = makeProviderMark<unknown>('')

      const error = new ProviderNotFoundError(mark)

      expect(error.message).toBe('Provider not found: ')
    })

    test('should be throwable and catchable', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('ThrowableProvider')

      expect(() => {
        throw new ProviderNotFoundError(mark)
      }).toThrow(ProviderNotFoundError)

      expect(() => {
        throw new ProviderNotFoundError(mark)
      }).toThrow('Provider not found: ThrowableProvider')
    })

    test('should maintain error stack trace', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('StackTraceProvider')

      const error = new ProviderNotFoundError(mark)

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('Provider not found: StackTraceProvider')
    })
  })
});
