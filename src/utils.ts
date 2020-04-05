import http from "http";
import url from "url";

export function parseRequest(req: http.IncomingMessage) {
  const parsedUrl = url.parse(req.url || "", true);
  // the first / in the URL should be ignored
  const [_, tableName, id] = (parsedUrl.pathname || "").split("/");

  return {
    tableName,
    id,
    query: parsedUrl.query,
  };
}

export async function waitFor(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
