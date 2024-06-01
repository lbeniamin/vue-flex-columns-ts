export enum EnumOffsetType {
    LEFT = 'left',
    RIGHT = 'right',
}

export function getMarginProperty(type: EnumOffsetType) {
    return type === EnumOffsetType.LEFT ? 'marginLeft' : 'marginRight';
}