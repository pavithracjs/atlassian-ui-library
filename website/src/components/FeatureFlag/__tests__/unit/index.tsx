import React from 'react';
import { mount } from 'enzyme';
import FeatureFlag, {
  LaunchDarklyClientProviderForTesting as Provider,
} from '../../../FeatureFlag';
import { LDClient } from 'ldclient-js';

it('should get feature flag value', () => {
  const variation: any = jest.fn().mockReturnValueOnce(true);
  const children = jest.fn();
  mount(
    <Provider value={(): LDClient => ({ variation } as LDClient)}>
      <FeatureFlag name="my-feature-flag">{children}</FeatureFlag>,
    </Provider>,
  );
  expect(variation).toHaveBeenCalledWith('my-feature-flag', false);
  expect(children).toHaveBeenCalledWith(true);
});

it('should get disabled feature flag by default', () => {
  const variation: any = jest.fn().mockReturnValueOnce(false);
  const children = jest.fn();
  mount(
    <Provider value={(): LDClient => ({ variation } as LDClient)}>
      <FeatureFlag name="my-feature-flag">{children}</FeatureFlag>
    </Provider>,
  );
  expect(variation).toHaveBeenCalledWith('my-feature-flag', false);
  expect(children).toHaveBeenCalledWith(false);
});

it('should get enabled feature flag when enabledByDefault is set', () => {
  const variation: any = jest.fn().mockReturnValueOnce(false);
  const children = jest.fn();
  mount(
    <Provider value={(): LDClient => ({ variation } as LDClient)}>
      <FeatureFlag name="my-feature-flag" enabledByDefault>
        {children}
      </FeatureFlag>
    </Provider>,
  );
  expect(variation).toHaveBeenCalledWith('my-feature-flag', true);
  expect(children).toHaveBeenCalledWith(false);
});
