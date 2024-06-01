export class ColumnStyle {
    width: string = '';
    order: number = 0;
    marginLeft: string = '';
    marginRight: string = '';

    constructor(data: Partial<ColumnStyle>) {
        if (data) {
            Object.assign(this, data);
        }
    }
};