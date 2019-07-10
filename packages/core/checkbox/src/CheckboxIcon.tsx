import React, { Component } from 'react';
import Icon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import { IconWrapper } from './styled/Checkbox';
import { CheckboxIconProps } from './types';

export default class CheckboxIcon extends Component<CheckboxIconProps, {}> {
  static defaultProps = {
    primaryColor: 'inherit',
    secondaryColor: 'inherit',
    isIndeterminate: false,
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
      tokens,
    } = this.props;
    return (
      <IconWrapper
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
    );
  }
}
