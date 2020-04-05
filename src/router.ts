import http from "http";
import { Row } from "./types";
import { notFoundResponse } from "./response";
import {
  handlePut,
  handleDelete,
  handleGet,
  handlePost,
  handleOption,
} from "./handlers";

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

    case "OPTIONS":
      return handleOption(req, res);

    default:
      return notFoundResponse(req, res);
  }
}
