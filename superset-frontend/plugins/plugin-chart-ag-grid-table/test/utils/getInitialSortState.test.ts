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
import type { GridState } from '@superset-ui/core/components/ThemedAgGridReact';
import getInitialSortState, {
  shouldSort,
} from '../../src/utils/getInitialSortState';

test('returns an empty array when sortBy is undefined', () => {
  expect(getInitialSortState()).toEqual([]);
});

test('returns an empty array when sortBy is empty', () => {
  expect(getInitialSortState([])).toEqual([]);
});

test('maps a descending sortBy item to a desc sort model', () => {
  expect(
    getInitialSortState([{ id: 'revenue', key: 'revenue', desc: true }]),
  ).toEqual([{ colId: 'revenue', sort: 'desc' }]);
});

test('maps a non-descending sortBy item to an asc sort model', () => {
  expect(
    getInitialSortState([{ id: 'name', key: 'name', desc: false }]),
  ).toEqual([{ colId: 'name', sort: 'asc' }]);
});

test('only uses the first sortBy item', () => {
  const result = getInitialSortState([
    { id: 'a', key: 'a', desc: true },
    { id: 'b', key: 'b', desc: false },
  ]);
  expect(result).toEqual([{ colId: 'a', sort: 'desc' }]);
});

const emptyGridState = {} as GridState;

test('shouldSort returns false for percent metrics', () => {
  expect(
    shouldSort({
      colId: 'pct',
      sortDir: 'asc',
      percentMetrics: ['pct'],
      serverPagination: true,
      gridInitialState: emptyGridState,
    }),
  ).toBe(false);
});

test('shouldSort returns false when server pagination is disabled', () => {
  expect(
    shouldSort({
      colId: 'name',
      sortDir: 'asc',
      percentMetrics: [],
      serverPagination: false,
      gridInitialState: emptyGridState,
    }),
  ).toBe(false);
});

test('shouldSort returns false when the sort matches the initial grid sort', () => {
  const gridInitialState = {
    sort: { sortModel: [{ colId: 'name', sort: 'asc' }] },
  } as unknown as GridState;
  expect(
    shouldSort({
      colId: 'name',
      sortDir: 'asc',
      percentMetrics: [],
      serverPagination: true,
      gridInitialState,
    }),
  ).toBe(false);
});

test('shouldSort returns true when the sort differs from the initial grid sort', () => {
  const gridInitialState = {
    sort: { sortModel: [{ colId: 'name', sort: 'asc' }] },
  } as unknown as GridState;
  expect(
    shouldSort({
      colId: 'name',
      sortDir: 'desc',
      percentMetrics: [],
      serverPagination: true,
      gridInitialState,
    }),
  ).toBe(true);
});

test('shouldSort returns true when there is no initial grid sort', () => {
  expect(
    shouldSort({
      colId: 'name',
      sortDir: 'asc',
      percentMetrics: [],
      serverPagination: true,
      gridInitialState: emptyGridState,
    }),
  ).toBe(true);
});
