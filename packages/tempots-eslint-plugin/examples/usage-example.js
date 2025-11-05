// Example ESLint configuration using @tempots/eslint-plugin
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from '@tempots/eslint-plugin'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      tempots,
    },
    rules: {
      // Recommended: Warn about signals created at module level
      // (Signals are now automatically disposed in @tempots/dom >= 1.0.0)
      'tempots/no-module-level-signals': 'warn',

      // DEPRECATED: The require-signal-disposal rule is deprecated
      // because signals are now automatically disposed.
      // Only use this if you're on an older version of @tempots/dom
      // 'tempots/require-signal-disposal': 'warn',
    },
  },
  {
    ignores: [
      '*.js',
      '*.mjs',
      'test/**/*.ts',
      '*.config.js',
      '**/*.config.js',
      'dist/',
    ],
  },
]

// Or use the recommended preset:
// export default [
//   eslint.configs.recommended,
//   ...tseslint.configs.recommended,
//   eslintPluginPrettierRecommended,
//   tempots.configs.recommended,
//   {
//     ignores: ["dist/", "*.config.js"],
//   },
// ]
