import * as React from 'react';
import { shallow } from 'enzyme';
import AtlassianSwitcher from '../../index';

const noop = () => void 0;

describe('Atlassian Switcher', () => {
  it('basic snapshot', () => {
    const switcher = shallow(
      <AtlassianSwitcher
        product="jira"
        cloudId="CLOUD_ID"
        triggerXFlow={noop}
      />,
    );
    expect(switcher).toMatchSnapshot();
  });
});
