export const identity = <T>(p: T): T => p;

export function createExtender<DefaultType, OverridesType>(
  defaults: DefaultType,
  overrides: OverridesType,
) {
  return function getOverrides(key: keyof DefaultType) {
    const {
      cssFn: defaultCssFn,
      attributesFn: defaultAttributesFn,
      component: defaultComponent,
    } = defaults[key];
    if (!overrides || !overrides[key]) {
      return {
        cssFn: defaultCssFn,
        attributesFn: defaultAttributesFn,
        component: defaultComponent,
      };
    }
    const {
      cssFn: customCssFn,
      attributesFn: customAttributesFn,
      component: customComponent,
    } = overrides[key];
    const composedCssFn = <State>(state: State) => {
      return customCssFn(defaultCssFn(state), state);
    };
    return {
      cssFn: customCssFn ? composedCssFn : defaultCssFn,
      attributesFn: customAttributesFn || defaultAttributesFn,
      component: customComponent || defaultComponent,
    };
  };
}
