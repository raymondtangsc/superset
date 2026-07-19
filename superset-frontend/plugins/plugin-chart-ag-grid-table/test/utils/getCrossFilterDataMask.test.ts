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
import { DTTM_ALIAS, TimeGranularity } from '@superset-ui/core';
import {
  buildSelectionCrossFilterDataMask,
  getCrossFilterDataMask,
} from '../../src/utils/getCrossFilterDataMask';

const timestampFormatter = (value: unknown) => `formatted:${String(value)}`;

test('buildSelectionCrossFilterDataMask returns a cleared mask for no values', () => {
  const result = buildSelectionCrossFilterDataMask({
    key: 'name',
    values: [],
    timestampFormatter,
  });
  expect(result).toEqual({
    dataMask: {
      extraFormData: { filters: [] },
      filterState: { label: null, value: null, filters: null },
    },
  });
});

test('buildSelectionCrossFilterDataMask builds an IN filter for the selected values', () => {
  const result = buildSelectionCrossFilterDataMask({
    key: 'country',
    values: ['US', 'CA'],
    timestampFormatter,
  });
  expect(result.dataMask.extraFormData.filters).toEqual([
    { col: 'country', op: 'IN', val: ['US', 'CA'], grain: undefined },
  ]);
  expect(result.dataMask.filterState).toEqual({
    label: 'US, CA',
    value: [['US', 'CA']],
    filters: { country: ['US', 'CA'] },
  });
});

test('buildSelectionCrossFilterDataMask formats timestamps and adds the grain', () => {
  const result = buildSelectionCrossFilterDataMask({
    key: DTTM_ALIAS,
    values: [123],
    timeGrain: TimeGranularity.DAY,
    timestampFormatter,
  });
  expect(result.dataMask.extraFormData.filters).toEqual([
    { col: DTTM_ALIAS, op: 'IN', val: [123], grain: TimeGranularity.DAY },
  ]);
  expect(result.dataMask.filterState.label).toBe('formatted:123');
});

test('buildSelectionCrossFilterDataMask converts Date values to timestamps', () => {
  const date = new Date('2021-01-01T00:00:00Z');
  const result = buildSelectionCrossFilterDataMask({
    key: 'created',
    values: [date],
    timestampFormatter,
  });
  expect(result.dataMask.extraFormData.filters[0].val).toEqual([
    date.getTime(),
  ]);
});

test('getCrossFilterDataMask selects a new value when none is active', () => {
  const isActiveFilterValue = () => false;
  const result = getCrossFilterDataMask({
    key: 'country',
    value: 'US',
    filters: {},
    isActiveFilterValue,
    timestampFormatter,
  });
  expect(result.isCurrentValueSelected).toBe(false);
  expect(result.dataMask.extraFormData.filters).toEqual([
    { col: 'country', op: 'IN', val: ['US'], grain: undefined },
  ]);
  expect(result.dataMask.filterState).toEqual({
    label: 'US',
    value: [['US']],
    filters: { country: ['US'] },
  });
});

test('getCrossFilterDataMask clears the filter when the value is already active', () => {
  const isActiveFilterValue = () => true;
  const result = getCrossFilterDataMask({
    key: 'country',
    value: 'US',
    filters: { country: ['US'] },
    isActiveFilterValue,
    timestampFormatter,
  });
  expect(result.isCurrentValueSelected).toBe(true);
  expect(result.dataMask.extraFormData.filters).toEqual([]);
  expect(result.dataMask.filterState).toEqual({
    label: '',
    value: null,
    filters: null,
  });
});

test('getCrossFilterDataMask formats timestamp labels and sets the grain', () => {
  const result = getCrossFilterDataMask({
    key: DTTM_ALIAS,
    value: 999,
    filters: {},
    timeGrain: TimeGranularity.MONTH,
    isActiveFilterValue: () => false,
    timestampFormatter,
  });
  expect(result.dataMask.filterState.label).toBe('formatted:999');
  expect(result.dataMask.extraFormData.filters).toEqual([
    { col: DTTM_ALIAS, op: 'IN', val: [999], grain: TimeGranularity.MONTH },
  ]);
});
