import { describe, expect, test } from "vitest";
import {
  biCeilDiv,
  biFloorDiv,
  biCompare,
  biAbs,
  biMin,
  biMax,
  biPow,
  biGcd,
  biLcm,
  biIsPrime,
  biNextPrime,
  biPrevPrime,
  biIsEven,
  biIsOdd,
  biIsZero,
  biIsOne,
  biIsNegative,
  biIsPositive,
} from '../src/bigint';
import { ArgumentError } from '../src/error';

describe('BigInt utilities', () => {
  describe('biCeilDiv', () => {
    test('performs ceiling division for positive numbers', () => {
      expect(biCeilDiv(7n, 3n)).toBe(3n);
      expect(biCeilDiv(6n, 3n)).toBe(2n);
      expect(biCeilDiv(8n, 3n)).toBe(3n);
      expect(biCeilDiv(1n, 3n)).toBe(1n);
    });

    test('performs ceiling division for negative dividend', () => {
      expect(biCeilDiv(-7n, 3n)).toBe(-2n);
      expect(biCeilDiv(-6n, 3n)).toBe(-2n);
      expect(biCeilDiv(-8n, 3n)).toBe(-2n);
    });

    test('performs ceiling division for negative divisor', () => {
      expect(biCeilDiv(7n, -3n)).toBe(-2n);
      expect(biCeilDiv(6n, -3n)).toBe(-2n);
      expect(biCeilDiv(8n, -3n)).toBe(-2n);
    });

    test('performs ceiling division for both negative', () => {
      expect(biCeilDiv(-7n, -3n)).toBe(3n);
      expect(biCeilDiv(-6n, -3n)).toBe(2n);
      expect(biCeilDiv(-8n, -3n)).toBe(3n);
    });

    test('handles zero dividend', () => {
      expect(biCeilDiv(0n, 3n)).toBe(0n);
      expect(biCeilDiv(0n, -3n)).toBe(0n);
    });
  });

  describe('biFloorDiv', () => {
    test('performs floor division for positive numbers', () => {
      expect(biFloorDiv(7n, 3n)).toBe(2n);
      expect(biFloorDiv(6n, 3n)).toBe(2n);
      expect(biFloorDiv(8n, 3n)).toBe(2n);
      expect(biFloorDiv(1n, 3n)).toBe(0n);
    });

    test('performs floor division for negative dividend', () => {
      expect(biFloorDiv(-7n, 3n)).toBe(-3n);
      expect(biFloorDiv(-6n, 3n)).toBe(-2n);
      expect(biFloorDiv(-8n, 3n)).toBe(-3n);
    });

    test('performs floor division for negative divisor', () => {
      expect(biFloorDiv(7n, -3n)).toBe(-3n);
      expect(biFloorDiv(6n, -3n)).toBe(-2n);
      expect(biFloorDiv(8n, -3n)).toBe(-3n);
    });

    test('performs floor division for both negative', () => {
      expect(biFloorDiv(-7n, -3n)).toBe(2n);
      expect(biFloorDiv(-6n, -3n)).toBe(2n);
      expect(biFloorDiv(-8n, -3n)).toBe(2n);
    });

    test('handles zero dividend', () => {
      expect(biFloorDiv(0n, 3n)).toBe(0n);
      expect(biFloorDiv(0n, -3n)).toBe(0n);
    });
  });

  describe('biCompare', () => {
    test('returns negative when first is less than second', () => {
      expect(biCompare(5n, 10n)).toBe(-1);
      expect(biCompare(-10n, -5n)).toBe(-1);
      expect(biCompare(-5n, 5n)).toBe(-1);
    });

    test('returns positive when first is greater than second', () => {
      expect(biCompare(10n, 5n)).toBe(1);
      expect(biCompare(-5n, -10n)).toBe(1);
      expect(biCompare(5n, -5n)).toBe(1);
    });

    test('returns zero when values are equal', () => {
      expect(biCompare(5n, 5n)).toBe(0);
      expect(biCompare(-5n, -5n)).toBe(0);
      expect(biCompare(0n, 0n)).toBe(0);
    });
  });

  describe('biAbs', () => {
    test('returns positive value for positive input', () => {
      expect(biAbs(5n)).toBe(5n);
      expect(biAbs(100n)).toBe(100n);
    });

    test('returns positive value for negative input', () => {
      expect(biAbs(-5n)).toBe(5n);
      expect(biAbs(-100n)).toBe(100n);
    });

    test('returns zero for zero input', () => {
      expect(biAbs(0n)).toBe(0n);
    });
  });

  describe('biMin', () => {
    test('returns smaller of two positive values', () => {
      expect(biMin(5n, 10n)).toBe(5n);
      expect(biMin(10n, 5n)).toBe(5n);
    });

    test('returns smaller of two negative values', () => {
      expect(biMin(-5n, -10n)).toBe(-10n);
      expect(biMin(-10n, -5n)).toBe(-10n);
    });

    test('returns negative when comparing positive and negative', () => {
      expect(biMin(5n, -10n)).toBe(-10n);
      expect(biMin(-5n, 10n)).toBe(-5n);
    });

    test('returns same value when equal', () => {
      expect(biMin(5n, 5n)).toBe(5n);
    });
  });

  describe('biMax', () => {
    test('returns larger of two positive values', () => {
      expect(biMax(5n, 10n)).toBe(10n);
      expect(biMax(10n, 5n)).toBe(10n);
    });

    test('returns larger of two negative values', () => {
      expect(biMax(-5n, -10n)).toBe(-5n);
      expect(biMax(-10n, -5n)).toBe(-5n);
    });

    test('returns positive when comparing positive and negative', () => {
      expect(biMax(5n, -10n)).toBe(5n);
      expect(biMax(-5n, 10n)).toBe(10n);
    });

    test('returns same value when equal', () => {
      expect(biMax(5n, 5n)).toBe(5n);
    });
  });

  describe('biPow', () => {
    test('calculates power correctly for positive base and exponent', () => {
      expect(biPow(2n, 3n)).toBe(8n);
      expect(biPow(5n, 2n)).toBe(25n);
      expect(biPow(10n, 0n)).toBe(1n);
      expect(biPow(7n, 1n)).toBe(7n);
    });

    test('calculates power correctly for negative base', () => {
      expect(biPow(-2n, 3n)).toBe(-8n);
      expect(biPow(-2n, 2n)).toBe(4n);
      expect(biPow(-5n, 0n)).toBe(1n);
    });

    test('throws error for negative exponent', () => {
      expect(() => biPow(2n, -1n)).toThrow(ArgumentError);
      expect(() => biPow(5n, -3n)).toThrow(ArgumentError);
    });

    test('handles large exponents efficiently', () => {
      expect(biPow(2n, 10n)).toBe(1024n);
      expect(biPow(3n, 5n)).toBe(243n);
    });
  });

  describe('biGcd', () => {
    test('calculates GCD for positive numbers', () => {
      expect(biGcd(12n, 8n)).toBe(4n);
      expect(biGcd(48n, 18n)).toBe(6n);
      expect(biGcd(7n, 5n)).toBe(1n);
      expect(biGcd(100n, 25n)).toBe(25n);
    });

    test('calculates GCD with negative numbers', () => {
      expect(biGcd(-12n, 8n)).toBe(4n);
      expect(biGcd(12n, -8n)).toBe(4n);
      expect(biGcd(-12n, -8n)).toBe(4n);
    });

    test('calculates GCD with zero', () => {
      expect(biGcd(0n, 5n)).toBe(5n);
      expect(biGcd(5n, 0n)).toBe(5n);
      expect(biGcd(0n, 0n)).toBe(0n);
    });

    test('calculates GCD when one number divides the other', () => {
      expect(biGcd(15n, 5n)).toBe(5n);
      expect(biGcd(5n, 15n)).toBe(5n);
    });
  });

  describe('biLcm', () => {
    test('calculates LCM for positive numbers', () => {
      expect(biLcm(12n, 8n)).toBe(24n);
      expect(biLcm(4n, 6n)).toBe(12n);
      expect(biLcm(7n, 5n)).toBe(35n);
    });

    test('calculates LCM with negative numbers', () => {
      expect(biLcm(-12n, 8n)).toBe(24n);
      expect(biLcm(12n, -8n)).toBe(24n);
      expect(biLcm(-12n, -8n)).toBe(24n);
    });

    test('calculates LCM when one number divides the other', () => {
      expect(biLcm(15n, 5n)).toBe(15n);
      expect(biLcm(5n, 15n)).toBe(15n);
    });
  });

  describe('biIsPrime', () => {
    test('returns false for numbers less than 2', () => {
      expect(biIsPrime(0n)).toBe(false);
      expect(biIsPrime(1n)).toBe(false);
      expect(biIsPrime(-5n)).toBe(false);
    });

    test('returns true for small primes', () => {
      expect(biIsPrime(2n)).toBe(true);
      expect(biIsPrime(3n)).toBe(true);
      expect(biIsPrime(5n)).toBe(true);
      expect(biIsPrime(7n)).toBe(true);
      expect(biIsPrime(11n)).toBe(true);
      expect(biIsPrime(13n)).toBe(true);
    });

    test('returns false for composite numbers', () => {
      expect(biIsPrime(4n)).toBe(false);
      expect(biIsPrime(6n)).toBe(false);
      expect(biIsPrime(8n)).toBe(false);
      expect(biIsPrime(9n)).toBe(false);
      expect(biIsPrime(10n)).toBe(false);
      expect(biIsPrime(12n)).toBe(false);
    });

    test('returns true for larger primes', () => {
      expect(biIsPrime(17n)).toBe(true);
      expect(biIsPrime(19n)).toBe(true);
      expect(biIsPrime(23n)).toBe(true);
      expect(biIsPrime(29n)).toBe(true);
      expect(biIsPrime(97n)).toBe(true);
    });

    test('returns false for larger composite numbers', () => {
      expect(biIsPrime(15n)).toBe(false);
      expect(biIsPrime(21n)).toBe(false);
      expect(biIsPrime(25n)).toBe(false);
      expect(biIsPrime(49n)).toBe(false);
      expect(biIsPrime(100n)).toBe(false);
    });
  });

  describe('biNextPrime', () => {
    test('returns 2 for numbers less than 2', () => {
      expect(biNextPrime(0n)).toBe(2n);
      expect(biNextPrime(1n)).toBe(2n);
      expect(biNextPrime(-5n)).toBe(2n);
    });

    test('returns 3 for 2', () => {
      expect(biNextPrime(2n)).toBe(3n);
    });

    test('finds next prime for small numbers', () => {
      expect(biNextPrime(3n)).toBe(5n);
      expect(biNextPrime(4n)).toBe(5n);
      expect(biNextPrime(5n)).toBe(7n);
      expect(biNextPrime(6n)).toBe(7n);
      expect(biNextPrime(7n)).toBe(11n);
      expect(biNextPrime(10n)).toBe(11n);
    });

    test('finds next prime for larger numbers', () => {
      expect(biNextPrime(20n)).toBe(23n);
      expect(biNextPrime(30n)).toBe(31n);
      expect(biNextPrime(50n)).toBe(53n);
    });
  });

  describe('biPrevPrime', () => {
    test('throws error for numbers <= 2', () => {
      expect(() => biPrevPrime(0n)).toThrow(ArgumentError);
      expect(() => biPrevPrime(1n)).toThrow(ArgumentError);
      expect(() => biPrevPrime(2n)).toThrow(ArgumentError);
    });

    test('returns 2 for 3', () => {
      expect(biPrevPrime(3n)).toBe(2n);
    });

    test('finds previous prime for small numbers', () => {
      expect(biPrevPrime(4n)).toBe(3n);
      expect(biPrevPrime(5n)).toBe(3n);
      expect(biPrevPrime(6n)).toBe(5n);
      expect(biPrevPrime(7n)).toBe(5n);
      expect(biPrevPrime(8n)).toBe(7n);
      expect(biPrevPrime(11n)).toBe(7n);
    });

    test('finds previous prime for larger numbers', () => {
      expect(biPrevPrime(20n)).toBe(19n);
      expect(biPrevPrime(30n)).toBe(29n);
      expect(biPrevPrime(50n)).toBe(47n);
    });
  });

  describe('biIsEven', () => {
    test('returns true for even numbers', () => {
      expect(biIsEven(0n)).toBe(true);
      expect(biIsEven(2n)).toBe(true);
      expect(biIsEven(4n)).toBe(true);
      expect(biIsEven(100n)).toBe(true);
      expect(biIsEven(-2n)).toBe(true);
      expect(biIsEven(-4n)).toBe(true);
    });

    test('returns false for odd numbers', () => {
      expect(biIsEven(1n)).toBe(false);
      expect(biIsEven(3n)).toBe(false);
      expect(biIsEven(5n)).toBe(false);
      expect(biIsEven(99n)).toBe(false);
      expect(biIsEven(-1n)).toBe(false);
      expect(biIsEven(-3n)).toBe(false);
    });
  });

  describe('biIsOdd', () => {
    test('returns true for odd numbers', () => {
      expect(biIsOdd(1n)).toBe(true);
      expect(biIsOdd(3n)).toBe(true);
      expect(biIsOdd(5n)).toBe(true);
      expect(biIsOdd(99n)).toBe(true);
      expect(biIsOdd(-1n)).toBe(true);
      expect(biIsOdd(-3n)).toBe(true);
    });

    test('returns false for even numbers', () => {
      expect(biIsOdd(0n)).toBe(false);
      expect(biIsOdd(2n)).toBe(false);
      expect(biIsOdd(4n)).toBe(false);
      expect(biIsOdd(100n)).toBe(false);
      expect(biIsOdd(-2n)).toBe(false);
      expect(biIsOdd(-4n)).toBe(false);
    });
  });

  describe('biIsZero', () => {
    test('returns true for zero', () => {
      expect(biIsZero(0n)).toBe(true);
    });

    test('returns false for non-zero numbers', () => {
      expect(biIsZero(1n)).toBe(false);
      expect(biIsZero(-1n)).toBe(false);
      expect(biIsZero(100n)).toBe(false);
      expect(biIsZero(-100n)).toBe(false);
    });
  });

  describe('biIsOne', () => {
    test('returns true for one', () => {
      expect(biIsOne(1n)).toBe(true);
    });

    test('returns false for non-one numbers', () => {
      expect(biIsOne(0n)).toBe(false);
      expect(biIsOne(-1n)).toBe(false);
      expect(biIsOne(2n)).toBe(false);
      expect(biIsOne(100n)).toBe(false);
    });
  });

  describe('biIsNegative', () => {
    test('returns true for negative numbers', () => {
      expect(biIsNegative(-1n)).toBe(true);
      expect(biIsNegative(-100n)).toBe(true);
      expect(biIsNegative(-999n)).toBe(true);
    });

    test('returns false for zero and positive numbers', () => {
      expect(biIsNegative(0n)).toBe(false);
      expect(biIsNegative(1n)).toBe(false);
      expect(biIsNegative(100n)).toBe(false);
      expect(biIsNegative(999n)).toBe(false);
    });
  });

  describe('biIsPositive', () => {
    test('returns true for positive numbers', () => {
      expect(biIsPositive(1n)).toBe(true);
      expect(biIsPositive(100n)).toBe(true);
      expect(biIsPositive(999n)).toBe(true);
    });

    test('returns false for zero and negative numbers', () => {
      expect(biIsPositive(0n)).toBe(false);
      expect(biIsPositive(-1n)).toBe(false);
      expect(biIsPositive(-100n)).toBe(false);
      expect(biIsPositive(-999n)).toBe(false);
    });
  });
});
