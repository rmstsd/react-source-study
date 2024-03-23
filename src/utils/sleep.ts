export function sleep(ms: number) {
  let t = Date.now()
  while (Date.now() - t < ms) {}
}
