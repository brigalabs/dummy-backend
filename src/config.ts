import { log, bold } from "./log";

export const config = {
  port: 8080,
  datafile: "database.json",
  delay: 0,
};

export function setDatafile(datafile: string) {
  log(`Database file is ${bold(datafile)}`);
  config.datafile = datafile;
}

export function setPort(port: number) {
  log(`Using port ${bold(port)}`);
  config.port = port;
}

export function setDelay(delay: number) {
  log(`Set delay to ${bold(delay)}`);
  config.delay = delay;
}
