module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-invalid-void-type': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'warn',
    'key-spacing': 'off',
    '@typescript-eslint/no-misused-promises': 'warn',
    'react/prop-types': 'off'
  },
}

