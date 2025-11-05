// This file demonstrates various cases for the no-module-level-signals rule
// Note: As of @tempots/dom >= 1.0.0, signals are automatically disposed!
import { prop, signal, computed, untracked, html } from '@tempots/dom'

// ❌ BAD: Signal created at module level (will be tracked by global scope)
const moduleCount = prop(0) // Will trigger warning

// ❌ BAD: Signal transformation at module level
const moduleDoubled = moduleCount.map(x => x * 2) // Will trigger warning

// ✅ GOOD: Signal created inside renderable (auto-disposed)
const GoodComponent1 = ctx => {
  const count = prop(0) // ✨ Auto-disposed, no warning
  return html.div('Count: ', count)
}

// ✅ GOOD: Signal transformation inside renderable (auto-disposed)
const GoodComponent2 = ctx => {
  const count = prop(0)
  const doubled = count.map(x => x * 2) // ✨ Auto-disposed, no warning
  return html.div('Doubled: ', doubled)
}

// ✅ GOOD: Explicitly long-lived signal using untracked()
const globalState = untracked(() => prop(0)) // No warning - explicitly untracked
// Remember to dispose manually: globalState.dispose()

// ✅ GOOD: Signal transformation disposed
const GoodComponent2 = ctx => {
  const doubled = someSignal.map(x => x * 2)
  return Fragment(OnDispose(doubled.dispose), html.div(doubled))
}

// ✅ GOOD: Multiple disposal methods work
const GoodComponent3 = ctx => {
  const signal1 = prop(0)
  const signal2 = prop(1)

  return Fragment(
    // Direct disposal
    OnDispose(signal1.dispose),
    // Arrow function
    OnDispose(() => signal2.dispose()),
    html.div('content')
  )
}

// ✅ GOOD: Disposal in block statement
const GoodComponent4 = ctx => {
  const signal = prop(0)

  return Fragment(
    OnDispose(() => {
      console.log('Cleaning up')
      signal.dispose()
    }),
    html.div('content')
  )
}

// ❌ BAD: Multiple signals, one not disposed
const BadComponent3 = ctx => {
  const signal1 = prop(0)
  const signal2 = prop(1) // Will trigger warning

  return Fragment(OnDispose(signal1.dispose), html.div('content'))
}

// ✅ GOOD: Not a renderable (no ctx parameter), so no warning
const helperFunction = () => {
  const signal = prop(0)
  return signal
}

// ✅ GOOD: Using external signal (not created locally)
const GoodComponent5 = ctx => {
  return html.div(externalSignal)
}

// ❌ BAD: Computed signal not disposed
const BadComponent4 = ctx => {
  const sum = computed(() => a.value + b.value, [a, b]) // Will trigger warning
  return html.div(sum)
}

// ✅ GOOD: Computed signal disposed
const GoodComponent6 = ctx => {
  const sum = computed(() => a.value + b.value, [a, b])
  return Fragment(OnDispose(sum.dispose), html.div(sum))
}

// ❌ BAD: Filter transformation not disposed
const BadComponent5 = ctx => {
  const filtered = items.filter(x => x > 0) // Will trigger warning
  return html.div(filtered)
}

// ✅ GOOD: Filter transformation disposed
const GoodComponent7 = ctx => {
  const filtered = items.filter(x => x > 0)
  return Fragment(OnDispose(filtered.dispose), html.div(filtered))
}

// ✅ GOOD: Can disable rule when needed
const SpecialCase = ctx => {
  // eslint-disable-next-line tempots/require-signal-disposal
  const signal = prop(0) // I'm managing this manually elsewhere
  return html.div('content')
}

// ❌ BAD: Multiple transformations, all need disposal
const BadComponent6 = ctx => {
  const mapped = source.map(x => x * 2) // Will trigger warning
  const filtered = mapped.filter(x => x > 0) // Will trigger warning
  const debounced = filtered.debounce(300) // Will trigger warning

  return html.div(debounced)
}

// ✅ GOOD: All transformations disposed
const GoodComponent8 = ctx => {
  const mapped = source.map(x => x * 2)
  const filtered = mapped.filter(x => x > 0)
  const debounced = filtered.debounce(300)

  return Fragment(
    OnDispose(mapped.dispose),
    OnDispose(filtered.dispose),
    OnDispose(debounced.dispose),
    html.div(debounced)
  )
}

// ✅ GOOD: Chained transformations (only final signal needs disposal)
const GoodComponent9 = ctx => {
  const result = source
    .map(x => x * 2)
    .filter(x => x > 0)
    .debounce(300)

  return Fragment(OnDispose(result.dispose), html.div(result))
}
