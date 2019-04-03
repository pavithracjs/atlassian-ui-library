import * as React from 'react';
import { createMatchers } from 'jest-emotion';
import * as renderer from 'react-test-renderer';
import { AtlassianIcon } from '@atlaskit/logo';
import * as emotion from 'emotion';
import Button from '../../Button';
import { ThemeProps } from '../../../types';

type customTheme = { [key: string]: { [key: string]: string | number } };

const customTheme: customTheme = {
  buttonStyles: {
    width: '100px',
    height: '200px',
    margin: '20px',
  },
  spinnerStyles: {
    width: '7px',
  },
};

const baseButtonThemeFunction = () => ({
  buttonStyles: {
    fontSize: 10,
    textAlign: 'center',
    width: 50,
  },
  spinnerStyles: {
    width: '10px',
  },
});

const ThemedButton = (customProps: any) => (
  <Button
    theme={(
      adgTheme: Function,
      { appearance = 'default', state = 'default' }: ThemeProps,
    ) => {
      // Allow tests to re-write ADG theme
      if (customProps.customAdgTheme) {
        adgTheme = customProps.customAdgTheme;
      }
      // Allow tests to skip ADG theme
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
      } = customProps.skipAdgTheme
        ? { buttonStyles: {}, spinnerStyles: {} }
        : adgTheme({ appearance, state });

      const {
        buttonStyles: customButtonStyles,
        spinnerStyles: customSpinnerStyles,
      } = !customProps.customStyling
        ? { buttonStyles: {}, spinnerStyles: {} }
        : customProps.customStyling;

      // Merge themes
      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...customButtonStyles,
        },
        spinnerStyles: {
          ...adgSpinnerStyles,
          ...customSpinnerStyles,
        },
      };
    }}
    {...customProps} // spacing,
  />
);

expect.extend(createMatchers(emotion));

describe('Theme: button', () => {
  it('should render button styles defined in custom theme', () => {
    const wrapper = renderer
      .create(<ThemedButton customStyling={customTheme} />)
      .toJSON();

    // toHaveStyleRules does not allow testing that `only` certain styles are passed in
    Object.keys(customTheme.buttonStyles).forEach(key => {
      expect(wrapper).toHaveStyleRule(key, customTheme.buttonStyles[key]);
    });
  });

  it('should render button styles defined in ADG theme if no custom theme passed in', () => {
    const wrapper = renderer
      .create(<ThemedButton customAdgTheme={baseButtonThemeFunction} />)
      .toJSON();

    // toHaveStyleRules does not allow testing that `only` certain styles are passed in
    expect(wrapper).toHaveStyleRule('font-size', '10px');
    expect(wrapper).toHaveStyleRule('text-align', 'center');
    expect(wrapper).toHaveStyleRule('width', '50px');
  });

  it('should render spinner styles in custom theme', () => {
    const wrapper = renderer
      .create(<ThemedButton isLoading customStyling={customTheme} />)
      .toJSON();

    const parent = wrapper && wrapper.children && wrapper.children[0].children;
    const child = parent && parent[0];

    // toHaveStyleRules does not allow testing that `only` certain styles are passed in
    expect(child).toHaveStyleRule('width', '7px');
  });

  it('should render spinner styles defined in ADG theme if no custom theme passed in', () => {
    const wrapper = renderer
      .create(
        <ThemedButton isLoading customAdgTheme={baseButtonThemeFunction} />,
      )
      .toJSON();

    const parent = wrapper && wrapper.children && wrapper.children[0].children;
    const child = parent && parent[0];

    // toHaveStyleRules does not allow testing that `only` certain styles are passed in
    expect(child).toHaveStyleRule('width', '10px');
  });
});
