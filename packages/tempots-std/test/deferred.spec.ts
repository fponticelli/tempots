import { describe, expect, test, vi } from "vitest";
import { deferred } from '../src/deferred';

describe('deferred', () => {
  test('creates a deferred object with promise, resolve, and reject', () => {
    const { promise, resolve, reject } = deferred<number>();

    expect(promise).toBeInstanceOf(Promise);
    expect(typeof resolve).toBe('function');
    expect(typeof reject).toBe('function');
  });

  test('resolves the promise when resolve is called', async () => {
    const { promise, resolve } = deferred<string>();
    const value = 'test value';

    resolve(value);

    const result = await promise;
    expect(result).toBe(value);
  });

  test('rejects the promise when reject is called', async () => {
    const { promise, reject } = deferred<number>();
    const error = new Error('test error');

    reject(error);

    await expect(promise).rejects.toThrow(error);
  });

  test('can resolve with different types', async () => {
    // Test with number
    const numberDeferred = deferred<number>();
    numberDeferred.resolve(42);
    expect(await numberDeferred.promise).toBe(42);

    // Test with object
    const objectDeferred = deferred<{ id: number; name: string }>();
    const obj = { id: 1, name: 'test' };
    objectDeferred.resolve(obj);
    expect(await objectDeferred.promise).toEqual(obj);

    // Test with array
    const arrayDeferred = deferred<number[]>();
    const arr = [1, 2, 3];
    arrayDeferred.resolve(arr);
    expect(await arrayDeferred.promise).toEqual(arr);

    // Test with null
    const nullDeferred = deferred<null>();
    nullDeferred.resolve(null);
    expect(await nullDeferred.promise).toBe(null);

    // Test with undefined
    const undefinedDeferred = deferred<undefined>();
    undefinedDeferred.resolve(undefined);
    expect(await undefinedDeferred.promise).toBe(undefined);
  });

  test('can reject with different error types', async () => {
    // Test with Error object
    const errorDeferred = deferred<number>();
    const error = new Error('test error');
    errorDeferred.reject(error);
    await expect(errorDeferred.promise).rejects.toThrow(error);

    // Test with string
    const stringDeferred = deferred<number>();
    const stringError = 'string error';
    stringDeferred.reject(stringError);
    await expect(stringDeferred.promise).rejects.toBe(stringError);

    // Test with custom error object
    const customDeferred = deferred<number>();
    const customError = { code: 404, message: 'Not found' };
    customDeferred.reject(customError);
    await expect(customDeferred.promise).rejects.toEqual(customError);

    // Test with undefined
    const undefinedDeferred = deferred<number>();
    undefinedDeferred.reject(undefined);
    await expect(undefinedDeferred.promise).rejects.toBe(undefined);
  });

  test('promise can be awaited multiple times after resolution', async () => {
    const { promise, resolve } = deferred<string>();
    const value = 'shared value';

    resolve(value);

    // Multiple awaits should all return the same value
    const result1 = await promise;
    const result2 = await promise;
    const result3 = await promise;

    expect(result1).toBe(value);
    expect(result2).toBe(value);
    expect(result3).toBe(value);
  });

  test('promise can be awaited multiple times after rejection', async () => {
    const { promise, reject } = deferred<number>();
    const error = new Error('shared error');

    reject(error);

    // Multiple awaits should all reject with the same error
    await expect(promise).rejects.toThrow(error);
    await expect(promise).rejects.toThrow(error);
    await expect(promise).rejects.toThrow(error);
  });

  test('can attach then/catch handlers before resolution', async () => {
    const { promise, resolve } = deferred<number>();
    const thenSpy = vi.fn();
    const catchSpy = vi.fn();

    promise.then(thenSpy).catch(catchSpy);

    resolve(42);

    // Wait for promise to resolve
    await promise;

    expect(thenSpy).toHaveBeenCalledWith(42);
    expect(catchSpy).not.toHaveBeenCalled();
  });

  test('can attach then/catch handlers before rejection', async () => {
    const { promise, reject } = deferred<number>();
    const thenSpy = vi.fn();
    const catchSpy = vi.fn();

    const handlerPromise = promise.then(thenSpy).catch(catchSpy);

    const error = new Error('test error');
    reject(error);

    // Wait for the handler promise to complete
    await handlerPromise;

    expect(thenSpy).not.toHaveBeenCalled();
    expect(catchSpy).toHaveBeenCalledWith(error);
  });

  test('can attach handlers after resolution', async () => {
    const { promise, resolve } = deferred<string>();
    const value = 'test';

    resolve(value);
    await promise; // Ensure promise is resolved

    const thenSpy = vi.fn();
    const catchSpy = vi.fn();

    promise.then(thenSpy).catch(catchSpy);

    // Wait a tick for handlers to be called
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(thenSpy).toHaveBeenCalledWith(value);
    expect(catchSpy).not.toHaveBeenCalled();
  });

  test('can attach handlers after rejection', async () => {
    const { promise, reject } = deferred<number>();
    const error = new Error('test error');

    reject(error);
    try {
      await promise; // Ensure promise is rejected
    } catch {
      // Expected to throw
    }

    const thenSpy = vi.fn();
    const catchSpy = vi.fn();

    promise.then(thenSpy).catch(catchSpy);

    // Wait a tick for handlers to be called
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(thenSpy).not.toHaveBeenCalled();
    expect(catchSpy).toHaveBeenCalledWith(error);
  });

  test('resolve and reject are properly bound functions', () => {
    const { resolve, reject } = deferred<number>();

    // Should be able to call resolve and reject without context
    const resolveRef = resolve;
    const rejectRef = reject;

    expect(() => resolveRef(42)).not.toThrow();
    expect(() => rejectRef(new Error('test'))).not.toThrow();
  });

  test('multiple deferred instances are independent', async () => {
    const deferred1 = deferred<string>();
    const deferred2 = deferred<number>();

    deferred1.resolve('first');
    deferred2.resolve(42);

    const result1 = await deferred1.promise;
    const result2 = await deferred2.promise;

    expect(result1).toBe('first');
    expect(result2).toBe(42);
  });
});
