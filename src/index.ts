import http from "http";
import { Row } from "./types";
import { notFoundResponse } from "./response";
import { router } from "./router";

http
  .createServer(function(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(new Date().toLocaleString(), "Req", req.method, req.url);

    if (!req.url || req.url === "/") {
      return notFoundResponse(req, res);
    }

    const reqData: any[] = [];

    req
      .on("error", err => {
        console.error(err);
      })
      .on("data", chunk => {
        reqData.push(chunk);
      })
      .on("end", () => {
        let body = {};

        try {
          const strData = Buffer.concat(reqData).toString();
          body = strData ? JSON.parse(strData) : {};
        } catch (error) {
          console.log(error);
        }

        router(req, res, body as Row);
      });
  })
  .listen(8080);
