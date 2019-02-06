import * as React from 'react';
import { css } from 'emotion';
import isPropValid from '@emotion/is-prop-valid';
import GlobalTheme, { ThemeProp } from '@atlaskit/theme';
import { Theme } from '../theme';
import { mapAttributesToState } from './utils';
import {
  ButtonContent,
  ButtonWrapper,
  IconWrapper,
  LoadingSpinner,
} from '../styled';
import { ButtonProps } from '../types';

export type ButtonState = {
  isHover: boolean;
  isActive: boolean;
  isFocus: boolean;
};

export default class Button extends React.Component<ButtonProps, ButtonState> {
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

  isInteractive = () => !this.props.isDisabled && !this.props.isLoading;

  // Swallow click events when the button is disabled
  // to prevent inner child clicks bubbling up.
  onInnerClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    if (!this.isInteractive()) e.stopPropagation();
    return true;
  };

  render() {
    const { state } = this;
    const {
      appearance,
      children,
      component,
      href,
      iconAfter,
      iconBefore,
      isDisabled,
      isLoading,
      isSelected,
      shouldFitContainer,
      spacing,
      theme,
    } = this.props;
    const attributes = { ...state, isSelected, isDisabled };

    const iconIsOnlyChild: boolean = !!(
      (iconBefore && !iconAfter && !children) ||
      (iconAfter && !iconBefore && !children)
    );

    const getElement = () => {
      if (href) {
        return isDisabled ? 'span' : 'a';
      }
      return 'button';
    };

    const StyledButton = component || getElement();
    const specifiers = (styles: {}) => {
      if (StyledButton === 'a') {
        return {
          'a&': styles,
        };
      } else if (StyledButton === component) {
        return {
          '&, a&, &:hover, &:active, &:focus': styles,
        };
      }
      return styles;
    };

    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }) => (
            <Theme.Consumer
              appearance={appearance}
              mode={mode}
              state={mapAttributesToState(attributes)}
              {...this.props}
            >
              {({ button }) => (
                <StyledButton
                  {...(Object.keys(this.props) as Array<keyof ButtonProps>)
                    .filter(isPropValid)
                    .reduce(
                      (validProps, prop) => ({
                        ...validProps,
                        [prop]: this.props[prop],
                      }),
                      {},
                    )}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  className={css(specifiers(button))}
                >
                  <ButtonWrapper
                    onClick={this.onInnerClick}
                    fit={!!shouldFitContainer}
                  >
                    {isLoading && (
                      <LoadingSpinner
                        spacing={spacing}
                        appearance={appearance}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                      />
                    )}
                    {iconBefore && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                      >
                        {iconBefore}
                      </IconWrapper>
                    )}
                    <ButtonContent
                      isLoading={isLoading}
                      followsIcon={!!iconBefore}
                      spacing={spacing}
                    >
                      {children}
                    </ButtonContent>
                    {iconAfter && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                      >
                        {iconAfter}
                      </IconWrapper>
                    )}
                  </ButtonWrapper>
                </StyledButton>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}
