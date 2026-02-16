/**
 * Platform-agnostic shared renderables for the Tempo framework.
 *
 * This package provides the `createRenderKit` factory that each platform
 * (DOM, Native, etc.) calls with its own renderable factory to get
 * correctly-branded shared renderables.
 *
 * @packageDocumentation
 */

// Context interface
export type { BaseRenderContext } from "./context";
export type { Providers } from "./context";

// Error classes
export { ProviderNotFoundError } from "./errors";

// Render kit factory
export { createRenderKit } from "./render-kit";
export type { RenderKitConfig, RenderKit } from "./render-kit";

// Shared types
export type {
  TaskOptions,
  AsyncOptions,
  OneOfOptions,
  ObjectToUnion,
  OneOfFieldOptions,
  OneOfKindOptions,
  OneOfTupleOptions,
  OneOfTypeOptions,
  OneOfValueOptions,
  ConjunctionOptions,
  DisposeCallback,
  WithDispose,
  NillifyValue,
  NonNillable,
  Id,
  Merge,
  Provider,
  ProviderOptions,
  ToProviderTypes,
} from "./types";
