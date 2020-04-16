import { log, bold } from "./log";

interface Config {
  port: number;
  datafile: string;
  delay: number;
  upload: {
    multiples: boolean;
    uploadDir: string;
    keepExtensions: boolean;
  };
}

export const config: Config = {
  port: 8080,
  datafile: "database.json",
  delay: 0,
  upload: {
    multiples: true,
    uploadDir: `${__dirname}/../upload`,
    keepExtensions: true,
  },
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
