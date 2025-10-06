export interface DbRow {
    id: string;
    text: string;
    timing: string;
}

export interface DbRowResult {
    result: DbRow;
    accessTime: number;
}