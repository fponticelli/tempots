import type {
  Renderable,
  TNode,
  Clear,
  ProviderMark,
  Value,
} from "@tempots/core";
import type { Signal, ElementPosition } from "@tempots/core";
import type { BaseRenderContext } from "./context";

// Re-export core types for convenience
export type { Clear, ProviderMark, Value };

/**
 * Represents the options for an async task.
 *
 * @typeParam T - The type of the task value.
 * @public
 */
export type TaskOptions<
  T,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  pending?: () => TNode<CTX, TType>;
  then: (value: T) => TNode<CTX, TType>;
  error?: (error: unknown) => TNode<CTX, TType>;
};

/**
 * Options for the `Async` component.
 * @typeParam T - The type of the value.
 * @public
 */
export type AsyncOptions<
  T,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  pending?: () => TNode<CTX, TType>;
  then: (value: T) => TNode<CTX, TType>;
  error?: (error: unknown) => TNode<CTX, TType>;
};

/**
 * Represents a set of options for a one-of type.
 * @typeParam T - The type of the options.
 * @public
 */
export type OneOfOptions<
  T extends Record<string, unknown>,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in keyof T]: (value: Signal<T[KK]>) => TNode<CTX, TType>;
};

/**
 * Converts an object to a union of its keys.
 * @typeParam T - The type of the object.
 * @public
 */
export type ObjectToUnion<T> = {
  [K in keyof T]: { [P in K]: T[K] };
}[keyof T];

/**
 * Represents the options for a one-of field.
 * @public
 */
export type OneOfFieldOptions<
  T extends {
    [_ in K]: string;
  },
  K extends string,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in T[K]]: (
    value: Signal<
      T extends {
        [_ in K]: KK;
      }
        ? T
        : never
    >,
  ) => TNode<CTX, TType>;
};

/**
 * The options for a one-of kind field.
 * @public
 */
export type OneOfKindOptions<
  T extends {
    kind: string;
  },
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in T["kind"]]: (
    value: Signal<
      T extends {
        kind: KK;
      }
        ? T
        : never
    >,
  ) => TNode<CTX, TType>;
};

/**
 * Represents a mapping of keys to functions that accept a value of type `Signal<V>`
 * and return a `TNode`.
 * @public
 */
export type OneOfTupleOptions<
  T extends string,
  V,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in T]: (value: Signal<V>) => TNode<CTX, TType>;
};

/**
 * Represents a mapping of types to rendering functions.
 * @public
 */
export type OneOfTypeOptions<
  T extends { type: string },
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in T["type"]]: (
    value: Signal<T extends { type: KK } ? T : never>,
  ) => TNode<CTX, TType>;
};

/**
 * Represents a set of options for a one-of value.
 * @public
 */
export type OneOfValueOptions<
  T extends symbol | number | string,
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  [KK in T]: () => TNode<CTX, TType>;
};

/**
 * Options for configuring a conjunction.
 * @public
 */
export type ConjunctionOptions<
  CTX extends BaseRenderContext = BaseRenderContext,
  TType extends symbol = symbol,
> = {
  lastSeparator?: () => TNode<CTX, TType>;
  firstSeparator?: () => TNode<CTX, TType>;
};

/**
 * Callback invoked on dispose.
 * @public
 */
export type DisposeCallback<CTX extends BaseRenderContext = BaseRenderContext> =
  (removeTree: boolean, ctx: CTX) => void;

/**
 * Object with a dispose method.
 * @public
 */
export type WithDispose<CTX extends BaseRenderContext = BaseRenderContext> = {
  dispose: DisposeCallback<CTX>;
};

export type NillifyValue<T> =
  | Value<T | null | undefined>
  | Value<T | undefined>
  | Value<T | null>;

export type Id<T> = {} & { [P in keyof T]: T[P] };
export type Merge<A, B> = Id<A & B>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NonNillable<T> = Merge<T, {}>;

/**
 * Converts an array of `Provider` types `T` into an array of their corresponding types.
 * @public
 */
export type ToProviderTypes<T extends unknown[]> = T extends []
  ? []
  : T extends [Provider<infer K>]
    ? [K]
    : T extends [Provider<infer K>, ...infer R]
      ? [K, ...ToProviderTypes<R>]
      : never;

/**
 * Represents a provider for a specific type `T`.
 * @public
 */

export type Provider<
  T,
  O = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  CTX extends BaseRenderContext = BaseRenderContext,
> = {
  mark: ProviderMark<T>;
  create: (
    options: O | undefined,
    ctx: CTX,
  ) => {
    value: T;
    dispose: () => void;
    onUse?: () => void;
  };
};

/**
 * Represents an object with provider options.
 * @public
 */
export type ProviderOptions<CTX extends BaseRenderContext = BaseRenderContext> =
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    use: <T, O = any>(provider: Provider<T, O, CTX>) => T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: <T, O = any>(provider: Provider<T, O, CTX>, options?: O) => void;
  };

/**
 * Type alias for a renderable in a specific context.
 * @public
 */
export type RenderableOf<
  CTX extends BaseRenderContext,
  TType extends symbol,
> = Renderable<CTX, TType>;

/**
 * Type alias for a TNode in a specific context.
 * @public
 */
export type TNodeOf<
  CTX extends BaseRenderContext,
  TType extends symbol,
> = TNode<CTX, TType>;

/**
 * Type alias for an ElementPosition signal.
 * @public
 */
export type { Signal, Renderable, TNode, ElementPosition };
