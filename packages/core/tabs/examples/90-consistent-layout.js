// @flow
import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Tabs from '../src';

const Content = styled.div`
  display: block;
  background-color: ${colors.N30};
  padding: 10px;
`;

export default () => (
  <>
    <Tabs
      tabs={[
        {
          label: 'Block Element',
          defaultSelected: true,
          content: <Content>This is a block element</Content>,
        },
        {
          label: 'Width set to 100%',
          content: (
            <div style={{ width: '100%' }}>
              <Content>This is a block element with width set to 100%</Content>
            </div>
          ),
        },
      ]}
    />
    <Content style={{ marginTop: '10px' }}>
      This element is the same block element as above, but outside of Tab
    </Content>
  </>
);
