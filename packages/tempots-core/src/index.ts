/**
 * Core types and utilities for multi-context Tempo framework.
 *
 * This package provides the foundational types and utilities that are shared
 * across all Tempo rendering contexts (DOM, ThreeJS, Konva, PixiJS, etc.).
 *
 * @packageDocumentation
 */

// Core types
export type {
  Clear,
  RenderContext,
  HierarchicalContext,
  Renderable,
  TNode,
  Primitive,
  ProviderMark,
  ValueType,
  BaseValueType,
  ValueTypes,
  Values,
  RemoveSignals,
  Nil,
} from './types'

export { makeProviderMark } from './types'

// Renderable factory
export { createRenderable } from './renderable'

// Signal system
export type { AnySignal, AtGetter, ListenerOptions } from './signal'

export {
  Signal,
  Prop,
  Computed,
  signal,
  prop,
  computed,
  effect,
  strictEquals,
} from './signal'

// Value utilities
export {
  computedOf,
  computedOfAsync,
  computedOfAsyncGenerator,
  effectOf,
  joinSignals,
  Value,
} from './value'

// Disposal scope
export { DisposalScope, scoped } from './disposal-scope'

// Scope stack
export type { Scope } from './scope-stack'
export {
  scopeStack,
  getCurrentScope,
  getScopeStack,
  getParentScope,
  withScope,
  untracked,
  pushScope,
  popScope,
} from './scope-stack'

// Signal utilities
export {
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
  and,
  or,
  not,
  notNil,
  throttleSignal,
  distinctUntilChanged,
  accumulateSignal,
  createSelector,
} from './signal-utils'

export type { StoredPropOptions, SyncPropOptions } from './signal-utils'

// History / Undo-Redo
export { propHistory } from './prop-history'
export type { PropHistory, PropHistoryOptions } from './prop-history'

// Interpolation utilities
export {
  interpolateNumber,
  interpolateString,
  interpolateDate,
  endInterpolate,
  guessInterpolate,
} from './interpolate'

export type { Interpolate } from './interpolate'

// Element position
export { ElementPosition } from './element-position'

// Keyed position
export { KeyedPosition } from './keyed-position'

// Easing functions
export type { EasingFn } from './easing'
export {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeOutBounce,
  easeInBounce,
  easeInOutBounce,
  easeOutElastic,
  easeInElastic,
  easeInOutElastic,
  reverseEasing,
  mirrorEasing,
  chainEasing,
} from './easing'
