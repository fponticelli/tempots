export type * from './types/aria-attributes'
export type * from './types/css-styles'
export type * from './types/html-attributes'
export type * from './types/html-events'
export type * from './types/html-tags'
export type * from './types/mathml-attributes'
export type * from './types/mathml-tags'
export type * from './types/svg-attributes'
export type * from './types/svg-tags'
// Re-export from @tempots/core (signals, disposal, scope, etc.)
// Exclude Renderable, TNode which are re-exported from domain.ts with DOM-specific defaults
export {
  Signal,
  Prop,
  Computed,
  signal,
  prop,
  computed,
  effect,
  computedOf,
  computedOfAsync,
  computedOfAsyncGenerator,
  effectOf,
  joinSignals,
  Value,
  DisposalScope,
  getCurrentScope,
  getScopeStack,
  getParentScope,
  withScope,
  scoped,
  untracked,
  pushScope,
  popScope,
  MemoryStore,
  storedProp,
  localStorageProp,
  sessionStorageProp,
  animateSignal,
  animateSignals,
  computedRecord,
  merge,
  delaySignal,
  previousSignal,
  slidingWindowSignal,
  bind,
  coalesce,
  syncProp,
  interpolateNumber,
  interpolateString,
  interpolateDate,
  endInterpolate,
  guessInterpolate,
  createRenderable,
  ElementPosition,
  KeyedPosition,
} from '@tempots/core'
export type {
  AnySignal,
  AtGetter,
  ListenerOptions,
  StoredPropOptions,
  SyncPropOptions,
  RenderContext,
  HierarchicalContext,
} from '@tempots/core'
// Export DOM-specific types (Renderable, TNode, etc. specialized for DOMContext)
export type * from './types/domain'
export * from './dom/attr'
export * from './dom/browser-context'
export * from './dom/dom-context'
export * from './dom/dom-utils'
export * from './dom/errors'
export * from './dom/headless-context'
export * from './dom/window'
export * from './renderable/async'
export * from './renderable/attribute'
export * from './renderable/bind'
export * from './renderable/conjunction'
export * from './renderable/delegate'
export * from './renderable/domnode'
export * from './renderable/element'
export * from './renderable/empty'
export * from './renderable/ensure'
export * from './renderable/foreach'
export * from './renderable/keyed-foreach'
export * from './renderable/fragment'
export * from './renderable/on'
export * from './renderable/on-dispose'
export * from './renderable/oneof'
export * from './renderable/map-signal'
export * from './renderable/iframe'
export * from './renderable/not-empty'
export * from './renderable/portal'
export * from './renderable/probe'
export * from './renderable/render'
export * from './renderable/repeat'
export * from './renderable/shadow-root'
export * from './renderable/style'
export * from './renderable/task'
export * from './renderable/text'
export * from './renderable/when'
export * from './renderable/with-browser-ctx'
export * from './renderable/with-ctx'
export * from './renderable/with-element'
export * from './renderable/with-headless-ctx'
export * from './renderable/with-scope'
export * from './renderable/provider'

// Re-export from @tempots/render for downstream consumers
export type { BaseRenderContext } from '@tempots/render'
export { createRenderKit } from '@tempots/render'
export type { RenderKitConfig, RenderKit } from '@tempots/render'
