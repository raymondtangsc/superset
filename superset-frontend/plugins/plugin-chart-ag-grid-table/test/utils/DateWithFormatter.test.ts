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
import DateWithFormatter from '../../src/utils/DateWithFormatter';

test('is an instance of Date', () => {
  const date = new DateWithFormatter(0);
  expect(date).toBeInstanceOf(Date);
});

test('retains the original input value', () => {
  const date = new DateWithFormatter(1609459200000);
  expect(date.input).toBe(1609459200000);
  expect(date.getTime()).toBe(1609459200000);
});

test('normalizes string timestamps as UTC', () => {
  const date = new DateWithFormatter('2021-01-01T00:00:00');
  expect(date.getTime()).toBe(Date.UTC(2021, 0, 1));
  expect(date.input).toBe('2021-01-01T00:00:00');
});

test('default formatter stringifies the original input', () => {
  const date = new DateWithFormatter('not-a-real-date');
  expect(date.toString()).toBe('not-a-real-date');
});

test('preserves null input and stringifies it via the default formatter', () => {
  const date = new DateWithFormatter(null);
  expect(date.input).toBeNull();
  expect(date.toString()).toBe('null');
});

test('uses a custom formatter for toString', () => {
  const formatter = jest.fn(() => 'CUSTOM');
  const date = new DateWithFormatter(0, { formatter });
  expect(date.toString()).toBe('CUSTOM');
  expect(formatter).toHaveBeenCalledWith(date);
});
