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
export { DisposalScope } from './disposal-scope'

// Scope stack
export {
  scopeStack,
  getCurrentScope,
  getScopeStack,
  getParentScope,
  withScope,
  scoped,
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
