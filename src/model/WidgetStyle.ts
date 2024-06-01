import type * as CSS from 'csstype';
import { EnumJustifyContent } from './enum/EnumJustifyContent';

export class WidgetStyle {
    columnGap: string = '';
    rowGap: string = '';
    justifyContent: CSS.Property.JustifyContent = EnumJustifyContent.FLEX_START;

    constructor(data: Partial<WidgetStyle>) {
        if (data) {
            Object.assign(this, data);
        }
    }
};