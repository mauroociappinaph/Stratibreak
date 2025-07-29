module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    // TypeScript strict rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Code quality rules
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', 10],
    'max-depth': ['error', 4],
    'max-params': ['error', 5],
    'max-nested-callbacks': ['error', 3],

    // Production safety
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error',

    // Code consistency
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',

    // Import organization
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // NestJS specific rules
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['constructors'] }
    ],
    'constructor-super': 'error',

    // Prevent common mistakes
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    'no-unused-expressions': 'error',
    'require-await': 'error',
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
  ],
};
