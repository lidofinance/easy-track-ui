export type FilterMethods<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

export type UnpackedPromise<T> = T extends Promise<infer U> ? U : T

export type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: V extends T[K] ? K : never
}[keyof T]

export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>
}
