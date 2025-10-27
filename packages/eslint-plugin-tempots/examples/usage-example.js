// Example ESLint configuration using eslint-plugin-tempots
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from 'eslint-plugin-tempots'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      tempots,
    },
    rules: {
      // Warn about undisposed signals (recommended for development)
      'tempots/require-signal-disposal': 'warn',

      // Or use error for stricter enforcement
      // "tempots/require-signal-disposal": "error",

      // Or customize the options
      // "tempots/require-signal-disposal": ["warn", {
      //   checkTransforms: true,  // Check .map(), .filter(), etc.
      //   checkCreations: true,   // Check prop(), signal(), computed()
      // }],
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
