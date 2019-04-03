import * as React from 'react';
import styled from 'styled-components';

import InlineEdit from '../src';

const ReadView = styled.div`
  padding: 8px 6px;
  border: 2px solid transparent;
`;

const EditView = styled.input`
  font-size: inherit;
  font-weight: inherit;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 3px;
  padding: 8px 8px;
  outline: none;
  width: 100%;

  :focus {
    border: 2px solid #4c9aff;
  }
`;

export default class InlineEditExample extends React.Component {
  render() {
    return (
      <div style={{ padding: '0 24px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <InlineEdit
            editValue="Field Value"
            editView={({ ref, ...rest }) => (
              <EditView {...rest} innerRef={ref} />
            )}
            readView={() => <ReadView>Field Value</ReadView>}
            onConfirm={() => {}}
          />
        </div>
        <div style={{ fontSize: '14px' }}>
          <InlineEdit
            editValue="Field Value"
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
