import {
  values,
  get,
  unset,
  set,
  debounce,
  slice,
  sortBy,
  filter,
  includes,
  startsWith
} from "lodash";
import { Database, Row, DBOptions, DBFilterBy, ManyRow } from "./types";
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

const defaultOptions = {
  sortBy: "",
  sortDirection: "ASC",
  filterBy: "",
  page: 0,
  pageSize: 2
};

export function getMany(tableName: string, options: DBOptions): ManyRow {
  const table = get(database, tableName);

  const opts = {
    ...defaultOptions,
    ...options
  };

  const sortDirection = opts.sortDirection === "DESC" ? "DESC" : "ASC";

  // transform the existing table into a list
  let recordList = values(table);

  // filter the list for every filter we receive
  const filters: DBFilterBy[] = [];
  for (const key in opts) {
    if (startsWith(key, "filter_")) {
      filters.push({
        attribute: key.replace(/^filter_/, ""),
        value: get(opts, key)
      });
    }
  }

  if (filters.length) {
    for (const f of filters) {
      const match = new RegExp(f.value, "i");

      recordList = filter(recordList, record =>
        match.test(get(record, f.attribute))
      );
    }
  }

  // Sort the results
  if (opts.sortBy) {
    recordList = sortBy(recordList, opts.sortBy);

    if (sortDirection !== "ASC") {
      recordList.reverse();
    }
  }

  // compute the page position
  const start = opts.page * opts.pageSize;
  const end = opts.page + 1 * opts.pageSize;

  return {
    data: slice(recordList, start, end),
    total: recordList.length,
    pageSize: opts.pageSize,
    page: opts.page,
    sortBy: opts.sortBy,
    sortDirection
  };
}
