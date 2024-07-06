import { id } from '../src/functions'
import { describe, expect, test } from 'vitest'

describe('functions helpers', () => {
  test(`id`, () => {
    expect(id(1)).toBe(1)
    expect(id('a')).toBe('a')
  })
})
