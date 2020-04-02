export interface Row {
  id: string;
  updatedAt: string;
  createddAt: string;
  [props: string]: any;
}

export interface Table {
  [id: string]: Row;
}

export interface Database {
  [tableName: string]: Table;
}

export type DBPage = number;
export type DBPageSize = number;
export type DBSortBy = string;
export type DBSortDirection = "ASC" | "DESC";
export interface DBFilterBy {
  attribute: string;
  value: string;
}

export interface DBOptions {
  sortBy?: DBSortBy;
  sortDirection?: DBSortDirection;
  page?: DBPage;
  pageSize?: DBPageSize;
  [otherProps: string]: any;
}

export interface ManyRow {
  data: Row[];
  total: number;
  pageSize: DBPageSize;
  page: DBPage;
  sortBy: DBSortBy;
  sortDirection: DBSortDirection;
}
