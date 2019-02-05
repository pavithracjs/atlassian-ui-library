import styled from 'styled-components';

const StyledButton = styled.button`
  ${p => p.styles}
`;
StyledButton.displayName = 'StyledButton';

export default StyledButton;
