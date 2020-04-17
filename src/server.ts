import http from "http";
import { notFoundResponse, errorResponse } from "./response";
import { startsWith } from "lodash";
import { Row } from "./types";
import { router } from "./router";
import { config } from "./config";
import { log } from "./log";
import { waitFor } from "./utils";
import { featureRouter } from "./featureRouter";

export function start() {
  http
    .createServer(async function (
      req: http.IncomingMessage,
      res: http.ServerResponse
    ) {
      log(`\x1b[32m${req.method}\x1b[0m`, req.url);

      if (config.delay) {
        await waitFor(config.delay);
      }

      if (!req.url || req.url === "/") {
        return notFoundResponse(req, res);
      }

      if (startsWith(req.url, "/_")) {
        return featureRouter(req, res);
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
            return errorResponse(req, res, error);
          }

          router(req, res, body as Row);
        });
    })
    .listen(config.port);
  log(`Serving request at http://${config.hostname}:${config.port}`);
}
