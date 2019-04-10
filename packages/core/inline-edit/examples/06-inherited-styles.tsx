import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

import InlineEdit from '../src';

const ReadView = styled.div`
  padding: ${gridSize()}px ${gridSize() - 2}px;
  border: 2px solid transparent;
`;

const EditView = styled.input`
  font-size: inherit;
  font-weight: inherit;
  box-sizing: border-box;
  border: 2px solid ${colors.N40};
  border-radius: 3px;
  padding: ${gridSize()}px ${gridSize()}px;
  outline: none;
  width: 100%;
  transition: border 0.4s;

  :focus {
    border-color: ${colors.B100};
  }
`;

export default class InlineEditExample extends React.Component {
  render() {
    return (
      <div style={{ padding: `0 ${gridSize()}px` }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <InlineEdit
            defaultValue="Field Value"
            editView={({ ref, ...rest }) => (
              <EditView {...rest} innerRef={ref} />
            )}
            readView={() => <ReadView>Field Value</ReadView>}
            onConfirm={() => {}}
          />
        </div>
        <div style={{ fontSize: '14px' }}>
          <InlineEdit
            defaultValue="Field Value"
            editView={({ ref, ...rest }) => (
              <EditView {...rest} innerRef={ref} />
            )}
            readView={() => <ReadView>Field Value</ReadView>}
            onConfirm={() => {}}
          />
        </div>
      </div>
    );
  }
}
