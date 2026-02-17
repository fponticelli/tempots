import { createRenderKit } from '@tempots/render'
import { DOMContext } from '../dom/dom-context'
import { DOM_RENDERABLE_TYPE, domRenderable } from '../types/domain'

export const domKit = createRenderKit<DOMContext, typeof DOM_RENDERABLE_TYPE>({
  type: DOM_RENDERABLE_TYPE,
  create: domRenderable,
})

export const {
  Empty,
  Fragment,
  When,
  Unless,
  ForEach,
  KeyedForEach,
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
} = domKit
