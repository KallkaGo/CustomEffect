import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  formatters: true,
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prefer-destructuring-assignment': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
      },
    ],
  },
  ignores: [
    'public/**/*',
    'static/**/*',
  ],
})
