// @flow
import styled from 'styled-components';

const ReadViewContentWrapper = styled.div`
  display: inline-block;
  border: 2px solid transparent;
  border-radius: 3px;
  &:hover {
    background: #ebecf0;
  }
`;

ReadViewContentWrapper.displayName = 'ReadViewContentWrapper';

export default ReadViewContentWrapper;
