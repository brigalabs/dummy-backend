import http from "http";
import { notFoundResponse } from "./response";
import { Row } from "./types";
import { router } from "./router";
import { config } from "./config";
import { log } from "./log";
import { waitFor } from "./utils";

export function start() {
  http
    .createServer(async function (
      req: http.IncomingMessage,
      res: http.ServerResponse
    ) {
      log(`\x1b[32m${req.method}\x1b[0m`, req.url);

      if (!req.url || req.url === "/") {
        return notFoundResponse(req, res);
      }

      if (config.delay) {
        await waitFor(config.delay);
      }

      const reqData: any[] = [];

      req
        .on("error", (err) => {
          console.error(err);
        })
        .on("data", (chunk) => {
          reqData.push(chunk);
        })
        .on("end", () => {
          let body = {};

          try {
            const strData = Buffer.concat(reqData).toString();
            body = strData ? JSON.parse(strData) : {};
          } catch (error) {
            log(error);
          }

          router(req, res, body as Row);
        });
    })
    .listen(config.port);
  log(`Serving request at http://localhost:${config.port}`);
}
