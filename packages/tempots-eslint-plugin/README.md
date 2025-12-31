# @tempots/eslint-plugin

[![npm version](https://img.shields.io/npm/v/@tempots/eslint-plugin.svg)](https://www.npmjs.com/package/@tempots/eslint-plugin)
[![license](https://img.shields.io/npm/l/@tempots/eslint-plugin.svg)](https://github.com/fponticelli/tempots/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/fponticelli/tempots/branch/main/graph/badge.svg)](https://codecov.io/gh/fponticelli/tempots)
[![CI](https://github.com/fponticelli/tempots/workflows/CI/badge.svg)](https://github.com/fponticelli/tempots/actions)

ESLint plugin for TempoTS to help catch common signal usage issues and prevent memory leaks.

## Installation

```bash
pnpm add -D @tempots/eslint-plugin
```

## Usage

### Recommended Configuration (Easiest)

Use the recommended configuration for automatic signal disposal best practices:

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  tempots.configs.recommended,
  // ... your other configs
]
```

This enables:

- `no-module-level-signals` (warn) - Signals at module level
- `no-unnecessary-disposal` (warn) - Unnecessary manual disposal
- `require-untracked-disposal` (error) - Untracked signals without disposal
- `require-async-signal-disposal` (warn) - Signals in async contexts
- `no-signal-reassignment` (error) - Signal variable reassignment
- `prefer-const-signals` (warn) - Prefer const for signals

### Strict Configuration

For maximum safety, use the strict configuration:

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  tempots.configs.strict,
  // ... your other configs
]
```

All rules are set to `error` instead of `warn`.

### Custom Configuration

Customize individual rules:

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  {
    plugins: {
      tempots,
    },
    rules: {
      'tempots/no-module-level-signals': 'warn',
      'tempots/no-unnecessary-disposal': 'warn',
      'tempots/require-untracked-disposal': 'error',
      'tempots/require-async-signal-disposal': 'warn',
      'tempots/no-signal-reassignment': 'error',
      'tempots/prefer-const-signals': 'warn',
    },
  },
]
```

## Automatic Signal Disposal

**Important:** As of @tempots/dom >= 1.0.0, signals are automatically disposed when components unmount. You no longer need to manually call `OnDispose(signal.dispose)` for signals created within renderables!

```typescript
const MyComponent = ctx => {
  const count = prop(0) // ✨ Auto-disposed
  const doubled = count.map(x => x * 2) // ✨ Auto-disposed

  return html.div('Count: ', count, ' Doubled: ', doubled)
  // No OnDispose needed!
}
```

### Manual Disposal for Special Cases

For signals created in async contexts or that need explicit lifecycle management, use the `scope` parameter:

```typescript
const MyComponent = (ctx, scope) => {
  // Option 1: Track a signal manually
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.track(asyncSignal) // Will be disposed when component unmounts
  }, 1000)

  // Option 2: Register a disposal callback
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.onDispose(asyncSignal.dispose) // Will be called on unmount
  }, 1000)

  return html.div('Hello')
}
```

## Rules

### `no-unnecessary-disposal` (Recommended)

Warns about unnecessary manual disposal of auto-disposed signals.

**Why?** Signals created within renderables are automatically disposed. Manually disposing them with `OnDispose()` is unnecessary and may cause double-disposal issues.

#### ❌ Incorrect

```typescript
const MyComponent = ctx => {
  const count = prop(0)
  const doubled = count.map(x => x * 2)

  return Fragment(
    OnDispose(count.dispose), // ❌ Unnecessary - auto-disposed
    OnDispose(doubled.dispose), // ❌ Unnecessary - auto-disposed
    html.div(count, doubled)
  )
}
```

#### ✅ Correct

```typescript
const MyComponent = ctx => {
  const count = prop(0) // ✨ Auto-disposed
  const doubled = count.map(x => x * 2) // ✨ Auto-disposed

  return html.div(count, doubled)
  // No OnDispose needed!
}
```

**Auto-fix:** This rule can automatically remove unnecessary `OnDispose()` calls.

---

### `require-untracked-disposal` (Recommended)

Requires disposal of signals created with `untracked()`.

**Why?** Signals created with `untracked()` are explicitly excluded from automatic disposal and must be manually disposed to prevent memory leaks.

#### ❌ Incorrect

```typescript
// Module level - never disposed!
const globalState = untracked(() => prop(0)) // ❌ Memory leak

const MyComponent = ctx => {
  return html.div(globalState)
}
```

#### ✅ Correct

```typescript
const globalState = untracked(() => prop(0))

// Later, when done:
globalState.dispose() // ✅ Manually disposed

// Or in a cleanup function:
function cleanup() {
  globalState.dispose()
}
```

---

### `require-async-signal-disposal` (Recommended)

Requires proper disposal for signals created in async contexts.

**Why?** Signals created in async contexts (setTimeout, Promise callbacks, async functions) execute after the renderable returns, so they're not tracked by the disposal scope and won't be auto-disposed. You must manually manage their disposal.

#### ❌ Incorrect

```typescript
const MyComponent = ctx => {
  setTimeout(() => {
    const asyncSignal = prop(0) // ❌ Not auto-disposed!
    // This will leak memory
  }, 1000)

  return html.div('Hello')
}

const AsyncComponent = async ctx => {
  const data = await fetchData()
  const signal = prop(data) // ❌ Not auto-disposed!
  return html.div(signal)
}
```

#### ✅ Correct

```typescript
// Option 1: Create signals synchronously (preferred)
const MyComponent = ctx => {
  const asyncSignal = prop(0) // ✨ Auto-disposed

  setTimeout(() => {
    asyncSignal.value = 42 // Just update the value
  }, 1000)

  return html.div(asyncSignal)
}

// Option 2: Use scope.track() for manual tracking
const MyComponent = (ctx, scope) => {
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.track(asyncSignal) // ✅ Manually tracked, will be disposed
  }, 1000)

  return html.div('Hello')
}

// Option 3: Use scope.onDispose() for manual disposal
const MyComponent = (ctx, scope) => {
  setTimeout(() => {
    const asyncSignal = prop(0)
    scope.onDispose(asyncSignal.dispose) // ✅ Will be disposed
  }, 1000)

  return html.div('Hello')
}

// Option 4: Use untracked() if signal should outlive the component
const MyComponent = ctx => {
  setTimeout(() => {
    const asyncSignal = untracked(() => prop(0))
    // Remember to dispose when done:
    // asyncSignal.dispose()
  }, 1000)

  return html.div('Hello')
}
```

---

### `no-module-level-signals` (Recommended)

Warns about signals created at module level (outside renderables).

**Why?** With automatic signal disposal, signals created within renderables are automatically tracked and disposed. However, signals created at module level will be tracked by the global scope and may cause unexpected behavior.

#### ❌ Incorrect

```typescript
// Module level - will be tracked by global scope!
const globalCount = prop(0)
const doubled = globalCount.map(x => x * 2)

const MyComponent = ctx => {
  return html.div(globalCount)
}
```

#### ✅ Correct

```typescript
// Option 1: Move inside renderable (auto-disposed)
const MyComponent = ctx => {
  const count = prop(0) // ✨ Auto-disposed
  return html.div(count)
}

// Option 2: Use untracked() for long-lived signals
const globalCount = untracked(() => prop(0)) // Explicitly long-lived
// Remember to dispose manually when done: globalCount.dispose()

const MyComponent = ctx => {
  return html.div(globalCount)
}
```

---

### `no-signal-reassignment` (Recommended)

Prevents reassignment of signal variables.

**Why?** Reassigning a signal variable creates a memory leak because the original signal is not disposed. Signal values should be updated using `.value`, not by reassigning the variable.

#### ❌ Incorrect

```typescript
const MyComponent = ctx => {
  let count = prop(0) // Using let allows reassignment

  // Later...
  count = prop(1) // ❌ Memory leak! Original signal not disposed

  return html.div(count)
}
```

#### ✅ Correct

```typescript
const MyComponent = ctx => {
  const count = prop(0) // Using const prevents reassignment

  // Update the value, not the variable
  count.value = 1 // ✅ Correct way to update

  return html.div(count)
}
```

---

### `prefer-const-signals` (Recommended)

Prefers `const` for signal declarations instead of `let` or `var`.

**Why?** Using `const` prevents accidental reassignment of signal variables, which would cause memory leaks. This rule is auto-fixable.

#### ❌ Incorrect

```typescript
const MyComponent = ctx => {
  let count = prop(0) // ❌ Should use const
  var doubled = count.map(x => x * 2) // ❌ Should use const

  return html.div(count, doubled)
}
```

#### ✅ Correct

```typescript
const MyComponent = ctx => {
  const count = prop(0) // ✅ Using const
  const doubled = count.map(x => x * 2) // ✅ Using const

  return html.div(count, doubled)
}
```

---

### `require-signal-disposal` (Deprecated)

**⚠️ DEPRECATED:** This rule is deprecated as of @tempots/dom >= 1.0.0 because signals are now automatically disposed. It is kept for backward compatibility with older versions but will be removed in a future release.

For projects using @tempots/dom >= 1.0.0, use `no-module-level-signals` instead.

#### Options

```javascript
{
  'tempots/require-signal-disposal': ['warn', {
    checkTransforms: true,      // Check signal transformations (.map, .filter, etc.)
    checkCreations: true,       // Check signal creations (prop, signal, computed)
    useTypeInformation: 'auto', // Use TypeScript type checking when available
                                // Options: 'auto' | 'always' | 'never'
  }]
}
```

See the legacy documentation for details on this deprecated rule.

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

Apache-2.0
