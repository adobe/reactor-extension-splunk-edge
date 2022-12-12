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

import { addToEntityFromVariables } from '../../../utils/entityVariablesConverter';

export default ({
  eventType,
  eventRaw,
  eventJsonPairs,
  host,
  source,
  sourcetype,
  index,
  time,
  fieldsType,
  fieldsRaw,
  fieldsJsonPairs
}) => {
  let event;
  let fields;
  const settings = {};

  Object.entries({ host, source, sourcetype, index, time }).forEach(
    ([key, value]) => {
      if (value) {
        settings[key] = key === 'time' ? Number(value) || value : value;
      }
    }
  );

  if (eventType === 'json') {
    event = addToEntityFromVariables(
      {},
      eventJsonPairs.filter((p) => p.key || p.value)
    );

    if (Object.keys(event).length === 0) {
      event = null;
    }
  } else {
    try {
      event = JSON.parse(eventRaw);
    } catch {
      event = eventRaw;
    }
  }

  if (event) {
    settings.event = event;
  }

  if (fieldsType === 'json') {
    fields = addToEntityFromVariables(
      {},
      fieldsJsonPairs.filter((p) => p.key || p.value)
    );

    if (Object.keys(fields).length === 0) {
      event = null;
    }
  } else {
    try {
      fields = JSON.parse(fieldsRaw);
    } catch {
      fields = fieldsRaw;
    }
  }

  if (fields) {
    settings.fields = fields;
  }

  return { splunkEvent: settings };
};
