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
    const loadingWithValue = AsyncResult.loading(99);
    const notAsked = AsyncResult.notAsked;

    test('getOrElse returns value for success', () => {
      expect(AsyncResult.getOrElse(success, 0)).toBe(42);
    });

    test('getOrElse returns previousValue for loading with value', () => {
      expect(AsyncResult.getOrElse(loadingWithValue, 0)).toBe(99);
    });

    test('getOrElse returns alternative for non-success states without value', () => {
      expect(AsyncResult.getOrElse(failure, 0)).toBe(0);
      expect(AsyncResult.getOrElse(loading, 0)).toBe(0);
      expect(AsyncResult.getOrElse(notAsked, 0)).toBe(0);
    });

    test('getOrElseLazy returns value for success', () => {
      const altFn = vi.fn(() => 0);
      expect(AsyncResult.getOrElseLazy(success, altFn)).toBe(42);
      expect(altFn).not.toHaveBeenCalled();
    });

    test('getOrElseLazy returns previousValue for loading with value', () => {
      const altFn = vi.fn(() => 0);
      expect(AsyncResult.getOrElseLazy(loadingWithValue, altFn)).toBe(99);
      expect(altFn).not.toHaveBeenCalled();
    });

    test('getOrElseLazy calls alternative function for non-success states without value', () => {
      const altFn = vi.fn(() => 77);
      expect(AsyncResult.getOrElseLazy(failure, altFn)).toBe(77);
      expect(altFn).toHaveBeenCalledOnce();
    });

    test('getOrNull returns value for success', () => {
      expect(AsyncResult.getOrNull(success)).toBe(42);
    });

    test('getOrNull returns previousValue for loading with value', () => {
      expect(AsyncResult.getOrNull(loadingWithValue)).toBe(99);
    });

    test('getOrNull returns null for non-success states without value', () => {
      expect(AsyncResult.getOrNull(failure)).toBe(null);
      expect(AsyncResult.getOrNull(loading)).toBe(null);
      expect(AsyncResult.getOrNull(notAsked)).toBe(null);
    });

    test('getOrUndefined returns value for success', () => {
      expect(AsyncResult.getOrUndefined(success)).toBe(42);
    });

    test('getOrUndefined returns previousValue for loading with value', () => {
      expect(AsyncResult.getOrUndefined(loadingWithValue)).toBe(99);
    });

    test('getOrUndefined returns undefined for non-success states without value', () => {
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

    test('returns previousValue for loading with value', () => {
      const loadingWithValue = AsyncResult.loading(99);
      expect(AsyncResult.getUnsafe(loadingWithValue)).toBe(99);
    });

    test('throws error for failure', () => {
      const error = new Error('test error');
      const failure = AsyncResult.failure(error);
      expect(() => AsyncResult.getUnsafe(failure)).toThrow(error);
    });

    test('throws error for loading state without value', () => {
      const loading = AsyncResult.loading();
      expect(() => AsyncResult.getUnsafe(loading)).toThrow('Cannot get value from a not-asked or loading result without previous value');
    });

    test('throws error for notAsked state', () => {
      const notAsked = AsyncResult.notAsked;
      expect(() => AsyncResult.getUnsafe(notAsked)).toThrow('Cannot get value from a not-asked or loading result without previous value');
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

  describe('effect', () => {
    test('calls success handler for AsyncSuccess', () => {
      const success = AsyncResult.success(42);
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
        loading: vi.fn(),
        notAsked: vi.fn(),
      };
      const result = AsyncResult.effect(success, handlers);

      expect(handlers.success).toHaveBeenCalledWith(42);
      expect(handlers.failure).not.toHaveBeenCalled();
      expect(handlers.loading).not.toHaveBeenCalled();
      expect(handlers.notAsked).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('calls failure handler for AsyncFailure', () => {
      const failure = AsyncResult.failure('error');
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
        loading: vi.fn(),
        notAsked: vi.fn(),
      };
      const result = AsyncResult.effect(failure, handlers);

      expect(handlers.success).not.toHaveBeenCalled();
      expect(handlers.failure).toHaveBeenCalledWith('error');
      expect(handlers.loading).not.toHaveBeenCalled();
      expect(handlers.notAsked).not.toHaveBeenCalled();
      expect(result).toBe(failure);
    });

    test('calls loading handler for Loading', () => {
      const loading = AsyncResult.loading('previous');
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
        loading: vi.fn(),
        notAsked: vi.fn(),
      };
      const result = AsyncResult.effect(loading, handlers);

      expect(handlers.success).not.toHaveBeenCalled();
      expect(handlers.failure).not.toHaveBeenCalled();
      expect(handlers.loading).toHaveBeenCalledWith('previous');
      expect(handlers.notAsked).not.toHaveBeenCalled();
      expect(result).toBe(loading);
    });

    test('calls notAsked handler for NotAsked', () => {
      const notAsked = AsyncResult.notAsked;
      const handlers = {
        success: vi.fn(),
        failure: vi.fn(),
        loading: vi.fn(),
        notAsked: vi.fn(),
      };
      const result = AsyncResult.effect(notAsked, handlers);

      expect(handlers.success).not.toHaveBeenCalled();
      expect(handlers.failure).not.toHaveBeenCalled();
      expect(handlers.loading).not.toHaveBeenCalled();
      expect(handlers.notAsked).toHaveBeenCalled();
      expect(result).toBe(notAsked);
    });

    test('works with only some handlers provided', () => {
      const success = AsyncResult.success(42);
      const successHandler = vi.fn();
      const result = AsyncResult.effect(success, { success: successHandler });

      expect(successHandler).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('works with no handlers provided', () => {
      const success = AsyncResult.success(42);
      const result = AsyncResult.effect(success, {});

      expect(result).toBe(success);
    });

    test('can be chained', () => {
      const success = AsyncResult.success(42);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const result = AsyncResult.effect(
        AsyncResult.effect(success, { success: handler1 }),
        { success: handler2 }
      );

      expect(handler1).toHaveBeenCalledWith(42);
      expect(handler2).toHaveBeenCalledWith(42);
      expect(result).toBe(success);
    });

    test('calls else handler when no specific handler for success', () => {
      const success = AsyncResult.success(42);
      const elseHandler = vi.fn();
      const result = AsyncResult.effect(success, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('calls else handler when no specific handler for failure', () => {
      const failure = AsyncResult.failure('error');
      const elseHandler = vi.fn();
      const result = AsyncResult.effect(failure, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(failure);
    });

    test('calls else handler when no specific handler for loading', () => {
      const loading = AsyncResult.loading('prev');
      const elseHandler = vi.fn();
      const result = AsyncResult.effect(loading, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(loading);
    });

    test('calls else handler when no specific handler for notAsked', () => {
      const notAsked = AsyncResult.notAsked;
      const elseHandler = vi.fn();
      const result = AsyncResult.effect(notAsked, { else: elseHandler });

      expect(elseHandler).toHaveBeenCalled();
      expect(result).toBe(notAsked);
    });

    test('does not call else handler when specific handler is provided', () => {
      const success = AsyncResult.success(42);
      const successHandler = vi.fn();
      const elseHandler = vi.fn();
      const result = AsyncResult.effect(success, { success: successHandler, else: elseHandler });

      expect(successHandler).toHaveBeenCalledWith(42);
      expect(elseHandler).not.toHaveBeenCalled();
      expect(result).toBe(success);
    });

    test('else handler works as fallback for unhandled states', () => {
      const success = AsyncResult.success(42);
      const failure = AsyncResult.failure('error');
      const successHandler = vi.fn();
      const elseHandler = vi.fn();

      AsyncResult.effect(success, { success: successHandler, else: elseHandler });
      expect(successHandler).toHaveBeenCalledWith(42);
      expect(elseHandler).not.toHaveBeenCalled();

      successHandler.mockClear();
      elseHandler.mockClear();

      AsyncResult.effect(failure, { success: successHandler, else: elseHandler });
      expect(successHandler).not.toHaveBeenCalled();
      expect(elseHandler).toHaveBeenCalled();
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

  describe('map', () => {
    test('maps success values', () => {
      const result = AsyncResult.success(5);
      const mapped = AsyncResult.map(result, x => x * 2);

      expect(AsyncResult.isSuccess(mapped)).toBe(true);
      if (AsyncResult.isSuccess(mapped)) {
        expect(mapped.value).toBe(10);
      }
    });

    test('does not map failure values', () => {
      const result = AsyncResult.failure('error');
      const mapped = AsyncResult.map(result, (x: number) => x * 2);

      expect(AsyncResult.isFailure(mapped)).toBe(true);
      if (AsyncResult.isFailure(mapped)) {
        expect(mapped.error).toBe('error');
      }
    });

    test('preserves notAsked state', () => {
      const result = AsyncResult.notAsked;
      const mapped = AsyncResult.map(result, (x: number) => x * 2);

      expect(AsyncResult.isNotAsked(mapped)).toBe(true);
    });

    test('maps loading state with previous value', () => {
      const result = AsyncResult.loading(5);
      const mapped = AsyncResult.map(result, x => x * 2);

      expect(AsyncResult.isLoading(mapped)).toBe(true);
      if (AsyncResult.isLoading(mapped)) {
        expect(mapped.previousValue).toBe(10);
      }
    });

    test('maps loading state without previous value', () => {
      const result = AsyncResult.loading<number>();
      const mapped = AsyncResult.map(result, x => x * 2);

      expect(AsyncResult.isLoading(mapped)).toBe(true);
      if (AsyncResult.isLoading(mapped)) {
        expect(mapped.previousValue).toBeUndefined();
      }
    });

    test('can change value type', () => {
      const result = AsyncResult.success(42);
      const mapped = AsyncResult.map(result, x => `Number: ${x}`);

      expect(AsyncResult.isSuccess(mapped)).toBe(true);
      if (AsyncResult.isSuccess(mapped)) {
        expect(mapped.value).toBe('Number: 42');
      }
    });

    test('mapping function is not called for failures', () => {
      const mapFn = vi.fn((x: number) => x * 2);
      const result = AsyncResult.failure('error');

      AsyncResult.map(result, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  describe('flatMap', () => {
    test('flat maps success values', () => {
      const result = AsyncResult.success(5);
      const flatMapped = AsyncResult.flatMap(result, x => AsyncResult.success(x * 2));

      expect(AsyncResult.isSuccess(flatMapped)).toBe(true);
      if (AsyncResult.isSuccess(flatMapped)) {
        expect(flatMapped.value).toBe(10);
      }
    });

    test('flat maps to failure', () => {
      const result = AsyncResult.success(5);
      const flatMapped = AsyncResult.flatMap(result, x => AsyncResult.failure(`Error: ${x}`));

      expect(AsyncResult.isFailure(flatMapped)).toBe(true);
      if (AsyncResult.isFailure(flatMapped)) {
        expect(flatMapped.error).toBe('Error: 5');
      }
    });

    test('does not flat map failure values', () => {
      const result = AsyncResult.failure('original error');
      const flatMapped = AsyncResult.flatMap(result, (x: number) => AsyncResult.success(x * 2));

      expect(AsyncResult.isFailure(flatMapped)).toBe(true);
      if (AsyncResult.isFailure(flatMapped)) {
        expect(flatMapped.error).toBe('original error');
      }
    });

    test('preserves notAsked state', () => {
      const result = AsyncResult.notAsked;
      const flatMapped = AsyncResult.flatMap(result, (x: number) => AsyncResult.success(x * 2));

      expect(AsyncResult.isNotAsked(flatMapped)).toBe(true);
    });

    test('returns loading for loading state', () => {
      const result = AsyncResult.loading(5);
      const flatMapped = AsyncResult.flatMap(result, x => AsyncResult.success(x * 2));

      expect(AsyncResult.isLoading(flatMapped)).toBe(true);
    });

    test('flat mapping function is not called for failures', () => {
      const flatMapFn = vi.fn((x: number) => AsyncResult.success(x * 2));
      const result = AsyncResult.failure('error');

      AsyncResult.flatMap(result, flatMapFn);

      expect(flatMapFn).not.toHaveBeenCalled();
    });

    test('can chain multiple flat maps', () => {
      const result = AsyncResult.success(5);
      const chained = AsyncResult.flatMap(
        AsyncResult.flatMap(result, x => AsyncResult.success(x * 2)),
        x => AsyncResult.success(x + 1)
      );

      expect(AsyncResult.isSuccess(chained)).toBe(true);
      if (AsyncResult.isSuccess(chained)) {
        expect(chained.value).toBe(11); // (5 * 2) + 1
      }
    });
  });

  describe('mapError', () => {
    test('maps error values', () => {
      const result = AsyncResult.failure('error');
      const mapped = AsyncResult.mapError(result, e => `Mapped: ${e}`);

      expect(AsyncResult.isFailure(mapped)).toBe(true);
      if (AsyncResult.isFailure(mapped)) {
        expect(mapped.error).toBe('Mapped: error');
      }
    });

    test('does not map success values', () => {
      const result = AsyncResult.success(42);
      const mapped = AsyncResult.mapError(result, (e: string) => `Mapped: ${e}`);

      expect(AsyncResult.isSuccess(mapped)).toBe(true);
      if (AsyncResult.isSuccess(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });

    test('preserves notAsked state', () => {
      const result = AsyncResult.notAsked;
      const mapped = AsyncResult.mapError(result, (e: string) => `Mapped: ${e}`);

      expect(AsyncResult.isNotAsked(mapped)).toBe(true);
    });

    test('preserves loading state with previous value', () => {
      const result = AsyncResult.loading(5);
      const mapped = AsyncResult.mapError(result, (e: string) => `Mapped: ${e}`);

      expect(AsyncResult.isLoading(mapped)).toBe(true);
      if (AsyncResult.isLoading(mapped)) {
        expect(mapped.previousValue).toBe(5);
      }
    });

    test('can change error type', () => {
      const result = AsyncResult.failure('error');
      const mapped = AsyncResult.mapError(result, () => ({ code: 500 }));

      expect(AsyncResult.isFailure(mapped)).toBe(true);
      if (AsyncResult.isFailure(mapped)) {
        expect(mapped.error).toEqual({ code: 500 });
      }
    });

    test('mapping function is not called for success', () => {
      const mapFn = vi.fn((e: string) => `Mapped: ${e}`);
      const result = AsyncResult.success(42);

      AsyncResult.mapError(result, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
    });
  });

  describe('flatMapError', () => {
    test('flat maps error to success (recovery)', () => {
      const result = AsyncResult.failure('error');
      const recovered = AsyncResult.flatMapError(result, () => AsyncResult.success(42));

      expect(AsyncResult.isSuccess(recovered)).toBe(true);
      if (AsyncResult.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });

    test('flat maps error to different error', () => {
      const result = AsyncResult.failure('error');
      const mapped = AsyncResult.flatMapError(result, e => AsyncResult.failure(`Wrapped: ${e}`));

      expect(AsyncResult.isFailure(mapped)).toBe(true);
      if (AsyncResult.isFailure(mapped)) {
        expect(mapped.error).toBe('Wrapped: error');
      }
    });

    test('does not flat map success values', () => {
      const result = AsyncResult.success(42);
      const mapped = AsyncResult.flatMapError(result, () => AsyncResult.success(0));

      expect(AsyncResult.isSuccess(mapped)).toBe(true);
      if (AsyncResult.isSuccess(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });

    test('preserves notAsked state', () => {
      const result = AsyncResult.notAsked;
      const mapped = AsyncResult.flatMapError(result, () => AsyncResult.success(0));

      expect(AsyncResult.isNotAsked(mapped)).toBe(true);
    });

    test('preserves loading state with previous value', () => {
      const result = AsyncResult.loading(5);
      const mapped = AsyncResult.flatMapError(result, () => AsyncResult.success(0));

      expect(AsyncResult.isLoading(mapped)).toBe(true);
      if (AsyncResult.isLoading(mapped)) {
        expect(mapped.previousValue).toBe(5);
      }
    });

    test('recovery function is not called for success', () => {
      const recoveryFn = vi.fn(() => AsyncResult.success(0));
      const result = AsyncResult.success(42);

      AsyncResult.flatMapError(result, recoveryFn);

      expect(recoveryFn).not.toHaveBeenCalled();
    });
  });

  describe('toResult', () => {
    test('converts success to Result success', () => {
      const asyncResult = AsyncResult.success(42);
      const result = AsyncResult.toResult(asyncResult);

      expect(result).toEqual({ type: 'Success', value: 42 });
    });

    test('converts failure to Result failure', () => {
      const asyncResult = AsyncResult.failure('error');
      const result = AsyncResult.toResult(asyncResult);

      expect(result).toEqual({ type: 'Failure', error: 'error' });
    });

    test('returns undefined for notAsked', () => {
      const asyncResult = AsyncResult.notAsked;
      const result = AsyncResult.toResult(asyncResult);

      expect(result).toBeUndefined();
    });

    test('returns undefined for loading', () => {
      const asyncResult = AsyncResult.loading(5);
      const result = AsyncResult.toResult(asyncResult);

      expect(result).toBeUndefined();
    });
  });

  describe('isSettled', () => {
    test('returns true for success', () => {
      expect(AsyncResult.isSettled(AsyncResult.success(42))).toBe(true);
    });

    test('returns true for failure', () => {
      expect(AsyncResult.isSettled(AsyncResult.failure('error'))).toBe(true);
    });

    test('returns false for notAsked', () => {
      expect(AsyncResult.isSettled(AsyncResult.notAsked)).toBe(false);
    });

    test('returns false for loading', () => {
      expect(AsyncResult.isSettled(AsyncResult.loading())).toBe(false);
    });
  });

  describe('recover', () => {
    test('recovers from failure with alternative value', () => {
      const result = AsyncResult.failure('error');
      const recovered = AsyncResult.recover(result, () => 42);

      expect(AsyncResult.isSuccess(recovered)).toBe(true);
      if (AsyncResult.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });

    test('uses error in recovery function', () => {
      const result = AsyncResult.failure(5);
      const recovered = AsyncResult.recover(result, e => e * 2);

      expect(AsyncResult.isSuccess(recovered)).toBe(true);
      if (AsyncResult.isSuccess(recovered)) {
        expect(recovered.value).toBe(10);
      }
    });

    test('does not call recovery for success', () => {
      const recoveryFn = vi.fn(() => 0);
      const result = AsyncResult.success(42);

      const recovered = AsyncResult.recover(result, recoveryFn);

      expect(recoveryFn).not.toHaveBeenCalled();
      expect(AsyncResult.isSuccess(recovered)).toBe(true);
      if (AsyncResult.isSuccess(recovered)) {
        expect(recovered.value).toBe(42);
      }
    });

    test('preserves notAsked state', () => {
      const result = AsyncResult.notAsked;
      const recovered = AsyncResult.recover(result, () => 0);

      expect(AsyncResult.isNotAsked(recovered)).toBe(true);
    });

    test('preserves loading state', () => {
      const result = AsyncResult.loading(5);
      const recovered = AsyncResult.recover(result, () => 0);

      expect(AsyncResult.isLoading(recovered)).toBe(true);
      if (AsyncResult.isLoading(recovered)) {
        expect(recovered.previousValue).toBe(5);
      }
    });
  });

  describe('ap', () => {
    test('applies function to value when both are success', () => {
      const fnResult = AsyncResult.success((x: number) => x * 2);
      const valResult = AsyncResult.success(5);
      const result = AsyncResult.ap(fnResult, valResult);

      expect(AsyncResult.isSuccess(result)).toBe(true);
      if (AsyncResult.isSuccess(result)) {
        expect(result.value).toBe(10);
      }
    });

    test('returns failure when function is failure', () => {
      const fnResult = AsyncResult.failure('fn error');
      const valResult = AsyncResult.success(5);
      const result = AsyncResult.ap(fnResult, valResult);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('fn error');
      }
    });

    test('returns failure when value is failure', () => {
      const fnResult = AsyncResult.success((x: number) => x * 2);
      const valResult = AsyncResult.failure('val error');
      const result = AsyncResult.ap(fnResult, valResult);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('val error');
      }
    });

    test('returns loading when either is loading', () => {
      const fnResult = AsyncResult.success((x: number) => x * 2);
      const valResult = AsyncResult.loading<number>();
      const result = AsyncResult.ap(fnResult, valResult);

      expect(AsyncResult.isLoading(result)).toBe(true);
    });

    test('returns notAsked when either is notAsked and neither loading', () => {
      const fnResult = AsyncResult.notAsked as AsyncResult<(x: number) => number, string>;
      const valResult = AsyncResult.success(5);
      const result = AsyncResult.ap(fnResult, valResult);

      expect(AsyncResult.isNotAsked(result)).toBe(true);
    });
  });

  describe('map2', () => {
    test('maps two success values', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.success(3);
      const result = AsyncResult.map2(r1, r2, (a, b) => a + b);

      expect(AsyncResult.isSuccess(result)).toBe(true);
      if (AsyncResult.isSuccess(result)) {
        expect(result.value).toBe(8);
      }
    });

    test('returns first failure when first is failure', () => {
      const r1 = AsyncResult.failure('error1');
      const r2 = AsyncResult.success(3);
      const result = AsyncResult.map2(r1, r2, (a: number, b: number) => a + b);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('error1');
      }
    });

    test('returns second failure when second is failure', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.failure('error2');
      const result = AsyncResult.map2(r1, r2, (a, b: number) => a + b);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('error2');
      }
    });

    test('returns loading when either is loading', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.loading<number>();
      const result = AsyncResult.map2(r1, r2, (a, b) => a + b);

      expect(AsyncResult.isLoading(result)).toBe(true);
    });

    test('returns notAsked when either is notAsked and neither loading', () => {
      const r1 = AsyncResult.notAsked as AsyncResult<number, string>;
      const r2 = AsyncResult.success(3);
      const result = AsyncResult.map2(r1, r2, (a, b) => a + b);

      expect(AsyncResult.isNotAsked(result)).toBe(true);
    });
  });

  describe('map3', () => {
    test('maps three success values', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.success(3);
      const r3 = AsyncResult.success(2);
      const result = AsyncResult.map3(r1, r2, r3, (a, b, c) => a + b + c);

      expect(AsyncResult.isSuccess(result)).toBe(true);
      if (AsyncResult.isSuccess(result)) {
        expect(result.value).toBe(10);
      }
    });

    test('returns first failure when first is failure', () => {
      const r1 = AsyncResult.failure('error1');
      const r2 = AsyncResult.success(3);
      const r3 = AsyncResult.success(2);
      const result = AsyncResult.map3(r1, r2, r3, (a: number, b: number, c: number) => a + b + c);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('error1');
      }
    });

    test('returns second failure when second is failure', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.failure('error2');
      const r3 = AsyncResult.success(2);
      const result = AsyncResult.map3(r1, r2, r3, (a, b: number, c: number) => a + b + c);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('error2');
      }
    });

    test('returns third failure when third is failure', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.success(3);
      const r3 = AsyncResult.failure('error3');
      const result = AsyncResult.map3(r1, r2, r3, (a, b, c: number) => a + b + c);

      expect(AsyncResult.isFailure(result)).toBe(true);
      if (AsyncResult.isFailure(result)) {
        expect(result.error).toBe('error3');
      }
    });

    test('returns loading when any is loading', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.loading<number>();
      const r3 = AsyncResult.success(2);
      const result = AsyncResult.map3(r1, r2, r3, (a, b, c) => a + b + c);

      expect(AsyncResult.isLoading(result)).toBe(true);
    });

    test('returns notAsked when any is notAsked and none loading', () => {
      const r1 = AsyncResult.success(5);
      const r2 = AsyncResult.success(3);
      const r3 = AsyncResult.notAsked as AsyncResult<number, string>;
      const result = AsyncResult.map3(r1, r2, r3, (a, b, c) => a + b + c);

      expect(AsyncResult.isNotAsked(result)).toBe(true);
    });
  });
});
