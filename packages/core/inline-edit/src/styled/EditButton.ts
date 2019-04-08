import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

const EditButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
  outline: 0;

  &:focus + div {
    border: 2px solid ${colors.B100};
    background: #fff;
  }
`;

EditButton.displayName = 'EditButton';

export default EditButton;
