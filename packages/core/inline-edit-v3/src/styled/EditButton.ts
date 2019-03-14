import styled from 'styled-components';

const EditButton = styled.button`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
  outline: 0;

  &:focus + div {
    border: 2px solid #4c9aff;
    background: #fff;
  }
`;

EditButton.displayName = 'EditButton';

export default EditButton;
