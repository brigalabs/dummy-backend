// The following filters are inspired by Derric Gilling article about listing REST API
// https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/

import { Row, DBFilter, DBFilterOperator } from "./types";
import { map, filter, has, isNumber, isBoolean, get, includes } from "lodash";

type FilterFunction = (row: Row, attribute: string, value: string) => boolean;
type FilterOperators = { [operator in DBFilterOperator]: FilterFunction };

export function applyFilters(
  records: Row[],
  rawFilters: string[]
): [Row[], DBFilter[]] {
  const dbFilters = filter(map(rawFilters, parseFilter)) as DBFilter[];

  for (const dbFilter of dbFilters) {
    const { attribute, value, operator } = dbFilter;
    const filterOperator = get(
      filterOperators,
      operator
    ) as FilterFunction | void;

    if (filterOperator) {
      records = filter(records, (row) => filterOperator(row, attribute, value));
    }
  }

  return [records, dbFilters];
}

function parseFilter(rawFilter: string): DBFilter | void {
  const [lhs, ...rhs] = rawFilter.split(":");
  const value = rhs.join(":");

  const validFilterRe = /^([a-zA-Z_]+)\[(\w+)\]$|^([a-zA-Z_]+)$/;
  const filter = validFilterRe.exec(lhs);

  if (filter) {
    const operator = filter[2];
    // if we found an operator the regexp will place the attribute
    // as the 2nd element on the array, otherwise it will be the first
    const attribute = operator ? filter[1] : filter[0];
    return {
      attribute,
      operator: operator || "eq",
      value,
    };
  }
}

/**
 * Exact filter
 * "FOO" will only match "FOO"
 */
const eqFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    return attributeValue === castValue(attributeValue, value);
  }
  return false;
};

const gtFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    return attributeValue > castValue(attributeValue, value);
  }
  return false;
};

const gteFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    return attributeValue >= castValue(attributeValue, value);
  }
  return false;
};

const ltFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    return attributeValue < castValue(attributeValue, value);
  }
  return false;
};

const lteFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    return attributeValue <= castValue(attributeValue, value);
  }
  return false;
};

/**
 * Case insensitive match filter
 * "FOO" will match "BazfOoBaR"
 */
const hasFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    if (typeof attributeValue === "string") {
      return includes(
        attributeValue.toLocaleLowerCase(),
        value.toLocaleLowerCase()
      );
    }
  }
  return false;
};

/**
 * Regular Expression filter
 */
const regexFilter: FilterFunction = (row, attribute, value) => {
  if (has(row, attribute)) {
    const attributeValue = get(row, attribute);
    if (typeof attributeValue === "string") {
      return new RegExp(value).test(attributeValue);
    }
  }
  return false;
};

/**
 * Cast the value into the same type of attribute
 * @param attribute
 * @param value
 */
const castValue = (
  attribute: any,
  value: string
): string | boolean | number => {
  if (isNumber(attribute)) {
    return Number(value);
  } else if (isBoolean(attribute)) {
    return value.toLowerCase() === "false" ? false : true;
  }

  return value.toString();
};

const filterOperators: FilterOperators = {
  eq: eqFilter,
  has: hasFilter,
  lt: ltFilter,
  lte: lteFilter,
  gt: gtFilter,
  gte: gteFilter,
  reg: regexFilter,
};
