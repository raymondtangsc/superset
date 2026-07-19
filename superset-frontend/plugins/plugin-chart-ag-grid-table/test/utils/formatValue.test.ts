/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { GenericDataType } from '@apache-superset/core/common';
import type { DataRecordValue } from '@superset-ui/core';
import {
  formatColumnValue,
  valueFormatter,
  valueGetter,
} from '../../src/utils/formatValue';
import DateWithFormatter from '../../src/utils/DateWithFormatter';

const numericColumn = {
  key: 'metric',
  label: 'metric',
  dataType: GenericDataType.Numeric,
  config: {},
} as any;

const stringColumn = {
  key: 'name',
  label: 'name',
  dataType: GenericDataType.String,
  config: {},
} as any;

test('formatColumnValue renders undefined as an empty string', () => {
  expect(
    formatColumnValue(stringColumn, undefined as unknown as DataRecordValue),
  ).toEqual([false, '']);
});

test('formatColumnValue renders null as N/A', () => {
  expect(formatColumnValue(stringColumn, null)).toEqual([false, 'N/A']);
});

test('formatColumnValue renders a null-input DateWithFormatter as N/A', () => {
  const date = new DateWithFormatter(null);
  expect(formatColumnValue(stringColumn, date)).toEqual([false, 'N/A']);
});

test('formatColumnValue applies the column formatter when present', () => {
  const column = {
    ...numericColumn,
    formatter: (v: number) => `$${v}`,
  } as any;
  expect(formatColumnValue(column, 100)).toEqual([false, '$100']);
});

test('formatColumnValue passes through plain strings', () => {
  expect(formatColumnValue(stringColumn, 'hello')).toEqual([false, 'hello']);
});

test('formatColumnValue sanitizes HTML strings and flags them', () => {
  const [isHtml, output] = formatColumnValue(stringColumn, '<b>bold</b>');
  expect(isHtml).toBe(true);
  expect(output).toContain('<b>');
});

test('formatColumnValue stringifies other primitive values', () => {
  expect(formatColumnValue(stringColumn, 123)).toEqual([false, '123']);
  expect(formatColumnValue(stringColumn, true)).toEqual([false, 'true']);
});

test('formatColumnValue uses the small-number formatter for |value| < 1', () => {
  const column = {
    ...numericColumn,
    formatter: (v: number) => `default:${v}`,
    config: { d3SmallNumberFormat: '.2%' },
  } as any;
  const [, output] = formatColumnValue(column, 0.1234);
  // the small number format ('.2%') is applied instead of the default formatter
  expect(output).toBe('12.34%');
});

test('valueFormatter returns the formatted value when defined and non-empty', () => {
  const col = { formatter: (v: number) => `#${v}` } as any;
  expect(valueFormatter({ value: 5 } as any, col)).toBe('#5');
});

test('valueFormatter falls back to the raw value when no formatter exists', () => {
  const col = {} as any;
  expect(valueFormatter({ value: 'raw' } as any, col)).toBe('raw');
});

test('valueFormatter returns an empty string for grand total rows (level -1)', () => {
  const col = {} as any;
  expect(valueFormatter({ value: '', node: { level: -1 } } as any, col)).toBe(
    '',
  );
});

test('valueFormatter returns N/A for undefined values in normal rows', () => {
  const col = {} as any;
  expect(
    valueFormatter({ value: undefined, node: { level: 0 } } as any, col),
  ).toBe('N/A');
});

test('valueGetter reads the "Main" prefixed column for isMain columns', () => {
  const params = {
    colDef: { isMain: true },
    column: { getColId: () => 'revenue' },
    data: { 'Main revenue': 42 },
  } as any;
  expect(valueGetter(params, {} as any)).toBe(42);
});

test('valueGetter returns the column value when it is defined', () => {
  const params = {
    colDef: {},
    column: { getColId: () => 'revenue' },
    data: { revenue: 7 },
  } as any;
  expect(valueGetter(params, {} as any)).toBe(7);
});

test('valueGetter returns undefined for missing numeric column values', () => {
  const params = {
    colDef: {},
    column: { getColId: () => 'revenue' },
    data: {},
  } as any;
  expect(valueGetter(params, { isNumeric: true } as any)).toBeUndefined();
});

test('valueGetter returns an empty string for missing non-numeric column values', () => {
  const params = {
    colDef: {},
    column: { getColId: () => 'name' },
    data: {},
  } as any;
  expect(valueGetter(params, { isNumeric: false } as any)).toBe('');
});
