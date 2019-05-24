import { extractInlineViewPropsFromSourceCodePullRequest } from '../../extractPropsFromSourceCodePullRequest';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromSourceCodePullRequest', () => {
  it('should set the icon to the appropriate default icon', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      name: 'title yeee',
    });
    expect(props).toHaveProperty('title', 'title yeee');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('title yeee');
  });

  it('should just set the name properly (with no other information)', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some pr',
    });
    expect(props).toHaveProperty('title', 'some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });

  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some pr',
      'atlassian:internalObjectId': '#190',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo/#190: some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });

  it('should set the name with only repo name (no internal id)', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some pr',
      'atlassian:repositoryName': 'my-repo',
    });
    expect(props).toHaveProperty('title', 'my-repo: some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });

  it('should set the name with only internal id (no repo name)', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some pr',
      'atlassian:internalObjectId': '#190',
    });
    expect(props).toHaveProperty('title', '#190: some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });
});
