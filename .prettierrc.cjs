module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    '^@/lib/(.*)$',
    '^@/components/(.*)$',
    '^@/implementation/(.*)$',
    '^@/(.*)$',
    '^..?/model',
    '^..?/components',
    '^..?/domain',
    '^..?/containers',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
