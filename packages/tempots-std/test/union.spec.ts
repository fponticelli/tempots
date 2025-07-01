import { describe, expect, test } from "vitest";
import type { IsUnion } from '../src/union';

describe('Union type utilities', () => {
  describe('IsUnion<T>', () => {
    test('detects union types correctly', () => {
      // These are compile-time tests - if they compile, the type works correctly
      
      // Union types should return true
      type StringOrNumber = string | number;
      type BooleanOrString = boolean | string;
      type MultipleUnion = string | number | boolean;
      type ObjectUnion = { a: string } | { b: number };
      
      // Non-union types should return false
      type SingleString = string;
      type SingleNumber = number;
      type SingleObject = { a: string; b: number };
      type SingleArray = string[];
      
      // Test union types
      const isStringOrNumberUnion: IsUnion<StringOrNumber> = true;
      const isBooleanOrStringUnion: IsUnion<BooleanOrString> = true;
      const isMultipleUnion: IsUnion<MultipleUnion> = true;
      const isObjectUnion: IsUnion<ObjectUnion> = true;
      
      // Test non-union types
      const isSingleStringUnion: IsUnion<SingleString> = false;
      const isSingleNumberUnion: IsUnion<SingleNumber> = false;
      const isSingleObjectUnion: IsUnion<SingleObject> = false;
      const isSingleArrayUnion: IsUnion<SingleArray> = false;
      
      // Runtime verification that the values are what we expect
      expect(isStringOrNumberUnion).toBe(true);
      expect(isBooleanOrStringUnion).toBe(true);
      expect(isMultipleUnion).toBe(true);
      expect(isObjectUnion).toBe(true);
      
      expect(isSingleStringUnion).toBe(false);
      expect(isSingleNumberUnion).toBe(false);
      expect(isSingleObjectUnion).toBe(false);
      expect(isSingleArrayUnion).toBe(false);
    });

    test('handles special cases correctly', () => {
      // Test with never type
      type NeverType = never;
      const isNeverUnion: IsUnion<NeverType> = false;
      expect(isNeverUnion).toBe(false);
      
      // Test with any type
      type AnyType = any;
      const isAnyUnion: IsUnion<AnyType> = false;
      expect(isAnyUnion).toBe(false);
      
      // Test with unknown type
      type UnknownType = unknown;
      const isUnknownUnion: IsUnion<UnknownType> = false;
      expect(isUnknownUnion).toBe(false);
      
      // Test with void type
      type VoidType = void;
      const isVoidUnion: IsUnion<VoidType> = false;
      expect(isVoidUnion).toBe(false);
      
      // Test with undefined type
      type UndefinedType = undefined;
      const isUndefinedUnion: IsUnion<UndefinedType> = false;
      expect(isUndefinedUnion).toBe(false);
      
      // Test with null type
      type NullType = null;
      const isNullUnion: IsUnion<NullType> = false;
      expect(isNullUnion).toBe(false);
    });

    test('handles complex union types', () => {
      // Test with function types in union
      type FunctionUnion = (() => void) | ((x: number) => string);
      const isFunctionUnion: IsUnion<FunctionUnion> = true;
      expect(isFunctionUnion).toBe(true);
      
      // Test with array types in union
      type ArrayUnion = string[] | number[];
      const isArrayUnion: IsUnion<ArrayUnion> = true;
      expect(isArrayUnion).toBe(true);
      
      // Test with generic types in union
      type GenericUnion<T> = T | string;
      const isGenericUnion: IsUnion<GenericUnion<number>> = true;
      expect(isGenericUnion).toBe(true);
      
      // Test with tuple types in union
      type TupleUnion = [string, number] | [boolean, string];
      const isTupleUnion: IsUnion<TupleUnion> = true;
      expect(isTupleUnion).toBe(true);
      
      // Test with literal types in union
      type LiteralUnion = 'red' | 'green' | 'blue';
      const isLiteralUnion: IsUnion<LiteralUnion> = true;
      expect(isLiteralUnion).toBe(true);
      
      // Test with number literal union
      type NumberLiteralUnion = 1 | 2 | 3;
      const isNumberLiteralUnion: IsUnion<NumberLiteralUnion> = true;
      expect(isNumberLiteralUnion).toBe(true);
    });

    test('handles nested and complex object unions', () => {
      // Test with discriminated unions
      type DiscriminatedUnion = 
        | { type: 'A'; value: string }
        | { type: 'B'; value: number }
        | { type: 'C'; value: boolean };
      
      const isDiscriminatedUnion: IsUnion<DiscriminatedUnion> = true;
      expect(isDiscriminatedUnion).toBe(true);
      
      // Test with nested object unions
      type NestedUnion = 
        | { kind: 'user'; data: { name: string; age: number } }
        | { kind: 'admin'; data: { permissions: string[] } };
      
      const isNestedUnion: IsUnion<NestedUnion> = true;
      expect(isNestedUnion).toBe(true);
      
      // Test with optional properties (not a union)
      type OptionalProps = { a: string; b?: number };
      const isOptionalPropsUnion: IsUnion<OptionalProps> = false;
      expect(isOptionalPropsUnion).toBe(false);
    });

    test('works with conditional types', () => {
      // Test that IsUnion can be used in conditional types
      type TestConditional<T> = IsUnion<T> extends true 
        ? 'is union' 
        : 'not union';
      
      type StringOrNumberResult = TestConditional<string | number>;
      type StringResult = TestConditional<string>;
      
      const unionResult: StringOrNumberResult = 'is union';
      const nonUnionResult: StringResult = 'not union';
      
      expect(unionResult).toBe('is union');
      expect(nonUnionResult).toBe('not union');
    });

    test('handles edge cases with similar types', () => {
      // Test with types that might be confused
      type StringOrStringArray = string | string[];
      const isStringOrStringArrayUnion: IsUnion<StringOrStringArray> = true;
      expect(isStringOrStringArrayUnion).toBe(true);
      
      // Test with overlapping object types
      type OverlappingUnion = { a: string } | { a: string; b: number };
      const isOverlappingUnion: IsUnion<OverlappingUnion> = true;
      expect(isOverlappingUnion).toBe(true);
      
      // Test with identical types (should not be a union)
      type IdenticalTypes = string | string;
      const isIdenticalTypesUnion: IsUnion<IdenticalTypes> = false;
      expect(isIdenticalTypesUnion).toBe(false);
    });

    test('type-level behavior verification', () => {
      // These tests verify that the type behaves correctly at compile time
      // If these compile without errors, the type is working correctly
      
      // Should compile - union types
      const _test1: IsUnion<string | number> = true;
      const _test2: IsUnion<boolean | string | number> = true;
      
      // Should compile - non-union types
      const _test3: IsUnion<string> = false;
      const _test4: IsUnion<{ a: string }> = false;
      
      // Should NOT compile if we try to assign wrong values
      // const _error1: IsUnion<string | number> = false; // TypeScript error
      // const _error2: IsUnion<string> = true; // TypeScript error
      
      // Verify the values are as expected
      expect(_test1).toBe(true);
      expect(_test2).toBe(true);
      expect(_test3).toBe(false);
      expect(_test4).toBe(false);
    });

    test('works with generic constraints', () => {
      // Test that IsUnion works with generic type parameters
      function testGenericUnion<T>(): IsUnion<T> {
        // This function demonstrates that IsUnion can work with generics
        // The actual return value would depend on what T is at runtime
        return false as IsUnion<T>;
      }
      
      // Test with specific types
      const stringUnionTest = testGenericUnion<string | number>();
      const stringTest = testGenericUnion<string>();
      
      // These are just to verify the function compiles and runs
      expect(typeof stringUnionTest).toBe('boolean');
      expect(typeof stringTest).toBe('boolean');
    });

    test('integration with other type utilities', () => {
      // Test that IsUnion can be combined with other type utilities
      type ExtractUnionTypes<T> = IsUnion<T> extends true ? T : never;
      
      type UnionExtracted = ExtractUnionTypes<string | number>;
      type NonUnionExtracted = ExtractUnionTypes<string>;
      
      // These should compile correctly
      const unionValue: UnionExtracted = 'hello'; // or could be a number
      const unionValue2: UnionExtracted = 42;
      
      // NonUnionExtracted should be never, so we can't assign anything to it
      // const neverValue: NonUnionExtracted = 'anything'; // Would be a TypeScript error
      
      expect(unionValue).toBe('hello');
      expect(unionValue2).toBe(42);
    });
  });

  describe('Practical usage examples', () => {
    test('can be used for type guards and utilities', () => {
      // Example of how IsUnion might be used in practice
      type SafeUnionHandler<T> = IsUnion<T> extends true
        ? 'Use pattern matching or type guards'
        : 'Safe to use directly';
      
      type StringOrNumberHandler = SafeUnionHandler<string | number>;
      type StringHandler = SafeUnionHandler<string>;
      
      const unionHandler: StringOrNumberHandler = 'Use pattern matching or type guards';
      const nonUnionHandler: StringHandler = 'Safe to use directly';
      
      expect(unionHandler).toBe('Use pattern matching or type guards');
      expect(nonUnionHandler).toBe('Safe to use directly');
    });

    test('demonstrates type-level computation', () => {
      // Example showing how IsUnion enables type-level computation
      type UnionCount<T> = IsUnion<T> extends true ? 'multiple' : 'single';
      
      type MultipleTypes = UnionCount<string | number | boolean>;
      type SingleType = UnionCount<string>;
      
      const multiple: MultipleTypes = 'multiple';
      const single: SingleType = 'single';
      
      expect(multiple).toBe('multiple');
      expect(single).toBe('single');
    });
  });
});
