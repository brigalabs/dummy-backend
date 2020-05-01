import http from "http";

export function corsResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": req.headers.origin,
    "Access-Control-Allow-Methods":
      "POST, GET, PUT, PATCH, POST, DELETE, OPTIONS",
    "Access-Control-Max-Age": 3600 * 24,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  });

  res.end();
}

export function notFoundResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(
    JSON.stringify({
      status: "error",
      error: "not_found",
      message: `[${req.method}] ${req.url} does not exist.`,
    })
  );
  res.end();
}

export function foundResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  data: {},
  args?: {}
) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(
    JSON.stringify({
      status: "success",
      data,
      ...args,
    })
  );
  res.end();
}

export function errorResponse(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  error: Error
) {
  res.writeHead(400, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(
    JSON.stringify({
      status: "error",
      error: "form_error",
      message: error.message,
    })
  );
  res.end();
}
