import http from "http";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import NodeStatic from "node-static";

import { config } from "../config";
import { parseRequest } from "../utils";

var nodeStatic = new NodeStatic.Server(config.upload.uploadDir);

export function getFile(req: http.IncomingMessage, res: http.ServerResponse) {
  req
    .addListener("end", function () {
      // retrieve the filename
      const { id } = parseRequest(req);

      // nodeStatic handles 304, caching, path normalization...
      nodeStatic.serve({ ...req, url: id } as http.IncomingMessage, res);
    })
    .resume();
}
