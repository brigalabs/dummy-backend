import {
  values,
  get,
  unset,
  set,
  throttle,
  slice,
  sortBy,
  filter,
  startsWith,
} from "lodash";
import { Database, Row, DBOptions, DBFilterBy, ManyRow } from "./types";
import { v4 } from "uuid";
import fs from "fs";
import { config } from "./config";
import { log } from "./log";

let database: Database = {};

const syncDatabaseFile = throttle(() => {
  const strDb = JSON.stringify(database, null, 2);
  fs.writeFile(config.datafile, strDb, (error) => {
    if (error) {
      log(`Error sync database to file ${config.datafile}`, error);
    } else {
      log(`sync to file ${config.datafile} success.`);
    }
  });
}, 1000);

fs.readFile(config.datafile, function (err, buf) {
  if (err) {
    console.error("Could not read", config.datafile);
  } else {
    log(`Loading data from ${config.datafile} ...`);
    database = JSON.parse(buf.toString()) as Database;
    log("Loading data done.");
  }
});

export function createRecord(tableName: string, value: Row) {
  const now = new Date().toISOString();
  const id = v4();
  const newRow = {
    ...value,
    id,
    createdAt: now,
    updatedAt: now,
  };

  set(database, `${tableName}.${id}`, newRow);
  syncDatabaseFile();

  return newRow;
}

export function updateRecord(tableName: string, id: string, value: Row) {
  if (id) {
    const updatedRow = {
      ...value,
      id,
      updatedAt: new Date().toISOString(),
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
  pageSize: 2,
};

export function getMany(tableName: string, options: DBOptions): ManyRow {
  const table = get(database, tableName);

  const opts = {
    ...defaultOptions,
    ...options,
  };

  const sortDirection = opts.sortDirection === "DESC" ? "DESC" : "ASC";
  const page = parseInt(opts.page as any, 10);
  const pageSize = parseInt(opts.pageSize as any, 10);

  // transform the existing table into a list
  let recordList = values(table);

  // filter the list for every filter we receive
  const filters: DBFilterBy[] = [];
  for (const key in opts) {
    if (startsWith(key, "filter_")) {
      filters.push({
        attribute: key.replace(/^filter_/, ""),
        value: get(opts, key),
      });
    }
  }

  if (filters.length) {
    for (const f of filters) {
      const match = new RegExp(f.value, "i");

      recordList = filter(recordList, (record) =>
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
  const start = page * pageSize;
  const end = (page + 1) * pageSize;

  return {
    data: slice(recordList, start, end),
    total: recordList.length,
    pageSize: pageSize,
    page: page,
    sortBy: opts.sortBy,
    sortDirection,
  };
}
