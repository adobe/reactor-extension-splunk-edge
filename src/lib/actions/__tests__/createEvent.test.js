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

var createEvent = require('../createEvent');

describe('create event action', () => {
  test('makes the correct API calling', () => {
    const payload = {
      time: '1433188255',
      event: 'metric',
      source: 'test12',
      sourceType: 'extenstion',
      host: 'abc.splunk.com',
      fields: {
        firstname: 'abc'
      }
    };

    const fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve([114, 101, 115, 117, 108, 116]) //result
      })
    );

    const settings = {
      splunkEvent: payload
    };

    var extensionSettings = {
      url: 'https://prd-p-p3dfo.splunkcloud.com:443/services/collector/event',
      token: '8a7f6afc-b493-4bc3-baaa-735669cd89e8'
    };

    var arc = {
      ruleStash: {}
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return createEvent({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://prd-p-p3dfo.splunkcloud.com:443/services/collector/event',
        {
          method: 'POST',
          headers: {
            Authorization: 'Splunk ' + '8a7f6afc-b493-4bc3-baaa-735669cd89e8',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
    });
  });
});
