# @tempots/eslint-plugin

ESLint plugin for TempoTS to help catch common signal usage issues and prevent memory leaks.

## Installation

```bash
pnpm add -D @tempots/eslint-plugin
```

## Usage

Add `tempots` to the plugins section of your ESLint configuration:

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
    },
  },
]
```

Or use the recommended configuration:

```javascript
// eslint.config.js
import tempots from '@tempots/eslint-plugin'

export default [
  tempots.configs.recommended,
  // ... your other configs
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

## Rules

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
