export class OffsetParams {
    show: boolean = false;
    top: string = '';
    left: string = '';
    height: string = '';
    width: string = '';
    filled: boolean = false;

    constructor(data: Partial<OffsetParams>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}