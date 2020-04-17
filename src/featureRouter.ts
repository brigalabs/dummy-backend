import http from "http";
import { matches } from "lodash";
import { upload } from "./features/upload";
import { getFile } from "./features/getFile";
import { startsWith } from "lodash";
import { notFoundResponse } from "./response";
import { handleOption } from "./handlers";

const isOptions = matches({ method: "OPTIONS" });
const isUpload = matches({ url: "/_upload", method: "PUT" });
const isGetFile = matches({ method: "GET" });

export function featureRouter(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const request = {
    url: req.url,
    method: req.method,
  };

  if (isOptions(request)) {
    return handleOption(req, res);
  }

  if (isUpload(request)) {
    return upload(req, res);
  }

  if (isGetFile(request) && startsWith(request.url, "/_upload/")) {
    return getFile(req, res);
  }

  return notFoundResponse(req, res);
}
