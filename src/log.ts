export function log(...args: any[]) {
  console.log("\x1b[36m%s\x1b[0m", `[${new Date().toLocaleString()}]`, ...args);
}

export function bold(value: string | number | boolean): string {
  return `\x1b[1m${value}\x1b[0m`;
}
