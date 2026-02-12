import { createRenderKit } from "@tempots/render";
import { NativeContext } from "../context/native-context";
import { NATIVE_RENDERABLE_TYPE, nativeRenderable } from "../types/domain";

/**
 * The native render kit, which provides shared renderables configured
 * for the native rendering context.
 *
 * This kit is created from `@tempots/render`'s `createRenderKit` and
 * binds all shared renderables (e.g. `When`, `ForEach`, `Async`) to
 * work with `NativeContext` and native view trees.
 *
 * @internal
 */
export const nativeKit = createRenderKit<
  NativeContext,
  typeof NATIVE_RENDERABLE_TYPE
>({
  type: NATIVE_RENDERABLE_TYPE,
  create: nativeRenderable,
});

/**
 * Shared renderables for native rendering.
 *
 * These are the same renderables available in `@tempots/render`, but
 * pre-configured to work with the native rendering context. They handle
 * conditional rendering, list rendering, async operations, and more.
 *
 * @public
 */
export const {
  Empty,
  Fragment,
  When,
  Unless,
  ForEach,
  Repeat,
  OneOf,
  OneOfField,
  OneOfKind,
  OneOfType,
  OneOfValue,
  OneOfTuple,
  MapSignal,
  Ensure,
  EnsureAll,
  NotEmpty,
  Task,
  Async,
  OnDispose,
  Conjunction,
  WithScope,
  WithProvider,
  Provide,
  Use,
  UseMany,
  handleValueOrSignal,
  createReactiveRenderable,
  renderableOfTNode,
} = nativeKit;
