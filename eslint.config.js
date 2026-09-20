const js = require('@eslint/js');

module.exports = [
  { ignores: ['coverage/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { Buffer: 'readonly', console: 'readonly' },
    },
  },
];
