import React, { useMemo } from 'react';
import { CSSObject } from '@emotion/core';
import Icon from '@atlaskit/icon/glyph/checkbox';
import GlobalTheme from '@atlaskit/theme/components';
import IconIndeterminate from '@atlaskit/icon/glyph/checkbox-indeterminate';
import Theme, { componentTokens } from './theme';
import { createExtender, identity } from './utils';
import { IconWrapper, IconProps } from './elements';
import { CheckboxIconProps, ThemeProps, ThemeTokens } from './types';
import { iconWrapperCSS } from './elements/IconWrapper';

interface DefaultType {
  IconWrapper: {
    component: typeof IconWrapper;
    cssFn: (props: IconProps) => CSSObject;
    attributesFn: (props: Record<string, any>) => Record<string, any>;
  };
  Icon: {
    component: typeof Icon;
  };
  IconIndeterminate: {
    component: typeof IconIndeterminate;
  };
}

type OverridesType = {
  IconWrapper?: {
    component?: React.ComponentType;
    cssFn?: (defaultStyles: CSSObject, props: IconProps) => CSSObject;
    attributesFn?: (props: Record<string, any>) => Record<string, any>;
  };
  Icon?: {
    component?: React.ComponentType;
  };
  IconIndeterminate?: {
    component?: React.ComponentType;
  };
};

const defaults: DefaultType = {
  IconWrapper: {
    component: IconWrapper,
    cssFn: iconWrapperCSS,
    attributesFn: identity,
  },
  IconIndeterminate: {
    component: IconIndeterminate,
  },
  Icon: {
    component: Icon,
  },
};

export default function CheckboxIcon({
  theme,
  overrides,
  isIndeterminate,
  isChecked,
  isDisabled,
  isFocused,
  isActive,
  isHovered,
  isInvalid,
  primaryColor,
  secondaryColor,
}: CheckboxIconProps) {
  const getOverrides = useMemo(
    () => createExtender<DefaultType, OverridesType>(defaults, overrides),
    [overrides],
  );
  const { component: IconWrapper, ...iconWrapperOverrides } = getOverrides(
    'IconWrapper',
  );
  const { component: IconIndeterminate } = getOverrides('IconIndeterminate');
  const { component: Icon } = getOverrides('Icon');
  return (
    <Theme.Provider value={theme}>
      <GlobalTheme.Consumer>
        {({ mode }: { mode: 'light' | 'dark' }) => (
          <Theme.Consumer mode={mode} tokens={componentTokens}>
            {tokens => (
              <IconWrapper
                {...iconWrapperOverrides}
                tokens={tokens}
                isChecked={isChecked}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isActive={isActive}
                isHovered={isHovered}
                isInvalid={isInvalid}
              >
                {isIndeterminate ? (
                  <IconIndeterminate
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

CheckboxIcon.defaultProps = {
  primaryColor: 'inherit',
  secondaryColor: 'inherit',
  isIndeterminate: false,
  theme: (
    current: (prop: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ): ThemeTokens => current(props),
};
