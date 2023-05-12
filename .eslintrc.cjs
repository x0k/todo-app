module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'prettier',
    'plugin:effector/recommended',
    'plugin:effector/scope',
    'plugin:effector/react',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react', 'prettier', 'effector'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-invalid-void-type': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'key-spacing': 'off',
    '@typescript-eslint/no-misused-promises': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'warn',
  },
}
