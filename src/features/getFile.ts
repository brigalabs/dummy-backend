import http from "http";
import fs from "fs";
import path from "path";
import mime from "mime-types";

import { config } from "../config";
import { parseRequest } from "../utils";
import { notFoundResponse } from "../response";

export function getFile(req: http.IncomingMessage, res: http.ServerResponse) {
  const { id } = parseRequest(req);

  if (!id) {
    return notFoundResponse(req, res);
  }

  const filePath = path.join(config.upload.uploadDir, id.replace("/", ""));

  fs.exists(filePath, (exists) => {
    if (exists) {
      const { size } = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type": mime.lookup(filePath) || "application/octet-stream",
        "Content-Length": size,
      });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } else {
      return notFoundResponse(req, res);
    }
  });
}
