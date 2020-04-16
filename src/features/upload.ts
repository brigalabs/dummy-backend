import { IncomingForm } from "formidable";
import http from "http";
import fs from "fs";
import path from "path";
import { map } from "lodash";

import { errorResponse, foundResponse } from "../response";
import { config } from "../config";
import { log } from "../log";

fs.mkdir(config.upload.uploadDir, { recursive: true }, (error) => {
  if (error) {
    log(`Error creating upload directory "${config.upload.uploadDir}"`, error);
    process.exit(10);
  }
});

export function upload(req: http.IncomingMessage, res: http.ServerResponse) {
  // parse a file upload
  const form = new IncomingForm(config.upload as any);

  form.parse(req, (error, fields, files) => {
    if (error) {
      errorResponse(req, res, error);
    } else {
      const filename = path.basename(files.file.path);
      const url = `http://${config.hostname}:${config.port}/_upload/${filename}`;

      foundResponse(req, res, {
        url,
        name: files.file.name,
        size: files.file.size,
        type: files.file.type,
      });
    }
  });

  return;
}
