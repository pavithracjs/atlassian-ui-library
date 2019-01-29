import * as React from 'react';
import styled from 'styled-components';
import GlobalTheme, { ThemeProp } from '@atlaskit/theme';
import { Theme, ThemeAppearance, ThemeTokens, ThemeProps } from '../themeNew';
import getButtonStyles from '../styled/getButtonStylesNew';

type State = {
  isHover: false;
};

type Props = {
  /** Affects the visual style of the button. */
  appearance: ThemeAppearance;
  /** The value displayed within the button. */
  children: number | string;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
};

const StyledButton = styled.button`
  ${getButtonStyles};
`;
StyledButton.displayName = 'StyledButton';

const mapAttributesToState = ({
  isDisabled,
  isActive,
  isFocus,
  isHover,
  isSelected,
}) => {
  if (isDisabled) return 'disabled';
  if (isSelected && isFocus) return 'focusSelected';
  if (isSelected) return 'selected';
  if (isActive) return 'active';
  if (isHover) return 'hover';
  if (isFocus) return 'focus';
  return 'default';
};

export default class Button extends React.Component<State, Props> {
  state = {
    isActive: false,
    isFocus: false,
    isHover: false,
  };

  onMouseEnter = () => {
    this.setState({ isHover: true });
  };

  onMouseLeave = () => {
    this.setState({ isHover: false, isActive: false });
  };

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = () => this.setState({ isActive: false });

  onFocus: React.FocusEventHandler<HTMLButtonElement> = event => {
    this.setState({ isFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onBlur: React.FocusEventHandler<HTMLButtonElement> = event => {
    this.setState({ isFocus: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    const { state } = this;
    const { appearance, theme, children, isSelected, isDisabled } = this.props;
    const attributes = { ...state, isSelected, isDisabled };
    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }) => (
            <Theme.Consumer
              appearance={appearance}
              mode={mode}
              state={mapAttributesToState(attributes)}
            >
              {tokens => (
                <StyledButton
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  isActive={state.isActive}
                  isFocus={state.isFocus}
                  isDisabled={isDisabled}
                  {...tokens}
                >
                  {children}
                </StyledButton>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}
