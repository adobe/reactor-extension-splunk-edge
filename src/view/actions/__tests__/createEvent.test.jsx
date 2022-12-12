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
import {
  changeInputValue,
  click,
  getTextFieldByLabel
} from '../../__tests_helpers__/jsDomHelpers';

import CreateEvent from '../createEvent';
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
  eventRawField: screen.getByLabelText(/Event Raw/i),
  eventJsonRadio: screen.getByLabelText(/Event Type JSON/i),
  hostField: screen.getByLabelText(/Host/i, {
    selector: '[name="host"]'
  }),
  sourceField: screen.getByLabelText(/^Source$/i),
  sourceTypeField: screen.getByLabelText(/Source Type/i, {
    selector: '[name="sourcetype"]'
  }),
  indexTypeField: screen.getByLabelText(/Index/i, {
    selector: '[name="index"]'
  }),
  timeField: screen.getByLabelText(/Time/i),
  fieldsRawField: screen.getByLabelText(/Fields Raw/i),
  fieldsJsonRadio: screen.getByLabelText(/Fields Type JSON/i)
});

describe('Create Event', () => {
  test('sets form values from setting', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        splunkEvent: {
          host: 'host',
          source: 'source',
          sourcetype: 'sourcetype',
          index: 'index',
          time: 123456.6,
          event: {
            a: 'b'
          },
          fields: {
            c: 'd',
            e: 'f'
          }
        }
      }
    });

    const {
      eventRawField,
      hostField,
      sourceField,
      sourceTypeField,
      indexTypeField,
      timeField,
      fieldsRawField
    } = getFromFields();

    expect(eventRawField.value).toBe('{\n  "a": "b"\n}');
    expect(hostField.value).toBe('host');
    expect(sourceField.value).toBe('source');
    expect(sourceTypeField.value).toBe('sourcetype');
    expect(indexTypeField.value).toBe('index');
    expect(timeField.value).toBe('123456.6');
    expect(fieldsRawField.value).toBe('{\n  "c": "d",\n  "e": "f"\n}');
  });

  test('sets settings from form values', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        splunkEvent: {
          host: 'host',
          source: 'source',
          sourcetype: 'sourcetype',
          index: 'index',
          time: 123456.6,
          event: {
            a: 'b'
          },
          fields: {
            c: 'd',
            e: 'f'
          }
        }
      }
    });

    const {
      eventRawField,
      hostField,
      sourceField,
      sourceTypeField,
      indexTypeField,
      timeField,
      fieldsRawField
    } = getFromFields();

    await changeInputValue(eventRawField, 'event text');
    await changeInputValue(hostField, 'new host');
    await changeInputValue(sourceField, 'new source');
    await changeInputValue(sourceTypeField, 'new source type');
    await changeInputValue(indexTypeField, 'new index');
    await changeInputValue(timeField, '4321');
    await changeInputValue(fieldsRawField, '{{"a":"b"}');

    expect(extensionBridge.getSettings()).toEqual({
      splunkEvent: {
        host: 'new host',
        source: 'new source',
        sourcetype: 'new source type',
        index: 'new index',
        time: 4321,
        event: 'event text',
        fields: {
          a: 'b'
        }
      }
    });
  });

  test('sets settings from form values when JSON editors are used', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        splunkEvent: {
          event: {
            a: 'b',
            c: { d: 'e' }
          },
          fields: {
            f: 'g',
            h: 'i'
          }
        }
      }
    });

    const { eventJsonRadio, fieldsJsonRadio } = getFromFields();

    await click(eventJsonRadio);
    await click(fieldsJsonRadio);

    expect(getTextFieldByLabel('Event JSON Key 0').value).toBe('a');
    expect(getTextFieldByLabel('Event JSON Value 0').value).toBe('b');
    expect(getTextFieldByLabel('Event JSON Key 1').value).toBe('c.d');
    expect(getTextFieldByLabel('Event JSON Value 1').value).toBe('e');

    await click(getTextFieldByLabel('Delete Event JSON Row 0'));

    await changeInputValue(getTextFieldByLabel('Event JSON Key 0'), 'a');

    expect(getTextFieldByLabel('Field JSON Key 0').value).toBe('f');
    expect(getTextFieldByLabel('Field JSON Value 0').value).toBe('g');
    expect(getTextFieldByLabel('Field JSON Key 1').value).toBe('h');
    expect(getTextFieldByLabel('Field JSON Value 1').value).toBe('i');

    await click(getTextFieldByLabel('Delete Field JSON Row 0'));

    await changeInputValue(getTextFieldByLabel('Field JSON Key 0'), 'a');
    await changeInputValue(getTextFieldByLabel('Field JSON Value 0'), 'b');

    expect(extensionBridge.getSettings()).toEqual({
      splunkEvent: {
        event: { a: 'e' },
        fields: {
          a: 'b'
        }
      }
    });
  });

  test('handles default form validation correctly', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        event: 'raw event'
      }
    });

    const { eventRawField } = getFromFields();

    expect(eventRawField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(eventRawField, '');

    await extensionBridge.validate();

    expect(eventRawField).toHaveAttribute('aria-invalid', 'true');
  });

  test('handles raw fields validation correctly when no valid json is provided', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        event: 'raw event'
      }
    });

    const { fieldsRawField } = getFromFields();

    expect(fieldsRawField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(fieldsRawField, '{{');

    await extensionBridge.validate();

    expect(fieldsRawField).toHaveAttribute('aria-invalid', 'true');
  });

  test('handles raw fields validation correctly when no object is provided', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        event: 'raw event'
      }
    });

    const { fieldsRawField } = getFromFields();

    expect(fieldsRawField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(fieldsRawField, 'true');

    await extensionBridge.validate();

    expect(fieldsRawField).toHaveAttribute('aria-invalid', 'true');
  });

  test('handles raw fields validation correctly when empty object is provided', async () => {
    renderView(CreateEvent);

    extensionBridge.init({
      settings: {
        event: 'raw event'
      }
    });

    const { fieldsRawField } = getFromFields();

    expect(fieldsRawField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(fieldsRawField, '{{}');

    await extensionBridge.validate();

    expect(fieldsRawField).toHaveAttribute('aria-invalid', 'true');
  });

  test(
    'handles raw fields validation correctly when object with ' +
      'depth more than one is provided',
    async () => {
      renderView(CreateEvent);

      extensionBridge.init({
        settings: {
          event: 'raw event'
        }
      });

      const { fieldsRawField } = getFromFields();

      expect(fieldsRawField).not.toHaveAttribute('aria-invalid', 'true');
      await changeInputValue(fieldsRawField, '{{"a": {{"b": "c"}}');

      await extensionBridge.validate();

      expect(fieldsRawField).toHaveAttribute('aria-invalid', 'true');
    }
  );
});
