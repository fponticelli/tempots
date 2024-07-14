**@tempots/std** provides the following utility functions and types.

## array

```ts
import '@tempots/std/array'
```

Contains utility functions for working with arrays.

TODO

```ts
function map&lt;A, B&gt;(arr: A[], f: (a: A, index: number) =&gt; B): B[]
```

```ts
function mapNotNull&lt;A, B&gt;(
  arr: A[],
  f: (a: A, index: number) =&gt; B | Nothing
): B[]
```

```ts
function flatMap&lt;A, B&gt;(arr: A[], f: (a: A) =&gt; B[]): B[]
```

```ts
function head&lt;A&gt;(arr: A[]): Maybe&lt;A&gt;
```

```ts
function tail&lt;A&gt;(arr: A[]): A[]
```

```ts
function equals&lt;T&gt;(
  a: T[],
  b: T[],
  equality: (a: T, b: T) =&gt; boolean
): boolean
```

```ts
function makeEquals&lt;T&gt;(equality: (a: T, b: T) =&gt; boolean)
  =&gt; (a: T[], b: T[])
  =&gt; boolean
```

```ts
function isEmpty&lt;T&gt;(arr: T[]): arr is []
```

```ts
function hasValues&lt;T&gt;(arr: T[]): arr is [T, ...T[]]
```

```ts
function filter&lt;T&gt;(arr: T[], predicate: (v: T) =&gt; boolean): T[]
```

```ts
function filterMap&lt;A, B&gt;(
  arr: A[],
  f: (a: A, index: number) =&gt; Maybe&lt;B&gt;
): B[]
```

```ts
function filterNulls&lt;T&gt;(arr: Array&lt;T | Nothing&gt;): T[]
```

```ts
function flatten&lt;T&gt;(arr: T[][]): T[]
```

```ts
function foldLeft&lt;T, B&gt;(arr: T[], f: (acc: B, curr: T) =&gt; B, b: B): B
```

```ts
function all&lt;T&gt;(arr: T[], predicate: (v: T) =&gt; boolean): boolean
```

```ts
function any&lt;T&gt;(arr: T[], predicate: (v: T) =&gt; boolean): boolean
```

```ts
function each&lt;T&gt;(arr: T[], f: (v: T) =&gt; void): void
```

```ts
function concat&lt;A&gt;(...arrs: A[][]): A[]
```

```ts
function makeCompare&lt;A&gt;(comparef: Compare&lt;A&gt;, shorterFirst = true)
  =&gt; (a: A[], b: A[])
  =&gt; number
```

```ts
function sort&lt;A&gt;(compare: Compare&lt;A&gt;, arr: A[]): A[]
```

```ts
function range&lt;A&gt;(length: number, f: (index: number) =&gt; A): A[]
```

```ts
function numbersRange(length: number, startAt = 0): number[]
```

```ts
function fill&lt;A&gt;(length: number, value: A): A[]
```

```ts
function distinctPrimitive&lt;T extends Primitive&gt;(values: T[]): T[]
```

```ts
function distinctByPredicate&lt;T&gt;(
  values: T[],
  predicate: (a: T) =&gt; string
): T[]
```

```ts
function remove&lt;A&gt;(arr: A[], item: A): boolean
```

```ts
function removeByPredicate&lt;A&gt;(
  arr: A[],
  predicate: (a: A) =&gt; boolean
): boolean
```

```ts
function ofIterableIterator&lt;A&gt;(it: IterableIterator&lt;A&gt;): A[]
```

```ts
interface DiffOperations&lt;T&gt; {
  removals: Array&lt;{ at: number; qt: number }&gt;
  swaps: Array&lt;{ from: number; to: number }&gt;
  inserts: Array&lt;{ at: number; values: T[] }&gt;
}

function diffOperations&lt;T, K&gt;(
  from: T[],
  to: T[],
  getKey: (v: T) =&gt; K
): DiffOperations&lt;T&gt;

function applyOperations&lt;T&gt;(
  operations: DiffOperations&lt;T&gt;,
  start: T[]
): T[]
```

```ts
function joinWithConjunction&lt;A&gt;(
  arr: A[],
  conjunction = ' and ',
  separator = ', '
): string
```

```ts
function rank&lt;T&gt;(
  array: T[],
  compare: (a: T, b: T) =&gt; number,
  incrementDuplicates = true
): number[]
```

## async

```ts
import '@tempots/std/async-result'
```

TODO

```ts
interface NotAsked {
  type: 'NotAsked'
}
```

```ts
interface Loading&lt;V&gt; {
  type: 'Loading'
  previousValue?: V
}
```

```ts
interface Success&lt;V&gt; {
  type: 'Success'
  value: V
}
```

```ts
interface Failure&lt;E&gt; {
  type: 'Failure'
  error: E
}
```

```ts
type AsyncResult&lt;V, E&gt; = NotAsked | Loading&lt;V&gt; | Success&lt;V&gt; | Failure&lt;E&gt;
```

```ts
const AsyncResult = {
  notAsked: AsyncResult&lt;never, never&gt;,
  loading&lt;V&gt;(previousValue: Maybe&lt;V&gt; = undefined): AsyncResult&lt;V, never&gt;,
  success&lt;V&gt;(value: V): AsyncResult&lt;V, never&gt;,
  failure&lt;E&gt;(error: E): AsyncResult&lt;never, E&gt;,
  isSuccess&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): r is Success&lt;V&gt;,
  isFailure&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): r is Failure&lt;E&gt;,
  isNotAsked&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): r is NotAsked,
  isLoading&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): r is Loading&lt;V&gt;,
  getOrElse&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;, alt: V): V,
  getOrElseLazy&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;, altf: () =&gt; V): V,
  getOrNull&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): V | null,
  getOrUndefined&lt;V, E&gt;(r: AsyncResult&lt;V, E&gt;): Maybe&lt;V&gt;,
  cmatch:
    &lt;V1, V2, E&gt;(
      success: (value: V1) =&gt; V2,
      failure: (error: E) =&gt; V2,
      loading: (previousValue?: V1) =&gt; V2,
      idle: () =&gt; V2 = loading
    ) =&gt;
    (r: AsyncResult&lt;V1, E&gt;): V2,
  match: &lt;V1, V2, E&gt;(
    r: AsyncResult&lt;V1, E&gt;,
    success: (value: V1) =&gt; V2,
    failure: (error: E) =&gt; V2,
    loading: (previousValue?: V1) =&gt; V2,
    idle: () =&gt; V2 = loading
  ): V2,
  whenSuccess:
    &lt;V, E&gt;(apply: (v: V) =&gt; void) =&gt;
    (r: AsyncResult&lt;V, E&gt;): AsyncResult&lt;V, E&gt;,
  whenFailure:
    &lt;V, E&gt;(apply: (e: E) =&gt; void) =&gt;
    (r: AsyncResult&lt;V, E&gt;): AsyncResult&lt;V, E&gt;,
}
```

## bigint

```ts
import '@tempots/std/bigint'
```

TODO

```ts
function ceilDiv(x: bigint, y: bigint): bigint
```

```ts
function floorDiv(x: bigint, y: bigint): bigint
```

```ts
function compare(x: bigint, y: bigint): number
```

```ts
function abs(x: bigint): bigint
```

```ts
function min(x: bigint, y: bigint): bigint
```

```ts
function max(x: bigint, y: bigint): bigint
```

```ts
function pow(x: bigint, y: bigint): bigint
```

```ts
function gcd(x: bigint, y: bigint): bigint
```

```ts
function lcm(x: bigint, y: bigint): bigint
```

```ts
function isPrime(x: bigint): boolean
```

```ts
function nextPrime(x: bigint): bigint
```

```ts
function prevPrime(x: bigint): bigint
```

```ts
function isEven(x: bigint): boolean
```

```ts
function isOdd(x: bigint): boolean
```

```ts
function isZero(x: bigint): boolean
```

```ts
function isOne(x: bigint): boolean
```

```ts
function isNegative(x: bigint): boolean
```

```ts
function isPositive(x: bigint): boolean
```


## boolean

```ts
import '@tempots/std/boolean'
```

Utility functions to manipulate `boolean` values.

Returns a comparison value (`Int`) from two boolean values.

```ts
function compare(a: boolean, b: boolean): number
```

Converts a boolean to an integer value (`true` =&gt; `1`, `false` =&gt; `0`).

```ts
function toInt(v: boolean): number
```

Returns `true` if the passed value is either `true` or `false` (case insensitive).

```ts
function canParse(v: string): boolean
```

Returns `true`/`false` if the passed value is `true`/`false` (case insensitive) with any other value it will return null.

```ts
function parse(v: string): boolean
```

Returns `true` when arguments are different.

```ts
function xor(a: boolean, b: boolean): boolean
```

## equal

```ts
import '@tempots/std/equal'
```

TODO

```ts
function strictEqual&lt;A&gt;(a: A, b: A): boolean
```

```ts
function deepEqual&lt;A&gt;(a: A, b: A): boolean
```

```ts
function looseEqual&lt;T&gt;(a: T, b: T): boolean
```

## function

```ts
import '@tempots/std/function'
```

TODO

```ts
function compose&lt;A&gt;(): (a: A) =&gt; A
function compose&lt;A, B&gt;(f1: (a: A) =&gt; B): (a: A) =&gt; B
function compose&lt;A, B, C&gt;(f1: (a: A) =&gt; B, f2: (b: B) =&gt; C): (a: A) =&gt; C
function compose&lt;A, B, C, D&gt;(
  f1: (a: A) =&gt; B,
  f2: (b: B) =&gt; C,
  f3: (c: C) =&gt; D
): (a: A) =&gt; D
function compose&lt;A, B, C, D, E&gt;(
  f1: (a: A) =&gt; B,
  f2: (b: B) =&gt; C,
  f3: (c: C) =&gt; D,
  f4: (d: D) =&gt; E
): (a: A) =&gt; E
function compose&lt;A, B, C, D, E, F&gt;(
  f1: (a: A) =&gt; B,
  f2: (b: B) =&gt; C,
  f3: (c: C) =&gt; D,
  f4: (d: D) =&gt; E,
  f5: (e: E) =&gt; F
): (a: A) =&gt; F
function compose&lt;A, B, C, D, E, F, G&gt;(
  f1: (a: A) =&gt; B,
  f2: (b: B) =&gt; C,
  f3: (c: C) =&gt; D,
  f4: (d: D) =&gt; E,
  f5: (e: E) =&gt; F,
  f6: (f: F) =&gt; G
): (a: A) =&gt; G
```

```ts
function identity&lt;T&gt;(v: T): T
```

```ts
function curryLeft&lt;A, Rest extends any[], Ret&gt;(
  f: (a: A, ...rest: Rest) =&gt; Ret
) =&gt; (a: A) =&gt; (...rest: Rest): Ret
```

```ts
function curryRight&lt;A, B, C, D&gt;(
  f: (a: A, b: B, c: C) =&gt; D
): (a: A, b: B) =&gt; (c: C) =&gt; D
function curryRight&lt;A, B, C, D, E&gt;(
  f: (a: A, b: B, c: C, d: D) =&gt; E
): (a: A, b: B, c: C) =&gt; (d: D) =&gt; E
function curryRight&lt;A, B, C, D, E, F&gt;(
  f: (a: A, b: B, c: C, d: D, e: E) =&gt; F
): (a: A, b: B, c: C, d: D) =&gt; (e: E) =&gt; F
function curryRight&lt;A, B, C, D, E, F, G&gt;(
  f: (a: A, b: B, c: C, d: D, e: E, f: F) =&gt; G
): (a: A, b: B, c: C, d: D, e: E) =&gt; (f: F) =&gt; G
```


```ts
function flip&lt;A, B, C&gt;(f: (a: A, b: B) =&gt; C): (b: B, a: A) =&gt; C
function flip&lt;A, B, C, D&gt;(
  f: (a: A, b: B, c: C) =&gt; D
): (c: C, b: B, a: A) =&gt; D
function flip&lt;A, B, C, D, E&gt;(
  f: (a: A, b: B, c: C, d: D) =&gt; E
): (d: D, c: C, b: B, a: A) =&gt; E
function flip&lt;A, B, C, D, E&gt;(
  f: (a: A, b: B, c: C, d: D) =&gt; E
): (d: D, c: C, b: B, a: A) =&gt; E
function flip&lt;A, B, C, D, E, F&gt;(
  f: (a: A, b: B, c: C, d: D, e: E) =&gt; F
): (e: E, d: D, c: C, b: B, a: A) =&gt; F
function flip&lt;A, B, C, D, E, F, G&gt;(
  f: (a: A, b: B, c: C, d: D, e: E, f: F) =&gt; G
): (f: F, e: E, d: D, c: C, b: B, a: A) =&gt; G
```

```ts
function memoize&lt;T&gt;(f: () =&gt; NonNullable&lt;T&gt;): () =&gt; NonNullable&lt;T&gt;
```

## json

```ts
import '@tempots/std/json'
```

It provides the following types `JSONPrimitive`, `JSONObject`, `JSONArray`, and `JSONValue`.

Note that even if technically not correct, the value `undefined` is also considered a `JSONValue`.


## number

```ts
import '@tempots/std/number'
```

TODO

Returns the angular distance between 2 angles.

```ts
function angleDifference(a: number, b: number, turn = 360.0): number
```

Rounds a number up to the specified number of decimals.

```ts
function ceilTo(v: number, decimals: number): number
```

`clamp` restricts a value within the specified range.

```ts
log(clamp(1.3, 0, 1)) // prints 1
log(clamp(0.8, 0, 1)) // prints 0.8
log(clamp(-0.5, 0, 1)) // prints 0.0
```

```ts
function clamp(value: number, min: number, max: number): number
```

```ts
function clampInt(value: number, min: number, max: number): number
```

Like clamp but you only pass one argument (`max`) that is used as the upper limit
and the opposite (additive inverse or `-max`) as the lower limit.

```ts
function clampSym(v: number, max: number): number
```

It returns the comparison value (an integer number) between two `float` values.

```ts
function compare(a: number, b: number): number
```

Rounds a number down to the specified number of decimals.

```ts
function floorTo(v: number, decimals: number): number
```

```ts
function toHex(num: number, length = 0): string
```

`interpolate` returns a value between `a` and `b` for any value of `t` (normally between 0 and 1).
```ts
function interpolate(a: number, b: number, t: number): number
```

Interpolates values in a polar coordinate system looking for the narrowest delta angle.
It can be either clock-wise or counter-clock-wise.

```ts
function interpolateAngle(
  a: number,
  b: number,
  t: number,
  turn = 360.0
): number
```

```ts
function widestAngleDifference(
  a: number,
  b: number,
  turn = 360.0
): number
```

Interpolates values in a polar coordinate system looking for the wideset delta angle.
It can be either clock-wise or counter-clock-wise.

```ts
function interpolateWidestAngle(
  a: number,
  b: number,
  t: number,
  turn = 360
): number
```

Interpolates values in a polar coordinate system always in clock-wise direction.

```ts
function interpolateAngleCW(
  a: number,
  b: number,
  t: number,
  turn = 360
): number
```

Interpolates values in a polar coordinate system always in counter-clock-wise direction.

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

```ts
function nearZero(n: number, tollerance = EPSILON): boolean
```

Computes the nth root (`index`) of `base`.

```ts
function root(base: number, index: number): number
```

Rounds a number to the specified number of decimals.

```ts
function roundTo(f: number, decimals: number): number
```

`sign` returns `-1` if `value` is a negative number, `1` otherwise.

```ts
function sign&lt;T extends number&gt;(value: T): number
```

Passed two boundaries values (`min`, `max`), `wrap` ensures that the passed value `v` will
be included in the boundaries. If the value exceeds `max`, the value is reduced by `min`
repeatedely until it falls within the range. Similar and inverted treatment is performed if
the value is below `min`.

```ts
function wrap(v: number, min: number, max: number): number
```

Similar to `wrap`, it works for numbers between 0 and `max`.

```ts
function wrapCircular(v: number, max: number): number
```

## object

```ts
import '@tempots/std/object'
```

TODO

```ts
function keys&lt;T extends object&gt;(obj: T): Array&lt;keyof T&gt;
```

```ts
function sameKeys&lt;T extends object&gt;(a: T, b: T): boolean
```

```ts
function isObject(obj: unknown): obj is Record&lt;IndexKey, unknown&gt;
```

```ts
function removeFields&lt;T extends object, F extends Array&lt;keyof T&gt;&gt;(
  ob: T,
  ...fields: F
): Omit&lt;T, TupleToUnion&lt;F&gt;&gt;
```

```ts
function merge&lt;
  A extends Record&lt;IndexKey, unknown&gt;,
  B extends Record&lt;IndexKey, unknown&gt;,
&gt;(a: A, b: B): Merge&lt;A, B&gt;
```

```ts
function isEmpty(obj: object): boolean
```

## regexp

```ts
import '@tempots/std/regexp'
```

TODO

Utility module to manipulate `RegExp` instances.

Map the function `f` on each occurance matched by the pattern.

```ts
function map(
  subject: string,
  pattern: RegExp,
  f: (...s: string[]) =&gt; string
): string
```

## result

```ts
import '@tempots/std/result'
```

TODO

```ts
interface Success&lt;V&gt; {
  type: 'Success'
  value: V
}

interface Failure&lt;E&gt; {
  type: 'Failure'
  error: E
}

type Result&lt;V, E&gt; = Success&lt;V&gt; | Failure&lt;E&gt;
```

```ts
type PromiseResult&lt;V, E&gt; = PromiseLike&lt;Result&lt;V, E&gt;&gt;
```

```ts
const Result = {
  success&lt;V&gt;(value: V): Result&lt;V, any&gt;,
  failure&lt;E&gt;(error: E): Result&lt;any, E&gt;,
  cmap:
    &lt;V1, V2, E&gt;(f: (value: V1) =&gt; V2) =&gt;
    (r: Result&lt;V1, E&gt;): Result&lt;V2, E&gt;,
  map: &lt;V1, V2, E&gt;(r: Result&lt;V1, E&gt;, f: (value: V1) =&gt; V2): Result&lt;V2, E&gt;,
  cflatMap:
    &lt;V1, V2, E&gt;(f: (value: V1) =&gt; Result&lt;V2, E&gt;) =&gt;
    (r: Result&lt;V1, E&gt;): Result&lt;V2, E&gt;,
  flatMap: &lt;V1, V2, E&gt;(
    r: Result&lt;V1, E&gt;,
    f: (value: V1) =&gt; Result&lt;V2, E&gt;
  ): Result&lt;V2, E&gt;,
  toAsync&lt;V, E&gt;(r: Result&lt;V, E&gt;): AsyncResult&lt;V, E&gt;,
  isSuccess&lt;V, E&gt;(r: Result&lt;V, E&gt;): r is Success&lt;V&gt;,
  isFailure&lt;V, E&gt;(r: Result&lt;V, E&gt;): r is Failure&lt;E&gt;,
  getOrElse&lt;V, E&gt;(r: Result&lt;V, E&gt;, alt: V): V,
  getOrElseLazy&lt;V, E&gt;(r: Result&lt;V, E&gt;, altf: () =&gt; V): V,
  getOrNull&lt;V, E&gt;(r: Result&lt;V, E&gt;): V | null,
  getOrUndefined&lt;V, E&gt;(r: Result&lt;V, E&gt;): Maybe&lt;V&gt;,
  cmatch:
    &lt;V1, V2, E&gt;(success: (value: V1) =&gt; V2, failure: (error: E) =&gt; V2) =&gt;
    (r: Result&lt;V1, E&gt;): V2,
  match: &lt;V1, V2, E&gt;(
    r: Result&lt;V1, E&gt;,
    success: (value: V1) =&gt; V2,
    failure: (error: E) =&gt; V2
  ): V2,
  whenSuccess:
    &lt;V, E&gt;(apply: (v: V) =&gt; void) =&gt;
    (r: Result&lt;V, E&gt;): Result&lt;V, E&gt;,
  whenFailure:
    &lt;V, E&gt;(apply: (e: E) =&gt; void) =&gt;
    (r: Result&lt;V, E&gt;): Result&lt;V, E&gt;,
  combine: &lt;V, E&gt;(
    r1: Result&lt;V, E&gt;,
    r2: Result&lt;V, E&gt;,
    combineV: (v1: V, v2: V) =&gt; V,
    combineE: (e1: E, e2: E) =&gt; E
  ): Result&lt;V, E&gt;,
}
```

## string

```ts
import '@tempots/std/string'
```

TODO

Utility functions to manipulate string values.

Replaces all occurrances of `placeholder` in `subject` with the value `replacement`.

```ts
function replace(
  subject: string,
  placeholder: string,
  replacement: string
): string
```

`after` searches for the first occurrance of `searchFor` and returns the text after that.

If `searchFor` is not found, an empty string is returned.

```ts
function after(value: string, searchFor: string): string
```

`afterLast` searches for the last occurrance of `searchFor` and returns the text after that.

If `searchFor` is not found, an empty string is returned.

```ts
function afterLast(value: string, searchFor: string): string
```

`before` searches for the first occurrance of `searchFor` and returns the text before that.

If `searchFor` is not found, an empty string is returned.

```ts
function before(value: string, searchFor: string): string
```

`beforeLast` searches for the last occurrance of `searchFor` and returns the text before that.

If `searchFor` is not found, an empty string is returned.

```ts
function beforeLast(value: string, searchFor: string): string
```

`capitalize` returns a string with the first character convert to upper case.

```ts
function capitalize(s: string): string
```

Capitalize the first letter of every word in `value`. If `whiteSpaceOnly` is set to `true` the process is limited to whitespace separated words.

```ts
function capitalizeWords(value: string, whiteSpaceOnly = false): string
```

Replaces occurrances of `\r\n`, `\n\r`, `\r` with `\n`

```ts
function canonicalizeNewlines(value: string): string
```

Compares two strings ignoring their case.

```ts
function compareCaseInsensitive(a: string, b: string): number
```

```ts
function endsWith(s: string, end: string): boolean
```

```ts
function endsWithCaseInsensitive(s: string, end: string): boolean
```

```ts
function startsWith(s: string, start: string): boolean
```

```ts
function startsWithCaseInsensitive(s: string, start: string): boolean
```

Compares a string `s` with many `values` and see if one of them matches its end ignoring their case.

```ts
function endsWithAnyCaseInsensitive(
  s: string,
  values: string[]
): boolean
```

Compares a string `s` with many `values` and see if one of them matches its beginning ignoring their case.

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

```ts
function collapse(value: string): string
```

It compares to string and it returns a negative number if `a` is inferior to `b`, zero if they are the same, or otherwise a positive non-sero number.

```ts
function compare(a: string, b: string): number
```

`contains` returns `true` if `s` contains one or more occurrences of `test` regardless of the text case.

```ts
function containsCaseInsensitive(s: string, test: string): boolean
```

`contains` returns `true` if `s` contains one or more occurrences of `test`.

```ts
function contains(s: string, test: string): boolean
```

Return the number of occurances of `test` in `s`.

```ts
function count(s: string, test: string): number
```

`contains` returns `true` if `s` contains any of the strings in `tests` regardless of the text case

```ts
function containsAnyCaseInsensitive(
  s: string,
  tests: string[]
): boolean
```

`contains` returns `true` if `s` contains any of the strings in `tests`

```ts
function containsAny(s: string, tests: string[]): boolean
```

`contains` returns `true` if `s` contains all of the strings in `tests` regardless of the text case

```ts
function containsAllCaseInsensitive(
  s: string,
  tests: string[]
): boolean
```

`contains` returns `true` if `s` contains all of the strings in `tests`

```ts
function containsAll(s: string, tests: string[]): boolean
```

dasherize` replaces all the occurrances of `_` with `-`

```ts
function dasherize(s: string): string
```

Compares strings `a` and `b` and returns the position where they differ.
If the strings are equal, it returns `-1`.

```ts
diffIndex('abcdef', 'abc123') // returns 3
```

```ts
function diffIndex(a: string, b: string): number
```

`ellipsis` truncates `s` at len `maxlen` replaces the last characters with the content of `symbol`.

```ts
ellipsis('tempo is a nice library', 9) // returns 'tempo is …'
```

```ts
function ellipsis(s: string, maxlen = 20, symbol = '…'): string
```

Same as `ellipsis` but puts the symbol in the middle of the string and not to the end.

```ts
ellipsisMiddle('tempo is a nice library', 18) // returns 'tempo is … library'
```

```ts
function ellipsisMiddle(s: string, maxlen = 20, symbol = '…'): string
```

Returns `true` if `s` ends with any of the values in `values`.
```ts
function endsWithAny(s: string, values: string[]): boolean
```

`filter` applies `predicate` character by character to `s` and it returns a filtered version of the string.

```ts
function filter(s: string, predicate: (s: string) =&gt; boolean): string
```

Same as `filter` but `predicate` operates on integer char codes instead of string characters.

```ts
function filterCharcode(
  s: string,
  predicate: (n: number) =&gt; boolean
): string
```

`from` searches for the first occurrance of `searchFor` and returns the text from that point on. If `searchFor` is not found, an empty string is returned.

```ts
function from(value: string, searchFor: string): string
```

```ts
function hashCode(value: string, seed = 0x811c9dc5): number
```

Returns `true` if `value` is not `null` and contains at least one character.

```ts
function hasContent(value: string): boolean
```

Works the same as `underscore` but also replaces underscores with whitespaces.

```ts
function humanize(s: string): string
```

Checks if `s` contains only (and at least one) alphabetical characters.

```ts
function isAlpha(s: string): boolean
```

`isAlphaNum` returns `true` if the string only contains alpha-numeric characters.

```ts
function isAlphaNum(value: string): boolean
```

```ts
function isBreakingWhitespace(value: string): boolean
```

Returns `true` if the value string is composed of only lower cased characters or case neutral characters.

```ts
function isLowerCase(value: string): boolean
```

Returns `true` if the value string is composed of only upper cased characters or case neutral characters.

```ts
function isUpperCase(value: string): boolean
```

`ifEmpty` returns `value` if it is neither `null` or empty, otherwise it returns `alt`

```ts
function ifEmpty(value: string, alt: string): string
```

`isDigitsOnly` returns `true` if the string only contains digits.

```ts
function isDigitsOnly(value: string): boolean
```

`isEmpty` returns true if either `value` is null or is an empty string.
```ts
function isEmpty(value: string): boolean
```

Convert first letter in `value` to lower case.

```ts
function lowerCaseFirst(value: string): string
```

Returns a random substring from the `value` argument. The length of such value is by default `1`.

```ts
function random(value: string, length = 1): string
```

Returns a random sampling of the specified length from the seed string.
```ts
function randomSequence(alphabet: string, length: number): string
```

Like `randomSequence`, but automatically uses the base64 sequence as the seed string.

```ts
function randomSequence64(length: number): string
```

It maps a string character by character using `callback`.

```ts
function map&lt;T&gt;(callback: (c: string) =&gt; T, value: string): T[]
```

If present, it removes all the occurrences of `toremove` from `value`.

```ts
function remove(value: string, toremove: string): string
```

If present, it removes the `toremove` text from the end of `value`.

```ts
function removeAfter(value: string, toremove: string): string
```

Removes a slice from `index` to `index + length` from `value`.

```ts
function removeAt(value: string, index: number, length: number): string
```

If present, it removes the `toremove` text from the beginning of `value`.
```ts
function removeBefore(value: string, toremove: string): string
```

If present, it removes the first occurrence of `toremove` from `value`.
```ts
function removeOne(value: string, toremove: string): string
```

`repeat` builds a new string by repeating the argument `s`, n `times`.

```ts
repeat('Xy', 3) // generates 'XyXyXy'
```
```ts
function repeat(s: string, times: number): string
```

Returns a new string whose characters are in reverse order.

```ts
function reverse(s: string): string
```

Converts a string in a quoted string.

```ts
function smartQuote(s: string, prefer = "'"): string
```

```ts
function quote(s: string, quoteChar = "'"): string
```

```ts
function jsQuote(s: string, prefer = "'"): string
```

It only splits on the first occurrance of separator.

```ts
function splitOnce(
  s: string,
  separator: string
): [string] | [string, string]
```

Returns `true` if `s` starts with any of the values in `values`.

```ts
function startsWithAny(s: string, values: string[]): boolean
```

`stripTags` removes any HTML/XML markup from the string leaving only the concatenation of the existing text nodes.

```ts
function stripTags(s: string): string
```

Surrounds a string with the contents of `left` and `right`. If `right` is omitted, `left` will be used on both sides.

```ts
function surround(s: string, left: string, right = left): string
```

It transforms a string into an `Array` of characters.

```ts
function toArray(s: string): string[]
```

It transforms a string into an `Array` of char codes in integer format.

```ts
function toCharcodes(s: string): number[]
```

Returns an array of `string` whose elements are equally long (using `len`). If the string `s` is not exactly divisible by `len` the last element of the array will be shorter.

```ts
function toChunks(s: string, len: number): string[]
```

Returns an array of `string` split by line breaks.

```ts
function toLines(s: string): string[]
```

`trimChars` removes from the beginning and the end of the string any character that is present in `charlist`.

```ts
function trimChars(value: string, charlist: string): string
```

`trimCharsLeft` removes from the beginning of the string any character that is present in `charlist`.

```ts
function trimCharsLeft(value: string, charlist: string): string
```

`trimCharsRight` removes from the end of the string any character that is present in `charlist`.

```ts
function trimCharsRight(value: string, charlist: string): string
```

`underscore` finds UpperCase characters and turns them into LowerCase and prepends them with a whtiespace.
Sequences of more than one UpperCase character are left untouched.

```ts
function underscore(s: string): string
```

Convert first letter in `value` to upper case.

```ts
function upperCaseFirst(value: string): string
```

`upTo` searches for the first occurrance of `searchFor` and returns the text up to that point.
If `searchFor` is not found, the entire string is returned.

```ts
function upTo(value: string, searchFor: string): string
```

`wrapColumns` splits a long string into lines that are at most `columns` long.
Words whose length exceeds `columns` are not split.

```ts
function wrapColumns(
  s: string,
  columns = 78,
  indent = '',
  newline = '\n'
): string
```

```ts
function isSpaceAt(s: string, pos: number): boolean
```

```ts
function encodeBase64(s: string): string
```

```ts
function decodeBase64(s: string): string
```

```ts
function wrapLine(
  s: string,
  columns: number,
  indent: string,
  newline: string
): string
```

```ts
function lpad(s: string, char: string, length: number): string
```

```ts
function rpad(s: string, char: string, length: number): string
```

```ts
function splitOnLast(
  s: string,
  find: string
): [string] | [string, string]
```

```ts
function splitOnFirst(
  s: string,
  find: string
): [string] | [string, string]
```
## validation

```ts
import '@tempots/std/validation'
```

TODO

```ts
interface Valid {
  type: 'valid'
}
interface Invalid&lt;E&gt; {
  type: 'invalid'
  error: E
}
type Validation&lt;E&gt; = Valid | Invalid&lt;E&gt;
```

```ts
type PromiseValidation&lt;E&gt; = PromiseLike&lt;Validation&lt;E&gt;&gt;
```

```ts
const Validation = {
  valid: { type: 'valid' } satisfies Validation&lt;any&gt;,
  invalid&lt;E&gt;(error: E): Validation&lt;E&gt;,
  isValid&lt;E&gt;(r: Validation&lt;E&gt;): r is Valid,
  isInvalid&lt;E&gt;(r: Validation&lt;E&gt;): r is Invalid&lt;E&gt;,
  cmatch:
    &lt;V, E&gt;(valid: () =&gt; V, invalid: (error: E) =&gt; V) =&gt;
    (r: Validation&lt;E&gt;): V,
  match: &lt;V, E&gt;(
    r: Validation&lt;E&gt;,
    valid: () =&gt; V,
    invalid: (error: E) =&gt; V
  ): V,
  toResult: &lt;T, E&gt;(value: T): ((validation: Validation&lt;E&gt;) =&gt; Result&lt;T, E&gt;),
  whenValid:
    &lt;E&gt;(apply: () =&gt; void) =&gt;
    (r: Validation&lt;E&gt;): Validation&lt;E&gt;,
  whenInvalid:
    &lt;E&gt;(apply: (e: E) =&gt; void) =&gt;
    (r: Validation&lt;E&gt;): Validation&lt;E&gt;,
}
```

## domain

```ts
import '@tempots/std/domain'
```

Contains type helpers generally useful during development.

### Compare

Type type of a comparison function that takes two arguments `T` and returns `number`.

```ts
type Compare&lt;T&gt;
```

### Fun0 to Fun6

Function types with 0 to 6 arguments.

```ts
type Fun0&lt;R&gt;
type Fun1&lt;A, R&gt;
type Fun2&lt;A, B, R&gt;
type Fun3&lt;A, B, C, R&gt;
type Fun4&lt;A, B, C, D, R&gt;
type Fun5&lt;A, B, C, D, E, R&gt;
type Fun6&lt;A, B, C, D, E, F, R&gt;
```

### FilterTuple&lt;T&gt;

Filters a tuple type by a type.

```ts
type FilterTuple&lt;T extends unknown[], N&gt;
```

### FirstArgument&lt;F&gt;

Extracts the first argument type of a function.

```ts
type FirstArgument&lt;F&gt; = F extends Fun1&lt;infer A, unknown&gt; ? A : never
```

### Id

Flattens an object type.

```ts
type Id&lt;T&gt; = {} & { [P in keyof T]: T[P] }
```

### IndexKey

The type of an object/array key.

```ts
type IndexKey
```

### Maybe&lt;T&gt;

A type that can be `T` or `undefined`.

```ts
type Maybe&lt;T&gt; = T | undefined
```

### Merge&lt;A, B&gt;

Merges two object types.

```ts
type Merge&lt;A, B&gt; = Id&lt;A & B&gt;
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

### SplitLiteral&lt;T, SplitBy&gt;

Splits a string literal by a string literal.

```ts
type SplitLiteral&lt;
  T extends string,
  SplitBy extends string,
&gt;
```

### SplitLiteralToUnion&lt;T, SplitBy&gt;

Splits a string literal by a string literal and converts the result to a union type.

```ts
type SplitLiteralToUnion&lt;
  T extends string,
  SplitBy extends string,
&gt;
```


## TupleToUnion&lt;T&gt;

Converts a tuple type to a union type.

```ts
type TupleToUnion&lt;T extends unknown[]&gt; = T[number]
```
