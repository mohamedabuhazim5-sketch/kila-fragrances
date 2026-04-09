export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
