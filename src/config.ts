export const config = {
  port: 8080,
  datafile: "database.json"
};

export function setDatafile(datafile: string) {
  config.datafile = datafile;
}

export function setPort(port: number) {
  config.port = port;
}
