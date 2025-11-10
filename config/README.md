# Shared Configuration

This directory contains centralized configuration files used across all Tempo packages.

## Files

### `.prettierrc.yaml`

Centralized Prettier configuration for consistent code formatting across all packages.

**Settings:**
- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2-space indentation
- 80 character line width
- ES5 trailing commas
- Arrow function parentheses avoided when possible

**Usage:**
All packages symlink to this file:
```bash
ln -s ../../config/.prettierrc.yaml .prettierrc.yaml
```

### `eslint.base.js`

Base ESLint configuration factory for Tempo packages.

**Features:**
- TypeScript ESLint with type-aware linting
- Prettier integration
- Common ignore patterns
- Optional Tempo ESLint plugin support

**Usage:**
```javascript
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from '../tempots-eslint-plugin/src/index.js'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Add Tempo plugin for packages that use signals
  tempots.configs.recommended,
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

## Adding Configuration to New Packages

When creating a new package:

1. **Prettier**: Create a symlink to the centralized config
   ```bash
   cd packages/your-package
   ln -s ../../config/.prettierrc.yaml .prettierrc.yaml
   ```

2. **ESLint**: Copy the pattern from an existing package's `eslint.config.js`
   - Use `tempots.configs.recommended` for packages that use signals
   - Omit the Tempo plugin for packages that don't use signals (e.g., `@tempots/std`)

## Modifying Configuration

To change formatting or linting rules for all packages:

1. Edit the centralized config file in this directory
2. All packages will automatically use the updated configuration
3. Run `pnpm format` in each package to apply changes

