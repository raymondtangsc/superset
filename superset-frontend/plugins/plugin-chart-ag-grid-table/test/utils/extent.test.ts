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
import extent from '../../src/utils/extent';

test('returns [undefined, undefined] for an empty array', () => {
  expect(extent([])).toEqual([undefined, undefined]);
});

test('returns min and max for a list of numbers', () => {
  expect(extent([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 9]);
});

test('handles a single element', () => {
  expect(extent([42])).toEqual([42, 42]);
});

test('handles negative numbers', () => {
  expect(extent([-5, -1, -10, -3])).toEqual([-10, -1]);
});

test('ignores null values', () => {
  expect(extent([null, 5, null, 2, null])).toEqual([2, 5]);
});

test('ignores undefined values', () => {
  expect(extent([undefined, 8, undefined, 3])).toEqual([3, 8]);
});

test('returns [undefined, undefined] when every value is null or undefined', () => {
  expect(extent([null, undefined, null])).toEqual([undefined, undefined]);
});

test('uses the first defined value to seed both min and max', () => {
  // leading nulls should not prevent the first real value from seeding min/max
  expect(extent([null, null, 7])).toEqual([7, 7]);
});

test('computes lexicographic extent for strings', () => {
  expect(extent(['banana', 'apple', 'cherry'])).toEqual(['apple', 'cherry']);
});

test('computes extent for Date values', () => {
  const early = new Date('2020-01-01');
  const mid = new Date('2021-06-15');
  const late = new Date('2022-12-31');
  expect(extent([mid, late, early])).toEqual([early, late]);
});
