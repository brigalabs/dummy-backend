export const config = {
  port: 8080,
  datafile: "database.json",
  delay: 0,
};

export function setDatafile(datafile: string) {
  config.datafile = datafile;
}

export function setPort(port: number) {
  config.port = port;
}

export function setDelay(delay: number) {
  config.delay = delay;
}
