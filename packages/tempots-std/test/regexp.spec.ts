import { describe, expect, test } from "vitest";
import { map } from '../src/regexp'

describe('regexps.ts', () => {
  test('Map with non-global pattern', () => {
    const pattern = /xx|yyy/
    expect(map('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(map('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(map('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(map('x', pattern, v => v.toUpperCase())).toBe('x')
  })

  test('Map with global pattern', () => {
    const pattern = /xx|yyy/g
    expect(map('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(map('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(map('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(map('x', pattern, v => v.toUpperCase())).toBe('x')
  })
})
