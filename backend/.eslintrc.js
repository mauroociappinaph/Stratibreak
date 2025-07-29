module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Basic TypeScript rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',

    // Code quality rules
    'max-lines': ['error', { max: 300 }],
    complexity: ['error', 10],

    // Allow console.log for bootstrap function
    'no-console': ['error', { allow: ['log', 'error'] }],
    'no-debugger': 'error',

    // Code consistency
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
};
