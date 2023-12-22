export function removeRepeat(arr: Array<string>) {
  const set = new Set(arr);
  return Array.from(set);
}

export function isChristmas() {
  const today = new Date();
  const isChristmas = today.getMonth() === 11 && today.getDate() === 25;
  return isChristmas;
}
