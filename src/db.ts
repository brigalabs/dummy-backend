import {
  get,
  lowerCase,
  set,
  slice,
  sortBy,
  concat,
  throttle,
  unset,
  values,
} from "lodash";
import { Database, Row, DBOptions, ManyRow, DBFilter } from "./types";
import { v4 } from "uuid";
import fs from "fs";
import { config } from "./config";
import { log, errorLog } from "./log";
import { applyFilters } from "./filter";

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

// create the dabase file if it does not exist
if (!fs.existsSync(config.datafile)) {
  fs.writeFileSync(config.datafile, "{}");
  log(`Database file "${config.datafile}" has been created.`);
}

fs.readFile(config.datafile, function (err, buf) {
  if (err) {
    errorLog("Error opening database file", config.datafile);
    throw err;
  }

  log(`Loading data from ${config.datafile} ...`);
  try {
    database = JSON.parse(buf.toString()) as Database;
  } catch (err) {
    errorLog(
      `Could not parse database file "${config.datafile}". Make sure it is a valid JSON object or delete it.`
    );
    throw err;
  }
  log("Loading data done.");
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
  page: 0,
  pageSize: 10,
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
  let filters: DBFilter[] = [];

  // filter the list for every filter we receive
  const rawFilters = opts["filter"];
  if (rawFilters) {
    // if only one filter was provided it will be a string
    // so we will use concat rawFilters to always cast it as an array,
    [recordList, filters] = applyFilters(recordList, concat(rawFilters));
  }

  // Sort the results
  if (opts.sortBy) {
    recordList = sortBy(recordList, (record) =>
      lowerCase(get(record, opts.sortBy))
    );
  }

  if (sortDirection !== "ASC") {
    recordList.reverse();
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
    filters,
  };
}
