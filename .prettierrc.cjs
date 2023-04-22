module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    '^@/lib/(.*)$',
    '^@/components/(.*)$',
    '^@/(.*)$',
    '^..?/model',
    '^..?/components',
    '^..?/domain',
    '^..?/containers',
    '^..?/implementation/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
