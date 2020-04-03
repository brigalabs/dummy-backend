export function log(...args: any[]) {
  console.log(new Date().toLocaleString(), ...args);
}
