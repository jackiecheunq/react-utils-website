export function removeRepeat(arr: Array<string>) {
  const set = new Set(arr);
  return Array.from(set);
}
