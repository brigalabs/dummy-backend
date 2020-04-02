import { values, get, unset, set, debounce } from "lodash";
import { Database, Row } from "./types";
import { v4 } from "uuid";
import fs from "fs";

const databaseFilename = "database.json";

let database: Database = {};

const syncDatabaseFile = debounce(() => {
  const strDb = JSON.stringify(database, null, 2);
  fs.writeFile(databaseFilename, strDb, error => {
    if (error) {
      console.log(
        new Date().toLocaleString(),
        `Error sync database to file ${databaseFilename}`,
        error
      );
    } else {
      console.log(
        new Date().toLocaleString(),
        `sync to file ${databaseFilename} success.`
      );
    }
  });
}, 1000);

fs.readFile(databaseFilename, function(err, buf) {
  if (err) {
    console.error("Could not read", databaseFilename);
  } else {
    console.log(
      new Date().toLocaleString(),
      `Loading data from ${databaseFilename} ...`
    );
    database = JSON.parse(buf.toString()) as Database;
    console.log(new Date().toLocaleString(), "Loading data done.");
  }
});

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
  syncDatabaseFile();

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
    syncDatabaseFile();

    return updatedRow;
  } else {
    throw new Error("required attribute id is missing");
  }
}

export function deleteRecord(tableName: string, id: string): Row | void {
  const row = getOne(tableName, id);

  if (row) {
    unset(database, `${tableName}.${id}`);
    syncDatabaseFile();

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
