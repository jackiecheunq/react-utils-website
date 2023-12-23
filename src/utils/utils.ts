export function removeRepeat(arr: Array<string>) {
  const set = new Set(arr);
  return Array.from(set);
}

const festivalEasterEggs: Record<string, string> = {
  "12,25": "🎄",
  "12,27": "🎂",
  "1,1": "🎊",
};
export function getEasterEgg(): string {
  const today = new Date();
  const date = `${today.getMonth() + 1},${today.getDate()}`;
  console.log(date);
  if (date in festivalEasterEggs) {
    return festivalEasterEggs[date];
  }
  return "";
}
