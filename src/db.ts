import { values, get, unset, set } from "lodash";
import { Database, Row } from "./types";
import { v4 } from "uuid";

const database: Database = {};

export function createRecord(tableName: string, value: Row) {
  const now = new Date().toISOString();
  const id = v4();
  const newRow = {
    ...value,
    id,
    createdAt: now,
    updatedAt: now
  };

  set(database, `${tableName}.${id}`, newRow);

  return newRow;
}

export function updateRecord(tableName: string, id: string, value: Row) {
  if (id) {
    const row = getOne(tableName, id);

    const updatedRow = {
      ...row,
      ...value,
      id,
      updatedAt: new Date().toISOString()
    };

    set(database, `${tableName}.${id}`, updatedRow);

    return updatedRow;
  } else {
    throw new Error("required attribute id is missing");
  }
}

export function deleteRecord(tableName: string, id: string): Row | void {
  const row = getOne(tableName, id);

  if (row) {
    unset(database, `${tableName}.${id}`);
    return row;
  }
}

export function getOne(tableName: string, id: string): Row | void {
  const value = get(database, `${tableName}.${id}`);

  if (value) {
    return value as Row;
  }
}

export function getMany(tableName: string): Row[] {
  const table = get(database, tableName);
  return values(table);
}
