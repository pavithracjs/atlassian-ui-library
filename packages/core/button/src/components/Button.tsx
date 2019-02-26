import * as React from 'react';
import { css, cx } from 'emotion';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import GlobalTheme from '@atlaskit/theme';
import { Theme } from '../theme';
import { mapAttributesToState, filterProps, checkDeprecations } from './utils';
import Content from './Content';
import InnerWrapper from './InnerWrapper';
import IconWrapper from './IconWrapper';
import LoadingSpinner from './LoadingSpinner';
import { withDefaultProps } from '@atlaskit/type-helpers';
import {
  ButtonProps,
  ButtonStyles,
  IconStyles,
  SpinnerStyles,
  ThemeMode,
} from '../types';

type ButtonThemeStyles = {
  buttonStyles: ButtonStyles;
  spinnerStyles: SpinnerStyles;
  iconStyles: IconStyles;
};

export type ButtonState = {
  isHover: boolean;
  isActive: boolean;
  isFocus: boolean;
};

export const defaultProps: Pick<
  ButtonProps,
  | 'appearance'
  | 'isDisabled'
  | 'isSelected'
  | 'isLoading'
  | 'spacing'
  | 'type'
  | 'shouldFitContainer'
  | 'autoFocus'
> = {
  appearance: 'default',
  isDisabled: false,
  isSelected: false,
  isLoading: false,
  spacing: 'default',
  type: 'button',
  shouldFitContainer: false,
  autoFocus: false,
};

export class Button extends React.Component<ButtonProps, ButtonState> {
  button: HTMLElement | undefined;

  state = {
    isActive: false,
    isFocus: false,
    isHover: false,
  };

  componentDidMount() {
    if (this.props.autoFocus && this.button) {
      this.button.focus();
    }
    checkDeprecations(this.props);
  }

  onMouseEnter = () => {
    this.setState({ isHover: true });
  };

  onMouseLeave: React.MouseEventHandler = () => {
    this.setState({ isHover: false, isActive: false });
  };

  onMouseDown: React.MouseEventHandler = event => {
    event.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = () => this.setState({ isActive: false });

  onFocus: React.FocusEventHandler<HTMLElement> = event => {
    this.setState({ isFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onBlur: React.FocusEventHandler<HTMLElement> = event => {
    this.setState({ isFocus: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  getElement = () => {
    const { href, isDisabled } = this.props;
    if (href) return isDisabled ? 'span' : 'a';
    return 'button';
  };

  isInteractive = () => !this.props.isDisabled && !this.props.isLoading;

  // Swallow click events when the button is disabled
  // to prevent inner child clicks bubbling up.
  onInnerClick: React.MouseEventHandler<HTMLElement> = e => {
    if (!this.isInteractive()) e.stopPropagation();
    return true;
  };

  // Handle innerRef for focusing button
  getInnerRef = (ref: HTMLElement) => {
    this.button = ref;

    const { innerRef } = this.props;
    if (innerRef) innerRef(ref);
  };

  render() {
    const {
      appearance,
      children,
      className,
      component: CustomComponent,
      iconAfter,
      iconBefore,
      isDisabled,
      isLoading,
      isSelected,
      shouldFitContainer,
      spacing,
      theme,
    } = this.props;

    const attributes = { ...this.state, isSelected, isDisabled };

    const StyledButton = CustomComponent
      ? React.forwardRef((props: ButtonProps, ref: any) => (
          <CustomComponent innerRef={ref} {...props} />
        ))
      : this.getElement();

    const iconIsOnlyChild: boolean = !!(
      (iconBefore && !iconAfter && !children) ||
      (iconAfter && !iconBefore && !children)
    );

    const specifiers = (styles: {}) => {
      if (StyledButton === 'a') {
        return {
          'a&': styles,
        };
      } else if (StyledButton === CustomComponent) {
        return {
          '&, a&, &:hover, &:active, &:focus': styles,
        };
      }
      return styles;
    };

    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }: { mode: ThemeMode }) => (
            <Theme.Consumer
              mode={mode}
              state={mapAttributesToState(attributes)}
              iconIsOnlyChild={iconIsOnlyChild}
              {...this.props}
            >
              {({
                buttonStyles,
                spinnerStyles,
                iconStyles,
              }: ButtonThemeStyles) => (
                <StyledButton
                  {...filterProps(this.props, StyledButton)}
                  ref={this.getInnerRef}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  className={cx(css(specifiers(buttonStyles)), className)}
                >
                  <InnerWrapper
                    onClick={this.onInnerClick}
                    fit={!!shouldFitContainer}
                  >
                    {isLoading && (
                      <LoadingSpinner
                        spacing={spacing}
                        appearance={appearance}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        styles={spinnerStyles}
                      />
                    )}
                    {iconBefore && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                        styles={iconStyles}
                        icon={iconBefore}
                      />
                    )}
                    {children && (
                      <Content
                        isLoading={isLoading}
                        followsIcon={!!iconBefore}
                        spacing={spacing}
                      >
                        {children}
                      </Content>
                    )}
                    {iconAfter && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                        styles={iconStyles}
                        icon={iconAfter}
                      />
                    )}
                  </InnerWrapper>
                </StyledButton>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}

type T = React.Component;

const DefaultedButton = withDefaultProps(defaultProps, Button);
const ButtonWithForwardRef = React.forwardRef<T, ButtonProps>((props, ref) => (
  <DefaultedButton {...props} innerRef={ref} />
));
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'button',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'button',

      attributes: {
        componentName: 'button',
        packageName,
        packageVersion,
      },
    }),
  })(ButtonWithForwardRef),
);
