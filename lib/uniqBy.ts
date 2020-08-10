export default function uniqBy<T>(arr: T[], property = 'id'): T[] {
  return Array.from(new Set(arr.map((e: any) => e[property]))).map(
    (prop: T): T => ({ ...arr.find((s: any) => s[property] === prop)! })
  )
}
