export enum EnumViewportType {
    DESKTOP = 'desktop',
    TABLET_HORIZONTAL = 'tabletHorizontal',
    TABLET_VERTICAL = 'tabletVertical',
    MOBILE = 'mobile',
}

export function isViewportMobile(viewportType: EnumViewportType) {
    return [EnumViewportType.TABLET_VERTICAL, EnumViewportType.MOBILE].includes(viewportType);
}

export function isWindowWidthMobile(windowWidth: number): boolean {
    return windowWidth <= 991;
}
