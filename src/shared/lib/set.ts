export const isSetEquals = <T>(xs: Set<T>, ys: Set<T>): boolean =>
  xs.size === ys.size && Array.from(xs).every((x) => ys.has(x))
