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
import {
  View,
  Link,
  Flex,
  ContextualHelp,
  Heading,
  Content
} from '@adobe/react-spectrum';
import WrappedTextField from '../../../components/wrappedTextField';

export default function Fields() {
  return (
    <View minWidth="size-4600">
      <p>
        Use the extension to get data from Adobe Experience Platform Event
        Forwarding and create events in <b>Splunk Cloud</b> or{' '}
        <b>Splunk Enterprise</b>.
      </p>

      <Flex direction="column" gap="size-150" marginTop="size-300">
        <WrappedTextField
          width="size-6000"
          name="url"
          label="HTTP Event Collector URL"
          necessityIndicator="label"
          isRequired
          supportDataElement
          description="The URL must contain the protocol, host, port, and endpoint (e.g. https://http-inputs-mysplunkserver.splunkcloud.com:443/services/collector/event)."
        />

        <View>
          <WrappedTextField
            width="size-6000"
            name="token"
            label="Access Token"
            necessityIndicator="label"
            isRequired
            supportDataElement
            contextualHelp={
              <ContextualHelp>
                <Heading>Need help?</Heading>
                <Content>
                  <p>
                    You must authenticate to the Splunk Cloud Platform or Splunk
                    Enterprise instance on which it runs before the HTTP Event
                    Collector can accept your data.
                  </p>
                  <p>
                    You can authenticate by using the token you generate when
                    you create a new HEC input. See{' '}
                    <Link>
                      <a
                        href="https://docs.splunk.com/Documentation/Splunk/9.0.1/Data/HTTPEventCollectortokenmanagement"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Use cURL to manage HTTP Event Collector tokens, events,
                        and services
                      </a>
                    </Link>{' '}
                    for more information.
                  </p>
                </Content>
              </ContextualHelp>
            }
          />
        </View>
      </Flex>
    </View>
  );
}
