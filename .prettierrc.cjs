module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    '^@/shared/(.*)$',
    '^@/models/(.*)$',
    '^@/implementations/(.*)$',
    '^@/entities/(.*)$',
    '^@/features/(.*)$',
    '^@/widgets/(.*)$',
    '^@/pages/(.*)$',
    '^@/app/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
