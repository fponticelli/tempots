import { createRenderKit } from '@tempots/render'
import { DOMContext } from '../dom/dom-context'
import { DOM_RENDERABLE_TYPE, domRenderable } from '../types/domain'
import { domTemplateEngine } from '../template/engine'

export const domKit = createRenderKit<DOMContext, typeof DOM_RENDERABLE_TYPE>({
  type: DOM_RENDERABLE_TYPE,
  create: domRenderable,
  templateEngine: domTemplateEngine,
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
  MapText,
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
