import { describe, expect, test } from "vitest";

import {
  lowerCaseFirst,
  upperCaseFirst,
  contains,
  count,
  containsAny,
  containsAll,
  hashCode,
  capitalizeWords,
  diffIndex,
  ellipsis,
  ellipsisMiddle,
  isAlphaNum,
  humanize,
  wrapColumns,
  repeat,
  upTo,
  from,
  after,
  trimCharsLeft,
  trimCharsRight,
  trimChars,
  toArray,
  toLines,
  reverse
} from '../src/string'

describe('strings.ts', () => {
  test('LowerUpperCaseFirst', () => {
    expect('aBC').toBe(lowerCaseFirst('ABC'))
    expect('Abc').toBe(upperCaseFirst('abc'))
  })

  test('Contains', () => {
    expect(contains('test', '')).toBe(true)
    expect(contains('test', 't')).toBe(true)
    expect(contains('test', 'te')).toBe(true)
    expect(contains('test', 'tes')).toBe(true)
    expect(contains('test', 'test')).toBe(true)
    expect(contains('one two three', 'one')).toBe(true)
    expect(contains('one two three', 'two')).toBe(true)
    expect(contains('one two three', 'three')).toBe(true)
    expect(contains('test', 'test ')).toBe(false)
    expect(contains('test', ' test')).toBe(false)
    expect(contains('test', 'tes ')).toBe(false)
  })

  test('Count', () => {
    expect(3).toBe(
      count('one two three four five six seven eight nine ten', 'o')
    )
    expect(2).toBe(
      count('one two three four five six seven eight nine ten', 'en')
    )
    expect(3).toBe(
      count('one two three four five six seven eight nine ten', ' t')
    )
    expect(2).toBe(
      count('one two three four five six seven eight nine ten', 've')
    )
    expect(0).toBe(count('xxxxxx', 'y'))
    expect(6).toBe(count('xxxxxx', 'x'))
    expect(3).toBe(count('xxxxxx', 'xx'))
    expect(2).toBe(count('xxxxxx', 'xxx'))
    expect(1).toBe(count('xxxxxx', 'xxxx'))
    expect(0).toBe(count('x', 'xx'))
  })

  test('ContainsAny', () => {
    expect(containsAny('test', ['t', 'x', 'y'])).toBe(true)
    expect(containsAny('test', ['e', 'x', 'y'])).toBe(true)
    expect(containsAny('test', ['s', 'x', 'y'])).toBe(true)
    expect(containsAny('test', ['x', 't', 'y'])).toBe(true)
    expect(containsAny('test', ['x', 'e', 'y'])).toBe(true)
    expect(containsAny('test', ['x', 's', 'y'])).toBe(true)
    expect(containsAny('test', ['x', 'y', 't'])).toBe(true)
    expect(containsAny('test', ['x', 'y', 'e'])).toBe(true)
    expect(containsAny('test', ['x', 'y', 's'])).toBe(true)
    expect(containsAny('one two three', ['zero', 'one', 'two'])).toBe(true)
    expect(containsAny('one two three', ['one', 'two', 'three'])).toBe(true)
    expect(containsAny('one two three', ['one two', 'x', 'three'])).toBe(true)
  })

  test('ContainsAll', () => {
    expect(containsAll('test', ['t', 's', 'e'])).toBe(true)
    expect(containsAll('test', ['e', 'x', 'y'])).toBe(false)
    expect(containsAll('test', ['t'])).toBe(true)
    expect(containsAll('test', ['e'])).toBe(true)
    expect(containsAll('test', ['s', 't'])).toBe(true)
    expect(containsAll('test', ['x', 't'])).toBe(false)
    expect(containsAll('one two three', ['zero', 'one', 'two'])).toBe(false)
    expect(containsAll('one two three', ['one', 'two', 'three'])).toBe(true)
    expect(containsAll('one two three', ['one two', 'three'])).toBe(true)
  })

  test('HashCode', () => {
    expect(hashCode('a')).toBe(3826002220)
    expect(hashCode('abc')).toBe(440920331)
    expect(hashCode('abcdefghijklm')).toBe(998463208)
    expect(hashCode('abcdefghijklM')).toBe(461579400)
    expect(hashCode('Abcdefghijklm')).toBe(3054447752)
    expect(
      hashCode(
        'abcdefghijklmabcdefghijklmabcdefghijklmabcdefghijklmabcdefghijklm!!'
      )
    ).toBe(3846459698)
  })

  test('Ucwordsws', () => {
    const tests = [
      { expected: 'Test', test: 'test' },
      { expected: 'Test Test', test: 'test test' },
      { expected: ' Test Test  Test ', test: ' test test  test ' },
      { expected: 'Test\nTest', test: 'test\ntest' },
      { expected: 'Test\tTest', test: 'test\ttest' }
    ]
    for (const item of tests) { expect(capitalizeWords(item.test, true)).toBe(item.expected) }
  })

  test('diffIndex', () => {
    expect(3).toBe(diffIndex('abcdef', 'abc123'))
    expect(0).toBe(diffIndex('', 'abc123'))
    expect(1).toBe(diffIndex('a', 'abc123'))
    expect(0).toBe(diffIndex('abc123', ''))
    expect(1).toBe(diffIndex('abc123', 'a'))
  })

  test('Ellipsis', () => {
    const test = 'abcdefghijkl'
    const tests = [
      { expected: 'abcdefghijkl', len: undefined, symbol: undefined },
      { expected: 'abcdefghijkl', len: 100, symbol: undefined },
      { expected: 'abcd…', len: 5, symbol: undefined },
      { expected: 'a ...', len: 5, symbol: ' ...' },
      { expected: '..', len: 2, symbol: ' ...' },
      { expected: 'abcdef ...', len: 10, symbol: ' ...' }
    ]
    for (const item of tests) { expect(item.expected).toBe(ellipsis(test, item.len, item.symbol)) }
  })

  test('EllipsisMiddle', () => {
    const test = 'abcdefghijkl'
    const tests = [
      { expected: 'abcdefghijkl', len: undefined, symbol: undefined },
      { expected: 'abcdefghijkl', len: 100, symbol: undefined },
      { expected: 'ab…kl', len: 5, symbol: undefined },
      { expected: 'a ...', len: 5, symbol: ' ...' },
      { expected: '..', len: 2, symbol: ' ...' },
      { expected: 'abc ...jkl', len: 10, symbol: ' ...' }
    ]
    for (const item of tests) { expect(item.expected).toBe(ellipsisMiddle(test, item.len, item.symbol)) }
  })

  test('Ucwords', () => {
    const tests = [
      { expected: 'Test', test: 'test' },
      { expected: 'Test Test', test: 'test test' },
      {
        expected: ' Test-Test:Test_Test : Test ',
        test: ' test-test:test_test : test '
      },
      { expected: 'Test\nTest', test: 'test\ntest' },
      { expected: 'Test\tTest', test: 'test\ttest' }
    ]
    for (const item of tests) { expect(capitalizeWords(item.test)).toBe(item.expected) }
  })

  test('AlphaNum', () => {
    const tests = [
      { expected: true, test: 'a' },
      { expected: true, test: '1a' },
      { expected: false, test: ' a' },
      { expected: false, test: ' ' },
      { expected: false, test: '' }
    ]
    for (const item of tests) expect(item.expected).toBe(isAlphaNum(item.test))
  })

  test('Humanize', () => {
    expect(humanize('helloWorld')).toBe('hello world')
    expect(humanize('my_long_string')).toBe('my long string')
    expect(humanize('ignoreMANY')).toBe('ignore many')
  })

  test('WrapColumn', () => {
    const text =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    expect(
      `Lorem ipsum dolor
sit amet,
consectetur
adipisicing elit,
sed do eiusmod
tempor incididunt ut
labore et dolore
magna aliqua. Ut
enim ad minim
veniam, quis nostrud
exercitation ullamco
laboris nisi ut
aliquip ex ea
commodo consequat.`
    ).toBe(wrapColumns(text, 20))

    expect(
      `    Lorem ipsum
    dolor sit amet,
    consectetur
    adipisicing
    elit, sed do
    eiusmod tempor
    incididunt ut
    labore et dolore
    magna aliqua. Ut
    enim ad minim
    veniam, quis
    nostrud
    exercitation
    ullamco laboris
    nisi ut aliquip
    ex ea commodo
    consequat.`
    ).toBe(wrapColumns(text, 20, '    '))
  })

  test('WrapColumnPreserveNewLines', () => {
    const text = 'Lorem ipsum dolor sit amet,\n\nconsectetur adipisicing elit'
    expect(
      'Lorem ipsum dolor\nsit amet,\n\nconsectetur\nadipisicing elit'
    ).toBe(wrapColumns(text, 18))
  })

  test('WrapColumnLong', () => {
    const text = 'aaaaaaaaaa aaaa aaa aa'
    expect(
      `aaaaaaaaaa
aaaa
aaa aa`
    ).toBe(wrapColumns(text, 6))
  })

  test('Repeat', () => {
    expect('XyXyXy').toBe(repeat('Xy', 3))
  })

  test('UpTo', () => {
    expect('abcdef').toBe(upTo('abcdef', 'x'))
    expect('ab').toBe(upTo('abcdef', 'cd'))
  })

  test('From', () => {
    expect('').toBe(from('abcdef', 'x'))
    expect('cdef').toBe(from('abcdef', 'cd'))
  })

  test('After', () => {
    expect('').toBe(after('abcdef', 'x'))
    expect('ef').toBe(after('abcdef', 'cd'))
  })

  test('Ltrim', () => {
    expect('abcde').toBe(trimCharsLeft('abcde', 'x'))
    expect('de').toBe(trimCharsLeft('abcde', 'cba'))
    expect('abcde').toBe(trimCharsLeft('abcde', 'b'))

    expect('').toBe(trimCharsLeft('/', '/'))
  })

  test('Rtrim', () => {
    expect('abcde').toBe(trimCharsRight('abcde', 'x'))
    expect('ab').toBe(trimCharsRight('abcde', 'ced'))
    expect('abcde').toBe(trimCharsRight('abcde', 'd'))

    expect('').toBe(trimCharsRight('/', '/'))
  })

  test('Trim', () => {
    expect('abcde').toBe(trimChars('abcde', 'x'))
    expect('cd').toBe(trimChars('abcde', 'abe'))
    expect('abcde').toBe(trimChars('abcde', 'bd'))

    expect('').toBe(trimChars('/', '/'))
  })

  test('ToArray', () => {
    const t = 'a☺b☺☺c☺☺☺'
    const e = ['a', '☺', 'b', '☺', '☺', 'c', '☺', '☺', '☺']
    expect(e).toEqual(toArray(t))
  })

  test('ToLines', () => {
    const text = `Split
to
lines`
    expect(['Split', 'to', 'lines']).toEqual(toLines(text))
  })

  test('Reverse', () => {
    const t = 'a☺b☺☺c☺☺☺'
    const e = '☺☺☺c☺☺b☺a'
    expect(e).toEqual(reverse(t))
  })
})
