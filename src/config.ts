import { log, bold } from "./log";

interface Config {
  port: number;
  hostname: string;
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
  hostname: "localhost",
  delay: 200,
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
  log(`Response delay is set to ${bold(delay)}`);
  config.delay = delay;
}

export function setHostname(hostname: string) {
  log(`Serving hostname is set to ${bold(hostname)}`);
  config.hostname = hostname;
}
