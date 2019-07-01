import * as React from 'react';
import { shallow } from 'enzyme';
import AtlassianSwitcher from '../../index';
import JiraSwitcher from '../../components/jira-switcher';
import ConfluenceSwitcher from '../../components/confluence-switcher';
import GenericSwitcher from '../../components/generic-switcher';

const noop = () => void 0;

const renderSpecificTest = (
  testTitle: string,
  product: string,
  Ctor: React.ComponentType<any>,
) => {
  it(testTitle, () => {
    const switcher = shallow(
      <AtlassianSwitcher
        product={product}
        cloudId="CLOUD_ID"
        triggerXFlow={noop}
      />,
    );
    expect(switcher.find(Ctor)).toHaveLength(1);
  });
};

describe('Atlassian Switcher', () => {
  renderSpecificTest(
    'should render correct switcher for `jira`',
    'jira',
    JiraSwitcher,
  );
  renderSpecificTest(
    'should render correct switcher for `confluence`',
    'confluence',
    ConfluenceSwitcher,
  );
  renderSpecificTest(
    'should render correct switcher for `site-admin`',
    'site-admin',
    GenericSwitcher,
  );
  renderSpecificTest(
    'should render correct switcher for `trusted-admin`',
    'trusted-admin',
    GenericSwitcher,
  );
  renderSpecificTest(
    'should render correct switcher for `home`',
    'home',
    GenericSwitcher,
  );
  renderSpecificTest(
    'should render correct switcher for `people`',
    'people',
    GenericSwitcher,
  );
});
