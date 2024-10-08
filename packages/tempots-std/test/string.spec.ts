import { describe, expect, test } from "vitest";

import {
  lowerCaseFirst,
  upperCaseFirst,
  stringContains,
  containsAnyText,
  containsAllText,
  stringHashCode,
  capitalizeWords,
  ellipsis,
  ellipsisMiddle,
  isAlphaNum,
  humanize,
  wrapColumns,
  repeatString,
  substringAfter,
  trimCharsLeft,
  trimCharsRight,
  trimChars,
  stringToChars,
  textToLines,
  reverseString,
  countStringOccurrences,
  stringsDifferAtIndex,
  substringBefore
} from '../src/string'

describe('strings.ts', () => {
  test('LowerUpperCaseFirst', () => {
    expect('aBC').toBe(lowerCaseFirst('ABC'))
    expect('Abc').toBe(upperCaseFirst('abc'))
  })

  test('Contains', () => {
    expect(stringContains('test', '')).toBe(true)
    expect(stringContains('test', 't')).toBe(true)
    expect(stringContains('test', 'te')).toBe(true)
    expect(stringContains('test', 'tes')).toBe(true)
    expect(stringContains('test', 'test')).toBe(true)
    expect(stringContains('one two three', 'one')).toBe(true)
    expect(stringContains('one two three', 'two')).toBe(true)
    expect(stringContains('one two three', 'three')).toBe(true)
    expect(stringContains('test', 'test ')).toBe(false)
    expect(stringContains('test', ' test')).toBe(false)
    expect(stringContains('test', 'tes ')).toBe(false)
  })

  test('countTextOccurrences', () => {
    expect(3).toBe(
      countStringOccurrences('one two three four five six seven eight nine ten', 'o')
    )
    expect(2).toBe(
      countStringOccurrences('one two three four five six seven eight nine ten', 'en')
    )
    expect(3).toBe(
      countStringOccurrences('one two three four five six seven eight nine ten', ' t')
    )
    expect(2).toBe(
      countStringOccurrences('one two three four five six seven eight nine ten', 've')
    )
    expect(0).toBe(countStringOccurrences('xxxxxx', 'y'))
    expect(6).toBe(countStringOccurrences('xxxxxx', 'x'))
    expect(3).toBe(countStringOccurrences('xxxxxx', 'xx'))
    expect(2).toBe(countStringOccurrences('xxxxxx', 'xxx'))
    expect(1).toBe(countStringOccurrences('xxxxxx', 'xxxx'))
    expect(0).toBe(countStringOccurrences('x', 'xx'))
  })

  test('ContainsAny', () => {
    expect(containsAnyText('test', ['t', 'x', 'y'])).toBe(true)
    expect(containsAnyText('test', ['e', 'x', 'y'])).toBe(true)
    expect(containsAnyText('test', ['s', 'x', 'y'])).toBe(true)
    expect(containsAnyText('test', ['x', 't', 'y'])).toBe(true)
    expect(containsAnyText('test', ['x', 'e', 'y'])).toBe(true)
    expect(containsAnyText('test', ['x', 's', 'y'])).toBe(true)
    expect(containsAnyText('test', ['x', 'y', 't'])).toBe(true)
    expect(containsAnyText('test', ['x', 'y', 'e'])).toBe(true)
    expect(containsAnyText('test', ['x', 'y', 's'])).toBe(true)
    expect(containsAnyText('one two three', ['zero', 'one', 'two'])).toBe(true)
    expect(containsAnyText('one two three', ['one', 'two', 'three'])).toBe(true)
    expect(containsAnyText('one two three', ['one two', 'x', 'three'])).toBe(true)
  })

  test('ContainsAll', () => {
    expect(containsAllText('test', ['t', 's', 'e'])).toBe(true)
    expect(containsAllText('test', ['e', 'x', 'y'])).toBe(false)
    expect(containsAllText('test', ['t'])).toBe(true)
    expect(containsAllText('test', ['e'])).toBe(true)
    expect(containsAllText('test', ['s', 't'])).toBe(true)
    expect(containsAllText('test', ['x', 't'])).toBe(false)
    expect(containsAllText('one two three', ['zero', 'one', 'two'])).toBe(false)
    expect(containsAllText('one two three', ['one', 'two', 'three'])).toBe(true)
    expect(containsAllText('one two three', ['one two', 'three'])).toBe(true)
  })

  test('HashCode', () => {
    expect(stringHashCode('a')).toBe(3826002220)
    expect(stringHashCode('abc')).toBe(440920331)
    expect(stringHashCode('abcdefghijklm')).toBe(998463208)
    expect(stringHashCode('abcdefghijklM')).toBe(461579400)
    expect(stringHashCode('Abcdefghijklm')).toBe(3054447752)
    expect(
      stringHashCode(
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

  test('stringsDifferAtIndex', () => {
    expect(3).toBe(stringsDifferAtIndex('abcdef', 'abc123'))
    expect(0).toBe(stringsDifferAtIndex('', 'abc123'))
    expect(1).toBe(stringsDifferAtIndex('a', 'abc123'))
    expect(0).toBe(stringsDifferAtIndex('abc123', ''))
    expect(1).toBe(stringsDifferAtIndex('abc123', 'a'))
  })

  test('Ellipsis', () => {
    const test = 'abcdefghijkl'
    const tests = [
      { expected: 'abcdefghijkl', len: undefined, symbol: undefined },
      { expected: 'abcdefghijkl', len: 100, symbol: undefined },
      { expected: 'abcd…', len: 5, symbol: undefined },
      { expected: 'a ...', len: 5, symbol: ' ...' },
      { expected: '..', len: 2, symbol: '..' },
      { expected: 'abcdef ...', len: 10, symbol: ' ...' }
    ]
    for (const item of tests) {
      expect(ellipsis(test, item.len, item.symbol)).toBe(item.expected)
    }
  })

  test('EllipsisMiddle', () => {
    const test = 'abcdefghijkl'
    const tests = [
      { expected: 'abcdefghijkl', len: undefined, symbol: undefined },
      { expected: 'abcdefghijkl', len: 100, symbol: undefined },
      { expected: 'ab…kl', len: 5, symbol: undefined },
      { expected: 'a ...', len: 5, symbol: ' ...' },
      { expected: '..', len: 2, symbol: '..' },
      { expected: 'abc ...jkl', len: 10, symbol: ' ...' }
    ]
    for (const item of tests) { expect(ellipsisMiddle(test, item.len, item.symbol)).toBe(item.expected) }
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
    expect('XyXyXy').toBe(repeatString('Xy', 3))
  })

  test('beforeText', () => {
    expect('').toBe(substringBefore('abcdef', 'x'))
    expect('ab').toBe(substringBefore('abcdef', 'cd'))
  })

  test('afterText', () => {
    expect('').toBe(substringAfter('abcdef', 'x'))
    expect('ef').toBe(substringAfter('abcdef', 'cd'))
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
    expect(e).toEqual(stringToChars(t))
  })

  test('ToLines', () => {
    const text = `Split
to
lines`
    expect(['Split', 'to', 'lines']).toEqual(textToLines(text))
  })

  test('Reverse', () => {
    const t = 'a☺b☺☺c☺☺☺'
    const e = '☺☺☺c☺☺b☺a'
    expect(e).toEqual(reverseString(t))
  })
})
