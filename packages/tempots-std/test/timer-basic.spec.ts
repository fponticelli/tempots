import { describe, expect, test, vi } from "vitest";
import {
  delayed,
  interval,
  throttle,
  debounce,
  delayedAnimationFrame,
  intervalAnimationFrame,
} from '../src/timer';

describe('Timer utilities - Basic functionality', () => {
  describe('delayed', () => {
    test('returns a cancel function', () => {
      const mockFn = vi.fn();
      const cancel = delayed(mockFn, 1000);
      
      expect(typeof cancel).toBe('function');
      
      // Should not throw when called
      expect(() => cancel()).not.toThrow();
    });

    test('accepts function and delay parameters', () => {
      const mockFn = vi.fn();
      
      expect(() => delayed(mockFn, 1000)).not.toThrow();
      expect(() => delayed(mockFn, 0)).not.toThrow();
      expect(() => delayed(mockFn, -100)).not.toThrow();
    });
  });

  describe('interval', () => {
    test('returns a stop function', () => {
      const mockFn = vi.fn();
      const stop = interval(mockFn, 1000);
      
      expect(typeof stop).toBe('function');
      
      // Should not throw when called
      expect(() => stop()).not.toThrow();
    });

    test('accepts function and delay parameters', () => {
      const mockFn = vi.fn();
      
      expect(() => interval(mockFn, 1000)).not.toThrow();
      expect(() => interval(mockFn, 0)).not.toThrow();
      expect(() => interval(mockFn, -100)).not.toThrow();
    });
  });

  describe('throttle', () => {
    test('returns a throttled function with cancel method', () => {
      const mockFn = vi.fn();
      const throttled = throttle(1000, mockFn);
      
      expect(typeof throttled).toBe('function');
      expect(typeof throttled.cancel).toBe('function');
    });

    test('accepts options parameter', () => {
      const mockFn = vi.fn();
      
      expect(() => throttle(1000, mockFn)).not.toThrow();
      expect(() => throttle(1000, mockFn, {})).not.toThrow();
      expect(() => throttle(1000, mockFn, { noLeading: true })).not.toThrow();
      expect(() => throttle(1000, mockFn, { noTrailing: true })).not.toThrow();
      expect(() => throttle(1000, mockFn, { debounceMode: true })).not.toThrow();
    });

    test('cancel method accepts options', () => {
      const mockFn = vi.fn();
      const throttled = throttle(1000, mockFn);
      
      expect(() => throttled.cancel()).not.toThrow();
      expect(() => throttled.cancel({})).not.toThrow();
      expect(() => throttled.cancel({ upcomingOnly: true })).not.toThrow();
      expect(() => throttled.cancel({ upcomingOnly: false })).not.toThrow();
    });

    test('can be called with arguments', () => {
      const mockFn = vi.fn();
      const throttled = throttle(1000, mockFn);
      
      expect(() => throttled()).not.toThrow();
      expect(() => throttled('arg1', 'arg2', 42)).not.toThrow();
    });
  });

  describe('debounce', () => {
    test('returns a debounced function with cancel method', () => {
      const mockFn = vi.fn();
      const debounced = debounce(1000, mockFn);
      
      expect(typeof debounced).toBe('function');
      expect(typeof debounced.cancel).toBe('function');
    });

    test('accepts options parameter', () => {
      const mockFn = vi.fn();
      
      expect(() => debounce(1000, mockFn)).not.toThrow();
      expect(() => debounce(1000, mockFn, {})).not.toThrow();
      expect(() => debounce(1000, mockFn, { atBegin: true })).not.toThrow();
      expect(() => debounce(1000, mockFn, { atBegin: false })).not.toThrow();
    });

    test('cancel method accepts options', () => {
      const mockFn = vi.fn();
      const debounced = debounce(1000, mockFn);
      
      expect(() => debounced.cancel()).not.toThrow();
      expect(() => debounced.cancel({})).not.toThrow();
      expect(() => debounced.cancel({ upcomingOnly: true })).not.toThrow();
      expect(() => debounced.cancel({ upcomingOnly: false })).not.toThrow();
    });

    test('can be called with arguments', () => {
      const mockFn = vi.fn();
      const debounced = debounce(1000, mockFn);
      
      expect(() => debounced()).not.toThrow();
      expect(() => debounced('arg1', 'arg2', 42)).not.toThrow();
    });
  });

  describe('delayedAnimationFrame', () => {
    test('returns a cancel function', () => {
      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((callback) => {
        return setTimeout(callback, 16) as any;
      });
      global.cancelAnimationFrame = vi.fn();

      const mockFn = vi.fn();
      const cancel = delayedAnimationFrame(mockFn);
      
      expect(typeof cancel).toBe('function');
      expect(() => cancel()).not.toThrow();
    });

    test('calls requestAnimationFrame', () => {
      global.requestAnimationFrame = vi.fn((callback) => {
        return setTimeout(callback, 16) as any;
      });
      global.cancelAnimationFrame = vi.fn();

      const mockFn = vi.fn();
      delayedAnimationFrame(mockFn);
      
      expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
    });
  });

  describe('intervalAnimationFrame', () => {
    test('returns a stop function', () => {
      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((callback) => {
        return setTimeout(callback, 16) as any;
      });
      global.cancelAnimationFrame = vi.fn();

      const mockFn = vi.fn();
      const stop = intervalAnimationFrame(mockFn);
      
      expect(typeof stop).toBe('function');
      expect(() => stop()).not.toThrow();
    });

    test('calls requestAnimationFrame', () => {
      global.requestAnimationFrame = vi.fn((callback) => {
        return setTimeout(callback, 16) as any;
      });
      global.cancelAnimationFrame = vi.fn();

      const mockFn = vi.fn();
      intervalAnimationFrame(mockFn);
      
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Type safety and interfaces', () => {
    test('functions accept correct parameter types', () => {
      const voidFn = () => {};
      const numberFn = (x: number) => x * 2;
      const stringFn = (s: string) => s.toUpperCase();
      const multiArgFn = (a: string, b: number, c: boolean) => `${a}-${b}-${c}`;

      // These should all compile without TypeScript errors
      expect(() => delayed(voidFn, 1000)).not.toThrow();
      expect(() => interval(voidFn, 1000)).not.toThrow();
      expect(() => throttle(1000, numberFn)).not.toThrow();
      expect(() => debounce(1000, stringFn)).not.toThrow();
      expect(() => throttle(1000, multiArgFn)).not.toThrow();
    });

    test('throttled and debounced functions preserve argument types', () => {
      const multiArgFn = vi.fn((a: string, b: number, c: boolean) => `${a}-${b}-${c}`);
      
      const throttled = throttle(1000, multiArgFn);
      const debounced = debounce(1000, multiArgFn);
      
      // These should compile and run without errors
      expect(() => throttled('test', 42, true)).not.toThrow();
      expect(() => debounced('test', 42, true)).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    test('functions work with zero and negative delays', () => {
      const mockFn = vi.fn();
      
      expect(() => delayed(mockFn, 0)).not.toThrow();
      expect(() => delayed(mockFn, -100)).not.toThrow();
      expect(() => interval(mockFn, 0)).not.toThrow();
      expect(() => interval(mockFn, -100)).not.toThrow();
      expect(() => throttle(0, mockFn)).not.toThrow();
      expect(() => throttle(-100, mockFn)).not.toThrow();
      expect(() => debounce(0, mockFn)).not.toThrow();
      expect(() => debounce(-100, mockFn)).not.toThrow();
    });

    test('functions work with very large delays', () => {
      const mockFn = vi.fn();
      const largeDelay = Number.MAX_SAFE_INTEGER;
      
      expect(() => delayed(mockFn, largeDelay)).not.toThrow();
      expect(() => interval(mockFn, largeDelay)).not.toThrow();
      expect(() => throttle(largeDelay, mockFn)).not.toThrow();
      expect(() => debounce(largeDelay, mockFn)).not.toThrow();
    });

    test('cancel and stop functions can be called multiple times', () => {
      const mockFn = vi.fn();
      
      const delayedCancel = delayed(mockFn, 1000);
      const intervalStop = interval(mockFn, 1000);
      const throttled = throttle(1000, mockFn);
      const debounced = debounce(1000, mockFn);
      
      // Multiple calls should not throw
      expect(() => {
        delayedCancel();
        delayedCancel();
        delayedCancel();
      }).not.toThrow();
      
      expect(() => {
        intervalStop();
        intervalStop();
        intervalStop();
      }).not.toThrow();
      
      expect(() => {
        throttled.cancel();
        throttled.cancel();
        throttled.cancel();
      }).not.toThrow();
      
      expect(() => {
        debounced.cancel();
        debounced.cancel();
        debounced.cancel();
      }).not.toThrow();
    });
  });
});
