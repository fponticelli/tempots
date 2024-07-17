# Array helpers

Contains utility functions for working with arrays. The functions are available under the `@tempots/std/array` module.

```ts
import { /* utility_to_import */ } '@tempots/std/array'
```

TODO

## create

### fill

```ts
function fill&lt;A>(length: number, value: A): A[]
```

### range

```ts
function range&lt;A>(length: number, f: (index: number) => A): A[]
```

### numbersRange

```ts
function numbersRange(length: number, startAt = 0): number[]
```

## manipulate

### concat

```ts
function concat&lt;A>(...arrs: A[][]): A[]
```

### filter

```ts
function filter&lt;T>(arr: T[], predicate: (v: T) => boolean): T[]
```

### filterMap

```ts
function filterMap&lt;A, B>(
  arr: A[],
  f: (a: A, index: number) => Maybe&lt;B>
): B[]
```

### filterNulls

```ts
function filterNulls&lt;T>(arr: Array&lt;T | Nothing>): T[]
```

### flatMap

```ts
function flatMap&lt;A, B>(arr: A[], f: (a: A) => B[]): B[]
```

### flatten

```ts
function flatten&lt;T>(arr: T[][]): T[]
```

### foldLeft

```ts
function foldLeft&lt;T, B>(arr: T[], f: (acc: B, curr: T) => B, b: B): B
```

### map

```ts
function map&lt;A, B>(arr: A[], f: (a: A, index: number) => B): B[]
```

### mapNotNull

```ts
function mapNotNull&lt;A, B>(
  arr: A[],
  f: (a: A, index: number) => B | Nothing
): B[]
```

### sort

```ts
function sort&lt;A>(compare: Compare&lt;A>, arr: A[]): A[]
```

## query

### all

```ts
function all&lt;T>(arr: T[], predicate: (v: T) => boolean): boolean
```

### any

```ts
function any&lt;T>(arr: T[], predicate: (v: T) => boolean): boolean
```

### each

```ts
function each&lt;T>(arr: T[], f: (v: T) => void): void
```

### equals

```ts
function equals&lt;T>(
  a: T[],
  b: T[],
  equality: (a: T, b: T) => boolean
): boolean
```

### hasValues

```ts
function hasValues&lt;T>(arr: T[]): arr is [T, ...T[]]
```

### head

```ts
function head&lt;A>(arr: A[]): Maybe&lt;A>
```

### isEmpty

```ts
function isEmpty&lt;T>(arr: T[]): arr is []
```

### makeEquals

```ts
function makeEquals&lt;T>(equality: (a: T, b: T) => boolean)
  => (a: T[], b: T[])
  => boolean
```

### tail

```ts
function tail&lt;A>(arr: A[]): A[]
```

### makeCompare

```ts
function makeCompare&lt;A>(comparef: Compare&lt;A>, shorterFirst = true)
  => (a: A[], b: A[])
  => number
```

### distinctPrimitive

```ts
function distinctPrimitive&lt;T extends Primitive>(values: T[]): T[]
```

### distinctByPredicate

```ts
function distinctByPredicate&lt;T>(
  values: T[],
  predicate: (a: T) => string
): T[]
```

### remove

```ts
function remove&lt;A>(arr: A[], item: A): boolean
```

### removeByPredicate

```ts
function removeByPredicate&lt;A>(
  arr: A[],
  predicate: (a: A) => boolean
): boolean
```

### ofIterableIterator

```ts
function ofIterableIterator&lt;A>(it: IterableIterator&lt;A>): A[]
```

### diffOperations / applyOperations

```ts
interface DiffOperations&lt;T> {
  removals: Array&lt;{ at: number; qt: number }>
  swaps: Array&lt;{ from: number; to: number }>
  inserts: Array&lt;{ at: number; values: T[] }>
}

function diffOperations&lt;T, K>(
  from: T[],
  to: T[],
  getKey: (v: T) => K
): DiffOperations&lt;T>

function applyOperations&lt;T>(
  operations: DiffOperations&lt;T>,
  start: T[]
): T[]
```

### joinWithConjunction

```ts
function joinWithConjunction&lt;A>(
  arr: A[],
  conjunction = ' and ',
  separator = ', '
): string
```

### rank

```ts
function rank&lt;T>(
  array: T[],
  compare: (a: T, b: T) => number,
  incrementDuplicates = true
): number[]
```

# Async

TODO

# AsyncResult

```ts
import { /* utility_to_import */ } '@tempots/std/async-result'
```

TODO

```ts
interface NotAsked {
  type: 'NotAsked'
}
```

```ts
interface Loading&lt;V> {
  type: 'Loading'
  previousValue?: V
}
```

```ts
interface Success&lt;V> {
  type: 'Success'
  value: V
}
```

```ts
interface Failure&lt;E> {
  type: 'Failure'
  error: E
}
```

```ts
type AsyncResult&lt;V, E> = NotAsked | Loading&lt;V> | Success&lt;V> | Failure&lt;E>
```

```ts
const AsyncResult = {
  notAsked: AsyncResult&lt;never, never>,
  loading&lt;V>(previousValue: Maybe&lt;V> = undefined): AsyncResult&lt;V, never>,
  success&lt;V>(value: V): AsyncResult&lt;V, never>,
  failure&lt;E>(error: E): AsyncResult&lt;never, E>,
  isSuccess&lt;V, E>(r: AsyncResult&lt;V, E>): r is Success&lt;V>,
  isFailure&lt;V, E>(r: AsyncResult&lt;V, E>): r is Failure&lt;E>,
  isNotAsked&lt;V, E>(r: AsyncResult&lt;V, E>): r is NotAsked,
  isLoading&lt;V, E>(r: AsyncResult&lt;V, E>): r is Loading&lt;V>,
  getOrElse&lt;V, E>(r: AsyncResult&lt;V, E>, alt: V): V,
  getOrElseLazy&lt;V, E>(r: AsyncResult&lt;V, E>, altf: () => V): V,
  getOrNull&lt;V, E>(r: AsyncResult&lt;V, E>): V | null,
  getOrUndefined&lt;V, E>(r: AsyncResult&lt;V, E>): Maybe&lt;V>,
  cmatch:
    &lt;V1, V2, E>(
      success: (value: V1) => V2,
      failure: (error: E) => V2,
      loading: (previousValue?: V1) => V2,
      idle: () => V2 = loading
    ) =>
    (r: AsyncResult&lt;V1, E>): V2,
  match: &lt;V1, V2, E>(
    r: AsyncResult&lt;V1, E>,
    success: (value: V1) => V2,
    failure: (error: E) => V2,
    loading: (previousValue?: V1) => V2,
    idle: () => V2 = loading
  ): V2,
  whenSuccess:
    &lt;V, E>(apply: (v: V) => void) =>
    (r: AsyncResult&lt;V, E>): AsyncResult&lt;V, E>,
  whenFailure:
    &lt;V, E>(apply: (e: E) => void) =>
    (r: AsyncResult&lt;V, E>): AsyncResult&lt;V, E>,
}
```

# Bigint helpers

```ts
import { /* utility_to_import */ } '@tempots/std/bigint'
```

TODO

### ceilDiv

```ts
function ceilDiv(x: bigint, y: bigint): bigint
```

### floorDiv

```ts
function floorDiv(x: bigint, y: bigint): bigint
```

### compare

```ts
function compare(x: bigint, y: bigint): number
```

### abs

```ts
function abs(x: bigint): bigint
```

### min

```ts
function min(x: bigint, y: bigint): bigint
```

### max

```ts
function max(x: bigint, y: bigint): bigint
```

### pow

```ts
function pow(x: bigint, y: bigint): bigint
```

### gcd

```ts
function gcd(x: bigint, y: bigint): bigint
```

### lcm

```ts
function lcm(x: bigint, y: bigint): bigint
```

### isPrime

```ts
function isPrime(x: bigint): boolean
```

### nextPrime

```ts
function nextPrime(x: bigint): bigint
```

### prevPrime

```ts
function prevPrime(x: bigint): bigint
```

### isEven

```ts
function isEven(x: bigint): boolean
```

### isOdd

```ts
function isOdd(x: bigint): boolean
```

### isZero

```ts
function isZero(x: bigint): boolean
```

### isOne

```ts
function isOne(x: bigint): boolean
```

### isNegative

```ts
function isNegative(x: bigint): boolean
```

### isPositive

```ts
function isPositive(x: bigint): boolean
```

# Boolean helpers

```ts
import { /* utility_to_import */ } '@tempots/std/boolean'
```

Utility functions to manipulate `boolean` values.

Returns a comparison value (`Int`) from two boolean values.

### compare

```ts
function compare(a: boolean, b: boolean): number
```

Converts a boolean to an integer value (`true` => `1`, `false` => `0`).

### toInt

```ts
function toInt(v: boolean): number
```

Returns `true` if the passed value is either `true` or `false` (case insensitive).

### canParse

```ts
function canParse(v: string): boolean
```

Returns `true`/`false` if the passed value is `true`/`false` (case insensitive) with any other value it will return null.

### parse

```ts
function parse(v: string): boolean
```

Returns `true` when arguments are different.

### xor

```ts
function xor(a: boolean, b: boolean): boolean
```

# Equality helpers

```ts
import { /* utility_to_import */ } '@tempots/std/equal'
```

TODO

### strictEqual

```ts
function strictEqual&lt;A>(a: A, b: A): boolean
```

### deepEqual

```ts
function deepEqual&lt;A>(a: A, b: A): boolean
```

### looseEqual

```ts
function looseEqual&lt;T>(a: T, b: T): boolean
```

# Function helpers

```ts
import { /* utility_to_import */ } '@tempots/std/function'
```

TODO

### compose

```ts
function compose&lt;A>(): (a: A) => A
function compose&lt;A, B>(f1: (a: A) => B): (a: A) => B
function compose&lt;A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C
function compose&lt;A, B, C, D>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D
): (a: A) => D
function compose&lt;A, B, C, D, E>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E
): (a: A) => E
function compose&lt;A, B, C, D, E, F>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E,
  f5: (e: E) => F
): (a: A) => F
function compose&lt;A, B, C, D, E, F, G>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E,
  f5: (e: E) => F,
  f6: (f: F) => G
): (a: A) => G
```

### identity

```ts
function identity&lt;T>(v: T): T
```

### curryLeft

```ts
function curryLeft&lt;A, Rest extends any[], Ret>(
  f: (a: A, ...rest: Rest) => Ret
) => (a: A) => (...rest: Rest): Ret
```

### curryRight

```ts
function curryRight&lt;A, B, C, D>(
  f: (a: A, b: B, c: C) => D
): (a: A, b: B) => (c: C) => D
function curryRight&lt;A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E
): (a: A, b: B, c: C) => (d: D) => E
function curryRight&lt;A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F
): (a: A, b: B, c: C, d: D) => (e: E) => F
function curryRight&lt;A, B, C, D, E, F, G>(
  f: (a: A, b: B, c: C, d: D, e: E, f: F) => G
): (a: A, b: B, c: C, d: D, e: E) => (f: F) => G
```

### flip

```ts
function flip&lt;A, B, C>(f: (a: A, b: B) => C): (b: B, a: A) => C
function flip&lt;A, B, C, D>(
  f: (a: A, b: B, c: C) => D
): (c: C, b: B, a: A) => D
function flip&lt;A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E
): (d: D, c: C, b: B, a: A) => E
function flip&lt;A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E
): (d: D, c: C, b: B, a: A) => E
function flip&lt;A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F
): (e: E, d: D, c: C, b: B, a: A) => F
function flip&lt;A, B, C, D, E, F, G>(
  f: (a: A, b: B, c: C, d: D, e: E, f: F) => G
): (f: F, e: E, d: D, c: C, b: B, a: A) => G
```

### memoize

```ts
function memoize&lt;T>(f: () => NonNullable&lt;T>): () => NonNullable&lt;T>
```

# JSON Types

```ts
import { /* utility_to_import */ } '@tempots/std/json'
```

It provides the following types `JSONPrimitive`, `JSONObject`, `JSONArray`, and `JSONValue`.

Note that even if technically not correct, the value `undefined` is also considered a `JSONValue`.


# Number helpers

```ts
import { /* utility_to_import */ } '@tempots/std/number'
```

TODO

Returns the angular distance between 2 angles.

### angleDifference

```ts
function angleDifference(a: number, b: number, turn = 360.0): number
```

Rounds a number up to the specified number of decimals.

### ceilTo

```ts
function ceilTo(v: number, decimals: number): number
```

`clamp` restricts a value within the specified range.

```ts
log(clamp(1.3, 0, 1)) // prints 1
log(clamp(0.8, 0, 1)) // prints 0.8
log(clamp(-0.5, 0, 1)) // prints 0.0
```

### clamp

```ts
function clamp(value: number, min: number, max: number): number
```

### clampInt

```ts
function clampInt(value: number, min: number, max: number): number
```

Like clamp but you only pass one argument (`max`) that is used as the upper limit
and the opposite (additive inverse or `-max`) as the lower limit.

### clampSym

```ts
function clampSym(v: number, max: number): number
```

It returns the comparison value (an integer number) between two `float` values.

### compare

```ts
function compare(a: number, b: number): number
```

Rounds a number down to the specified number of decimals.

### floorTo

```ts
function floorTo(v: number, decimals: number): number
```

### toHex

```ts
function toHex(num: number, length = 0): string
```

`interpolate` returns a value between `a` and `b` for any value of `t` (normally between 0 and 1).
### interpolate

```ts
function interpolate(a: number, b: number, t: number): number
```

Interpolates values in a polar coordinate system looking for the narrowest delta angle.
It can be either clock-wise or counter-clock-wise.

### interpolateAngle

```ts
function interpolateAngle(
  a: number,
  b: number,
  t: number,
  turn = 360.0
): number
```

### widestAngleDifference

```ts
function widestAngleDifference(
  a: number,
  b: number,
  turn = 360.0
): number
```

Interpolates values in a polar coordinate system looking for the wideset delta angle.
It can be either clock-wise or counter-clock-wise.

### interpolateWidestAngle

```ts
function interpolateWidestAngle(
  a: number,
  b: number,
  t: number,
  turn = 360
): number
```

Interpolates values in a polar coordinate system always in clock-wise direction.

### interpolateAngleCW

```ts
function interpolateAngleCW(
  a: number,
  b: number,
  t: number,
  turn = 360
): number
```

Interpolates values in a polar coordinate system always in counter-clock-wise direction.

### interpolateAngleCCW

```ts
function interpolateAngleCCW(
  a: number,
  b: number,
  t: number,
  turn = 360
): number
```

number numbers can sometime introduce tiny errors even for simple operations.
`nearEquals` compares two floats using a tiny tollerance (last optional
argument). By default it is defined as `EPSILON`.

### nearEquals

```ts
function nearEquals(
  a: number,
  b: number,
  tollerance = EPSILON
): boolean
```

number numbers can sometime introduce tiny errors even for simple operations.
`nearEqualAngles` compares two angles (default is 360deg) using a tiny
tollerance (last optional argument). By default the tollerance is defined as
`EPSILON`.

### nearEqualAngles

```ts
function nearEqualAngles(
  a: number,
  b: number,
  turn = 360.0,
  tollerance = EPSILON
): boolean
```

`nearZero` finds if the passed number is zero or very close to it. By default
`EPSILON` is used as the tollerance value.

### nearZero

```ts
function nearZero(n: number, tollerance = EPSILON): boolean
```

Computes the nth root (`index`) of `base`.

### root

```ts
function root(base: number, index: number): number
```

Rounds a number to the specified number of decimals.

### roundTo

```ts
function roundTo(f: number, decimals: number): number
```

`sign` returns `-1` if `value` is a negative number, `1` otherwise.

### sign

```ts
function sign&lt;T extends number>(value: T): number
```

Passed two boundaries values (`min`, `max`), `wrap` ensures that the passed value `v` will
be included in the boundaries. If the value exceeds `max`, the value is reduced by `min`
repeatedely until it falls within the range. Similar and inverted treatment is performed if
the value is below `min`.

### wrap

```ts
function wrap(v: number, min: number, max: number): number
```

Similar to `wrap`, it works for numbers between 0 and `max`.

### wrapCircular

```ts
function wrapCircular(v: number, max: number): number
```

# Object helpers

```ts
import { /* utility_to_import */ } '@tempots/std/object'
```

TODO

### keys

```ts
function keys&lt;T extends object>(obj: T): Array&lt;keyof T>
```

### sameKeys

```ts
function sameKeys&lt;T extends object>(a: T, b: T): boolean
```

### isObject

```ts
function isObject(obj: unknown): obj is Record&lt;IndexKey, unknown>
```

### removeFields

```ts
function removeFields&lt;T extends object, F extends Array&lt;keyof T>>(
  ob: T,
  ...fields: F
): Omit&lt;T, TupleToUnion&lt;F>>
```

### merge

```ts
function merge&lt;
  A extends Record&lt;IndexKey, unknown>,
  B extends Record&lt;IndexKey, unknown>,
>(a: A, b: B): Merge&lt;A, B>
```

### isEmpty

```ts
function isEmpty(obj: object): boolean
```

# RegExp helpers

```ts
import { /* utility_to_import */ } '@tempots/std/regexp'
```

TODO

Utility module to manipulate `RegExp` instances.

### map

Map the function `f` on each occurance matched by the pattern.

```ts
function map(
  subject: string,
  pattern: RegExp,
  f: (...s: string[]) => string
): string
```

# Result

```ts
import { /* utility_to_import */ } '@tempots/std/result'
```

TODO

```ts
interface Success&lt;V> {
  type: 'Success'
  value: V
}

interface Failure&lt;E> {
  type: 'Failure'
  error: E
}

type Result&lt;V, E> = Success&lt;V> | Failure&lt;E>
```

```ts
type PromiseResult&lt;V, E> = PromiseLike&lt;Result&lt;V, E>>
```

```ts
const Result = {
  success&lt;V>(value: V): Result&lt;V, any>,
  failure&lt;E>(error: E): Result&lt;any, E>,
  cmap:
    &lt;V1, V2, E>(f: (value: V1) => V2) =>
    (r: Result&lt;V1, E>): Result&lt;V2, E>,
  map: &lt;V1, V2, E>(r: Result&lt;V1, E>, f: (value: V1) => V2): Result&lt;V2, E>,
  cflatMap:
    &lt;V1, V2, E>(f: (value: V1) => Result&lt;V2, E>) =>
    (r: Result&lt;V1, E>): Result&lt;V2, E>,
  flatMap: &lt;V1, V2, E>(
    r: Result&lt;V1, E>,
    f: (value: V1) => Result&lt;V2, E>
  ): Result&lt;V2, E>,
  toAsync&lt;V, E>(r: Result&lt;V, E>): AsyncResult&lt;V, E>,
  isSuccess&lt;V, E>(r: Result&lt;V, E>): r is Success&lt;V>,
  isFailure&lt;V, E>(r: Result&lt;V, E>): r is Failure&lt;E>,
  getOrElse&lt;V, E>(r: Result&lt;V, E>, alt: V): V,
  getOrElseLazy&lt;V, E>(r: Result&lt;V, E>, altf: () => V): V,
  getOrNull&lt;V, E>(r: Result&lt;V, E>): V | null,
  getOrUndefined&lt;V, E>(r: Result&lt;V, E>): Maybe&lt;V>,
  cmatch:
    &lt;V1, V2, E>(success: (value: V1) => V2, failure: (error: E) => V2) =>
    (r: Result&lt;V1, E>): V2,
  match: &lt;V1, V2, E>(
    r: Result&lt;V1, E>,
    success: (value: V1) => V2,
    failure: (error: E) => V2
  ): V2,
  whenSuccess:
    &lt;V, E>(apply: (v: V) => void) =>
    (r: Result&lt;V, E>): Result&lt;V, E>,
  whenFailure:
    &lt;V, E>(apply: (e: E) => void) =>
    (r: Result&lt;V, E>): Result&lt;V, E>,
  combine: &lt;V, E>(
    r1: Result&lt;V, E>,
    r2: Result&lt;V, E>,
    combineV: (v1: V, v2: V) => V,
    combineE: (e1: E, e2: E) => E
  ): Result&lt;V, E>,
}
```

# String helpers

```ts
import { /* utility_to_import */ } '@tempots/std/string'
```

TODO

Utility functions to manipulate string values.

Replaces all occurrances of `placeholder` in `subject` with the value `replacement`.

### replace

```ts
function replace(
  subject: string,
  placeholder: string,
  replacement: string
): string
```

`after` searches for the first occurrance of `searchFor` and returns the text after that.

If `searchFor` is not found, an empty string is returned.

### after

```ts
function after(value: string, searchFor: string): string
```

`afterLast` searches for the last occurrance of `searchFor` and returns the text after that.

If `searchFor` is not found, an empty string is returned.

### afterLast

```ts
function afterLast(value: string, searchFor: string): string
```

`before` searches for the first occurrance of `searchFor` and returns the text before that.

If `searchFor` is not found, an empty string is returned.

### before

```ts
function before(value: string, searchFor: string): string
```

`beforeLast` searches for the last occurrance of `searchFor` and returns the text before that.

If `searchFor` is not found, an empty string is returned.

### beforeLast

```ts
function beforeLast(value: string, searchFor: string): string
```

`capitalize` returns a string with the first character convert to upper case.

### capitalize

```ts
function capitalize(s: string): string
```

Capitalize the first letter of every word in `value`. If `whiteSpaceOnly` is set to `true` the process is limited to whitespace separated words.

### capitalizeWords

```ts
function capitalizeWords(value: string, whiteSpaceOnly = false): string
```

Replaces occurrances of `\r\n`, `\n\r`, `\r` with `\n`

### canonicalizeNewlines

```ts
function canonicalizeNewlines(value: string): string
```

Compares two strings ignoring their case.

### compareCaseInsensitive

```ts
function compareCaseInsensitive(a: string, b: string): number
```

### endsWith

```ts
function endsWith(s: string, end: string): boolean
```

### endsWithCaseInsensitive

```ts
function endsWithCaseInsensitive(s: string, end: string): boolean
```

### startsWith

```ts
function startsWith(s: string, start: string): boolean
```

### startsWithCaseInsensitive

```ts
function startsWithCaseInsensitive(s: string, start: string): boolean
```

Compares a string `s` with many `values` and see if one of them matches its end ignoring their case.

### endsWithAnyCaseInsensitive

```ts
function endsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean
```

Compares a string `s` with many `values` and see if one of them matches its beginning ignoring their case.

### startsWithAnyCaseInsensitive

```ts
function startsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean
```

It cleans up all the whitespaces in the passed `value`. `collapse` does the following:

- remove trailing/leading whitespaces
- within the string, it collapses seqeunces of whitespaces into a single space character

For whitespaces in this description, it is intended to be anything that is matched by the regular expression `\s`.

### collapse

```ts
function collapse(value: string): string
```

It compares to string and it returns a negative number if `a` is inferior to `b`, zero if they are the same, or otherwise a positive non-sero number.

### compare

```ts
function compare(a: string, b: string): number
```

`contains` returns `true` if `s` contains one or more occurrences of `test` regardless of the text case.

### containsCaseInsensitive

```ts
function containsCaseInsensitive(s: string, test: string): boolean
```

`contains` returns `true` if `s` contains one or more occurrences of `test`.

### contains

```ts
function contains(s: string, test: string): boolean
```

Return the number of occurances of `test` in `s`.

### count

```ts
function count(s: string, test: string): number
```

`contains` returns `true` if `s` contains any of the strings in `tests` regardless of the text case

### containsAnyCaseInsensitive

```ts
function containsAnyCaseInsensitive(
  s: string,
  tests: string[]
): boolean
```

`contains` returns `true` if `s` contains any of the strings in `tests`

### containsAny

```ts
function containsAny(s: string, tests: string[]): boolean
```

`contains` returns `true` if `s` contains all of the strings in `tests` regardless of the text case

### containsAllCaseInsensitive

```ts
function containsAllCaseInsensitive(
  s: string,
  tests: string[]
): boolean
```

`contains` returns `true` if `s` contains all of the strings in `tests`

### containsAll

```ts
function containsAll(s: string, tests: string[]): boolean
```

dasherize` replaces all the occurrances of `_` with `-`

### dasherize

```ts
function dasherize(s: string): string
```

Compares strings `a` and `b` and returns the position where they differ.
If the strings are equal, it returns `-1`.

```ts
diffIndex('abcdef', 'abc123') // returns 3
```

### diffIndex

```ts
function diffIndex(a: string, b: string): number
```

`ellipsis` truncates `s` at len `maxlen` replaces the last characters with the content of `symbol`.

```ts
ellipsis('tempo is a nice library', 9) // returns 'tempo is …'
```

### ellipsis

```ts
function ellipsis(s: string, maxlen = 20, symbol = '…'): string
```

Same as `ellipsis` but puts the symbol in the middle of the string and not to the end.

```ts
ellipsisMiddle('tempo is a nice library', 18) // returns 'tempo is … library'
```

### ellipsisMiddle

```ts
function ellipsisMiddle(s: string, maxlen = 20, symbol = '…'): string
```

Returns `true` if `s` ends with any of the values in `values`.
### endsWithAny

```ts
function endsWithAny(s: string, values: string[]): boolean
```

`filter` applies `predicate` character by character to `s` and it returns a filtered version of the string.

### filter

```ts
function filter(s: string, predicate: (s: string) => boolean): string
```

Same as `filter` but `predicate` operates on integer char codes instead of string characters.

### filterCharcode

```ts
function filterCharcode(
  s: string,
  predicate: (n: number) => boolean
): string
```

`from` searches for the first occurrance of `searchFor` and returns the text from that point on. If `searchFor` is not found, an empty string is returned.

### from

```ts
function from(value: string, searchFor: string): string
```

### hashCode

```ts
function hashCode(value: string, seed = 0x811c9dc5): number
```

Returns `true` if `value` is not `null` and contains at least one character.

### hasContent

```ts
function hasContent(value: string): boolean
```

Works the same as `underscore` but also replaces underscores with whitespaces.

### humanize

```ts
function humanize(s: string): string
```

Checks if `s` contains only (and at least one) alphabetical characters.

### isAlpha

```ts
function isAlpha(s: string): boolean
```

`isAlphaNum` returns `true` if the string only contains alpha-numeric characters.

### isAlphaNum

```ts
function isAlphaNum(value: string): boolean
```

### isBreakingWhitespace

```ts
function isBreakingWhitespace(value: string): boolean
```

Returns `true` if the value string is composed of only lower cased characters or case neutral characters.

### isLowerCase

```ts
function isLowerCase(value: string): boolean
```

Returns `true` if the value string is composed of only upper cased characters or case neutral characters.

### isUpperCase

```ts
function isUpperCase(value: string): boolean
```

`ifEmpty` returns `value` if it is neither `null` or empty, otherwise it returns `alt`

### ifEmpty

```ts
function ifEmpty(value: string, alt: string): string
```

`isDigitsOnly` returns `true` if the string only contains digits.

### isDigitsOnly

```ts
function isDigitsOnly(value: string): boolean
```

`isEmpty` returns true if either `value` is null or is an empty string.
### isEmpty

```ts
function isEmpty(value: string): boolean
```

Convert first letter in `value` to lower case.

### lowerCaseFirst

```ts
function lowerCaseFirst(value: string): string
```

Returns a random substring from the `value` argument. The length of such value is by default `1`.

### random

```ts
function random(value: string, length = 1): string
```

Returns a random sampling of the specified length from the seed string.
### randomSequence

```ts
function randomSequence(alphabet: string, length: number): string
```

Like `randomSequence`, but automatically uses the base64 sequence as the seed string.

### randomSequence64

```ts
function randomSequence64(length: number): string
```

It maps a string character by character using `callback`.

### map

```ts
function map&lt;T>(callback: (c: string) => T, value: string): T[]
```

If present, it removes all the occurrences of `toremove` from `value`.

### remove

```ts
function remove(value: string, toremove: string): string
```

If present, it removes the `toremove` text from the end of `value`.

### removeAfter

```ts
function removeAfter(value: string, toremove: string): string
```

Removes a slice from `index` to `index + length` from `value`.

### removeAt

```ts
function removeAt(value: string, index: number, length: number): string
```

If present, it removes the `toremove` text from the beginning of `value`.
### removeBefore

```ts
function removeBefore(value: string, toremove: string): string
```

If present, it removes the first occurrence of `toremove` from `value`.
### removeOne

```ts
function removeOne(value: string, toremove: string): string
```

`repeat` builds a new string by repeating the argument `s`, n `times`.

```ts
repeat('Xy', 3) // generates 'XyXyXy'
```
### repeat

```ts
function repeat(s: string, times: number): string
```

Returns a new string whose characters are in reverse order.

### reverse

```ts
function reverse(s: string): string
```

Converts a string in a quoted string.

### smartQuote

```ts
function smartQuote(s: string, prefer = "'"): string
```

### quote

```ts
function quote(s: string, quoteChar = "'"): string
```

### jsQuote

```ts
function jsQuote(s: string, prefer = "'"): string
```

It only splits on the first occurrance of separator.

### splitOnce

```ts
function splitOnce(
  s: string,
  separator: string
): [string] | [string, string]
```

Returns `true` if `s` starts with any of the values in `values`.

### startsWithAny

```ts
function startsWithAny(s: string, values: string[]): boolean
```

`stripTags` removes any HTML/XML markup from the string leaving only the concatenation of the existing text nodes.

### stripTags

```ts
function stripTags(s: string): string
```

Surrounds a string with the contents of `left` and `right`. If `right` is omitted, `left` will be used on both sides.

### surround

```ts
function surround(s: string, left: string, right = left): string
```

It transforms a string into an `Array` of characters.

### toArray

```ts
function toArray(s: string): string[]
```

It transforms a string into an `Array` of char codes in integer format.

### toCharcodes

```ts
function toCharcodes(s: string): number[]
```

Returns an array of `string` whose elements are equally long (using `len`). If the string `s` is not exactly divisible by `len` the last element of the array will be shorter.

### toChunks

```ts
function toChunks(s: string, len: number): string[]
```

Returns an array of `string` split by line breaks.

### toLines

```ts
function toLines(s: string): string[]
```

`trimChars` removes from the beginning and the end of the string any character that is present in `charlist`.

### trimChars

```ts
function trimChars(value: string, charlist: string): string
```

`trimCharsLeft` removes from the beginning of the string any character that is present in `charlist`.

### trimCharsLeft

```ts
function trimCharsLeft(value: string, charlist: string): string
```

`trimCharsRight` removes from the end of the string any character that is present in `charlist`.

### trimCharsRight

```ts
function trimCharsRight(value: string, charlist: string): string
```

`underscore` finds UpperCase characters and turns them into LowerCase and prepends them with a whtiespace.
Sequences of more than one UpperCase character are left untouched.

### underscore

```ts
function underscore(s: string): string
```

Convert first letter in `value` to upper case.

### upperCaseFirst

```ts
function upperCaseFirst(value: string): string
```

`upTo` searches for the first occurrance of `searchFor` and returns the text up to that point.
If `searchFor` is not found, the entire string is returned.

### upTo

```ts
function upTo(value: string, searchFor: string): string
```

`wrapColumns` splits a long string into lines that are at most `columns` long.
Words whose length exceeds `columns` are not split.

### wrapColumns

```ts
function wrapColumns(
  s: string,
  columns = 78,
  indent = '',
  newline = '\n'
): string
```

### isSpaceAt

```ts
function isSpaceAt(s: string, pos: number): boolean
```

### encodeBase64

```ts
function encodeBase64(s: string): string
```

### decodeBase64

```ts
function decodeBase64(s: string): string
```

### wrapLine

```ts
function wrapLine(
  s: string,
  columns: number,
  indent: string,
  newline: string
): string
```

### lpad

```ts
function lpad(s: string, char: string, length: number): string
```

### rpad

```ts
function rpad(s: string, char: string, length: number): string
```

### splitOnLast

```ts
function splitOnLast(
  s: string,
  find: string
): [string] | [string, string]
```

### splitOnFirst

```ts
function splitOnFirst(
  s: string,
  find: string
): [string] | [string, string]
```

# Validation

```ts
import { /* utility_to_import */ } '@tempots/std/validation'
```

TODO

```ts
interface Valid {
  type: 'valid'
}
interface Invalid&lt;E> {
  type: 'invalid'
  error: E
}
type Validation&lt;E> = Valid | Invalid&lt;E>
```

```ts
type PromiseValidation&lt;E> = PromiseLike&lt;Validation&lt;E>>
```

```ts
const Validation = {
  valid: { type: 'valid' } satisfies Validation&lt;any>,
  invalid&lt;E>(error: E): Validation&lt;E>,
  isValid&lt;E>(r: Validation&lt;E>): r is Valid,
  isInvalid&lt;E>(r: Validation&lt;E>): r is Invalid&lt;E>,
  cmatch:
    &lt;V, E>(valid: () => V, invalid: (error: E) => V) =>
    (r: Validation&lt;E>): V,
  match: &lt;V, E>(
    r: Validation&lt;E>,
    valid: () => V,
    invalid: (error: E) => V
  ): V,
  toResult: &lt;T, E>(value: T): ((validation: Validation&lt;E>) => Result&lt;T, E>),
  whenValid:
    &lt;E>(apply: () => void) =>
    (r: Validation&lt;E>): Validation&lt;E>,
  whenInvalid:
    &lt;E>(apply: (e: E) => void) =>
    (r: Validation&lt;E>): Validation&lt;E>,
}
```

# Tempo reusable types

```ts
import { /* utility_to_import */ } '@tempots/std/domain'
```

Contains type helpers generally useful during development.

### Compare

Type type of a comparison function that takes two arguments `T` and returns `number`.

```ts
type Compare&lt;T>
```

### Fun0 to Fun6

Function types with 0 to 6 arguments.

```ts
type Fun0&lt;R>
type Fun1&lt;A, R>
type Fun2&lt;A, B, R>
type Fun3&lt;A, B, C, R>
type Fun4&lt;A, B, C, D, R>
type Fun5&lt;A, B, C, D, E, R>
type Fun6&lt;A, B, C, D, E, F, R>
```

### FilterTuple&lt;T>

Filters a tuple type by a type.

```ts
type FilterTuple&lt;T extends unknown[], N>
```

### FirstArgument&lt;F>

Extracts the first argument type of a function.

```ts
type FirstArgument&lt;F> = F extends Fun1&lt;infer A, unknown> ? A : never
```

### Id

Flattens an object type.

```ts
type Id&lt;T> = {} & { [P in keyof T]: T[P] }
```

### IndexKey

The type of an object/array key.

```ts
type IndexKey
```

### Maybe&lt;T>

A type that can be `T` or `undefined`.

```ts
type Maybe&lt;T> = T | undefined
```

### Merge&lt;A, B>

Merges two object types.

```ts
type Merge&lt;A, B> = Id&lt;A & B>
```

### Nothing

The type of `null` or `undefined`.

```ts
type Nothing = undefined | null
```

### Primitive

The type of a primitive JavaScript/TypeScript value.

```ts
type Primitive = string | boolean | number | null | undefined
```

### SplitLiteral&lt;T, SplitBy>

Splits a string literal by a string literal.

```ts
type SplitLiteral&lt;
  T extends string,
  SplitBy extends string,
>
```

### SplitLiteralToUnion&lt;T, SplitBy>

Splits a string literal by a string literal and converts the result to a union type.

```ts
type SplitLiteralToUnion&lt;
  T extends string,
  SplitBy extends string,
>
```


### TupleToUnion&lt;T>

Converts a tuple type to a union type.

```ts
type TupleToUnion&lt;T extends unknown[]> = T[number]
```
