import { describe, expect, test } from "vitest";
import { identity } from '../src/function'

describe('functions helpers', () => {
  test('identity', () => {
    expect(identity(1)).toBe(1)
    expect(identity('a')).toBe('a')
  })
})
