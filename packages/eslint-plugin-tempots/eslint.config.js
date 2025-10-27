import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['*.config.js', '**/*.config.js', 'dist/', 'examples/'],
  },
]
