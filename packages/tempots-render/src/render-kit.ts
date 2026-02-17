import type { Clear, Renderable, TNode } from "@tempots/core";
import {
  Computed,
  Signal,
  signal,
  prop,
  Value,
  ElementPosition,
  KeyedPosition,
  DisposalScope,
  withScope,
  Prop,
} from "@tempots/core";
import type { BaseRenderContext } from "./context";
import type {
  TaskOptions,
  AsyncOptions,
  OneOfOptions,
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
  Provider,
  ProviderOptions,
  ToProviderTypes,
} from "./types";

/**
 * Configuration for creating a render kit.
 *
 * @typeParam CTX - The context type
 * @typeParam TType - The renderable type symbol
 * @public
 */
export type RenderKitConfig<
  CTX extends BaseRenderContext,
  TType extends symbol,
> = {
  /** The symbol type for branding renderables */
  type: TType;
  /** Factory function to create branded renderables */
  create: (renderFn: (ctx: CTX) => Clear) => Renderable<CTX, TType>;
};

/**
 * The return type of `createRenderKit`.
 * @public
 */
export interface RenderKit<
  CTX extends BaseRenderContext,
  TType extends symbol,
> {
  Empty: Renderable<CTX, TType>;
  Fragment: (...children: TNode<CTX, TType>[]) => Renderable<CTX, TType>;
  When: (
    condition: Value<boolean>,
    then: () => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  Unless: (
    condition: Value<boolean>,
    then: () => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  ForEach: <T>(
    value: Value<T[]>,
    item: (value: Signal<T>, position: ElementPosition) => TNode<CTX, TType>,
    separator?: (pos: ElementPosition) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  KeyedForEach: <T, K>(
    value: Value<T[]>,
    key: (item: T) => K,
    item: (value: Signal<T>, position: KeyedPosition) => TNode<CTX, TType>,
    separator?: (pos: KeyedPosition) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  Repeat: (
    times: Value<number>,
    element: (index: ElementPosition) => TNode<CTX, TType>,
    separator?: (pos: ElementPosition) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOf: <T extends Record<string, unknown>>(
    match: Value<T>,
    cases: OneOfOptions<T, CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOfField: <T extends { [_ in K]: string }, K extends string>(
    match: Value<T>,
    field: K,
    cases: OneOfFieldOptions<T, K, CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOfKind: <T extends { kind: string }>(
    match: Value<T>,
    cases: OneOfKindOptions<T, CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOfType: <T extends { type: string }>(
    match: Value<T>,
    cases: OneOfTypeOptions<T, CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOfValue: <T extends symbol | number | string>(
    match: Value<T>,
    cases: OneOfValueOptions<T, CTX, TType>,
  ) => Renderable<CTX, TType>;
  OneOfTuple: <T extends string, V>(
    match: Value<[T, V]>,
    cases: OneOfTupleOptions<T, V, CTX, TType>,
  ) => Renderable<CTX, TType>;
  MapSignal: <T>(
    value: Value<T>,
    fn: (value: T) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  Ensure: <T>(
    value: NillifyValue<T>,
    then: (value: Signal<NonNillable<T>>) => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  EnsureAll: <T extends readonly Value<unknown>[]>(
    ...signals: { [K in keyof T]: NillifyValue<T[K]> }
  ) => (
    callback: (
      ...values: {
        [K in keyof T]: Signal<
          NonNillable<T[K] extends Value<infer U> ? U : never>
        >;
      }
    ) => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  NotEmpty: <T>(
    value: Value<T[]>,
    display: (value: Signal<T[]>) => Renderable<CTX, TType>,
    whenEmpty?: () => Renderable<CTX, TType>,
  ) => Renderable<CTX, TType>;
  Task: <T>(
    task: () => Promise<T>,
    options: TaskOptions<T, CTX, TType> | ((value: T) => TNode<CTX, TType>),
  ) => Renderable<CTX, TType>;
  Async: <T>(
    promise: Promise<T>,
    options: AsyncOptions<T, CTX, TType> | ((value: T) => TNode<CTX, TType>),
  ) => Renderable<CTX, TType>;
  OnDispose: (
    ...fns: (DisposeCallback<CTX> | WithDispose<CTX>)[]
  ) => Renderable<CTX, TType>;
  Conjunction: (
    separator: () => TNode<CTX, TType>,
    options?: ConjunctionOptions<CTX, TType>,
  ) => (pos: Signal<ElementPosition>) => Renderable<CTX, TType>;
  WithScope: (
    fn: (scope: DisposalScope) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  WithProvider: (
    fn: (opts: ProviderOptions<CTX>) => TNode<CTX, TType> | void,
  ) => Renderable<CTX, TType>;
  Provide: <T, O>(
    provider: Provider<T, O, CTX>,
    options: O,
    child: () => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  Use: <T>(
    provider: Provider<T, unknown, CTX>,
    child: (provider: T) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  UseMany: <P extends Provider<unknown, unknown, CTX>[]>(
    ...providers: P
  ) => (
    child: (...values: ToProviderTypes<P>) => TNode<CTX, TType>,
  ) => Renderable<CTX, TType>;
  handleValueOrSignal: <T, R>(
    value: Value<T>,
    onSignal: (signal: Signal<T>) => R,
    onStatic: (literal: T) => R,
  ) => R;
  createReactiveRenderable: <T>(
    ctx: CTX,
    signal: Signal<T>,
    render: (value: T) => TNode<CTX, TType>,
  ) => Clear;
  renderableOfTNode: (child: TNode<CTX, TType>) => Renderable<CTX, TType>;
}

/**
 * Creates a platform-specific render kit containing all shared renderables.
 *
 * Each platform (DOM, Native, etc.) calls this with its own config to get
 * correctly-branded shared renderables.
 *
 * @param config - The platform-specific configuration
 * @returns An object containing all shared renderables
 * @public
 */
export function createRenderKit<
  CTX extends BaseRenderContext,
  TType extends symbol,
>(config: RenderKitConfig<CTX, TType>): RenderKit<CTX, TType> {
  const { create } = config;

  // --- Internal text helpers ---

  const _staticText = (text: string): Renderable<CTX, TType> =>
    create((ctx: CTX) => {
      const newCtx = ctx.makeChildText(text);
      return newCtx.clear;
    });

  const _signalText = (signal: Signal<string>): Renderable<CTX, TType> =>
    create((ctx: CTX) => {
      const newCtx = ctx.makeChildText(signal.value);
      const dispose = signal.on(newCtx.setText);
      return (removeTree: boolean) => {
        dispose();
        newCtx.clear(removeTree);
      };
    });

  // --- Internal helpers ---

  const handleValueOrSignal = <T, R>(
    value: Value<T>,
    onSignal: (signal: Signal<T>) => R,
    onStatic: (literal: T) => R,
  ): R => {
    if (Signal.is(value)) {
      return onSignal(value as Signal<T>);
    } else {
      return onStatic(value as T);
    }
  };

  const renderableOfTNode = (
    child: TNode<CTX, TType>,
  ): Renderable<CTX, TType> => {
    if (child == null) {
      return Empty;
    } else if (Array.isArray(child)) {
      return Fragment(...child.map(renderableOfTNode));
    } else if (typeof child === "string") {
      return _staticText(child);
    } else if (Signal.is(child as Signal<string>)) {
      return _signalText(child as Signal<string>);
    } else if (
      typeof child === "object" &&
      "render" in child &&
      "type" in child
    ) {
      return child as Renderable<CTX, TType>;
    } else {
      throw new Error(`Unknown type: '${typeof child}' for child: ${child}`);
    }
  };

  const createReactiveRenderable = <T>(
    ctx: CTX,
    sig: Signal<T>,
    render: (value: T) => TNode<CTX, TType>,
  ): Clear => {
    const newCtx = ctx.makeRef() as CTX;
    let clear: Clear = () => {};
    let currentScope: DisposalScope | null = null;

    const disposeHandler = sig.on(
      (value) => {
        currentScope?.dispose();
        clear(true);

        currentScope = new DisposalScope();
        clear = withScope(currentScope, () =>
          renderableOfTNode(render(value)).render(newCtx),
        );
      },
      { noAutoDispose: true },
    );

    return (removeTree: boolean) => {
      currentScope?.dispose();
      clear(removeTree);
      disposeHandler();
      newCtx.clear(removeTree);
    };
  };

  // --- Renderables ---

  const Empty: Renderable<CTX, TType> = create(() => () => {});

  const Fragment = (...children: TNode<CTX, TType>[]): Renderable<CTX, TType> =>
    create((ctx: CTX) => {
      const clears = children.map((child) =>
        renderableOfTNode(child).render(ctx),
      );
      return (removeTree: boolean) => {
        clears.forEach((clear) => clear(removeTree));
      };
    });

  const When = (
    condition: Value<boolean>,
    then: () => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ): Renderable<CTX, TType> =>
    handleValueOrSignal(
      condition,
      (sig) =>
        create((ctx) =>
          createReactiveRenderable(ctx, sig, (isTrue) =>
            isTrue ? then() : otherwise?.(),
          ),
        ),
      (literal) => {
        if (literal) {
          const result = then();
          if (result != null) {
            return renderableOfTNode(result);
          }
          return Empty;
        }
        return renderableOfTNode(otherwise?.());
      },
    );

  const Unless = (
    condition: Value<boolean>,
    then: () => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ): Renderable<CTX, TType> =>
    When(
      Value.map(condition, (v) => !v),
      then,
      otherwise,
    );

  const Repeat = (
    times: Value<number>,
    element: (index: ElementPosition) => TNode<CTX, TType>,
    separator?: (pos: ElementPosition) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> => {
    if (separator != null) {
      return Repeat(times, (pos) => {
        const sepPos = new ElementPosition(
          pos.index,
          pos.total.map((v) => v - 1),
        );
        return Fragment(
          renderableOfTNode(element(pos)),
          When(
            pos.isLast,
            () => Empty,
            () => separator(sepPos),
          ),
        );
      });
    } else {
      if (Signal.is(times)) {
        return create((ctx: CTX) => {
          const length = (times as Signal<number>).derive();
          const newCtx = ctx.makeRef() as CTX;
          const clears: Clear[] = [];
          const scopes: DisposalScope[] = [];

          length.on((newLength) => {
            const toRemove = clears.splice(newLength);
            const scopesToDispose = scopes.splice(newLength);

            for (const scope of scopesToDispose) {
              scope.dispose();
            }

            for (const remove of toRemove) {
              remove(true);
            }

            for (let i = clears.length; i < newLength; i++) {
              const pos = new ElementPosition(i, length);
              const scope = new DisposalScope();
              scopes.push(scope);

              clears.push(
                withScope(scope, () =>
                  renderableOfTNode(element(pos)).render(newCtx),
                ),
              );
            }
          });

          return (removeTree: boolean) => {
            for (const scope of scopes) {
              scope.dispose();
            }
            scopes.length = 0;

            length.dispose();
            for (const clear of clears) {
              clear(removeTree);
            }
            clears.length = 0;
            newCtx.clear(removeTree);
          };
        });
      } else {
        const length = signal(times as number);
        return Fragment(
          ...Array.from({ length: times as number }, (_, i) => i).map((i) => {
            const pos = new ElementPosition(i, length);
            return renderableOfTNode(element(pos));
          }),
        );
      }
    }
  };

  const ForEach = <T>(
    value: Value<T[]>,
    item: (value: Signal<T>, position: ElementPosition) => TNode<CTX, TType>,
    separator?: (pos: ElementPosition) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> => {
    const times = Value.map(value, (arr) => arr.length);
    const arr = Value.toSignal(value);
    return Repeat(
      times,
      (pos) => {
        const sig = arr.map((v) => v[pos.index]);
        return renderableOfTNode(item(sig, pos));
      },
      separator,
    );
  };

  // --- LIS helper (Longest Increasing Subsequence) ---
  // Returns indices into `arr` that form the longest strictly increasing subsequence.
  const _lis = (arr: number[]): number[] => {
    const n = arr.length;
    if (n === 0) return [];

    // tails[i] = smallest tail element for IS of length i+1
    const tails: number[] = [];
    // tailIndices[i] = index in arr of tails[i]
    const tailIndices: number[] = [];
    // prev[i] = index in arr of predecessor of arr[i] in the LIS
    const prev: number[] = new Array(n).fill(-1);

    for (let i = 0; i < n; i++) {
      const val = arr[i];
      // Binary search for the position
      let lo = 0,
        hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (tails[mid] < val) lo = mid + 1;
        else hi = mid;
      }
      tails[lo] = val;
      tailIndices[lo] = i;
      prev[i] = lo > 0 ? tailIndices[lo - 1] : -1;
    }

    // Reconstruct
    const result: number[] = new Array(tails.length);
    let k = tailIndices[tails.length - 1];
    for (let i = tails.length - 1; i >= 0; i--) {
      result[i] = k;
      k = prev[k];
    }
    return result;
  };

  const KeyedForEach = <T, K>(
    value: Value<T[]>,
    key: (item: T) => K,
    item: (value: Signal<T>, position: KeyedPosition) => TNode<CTX, TType>,
    separator?: (pos: KeyedPosition) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> =>
    handleValueOrSignal(
      value,
      (arrSignal) =>
        create((ctx: CTX) => {
          const outerRef = ctx.makeRef() as CTX;
          const totalProp = prop(0);

          type KeyedEntry = {
            key: K;
            valueProp: Prop<T>;
            indexProp: Prop<number>;
            position: KeyedPosition;
            scope: DisposalScope;
            clear: Clear;
            startRef: CTX;
            endRef: CTX;
            // Separator state (if separator is provided)
            sepScope?: DisposalScope;
            sepClear?: Clear;
            sepStartRef?: CTX;
          };

          const entries: KeyedEntry[] = [];
          const keyToEntry = new Map<K, KeyedEntry>();

          const createEntry = (
            value: T,
            index: number,
            insertBefore: CTX,
          ): KeyedEntry => {
            const k = key(value);
            const valueProp = prop(value);
            const indexProp = prop(index);
            const position = new KeyedPosition(indexProp, totalProp);

            // Create start marker
            const startRef = ctx.makeChildText("") as CTX;
            // Move it before the target
            ctx.moveRangeBefore(startRef, startRef, insertBefore);

            // Create end marker
            const endRef = ctx.makeChildText("") as CTX;
            ctx.moveRangeBefore(endRef, endRef, insertBefore);

            // Render content between start and end markers.
            // endRef acts as the insertion point — content is placed before it.
            const scope = new DisposalScope();
            const clear = withScope(scope, () =>
              renderableOfTNode(item(valueProp, position)).render(endRef),
            );

            return {
              key: k,
              valueProp,
              indexProp,
              position,
              scope,
              clear,
              startRef,
              endRef,
            };
          };

          const removeEntry = (entry: KeyedEntry) => {
            entry.scope.dispose();
            entry.clear(true);
            entry.startRef.clear(true);
            entry.endRef.clear(true);
            entry.position.dispose();
            entry.valueProp.dispose();
            entry.indexProp.dispose();
            // Remove separator if present
            if (entry.sepClear) {
              entry.sepScope?.dispose();
              entry.sepClear(true);
              entry.sepStartRef?.clear(true);
            }
          };

          const renderSeparator = (
            entry: KeyedEntry,
            insertBefore: CTX,
          ): void => {
            if (!separator) return;

            // Create separator marker before the entry's start marker
            const sepStartRef = ctx.makeChildText("") as CTX;
            ctx.moveRangeBefore(sepStartRef, sepStartRef, insertBefore);

            const sepScope = new DisposalScope();
            const sepClear = withScope(sepScope, () =>
              renderableOfTNode(separator(entry.position)).render(insertBefore),
            );

            entry.sepStartRef = sepStartRef;
            entry.sepScope = sepScope;
            entry.sepClear = sepClear;
          };

          const removeSeparator = (entry: KeyedEntry): void => {
            if (entry.sepClear) {
              entry.sepScope?.dispose();
              entry.sepClear(true);
              entry.sepStartRef?.clear(true);
              entry.sepScope = undefined;
              entry.sepClear = undefined;
              entry.sepStartRef = undefined;
            }
          };

          const disposeSignal = arrSignal.on(
            (newArr) => {
              const newKeys = newArr.map(key);
              const newKeySet = new Set(newKeys);

              // 1. Remove entries whose keys are no longer present
              for (let i = entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                if (!newKeySet.has(entry.key)) {
                  removeEntry(entry);
                  keyToEntry.delete(entry.key);
                  entries.splice(i, 1);
                }
              }

              // 2. Build old key order for surviving entries
              const oldKeyOrder = entries.map((e) => e.key);

              // 3. Update values and create new entries
              const newEntries: KeyedEntry[] = [];
              for (let i = 0; i < newArr.length; i++) {
                const k = newKeys[i];
                let entry = keyToEntry.get(k);
                if (entry) {
                  // Update value and index
                  entry.valueProp.set(newArr[i]);
                  entry.indexProp.set(i);
                } else {
                  // Create new entry at the end (before outerRef)
                  entry = createEntry(newArr[i], i, outerRef);
                  keyToEntry.set(k, entry);
                }
                newEntries.push(entry);
              }

              // 4. Compute moves using LIS
              // Map old keys to their old indices
              const oldKeyIndex = new Map<K, number>();
              for (let i = 0; i < oldKeyOrder.length; i++) {
                oldKeyIndex.set(oldKeyOrder[i], i);
              }

              // For each item in new order, get its old index (-1 if new)
              const oldIndices = newEntries.map((e) =>
                oldKeyIndex.has(e.key) ? oldKeyIndex.get(e.key)! : -1,
              );

              // Filter to only surviving items (old index >= 0) for LIS
              const survivingIndices: { newIdx: number; oldIdx: number }[] = [];
              for (let i = 0; i < oldIndices.length; i++) {
                if (oldIndices[i] >= 0) {
                  survivingIndices.push({ newIdx: i, oldIdx: oldIndices[i] });
                }
              }

              const lisResult = _lis(survivingIndices.map((s) => s.oldIdx));
              const lisSet = new Set(
                lisResult.map((i) => survivingIndices[i].newIdx),
              );

              // Also mark newly created entries as needing placement
              // (they were already appended at the end, need to be moved to correct position)
              for (let i = 0; i < newEntries.length; i++) {
                if (oldIndices[i] < 0) {
                  // New entry — already at the end, needs to be moved
                  // Don't add to LIS set
                }
              }

              // 5. Reorder right-to-left
              // Items in the LIS stay in place; everything else moves.
              let nextRef = outerRef;
              for (let i = newEntries.length - 1; i >= 0; i--) {
                const entry = newEntries[i];
                if (!lisSet.has(i)) {
                  // Move this entry's range before nextRef
                  // If entry has separator, move that too
                  if (entry.sepStartRef) {
                    ctx.moveRangeBefore(
                      entry.sepStartRef,
                      entry.startRef,
                      nextRef,
                    );
                  }
                  ctx.moveRangeBefore(entry.startRef, entry.endRef, nextRef);
                }
                nextRef = entry.sepStartRef ?? entry.startRef;
              }

              // 6. Handle separators
              if (separator) {
                for (let i = 0; i < newEntries.length; i++) {
                  const entry = newEntries[i];
                  if (i === 0) {
                    // First item should have no separator
                    removeSeparator(entry);
                  } else if (!entry.sepClear) {
                    // Needs a separator but doesn't have one
                    renderSeparator(entry, entry.startRef);
                  }
                }
              }

              // 7. Update entries array and total
              entries.length = 0;
              entries.push(...newEntries);
              totalProp.set(newArr.length);
            },
            { noAutoDispose: true },
          );

          return (removeTree: boolean) => {
            disposeSignal();
            for (const entry of entries) {
              removeEntry(entry);
            }
            entries.length = 0;
            keyToEntry.clear();
            totalProp.dispose();
            outerRef.clear(removeTree);
          };
        }),
      // Static array — just render once
      (literal) => {
        const arr = literal;
        if (arr.length === 0) return Empty;

        const totalSig = signal(arr.length);
        return Fragment(
          ...arr.map((val, i) => {
            const valueSig = signal(val);
            const indexProp = prop(i);
            const position = new KeyedPosition(indexProp, totalSig);

            if (separator && i > 0) {
              return Fragment(
                renderableOfTNode(separator(position)),
                renderableOfTNode(item(valueSig, position)),
              );
            }
            return renderableOfTNode(item(valueSig, position));
          }),
        );
      },
    );

  const OneOf = <T extends Record<string, unknown>>(
    match: Value<T>,
    cases: OneOfOptions<T, CTX, TType>,
  ): Renderable<CTX, TType> => {
    function onSignal(matchSignal: Signal<T>): Renderable<CTX, TType> {
      return create((ctx: CTX) => {
        const newCtx = ctx.makeRef() as CTX;
        let clearRenderable: Clear | undefined;
        let matched: Computed<T[keyof T]> | undefined;
        const keySignal = matchSignal.map((value) => {
          return Object.keys(value)[0] as keyof T;
        });
        let currentKey: keyof T | undefined;
        const clearSignal = keySignal.on((newKey) => {
          if (newKey !== currentKey) {
            currentKey = newKey;
            matched?.dispose();
            clearRenderable?.(true);
            matched = matchSignal.map((value) => value[newKey]);
            const child = cases[newKey](matched);
            clearRenderable = renderableOfTNode(child).render(newCtx);
          }
        });
        return (removeTree: boolean) => {
          matched?.dispose();
          clearSignal();
          newCtx.clear(removeTree);
          clearRenderable?.(removeTree);
        };
      });
    }
    function onLiteral(literal: T): Renderable<CTX, TType> {
      const key = Object.keys(literal)[0] as keyof T;
      return renderableOfTNode(cases[key](signal(literal[key])));
    }
    return handleValueOrSignal(match, onSignal, onLiteral);
  };

  const OneOfField = <T extends { [_ in K]: string }, K extends string>(
    match: Value<T>,
    field: K,
    cases: OneOfFieldOptions<T, K, CTX, TType>,
  ) =>
    OneOf(
      Value.map(match, (v) => ({ [v[field]]: v })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cases as any,
    );

  const OneOfKind = <T extends { kind: string }>(
    match: Value<T>,
    cases: OneOfKindOptions<T, CTX, TType>,
  ) => OneOfField(match, "kind", cases);

  const OneOfType = <T extends { type: string }>(
    match: Value<T>,
    cases: OneOfTypeOptions<T, CTX, TType>,
  ) => OneOfField(match, "type", cases);

  const OneOfTuple = <T extends string, V>(
    match: Value<[T, V]>,
    cases: OneOfTupleOptions<T, V, CTX, TType>,
  ) => {
    const matchRecord = Value.map(match, ([key, value]) => ({
      [key]: value,
    }));
    return OneOf(matchRecord, cases);
  };

  const OneOfValue = <T extends symbol | number | string>(
    match: Value<T>,
    cases: OneOfValueOptions<T, CTX, TType>,
  ) =>
    OneOf(
      Value.map(match, (v) => ({ [v]: true })),
      cases,
    );

  const MapSignal = <T>(
    value: Value<T>,
    fn: (value: T) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> => {
    if (Signal.is(value)) {
      const sig = value as Signal<T>;
      return create((ctx: CTX) => {
        const newCtx = ctx.makeRef() as CTX;
        const mountableSignal = sig.map((v) => renderableOfTNode(fn(v)));
        let previousClear: Clear = () => {};
        const clear = mountableSignal.on((child) => {
          previousClear(true);
          previousClear = child.render(newCtx);
        });
        return (removeTree) => {
          clear();
          previousClear(removeTree);
        };
      });
    }
    return renderableOfTNode(fn(value as T));
  };

  const Ensure = <T>(
    value: NillifyValue<T>,
    then: (value: Signal<NonNillable<T>>) => TNode<CTX, TType>,
    otherwise?: () => TNode<CTX, TType>,
  ): Renderable<CTX, TType> => {
    function onSignal(valueSignal: Signal<T | null | undefined>) {
      return create((ctx: CTX) => {
        const newCtx = ctx.makeRef() as CTX;
        let clear: Clear = () => {};
        let isNonNillRendered = false;
        let feed: ReturnType<typeof prop<T>> | null = null;
        const clearSignal = valueSignal.on((value) => {
          if (value == null) {
            clear(true);
            clear = renderableOfTNode(otherwise?.()).render(newCtx);
            isNonNillRendered = false;
            feed?.dispose();
            feed = null;
          } else {
            if (!isNonNillRendered) {
              feed = prop<T>(value);
              clear(true);
              clear = renderableOfTNode(
                then(feed as Signal<NonNillable<T>>),
              ).render(newCtx);
              isNonNillRendered = true;
            } else {
              feed!.set(value);
            }
          }
        });
        return (removeTree: boolean) => {
          feed?.dispose();
          clearSignal();
          clear?.(removeTree);
          newCtx.clear(removeTree);
        };
      });
    }

    function onLiteral(literal: T | null | undefined) {
      if (literal == null) {
        const result = otherwise?.();
        if (result != null) {
          return renderableOfTNode(result);
        }
        return Empty;
      }
      return renderableOfTNode(then(signal(literal)));
    }

    return handleValueOrSignal(
      value as Value<T | null | undefined>,
      onSignal,
      onLiteral,
    );
  };

  const EnsureAll =
    <
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends readonly Value<any>[],
    >(
      ...signals: { [K in keyof T]: NillifyValue<T[K]> }
    ) =>
    (
      callback: (
        ...values: {
          [K in keyof T]: Signal<
            NonNillable<T[K] extends Value<infer U> ? U : never>
          >;
        }
      ) => TNode<CTX, TType>,
      otherwise?: () => TNode<CTX, TType>,
    ): Renderable<CTX, TType> =>
      create((ctx: CTX) => {
        const newCtx = ctx.makeRef() as CTX;
        const hasNillLiterals = signals.some(
          (sig) => !Signal.is(sig) && sig == null,
        );

        if (hasNillLiterals) {
          return (
            otherwise != null ? renderableOfTNode(otherwise?.()) : Empty
          ).render(newCtx);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const feed: (null | ReturnType<typeof prop<any>>)[] = signals.map(
          () => null,
        );
        const feedValues: boolean[] = signals.map((v) =>
          Signal.is(v) ? (v as Signal<unknown>).value != null : v != null,
        );
        let clear: Clear | null = null;
        const allHadValues = prop(feedValues.every((v) => v));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const makeOrAssignSignal = (sig: Signal<any>, index: number) => {
          if (sig.value != null) {
            if (feed[index] == null) {
              const newSignal = prop(sig.value);
              feed[index] = newSignal;
            } else {
              feed[index]!.value = sig.value;
            }
            feedValues[index] = true;
          } else {
            feedValues[index] = false;
          }
        };

        let counter = signals.length - 1;
        const clearFeeds = signals.map((sig, index) => {
          if (!Signal.is(sig)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const litSignal = prop(sig as any);
            feed[index] = litSignal;
            return () => {};
          }

          return (sig as Signal<unknown>).on(() => {
            makeOrAssignSignal(sig as Signal<unknown>, index);

            if (counter === 0) {
              allHadValues.value = feedValues.every((v) => v);
            } else {
              counter--;
            }
          });
        });

        allHadValues.on((allNonNullable) => {
          clear?.(true);
          clear = null;
          if (allNonNullable) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clear = renderableOfTNode(callback(...(feed as any))).render(
              newCtx,
            );
          } else {
            clear = renderableOfTNode(otherwise?.() ?? Empty).render(newCtx);
          }
        });

        return (removeTree: boolean) => {
          feed.forEach((f) => f?.dispose());
          allHadValues.dispose();
          clearFeeds.forEach((fn) => fn());
          clear?.(removeTree);
          newCtx.clear(removeTree);
        };
      });

  const NotEmpty = <T>(
    value: Value<T[]>,
    display: (value: Signal<T[]>) => Renderable<CTX, TType>,
    whenEmpty: () => Renderable<CTX, TType> = () => Empty,
  ): Renderable<CTX, TType> =>
    OneOf(
      Value.map<T[], { notEmpty: T[] } | { whenEmpty: null }>(value, (v) =>
        v.length > 0 ? { notEmpty: v } : { whenEmpty: null },
      ),
      {
        notEmpty: (v: Signal<T[]>) => display(v),
        whenEmpty: () => whenEmpty(),
      },
    );

  const Task = <T>(
    task: () => Promise<T>,
    options: TaskOptions<T, CTX, TType> | ((value: T) => TNode<CTX, TType>),
  ): Renderable<CTX, TType> => {
    if (typeof options === "function") {
      return Task(task, { then: options });
    }
    const pending =
      options.pending != null ? renderableOfTNode(options.pending()) : Empty;
    const then = options.then;
    const error =
      options.error != null
        ? (e: unknown) => renderableOfTNode(options.error!(e))
        : () => Empty;
    return create((ctx: CTX) => {
      let active = true;
      const promise = task();
      const newCtx = ctx.makeRef() as CTX;
      let clear = renderableOfTNode(pending).render(newCtx);
      promise.then(
        (value) => {
          if (!active) return;
          clear(true);
          clear = renderableOfTNode(then(value)).render(newCtx);
        },
        (e) => {
          if (!active) return;
          clear(true);
          clear = renderableOfTNode(error(e)).render(newCtx);
        },
      );
      return (removeTree: boolean) => {
        active = false;
        clear(removeTree);
        newCtx.clear(removeTree);
      };
    });
  };

  const Async = <T>(
    promise: Promise<T>,
    options: AsyncOptions<T, CTX, TType> | ((value: T) => TNode<CTX, TType>),
  ): Renderable<CTX, TType> => Task(() => promise, options);

  const OnDispose = (
    ...fns: (DisposeCallback<CTX> | WithDispose<CTX>)[]
  ): Renderable<CTX, TType> =>
    create(
      (ctx: CTX) => (removeTree: boolean) =>
        fns.forEach((disposable) => {
          if (typeof disposable === "function") {
            disposable(removeTree, ctx);
          } else {
            disposable.dispose(removeTree, ctx);
          }
        }),
    );

  const Conjunction =
    (
      separator: () => TNode<CTX, TType>,
      options: ConjunctionOptions<CTX, TType> = {},
    ) =>
    (pos: Signal<ElementPosition>): Renderable<CTX, TType> => {
      const first = options?.firstSeparator ?? separator;
      const last = options?.lastSeparator ?? separator;
      return OneOfValue(
        pos.map((v) => {
          if (v.isFirst) {
            return "first";
          } else if (v.isLast) {
            return "last";
          } else {
            return "other";
          }
        }),
        {
          first,
          last,
          other: separator,
        },
      );
    };

  const WithScope = (
    fn: (scope: DisposalScope) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> =>
    create((ctx: CTX) => {
      const scope = new DisposalScope();
      const clear = withScope(scope, () =>
        renderableOfTNode(fn(scope)).render(ctx),
      );

      return (removeTree: boolean) => {
        scope.dispose();
        clear(removeTree);
      };
    });

  const WithProvider = (
    fn: (opts: ProviderOptions<CTX>) => TNode<CTX, TType> | void,
  ): Renderable<CTX, TType> =>
    create((ctx: CTX): Clear => {
      let newCtx = ctx;
      function getCtx() {
        return newCtx;
      }
      function setCtx(c: BaseRenderContext) {
        newCtx = c as CTX;
      }
      const disposers: (() => void)[] = [];
      const result = fn({
        use: ({ mark }) => {
          const { value, onUse } = getCtx().getProvider(mark);
          onUse?.();
          return value;
        },
        set: ({ mark, create: createProvider }, options) => {
          const { value, dispose, onUse } = createProvider(options, getCtx());
          disposers.push(dispose);
          setCtx(getCtx().setProvider(mark, value, onUse));
        },
      });
      if (result == null) {
        return () => {};
      }
      return Fragment(
        renderableOfTNode(result),
        OnDispose(() => disposers.forEach((fn) => fn())),
      ).render(getCtx());
    });

  const Provide = <T, O>(
    provider: Provider<T, O, CTX>,
    options: O,
    child: () => TNode<CTX, TType>,
  ): Renderable<CTX, TType> =>
    WithProvider(({ set }) => {
      set(provider, options);
      return child();
    });

  const Use = <T>(
    provider: Provider<T, unknown, CTX>,
    child: (prov: T) => TNode<CTX, TType>,
  ): Renderable<CTX, TType> => WithProvider(({ use }) => child(use(provider)));

  const UseMany =
    <P extends Provider<unknown, unknown, CTX>[]>(...providers: P) =>
    (
      child: (...values: ToProviderTypes<P>) => TNode<CTX, TType>,
    ): Renderable<CTX, TType> =>
      WithProvider(({ use }) => {
        const args = providers.map(use) as ToProviderTypes<P>;
        return child(...args);
      });

  return {
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
  };
}
