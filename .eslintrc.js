const prettierConfig = require('./.prettierrc.js');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',

    // Disabling eslint-plugin-next for now as we are seeing errors with it
    // TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
    // 'plugin:@next/next/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['@typescript-eslint', 'react-hooks', 'eslint-plugin-prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ordered-imports': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/camelcase': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',

    // prettier rules
    'prettier/prettier': ['error', prettierConfig],
  },
};
