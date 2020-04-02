import { foundResponse, notFoundResponse, errorResponse } from "./response";
import http from "http";
import url from "url";
import { parseRequest } from "./utils";
import {
  deleteRecord,
  createRecord,
  updateRecord,
  getOne,
  getMany
} from "./db";
import { Row } from "./types";

export function handleDelete(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const { tableName, id } = parseRequest(req);

  const deletedRecord = deleteRecord(tableName, id);

  if (deletedRecord) {
    return foundResponse(req, res, deletedRecord);
  } else {
    return notFoundResponse(req, res);
  }
}

export function handlePost(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  row: Row
) {
  const { tableName } = parseRequest(req);

  try {
    const createdRecord = createRecord(tableName, row);

    if (createdRecord) {
      return foundResponse(req, res, createdRecord);
    } else {
      return notFoundResponse(req, res);
    }
  } catch (error) {
    return errorResponse(req, res, error);
  }
}

export function handlePut(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  row: Row
) {
  const { tableName, id } = parseRequest(req);

  try {
    const updatedRecord = updateRecord(tableName, id, row);

    if (updatedRecord) {
      return foundResponse(req, res, updatedRecord);
    } else {
      return notFoundResponse(req, res);
    }
  } catch (error) {
    return errorResponse(req, res, error);
  }
}

export function handleGet(req: http.IncomingMessage, res: http.ServerResponse) {
  const { tableName, id, query } = parseRequest(req);

  if (id) {
    const value = getOne(tableName, id);
    if (value) {
      return foundResponse(req, res, value);
    } else {
      return notFoundResponse(req, res);
    }
  } else {
    const { data, ...rest } = getMany(tableName, query);

    return foundResponse(req, res, data, rest);
  }
}
