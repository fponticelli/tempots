import { describe, expect, test } from "vitest";
import type {
  Maybe,
  IndexKey,
  Primitive,
  Nothing,
  Compare,
  Id,
  Merge,
  TupleToUnion,
  Fun0,
  Fun1,
  Fun2,
  Fun3,
  Fun4,
  Fun5,
  Fun6,
  FirstArgument,
  FilterTuple,
  SplitLiteral,
  SplitLiteralToUnion,
  PartialBy,
  RequiredBy,
} from '../src/domain';

describe('Domain types', () => {
  describe('Maybe<T>', () => {
    test('accepts value of type T', () => {
      const maybeString: Maybe<string> = 'hello';
      const maybeNumber: Maybe<number> = 42;
      const maybeObject: Maybe<{ id: number }> = { id: 1 };

      expect(maybeString).toBe('hello');
      expect(maybeNumber).toBe(42);
      expect(maybeObject).toEqual({ id: 1 });
    });

    test('accepts undefined', () => {
      const maybeString: Maybe<string> = undefined;
      const maybeNumber: Maybe<number> = undefined;

      expect(maybeString).toBe(undefined);
      expect(maybeNumber).toBe(undefined);
    });
  });

  describe('Primitive', () => {
    test('accepts primitive values', () => {
      const stringValue: Primitive = 'hello';
      const numberValue: Primitive = 42;
      const booleanValue: Primitive = true;
      const nullValue: Primitive = null;
      const undefinedValue: Primitive = undefined;

      expect(stringValue).toBe('hello');
      expect(numberValue).toBe(42);
      expect(booleanValue).toBe(true);
      expect(nullValue).toBe(null);
      expect(undefinedValue).toBe(undefined);
    });
  });

  describe('Nothing', () => {
    test('accepts null and undefined', () => {
      const nullValue: Nothing = null;
      const undefinedValue: Nothing = undefined;

      expect(nullValue).toBe(null);
      expect(undefinedValue).toBe(undefined);
    });
  });

  describe('Compare<T>', () => {
    test('works as a comparison function', () => {
      const compareNumbers: Compare<number> = (a, b) => a - b;
      const compareStrings: Compare<string> = (a, b) => a.localeCompare(b);

      expect(compareNumbers(5, 3)).toBeGreaterThan(0);
      expect(compareNumbers(3, 5)).toBeLessThan(0);
      expect(compareNumbers(5, 5)).toBe(0);

      expect(compareStrings('b', 'a')).toBeGreaterThan(0);
      expect(compareStrings('a', 'b')).toBeLessThan(0);
      expect(compareStrings('a', 'a')).toBe(0);
    });
  });

  describe('Function types', () => {
    test('Fun0 works as zero-argument function', () => {
      const getValue: Fun0<number> = () => 42;
      expect(getValue()).toBe(42);
    });

    test('Fun1 works as one-argument function', () => {
      const double: Fun1<number, number> = (x) => x * 2;
      expect(double(5)).toBe(10);
    });

    test('Fun2 works as two-argument function', () => {
      const add: Fun2<number, number, number> = (a, b) => a + b;
      expect(add(3, 4)).toBe(7);
    });

    test('Fun3 works as three-argument function', () => {
      const sum3: Fun3<number, number, number, number> = (a, b, c) => a + b + c;
      expect(sum3(1, 2, 3)).toBe(6);
    });

    test('Fun4 works as four-argument function', () => {
      const sum4: Fun4<number, number, number, number, number> = (a, b, c, d) => a + b + c + d;
      expect(sum4(1, 2, 3, 4)).toBe(10);
    });

    test('Fun5 works as five-argument function', () => {
      const sum5: Fun5<number, number, number, number, number, number> = (a, b, c, d, e) => a + b + c + d + e;
      expect(sum5(1, 2, 3, 4, 5)).toBe(15);
    });

    test('Fun6 works as six-argument function', () => {
      const sum6: Fun6<number, number, number, number, number, number, number> = (a, b, c, d, e, f) => a + b + c + d + e + f;
      expect(sum6(1, 2, 3, 4, 5, 6)).toBe(21);
    });
  });

  describe('Type utilities', () => {
    test('Id preserves type structure', () => {
      type Original = { a: string; b: number };
      type Preserved = Id<Original>;

      const obj: Preserved = { a: 'hello', b: 42 };
      expect(obj).toEqual({ a: 'hello', b: 42 });
    });

    test('Merge combines types', () => {
      type A = { a: string };
      type B = { b: number };
      type Combined = Merge<A, B>;

      const obj: Combined = { a: 'hello', b: 42 };
      expect(obj).toEqual({ a: 'hello', b: 42 });
    });

    test('PartialBy makes specific keys optional', () => {
      type Original = { a: string; b: number; c: boolean };
      type WithOptionalB = PartialBy<Original, 'b'>;

      const obj1: WithOptionalB = { a: 'hello', c: true };
      const obj2: WithOptionalB = { a: 'hello', b: 42, c: true };

      expect(obj1).toEqual({ a: 'hello', c: true });
      expect(obj2).toEqual({ a: 'hello', b: 42, c: true });
    });

    test('RequiredBy makes specific keys required', () => {
      type Original = { a: string; b?: number; c: boolean };
      type WithRequiredB = RequiredBy<Original, 'b'>;

      const obj: WithRequiredB = { a: 'hello', b: 42, c: true };
      expect(obj).toEqual({ a: 'hello', b: 42, c: true });
    });
  });

  describe('Type-level operations', () => {
    test('TupleToUnion converts tuple to union type', () => {
      // This is tested at the type level - if it compiles, it works
      type TestTuple = [string, number, boolean];
      type TestUnion = TupleToUnion<TestTuple>;

      const value1: TestUnion = 'hello';
      const value2: TestUnion = 42;
      const value3: TestUnion = true;

      expect(value1).toBe('hello');
      expect(value2).toBe(42);
      expect(value3).toBe(true);
    });

    test('FirstArgument extracts first argument type', () => {
      type TestFunction = (a: string, b: number) => boolean;
      type FirstArg = FirstArgument<TestFunction>;

      const arg: FirstArg = 'hello';
      expect(arg).toBe('hello');
    });

    test('FilterTuple filters out specified types', () => {
      // This is primarily a type-level test
      type TestTuple = [string, number, string, boolean];
      type Filtered = FilterTuple<TestTuple, string>;

      const filtered: Filtered = [42, true];
      expect(filtered).toEqual([42, true]);
    });

    test('SplitLiteral splits string literals', () => {
      // This is primarily a type-level test
      type TestString = 'a.b.c';
      type Split = SplitLiteral<TestString, '.'>;

      const split: Split = ['a', 'b', 'c'];
      expect(split).toEqual(['a', 'b', 'c']);
    });

    test('SplitLiteralToUnion creates union from split string', () => {
      // This is primarily a type-level test
      type TestString = 'red|green|blue';
      type Union = SplitLiteralToUnion<TestString, '|'>;

      const color1: Union = 'red';
      const color2: Union = 'green';
      const color3: Union = 'blue';

      expect(color1).toBe('red');
      expect(color2).toBe('green');
      expect(color3).toBe('blue');
    });
  });

  describe('Runtime behavior with domain types', () => {
    test('Maybe type guards work correctly', () => {
      const checkMaybe = <T>(value: Maybe<T>): value is T => value !== undefined;

      const maybeString: Maybe<string> = 'hello';
      const maybeUndefined: Maybe<string> = undefined;

      expect(checkMaybe(maybeString)).toBe(true);
      expect(checkMaybe(maybeUndefined)).toBe(false);
    });

    test('Nothing type guards work correctly', () => {
      const isNothing = (value: unknown): value is Nothing => value == null;

      expect(isNothing(null)).toBe(true);
      expect(isNothing(undefined)).toBe(true);
      expect(isNothing('')).toBe(false);
      expect(isNothing(0)).toBe(false);
      expect(isNothing(false)).toBe(false);
    });

    test('Primitive type guards work correctly', () => {
      const isPrimitive = (value: unknown): value is Primitive => {
        return typeof value === 'string' ||
               typeof value === 'number' ||
               typeof value === 'boolean' ||
               value === null ||
               value === undefined;
      };

      expect(isPrimitive('hello')).toBe(true);
      expect(isPrimitive(42)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(() => {})).toBe(false);
    });
  });
});
