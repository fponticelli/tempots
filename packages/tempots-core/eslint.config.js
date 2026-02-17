import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

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
