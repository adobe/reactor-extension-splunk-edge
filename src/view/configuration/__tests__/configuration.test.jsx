/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND,  either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable no-template-curly-in-string */

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';
import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

import Configuration from '../configuration';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  urlField: screen.getByLabelText(/HTTP Event Collector URL/i),
  tokenField: screen.getByLabelText(/Access Token/i, {
    selector: '[name="token"]'
  })
});

describe('Configuration', () => {
  test('sets form values from setting', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        url: 'https://http-inputs-mysplunkserver.splunkcloud.com:443',
        token: '123abc'
      }
    });

    const { urlField, tokenField } = getFromFields();

    expect(urlField.value).toBe(
      'https://http-inputs-mysplunkserver.splunkcloud.com:443'
    );
    expect(tokenField.value).toBe('123abc');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        url: 'https://http-inputs-mysplunkserver.splunkcloud.com:443',
        token: '123abc'
      }
    });

    const { urlField, tokenField } = getFromFields();
    await changeInputValue(
      urlField,
      'https://http-inputs-mysplunkserver.splunkcloud.com:80'
    );
    await changeInputValue(tokenField, 'new123abc');

    expect(extensionBridge.getSettings()).toEqual({
      url: 'https://http-inputs-mysplunkserver.splunkcloud.com:80',
      token: 'new123abc'
    });
  });

  test('handles form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        url: 'https://http-inputs-mysplunkserver.splunkcloud.com:443',
        token: '123abc'
      }
    });

    const { urlField, tokenField } = getFromFields();

    expect(urlField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(urlField, '');

    expect(tokenField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(tokenField, '');

    await extensionBridge.validate();

    expect(urlField).toHaveAttribute('aria-invalid', 'true');
    expect(tokenField).toHaveAttribute('aria-invalid', 'true');
  });
});
