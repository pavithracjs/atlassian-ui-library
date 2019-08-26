import { createCustomTheme } from '../theme-builder';
import { CustomizableStates } from '../types';

import get from 'lodash.get';
import * as colors from '@atlaskit/theme/colors';

describe('utils/theme-builder', () => {
  const noopThemeFn = () => ({});

  it('should export a theming function for item and childItem', () => {
    expect(createCustomTheme({})).toHaveProperty('itemTheme');
    expect(createCustomTheme({})).toHaveProperty('childItemTheme');
  });

  it('should enforce that the background of the main item in default state is the same as switcher background', () => {
    const themes = createCustomTheme({
      mainBackgroundColor: 'red',
      item: {
        default: {
          background: 'green',
        },
      },
    });

    const itemTheme = themes.itemTheme(noopThemeFn, {});
    expect(get(itemTheme, 'default.background')).toEqual('red');
  });

  it('should not require all the props', () => {
    const defaultTheme: CustomizableStates = {
      default: {
        background: 'green',
        text: 'white',
        secondaryText: 'gray',
      },
      hover: {
        background: 'blue',
        text: 'yellow',
        secondaryText: 'gray',
      },
    };

    const themes = createCustomTheme({});

    const itemTheme = themes.itemTheme(() => defaultTheme, {});
    const childItemTheme = themes.childItemTheme(() => defaultTheme, {});

    expect(itemTheme).toMatchSnapshot();
    expect(childItemTheme).toMatchSnapshot();
  });

  describe('creating a proper theme', () => {
    const themes = createCustomTheme({
      mainBackgroundColor: colors.R500,
      item: {
        hover: {
          text: colors.N0,
          secondaryText: colors.N30,
        },
        default: {
          text: colors.R500,
          secondaryText: colors.R200,
        },
      },
      childItem: {
        hover: {
          background: colors.R500,
          text: colors.N0,
          secondaryText: colors.N30,
        },
        default: {
          text: colors.R500,
        },
      },
    });

    it('itemTheme should match snapshot', () => {
      const itemTheme = themes.itemTheme(noopThemeFn, {});

      expect(itemTheme).toMatchSnapshot();
    });

    it('childItemTheme should match snapshot', () => {
      const childItemTheme = themes.childItemTheme(noopThemeFn, {});

      expect(childItemTheme).toMatchSnapshot();
    });
  });
});
