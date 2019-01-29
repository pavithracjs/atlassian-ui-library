import * as React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';
import getButtonStyles from '../styled/getButtonStylesNew';

type State = {};
type Props = {};

const StyledButton = styled.button`
  ${getButtonStyles};
`;
StyledButton.displayName = 'StyledButton';

export default class Button extends React.Component<State, Props> {
  state = {
    isHover: false,
  };

  render() {
    const { appearance, theme, children } = this.props;
    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer appearance={appearance} mode="light">
          {tokens => <StyledButton {...tokens}>{children}</StyledButton>}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}
