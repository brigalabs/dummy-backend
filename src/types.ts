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
