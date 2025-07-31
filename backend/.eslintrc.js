module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],

  rules: {
    // TypeScript strict rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',

    // Code quality rules
    'max-lines': [
      'error',
      { max: 300, skipBlankLines: true, skipComments: true },
    ],
    complexity: ['error', 10],
    'max-depth': ['error', 4],
    'max-params': ['error', 5],

    // Production safety
    'no-console': 'error',
    'no-debugger': 'error',

    // Code consistency
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  overrides: [
    {
      // Special rules for Prisma seed files
      files: ['prisma/**/*.ts'],
      parserOptions: {
        project: null, // Disable project-based linting for prisma files
      },
      rules: {
        'no-console': 'off', // Allow console.log in seed files
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      // Special rules for test files
      files: ['**/*.spec.ts', 'test/**/*.ts'],
      parserOptions: {
        project: null, // Disable project-based linting for test files
      },
      rules: {
        'no-console': 'off', // Allow console.log in tests
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in tests
      },
    },
  ],
};
