import type { Clear, Renderable } from "@tempots/core";
import type { JSIBridge } from "../bridge/jsi-bridge";
import { NativeContext } from "../context/native-context";
import { NATIVE_RENDERABLE_TYPE } from "../types/domain";

/**
 * Options for rendering a native app.
 * @public
 */
export interface RenderNativeOptions {
  /** Explicit JSI bridge instance. If not provided, uses globalThis.__TEMPO_JSI_BRIDGE. */
  bridge?: JSIBridge;
  /** Root view handle. Defaults to 1 (the root view created by the native host). */
  rootHandle?: number;
}

/**
 * Mounts a Tempo renderable into the native view tree.
 *
 * This is the main entry point for native Tempo apps. It creates a
 * NativeContext from the JSI bridge and renders the given renderable.
 *
 * @param renderable - The root renderable to mount
 * @param options - Configuration options
 * @returns A cleanup function to unmount the app
 * @public
 */
export function renderNative(
  renderable: Renderable<NativeContext, typeof NATIVE_RENDERABLE_TYPE>,
  options: RenderNativeOptions = {},
): Clear {
  const bridge: JSIBridge =
    options.bridge ??
    ((globalThis as Record<string, unknown>).__TEMPO_JSI_BRIDGE as JSIBridge);

  if (!bridge) {
    throw new Error(
      "Tempo native: No JSI bridge found. Provide a bridge option or ensure globalThis.__TEMPO_JSI_BRIDGE is set.",
    );
  }

  const rootHandle = options.rootHandle ?? 1;
  const ctx = new NativeContext(bridge, rootHandle);

  return renderable.render(ctx);
}
