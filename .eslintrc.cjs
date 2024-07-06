module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'standard-with-typescript',
    ],
    overrides: [
    ],
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    plugins: [

    ],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
    settings: {
    }
  }
