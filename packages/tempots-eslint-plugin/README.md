# @tempots/eslint-plugin

ESLint plugin for TempoTS to help catch common signal disposal issues and prevent memory leaks.

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
      'tempots/require-signal-disposal': 'warn',
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

## Rules

### `require-signal-disposal`

Detects signals created within renderables that aren't properly disposed.

**Why?** When you create signals within components (using `prop()`, `signal()`, `.map()`, etc.), those signals need to be disposed when the component is unmounted to prevent memory leaks.

#### ❌ Incorrect

```typescript
const MyComponent = (ctx) => {
  const signal = prop(0)  // Created but never disposed!
  return html.div('content')
}

const AnotherComponent = (ctx) => {
  const mapped = someSignal.map(x => x * 2)  // Transformation not disposed!
  return html.div(mapped)
}
```

#### ✅ Correct

```typescript
const MyComponent = (ctx) => {
  const signal = prop(0)
  return Fragment(
    OnDispose(signal.dispose),  // Properly disposed
    html.div('content')
  )
}

const AnotherComponent = (ctx) => {
  const mapped = someSignal.map(x => x * 2)
  return Fragment(
    OnDispose(mapped.dispose),  // Transformation disposed
    html.div(mapped)
  )
}
```

#### Options

```javascript
{
  'tempots/require-signal-disposal': ['warn', {
    checkTransforms: true,  // Check signal transformations (.map, .filter, etc.)
    checkCreations: true,   // Check signal creations (prop, signal, computed)
  }]
}
```

#### When to disable

You can disable this rule for specific cases using ESLint comments:

```typescript
const MyComponent = (ctx) => {
  // eslint-disable-next-line tempots/require-signal-disposal
  const signal = prop(0)  // I know what I'm doing
  return html.div('content')
}
```

**Valid reasons to disable:**
- The signal is returned from the component (caller's responsibility)
- The signal is stored in a parent scope and managed elsewhere
- You're using a custom disposal pattern the rule doesn't recognize

## Limitations

This rule uses static analysis and has some limitations:

1. **False positives**: May flag signals that are disposed in ways the rule doesn't recognize
2. **False negatives**: May miss signals stored in objects/arrays or disposed conditionally
3. **Scope**: Only checks within renderable functions (functions with a `ctx` parameter)

When in doubt, use `OnDispose` to be explicit about cleanup.

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

Apache-2.0

