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
import filterValueGetter from '../../src/utils/filterValueGetter';

const buildParams = (
  raw: unknown,
  formatter?: (params: { value: unknown }) => unknown,
) =>
  ({
    data: { amount: raw },
    colDef: { field: 'amount', valueFormatter: formatter },
  }) as any;

test('returns the numeric value produced by the formatter', () => {
  const result = filterValueGetter(
    buildParams(1234, ({ value }) => `${value}`),
  );
  expect(result).toBe(1234);
});

test('strips a percent sign and surrounding whitespace before parsing', () => {
  const result = filterValueGetter(buildParams(0.42, () => '  42% '));
  expect(result).toBe(42);
});

test('parses the leading number out of a formatted currency string', () => {
  const result = filterValueGetter(buildParams(1000, () => '1000.5 USD'));
  expect(result).toBe(1000.5);
});

test('returns null when the raw value is falsy', () => {
  expect(filterValueGetter(buildParams(0, () => '0'))).toBeNull();
  expect(filterValueGetter(buildParams(null, () => 'x'))).toBeNull();
  expect(filterValueGetter(buildParams(undefined, () => 'x'))).toBeNull();
});

test('returns null when no formatter is defined', () => {
  expect(filterValueGetter(buildParams(123, undefined))).toBeNull();
});

test('returns null when the formatted value is not numeric', () => {
  expect(
    filterValueGetter(buildParams('abc', () => 'not a number')),
  ).toBeNull();
});
