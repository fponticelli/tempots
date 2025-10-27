# Integration Guide

This guide explains how to integrate `eslint-plugin-tempots` into your TempoTS project.

## For TempoTS Monorepo

To use this plugin within the TempoTS monorepo itself:

### 1. Update package dependencies

Add the plugin as a dev dependency to packages that need it:

```json
// packages/tempots-dom/package.json
{
  "devDependencies": {
    "eslint-plugin-tempots": "workspace:*"
  }
}
```

### 2. Update ESLint configuration

```javascript
// packages/tempots-dom/eslint.config.js
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from 'eslint-plugin-tempots'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      tempots,
    },
    rules: {
      'tempots/require-signal-disposal': 'warn',
    },
  },
  {
    ignores: [
      '*.js',
      '*.mjs',
      'jest.config.ts',
      'test/**/*.ts',
      '*.config.js',
      '**/*.config.js',
      'demo/*/dist/',
      'dist/',
      'scripts/',
    ],
  }
)
```

### 3. Run linting

```bash
pnpm lint
```

## For External Projects

To use this plugin in your own TempoTS project:

### 1. Install the plugin

```bash
pnpm add -D eslint-plugin-tempots
```

### 2. Configure ESLint

```javascript
// eslint.config.js
import tempots from 'eslint-plugin-tempots'

export default [
  tempots.configs.recommended,
  // ... your other configs
]
```

Or configure manually:

```javascript
// eslint.config.js
import tempots from 'eslint-plugin-tempots'

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

## Configuration Options

### Severity Levels

```javascript
{
  rules: {
    // Warn (recommended for development)
    'tempots/require-signal-disposal': 'warn',
    
    // Error (strict mode)
    'tempots/require-signal-disposal': 'error',
    
    // Off (disable)
    'tempots/require-signal-disposal': 'off',
  }
}
```

### Rule Options

```javascript
{
  rules: {
    'tempots/require-signal-disposal': ['warn', {
      // Check signal transformations (.map, .filter, etc.)
      checkTransforms: true,
      
      // Check signal creations (prop, signal, computed)
      checkCreations: true,
    }],
  }
}
```

### Preset Configurations

```javascript
// Recommended (warnings only)
import tempots from 'eslint-plugin-tempots'
export default [tempots.configs.recommended]

// Strict (errors)
import tempots from 'eslint-plugin-tempots'
export default [tempots.configs.strict]
```

## Disabling the Rule

### For specific lines

```typescript
// eslint-disable-next-line tempots/require-signal-disposal
const signal = prop(0)
```

### For entire files

```typescript
/* eslint-disable tempots/require-signal-disposal */

// ... your code
```

### For specific functions

```typescript
const MyComponent = (ctx) => {
  /* eslint-disable tempots/require-signal-disposal */
  const signal = prop(0)
  /* eslint-enable tempots/require-signal-disposal */
  
  return html.div('content')
}
```

## CI/CD Integration

Add linting to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: pnpm run lint
```

Make sure your `package.json` has:

```json
{
  "scripts": {
    "lint": "eslint src"
  }
}
```

## Troubleshooting

### False Positives

If the rule incorrectly flags code:

1. Check if the signal is actually being disposed
2. Use `eslint-disable-next-line` if you're managing disposal manually
3. Report the issue with a minimal reproduction

### False Negatives

If the rule misses undisposed signals:

1. Check if the function has a `ctx` parameter (required for detection)
2. Verify the signal is created with a tracked method
3. Report the issue with a minimal reproduction

### Performance

The rule uses AST traversal and should have minimal performance impact. If you experience slowdowns:

1. Exclude test files and build outputs in your ESLint config
2. Use ESLint's `--cache` flag
3. Consider running the rule only on changed files in CI

## Examples

See the [examples](./examples) directory for:
- `usage-example.js` - ESLint configuration examples
- `test-cases.ts` - Valid and invalid code patterns

## Support

For issues or questions:
- Check the [README](./README.md)
- Review the [test cases](./test/require-signal-disposal.spec.js)
- Open an issue in the main TempoTS repository

