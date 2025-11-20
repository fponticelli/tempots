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
  tempots.configs.recommended,
  {
    ignores: [
      '*.js',
      '*.mjs',
      '*.config.js',
      '**/*.config.js',
      'demo/*/dist/',
      'dist/',
    ],
  },
]
