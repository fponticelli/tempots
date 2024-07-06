module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
    //   'plugin:react/recommended',
      'standard-with-typescript',
    //   'plugin:react-hooks/recommended'
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
      'react', // 'formatjs' // , 'react-hooks'
    ],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      'react/react-in-jsx-scope': 'off',
    //   'react-hooks/rules-of-hooks': 'error',
    //   'react-hooks/exhaustive-deps': 'warn',
    //   'formatjs/no-offset': 'error',
    //   'formatjs/enforce-id': [
    //     'error',
    //     {
    //       idInterpolationPattern: '[sha512:contenthash:base64:6]'
    //     }
    //   ]
    },
    settings: {
    //   react: {
    //     version: 'detect'
    //   }
    }
  }