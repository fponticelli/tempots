import { describe, expect, test, vi } from "vitest";
import {
  Result,
  Success,
  Failure,
  PromiseResult,
} from '../src/result';
import { AsyncResult } from '../src/async-result';
import { Validation } from '../src/validation';

describe('Result', () => {
  describe('Type constructors', () => {
    test('success creates Success type', () => {
      const result = Result.success(42);
      expect(result).toEqual({ type: 'Success', value: 42 });
      expect(Result.isSuccess(result)).toBe(true);
      expect(Result.isFailure(result)).toBe(false);
    });

    test('failure creates Failure type', () => {
      const error = 'Something went wrong';
      const result = Result.failure(error);
      expect(result).toEqual({ type: 'Failure', error });
      expect(Result.isFailure(result)).toBe(true);
      expect(Result.isSuccess(result)).toBe(false);
    });

    test('success works with different value types', () => {
      const stringResult = Result.success('hello');
      const objectResult = Result.success({ id: 1, name: 'test' });
      const arrayResult = Result.success([1, 2, 3]);
      const nullResult = Result.success(null);
      const undefinedResult = Result.success(undefined);

      expect(Result.isSuccess(stringResult)).toBe(true);
      expect(Result.isSuccess(objectResult)).toBe(true);
      expect(Result.isSuccess(arrayResult)).toBe(true);
      expect(Result.isSuccess(nullResult)).toBe(true);
      expect(Result.isSuccess(undefinedResult)).toBe(true);
    });

    test('failure works with different error types', () => {
      const stringError = Result.failure('string error');
      const errorObject = Result.failure(new Error('error object'));
      const numberError = Result.failure(404);
      const objectError = Result.failure({ code: 500, message: 'server error' });

      expect(Result.isFailure(stringError)).toBe(true);
      expect(Result.isFailure(errorObject)).toBe(true);
      expect(Result.isFailure(numberError)).toBe(true);
      expect(Result.isFailure(objectError)).toBe(true);
    });
  });

  describe('Type guards', () => {
    const success = Result.success(42);
    const failure = Result.failure('error');

    test('isSuccess correctly identifies Success results', () => {
      expect(Result.isSuccess(success)).toBe(true);
      expect(Result.isSuccess(failure)).toBe(false);
    });

    test('isFailure correctly identifies Failure results', () => {
      expect(Result.isFailure(success)).toBe(false);
      expect(Result.isFailure(failure)).toBe(true);
    });

    test('type guards work as type predicates', () => {
      const result: Result<number, string> = Result.success(42);

      if (Result.isSuccess(result)) {
        // TypeScript should know this is Success<number>
        expect(result.value).toBe(42);
        expect(result.type).toBe('Success');
      }

      const failureResult: Result<number, string> = Result.failure('error');
      if (Result.isFailure(failureResult)) {
        // TypeScript should know this is Failure<string>
        expect(failureResult.error).toBe('error');
        expect(failureResult.type).toBe('Failure');
      }
    });
  });

  describe('map', () => {
    test('maps success values', () => {
      const result = Result.success(5);
      const mapped = Result.map(result, x => x * 2);

      expect(Result.isSuccess(mapped)).toBe(true);
      if (Result.isSuccess(mapped)) {
        expect(mapped.value).toBe(10);
      }
    });

    test('does not map failure values', () => {
      const result = Result.failure('error');
      const mapped = Result.map(result, x => x * 2);

      expect(Result.isFailure(mapped)).toBe(true);
      if (Result.isFailure(mapped)) {
        expect(mapped.error).toBe('error');
      }
    });

    test('can change value type', () => {
      const result = Result.success(42);
      const mapped = Result.map(result, x => `Number: ${x}`);

      expect(Result.isSuccess(mapped)).toBe(true);
      if (Result.isSuccess(mapped)) {
        expect(mapped.value).toBe('Number: 42');
      }
    });

    test('mapping function is not called for failures', () => {
      const mapFn = vi.fn(x => x * 2);
      const result = Result.failure('error');

      Result.map(result, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  describe('flatMap', () => {
    test('flat maps success values', () => {
      const result = Result.success(5);
      const flatMapped = Result.flatMap(result, x => Result.success(x * 2));

      expect(Result.isSuccess(flatMapped)).toBe(true);
      if (Result.isSuccess(flatMapped)) {
        expect(flatMapped.value).toBe(10);
      }
    });

    test('flat maps to failure', () => {
      const result = Result.success(5);
      const flatMapped = Result.flatMap(result, x => Result.failure(`Error: ${x}`));

      expect(Result.isFailure(flatMapped)).toBe(true);
      if (Result.isFailure(flatMapped)) {
        expect(flatMapped.error).toBe('Error: 5');
      }
    });

    test('does not flat map failure values', () => {
      const result = Result.failure('original error');
      const flatMapped = Result.flatMap(result, x => Result.success(x * 2));

      expect(Result.isFailure(flatMapped)).toBe(true);
      if (Result.isFailure(flatMapped)) {
        expect(flatMapped.error).toBe('original error');
      }
    });

    test('flat mapping function is not called for failures', () => {
      const flatMapFn = vi.fn(x => Result.success(x * 2));
      const result = Result.failure('error');

      Result.flatMap(result, flatMapFn);

      expect(flatMapFn).not.toHaveBeenCalled();
    });

    test('can chain multiple flat maps', () => {
      const result = Result.success(5);
      const chained = Result.flatMap(
        Result.flatMap(result, x => Result.success(x * 2)),
        x => Result.success(x + 1)
      );

      expect(Result.isSuccess(chained)).toBe(true);
      if (Result.isSuccess(chained)) {
        expect(chained.value).toBe(11); // (5 * 2) + 1
      }
    });
  });

  describe('Value extraction', () => {
    const success = Result.success(42);
    const failure = Result.failure('error');

    test('getOrElse returns value for success', () => {
      expect(Result.getOrElse(success, 0)).toBe(42);
    });

    test('getOrElse returns alternative for failure', () => {
      expect(Result.getOrElse(failure, 0)).toBe(0);
    });

    test('getOrElseLazy returns value for success', () => {
      const altFn = vi.fn(() => 0);
      expect(Result.getOrElseLazy(success, altFn)).toBe(42);
      expect(altFn).not.toHaveBeenCalled();
    });

    test('getOrElseLazy calls alternative function for failure', () => {
      const altFn = vi.fn(() => 99);
      expect(Result.getOrElseLazy(failure, altFn)).toBe(99);
      expect(altFn).toHaveBeenCalledOnce();
    });

    test('getOrNull returns value for success', () => {
      expect(Result.getOrNull(success)).toBe(42);
    });

    test('getOrNull returns null for failure', () => {
      expect(Result.getOrNull(failure)).toBe(null);
    });

    test('getOrUndefined returns value for success', () => {
      expect(Result.getOrUndefined(success)).toBe(42);
    });

    test('getOrUndefined returns undefined for failure', () => {
      expect(Result.getOrUndefined(failure)).toBe(undefined);
    });
  });

  describe('getUnsafe', () => {
    test('returns value for success', () => {
      const success = Result.success(42);
      expect(Result.getUnsafe(success)).toBe(42);
    });

    test('throws error for failure', () => {
      const error = new Error('test error');
      const failure = Result.failure(error);
      expect(() => Result.getUnsafe(failure)).toThrow(error);
    });

    test('throws string error for string failure', () => {
      const failure = Result.failure('string error');
      expect(() => Result.getUnsafe(failure)).toThrow('string error');
    });

    test('throws any type of error', () => {
      const customError = { code: 404, message: 'Not found' };
      const failure = Result.failure(customError);

      try {
        Result.getUnsafe(failure);
        expect.fail('Expected getUnsafe to throw');
      } catch (error) {
        expect(error).toBe(customError);
      }
    });
  });

  describe('match', () => {
    test('calls success function for Success result', () => {
      const success = Result.success(42);
      const result = Result.match(
        success,
        value => `Success: ${value}`,
        error => `Error: ${error}`
      );
      expect(result).toBe('Success: 42');
    });

    test('calls failure function for Failure result', () => {
      const failure = Result.failure('test error');
      const result = Result.match(
        failure,
        value => `Success: ${value}`,
        error => `Error: ${error}`
      );
      expect(result).toBe('Error: test error');
    });

    test('can return different types from match functions', () => {
      const success = Result.success(42);
      const result = Result.match(
        success,
        value => ({ type: 'success', data: value }),
        error => ({ type: 'error', message: error })
      );
      expect(result).toEqual({ type: 'success', data: 42 });
    });

    test('success function is not called for failures', () => {
      const successFn = vi.fn(value => `Success: ${value}`);
      const failureFn = vi.fn(error => `Error: ${error}`);
      const failure = Result.failure('error');

      Result.match(failure, successFn, failureFn);

      expect(successFn).not.toHaveBeenCalled();
      expect(failureFn).toHaveBeenCalledWith('error');
    });

    test('failure function is not called for successes', () => {
      const successFn = vi.fn(value => `Success: ${value}`);
      const failureFn = vi.fn(error => `Error: ${error}`);
      const success = Result.success(42);

      Result.match(success, successFn, failureFn);

      expect(successFn).toHaveBeenCalledWith(42);
      expect(failureFn).not.toHaveBeenCalled();
    });
  });

  describe('effect', () => {
    test('calls success handler for Success', () => {
      const success = Result.success(42);
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
      };
      const result = Result.effect(success, handlers);

      expect(handlers.success).toHaveBeenCalledWith(42);
      expect(handlers.failure).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('calls failure handler for Failure', () => {
      const failure = Result.failure('error');
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
      };
      const result = Result.effect(failure, handlers);

      expect(handlers.success).not.toHaveBeenCalled();
      expect(handlers.failure).toHaveBeenCalledWith('error');
      expect(result).toBe(failure);
    });

    test('works with only success handler provided', () => {
      const success = Result.success(42);
      const successHandler = vi.fn();
      const result = Result.effect(success, { success: successHandler });

      expect(successHandler).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('works with only failure handler provided', () => {
      const failure = Result.failure('error');
      const failureHandler = vi.fn();
      const result = Result.effect(failure, { failure: failureHandler });

      expect(failureHandler).toHaveBeenCalledWith('error');
      expect(result).toBe(failure);
    });

    test('works with no handlers provided', () => {
      const success = Result.success(42);
      const result = Result.effect(success, {});

      expect(result).toBe(success);
    });

    test('does not call missing handler for success', () => {
      const success = Result.success(42);
      const failureHandler = vi.fn();
      const result = Result.effect(success, { failure: failureHandler });

      expect(failureHandler).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('does not call missing handler for failure', () => {
      const failure = Result.failure('error');
      const successHandler = vi.fn();
      const result = Result.effect(failure, { success: successHandler });

      expect(successHandler).not.toHaveBeenCalled();
      expect(result).toBe(failure);
    });

    test('can be chained', () => {
      const success = Result.success(42);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const result = Result.effect(
        Result.effect(success, { success: handler1 }),
        { success: handler2 }
      );

      expect(handler1).toHaveBeenCalledWith(42);
      expect(handler2).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('calls else handler when no specific handler for success', () => {
      const success = Result.success(42);
      const elseHandler = vi.fn();
      const result = Result.effect(success, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('calls else handler when no specific handler for failure', () => {
      const failure = Result.failure('error');
      const elseHandler = vi.fn();
      const result = Result.effect(failure, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(failure);
    });

    test('does not call else handler when specific handler is provided', () => {
      const success = Result.success(42);
      const successHandler = vi.fn();
      const elseHandler = vi.fn();
      const result = Result.effect(success, { success: successHandler, else: elseHandler });

      expect(successHandler).toHaveBeenCalledWith(42);
      expect(elseHandler).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('else handler works as fallback for unhandled states', () => {
      const success = Result.success(42);
      const failure = Result.failure('error');
      const successHandler = vi.fn();
      const elseHandler = vi.fn();

      Result.effect(success, { success: successHandler, else: elseHandler });
      expect(successHandler).toHaveBeenCalledWith(42);
      expect(elseHandler).not.toHaveBeenCalled();

      successHandler.mockClear();
      elseHandler.mockClear();

      Result.effect(failure, { success: successHandler, else: elseHandler });
      expect(successHandler).not.toHaveBeenCalled();
      expect(elseHandler).toHaveBeenCalled();
    });
  });

  describe('whenSuccess', () => {
    test('calls function for success and returns original result', () => {
      const success = Result.success(42);
      const mockFn = vi.fn();
      const result = Result.whenSuccess(success, mockFn);

      expect(mockFn).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('does not call function for failure', () => {
      const failure = Result.failure('error');
      const mockFn = vi.fn();
      const result = Result.whenSuccess(failure, mockFn);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBe(failure);
    });
  });

  describe('whenFailure', () => {
    test('calls function for failure and returns original result', () => {
      const failure = Result.failure('test error');
      const mockFn = vi.fn();
      const result = Result.whenFailure(failure, mockFn);

      expect(mockFn).toHaveBeenCalledWith('test error');
      expect(result).toBe(failure);
    });

    test('does not call function for success', () => {
      const success = Result.success(42);
      const mockFn = vi.fn();
      const result = Result.whenFailure(success, mockFn);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });
  });

  describe('toAsync', () => {
    test('converts success result to AsyncResult success', () => {
      const success = Result.success(42);
      const asyncResult = Result.toAsync(success);

      expect(AsyncResult.isSuccess(asyncResult)).toBe(true);
      if (AsyncResult.isSuccess(asyncResult)) {
        expect(asyncResult.value).toBe(42);
      }
    });

    test('converts failure result to AsyncResult failure', () => {
      const failure = Result.failure('error');
      const asyncResult = Result.toAsync(failure);

      expect(AsyncResult.isFailure(asyncResult)).toBe(true);
      if (AsyncResult.isFailure(asyncResult)) {
        expect(asyncResult.error).toBe('error');
      }
    });
  });

  describe('toValidation', () => {
    test('converts success result to valid validation', () => {
      const success = Result.success(42);
      const validation = Result.toValidation(success);

      expect(Validation.isValid(validation)).toBe(true);
    });

    test('converts failure result to invalid validation', () => {
      const failure = Result.failure('error');
      const validation = Result.toValidation(failure);

      expect(Validation.isInvalid(validation)).toBe(true);
      if (Validation.isInvalid(validation)) {
        expect(validation.error).toBe('error');
      }
    });
  });

  describe('combine', () => {
    test('combines two success results', () => {
      const result1 = Result.success(5);
      const result2 = Result.success(3);
      const combined = Result.combine(
        result1,
        result2,
        (v1, v2) => v1 + v2,
        (e1, e2) => `${e1}, ${e2}`
      );

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toBe(8);
      }
    });

    test('returns second failure when first is success and second is failure', () => {
      const result1 = Result.success(5);
      const result2 = Result.failure('error2');
      const combined = Result.combine(
        result1,
        result2,
        (v1, v2) => v1 + v2,
        (e1, e2) => `${e1}, ${e2}`
      );

      expect(Result.isFailure(combined)).toBe(true);
      if (Result.isFailure(combined)) {
        expect(combined.error).toBe('error2');
      }
    });

    test('returns first failure when first is failure and second is success', () => {
      const result1 = Result.failure('error1');
      const result2 = Result.success(3);
      const combined = Result.combine(
        result1,
        result2,
        (v1, v2) => v1 + v2,
        (e1, e2) => `${e1}, ${e2}`
      );

      expect(Result.isFailure(combined)).toBe(true);
      if (Result.isFailure(combined)) {
        expect(combined.error).toBe('error1');
      }
    });

    test('combines two failure results', () => {
      const result1 = Result.failure('error1');
      const result2 = Result.failure('error2');
      const combined = Result.combine(
        result1,
        result2,
        (v1, v2) => v1 + v2,
        (e1, e2) => `${e1}, ${e2}`
      );

      expect(Result.isFailure(combined)).toBe(true);
      if (Result.isFailure(combined)) {
        expect(combined.error).toBe('error1, error2');
      }
    });

    test('combine functions are not called unnecessarily', () => {
      const combineV = vi.fn((v1, v2) => v1 + v2);
      const combineE = vi.fn((e1, e2) => `${e1}, ${e2}`);

      // Test success + failure (combineV should not be called)
      Result.combine(Result.success(5), Result.failure('error'), combineV, combineE);
      expect(combineV).not.toHaveBeenCalled();

      // Test failure + success (combineV should not be called)
      Result.combine(Result.failure('error'), Result.success(5), combineV, combineE);
      expect(combineV).not.toHaveBeenCalled();

      // Test success + success (combineE should not be called)
      Result.combine(Result.success(5), Result.success(3), combineV, combineE);
      expect(combineE).not.toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    test('returns true for equal success results with default equality', () => {
      const result1 = Result.success(42);
      const result2 = Result.success(42);
      expect(Result.equals(result1, result2)).toBe(true);
    });

    test('returns false for different success results with default equality', () => {
      const result1 = Result.success(42);
      const result2 = Result.success(43);
      expect(Result.equals(result1, result2)).toBe(false);
    });

    test('returns true for equal failure results with default equality', () => {
      const result1 = Result.failure('error');
      const result2 = Result.failure('error');
      expect(Result.equals(result1, result2)).toBe(true);
    });

    test('returns false for different failure results with default equality', () => {
      const result1 = Result.failure('error1');
      const result2 = Result.failure('error2');
      expect(Result.equals(result1, result2)).toBe(false);
    });

    test('returns false for success vs failure', () => {
      const success = Result.success(42);
      const failure = Result.failure('error');
      expect(Result.equals(success, failure)).toBe(false);
      expect(Result.equals(failure, success)).toBe(false);
    });

    test('uses custom equality functions', () => {
      const obj1 = { id: 1, name: 'test' };
      const obj2 = { id: 1, name: 'test' };
      const result1 = Result.success(obj1);
      const result2 = Result.success(obj2);

      // Default equality (reference equality) should return false
      expect(Result.equals(result1, result2)).toBe(false);

      // Custom equality should return true
      expect(Result.equals(result1, result2, {
        valueEquals: (v1, v2) => v1.id === v2.id && v1.name === v2.name,
        errorEquals: (e1, e2) => e1 === e2,
      })).toBe(true);
    });

    test('uses custom error equality functions', () => {
      const error1 = new Error('test');
      const error2 = new Error('test');
      const result1 = Result.failure(error1);
      const result2 = Result.failure(error2);

      // Default equality (reference equality) should return false
      expect(Result.equals(result1, result2)).toBe(false);

      // Custom equality should return true
      expect(Result.equals(result1, result2, {
        valueEquals: (v1, v2) => v1 === v2,
        errorEquals: (e1, e2) => e1.message === e2.message,
      })).toBe(true);
    });
  });

  describe('all', () => {
    test('returns success with all values when all results are success', () => {
      const results = [
        Result.success(1),
        Result.success(2),
        Result.success(3),
      ];
      const combined = Result.all(results);

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    test('returns first failure when any result is failure', () => {
      const failure = Result.failure('error');
      const results = [
        Result.success(1),
        failure,
        Result.success(3),
      ];
      const combined = Result.all(results);

      expect(Result.isFailure(combined)).toBe(true);
      expect(combined).toBe(failure);
    });

    test('returns success with empty array for empty input', () => {
      const results: Result<number, string>[] = [];
      const combined = Result.all(results);

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toEqual([]);
      }
    });

    test('preserves order of values', () => {
      const results = [
        Result.success('first'),
        Result.success('second'),
        Result.success('third'),
      ];
      const combined = Result.all(results);

      expect(Result.isSuccess(combined)).toBe(true);
      if (Result.isSuccess(combined)) {
        expect(combined.value).toEqual(['first', 'second', 'third']);
      }
    });

    test('short-circuits on first failure', () => {
      const results = [
        Result.success(1),
        Result.failure('first error'),
        Result.failure('second error'),
      ];
      const combined = Result.all(results);

      expect(Result.isFailure(combined)).toBe(true);
      if (Result.isFailure(combined)) {
        expect(combined.error).toBe('first error');
      }
    });
  });

  describe('mapError', () => {
    test('maps error values', () => {
      const result = Result.failure('error');
      const mapped = Result.mapError(result, e => `Mapped: ${e}`);

      expect(Result.isFailure(mapped)).toBe(true);
      if (Result.isFailure(mapped)) {
        expect(mapped.error).toBe('Mapped: error');
      }
    });

    test('does not map success values', () => {
      const result = Result.success(42);
      const mapped = Result.mapError(result, (e: string) => `Mapped: ${e}`);

      expect(Result.isSuccess(mapped)).toBe(true);
      if (Result.isSuccess(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });

    test('can change error type', () => {
      const result = Result.failure('error');
      const mapped = Result.mapError(result, () => ({ code: 500 }));

      expect(Result.isFailure(mapped)).toBe(true);
      if (Result.isFailure(mapped)) {
        expect(mapped.error).toEqual({ code: 500 });
      }
    });

    test('mapping function is not called for success', () => {
      const mapFn = vi.fn((e: string) => `Mapped: ${e}`);
      const result = Result.success(42);

      Result.mapError(result, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  describe('flatMapError', () => {
    test('flat maps error to success (recovery)', () => {
      const result = Result.failure('error');
      const recovered = Result.flatMapError(result, () => Result.success(42));

      expect(Result.isSuccess(recovered)).toBe(true);
      if (Result.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });

    test('flat maps error to different error', () => {
      const result = Result.failure('error');
      const mapped = Result.flatMapError(result, e => Result.failure(`Wrapped: ${e}`));

      expect(Result.isFailure(mapped)).toBe(true);
      if (Result.isFailure(mapped)) {
        expect(mapped.error).toBe('Wrapped: error');
      }
    });

    test('does not flat map success values', () => {
      const result = Result.success(42);
      const mapped = Result.flatMapError(result, () => Result.success(0));

      expect(Result.isSuccess(mapped)).toBe(true);
      if (Result.isSuccess(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });

    test('recovery function is not called for success', () => {
      const recoveryFn = vi.fn(() => Result.success(0));
      const result = Result.success(42);

      Result.flatMapError(result, recoveryFn);

      expect(recoveryFn).not.toHaveBeenCalled();
    });
  });

  describe('recover', () => {
    test('recovers from failure with alternative value', () => {
      const result = Result.failure('error');
      const recovered = Result.recover(result, () => 42);

      expect(Result.isSuccess(recovered)).toBe(true);
      if (Result.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });

    test('uses error in recovery function', () => {
      const result = Result.failure(5);
      const recovered = Result.recover(result, e => e * 2);

      expect(Result.isSuccess(recovered)).toBe(true);
      if (Result.isSuccess(recovered)) {
        expect(recovered.value).toBe(10);
      }
    });

    test('does not call recovery for success', () => {
      const recoveryFn = vi.fn(() => 0);
      const result = Result.success(42);

      const recovered = Result.recover(result, recoveryFn);

      expect(recoveryFn).not.toHaveBeenCalled();
      expect(Result.isSuccess(recovered)).toBe(true);
      if (Result.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });
  });

  describe('ap', () => {
    test('applies function to value when both are success', () => {
      const fnResult = Result.success((x: number) => x * 2);
      const valResult = Result.success(5);
      const result = Result.ap(fnResult, valResult);

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(10);
      }
    });

    test('returns failure when function is failure', () => {
      const fnResult = Result.failure('fn error');
      const valResult = Result.success(5);
      const result = Result.ap(fnResult, valResult);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('fn error');
      }
    });

    test('returns failure when value is failure', () => {
      const fnResult = Result.success((x: number) => x * 2);
      const valResult = Result.failure('val error');
      const result = Result.ap(fnResult, valResult);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('val error');
      }
    });
  });

  describe('map2', () => {
    test('maps two success values', () => {
      const r1 = Result.success(5);
      const r2 = Result.success(3);
      const result = Result.map2(r1, r2, (a, b) => a + b);

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(8);
      }
    });

    test('returns first failure when first is failure', () => {
      const r1 = Result.failure('error1');
      const r2 = Result.success(3);
      const result = Result.map2(r1, r2, (a: number, b: number) => a + b);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error1');
      }
    });

    test('returns second failure when second is failure', () => {
      const r1 = Result.success(5);
      const r2 = Result.failure('error2');
      const result = Result.map2(r1, r2, (a, b: number) => a + b);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error2');
      }
    });
  });

  describe('map3', () => {
    test('maps three success values', () => {
      const r1 = Result.success(5);
      const r2 = Result.success(3);
      const r3 = Result.success(2);
      const result = Result.map3(r1, r2, r3, (a, b, c) => a + b + c);

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(10);
      }
    });

    test('returns first failure when first is failure', () => {
      const r1 = Result.failure('error1');
      const r2 = Result.success(3);
      const r3 = Result.success(2);
      const result = Result.map3(r1, r2, r3, (a: number, b: number, c: number) => a + b + c);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error1');
      }
    });

    test('returns second failure when second is failure', () => {
      const r1 = Result.success(5);
      const r2 = Result.failure('error2');
      const r3 = Result.success(2);
      const result = Result.map3(r1, r2, r3, (a, b: number, c: number) => a + b + c);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error2');
      }
    });

    test('returns third failure when third is failure', () => {
      const r1 = Result.success(5);
      const r2 = Result.success(3);
      const r3 = Result.failure('error3');
      const result = Result.map3(r1, r2, r3, (a, b, c: number) => a + b + c);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error3');
      }
    });
  });

  describe('ofPromise', () => {
    test('returns success for resolved promise', async () => {
      const promise = Promise.resolve(42);
      const result = await Result.ofPromise(promise);

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('returns failure for rejected promise with Error', async () => {
      const error = new Error('test error');
      const promise = Promise.reject(error);
      const result = await Result.ofPromise(promise);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe(error);
      }
    });

    test('returns failure with Error for rejected promise with non-Error', async () => {
      const promise = Promise.reject('string error');
      const result = await Result.ofPromise(promise);

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });
  });

  describe('swap', () => {
    test('swaps success to failure', () => {
      const result = Result.success(42);
      const swapped = Result.swap(result);

      expect(Result.isFailure(swapped)).toBe(true);
      if (Result.isFailure(swapped)) {
        expect(swapped.error).toBe(42);
      }
    });

    test('swaps failure to success', () => {
      const result = Result.failure('error');
      const swapped = Result.swap(result);

      expect(Result.isSuccess(swapped)).toBe(true);
      if (Result.isSuccess(swapped)) {
        expect(swapped.value).toBe('error');
      }
    });
  });

  describe('fromNullable', () => {
    test('returns success for non-null value', () => {
      const result = Result.fromNullable(42, 'error');

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('returns failure for null', () => {
      const result = Result.fromNullable(null, 'error');

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error');
      }
    });

    test('returns failure for undefined', () => {
      const result = Result.fromNullable(undefined, 'error');

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe('error');
      }
    });

    test('returns success for falsy but non-null values', () => {
      expect(Result.isSuccess(Result.fromNullable(0, 'error'))).toBe(true);
      expect(Result.isSuccess(Result.fromNullable('', 'error'))).toBe(true);
      expect(Result.isSuccess(Result.fromNullable(false, 'error'))).toBe(true);
    });
  });

  describe('fromNullableLazy', () => {
    test('returns success for non-null value without calling error function', () => {
      const errorFn = vi.fn(() => 'error');
      const result = Result.fromNullableLazy(42, errorFn);

      expect(Result.isSuccess(result)).toBe(true);
      expect(errorFn).not.toHaveBeenCalled();
    });

    test('returns failure for null and calls error function', () => {
      const errorFn = vi.fn(() => 'lazy error');
      const result = Result.fromNullableLazy(null, errorFn);

      expect(Result.isFailure(result)).toBe(true);
      expect(errorFn).toHaveBeenCalledOnce();
      if (Result.isFailure(result)) {
        expect(result.error).toBe('lazy error');
      }
    });
  });

  describe('tryCatch', () => {
    test('returns success for non-throwing function', () => {
      const result = Result.tryCatch(() => 42);

      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('returns failure for throwing function with Error', () => {
      const error = new Error('test error');
      const result = Result.tryCatch(() => {
        throw error;
      });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe(error);
      }
    });

    test('returns failure with Error for throwing function with non-Error', () => {
      const result = Result.tryCatch(() => {
        throw 'string error';
      });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });
  });
});
