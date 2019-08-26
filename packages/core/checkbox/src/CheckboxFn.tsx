import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CSSObject } from '@emotion/core';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';
import Theme, { componentTokens } from './theme';
import { createExtender, identity } from './utils';
import CheckboxIcon from './CheckboxIcon';

import { name as packageName, version as packageVersion } from './version.json';

import {
  LabelText,
  LabelProps,
  LabelTextProps,
  Label,
  CheckboxWrapper,
  IconWrapper,
  IconProps,
  RequiredIndicator,
  HiddenCheckbox,
  labelCSS,
  iconWrapperCSS,
  labelTextCSS,
} from './elements';
import { CheckboxProps, ThemeTokens } from './types';

const defaults = {
  Label: {
    component: Label,
    cssFn: labelCSS,
    attributesFn: identity,
  },
  IconWrapper: {
    component: IconWrapper,
    cssFn: iconWrapperCSS,
    attributesFn: identity,
  },
  LabelText: {
    component: LabelText,
    cssFn: labelTextCSS,
    attributesFn: identity,
  },
};

type DefaultTypes = {
  Label: {
    component: React.ComponentType<LabelProps>;
    cssFn: (state: any) => CSSObject;
    attributesFn: (props: Record<string, any>) => Record<string, any>;
  };
  IconWrapper: {
    component: React.ComponentType;
    cssFn: (props: IconProps) => CSSObject;
    attributesFn: (props: { [key: string]: any }) => any;
  };
  LabelText: {
    component: React.ComponentType<LabelTextProps>;
    cssFn: (state: { tokens: ThemeTokens }) => CSSObject;
    attributesFn: (props: { [key: string]: any }) => any;
  };
};

type OverridesTypes =
  | {
      Label?: {
        component?: React.ComponentType;
        cssFn?: (state: any) => CSSObject;
        attributesFn?: (props: Record<string, any>) => Record<string, any>;
      };
      IconWrapper?: {
        component?: React.ComponentType;
        cssFn?: (state: any) => CSSObject;
        attributesFn?: (props: Record<string, any>) => Record<string, any>;
      };
      LabelText?: {
        component?: React.ComponentType;
        cssFn?: (state: { tokens: ThemeTokens }) => CSSObject;
        attributesFn?: (props: Record<string, any>) => Record<string, any>;
      };
    }
  | undefined;

function Checkbox({
  inputRef,
  label,
  value,
  overrides,
  theme,
  onChange: propsOnChange,
  isChecked,
  isIndeterminate,
  isDefaultChecked,
  isDisabled,
  isInvalid,
  isRequired,
  ...rest
}: CheckboxProps & { [key: string]: any }) {
  const hiddenCheckboxRef = useRef<HTMLInputElement>(null);
  const actionKeys = [' '];
  const getOverrides = useMemo(
    () => createExtender<DefaultTypes, OverridesTypes>(defaults, overrides),
    [overrides],
  );

  const [isActive, setActive] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isMouseDown, setMouseDown] = useState(false);
  const [isInternallyChecked, setChecked] = useState(
    isChecked !== undefined ? isChecked : isDefaultChecked,
  );

  useEffect(
    () => {
      if (hiddenCheckboxRef && hiddenCheckboxRef.current) {
        hiddenCheckboxRef.current.indeterminate = !!isIndeterminate;
      }
    },
    [isIndeterminate],
  );

  useEffect(() => {
    if (inputRef && hiddenCheckboxRef && hiddenCheckboxRef.current) {
      inputRef(hiddenCheckboxRef.current);
    }
  }, []);

  const { component: Label, ...labelOverrides } = getOverrides('Label');
  const { component: LabelText, ...labelTextOverrides } = getOverrides(
    'LabelText',
  );

  const onFocus = () => setFocused(true);
  const onBlur = () => {
    setActive(isMouseDown && isActive);
    setFocused(false);
  };
  const onMouseDown = () => {
    setActive(true);
    setMouseDown(true);
  };
  const onMouseUp = () => {
    setActive(false);
    setMouseDown(false);
  };
  const onMouseEnter = () => setHovered(true);
  const onMouseLeave = () => {
    setActive(false);
    setHovered(false);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key in actionKeys) {
      setActive(true);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key in actionKeys) {
      setActive(false);
    }
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (isDisabled) return null;
    event.persist();
    if (event.target.checked !== undefined) {
      setChecked(event.target.checked);
    }

    if (propsOnChange) {
      propsOnChange(event);
    }
  };

  const getIsChecked = () =>
    isChecked === undefined ? isInternallyChecked : isChecked;

  return (
    <Theme.Provider value={theme}>
      <GlobalTheme.Consumer>
        {({ mode }: { mode: 'light' | 'dark' }) => (
          <Theme.Consumer mode={mode} tokens={componentTokens}>
            {tokens => (
              <Label
                isDisabled={isDisabled}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                tokens={tokens}
                {...labelOverrides}
              >
                <CheckboxWrapper>
                  <HiddenCheckbox
                    disabled={isDisabled}
                    checked={isChecked}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyUp={onKeyUp}
                    onKeyDown={onKeyDown}
                    type="checkbox"
                    value={value}
                    name={name}
                    ref={hiddenCheckboxRef}
                    required={isRequired}
                    {...rest}
                  />
                  <CheckboxIcon
                    theme={theme}
                    overrides={{
                      IconWrapper: overrides && overrides.IconWrapper,
                      Icon: overrides && overrides.Icon,
                      IconIndeterminate:
                        overrides && overrides.IconIndeterminate,
                    }}
                    isChecked={getIsChecked()}
                    isDisabled={isDisabled}
                    isFocused={isFocused}
                    isActive={isActive}
                    isHovered={isHovered}
                    isInvalid={isInvalid}
                    isIndeterminate={isIndeterminate}
                    primaryColor="inherit"
                    secondaryColor="inherit"
                    label=""
                  />
                </CheckboxWrapper>
                <LabelText {...labelTextOverrides} tokens={tokens}>
                  {label}
                  {isRequired && (
                    <RequiredIndicator tokens={tokens} aria-hidden="true">
                      *
                    </RequiredIndicator>
                  )}
                </LabelText>
              </Label>
            )}
          </Theme.Consumer>
        )}
      </GlobalTheme.Consumer>
    </Theme.Provider>
  );
}

export { Checkbox as CheckboxWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext<CheckboxProps>({
  componentName: 'checkbox',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents<CheckboxProps>({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'checkbox',

      attributes: {
        componentName: 'checkbox',
        packageName,
        packageVersion,
      },
    }),
  })(Checkbox),
);
