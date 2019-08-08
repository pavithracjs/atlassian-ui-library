import * as React from 'react';
import { BitbucketIcon, JiraSoftwareIcon, OpsGenieIcon } from '@atlaskit/logo';
import { mount } from 'enzyme';
import { SwitcherItemWithDropdown } from '../../primitives';
import { createIcon } from '../../utils/icon-themes';

describe('Atlassian Switcher - ItemWithDropdown', () => {
  it('renders Bitbucket snapshot correctly', async () => {
    const Icon = createIcon(BitbucketIcon, { size: 'small' });
    const props = {
      icon: <Icon theme="product" />,
      childIcon: <Icon theme="subtle" />,
      description: null,
      href: 'https://bitbucket.org',
      childItems: [],
      tooltipContent: <span>Show more sites</span>,
    };

    const wrapper = mount(
      <SwitcherItemWithDropdown {...props}>Bitbucket</SwitcherItemWithDropdown>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders single site item correctly', async () => {
    const Icon = createIcon(OpsGenieIcon, { size: 'small' });
    const props = {
      icon: <Icon theme="product" />,
      childIcon: <Icon theme="subtle" />,
      description: 'some-instance',
      href: 'https://app.opsgenie.com',
      childItems: [],
      tooltipContent: <span>Show more sites</span>,
    };

    const wrapper = mount(
      <SwitcherItemWithDropdown {...props}>Opsgenie</SwitcherItemWithDropdown>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders an item with multiple sites correctly and clicking expand shows children sites', async () => {
    const Icon = createIcon(JiraSoftwareIcon, { size: 'small' });
    const props = {
      icon: <Icon theme="product" />,
      childIcon: <Icon theme="subtle" />,
      description: 'some-instance',
      href: 'https://app.opsgenie.com',
      childItems: [
        {
          label: 'site00',
          href:
            'https://site00.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
        },
        {
          label: 'site10',
          href:
            'https://site10.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
        },

        {
          label: 'site30',
          href:
            'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
        },
      ],
      tooltipContent: <span>Show more sites</span>,
    };

    const wrapper = mount(
      <SwitcherItemWithDropdown {...props}>
        Jira Software
      </SwitcherItemWithDropdown>,
    );

    expect(wrapper).toMatchSnapshot();

    const expandToggle = wrapper.find(
      '[data-test-id="switcher-expand-toggle"]',
    );

    // child items are visible after the expand toggle is clicked once
    expandToggle.at(0).simulate('click');
    expect(wrapper).toMatchSnapshot();

    // child items are hidden after the expand toggle is clicked again
    expandToggle.at(0).simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
