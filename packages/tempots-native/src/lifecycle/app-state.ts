import { prop, Signal } from "@tempots/core";
import type { JSIBridge } from "../bridge/jsi-bridge";

/**
 * Possible app states.
 * @public
 */
export type AppState = "active" | "background" | "inactive";

/**
 * Creates a signal that tracks the app's foreground/background state.
 *
 * The signal emits the current app state whenever it changes.
 * This requires the native bridge to emit 'appStateChange' events.
 *
 * @param bridge - The JSI bridge
 * @returns A signal of the current app state
 * @public
 */
export function createAppStateSignal(bridge: JSIBridge): Signal<AppState> {
  const state = prop<AppState>("active");

  // The native side is expected to call this listener when app state changes
  bridge.addEventListener(0, "appStateChange", (e: unknown) => {
    const newState = (e as { state: AppState }).state;
    state.set(newState);
  });

  return state;
}
