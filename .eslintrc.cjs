module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
    // Removed project: './tsconfig.json' since type-checking is not needed
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended' // Only basic TypeScript rules
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-const': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prefer-template': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    '!.eslintrc.cjs',
    '!rollup.config.mjs',
    '!jest.config.js',
    'src/__tests__/**/*.ts' // Ignore test files
  ]
};