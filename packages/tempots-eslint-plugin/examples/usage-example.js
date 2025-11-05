// Example ESLint configuration using @tempots/eslint-plugin
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from '@tempots/eslint-plugin'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,

  // Option 1: Use the recommended config (easiest)
  tempots.configs.recommended,

  // Option 2: Customize individual rules
  // {
  //   plugins: {
  //     tempots,
  //   },
  //   rules: {
  //     // Warn about signals created at module level
  //     'tempots/no-module-level-signals': 'warn',
  //
  //     // Warn about unnecessary manual disposal (auto-disposed signals)
  //     'tempots/no-unnecessary-disposal': 'warn',
  //
  //     // Error on untracked signals without disposal (memory leak)
  //     'tempots/require-untracked-disposal': 'error',
  //
  //     // Warn about signals in async contexts (not auto-disposed)
  //     'tempots/no-async-signal-creation': 'warn',
  //   },
  // },

  // Option 3: Use strict config for maximum safety
  // tempots.configs.strict,

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
