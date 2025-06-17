module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['react', '@typescript-eslint'],
  settings: { react: { version: 'detect' } },
  env: { browser: true, es2021: true, node: true }
};
