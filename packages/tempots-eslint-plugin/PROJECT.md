ESLint plugin for TempoTS to help catch common signal usage issues and prevent memory leaks.

## Installation

```bash
npm install -D @tempots/eslint-plugin
```

## Quick Setup

Use the recommended configuration:

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  tempots.configs.recommended,
  // ... your other configs
]
```

This enables all rules with sensible defaults. For maximum safety, use `tempots.configs.strict` instead (all rules set to `error`).

## Rules

### Signal Lifecycle

- **`no-module-level-signals`** (warn) - Warns about signals created at module level outside renderables. Use `untracked()` for intentionally long-lived signals.
- **`require-untracked-disposal`** (error) - Requires disposal of signals created with `untracked()` to prevent memory leaks.
- **`require-async-signal-disposal`** (warn) - Requires proper disposal for signals created in async contexts (setTimeout, Promise callbacks) where auto-disposal doesn't apply.
- **`no-unnecessary-disposal`** (warn) - Warns about redundant manual disposal of auto-disposed signals. Auto-fixable.
- **`no-signal-reassignment`** (error) - Prevents reassignment of signal variables, which would leak the original signal.
- **`prefer-const-signals`** (warn) - Prefers `const` for signal declarations to prevent accidental reassignment. Auto-fixable.

### Renderable Patterns

- **`no-renderable-signal-map`** (warn) - Warns when mapping signals to renderables (e.g., `signal.map(v => html.div(v))`). Signals can be passed directly into renderables.
- **`no-empty-fragment`** (warn) - Warns about `Fragment()` with no children. Use `Empty` instead.
- **`no-single-child-fragment`** (warn) - Warns about `Fragment()` with a single child, which is unnecessary wrapping.

## Examples

### Correct signal usage

```typescript
const MyComponent = ctx => {
  const count = prop(0)          // Auto-disposed
  const doubled = count.map(x => x * 2) // Auto-disposed

  return html.div(count, ' x 2 = ', doubled)
}
```

### Async signals need manual tracking

```typescript
const MyComponent = ctx => {
  const data = prop(null)        // Create synchronously (auto-disposed)

  setTimeout(() => {
    data.set(fetchedValue)       // Just update the value
  }, 1000)

  return html.div(data)
}
```

### Module-level signals need untracked

```typescript
const globalCount = untracked(() => prop(0))
// Remember to dispose when done: globalCount.dispose()
```

## Custom Configuration

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  {
    plugins: { tempots },
    rules: {
      'tempots/no-module-level-signals': 'warn',
      'tempots/require-untracked-disposal': 'error',
      'tempots/no-signal-reassignment': 'error',
      'tempots/prefer-const-signals': 'warn',
    },
  },
]
```

For more information, see the [Tempo documentation](/).
