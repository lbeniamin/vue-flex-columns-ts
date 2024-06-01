<template>
    <div :class="viewportType" class="vue-flex-columns">
    <h1>Vue Flex Columns</h1>
    <div class="widget-columns" :style="widgetStyles">
      <div v-for="(column, index) in columnsNumber" :key="index" :style="columnStyles[index]" :class="{ highlighted: columnsHighlight[index] }" :column="index" class="column-container">
        <p>Column {{ index + 1 }}</p>
        <div class="widget-area">
          <p>Area {{ index + 1 }}</p>
        </div>
      </div>
      <div v-for="(column, index) in columnsNumber" :key="`mol${index}`" :style="offsetHighlightMasks[index].left" :column="index" :class="{ visible: offsetHighlightMasks[index].left.show, filled: offsetHighlightMasks[index].left.filled }" class="offsetHighlight left" />
      <div v-for="(column, index) in columnsNumber" :key="`mor${index}`" :style="offsetHighlightMasks[index].right" :column="index" :class="{ visible: offsetHighlightMasks[index].right.show, filled: offsetHighlightMasks[index].right.filled }" class="offsetHighlight right" />
      <div v-for="(column, index) in columnsNumber" :key="`cg${index}`" :style="columnGapHiglightMasks[index]" :column="index" class="columnGapHighlight" :class="{ visible: columnGapHiglightMasks[index].show, filled: columnGapHiglightMasks[index].filled, hide: !columnGapHiglightMasks[index].display }" />
      <div v-for="(row, index) in rowsNumber" :key="`rg${index}`" :style="rowGapHighlightMasks[index]" class="rowGapHighlight" :class="{ visible: rowGapHighlightMasks[index].show, filled: rowGapHighlightMasks[index].filled, hide: !rowGapHighlightMasks[index].display }" />
      <div v-for="(column, index) in columnsNumber" :key="`ri${index}`" :style="columnResizeIndicators[index]" @mousedown="onIndicatorMouseDown($event, index)" @mouseup="onIndicatorMouseUp($event, index)" :class="{ duringDrag: columnResizeIndicators[index].duringDrag }" class="columnResizeIndicator" />
    </div>
    <div class="settings">
      <div class="main-settings">
        <h3>Widget settings</h3>
        <div class="viewport-settings">
          <span>Viewport:</span>
          <svg-icon type="mdi" :path="mdiMonitor" :class="{ selected: viewportType === 'desktop' }" @click.stop="setViewportType('desktop')" />
          <svg-icon type="mdi" :path="mdiTablet" :class="{ selected: viewportType === 'tabletHorizontal' }" @click.stop="setViewportType('tabletHorizontal')" />
          <svg-icon type="mdi" :path="mdiTablet" :class="{ selected: viewportType === 'tabletVertical' }" :rotate="90" @click.stop="setViewportType('tabletVertical')" />
          <svg-icon type="mdi" :path="mdiCellphone" :class="{ selected: viewportType === 'mobile' }" @click.stop="setViewportType('mobile')" />
        </div>
        <div>
          <span>Number of columns: </span>
          <input v-model="columnsNumber" min="1" type="number" @keypress="validate($event, 'columnsNumber')" @mouseover="highlightColumn()" @mouseleave="unhighlightColumns">
        </div>
        <div class="alignment">
          <span>Alignment: </span>
          <div @click="setAlignment('left')" :class="{ selected: alignment.left }">Left</div>
          <div @click="setAlignment('center')" :class="{ selected: alignment.center }">Center</div>
          <div @click="setAlignment('right')" :class="{ selected: alignment.right }">Right</div>
          <div @click="setAlignment('between')" :class="{ selected: alignment.between }">Between</div>
        </div>
        <h3>Columns Settings</h3>
        <div class="units">
          <span>Units:</span>
          <div :class="{ selected: absolute }" @click="absolute = true">
            <p>Absolute</p>
          </div>
          <div :class="{ selected: !absolute }" @click="absolute = false">
            <p>Ratios</p>
          </div>
        </div>
      </div>
      <div v-if="absolute" class="absolute-settings">
        <div>
          <span>Horizontal gap:</span>
          <div class="inputs-area">
            <input v-model="columnGap.value" min="0" type="number" @keypress="validate($event, 'gap')" @mouseover="columnGapSettingMouseAction(true)" @mouseleave="columnGapSettingMouseAction(false)" @input="revealColumnGapMask">
            <select v-model="columnGap.unit" @mouseover="columnGapSettingMouseAction(true)" @mouseleave="columnGapSettingMouseAction(false)">
              <option v-for="unit in UNITS" :key="unit">{{ unit }}</option>
            </select>
          </div>
        </div>
        <div>
          <span>Vertical gap:</span>
          <div class="inputs-area">
            <input v-model="rowGap.value" min="0" type="number" @keypress="validate($event, 'gap')" @mouseover="rowGapSettingMouseAction(true)" @mouseleave="rowGapSettingMouseAction(false)" @input="revealRowGapMask">
            <select v-model="rowGap.unit" @mouseover="rowGapSettingMouseAction(true)" @mouseleave="rowGapSettingMouseAction(false)">
              <option v-for="unit in UNITS" :key="unit">{{ unit }}</option>
            </select>
          </div>
        </div>
      </div>
      <div v-else class="units-settings">
        <div>
          <span>Horizontal gap:</span>
          <div class="inputs-area">
            <select v-model="columnGap.value" @mouseover="columnGapSettingMouseAction(true)" @mouseleave="columnGapSettingMouseAction(false)">
              <option value="0">0</option>
              <option :value="nominator" v-for="nominator in nominators" :key="nominator">{{ nominator }}</option>
            </select>
            <span class="separator">/</span>
            <input v-model="ratioDenominator" min="1" type="number" @keypress="validate($event, 'ratioDenominator')" :class="{ error: !ratioDenominator }" @mouseover="columnGapSettingMouseAction(true)" @mouseleave="columnGapSettingMouseAction(false)">
          </div>
        </div>
        <div>
          <span>Vertical gap:</span>
          <div class="inputs-area">
            <select v-model="rowGap.value" @mouseover="rowGapSettingMouseAction(true)" @mouseleave="rowGapSettingMouseAction(false)" @input="revealRowGapMask">
              <option value="0">0</option>
              <option :value="nominator" v-for="nominator in nominators" :key="nominator">{{ nominator }}</option>
            </select>
            <span class="separator">/</span>
            <input v-model="ratioDenominator" min="1" type="number" @keypress="validate($event, 'ratioDenominator')" :class="{ error: !ratioDenominator }" @mouseover="rowGapSettingMouseAction(true)" @mouseleave="rowGapSettingMouseAction(false)" @input="revealRowGapMask">
          </div>
        </div>    
      </div>
      <div v-if="absolute" class="absolute-settings columns">
        <div v-for="(column, index) in columnsNumber" :key="`a${index}`" class="column-settings">
          <p>Column {{ index + 1 }}:</p>
          <div class="column-option">
            <span>Width:</span>
            <div class="inputs-area">
              <input v-model="columnsWidths[index].value" min="0" type="number" @keypress="validate($event, 'width')" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns">
              <select v-model="columnsWidths[index].unit" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns">
                <option v-for="unit in UNITS" :key="unit">{{ unit }}</option>
              </select>
            </div>
          </div>
          <div class="column-option">
            <span>Left offset:</span>
            <div class="inputs-area">
              <input v-model="columnsOffsets[index].left" min="0" type="number" @keypress="validate($event, 'width')" @mouseover="onOffsetSettingMouseAction(index, 'left', true)" @mouseleave="onOffsetSettingMouseAction(index, 'left', false)" @input="revealOffsetMask(index, 'left')">
              <select v-model="columnsOffsets[index].leftUnit" @mouseover="onOffsetSettingMouseAction(index, 'left', true)" @mouseleave="onOffsetSettingMouseAction(index, 'left', false)">
                <option v-for="unit in UNITS" :key="unit">{{ unit }}</option>
              </select>
            </div>
          </div>
          <div class="column-option">
            <span>Right offset:</span>
            <div class="inputs-area">
              <input v-model="columnsOffsets[index].right" min="0" type="number" @keypress="validate($event, 'width')" @mouseover="onOffsetSettingMouseAction(index, 'right', true)" @mouseleave="onOffsetSettingMouseAction(index, 'right', false)" @input="revealOffsetMask(index, 'right')">
              <select v-model="columnsOffsets[index].rightUnit" @mouseover="onOffsetSettingMouseAction(index, 'right', true)" @mouseleave="onOffsetSettingMouseAction(index, 'right', false)">
                <option v-for="unit in UNITS" :key="unit">{{ unit }}</option>
              </select>
            </div>
          </div>
          <div class="column-option">
            <span>Order:</span>
            <select v-model="columnsOrders[index]" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns">
              <option :value="possibleOrder" v-for="(possibleOrder, possibleOrderIndex) in possibleOrders[index]" :key="possibleOrder">{{ possibleOrderIndex }}</option>
            </select>
          </div>
        </div>
      </div>
      <div v-else class="units-settings columns">
        <div v-for="(column, index) in columnsNumber" :key="`u${index}`" class="column-settings">
          <p>Column {{ index + 1 }}:</p>
          <div class="column-option">
            <span>Width:</span>
            <div class="inputs-area">
              <select v-model="columnsRatios[index]" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns">
                <option :value="nominator" v-for="nominator in nominators" :key="nominator">{{ nominator }}</option>
              </select>
              <span class="separator">/</span>
              <input v-model="ratioDenominator" min="1" type="number" @keypress="validate($event, 'ratioDenominator')" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns" :class="{ error: !ratioDenominator }">
            </div>
          </div>
          <div class="column-option">
            <span>Left offset:</span>
            <div class="inputs-area">
              <select v-model="columnsOffsets[index].left" @mouseover="onOffsetSettingMouseAction(index, 'left', true)" @mouseleave="onOffsetSettingMouseAction(index, 'left', false)">
                <option :value="nominator - 1" v-for="nominator in nominators" :key="nominator">{{ nominator - 1 }}</option>
              </select>
              <span class="separator">/</span>
              <input v-model="ratioDenominator" min="1" type="number" @keypress="validate($event, 'ratioDenominator')" :class="{ error: !ratioDenominator }" @mouseover="onOffsetSettingMouseAction(index, 'left', true)" @mouseleave="onOffsetSettingMouseAction(index, 'left', false)" @input="revealOffsetMask(index, 'left')">
            </div>
          </div>
          <div class="column-option">
            <span>Right offset:</span>
            <div class="inputs-area">
              <select v-model="columnsOffsets[index].right" @mouseover="onOffsetSettingMouseAction(index, 'right', true)" @mouseleave="onOffsetSettingMouseAction(index, 'right', false)">
                <option :value="nominator - 1" v-for="nominator in nominators" :key="nominator">{{ nominator - 1 }}</option>
              </select>
              <span class="separator">/</span>
              <input v-model="ratioDenominator" min="1" type="number" @keypress="validate($event, 'ratioDenominator')" @mouseover="onOffsetSettingMouseAction(index, 'right', true)" @mouseleave="onOffsetSettingMouseAction(index, 'right', false)" :class="{ error: !ratioDenominator }" @input="revealOffsetMask(index, 'right')">
            </div>
          </div>
          <div class="column-option">
            <span>Order:</span>
            <select v-model="columnsOrders[index]" @mouseover="highlightColumn([index])" @mouseleave="unhighlightColumns">
              <option :value="possibleOrder" v-for="(possibleOrder, possibleOrderIndex) in possibleOrders[index]" :key="possibleOrder">{{ possibleOrderIndex }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div v-show="false" class="dev-area">
      <p>WIDGET STYLES: {{ widgetStyles }}</p>
      <p>COLUMNS STYLES: {{ columnStyles }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed, nextTick } from 'vue';
import { EnumOffsetType, getMarginProperty } from '../../model/enum/EnumOffsetType';
import { EnumViewportType, isViewportMobile } from '../../model/enum/EnumViewportType';
import { getComputedPropertyValue } from '../../utils/CssUtils';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMonitor, mdiTablet, mdiCellphone } from '@mdi/js';
import './vueFlexColumns.scss';
import type { ColumnElement, Gap } from '../../model/typings';
import { ColumnStyle } from '../../model/ColumnStyle';
import { WidgetStyle } from '../../model/WidgetStyle';
import type * as CSS from 'csstype';
import { EnumJustifyContent } from '../../../../vue-flex-columns/src/model/enum/EnumJustifyContent';
import { OffsetParams } from '../../model/OffsetParams';

const COLUMN_CONTAINER_MARGIN = 5;
const COLUMN_CONTAINER_HEIGHT = 180;
const CONTAINER_PADDING = 10;
const UNITS = ['%', 'px', 'vw', 'vh'];
const columnsNumber = ref(4);
let columnGap: Gap = reactive({ value: 0, unit: '%' });
let rowGap: Gap = reactive({ value: 0, unit: '%' });
let columnsWidths = reactive({ 0: { value: 25, unit: '%' }, 1: { value: 25, unit: '%' }, 2: { value: 25, unit: '%' }, 3: { value: 25, unit: '%' } });
let columnsRatios = reactive({ 0: 1, 1: 1, 2: 1, 3: 1 });
let columnsOffsets = reactive({ 0: { left: 0, leftUnit: '%', right: 0, rightUnit: '%' }, 1: { left: 0, leftUnit: '%', right: 0, rightUnit: '%' }, 2: { left: 0, leftUnit: '%', right: 0, rightUnit: '%' }, 3: { left: 0, leftUnit: '%', right: 0, rightUnit: '%' } });
let ratioDenominator = ref(12);
let columnsOrders = reactive({ 0: 1, 1: 2, 2: 3, 3: 4 });
let alignment = reactive({ left: true, right: false, center: false, between: false });
let absolute = ref(true);
let columnsHighlight = reactive({ 0: false, 1: false, 2: false, 3: false });
let offsetHighlightMasks = reactive({});
let columnGapHiglightMasks = reactive({});
let rowGapHighlightMasks = reactive({});
let columnResizeIndicators = reactive({});
let rowsNumber = ref(1);
let viewportType = ref(EnumViewportType.DESKTOP);

function created(): void {
  console.log('created');
}

setColumnsParameters();

watch([columnsNumber, absolute, viewportType], () => {
  setColumnsParameters();
});

watch([columnsNumber, absolute, rowGap, columnGap, columnsWidths, columnsRatios, columnsOffsets, ratioDenominator, columnsOrders, alignment, viewportType], () => {
  nextTick(() => {
      setOffsetMasksStyles(EnumOffsetType.LEFT);
      setOffsetMasksStyles(EnumOffsetType.RIGHT);
      setGapMasksStyles();
      setResizeIndicatorsStyles();
  })
}, { deep: true, immediate: true });

function setColumnsParameters(): void {
  const columnsWidthsArray = [];
  const columnsRatiosArray = [];
  const columnsOffsetsArray = [];
  const columnsOrdersArray = [];
  const columnsHighlightArray = [];
  const offsetHighlightMasksArray = [];
  const columnGapHighlightMasksArray = [];
  const rowGapHighlightMasksArray = [];
  const columnResizeIndicatorsArray = [];
  let i = 0;

  while (i < columnsNumber.value) {
    columnsWidthsArray.push({ col: i, val: { value: !isViewportMobile(viewportType.value) ? 100 / columnsNumber.value : 100, unit: '%' } });
    columnsRatiosArray.push({ col: i, val: !isViewportMobile(viewportType.value) ? 1 : ratioDenominator.value });
    columnsOffsetsArray.push({ col: i, val: { left: 0, leftUnit: '%', right: 0, rightUnit: '%' } });
    columnsOrdersArray.push({ col: i, val: i + 1 });
    columnsHighlightArray.push({ col: i, val: false });
    offsetHighlightMasksArray.push({ col: i, val: { left: {}, right: {} } });
    columnGapHighlightMasksArray.push({ col: i, val: {} });
    columnResizeIndicatorsArray.push({ col: i, val: {} });
    i++;
  }

  let j = 0;
  while (j < rowsNumber.value) {
    rowGapHighlightMasksArray.push({ row: j, val: {} });
    j++;
  }

  for (const key of columnsWidthsArray) {
    columnsWidths[key.col] = key.val;
  }

  for (const key of columnsRatiosArray) {
    columnsRatios[key.col] = key.val;
  }

  for (const key of columnsOffsetsArray) {
    columnsOffsets[key.col] = key.val;
  }

  for (const key of columnsOrdersArray) {
    columnsOrders[key.col] = key.val;
  }

  for (const key of columnsHighlightArray) {
    columnsHighlight[key.col] = key.val;
  }

  for (const key of offsetHighlightMasksArray) {
    offsetHighlightMasks[key.col] = key.val;
  }

  for (const key of columnGapHighlightMasksArray) {
    columnGapHiglightMasks[key.col] = key.val;
  }

  for (const key of rowGapHighlightMasksArray) {
    rowGapHighlightMasks[key.row] = key.val;
  }

  for (const key of columnResizeIndicatorsArray) {
    columnResizeIndicators[key.col] = key.val;
  }

  rowGap.value = 0;
  rowGap.unit = '%';
  columnGap.value = 0;
  columnGap.unit = '%';
  ratioDenominator.value = 12;
}

const columnStyles = computed({
  get() {
    return generateColumnStyles();
  },
  set() {}
});

const widgetStyles = computed({
  get() {
    return generateWidgetStyles();
  },
  set() {}
});

function generateColumnStyles(): { [key: number]: ColumnStyle } {
  let columnStyles = {};
  const columnStylesArray = [];
  let i = 0
  while (i < columnsNumber.value) {
    const width = absolute.value
      ? `calc(${columnsWidths[i].value || 0}${columnsWidths[i].unit} - ${2 * COLUMN_CONTAINER_MARGIN}px)`
      : `calc(${columnsRatios[i]} / ${ratioDenominator.value} * 100% - ${2 * COLUMN_CONTAINER_MARGIN}px)`;
    const offsetLeft = absolute.value
      ? `calc(${columnsOffsets[i].left || 0}${columnsOffsets[i].leftUnit} + ${COLUMN_CONTAINER_MARGIN}px)`
      : `calc(${(columnsOffsets[i].left || 0) / ratioDenominator.value * 100}% + ${COLUMN_CONTAINER_MARGIN}px)`; 
    const offsetRight = absolute.value
      ? `calc(${columnsOffsets[i].right || 0}${columnsOffsets[i].rightUnit} + ${COLUMN_CONTAINER_MARGIN}px)`
      : `calc(${(columnsOffsets[i].right || 0) / ratioDenominator.value * 100}% + ${COLUMN_CONTAINER_MARGIN}px)`;
    columnStylesArray.push({ col: i, val: { width, order: columnsOrders[i], marginLeft: offsetLeft, marginRight: offsetRight } }) ;
    i++;
  }

  for (const key of columnStylesArray) {
    columnStyles[key.col] = new ColumnStyle(key.val);
  }

  return columnStyles;
}

function generateWidgetStyles(): WidgetStyle {
  return new WidgetStyle({
    columnGap: absolute.value ? `${columnGap.value || 0}${columnGap.unit}` : `${(columnGap.value || 0) / ratioDenominator.value * 100}%`,
    rowGap: absolute.value ? `${rowGap.value || 0}${rowGap.unit}` : `${(rowGap.value || 0) / ratioDenominator.value * 100}%`,
    justifyContent: setJustifyContent(),
  });
}

function setJustifyContent(): CSS.Property.JustifyContent {
  if (alignment.left) {
    return EnumJustifyContent.FLEX_START;
  }

  if (alignment.right) {
    return EnumJustifyContent.FLEX_END;
  }

  if (alignment.center) {
    return EnumJustifyContent.CENTER;
  }

  if (alignment.between) {
    return EnumJustifyContent.SPACE_BETWEEN;
  }

  return EnumJustifyContent.FLEX_START;
}

function validate(e: KeyboardEvent, property: string): boolean {
  const event: any = e || window.event;
  let validationError = false;
  switch (property) {
    case 'columnsNumber':
      validationError = !(/\d/g).test(event.key) || Number(event.key) < 1;
      break;
    case 'gap':
      validationError = !(/\d/g).test(event.key) || Number(event.key) < 0;
      break;
    case 'ratioDenominator':
      validationError = !(/\d/g).test(event.key) || Number(event.key) < 1;
      break;
    case 'width':
      validationError = !(/\d|\./g).test(event.key) || Number(event.key) < 0;
      break;
    case 'order':
      validationError = !(/\d/g).test(event.key);
      break;
  }

  if (validationError) {
    e.preventDefault();
  } else {
    return true;
  }
}

const nominators = computed({
  get() {
    const nominators = [];
    let i = 0;
    while (i <= ratioDenominator.value) {
      nominators.push(i);
      i++;
    }

    return nominators;
  },
  set () {}
});

const possibleOrders = computed({
  get() {
    const possibleOrders = {};
    let i = 0;
    while (i < columnsNumber.value) {
      let j = 0;
      while (j <= columnsNumber.value) {
        if (j === 0) {
          possibleOrders[i] = [j];
        } else {
          possibleOrders[i].push(j);
        }
        j++;
      }
      i++;
    }

    return possibleOrders;
  },
  set () {}
});

function setAlignment(position: string) {
  alignment.left = false;
  alignment.right = false;
  alignment.center = false;
  alignment.between = false;
  alignment[position] = true;
}

function highlightColumn(indexes?: number[]): void {
  unhighlightColumns();
  if (!indexes) {
    let i = 0;
    while (i < columnsNumber.value) {
      columnsHighlight[i] = true;
      i++;
    }

    return;
  }

  indexes.forEach(index => {
    columnsHighlight[index] = true;
  });
}

function unhighlightColumns(): void {
  Array.from(Object.keys(columnsHighlight)).forEach(key => {
    columnsHighlight[key] = false;
  });
}

function setOffsetMasksStyles(type: EnumOffsetType): void {
  const containerElement = document.querySelector('.widget-columns');
  const containerRect = containerElement.getBoundingClientRect();

  let index = 0;
  while (index < columnsNumber.value) {
    const offsetValue = absolute.value
      ? columnsOffsets[index][type]
      : columnsOffsets[index][type] / ratioDenominator.value * 100;
    
    const columnElement = document.querySelector(`.column-container[column="${index}"]`);
    const columnRect = columnElement.getBoundingClientRect();
    const margin = getComputedPropertyValue(columnElement, getMarginProperty(type));
    const filled = Number(offsetValue) > 0;

    setOffsetParams(offsetHighlightMasks[index][type], new OffsetParams({
      show: false,
      top: `${columnRect.top - containerRect.top}px`,
      left: type === 'left'
        ? `${columnRect.left - containerRect.left - margin}px`
        : `${columnRect.left - containerRect.left + columnRect.width + (filled && margin > COLUMN_CONTAINER_MARGIN ? COLUMN_CONTAINER_MARGIN : 0)}px`,
      height: `${columnRect.height}px`,
      width: filled && margin > COLUMN_CONTAINER_MARGIN ? `${margin - COLUMN_CONTAINER_MARGIN}px` : `${COLUMN_CONTAINER_MARGIN}px`,
      filled,
    }));

    index++;
  }
}

function setGapMasksStyles(): void {
  const containerElement = document.querySelector('.widget-columns');
  const containerPaddingLeft = getComputedPropertyValue(containerElement, 'padding-left', 0);
  const containerPaddingRight = getComputedPropertyValue(containerElement, 'padding-right', 0);
  const containerPaddingTop = getComputedPropertyValue(containerElement, 'padding-top', 0);
  const containerPaddingBottom = getComputedPropertyValue(containerElement, 'padding-bottom', 0);
  const containerRect = containerElement.getBoundingClientRect();
  const containerWidth = containerRect.width - containerPaddingLeft - containerPaddingRight;
  const containerHeight = containerRect.height - containerPaddingTop - containerPaddingBottom;
  const columnGapValue = getComputedPropertyValue(containerElement, 'column-gap', containerWidth);
  const rowGapValue = getComputedPropertyValue(containerElement, 'row-gap', containerHeight);
  let columnsElements: ColumnElement[] = Array.from(document.querySelectorAll('.widget-columns .column-container'));
  columnsElements = columnsElements.sort((a, b) => Number(getComputedStyle(a)['order']) - Number(getComputedStyle(b)['order']));
  let summaryWidthPerRow = 0;
  let rowsCount = 0;

  columnsElements.forEach((column, index) => {
    const columnRect = column.getBoundingClientRect();
    const columnMarginRight = getComputedPropertyValue(column, 'margin-right', 0);
    const columnMargins = getComputedPropertyValue(column, 'margin-left', 0) + columnMarginRight;
    const nextColumnWidth = index < columnsElements.length - 1 ? columnsElements[index + 1].getBoundingClientRect().width : 0;
    const nextColumnMargin = index < columnsElements.length - 1 ? getComputedPropertyValue(columnsElements[index + 1], 'margin-left', 0) +  getComputedPropertyValue(columnsElements[index + 1], 'margin-right') : 0;
    summaryWidthPerRow += columnRect.width + columnGapValue + columnMargins;
    const isLastInRow = summaryWidthPerRow + nextColumnWidth + nextColumnMargin > containerWidth || index === columnsElements.length - 1;
    const columnIndex = column.attributes.column.value;
    columnGapHiglightMasks[columnIndex] = {
      display: !isLastInRow,
      show: false,
      top: `${columnRect.top - containerRect.top}px`,
      left: `${columnRect.left - containerRect.left + columnRect.width + columnMarginRight}px`,
      height: `${columnRect.height}px`,
      width: `${columnGapValue}px`,
      filled: columnGap.value > 0,
      hovered: columnGapHiglightMasks[columnIndex].hovered || false,
    };

    summaryWidthPerRow = !isLastInRow ? summaryWidthPerRow : 0;
    rowsCount += !isLastInRow ? 0 : 1;
  });

  rowsNumber.value = rowsCount;
  let rowIndex = 0;
  while (rowIndex < rowsNumber.value) {
    rowGapHighlightMasks[rowIndex] = {
      display: rowIndex !== rowsNumber.value - 1 && rowsNumber.value !== 1,
      show: false,
      top: `${containerPaddingTop + (rowIndex + 1) * (COLUMN_CONTAINER_HEIGHT + 2 * COLUMN_CONTAINER_MARGIN) + (rowIndex > 0 ? rowGapValue * rowIndex : 0)}px`,
      height: rowGap.unit !== '%' ? `${rowGapValue}px` : 0,
      filled: rowGap.value > 0,
    }
    
    rowIndex++;
  }
}

function markOffsetMask(index: number, type: EnumOffsetType): void {
  unMarkOffsetHighlightMasks();
  offsetHighlightMasks[index][type].show = true;
}

function onOffsetSettingMouseAction(index: number, type: EnumOffsetType, hovered: boolean) {
  offsetHighlightMasks[index][type].hovered = hovered;
  hovered ? markOffsetMask(index, type) : unMarkOffsetHighlightMasks();
}

function columnGapSettingMouseAction(hovered: boolean) {
  let index = 0;
  while (index < columnsNumber.value) {
    columnGapHiglightMasks[index].show = hovered;
    columnGapHiglightMasks[index].hovered = hovered;
    index++;
  }
}

function rowGapSettingMouseAction(hovered: boolean) {
  let index = 0;
  while (index < rowsNumber.value) {
    rowGapHighlightMasks[index].show = hovered;
    rowGapHighlightMasks[index].hovered = hovered;
    index++;
  }
}

function revealColumnGapMask(): void {
  let index = 0;
  while (index < columnsNumber.value) {
    columnGapHiglightMasks[index].show = true;
    index++;
  }

  setTimeout(() => {
    if (!columnGapHiglightMasks[0].hovered) {
      columnGapSettingMouseAction(false);
    }
  }, 500);
}

function revealRowGapMask(): void {
  let index = 0;
  while (index < rowsNumber.value) {
    rowGapHighlightMasks[index].show = true;
    index++;
  }

  setTimeout(() => {
    if (!rowGapHighlightMasks[0].hovered) {
      rowGapSettingMouseAction(false);
    }
  }, 500);
}

function revealOffsetMask(index: number, type: EnumOffsetType): void {
  markOffsetMask(index, type);
  setTimeout(() => {
    if (!offsetHighlightMasks[index][type].hovered) {
      unMarkOffsetHighlightMasks();
    }
  }, 500);
}

function setResizeIndicatorsStyles(): void {
    const containerElement = document.querySelector('.widget-columns');
    const containerRect = containerElement.getBoundingClientRect();
    let columnsElements = Array.from(document.querySelectorAll('.widget-columns .column-container'));
    columnsElements = columnsElements.sort((a, b) => Number(getComputedStyle(a)['order']) - Number(getComputedStyle(b)['order']));

    columnsElements.forEach((column, index) => {
      const columnRect = column.getBoundingClientRect();
      columnResizeIndicators[index] = {
        left: `${columnRect.left + columnRect.width - containerRect.left + 3}px`,
        top: `${columnRect.top - containerRect.top}px`,
        column,
        duringDrag: columnResizeIndicators[index].duringDrag || false,
      };
    });
}

function onIndicatorMouseDown(event: MouseEvent, index: number): void {
  const containerElement = document.querySelector('.widget-columns');
  columnResizeIndicators[index].duringDrag = true;
  let removeEventListener = false;

  function onIndicatorMove(e: MouseEvent): void {
    columnResizeIndicators[index].duringDrag = e.buttons;
    if (!columnResizeIndicators[index].duringDrag || removeEventListener) {
      containerElement.removeEventListener('mousemove', onIndicatorMove);
      columnResizeIndicators[index].duringDrag = false;
    }

    removeEventListener = !resizeColumn(e, index, containerElement);
  }

  containerElement.addEventListener('mousemove', onIndicatorMove);
}

function onIndicatorMouseUp(event: MouseEvent, index: number): void {
  const containerElement = document.querySelector('.widget-columns');
  columnResizeIndicators[index].duringDrag = false;
  let removeEventListener = false;

  function onIndicatorMove(e: MouseEvent): void {
    columnResizeIndicators[index].duringDrag = e.buttons;
    if (!columnResizeIndicators[index].duringDrag || removeEventListener) {
      containerElement.removeEventListener('mousemove', onIndicatorMove);
      columnResizeIndicators[index].duringDrag = false;
    }

    removeEventListener = !resizeColumn(e, index, containerElement);
  }

  if (!columnResizeIndicators[index].duringDrag || removeEventListener) {
    containerElement.removeEventListener('mousemove', onIndicatorMove);
  }
}

function resizeColumn(e: MouseEvent, index: number, containerElement: Element): boolean {
  const positionOfColumn = columnResizeIndicators[index].column.getBoundingClientRect().right + COLUMN_CONTAINER_MARGIN;
  const containerWidth = containerElement.getBoundingClientRect().width;
  const containerRight = containerElement.getBoundingClientRect().right;
  columnResizeIndicators[index].deltaX = e.clientX - positionOfColumn;

  if (!absolute.value) {
    return resizeRatiosColumn(index, containerWidth);
  }

  return resizeAbsoluteColumn(index, positionOfColumn, containerElement, containerWidth, containerRight);
}

function resizeAbsoluteColumn(index: number, positionOfColumn: number, containerElement: Element, containerWidth: number, containerRight: number): boolean {
  const deltaX = calculateDeltaX(index, containerElement);
  const predictedWidth = columnsWidths[index].value + deltaX.actual;
  const predictedRight = positionOfColumn + deltaX.computed;
 
  if (Math.floor(predictedWidth) < 0) {
    columnsWidths[index].value = 0;
    return true;
  }

  if (columnsWidths[index].unit !== 'px' && predictedRight >= containerRight - CONTAINER_PADDING) {
    return true;
  }

  if (columnsWidths[index].unit !== 'px' && Math.floor(predictedWidth) >= 100) {
    columnsWidths[index].value = 100;
    return true;
  }

  if (Math.floor(predictedWidth) >= containerWidth || predictedRight >= containerRight - CONTAINER_PADDING) {
    columnsWidths[index].value = containerWidth;
    return true;
  }
  
  columnsWidths[index].value += deltaX.actual;

  return true;
}

function resizeRatiosColumn(index: number, containerWidth: number): boolean {
    const ratioGap = containerWidth / ratioDenominator.value;
    if (Math.abs(columnResizeIndicators[index].deltaX) < 0 || Math.abs(columnResizeIndicators[index].deltaX) > containerWidth) {
      return true;
    }

    if (Math.abs(columnResizeIndicators[index].deltaX) > ratioGap) {
      columnsRatios[index] = columnResizeIndicators[index].deltaX > 0 ? columnsRatios[index] + 1 : columnsRatios[index] - 1;
    }

    return true;
}

function calculateDeltaX(index: number, containerElement: Element) {
  switch (columnsWidths[index].unit) {
    case 'px':
      return {
        actual: columnResizeIndicators[index].deltaX,
        computed: columnResizeIndicators[index].deltaX
      };
    case '%': {
      const containerWidth = containerElement.getBoundingClientRect().width;
      const actual = (columnResizeIndicators[index].deltaX / containerWidth) * 100; 
      return { 
        actual,
        computed: (actual / 100) * containerWidth
      };
    }
    case 'vw': {
      const viewPortWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const actual = (columnResizeIndicators[index].deltaX / viewPortWidth) * 100; 
      return {
        actual,
        computed: (actual / 100) * viewPortWidth
      };
    }
    case 'vh': {
      const viewPortHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const actual = (columnResizeIndicators[index].deltaX / viewPortHeight) * 100;
      return {
        actual,
        computed: (actual / 100) * viewPortHeight
      };
    }
    default:
      return {
        actual: 0,
        computed: 0
      };
  }
}

function setOffsetParams(offsetParams: OffsetParams, params: OffsetParams): void {
  offsetParams.show = params.show;
  offsetParams.top = params.top;
  offsetParams.left = params.left;
  offsetParams.height = params.height;
  offsetParams.width = params.width;
  offsetParams.filled = params.filled;
}

function unMarkOffsetHighlightMasks(): void {
  Object.keys(offsetHighlightMasks).forEach(key => {
    offsetHighlightMasks[key][EnumOffsetType.LEFT].show = false;
    offsetHighlightMasks[key][EnumOffsetType.RIGHT].show = false;
  });
}

function setViewportType(type: EnumViewportType): void {
  viewportType.value = type;
}
</script>


