import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tempots from '../../packages/tempots-eslint-plugin/src/index.js'

export default [
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
  // Use the recommended config for automatic signal disposal
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
    ],
  },
]
