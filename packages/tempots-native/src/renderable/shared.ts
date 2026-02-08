import { createRenderKit } from "@tempots/render";
import { NativeContext } from "../context/native-context";
import { NATIVE_RENDERABLE_TYPE, nativeRenderable } from "../types/domain";

export const nativeKit = createRenderKit<
  NativeContext,
  typeof NATIVE_RENDERABLE_TYPE
>({
  type: NATIVE_RENDERABLE_TYPE,
  create: nativeRenderable,
});

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
