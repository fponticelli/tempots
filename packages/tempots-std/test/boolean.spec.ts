import { describe, expect, test } from "vitest";
import {
  compareBooleans,
  booleanToInt,
  canParseBoolean,
  parseBoolean,
  xorBoolean,
} from '../src/boolean';
import { ParsingError } from '../src/error';

describe('Boolean utilities', () => {
  describe('compareBooleans', () => {
    test('returns 0 when both values are equal', () => {
      expect(compareBooleans(true, true)).toBe(0);
      expect(compareBooleans(false, false)).toBe(0);
    });

    test('returns -1 when first is true and second is false', () => {
      expect(compareBooleans(true, false)).toBe(-1);
    });

    test('returns 1 when first is false and second is true', () => {
      expect(compareBooleans(false, true)).toBe(1);
    });
  });

  describe('booleanToInt', () => {
    test('converts true to 1', () => {
      expect(booleanToInt(true)).toBe(1);
    });

    test('converts false to 0', () => {
      expect(booleanToInt(false)).toBe(0);
    });
  });

  describe('canParseBoolean', () => {
    test('returns true for valid boolean strings (case insensitive)', () => {
      // true values
      expect(canParseBoolean('true')).toBe(true);
      expect(canParseBoolean('TRUE')).toBe(true);
      expect(canParseBoolean('True')).toBe(true);
      expect(canParseBoolean('1')).toBe(true);
      expect(canParseBoolean('on')).toBe(true);
      expect(canParseBoolean('ON')).toBe(true);
      expect(canParseBoolean('On')).toBe(true);

      // false values
      expect(canParseBoolean('false')).toBe(true);
      expect(canParseBoolean('FALSE')).toBe(true);
      expect(canParseBoolean('False')).toBe(true);
      expect(canParseBoolean('0')).toBe(true);
      expect(canParseBoolean('off')).toBe(true);
      expect(canParseBoolean('OFF')).toBe(true);
      expect(canParseBoolean('Off')).toBe(true);
    });

    test('returns false for invalid boolean strings', () => {
      expect(canParseBoolean('yes')).toBe(false);
      expect(canParseBoolean('no')).toBe(false);
      expect(canParseBoolean('2')).toBe(false);
      expect(canParseBoolean('-1')).toBe(false);
      expect(canParseBoolean('maybe')).toBe(false);
      expect(canParseBoolean('')).toBe(false);
      expect(canParseBoolean('  ')).toBe(false);
      expect(canParseBoolean('truee')).toBe(false);
      expect(canParseBoolean('falsee')).toBe(false);
    });

    test('returns false for null input', () => {
      expect(canParseBoolean(null as any)).toBe(false);
    });
  });

  describe('parseBoolean', () => {
    test('parses true values correctly (case insensitive)', () => {
      expect(parseBoolean('true')).toBe(true);
      expect(parseBoolean('TRUE')).toBe(true);
      expect(parseBoolean('True')).toBe(true);
      expect(parseBoolean('1')).toBe(true);
      expect(parseBoolean('on')).toBe(true);
      expect(parseBoolean('ON')).toBe(true);
      expect(parseBoolean('On')).toBe(true);
    });

    test('parses false values correctly (case insensitive)', () => {
      expect(parseBoolean('false')).toBe(false);
      expect(parseBoolean('FALSE')).toBe(false);
      expect(parseBoolean('False')).toBe(false);
      expect(parseBoolean('0')).toBe(false);
      expect(parseBoolean('off')).toBe(false);
      expect(parseBoolean('OFF')).toBe(false);
      expect(parseBoolean('Off')).toBe(false);
    });

    test('throws ParsingError for invalid values', () => {
      expect(() => parseBoolean('yes')).toThrow(ParsingError);
      expect(() => parseBoolean('no')).toThrow(ParsingError);
      expect(() => parseBoolean('2')).toThrow(ParsingError);
      expect(() => parseBoolean('-1')).toThrow(ParsingError);
      expect(() => parseBoolean('maybe')).toThrow(ParsingError);
      expect(() => parseBoolean('')).toThrow(ParsingError);
      expect(() => parseBoolean('  ')).toThrow(ParsingError);
      expect(() => parseBoolean('truee')).toThrow(ParsingError);
      expect(() => parseBoolean('falsee')).toThrow(ParsingError);
    });

    test('throws ParsingError with descriptive message', () => {
      expect(() => parseBoolean('invalid')).toThrow("unable to parse 'invalid' to boolean");
    });
  });

  describe('xorBoolean', () => {
    test('returns true when values are different', () => {
      expect(xorBoolean(true, false)).toBe(true);
      expect(xorBoolean(false, true)).toBe(true);
    });

    test('returns false when values are the same', () => {
      expect(xorBoolean(true, true)).toBe(false);
      expect(xorBoolean(false, false)).toBe(false);
    });
  });
});
