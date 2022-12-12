/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import parseJson from '../../../utils/parseJson';
import {
  isFloat,
  isDataElementToken,
  isObject,
  isInteger
} from '../../../utils/validators';

export default ({
  eventJsonPairs = [],
  eventType,
  eventRaw,
  fieldsJsonPairs = [],
  fieldsType,
  fieldsRaw,
  time
}) => {
  const errors = {};

  if (eventType === 'raw') {
    if (!eventRaw) {
      errors.eventRaw = 'Please provide an event';
    }
  } else if (eventJsonPairs.length === 1 && !eventJsonPairs[0].key) {
    errors[`eventJsonPairs.0.key`] = 'Please provide a key name.';
  } else {
    eventJsonPairs.forEach((q, index) => {
      if (!q.key && q.value) {
        errors[`eventJsonPairs.${index}.key`] = 'Please provide a key name.';
      }
    });
  }

  if (
    time &&
    !(isFloat(Number(time)) || isInteger(Number(time))) &&
    !isDataElementToken(time)
  ) {
    errors.time = 'Please provide a Unix timestamp or a data element.';
  }

  if (fieldsType === 'raw' && fieldsRaw) {
    const { result, parsedJson } = parseJson(fieldsRaw);

    if (
      !result ||
      !isObject(parsedJson) ||
      Object.keys(parsedJson).length === 0 ||
      Object.keys(parsedJson).filter((key) => isObject(parsedJson[key]))
        .length > 0
    ) {
      errors.fieldsRaw =
        'Please provide a JSON object that contains ' +
        'a flat (not nested) list of explicit custom fields.';
    }
  } else if (fieldsType === 'json') {
    fieldsJsonPairs.forEach((q, index) => {
      if (!q.key && q.value) {
        errors[`fieldsJsonPairs.${index}.key`] = 'Please provide a key name.';
      }
    });
  }

  return errors;
};
