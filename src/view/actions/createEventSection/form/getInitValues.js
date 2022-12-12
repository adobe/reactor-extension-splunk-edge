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

export default ({ settings }) => {
  const splunkEvent = settings?.splunkEvent;

  let eventRaw = splunkEvent?.event || '';
  let fieldsRaw = splunkEvent?.fields || '';

  if (typeof eventRaw === 'object') {
    eventRaw = JSON.stringify(eventRaw, null, 2);
  }

  if (typeof fieldsRaw === 'object') {
    fieldsRaw = JSON.stringify(fieldsRaw, null, 2);
  }

  return {
    host: splunkEvent?.host || '',
    source: splunkEvent?.source || '',
    sourcetype: splunkEvent?.sourcetype || '',
    index: splunkEvent?.index || '',
    // eslint-disable-next-line no-dupe-keys
    sourcetype: splunkEvent?.sourcetype || '',
    time: splunkEvent?.time || '',
    eventType: 'raw',
    eventRaw,
    eventJsonPairs: [],
    fieldsType: 'raw',
    fieldsRaw,
    fieldsJsonPairs: []
  };
};
