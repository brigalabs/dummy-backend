import http from "http";
import { Row } from "./types";
import { notFoundResponse } from "./response";
import { handlePut, handleDelete, handleGet, handlePost } from "./handlers";

export function router(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  body: Row
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);

    case "POST":
      return handlePost(req, res, body);

    case "DELETE":
      return handleDelete(req, res);

    case "PUT":
      return handlePut(req, res, body);

    default:
      return notFoundResponse(req, res);
  }
}
