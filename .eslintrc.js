module.exports = {
  // root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'no-new': 0,
    'prettier/prettier': [
      2,
      {
        endOfLine: 'auto',
        trailingComma: 'es5',
        singleQuote: true,
        arrowParens: 'always',
        printWidth: 80,
      },
    ],
  },
};
