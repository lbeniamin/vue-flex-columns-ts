import type * as CSSProperty from 'csstype';

const PIXEL_UNIT = 'px';
const PERCENTAGE_UNIT = '%';

export function getComputedPropertyValue(element: Element, propertyName: CSSProperty, parentElementSize: number) {
    const computedProperty = getComputedStyle(element)[propertyName];
    if (computedProperty.includes(PIXEL_UNIT)) {
        return Number(computedProperty.replace('px', ''));
    }

    if (computedProperty.includes(PERCENTAGE_UNIT)) {
        return Number(computedProperty.replace('%', '')) / 100 * parentElementSize;
    }

    return Number(computedProperty);
}