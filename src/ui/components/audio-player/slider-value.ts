export function firstValue(value: number | readonly number[]): number {
  return typeof value === "number" ? value : (value[0] ?? 0);
}
