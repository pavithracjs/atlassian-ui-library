// @flow
import styled from 'styled-components';

const ReadViewContentWrapper = styled.button`
  display: inline-block;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  line-height: 1;
  margin: 0;
  padding: 0;
  outline: 0;
  border: 2px solid transparent;
  border-radius: 3px;
  &:hover:not(:focus) {
    background: #ebecf0;
  }
  &:focus {
    border: 2px solid #4c9aff;
  }
`;

ReadViewContentWrapper.displayName = 'ReadViewContentWrapper';

export default ReadViewContentWrapper;
