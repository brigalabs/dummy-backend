import yargs from "yargs";
import { start } from "./server";
import { setPort, setDatafile } from "./config";

const argv = yargs
  .scriptName("dummy-backend")
  .option("port", {
    alias: "p",
    default: 8080,
    describe: "The port to start the server on",
    type: "number"
  })
  .option("datafile", {
    alias: "d",
    default: "database.json",
    describe: "The filename to use to load and save the database",
    type: "string"
  })
  .help()
  .alias("help", "h").argv;

setPort(argv.port);
setDatafile(argv.datafile);

start();
