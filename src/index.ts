import yargs from "yargs";
import { start } from "./server";
import { setPort, setDatafile, setDelay, setHostname } from "./config";

const argv = yargs
  .scriptName("dummy-backend")
  .option("port", {
    alias: "p",
    default: 8080,
    describe: "The port to start the server on",
    type: "number",
  })
  .option("delay", {
    alias: "d",
    default: 200,
    describe: "Delay prior to responding to a request",
    type: "number",
  })
  .option("file", {
    alias: "f",
    default: "database.json",
    describe: "The filename to use to load and save the database",
    type: "string",
  })
  .option("hostname", {
    alias: "n",
    default: "localhost",
    describe: "The hostname of the server",
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

setPort(argv.port);
setDatafile(argv.file);
setDelay(argv.delay);
setHostname(argv.hostname);

start();
