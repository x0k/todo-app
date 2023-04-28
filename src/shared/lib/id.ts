import { nanoid } from 'nanoid'

export function makeLinkIdGenerator<O extends object>(): (object: O) => string {
  const map = new WeakMap<O, string>()
  return (obj) => {
    let id = map.get(obj)
    if (id !== undefined) {
      return id
    }
    id = nanoid()
    map.set(obj, id)
    return id
  }
}
