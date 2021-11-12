export const removeArrayItem = <A extends any[]>(arr: A, idx: number) => [
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1),
]
