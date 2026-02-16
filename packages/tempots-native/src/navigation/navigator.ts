import { prop, Signal } from "@tempots/core";

/**
 * A signal-based in-memory navigator for native apps.
 * @public
 */
export interface Navigator<R> {
  /** The current route signal. */
  readonly route: Signal<R>;
  /** Navigate to a new route (pushes onto history stack). */
  readonly navigate: (route: R) => void;
  /** Go back to the previous route. Returns false if stack is empty. */
  readonly back: () => boolean;
  /** Signal indicating whether navigation back is possible. */
  readonly canGoBack: Signal<boolean>;
}

/**
 * Creates an in-memory navigator with a history stack.
 *
 * @param initial - The initial route
 * @param equals - Optional equality function for route comparison
 * @returns A Navigator instance
 * @public
 */
export function createNavigator<R>(
  initial: R,
  equals?: (a: R, b: R) => boolean,
): Navigator<R> {
  const stack: R[] = [];
  const route = prop(initial, equals);
  const canGoBack = prop(false);

  const navigate = (newRoute: R) => {
    stack.push(route.value);
    route.set(newRoute);
    canGoBack.set(true);
  };

  const back = (): boolean => {
    const prev = stack.pop();
    if (prev === undefined) return false;
    route.set(prev);
    canGoBack.set(stack.length > 0);
    return true;
  };

  return { route, navigate, back, canGoBack };
}
