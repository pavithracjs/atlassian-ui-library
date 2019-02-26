import * as React from 'react';
import Button from '../../Button';
import { ThemeProps } from '../../../types';
import * as Emotion from 'emotion';

import { mount } from 'enzyme';

const customButtonTheme = {
  width: 100,
  height: 200,
  margin: 20,
};

const baseButtonThemeFunction = () => ({
  buttonStyles: {
    fontSize: 10,
    textAlign: 'center',
    width: 50,
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
      const adgButton = customProps.skipAdgTheme
        ? {}
        : adgTheme({ appearance, state }).buttonStyles;

      // Merge themes
      return {
        buttonStyles: {
          ...adgButton,
          ...customProps.customStyling,
        },
      };
    }}
    {...customProps} // spacing,
  />
);

const originalCssFunc = Emotion.css;
Emotion.css = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // Reset to original implementation before each test
  Emotion.css.mockImplementation(originalCssFunc);
});

describe('Theme: button', () => {
  it('should only render styles defined in custom theme if ADG theme not passed in', () => {
    mount(<ThemedButton skipAdgTheme customStyling={customButtonTheme} />);
    expect(Emotion.css).toBeCalledWith(customButtonTheme);
  });

  it('should render only styles defined in ADG theme if no custom theme passed in', () => {
    mount(<ThemedButton customAdgTheme={baseButtonThemeFunction} />);
    expect(Emotion.css).toBeCalledWith(baseButtonThemeFunction().buttonStyles);
  });

  it('should favour custom theme to default ADG theme', () => {
    let renderedTheme = {};
    Emotion.css.mockImplementation(theme => (renderedTheme = theme));
    mount(
      <ThemedButton
        customAdgTheme={baseButtonThemeFunction}
        customStyling={customButtonTheme}
      />,
    );
    expect(renderedTheme).toEqual(
      expect.objectContaining({
        width: 100,
        textAlign: 'center',
      }),
    );
  });

  // TODO re-write these non-functional tests
  // it("should pass interaction state props from the component's state", () => {
  //   const cmp = mount(<Button />);

  //   expect(cmp.find('StyledButton').prop('isActive')).toBe(false);
  //   expect(cmp.find('StyledButton').prop('isFocus')).toBe(false);
  //   expect(cmp.find('StyledButton').prop('isHover')).toBe(false);
  // });
});
