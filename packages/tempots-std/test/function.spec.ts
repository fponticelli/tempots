import { describe, expect, test } from "vitest";
import { id } from '../src/function'

describe('functions helpers', () => {
  test('id', () => {
    expect(id(1)).toBe(1)
    expect(id('a')).toBe('a')
  })
})
