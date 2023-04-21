module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    '^@/lib/(.*)$',
    '^@/models/(.*)$',
    '^@/domains/(.*)$',
    '^@/components/(.*)$',
    '^@/containers/(.*)$',
    '^@/implementation/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
