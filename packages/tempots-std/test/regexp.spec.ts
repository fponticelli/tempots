import { describe, expect, test } from "vitest";
import { mapRegExp } from '../src/regexp'

describe('regexps.ts', () => {
  test('Map with non-global pattern', () => {
    const pattern = /xx|yyy/
    expect(mapRegExp('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(mapRegExp('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(mapRegExp('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(mapRegExp('x', pattern, v => v.toUpperCase())).toBe('x')
  })

  test('Map with global pattern', () => {
    const pattern = /xx|yyy/g
    expect(mapRegExp('axxbbyyyc', pattern, v => v.toUpperCase())).toBe('aXXbbYYYc')
    expect(mapRegExp('xxbbyyy', pattern, v => v.toUpperCase())).toBe('XXbbYYY')
    expect(mapRegExp('xx', pattern, v => v.toUpperCase())).toBe('XX')
    expect(mapRegExp('x', pattern, v => v.toUpperCase())).toBe('x')
  })
})
