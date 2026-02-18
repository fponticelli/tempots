// This file demonstrates various cases for the ESLint rules
// Note: As of @tempots/dom >= 1.0.0, signals are automatically disposed!
import {
  prop,
  signal,
  computed,
  untracked,
  html,
  Fragment,
  Empty,
  OnDispose,
} from '@tempots/dom'

// ============================================================================
// Rule: no-module-level-signals
// ============================================================================

// ❌ BAD: Signal created at module level (will be tracked by global scope)
const moduleCount = prop(0) // Will trigger: no-module-level-signals

// ❌ BAD: Signal transformation at module level
const moduleDoubled = moduleCount.map(x => x * 2) // Will trigger: no-module-level-signals

// ✅ GOOD: Signal created inside renderable (auto-disposed)
const GoodComponent1 = ctx => {
  const count = prop(0) // ✨ Auto-disposed, no warning
  return html.div('Count: ', count)
}

// ✅ GOOD: Explicitly long-lived signal using untracked()
const globalState = untracked(() => prop(0)) // No warning - explicitly untracked
// ❌ BAD: But this will trigger require-untracked-disposal if never disposed!

// ✅ GOOD: Untracked signal with disposal
const globalState2 = untracked(() => prop(0))
// Later:
globalState2.dispose() // ✅ Properly disposed

// ============================================================================
// Rule: no-unnecessary-disposal
// ============================================================================

// ❌ BAD: Unnecessary manual disposal of auto-disposed signals
const BadComponent1 = ctx => {
  const count = prop(0)
  const doubled = count.map(x => x * 2)

  return Fragment(
    OnDispose(() => count.dispose()), // Will trigger: no-unnecessary-disposal
    OnDispose(() => doubled.dispose()), // Will trigger: no-unnecessary-disposal
    html.div(count, doubled)
  )
}

// ❌ BAD: Unnecessary disposal with arrow function
const BadComponent2 = ctx => {
  const count = prop(0)

  return Fragment(
    OnDispose(() => count.dispose()), // Will trigger: no-unnecessary-disposal
    html.div(count)
  )
}

// ✅ GOOD: No manual disposal needed (auto-disposed)
const GoodComponent2 = ctx => {
  const count = prop(0)
  const doubled = count.map(x => x * 2)

  return html.div(count, doubled)
  // ✨ Both signals auto-disposed!
}

// ✅ GOOD: Manual disposal of untracked signal is OK
const GoodComponent3 = ctx => {
  const untrackedSignal = untracked(() => prop(0))

  return Fragment(
    OnDispose(() => untrackedSignal.dispose()), // ✅ OK - untracked needs manual disposal
    html.div(untrackedSignal)
  )
}

// ============================================================================
// Rule: require-untracked-disposal
// ============================================================================

// ❌ BAD: Untracked signal never disposed
const leakyGlobalState = untracked(() => prop(0)) // Will trigger: require-untracked-disposal
// This will leak memory!

// ✅ GOOD: Untracked signal with disposal
const properGlobalState = untracked(() => prop(0))
// Later in cleanup:
function cleanup() {
  properGlobalState.dispose() // ✅ Properly disposed
}

// ============================================================================
// Rule: require-async-signal-disposal
// ============================================================================

// ❌ BAD: Signal created in setTimeout (async context)
const BadComponent4 = ctx => {
  setTimeout(() => {
    const asyncSignal = prop(0) // Will trigger: require-async-signal-disposal
    // This signal is NOT auto-disposed!
  }, 1000)

  return html.div('Hello')
}

// ❌ BAD: Signal created in Promise callback
const BadComponent5 = ctx => {
  fetchData().then(data => {
    const signal = prop(data) // Will trigger: require-async-signal-disposal
    // This signal is NOT auto-disposed!
  })

  return html.div('Loading...')
}

// ❌ BAD: Signal created in async function
const BadComponent6 = async ctx => {
  const data = await fetchData()
  const signal = prop(data) // Will trigger: require-async-signal-disposal
  return html.div(signal)
}

// ✅ GOOD: Create signal synchronously, update in async context (preferred)
const GoodComponent4 = ctx => {
  const asyncSignal = prop(0) // ✨ Auto-disposed

  setTimeout(() => {
    asyncSignal.value = 42 // Just update the value
  }, 1000)

  return html.div(asyncSignal)
}

// ✅ GOOD: Use scope.track() for manual tracking
const GoodComponent5 = (ctx, scope) => {
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.track(asyncSignal) // ✅ Manually tracked, will be disposed
  }, 1000)

  return html.div('Hello')
}

// ✅ GOOD: Use scope.onDispose() for manual disposal
const GoodComponent8 = (ctx, scope) => {
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.onDispose(() => asyncSignal.dispose()) // ✅ Will be disposed
  }, 1000)

  return html.div('Hello')
}

// ✅ GOOD: Use untracked() if signal should outlive the component
const GoodComponent9 = ctx => {
  setTimeout(() => {
    const asyncSignal = untracked(() => prop(0)) // ✅ OK - explicitly untracked
    // Remember to dispose when done:
    // asyncSignal.dispose()
  }, 1000)

  return html.div('Hello')
}

// ============================================================================
// Additional Examples
// ============================================================================

// ✅ GOOD: Not a renderable (no ctx parameter), so no warnings
const helperFunction = () => {
  const signal = prop(0) // No warning - not in a renderable
  return signal
}

// ✅ GOOD: Using external signal (not created locally)
const GoodComponent6 = ctx => {
  return html.div(externalSignal) // No warning - signal not created here
}

// ✅ GOOD: Chained transformations (all auto-disposed)
const GoodComponent7 = ctx => {
  const result = source
    .map(x => x * 2)
    .filter(x => x > 0)
    .debounce(300)

  return html.div(result)
  // ✨ All intermediate signals auto-disposed!
}

// ✅ GOOD: Can disable rules when needed
const SpecialCase = ctx => {
  // eslint-disable-next-line tempots/no-module-level-signals
  const signal = moduleSignal // I know what I'm doing
  return html.div(signal)
}

// ============================================================================
// Rule: no-signal-reassignment
// ============================================================================

// ❌ BAD: Reassigning signal variable
const BadComponent7 = ctx => {
  let count = prop(0)

  // Later...
  count = prop(1) // Will trigger: no-signal-reassignment
  // This creates a memory leak! Original signal not disposed

  return html.div(count)
}

// ❌ BAD: Reassigning transformed signal
const BadComponent8 = ctx => {
  let doubled = source.map(x => x * 2)

  // Later...
  doubled = source.map(x => x * 3) // Will trigger: no-signal-reassignment

  return html.div(doubled)
}

// ✅ GOOD: Update signal value, not variable
const GoodComponent10 = ctx => {
  const count = prop(0)

  // Update the value
  count.value = 1 // ✅ Correct way

  return html.div(count)
}

// ============================================================================ 
// Rule: prefer-const-signals
// ============================================================================

// ❌ BAD: Using let for signal
const BadComponent9 = ctx => {
  let count = prop(0) // Will trigger: prefer-const-signals
  let doubled = count.map(x => x * 2) // Will trigger: prefer-const-signals

  return html.div(count, doubled)
}

// ❌ BAD: Using var for signal
const BadComponent10 = ctx => {
  var count = prop(0) // Will trigger: prefer-const-signals

  return html.div(count)
}

// ✅ GOOD: Using const for signals
const GoodComponent11 = ctx => {
  const count = prop(0) // ✅ Using const
  const doubled = count.map(x => x * 2) // ✅ Using const

  return html.div(count, doubled)
}

// ============================================================================
// Rule: no-renderable-signal-map
// ============================================================================

// ❌ BAD: Mapping a signal to a renderable
const BadComponent11 = ctx => {
  const count = prop(0)
  const view = count.map(v => html.div(v)) // Will trigger: no-renderable-signal-map

  return view
}

// ✅ GOOD: Pass the signal directly to the renderable
const GoodComponent12 = ctx => {
  const count = prop(0)

  return html.div(count)
}

// ============================================================================
// Rule: no-empty-fragment
// ============================================================================

// ❌ BAD: Empty fragment
const BadComponent12 = ctx => {
  return Fragment() // Will trigger: no-empty-fragment
}

// ✅ GOOD: Use Empty instead
const GoodComponent13 = ctx => {
  return Empty
}

// ============================================================================
// Rule: no-single-child-fragment
// ============================================================================

// ❌ BAD: Fragment with single child
const BadComponent13 = ctx => {
  return Fragment(html.div('hello')) // Will trigger: no-single-child-fragment
}

// ✅ GOOD: Return the child directly
const GoodComponent14 = ctx => {
  return html.div('hello')
}

// ============================================================================
// Rule: no-method-reference
// ============================================================================

// ❌ BAD: Passing method by reference (loses `this` binding with prototype methods)
const BadComponent14 = ctx => {
  const count = prop(0)
  const other = prop(1)

  count.onDispose(other.dispose) // Will trigger: no-method-reference
  count.on(other.set) // Will trigger: no-method-reference

  return html.div(count)
}

// ❌ BAD: Assigning method to variable
const BadComponent15 = ctx => {
  const count = prop(0)
  const getter = count.get // Will trigger: no-method-reference

  return html.div(String(getter()))
}

// ✅ GOOD: Wrap method references in lambdas
const GoodComponent15 = ctx => {
  const count = prop(0)
  const other = prop(1)

  count.onDispose(() => other.dispose()) // ✅ Lambda preserves `this`
  count.on(v => other.set(v)) // ✅ Lambda preserves `this`

  return html.div(count)
}

// ✅ GOOD: Calling methods with dot notation is always fine
const GoodComponent16 = ctx => {
  const count = prop(0)
  const value = count.get() // ✅ Dot notation call
  count.dispose() // ✅ Dot notation call

  return html.div(String(value))
}

// Helper function for examples
declare function fetchData(): Promise<any>
declare const externalSignal: any
declare const source: any
