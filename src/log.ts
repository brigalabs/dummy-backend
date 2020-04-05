export function log(...args: any[]) {
  console.log("\x1b[36m%s\x1b[0m", `[${new Date().toLocaleString()}]`, ...args);
}
