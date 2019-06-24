import React from 'react';
import styled from 'styled-components';
import ProfileCardResourced from '../src';
import { getMockProfileClient } from './helper/util';
import LocaleIntlProvider from './helper/locale-intl-provider';

export const MainStage = styled.div`
  margin: 16px;
`;

const mockClient = getMockProfileClient(10, 0);
// With a real client this would look like:
// const client = new ProfileClient({ url: 'http://api/endpoint' });

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <ProfileCardResourced
          userId="1"
          cloudId="dummy-cloud"
          resourceClient={mockClient}
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
        />
        <br />
        <ProfileCardResourced
          userId="2"
          cloudId="dummy-cloud"
          resourceClient={mockClient}
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
        />
        <br />
        <ProfileCardResourced
          userId="error:NotFound"
          cloudId="dummy-cloud"
          resourceClient={mockClient}
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
        />
      </MainStage>
    </LocaleIntlProvider>
  );
}
