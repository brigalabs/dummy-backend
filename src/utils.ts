import http from "http";

export function parseRequest(req: http.IncomingMessage) {
  const [_, tableName, id] = (req.url || "/").split("/");

  return {
    tableName,
    id
  };
}
