import styled from 'styled-components';
import getButtonStyles from '../styled/getButtonStylesNew';

const StyledButton = styled.button`
  ${getButtonStyles};
`;
StyledButton.displayName = 'StyledButton';

export default StyledButton;
