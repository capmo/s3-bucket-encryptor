module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        custom: {
          match: true,
          regex: '^I[A-Z]',
        },
        format: ['PascalCase'],
        selector: 'interface',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    camelcase: 'error',
    curly: 'error',
    eqeqeq: 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'new-cap': 'error',
    'newline-before-return': 'error',
    'no-shadow': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'sort-keys': 'error',
    'spaced-comment': 'error',
  },
};
