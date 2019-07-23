import React, { Component } from 'react';
import Icon from '@atlaskit/icon/glyph/checkbox';
import GlobalTheme from '@atlaskit/theme/components';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import Theme, { componentTokens } from './theme';
import { IconWrapper } from './elements';
import {
  CheckboxIconProps,
  ThemeProps,
  ThemeTokens,
  CheckboxIconStylesProp,
  CheckboxIconDefaultStyles,
} from './types';
import { iconWrapperCSS } from './elements/IconWrapper';
import { InterpolationWithTheme } from '@emotion/core';

const defaultStyles: CheckboxIconDefaultStyles = {
  iconWrapper: iconWrapperCSS,
};

export default class CheckboxIcon extends Component<CheckboxIconProps, {}> {
  static defaultProps = {
    primaryColor: 'inherit',
    secondaryColor: 'inherit',
    isIndeterminate: false,
    theme: (
      current: (prop: ThemeProps) => ThemeTokens,
      props: ThemeProps,
    ): ThemeTokens => current(props),
  };

  getStyles = (
    key: keyof CheckboxIconStylesProp,
    props: any,
  ): InterpolationWithTheme<any> => {
    const { styles } = this.props;
    const defaultStyle = defaultStyles[key](props);
    const customStyle = styles && styles[key];
    return customStyle ? customStyle(defaultStyle, props) : defaultStyle;
  };

  render() {
    const {
      isChecked,
      isDisabled,
      isInvalid,
      isActive,
      isFocused,
      isHovered,
      isIndeterminate,
      primaryColor,
      secondaryColor,
      theme,
    } = this.props;
    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }: { mode: 'light' | 'dark' }) => (
            <Theme.Consumer mode={mode} tokens={componentTokens}>
              {tokens => (
                <IconWrapper
                  getStyles={this.getStyles}
                  tokens={tokens}
                  isChecked={isChecked}
                  isDisabled={isDisabled}
                  isFocused={isFocused}
                  isActive={isActive}
                  isHovered={isHovered}
                  isInvalid={isInvalid}
                >
                  {isIndeterminate ? (
                    <CheckboxIndeterminateIcon
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      size={tokens.icon.size}
                      label=""
                    />
                  ) : (
                    <Icon
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      size={tokens.icon.size}
                      label=""
                    />
                  )}
                </IconWrapper>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}
