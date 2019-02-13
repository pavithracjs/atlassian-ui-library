import { applyPropertyStyle } from '../../../theme';
import { mapAttributesToState } from '../../utils';

const fallbacks = {
  propertyA: 'fallback-propertyA',
  propertyB: 'fallback-propertyB',
};

const themeDefinitions = {
  default: {
    propertyA: {
      default: 'theme-defaultAppearance-propertyA-defaultValue',
      hover: 'theme-defaultAppearance-propertyA-hoverValue',
      active: 'theme-defaultAppearance-propertyA-activeValue',
      selected: 'theme-defaultAppearance-propertyA-selectedValue',
      disabled: 'theme-defaultAppearance-propertyA-disabledValue',
    },
    propertyB: {},
  },
  appearanceB: {
    propertyA: {
      default: 'theme-appearanceB-propertyA-defaultValue',
    },
  },
};

describe('applyPropertyStyle', () => {
  it("should return 'initial' if the property is not defined.", () =>
    expect(applyPropertyStyle('not-a-property', {}, themeDefinitions)).toBe(
      'initial',
    ));

  it('should return the fallback value if there is no default value.', () =>
    expect(applyPropertyStyle('propertyB', {}, themeDefinitions)).toBe(
      fallbacks.propertyB,
    ));

  // it('should use the default appearance if the appearance is not defined.', () =>
  //   expect(
  //     getPropertyAppearance(
  //       'propertyA',
  //       // @ts-ignore
  //       { theme: 'themeB', appearance: 'not-an-appearance' },
  //       themeDefinitions,
  //     ),
  //   ).toBe(theme.default.propertyA.default));

  //   it('should use the default value if the state value is not defined.', () =>
  //     expect(
  //       getPropertyAppearance(
  //         'propertyA',
  //         // @ts-ignore
  //         { appearance: 'appearanceB', isSelected: true },
  //         themeDefinitions,
  //       ),
  //     ).toBe(theme.appearanceB.propertyA.default));
});

describe('mapAttributesToState', () => {
  it("should return the 'hover' value when in the hover state.", () =>
    expect(mapAttributesToState({ isHover: true })).toBe('hover'));

  it("should prioritise 'active' state over 'hover' state.", () =>
    expect(mapAttributesToState({ isActive: true, isHover: true })).toBe(
      'active',
    ));

  it("should prioritise 'selected' state over 'active' and 'hover' states.", () =>
    expect(
      mapAttributesToState({ isActive: true, isHover: true, isSelected: true }),
    ).toBe('selected'));

  it("should prioritise 'disabled' state over all other states.", () =>
    expect(
      mapAttributesToState(
        //TODO check 'disabled' prop as well?
        { isDisabled: true, isActive: true, isHover: true, isSelected: true },
      ),
    ).toBe('disabled'));
});
