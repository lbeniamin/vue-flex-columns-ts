import type * as CSS from 'csstype';

const PIXEL_UNIT = 'px';
const PERCENTAGE_UNIT = '%';

export function getComputedPropertyValue(element: Element | null, propertyName: CSS.Property, parentElementSize?: number): number {
    if (!element) {
        return 0;
    }
    
    const computedProperty = getComputedStyle(element)[propertyName]
    if (computedProperty.includes(PIXEL_UNIT)) {
        return Number(computedProperty.replace('px', ''));
    }

    if (computedProperty.includes(PERCENTAGE_UNIT)) {
        return parentElementSize ? Number(computedProperty.replace('%', '')) / 100 * parentElementSize : 0;
    }

    return Number(computedProperty);
}