import { describe, expect, test, vi } from "vitest";
import {
  AsyncResult,
  NotAsked,
  Loading,
  AsyncSuccess,
  AsyncFailure,
} from '../src/async-result';

describe('AsyncResult', () => {
  describe('Type constructors', () => {
    test('notAsked creates NotAsked state', () => {
      const result = AsyncResult.notAsked;
      expect(result).toEqual({ type: 'NotAsked' });
      expect(AsyncResult.isNotAsked(result)).toBe(true);
    });

    test('loading creates Loading state without previous value', () => {
      const result = AsyncResult.loading();
      expect(result).toEqual({ type: 'Loading', previousValue: undefined });
      expect(AsyncResult.isLoading(result)).toBe(true);
    });

    test('loading creates Loading state with previous value', () => {
      const result = AsyncResult.loading('previous');
      expect(result).toEqual({ type: 'Loading', previousValue: 'previous' });
      expect(AsyncResult.isLoading(result)).toBe(true);
    });

    test('success creates AsyncSuccess state', () => {
      const result = AsyncResult.success(42);
      expect(result).toEqual({ type: 'AsyncSuccess', value: 42 });
      expect(AsyncResult.isSuccess(result)).toBe(true);
    });

    test('failure creates AsyncFailure state', () => {
      const error = new Error('test error');
      const result = AsyncResult.failure(error);
      expect(result).toEqual({ type: 'AsyncFailure', error });
      expect(AsyncResult.isFailure(result)).toBe(true);
    });
  });

  describe('Type guards', () => {
    const notAsked = AsyncResult.notAsked;
    const loading = AsyncResult.loading('prev');
    const success = AsyncResult.success(42);
    const failure = AsyncResult.failure('error');

    test('isNotAsked correctly identifies NotAsked state', () => {
      expect(AsyncResult.isNotAsked(notAsked)).toBe(true);
      expect(AsyncResult.isNotAsked(loading)).toBe(false);
      expect(AsyncResult.isNotAsked(success)).toBe(false);
      expect(AsyncResult.isNotAsked(failure)).toBe(false);
    });

    test('isLoading correctly identifies Loading state', () => {
      expect(AsyncResult.isLoading(notAsked)).toBe(false);
      expect(AsyncResult.isLoading(loading)).toBe(true);
      expect(AsyncResult.isLoading(success)).toBe(false);
      expect(AsyncResult.isLoading(failure)).toBe(false);
    });

    test('isSuccess correctly identifies AsyncSuccess state', () => {
      expect(AsyncResult.isSuccess(notAsked)).toBe(false);
      expect(AsyncResult.isSuccess(loading)).toBe(false);
      expect(AsyncResult.isSuccess(success)).toBe(true);
      expect(AsyncResult.isSuccess(failure)).toBe(false);
    });

    test('isFailure correctly identifies AsyncFailure state', () => {
      expect(AsyncResult.isFailure(notAsked)).toBe(false);
      expect(AsyncResult.isFailure(loading)).toBe(false);
      expect(AsyncResult.isFailure(success)).toBe(false);
      expect(AsyncResult.isFailure(failure)).toBe(true);
    });
  });

  describe('Value extraction', () => {
    const success = AsyncResult.success(42);
    const failure = AsyncResult.failure('error');
    const loading = AsyncResult.loading();
    const notAsked = AsyncResult.notAsked;

    test('getOrElse returns value for success', () => {
      expect(AsyncResult.getOrElse(success, 0)).toBe(42);
    });

    test('getOrElse returns alternative for non-success states', () => {
      expect(AsyncResult.getOrElse(failure, 0)).toBe(0);
      expect(AsyncResult.getOrElse(loading, 0)).toBe(0);
      expect(AsyncResult.getOrElse(notAsked, 0)).toBe(0);
    });

    test('getOrElseLazy returns value for success', () => {
      const altFn = vi.fn(() => 0);
      expect(AsyncResult.getOrElseLazy(success, altFn)).toBe(42);
      expect(altFn).not.toHaveBeenCalled();
    });

    test('getOrElseLazy calls alternative function for non-success states', () => {
      const altFn = vi.fn(() => 99);
      expect(AsyncResult.getOrElseLazy(failure, altFn)).toBe(99);
      expect(altFn).toHaveBeenCalledOnce();
    });

    test('getOrNull returns value for success', () => {
      expect(AsyncResult.getOrNull(success)).toBe(42);
    });

    test('getOrNull returns null for non-success states', () => {
      expect(AsyncResult.getOrNull(failure)).toBe(null);
      expect(AsyncResult.getOrNull(loading)).toBe(null);
      expect(AsyncResult.getOrNull(notAsked)).toBe(null);
    });

    test('getOrUndefined returns value for success', () => {
      expect(AsyncResult.getOrUndefined(success)).toBe(42);
    });

    test('getOrUndefined returns undefined for non-success states', () => {
      expect(AsyncResult.getOrUndefined(failure)).toBe(undefined);
      expect(AsyncResult.getOrUndefined(loading)).toBe(undefined);
      expect(AsyncResult.getOrUndefined(notAsked)).toBe(undefined);
    });
  });

  describe('getUnsafe', () => {
    test('returns value for success', () => {
      const success = AsyncResult.success(42);
      expect(AsyncResult.getUnsafe(success)).toBe(42);
    });

    test('throws error for failure', () => {
      const error = new Error('test error');
      const failure = AsyncResult.failure(error);
      expect(() => AsyncResult.getUnsafe(failure)).toThrow(error);
    });

    test('throws error for loading state', () => {
      const loading = AsyncResult.loading();
      expect(() => AsyncResult.getUnsafe(loading)).toThrow('Cannot get value from a not-asked or loading result');
    });

    test('throws error for notAsked state', () => {
      const notAsked = AsyncResult.notAsked;
      expect(() => AsyncResult.getUnsafe(notAsked)).toThrow('Cannot get value from a not-asked or loading result');
    });
  });

  describe('match', () => {
    test('calls success function for AsyncSuccess', () => {
      const success = AsyncResult.success(42);
      const result = AsyncResult.match(success, {
        success: (value) => `Success: ${value}`,
        failure: (error) => `Error: ${error}`,
        loading: (prev) => `Loading: ${prev}`,
        notAsked: () => 'Not asked',
      });
      expect(result).toBe('Success: 42');
    });

    test('calls failure function for AsyncFailure', () => {
      const failure = AsyncResult.failure('test error');
      const result = AsyncResult.match(failure, {
        success: (value) => `Success: ${value}`,
        failure: (error) => `Error: ${error}`,
        loading: (prev) => `Loading: ${prev}`,
        notAsked: () => 'Not asked',
      });
      expect(result).toBe('Error: test error');
    });

    test('calls loading function for Loading', () => {
      const loading = AsyncResult.loading('previous');
      const result = AsyncResult.match(loading, {
        success: (value) => `Success: ${value}`,
        failure: (error) => `Error: ${error}`,
        loading: (prev) => `Loading: ${prev}`,
        notAsked: () => 'Not asked',
      });
      expect(result).toBe('Loading: previous');
    });

    test('calls notAsked function for NotAsked', () => {
      const notAsked = AsyncResult.notAsked;
      const result = AsyncResult.match(notAsked, {
        success: (value) => `Success: ${value}`,
        failure: (error) => `Error: ${error}`,
        loading: (prev) => `Loading: ${prev}`,
        notAsked: () => 'Not asked',
      });
      expect(result).toBe('Not asked');
    });

    test('uses loading function as default for notAsked when notAsked not provided', () => {
      const notAsked = AsyncResult.notAsked;
      const result = AsyncResult.match(notAsked, {
        success: (value) => `Success: ${value}`,
        failure: (error) => `Error: ${error}`,
        loading: (prev) => `Loading: ${prev}`,
      });
      expect(result).toBe('Loading: undefined');
    });
  });

  describe('whenSuccess', () => {
    test('calls function for success and returns original result', () => {
      const success = AsyncResult.success(42);
      const mockFn = vi.fn();
      const result = AsyncResult.whenSuccess(success, mockFn);

      expect(mockFn).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('does not call function for non-success states', () => {
      const failure = AsyncResult.failure('error');
      const loading = AsyncResult.loading();
      const notAsked = AsyncResult.notAsked;
      const mockFn = vi.fn();

      AsyncResult.whenSuccess(failure, mockFn);
      AsyncResult.whenSuccess(loading, mockFn);
      AsyncResult.whenSuccess(notAsked, mockFn);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('whenFailure', () => {
    test('calls function for failure and returns original result', () => {
      const failure = AsyncResult.failure('test error');
      const mockFn = vi.fn();
      const result = AsyncResult.whenFailure(failure, mockFn);

      expect(mockFn).toHaveBeenCalledWith('test error');
      expect(result).toBe(failure);
    });

    test('does not call function for non-failure states', () => {
      const success = AsyncResult.success(42);
      const loading = AsyncResult.loading();
      const notAsked = AsyncResult.notAsked;
      const mockFn = vi.fn();

      AsyncResult.whenFailure(success, mockFn);
      AsyncResult.whenFailure(loading, mockFn);
      AsyncResult.whenFailure(notAsked, mockFn);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    test('returns true for equal AsyncSuccess results with default equality', () => {
      const success1 = AsyncResult.success(42);
      const success2 = AsyncResult.success(42);
      expect(AsyncResult.equals(success1, success2)).toBe(true);
    });

    test('returns false for different AsyncSuccess results with default equality', () => {
      const success1 = AsyncResult.success(42);
      const success2 = AsyncResult.success(43);
      expect(AsyncResult.equals(success1, success2)).toBe(false);
    });

    test('returns true for equal AsyncFailure results with default equality', () => {
      const failure1 = AsyncResult.failure('error');
      const failure2 = AsyncResult.failure('error');
      expect(AsyncResult.equals(failure1, failure2)).toBe(true);
    });

    test('returns false for different AsyncFailure results with default equality', () => {
      const failure1 = AsyncResult.failure('error1');
      const failure2 = AsyncResult.failure('error2');
      expect(AsyncResult.equals(failure1, failure2)).toBe(false);
    });

    test('returns true for equal Loading results with default equality', () => {
      const loading1 = AsyncResult.loading('prev');
      const loading2 = AsyncResult.loading('prev');
      expect(AsyncResult.equals(loading1, loading2)).toBe(true);
    });

    test('returns true for NotAsked results', () => {
      const notAsked1 = AsyncResult.notAsked;
      const notAsked2 = AsyncResult.notAsked;
      expect(AsyncResult.equals(notAsked1, notAsked2)).toBe(true);
    });

    test('returns false for different types', () => {
      const success = AsyncResult.success(42);
      const failure = AsyncResult.failure('error');
      const loading = AsyncResult.loading();
      const notAsked = AsyncResult.notAsked;

      expect(AsyncResult.equals(success, failure)).toBe(false);
      expect(AsyncResult.equals(success, loading)).toBe(false);
      expect(AsyncResult.equals(success, notAsked)).toBe(false);
      expect(AsyncResult.equals(failure, loading)).toBe(false);
      expect(AsyncResult.equals(failure, notAsked)).toBe(false);
      expect(AsyncResult.equals(loading, notAsked)).toBe(false);
    });

    test('uses custom equality functions', () => {
      const obj1 = { id: 1, name: 'test' };
      const obj2 = { id: 1, name: 'test' };
      const success1 = AsyncResult.success(obj1);
      const success2 = AsyncResult.success(obj2);

      // Default equality (reference equality) should return false
      expect(AsyncResult.equals(success1, success2)).toBe(false);

      // Custom equality should return true
      expect(AsyncResult.equals(success1, success2, {
        valueEquals: (v1, v2) => v1.id === v2.id && v1.name === v2.name,
        errorEquals: (e1, e2) => e1 === e2,
      })).toBe(true);
    });
  });

  describe('all', () => {
    test('returns success with all values when all results are success', () => {
      const results = [
        AsyncResult.success(1),
        AsyncResult.success(2),
        AsyncResult.success(3),
      ];
      const combined = AsyncResult.all(results);
      expect(combined).toEqual(AsyncResult.success([1, 2, 3]));
    });

    test('returns first failure when any result is failure', () => {
      const failure = AsyncResult.failure('error');
      const results = [
        AsyncResult.success(1),
        failure,
        AsyncResult.success(3),
      ];
      const combined = AsyncResult.all(results);
      expect(combined).toBe(failure);
    });

    test('returns first non-success when any result is not success', () => {
      const loading = AsyncResult.loading();
      const results = [
        AsyncResult.success(1),
        loading,
        AsyncResult.success(3),
      ];
      const combined = AsyncResult.all(results);
      expect(combined).toBe(loading);
    });

    test('returns success with empty array for empty input', () => {
      const results: AsyncResult<number, string>[] = [];
      const combined = AsyncResult.all(results);
      expect(combined).toEqual(AsyncResult.success([]));
    });
  });

  describe('ofPromise', () => {
    test('returns success for resolved promise', async () => {
      const promise = Promise.resolve(42);
      const result = await AsyncResult.ofPromise(promise);
      expect(result).toEqual(AsyncResult.success(42));
    });

    test('returns failure for rejected promise with Error', async () => {
      const error = new Error('test error');
      const promise = Promise.reject(error);
      const result = await AsyncResult.ofPromise(promise);
      expect(result).toEqual(AsyncResult.failure(error));
    });

    test('returns failure with Error for rejected promise with non-Error', async () => {
      const promise = Promise.reject('string error');
      const result = await AsyncResult.ofPromise(promise);
      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });

    test('returns failure with Error for rejected promise with null', async () => {
      const promise = Promise.reject(null);
      const result = await AsyncResult.ofPromise(promise);
      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('null');
      }
    });
  });
});
