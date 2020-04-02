import http from "http";

export function notFoundResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify({
      status: "error",
      error: "not_found",
      message: `[${req.method}] ${req.url} does not exist.`
    })
  );
  res.end();
}

export function foundResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  data: {}
) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify({
      status: "success",
      data
    })
  );
  res.end();
}

export function errorResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  error: Error
) {
  res.writeHead(400, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify({
      status: "error",
      error: "form_error",
      message: error.message
    })
  );
  res.end();
}
