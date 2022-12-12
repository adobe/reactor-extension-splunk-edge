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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Link,
  Flex,
  ContextualHelp,
  Heading,
  Content
} from '@adobe/react-spectrum';
import WrappedTextField from '../../../components/wrappedTextField';
import JsonEditor from '../../../components/rawJsonEditor';
import {
  addToVariablesFromEntity,
  addToEntityFromVariables
} from '../../../utils/entityVariablesConverter';
import getEmptyDataJson from '../form/getEmptyValue';
import EventRow from './eventRow';
import FieldsRow from './fieldsRow';

export default function Fields() {
  const { setValue, watch } = useFormContext();
  const [eventRaw, eventJsonPairs, fieldsRaw, fieldsJsonPairs] = watch([
    'eventRaw',
    'eventJsonPairs',
    'fieldsRaw',
    'fieldsJsonPairs'
  ]);

  return (
    <Flex direction="column" gap="size-150" marginTop="size-300">
      <Link>
        <a
          href="https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/FormateventsforHTTPEventCollector"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about formatting events for HTTP Event Collector
        </a>
      </Link>

      <JsonEditor
        label="Event"
        radioLabel="Select the way you want to provide the event"
        description="A JSON object, a string, or a data element."
        isRequired
        typeVariable="eventType"
        rawVariable="eventRaw"
        jsonVariable="eventJsonPairs"
        getEmptyJsonValueFn={getEmptyDataJson}
        row={EventRow}
        onTypeSwitch={(v) => {
          // Auto Update Data Content
          if (v === 'json') {
            let variables = [];

            try {
              variables = addToVariablesFromEntity([], JSON.parse(eventRaw));
            } catch (e) {
              // Don't do anything
            }

            if (variables.length === 0) {
              variables.push(getEmptyDataJson());
            }

            setValue('eventJsonPairs', variables, {
              shouldValidate: true,
              shouldDirty: true
            });
          } else if (eventJsonPairs.length > 1 || eventJsonPairs[0].key) {
            let entity = JSON.stringify(
              addToEntityFromVariables({}, eventJsonPairs),
              null,
              2
            );

            if (entity === '{}') {
              entity = '';
            }

            setValue('eventRaw', entity, {
              shouldValidate: true,
              shouldDirty: true
            });
          }
          // END: Auto Update Data Content
        }}
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                The event can be raw text or a JSON object. Inside the JSON
                object, the data can be in whatever format you want: a string, a
                number, another JSON object, and so on.
              </p>
              <p>
                Learn more about{' '}
                <Link>
                  <a
                    href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Data/FormateventsforHTTPEventCollector#Event_data"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Event Data
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        width="size-6000"
        name="host"
        label="Host"
        supportDataElement
        description={
          'The host value is typically the hostname, IP address, or fully qualified domain name' +
          ' of the networked machine on which the event originated.'
        }
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                The host field value is a default field, which means that Splunk
                Enterprise assigns a host to every event it indexes. You can use
                it to search for all events that have been generated by a
                particular host.
              </p>
              <p>
                Learn more{' '}
                <Link>
                  <a
                    href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Data/Abouthosts"
                    target="_blank"
                    rel="noreferrer"
                  >
                    about hosts
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        width="size-6000"
        name="sourcetype"
        label="Source Type"
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                The source type is one of the default fields that the Splunk
                platform assigns to all incoming data. It tells the platform
                what kind of data you have, so that it can format the data
                intelligently during indexing. Source types also let you
                categorize your data for easier searching.
              </p>
              <p>
                Learn more about{' '}
                <Link>
                  <a
                    href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Data/Whysourcetypesmatter"
                    target="_blank"
                    rel="noreferrer"
                  >
                    why source types matter
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        width="size-6000"
        name="source"
        label="Source"
        supportDataElement
        description={
          "If you're sending data from an app you're developing, set" +
          ' this key to the name of the app.'
        }
      />

      <WrappedTextField
        width="size-6000"
        name="index"
        label="Index"
        supportDataElement
        description={
          'The name of the index by which the event data is to be indexed.' +
          ' The index you specify here must be within the list of allowed indexes ' +
          'if the token has the indexes parameter set.'
        }
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                The index is the repository for Splunk Enterprise data. Splunk
                Enterprise transforms incoming data into events, which it stores
                in indexes.
              </p>
              <p>
                Learn more about{' '}
                <Link>
                  <a
                    href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Indexer/Aboutindexesandindexers"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Indexes, indexers, and indexer clusters
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        width="size-6000"
        name="time"
        label="Time"
        supportDataElement
        description={
          'The event time. The default time format is UNIX time format, in the format ' +
          '<sec>.<ms> and depends on your local timezone. For example, 1433188255.500 ' +
          'indicates 1433188255 seconds and 500 milliseconds after epoch, or Monday, ' +
          'June 1, 2015, at 7:50:55 PM GMT.'
        }
      />

      <JsonEditor
        label="Fields"
        radioLabel="Select the way you want to provide the fields"
        description={
          'A JSON object that contains a flat (not nested) list of explicit custom' +
          ' fields to be defined at index time.'
        }
        isRequired
        typeVariable="fieldsType"
        rawVariable="fieldsRaw"
        jsonVariable="fieldsJsonPairs"
        getEmptyJsonValueFn={getEmptyDataJson}
        row={FieldsRow}
        onTypeSwitch={(v) => {
          // Auto Update Data Content
          if (v === 'json') {
            let variables = [];

            try {
              variables = addToVariablesFromEntity([], JSON.parse(fieldsRaw));
            } catch (e) {
              // Don't do anything
            }

            if (variables.length === 0) {
              variables.push(getEmptyDataJson());
            }

            setValue('fieldsJsonPairs', variables, {
              shouldValidate: true,
              shouldDirty: true
            });
          } else if (fieldsJsonPairs.length > 1 || fieldsJsonPairs[0].key) {
            let entity = JSON.stringify(
              addToEntityFromVariables({}, fieldsJsonPairs),
              null,
              2
            );

            if (entity === '{}') {
              entity = '';
            }

            setValue('fieldsRaw', entity, {
              shouldValidate: true,
              shouldDirty: true
            });
          }
          // END: Auto Update Data Content
        }}
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                Use the fields property if you don&rsquo;t want to include
                custom fields with the event data, but you want to annotate the
                data with some extra information.
              </p>
              <p>
                Learn more about{' '}
                <Link>
                  <a
                    href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Data/IFXandHEC"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Automate indexed field extractions with HTTP Event Collector
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />
    </Flex>
  );
}
