import { describe, expect, test, vi } from "vitest";
import { prop } from "../src/signal";
import { DisposalScope } from "../src/disposal-scope";
import { pushScope, popScope } from "../src/scope-stack";

describe("Signal listener auto-disposal", () => {
  describe("signal.on() auto-disposal", () => {
    test("listener is automatically cleaned up when scope disposes", () => {
      const outerSignal = prop(0);
      const listener = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      // Register listener within scope
      outerSignal.on(listener);

      popScope();

      // Listener should have been called initially
      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Update signal before scope disposal
      outerSignal.set(1);
      expect(listener).toHaveBeenCalledWith(1, 0);
      listener.mockClear();

      // Dispose the scope
      scope.dispose();

      // Update signal after scope disposal - listener should NOT be called
      outerSignal.set(2);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      outerSignal.dispose();
    });

    test("listener is cleaned up when signal disposes", () => {
      const signal = prop(0);
      const listener = vi.fn();

      signal.on(listener);

      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      signal.set(1);
      expect(listener).toHaveBeenCalledWith(1, 0);
      listener.mockClear();

      // Dispose the signal
      signal.dispose();

      // Listener should not be called after signal disposal
      signal.set(2);
      expect(listener).not.toHaveBeenCalled();
    });

    test("multiple listeners are all cleaned up on scope disposal", () => {
      const outerSignal = prop(0);
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      outerSignal.on(listener1);
      outerSignal.on(listener2);
      outerSignal.on(listener3);

      popScope();

      // All listeners should have been called initially
      expect(listener1).toHaveBeenCalledWith(0, undefined);
      expect(listener2).toHaveBeenCalledWith(0, undefined);
      expect(listener3).toHaveBeenCalledWith(0, undefined);

      listener1.mockClear();
      listener2.mockClear();
      listener3.mockClear();

      // Dispose the scope
      scope.dispose();

      // Update signal - no listeners should be called
      outerSignal.set(1);
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();

      // Cleanup
      outerSignal.dispose();
    });

    test("nested scopes clean up listeners independently", () => {
      const outerSignal = prop(0);
      const outerListener = vi.fn();
      const innerListener = vi.fn();

      const outerScope = new DisposalScope();
      pushScope(outerScope);

      outerSignal.on(outerListener);

      const innerScope = new DisposalScope();
      pushScope(innerScope);

      outerSignal.on(innerListener);

      popScope(); // inner scope
      popScope(); // outer scope

      // Both listeners should have been called initially
      expect(outerListener).toHaveBeenCalledWith(0, undefined);
      expect(innerListener).toHaveBeenCalledWith(0, undefined);

      outerListener.mockClear();
      innerListener.mockClear();

      // Dispose inner scope only
      innerScope.dispose();

      // Update signal - only outer listener should be called
      outerSignal.set(1);
      expect(outerListener).toHaveBeenCalledWith(1, 0);
      expect(innerListener).not.toHaveBeenCalled();

      outerListener.mockClear();

      // Dispose outer scope
      outerScope.dispose();

      // Update signal - no listeners should be called
      outerSignal.set(2);
      expect(outerListener).not.toHaveBeenCalled();
      expect(innerListener).not.toHaveBeenCalled();

      // Cleanup
      outerSignal.dispose();
    });

    test("manual cleanup still works", () => {
      const signal = prop(0);
      const listener = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      const clear = signal.on(listener);

      popScope();

      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Manually clear the listener
      clear();

      // Update signal - listener should not be called
      signal.set(1);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      scope.dispose();
      signal.dispose();
    });

    test("listener outside scope is not auto-disposed", () => {
      const signal = prop(0);
      const listener = vi.fn();

      // Register listener outside any scope
      signal.on(listener);

      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Update signal - listener should still be called
      signal.set(1);
      expect(listener).toHaveBeenCalledWith(1, 0);

      // Cleanup
      signal.dispose();
    });
  });

  describe("signal.onChange() auto-disposal", () => {
    test("onChange listener is automatically cleaned up when scope disposes", () => {
      const outerSignal = prop(0);
      const listener = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      // Register onChange listener within scope
      outerSignal.onChange(listener);

      popScope();

      // Listener should NOT have been called initially (onChange skips initial)
      expect(listener).not.toHaveBeenCalled();

      // Update signal before scope disposal
      outerSignal.set(1);
      expect(listener).toHaveBeenCalledWith(1, 0);
      listener.mockClear();

      // Dispose the scope
      scope.dispose();

      // Update signal after scope disposal - listener should NOT be called
      outerSignal.set(2);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      outerSignal.dispose();
    });
  });

  describe("listener cleanup with abortSignal", () => {
    test("abortSignal cleanup still works with auto-disposal", () => {
      const signal = prop(0);
      const listener = vi.fn();
      const controller = new AbortController();

      const scope = new DisposalScope();
      pushScope(scope);

      signal.on(listener, { abortSignal: controller.signal });

      popScope();

      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Abort the signal
      controller.abort();

      // Update signal - listener should not be called
      signal.set(1);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      scope.dispose();
      signal.dispose();
    });
  });

  describe("listener cleanup on signal disposal", () => {
    test("signal.dispose() clears all listeners from array", () => {
      const signal = prop(0);
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      signal.on(listener1);
      signal.on(listener2);

      expect(signal.hasListeners()).toBe(true);

      signal.dispose();

      // After disposal, hasListeners should return false
      expect(signal.hasListeners()).toBe(false);
    });
  });

  describe("noAutoDispose option", () => {
    test("listener with noAutoDispose is NOT cleaned up when scope disposes", () => {
      const outerSignal = prop(0);
      const listener = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      // Register listener with noAutoDispose option
      const clear = outerSignal.on(listener, { noAutoDispose: true });

      popScope();

      // Listener should have been called initially
      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Dispose the scope
      scope.dispose();

      // Update signal after scope disposal - listener SHOULD still be called
      outerSignal.set(1);
      expect(listener).toHaveBeenCalledWith(1, 0);
      listener.mockClear();

      // Manual cleanup still works
      clear();

      // Update signal - listener should not be called after manual cleanup
      outerSignal.set(2);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      outerSignal.dispose();
    });

    test("noAutoDispose listener is still cleaned up when signal disposes", () => {
      const signal = prop(0);
      const listener = vi.fn();

      const scope = new DisposalScope();
      pushScope(scope);

      signal.on(listener, { noAutoDispose: true });

      popScope();

      expect(listener).toHaveBeenCalledWith(0, undefined);
      listener.mockClear();

      // Dispose the signal (not the scope)
      signal.dispose();

      // Listener should not be called after signal disposal
      signal.set(1);
      expect(listener).not.toHaveBeenCalled();

      // Cleanup
      scope.dispose();
    });
  });
});
