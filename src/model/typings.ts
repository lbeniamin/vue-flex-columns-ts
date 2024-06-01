export type ColumnElement = Element & {
    attributes: { column: { value: number } }
};

export type Gap = {
    value: number,
    unit: string;
};